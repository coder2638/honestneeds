'use client'

/**
 * useWebSocket Hook
 * Real-time WebSocket connection for notifications and activity updates
 * Handles connection, reconnection, message handling, and cleanup
 */

import { useEffect, useRef, useCallback, useState } from 'react'
import { useAuthStore } from '@/store/authStore'

export interface WebSocketMessage {
  type: string
  data: any
  timestamp: string
}

export interface UseWebSocketOptions {
  enabled?: boolean
  reconnectAttempts?: number
  reconnectDelay?: number
  onMessage?: (message: WebSocketMessage) => void
  onConnect?: () => void
  onDisconnect?: () => void
  onError?: (error: Error) => void
}

export function useWebSocket(options: UseWebSocketOptions = {}) {
  const {
    enabled = true,
    reconnectAttempts = 5,
    reconnectDelay = 3000,
    onMessage,
    onConnect,
    onDisconnect,
    onError,
  } = options

  const { user } = useAuthStore()
  const wsRef = useRef<WebSocket | null>(null)
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const reconnectCountRef = useRef(0)
  const [isConnected, setIsConnected] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const connect = useCallback(() => {
    if (!enabled || !user?.id) return
    if (wsRef.current?.readyState === WebSocket.OPEN) return

    try {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
      const wsUrl = `${protocol}//${window.location.host}/api/notifications?token=${user.id}`

      wsRef.current = new WebSocket(wsUrl)

      wsRef.current.onopen = () => {
        console.log('✅ WebSocket connected')
        setIsConnected(true)
        reconnectCountRef.current = 0
        onConnect?.()
      }

      wsRef.current.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data)
          console.log('📨 WebSocket message:', message)
          onMessage?.(message)
        } catch (err) {
          console.error('❌ Error parsing WebSocket message:', err)
        }
      }

      wsRef.current.onerror = (event) => {
        console.error('❌ WebSocket error:', event)
        const err = new Error('WebSocket error occurred')
        setError(err)
        onError?.(err)
      }

      wsRef.current.onclose = () => {
        console.log('❌ WebSocket disconnected')
        setIsConnected(false)
        onDisconnect?.()

        // Attempt reconnection
        if (reconnectCountRef.current < reconnectAttempts) {
          reconnectCountRef.current++
          reconnectTimeoutRef.current = setTimeout(() => {
            console.log(
              `🔄 Reconnecting WebSocket (attempt ${reconnectCountRef.current}/${reconnectAttempts})...`
            )
            connect()
          }, reconnectDelay * reconnectCountRef.current)
        }
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err))
      console.error('❌ Error connecting WebSocket:', error)
      setError(error)
      onError?.(error)
    }
  }, [enabled, user?.id, onMessage, onConnect, onDisconnect, onError, reconnectAttempts, reconnectDelay])

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current)
    }
    if (wsRef.current) {
      wsRef.current.close()
      wsRef.current = null
    }
    setIsConnected(false)
  }, [])

  const send = useCallback(
    (message: Omit<WebSocketMessage, 'timestamp'>) => {
      if (!isConnected || !wsRef.current) {
        console.warn('⚠️ WebSocket not connected')
        return
      }

      try {
        wsRef.current.send(
          JSON.stringify({
            ...message,
            timestamp: new Date().toISOString(),
          })
        )
      } catch (err) {
        console.error('❌ Error sending WebSocket message:', err)
      }
    },
    [isConnected]
  )

  useEffect(() => {
    connect()

    return () => {
      disconnect()
    }
  }, [connect, disconnect])

  return {
    isConnected,
    error,
    send,
    disconnect,
  }
}
