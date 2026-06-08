'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { sweepstakesService, type SweepstakesEntry } from '@/api/services/sweepstakesService'
import type { DonationPaymentMethod } from '@/utils/validationSchemas'
import { useToast } from '@/hooks/useToast'

/**
 * Sweepstakes Hooks
 * - useMyEntries: Fetch user's sweepstakes entries and current drawing
 * - useCampaignEntries: Fetch sweepstakes entries for a campaign
 * - useCurrentDrawing: Fetch current drawing info
 * - useMyWinnings: Fetch user's past winnings
 * - useLeaderboard: Fetch current drawing leaderboard
 * - useClaimPrize: Claim a prize mutation
 * - useAdminStats: Fetch admin sweepstakes dashboard
 * - useDrawingsHistory: Fetch past drawings (admin)
 * - useDrawingDetails: Fetch specific drawing details (admin)
 * - useForceDrawing: Force a drawing mutation (admin)
 * - useWinnerNotification: Check if user has won
 */

// Query key factory for consistent cache management
const sweepstakesKeys = {
  all: ['sweepstakes'],
  entries: () => [...sweepstakesKeys.all, 'entries'],
  myEntries: () => [...sweepstakesKeys.entries(), 'my'],
  campaignEntries: (campaignId: string) => [
    ...sweepstakesKeys.entries(),
    'campaign',
    campaignId,
  ],
  drawings: () => [...sweepstakesKeys.all, 'drawings'],
  currentDrawing: () => [...sweepstakesKeys.drawings(), 'current'],
  winnings: () => [...sweepstakesKeys.all, 'winnings'],
  myWinnings: () => [...sweepstakesKeys.winnings(), 'my'],
  leaderboard: () => [...sweepstakesKeys.all, 'leaderboard'],
  admin: () => [...sweepstakesKeys.all, 'admin'],
  adminStats: () => [...sweepstakesKeys.admin(), 'stats'],
  drawingsHistory: () => [...sweepstakesKeys.admin(), 'history'],
  drawingDetail: (id: string) => [...sweepstakesKeys.admin(), 'detail', id],
  notification: () => [...sweepstakesKeys.all, 'notification'],
}

