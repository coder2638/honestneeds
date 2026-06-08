import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { campaignService } from '@/api/services/campaignService'

/**
 * Share API Hooks
 * Handles all share-related queries and mutations
 */

// Query Keys
export const shareKeys = {
  all: ['shares'],
  lists: () => [...shareKeys.all, 'list'],
  list: (page: number, limit: number) => [...shareKeys.lists(), { page, limit }],
  stats: () => [...shareKeys.all, 'stats'],
  stat: (campaignId: string) => [...shareKeys.stats(), campaignId],
  budgets: () => [...shareKeys.all, 'budget'],
  budget: (campaignId: string) => [...shareKeys.budgets(), campaignId],
}

/**
 * Record a share for a campaign
 * POST /campaigns/{id}/share
 */
export function useRecordShare() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      campaignId,
      channel,
    }: {
      campaignId: string
      channel: 'facebook' | 'twitter' | 'linkedin' | 'email' | 'whatsapp' | 'link'
    }) => {
      return campaignService.recordShare(campaignId, channel)
    },
    onSuccess: (data, variables) => {
      // Invalidate shares list
      queryClient.invalidateQueries({
        queryKey: shareKeys.lists(),
      })

      // Invalidate campaign share stats
      queryClient.invalidateQueries({
        queryKey: shareKeys.stat(variables.campaignId),
      })

      // Invalidate campaign metrics
      queryClient.invalidateQueries({
        queryKey: ['campaigns', variables.campaignId],
      })
    },
    onError: (error: any) => {
      console.error('Failed to record share:', error)
    },
  })
}

/**
 * Get user's shares
 * GET /shares
 */
export function useShares(page: number = 1, limit: number = 25) {
  return useQuery({
    queryKey: shareKeys.list(page, limit),
    queryFn: () => campaignService.getShares(page, limit),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
  })
}

/**
 * Get campaign share statistics
 * GET /campaigns/{id}/share-stats
 */
export function useCampaignShareStats(campaignId: string | null) {
  return useQuery({
    queryKey: shareKeys.stat(campaignId || ''),
    queryFn: () => {
      if (!campaignId) throw new Error('Campaign ID is required')
      return campaignService.getCampaignShareStats(campaignId)
    },
    enabled: !!campaignId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
  })
}

/**
 * Get campaign share budget
 * GET /campaigns/{id}/share-budget
 */
export function useCampaignShareBudget(campaignId: string | null) {
  return useQuery({
    queryKey: shareKeys.budget(campaignId || ''),
    queryFn: () => {
      if (!campaignId) throw new Error('Campaign ID is required')
      return campaignService.getCampaignShareBudget(campaignId)
    },
    enabled: !!campaignId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
  })
}

/**
 * Refetch shares list
 */
export function useRefreshShares() {
  const queryClient = useQueryClient()

  return {
    refetch: () => {
      return queryClient.invalidateQueries({
        queryKey: shareKeys.lists(),
      })
    },
  }
}
