'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { campaignService } from '@/api/services/campaignService'
import type { CampaignFilters } from '@/store/filterStore'

/**
 * Campaign Hooks
 * - useCampaigns: Fetch campaign list with filters
 * - useCampaign: Fetch single campaign details
 * - useCampaignAnalytics: Fetch campaign analytics
 * - useTrendingCampaigns: Fetch trending campaigns
 * - useRelatedCampaigns: Fetch campaigns by type
 * - useRecordShare: Record campaign share
 * - useNeedTypes: Fetch available need types
 */

// Query key factory for consistent cache management
const campaignKeys = {
  all: ['campaigns'],
  lists: () => [...campaignKeys.all, 'list'],
  list: (page: number, limit: number, filters?: Partial<CampaignFilters>) => [
    ...campaignKeys.lists(),
    { page, limit, ...filters },
  ],
  details: () => [...campaignKeys.all, 'detail'],
  detail: (id: string) => [...campaignKeys.details(), id],
  analytics: () => [...campaignKeys.all, 'analytics'],
  analyticsDetail: (id: string) => [...campaignKeys.analytics(), id],
  trending: () => [...campaignKeys.all, 'trending'],
  related: (needType: string) => [...campaignKeys.all, 'related', needType],
  needTypes: () => [...campaignKeys.all, 'needTypes'],
}

// ============================================
// USE CAMPAIGNS - Campaign list with filters
// ============================================
export function useCampaigns(
  page: number = 1,
  limit: number = 12,
  filters?: Partial<CampaignFilters>
) {
  return useQuery({
    queryKey: campaignKeys.list(page, limit, filters),
    queryFn: () => campaignService.getCampaigns(page, limit, filters),
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes garbage collection
    placeholderData: (previousData) => previousData,
  })
}

// ============================================
// USE CAMPAIGN - Single campaign detail
// ============================================
export function useCampaign(id: string | undefined) {
  if (typeof process !== 'undefined' && process.env.NODE_ENV === 'production' && !id) {
    console.log('🔍 [useCampaign] ⚠️ Hook called with undefined ID during production build');
  }
  return useQuery({
    queryKey: campaignKeys.detail(id || ''),
    queryFn: () => {
      if (!id) throw new Error('useCampaign: ID is undefined - this should not execute if enabled is false');
      return campaignService.getCampaign(id);
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes garbage collection
    retry: 1,
  })
}

// ============================================
// USE CAMPAIGN ANALYTICS - Real-time metrics
// ============================================
export function useCampaignAnalytics(id: string | undefined) {
  return useQuery({
    queryKey: campaignKeys.analyticsDetail(id || ''),
    queryFn: async () => {
      console.log('🔄 [Hook] useCampaignAnalytics: Starting query', { campaignId: id })
      try {
        const result = await campaignService.getCampaignAnalytics(id!)
        console.log('✅ [Hook] useCampaignAnalytics: Query succeeded', {
          campaignId: id,
          dataKeys: Object.keys(result || {}),
        })
        return result
      } catch (error: any) {
        console.error('❌ [Hook] useCampaignAnalytics: Query failed', {
          campaignId: id,
          error: error.message,
        })
        throw error
      }
    },
    enabled: !!id,
    staleTime: 3 * 60 * 1000, // 3 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes garbage collection
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
    retry: 1,
  })
}

// ============================================
// USE TRENDING CAMPAIGNS
// ============================================
export function useTrendingCampaigns(limit: number = 6) {
  return useQuery({
    queryKey: campaignKeys.trending(),
    queryFn: () => campaignService.getTrendingCampaigns(limit),
    staleTime: 15 * 60 * 1000, // 15 minutes
    gcTime: 60 * 60 * 1000, // 60 minutes garbage collection
  })
}

// ============================================
// USE RELATED CAMPAIGNS
// ============================================
export function useRelatedCampaigns(
  excludeId: string,
  needType: string,
  limit: number = 3
) {
  return useQuery({
    queryKey: campaignKeys.related(needType),
    queryFn: () => campaignService.getRelatedCampaigns(excludeId, needType, limit),
    enabled: !!excludeId && !!needType, // Only run when both excludeId and needType are provided
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes garbage collection
  })
}

// ============================================
// USE RECORD SHARE - Record campaign share
// ============================================
export function useRecordShare() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      campaignId,
      channel,
    }: {
      campaignId: string
      channel: 'facebook' | 'twitter' | 'linkedin' | 'email' | 'whatsapp' | 'link'
    }) => campaignService.recordShare(campaignId, channel),
    onSuccess: (data, variables) => {
      // Invalidate campaign analytics to refresh share count
      queryClient.invalidateQueries({
        queryKey: campaignKeys.analyticsDetail(variables.campaignId),
      })
      // Invalidate campaign detail
      queryClient.invalidateQueries({
        queryKey: campaignKeys.detail(variables.campaignId),
      })
    },
  })
}

// ============================================
// USE NEED TYPES - Filter options
// ============================================
export function useNeedTypes() {
  return useQuery({
    queryKey: campaignKeys.needTypes(),
    queryFn: () => campaignService.getNeedTypes(),
    staleTime: 60 * 60 * 1000, // 1 hour
    gcTime: 24 * 60 * 60 * 1000, // 24 hours garbage collection
  })
}

