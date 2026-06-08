'use client'

import { useEffect, useCallback, useRef } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { io, Socket } from 'socket.io-client'

/**
 * WebSocket hooks for real-time updates
 * Replaces polling with event-driven updates
 */

let socketInstance: Socket | null = null

const getSocketInstance = (token: string, url?: string) => {
  if (!socketInstance) {
    const baseUrl = url || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

    socketInstance = io(baseUrl, {
      auth: {
        token,
      },
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
      transports: ['websocket', 'polling'],
    })

    socketInstance.on('connect', () => {
      console.log('🔌 WebSocket connected:', socketInstance?.id)
    })

    socketInstance.on('connect_error', (error) => {
      console.error('🔌 WebSocket connection error:', error)
    })

    socketInstance.on('disconnect', (reason) => {
      console.log('🔌 WebSocket disconnected:', reason)
    })
  }

  return socketInstance
}

/**
 * Hook: Subscribe to creator donations updates
 * Replaces: GET /donations/my-donations polling (5 seconds)
 */
export function useCreatorDonationUpdates(enabled: boolean = true) {
  const queryClient = useQueryClient()
  const socketRef = useRef<Socket | null>(null)
  const isSubscribedRef = useRef(false)

  useEffect(() => {
    if (!enabled) return

    // Get auth token from localStorage
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null
    if (!token) return

    // Initialize socket
    const socket = getSocketInstance(token)
    socketRef.current = socket

    // Subscribe to donations updates
    if (!isSubscribedRef.current) {
      socket.emit('subscribe:creator-donations')
      isSubscribedRef.current = true
    }

    // Listen for donation verified event
    const handleDonationVerified = (event: any) => {
      console.log('📬 Donation verified event received:', event)

      // Invalidate cache to trigger fresh fetch
      queryClient.invalidateQueries({
        queryKey: ['myDonations'],
      })

      // Show notification
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('💰 Payment Verified!', {
          body: `${event.data.donor_name} payment has been verified. $${(event.data.amount_creator_cents / 100).toFixed(2)} incoming!`,
          icon: '/icon-verified.png',
        })
      }
    }

    // Listen for donation failed event
    const handleDonationFailed = (event: any) => {
      console.log('❌ Donation failed event received:', event)

      // Invalidate cache
      queryClient.invalidateQueries({
        queryKey: ['myDonations'],
      })

      // Show notification
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('⚠️ Payment Failed', {
          body: `Donation from ${event.data.donor_name} could not be verified. Reason: ${event.data.failed_reason || 'Unknown'}`,
          icon: '/icon-failed.png',
        })
      }
    }

    socket.on('donation:verified', handleDonationVerified)
    socket.on('donation:failed', handleDonationFailed)

    return () => {
      socket.off('donation:verified', handleDonationVerified)
      socket.off('donation:failed', handleDonationFailed)
    }
  }, [enabled, queryClient])
}

/**
 * Hook: Subscribe to admin verification queue updates
 * Real-time pending donations count for admin dashboard
 */
export function useAdminVerificationQueue(enabled: boolean = true) {
  const queryClient = useQueryClient()
  const socketRef = useRef<Socket | null>(null)
  const isSubscribedRef = useRef(false)

  useEffect(() => {
    if (!enabled) return

    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null
    if (!token) return

    const socket = getSocketInstance(token)
    socketRef.current = socket

    // Subscribe to admin queue
    if (!isSubscribedRef.current) {
      socket.emit('subscribe:admin-queue')
      isSubscribedRef.current = true
    }

    // Listen for pending donations updated event
    const handlePendingUpdated = (event: any) => {
      console.log('📊 Pending donations updated:', event)

      // Invalidate admin pending donations cache
      queryClient.invalidateQueries({
        queryKey: ['pendingDonations'],
      })
    }

    socket.on('admin:pending-updated', handlePendingUpdated)

    return () => {
      socket.off('admin:pending-updated', handlePendingUpdated)
    }
  }, [enabled, queryClient])
}

/**
 * Hook: Subscribe to payout status updates
 * Real-time payout notifications for creators
 */