// ============================================
// USE MY ENTRIES - Get user's sweepstakes info
// ============================================
export function useMyEntries() {
  console.log('🪝 [useMyEntries] Hook initialized')
  return useQuery({
    queryKey: sweepstakesKeys.myEntries(),
    queryFn: async () => {
      console.log('🔍 [useMyEntries] queryFn called')
      try {
        const result = await sweepstakesService.getMyEntries()
        console.log('✅ [useMyEntries] Query succeeded:', result)
        return result
      } catch (error) {
        console.error('❌ [useMyEntries] Query failed:', error)
        throw error
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
    refetchInterval: 10 * 60 * 1000, // Refetch every 10 minutes
  })
}

// ============================================
// USE CAMPAIGN ENTRIES - Get entries for campaign
// ============================================
export function useCampaignEntries(campaignId: string | undefined) {
  return useQuery({
    queryKey: sweepstakesKeys.campaignEntries(campaignId || ''),
    queryFn: async () => {
      try {
        return await sweepstakesService.getCampaignSweepstakesEntries(campaignId!)
      } catch (error) {
        console.error('Failed to fetch campaign sweepstakes entries:', error)
        // Return default empty structure instead of throwing
        return {
          entries: {
            campaignCreation: 0,
            donations: 0,
            donationAmount: 0,
            shares: 0,
            total: 0,
          },
          currentDrawing: {
            id: '',
            targetDate: new Date().toISOString(),
            prize: 0,
            winners: 0,
            currentEntries: 0,
            status: 'pending' as const,
            createdAt: new Date().toISOString(),
          },
        }
      }
    },
    enabled: !!campaignId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
  })
}

// ============================================
// USE CURRENT DRAWING - Get current drawing info
// ============================================
export function useCurrentDrawing() {
  console.log('🪝 [useCurrentDrawing] Hook initialized')
  return useQuery({
    queryKey: sweepstakesKeys.currentDrawing(),
    queryFn: async () => {
      console.log('🔍 [useCurrentDrawing] queryFn called')
      try {
        const result = await sweepstakesService.getCurrentDrawing()
        console.log('✅ [useCurrentDrawing] Query succeeded:', result)
        return result
      } catch (error) {
        console.error('❌ [useCurrentDrawing] Query failed:', error)
        throw error
      }
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    refetchInterval: 15 * 60 * 1000, // Refetch every 15 minutes
  })
}

// ============================================
// USE MY WINNINGS - Get past winnings
// ============================================
export function useMyWinnings(page: number = 1, limit: number = 10) {
  return useQuery({
    queryKey: [...sweepstakesKeys.myWinnings(), { page, limit }],
    queryFn: () => sweepstakesService.getMyWinnings(page, limit),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
  })
}

// ============================================
// USE LEADERBOARD - Get current leaderboard
// ============================================
export function useLeaderboard(limit: number = 10) {
  return useQuery({
    queryKey: [...sweepstakesKeys.leaderboard(), { limit }],
    queryFn: () => sweepstakesService.getLeaderboard(limit),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
    refetchInterval: 10 * 60 * 1000, // Refetch every 10 minutes
  })
}

// ============================================
// USE CLAIM PRIZE - Mutation to claim prize
// ============================================
export function useClaimPrize() {
  const queryClient = useQueryClient()
  const { showToast } = useToast()

  return useMutation({
    mutationFn: (params: {
      winningId: string
      paymentMethod: DonationPaymentMethod
    }) => sweepstakesService.claimPrize(params.winningId, params.paymentMethod),
    onSuccess: (data) => {
      // Invalidate winnings query
      queryClient.invalidateQueries({
        queryKey: sweepstakesKeys.myWinnings(),
      })

      // Invalidate main entries query
      queryClient.invalidateQueries({
        queryKey: sweepstakesKeys.myEntries(),
      })

      showToast({
        type: 'success',
        title: 'Prize Claimed!',
        message: `Your prize has been claimed. Transaction ID: ${data.transactionId}`,
        duration: 5000,
      })
    },
    onError: (error: any) => {
      showToast({
        type: 'error',
        title: 'Claim Failed',
        message:
          error.response?.data?.message || 'Failed to claim prize. Please try again.',
        duration: 5000,
      })
    },
  })
}

// ============================================
// USE ADMIN STATS - Get admin dashboard stats
// ============================================
export function useAdminStats() {
  return useQuery({
    queryKey: sweepstakesKeys.adminStats(),
    queryFn: () => sweepstakesService.getAdminStats(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
    refetchInterval: 10 * 60 * 1000, // Refetch every 10 minutes
  })
}

// ============================================
// USE DRAWINGS HISTORY - Get past drawings (admin)
// ============================================
export function useDrawingsHistory(page: number = 1, limit: number = 10) {
  return useQuery({
    queryKey: [...sweepstakesKeys.drawingsHistory(), { page, limit }],
    queryFn: () => sweepstakesService.getDrawingsHistory(page, limit),
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  })
}

// ============================================
// USE DRAWING DETAILS - Get specific drawing (admin)
// ============================================
export function useDrawingDetails(drawingId: string | undefined) {
  return useQuery({
    queryKey: sweepstakesKeys.drawingDetail(drawingId || ''),
    queryFn: () => sweepstakesService.getDrawingDetails(drawingId!),
    enabled: !!drawingId,
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  })
}

// ============================================
// USE FORCE DRAWING - Force a drawing (admin)
// ============================================
export function useForceDrawing() {
  const queryClient = useQueryClient()
  const { showToast } = useToast()

  return useMutation({
    mutationFn: (drawingId: string) => sweepstakesService.forceDrawing(drawingId),
    onSuccess: (data, drawingId) => {
      // Invalidate admin queries
      queryClient.invalidateQueries({
        queryKey: sweepstakesKeys.adminStats(),
      })

      queryClient.invalidateQueries({
        queryKey: sweepstakesKeys.drawingsHistory(),
      })

      queryClient.invalidateQueries({
        queryKey: sweepstakesKeys.drawingDetail(drawingId),
      })

      showToast({
        type: 'success',
        title: 'Drawing Executed',
        message: 'Drawing has been executed successfully.',
        duration: 5000,
      })
    },
    onError: (error: any) => {
      showToast({
        type: 'error',
        title: 'Drawing Failed',
        message:
          error.response?.data?.message || 'Failed to execute drawing. Please try again.',
        duration: 5000,
      })
    },
  })
}

// ============================================
// USE CREATE DRAWING - Create a new drawing (admin)
// ============================================
export function useCreateDrawing() {
  const queryClient = useQueryClient()
  const { showToast } = useToast()

  return useMutation({
    mutationFn: (data: {
      title: string
      description?: string
      prizeAmount: number
      drawDate: string
      winnersCount: number
    }) => sweepstakesService.createDrawing(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: sweepstakesKeys.adminStats(),
      })

      queryClient.invalidateQueries({
        queryKey: sweepstakesKeys.drawingsHistory(),
      })

      showToast({
        type: 'success',
        title: 'Drawing Created',
        message: 'New drawing has been created successfully.',
        duration: 5000,
      })
    },
    onError: (error: any) => {
      showToast({
        type: 'error',
        title: 'Creation Failed',
        message:
          error.response?.data?.message || 'Failed to create drawing. Please try again.',
        duration: 5000,
      })
    },
  })
}

// ============================================
// USE UPDATE DRAWING - Update drawing (admin)
// ============================================
export function useUpdateDrawing() {
  const queryClient = useQueryClient()
  const { showToast } = useToast()

  return useMutation({
    mutationFn: (params: {
      drawingId: string
      data: {
        title?: string
        description?: string
        prizeAmount?: number
        drawDate?: string
        winnersCount?: number
      }
    }) => sweepstakesService.updateDrawing(params.drawingId, params.data),
    onSuccess: (responseData, variables) => {
      queryClient.invalidateQueries({
        queryKey: sweepstakesKeys.adminStats(),
      })

      queryClient.invalidateQueries({
        queryKey: sweepstakesKeys.drawingsHistory(),
      })

      queryClient.invalidateQueries({
        queryKey: sweepstakesKeys.drawingDetail(variables.drawingId),
      })

      showToast({
        type: 'success',
        title: 'Drawing Updated',
        message: 'Drawing has been updated successfully.',
        duration: 5000,
      })
    },
    onError: (error: any) => {
      showToast({
        type: 'error',
        title: 'Update Failed',
        message:
          error.response?.data?.message || 'Failed to update drawing. Please try again.',
        duration: 5000,
      })
    },
  })
}

// ============================================
// USE DELETE DRAWING - Delete drawing (admin)
// ============================================
export function useDeleteDrawing() {
  const queryClient = useQueryClient()
  const { showToast } = useToast()

  return useMutation({
    mutationFn: (drawingId: string) => sweepstakesService.deleteDrawing(drawingId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: sweepstakesKeys.adminStats(),
      })

      queryClient.invalidateQueries({
        queryKey: sweepstakesKeys.drawingsHistory(),
      })

      showToast({
        type: 'success',
        title: 'Drawing Deleted',
        message: 'Drawing has been deleted successfully.',
        duration: 5000,
      })
    },
    onError: (error: any) => {
      showToast({
        type: 'error',
        title: 'Deletion Failed',
        message:
          error.response?.data?.message || 'Failed to delete drawing. Please try again.',
        duration: 5000,
      })
    },
  })
}

// ============================================
// USE WINNER NOTIFICATION - Check if user won
// ============================================
export function useWinnerNotification() {
  return useQuery({
    queryKey: sweepstakesKeys.notification(),
    queryFn: () => sweepstakesService.getWinnerNotification(),
    staleTime: Infinity, // Don't auto-refetch
    gcTime: 60 * 60 * 1000, // 60 minutes
    retry: false,
  })
}

// ============================================
// USE RECORD ENTRY - Record sweepstakes entry
// ============================================
export function useRecordEntry() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (params: {
      userId: string
      entryType: 'campaign_creation' | 'donation' | 'share'
      count?: number
      campaignId?: string
    }) =>
      sweepstakesService.recordEntry(
        params.userId,
        params.entryType,
        params.count,
        params.campaignId
      ),
    onSuccess: () => {
      // Invalidate entries queries when new entry is recorded
      queryClient.invalidateQueries({
        queryKey: sweepstakesKeys.myEntries(),
      })

      queryClient.invalidateQueries({
        queryKey: sweepstakesKeys.leaderboard(),
      })
    },
  })
}