// ============================================
// Invalidation helpers
// ============================================
export function useInvalidateCampaigns() {
  const queryClient = useQueryClient()

  return {
    invalidateList: () =>
      queryClient.invalidateQueries({
        queryKey: campaignKeys.lists(),
      }),
    invalidateDetail: (id: string) =>
      queryClient.invalidateQueries({
        queryKey: campaignKeys.detail(id),
      }),
    invalidateAnalytics: (id: string) =>
      queryClient.invalidateQueries({
        queryKey: campaignKeys.analyticsDetail(id),
      }),
    invalidateAll: () =>
      queryClient.invalidateQueries({
        queryKey: campaignKeys.all,
      }),
  }
}

// ============================================
// USE CREATE CAMPAIGN - Create new campaign
// ============================================
export function useCreateCampaign() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ data, imageFile }: { data: any; imageFile?: File }) =>
      campaignService.createCampaign(data, imageFile),
    onSuccess: (result) => {
      // Invalidate campaign lists to refresh
      queryClient.invalidateQueries({
        queryKey: campaignKeys.lists(),
      })
      // Cache the newly created campaign detail
      queryClient.setQueryData(campaignKeys.detail(result.id), result.campaign)
    },
  })
}

// ============================================
// USE UPDATE CAMPAIGN - Update draft campaign
// ============================================
export function useUpdateCampaign() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      data,
      imageFile,
    }: {
      id: string
      data: any
      imageFile?: File
    }) => campaignService.updateCampaign(id, data, imageFile),
    onSuccess: (result, variables) => {
      // Update campaign detail cache
      queryClient.setQueryData(campaignKeys.detail(variables.id), result)
      // Invalidate lists to refresh status changes
      queryClient.invalidateQueries({
        queryKey: campaignKeys.lists(),
      })
    },
  })
}

// ============================================
// USE PUBLISH CAMPAIGN - Activate draft
// ============================================
export function usePublishCampaign() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => campaignService.publishCampaign(id),
    onSuccess: (result, id) => {
      // Update campaign detail cache
      queryClient.setQueryData(campaignKeys.detail(id), result)
      // Invalidate lists to refresh status
      queryClient.invalidateQueries({
        queryKey: campaignKeys.lists(),
      })
    },
  })
}

// ============================================
// USE PAUSE CAMPAIGN
// ============================================
export function usePauseCampaign() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => campaignService.pauseCampaign(id),
    onSuccess: (result, id) => {
      // Update campaign detail cache
      queryClient.setQueryData(campaignKeys.detail(id), result)
      // Invalidate lists to refresh status
      queryClient.invalidateQueries({
        queryKey: campaignKeys.lists(),
      })
    },
  })
}

// ============================================
// USE UNPAUSE CAMPAIGN - Resume paused
// ============================================
export function useUnpauseCampaign() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => campaignService.unpauseCampaign(id),
    onSuccess: (result, id) => {
      // Update campaign detail cache
      queryClient.setQueryData(campaignKeys.detail(id), result)
      // Invalidate lists to refresh status
      queryClient.invalidateQueries({
        queryKey: campaignKeys.lists(),
      })
    },
  })
}

// ============================================
// USE COMPLETE CAMPAIGN
// ============================================
export function useCompleteCampaign() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => campaignService.completeCampaign(id),
    onSuccess: (result, id) => {
      // Update campaign detail cache
      queryClient.setQueryData(campaignKeys.detail(id), result)
      // Invalidate lists to refresh status
      queryClient.invalidateQueries({
        queryKey: campaignKeys.lists(),
      })
    },
  })
}

// ============================================
// USE DELETE CAMPAIGN
// ============================================
export function useDeleteCampaign() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => campaignService.deleteCampaign(id),
    onSuccess: (_, id) => {
      // Remove from cache
      queryClient.removeQueries({
        queryKey: campaignKeys.detail(id),
      })
      // Invalidate lists to refresh
      queryClient.invalidateQueries({
        queryKey: campaignKeys.lists(),
      })
    },
  })
}

// ============================================
// USE REQUEST BUDGET RELOAD
// ============================================
export function useRequestBudgetReload() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      campaignId,
      amount,
    }: {
      campaignId: string
      amount: number
    }) => campaignService.requestBudgetReload(campaignId, amount),
    onSuccess: (_, variables) => {
      // Invalidate share budget cache
      queryClient.invalidateQueries({
        queryKey: ['share-budget', variables.campaignId],
      })
    },
  })
}

// ============================================
// USE INCREASE GOAL
// ============================================
export function useIncreaseGoal() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      campaignId,
      newGoalAmount,
    }: {
      campaignId: string
      newGoalAmount: number
    }) => campaignService.increaseGoal(campaignId, newGoalAmount),
    onSuccess: (result, variables) => {
      // Update campaign detail cache
      queryClient.setQueryData(campaignKeys.detail(variables.campaignId), result)
      // Invalidate lists to refresh
      queryClient.invalidateQueries({
        queryKey: campaignKeys.lists(),
      })
    },
  })
}