export function usePayoutUpdates(enabled: boolean = true) {
  const queryClient = useQueryClient()
  const socketRef = useRef<Socket | null>(null)
  const isSubscribedRef = useRef(false)

  useEffect(() => {
    if (!enabled) return

    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null
    if (!token) return

    const socket = getSocketInstance(token)
    socketRef.current = socket

    // Subscribe to payout updates
    if (!isSubscribedRef.current) {
      socket.emit('subscribe:payouts')
      isSubscribedRef.current = true
    }

    // Listen for payout status updated event
    const handlePayoutStatusUpdated = (event: any) => {
      console.log('💳 Payout status updated:', event)

      queryClient.invalidateQueries({
        queryKey: ['myPayouts'],
      })
    }

    // Listen for payout processed event
    const handlePayoutProcessed = (event: any) => {
      console.log('✅ Payout processed:', event)

      queryClient.invalidateQueries({
        queryKey: ['myPayouts'],
      })

      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('💰 Payout Processed!', {
          body: `Your payout of $${(event.data.amount_cents / 100).toFixed(2)} has been sent to your account.`,
          icon: '/icon-payout.png',
        })
      }
    }

    socket.on('payout:status-updated', handlePayoutStatusUpdated)
    socket.on('payout:processed', handlePayoutProcessed)

    return () => {
      socket.off('payout:status-updated', handlePayoutStatusUpdated)
      socket.off('payout:processed', handlePayoutProcessed)
    }
  }, [enabled, queryClient])
}

/**
 * Hook: Subscribe to real-time analytics for specific campaign
 * Real-time dashboard updates for campaign analytics
 */
export function useAnalyticsUpdates(campaignId: string, enabled: boolean = true) {
  const queryClient = useQueryClient()
  const socketRef = useRef<Socket | null>(null)
  const isSubscribedRef = useRef(false)

  useEffect(() => {
    if (!enabled || !campaignId) return

    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null
    if (!token) return

    const socket = getSocketInstance(token)
    socketRef.current = socket

    // Subscribe to campaign analytics
    if (!isSubscribedRef.current) {
      socket.emit('subscribe:analytics', campaignId)
      isSubscribedRef.current = true
    }

    // Listen for analytics updated event
    const handleAnalyticsUpdated = (event: any) => {
      console.log('📈 Analytics updated:', event)

      // Invalidate campaign analytics cache
      queryClient.invalidateQueries({
        queryKey: ['campaignAnalytics', campaignId],
      })
    }

    socket.on('analytics:updated', handleAnalyticsUpdated)

    return () => {
      socket.off('analytics:updated', handleAnalyticsUpdated)
    }
  }, [campaignId, enabled, queryClient])
}

/**
 * Hook: Subscribe to general notifications
 * Real-time system notifications
 */
export function useNotifications() {
  const notificationCallbacks = useRef<Map<string, (data: any) => void>>(new Map())

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null
    if (!token) return

    const socket = getSocketInstance(token)

    // Listen for notifications
    const handleNotification = (event: any) => {
      console.log('🔔 Notification received:', event)

      // Call registered callbacks
      notificationCallbacks.current.forEach((callback) => {
        try {
          callback(event)
        } catch (error) {
          console.error('Error in notification callback:', error)
        }
      })
    }

    socket.on('notification', handleNotification)

    return () => {
      socket.off('notification', handleNotification)
    }
  }, [])

  // Method to register notification callback
  const subscribe = useCallback((id: string, callback: (data: any) => void) => {
    notificationCallbacks.current.set(id, callback)
    return () => {
      notificationCallbacks.current.delete(id)
    }
  }, [])

  return { subscribe }
}

/**
 * Hook: Manual socket connection control
 * For components that need direct socket access
 */
export function useSocket() {
  const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null
  const socket = token ? getSocketInstance(token) : null

  const emit = useCallback(
    (event: string, data?: any) => {
      if (socket) {
        socket.emit(event, data)
      }
    },
    [socket]
  )

  const on = useCallback(
    (event: string, callback: (...args: any[]) => void) => {
      if (!socket) return

      socket.on(event, callback)

      return () => {
        socket.off(event, callback)
      }
    },
    [socket]
  )

  return {
    socket,
    emit,
    on,
    isConnected: socket?.connected || false,
  }
}

/**
 * Hook: Request notifications permission
 */
export function useNotificationPermission() {
  const requestPermission = useCallback(async () => {
    if (!('Notification' in window)) {
      console.warn('This browser does not support notifications')
      return false
    }

    if (Notification.permission === 'granted') {
      return true
    }

    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission()
      return permission === 'granted'
    }

    return false
  }, [])

  return { requestPermission }
}
