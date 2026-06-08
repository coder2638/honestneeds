import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import prayerService, { Prayer, PrayerListResponse, PrayerMetrics, PrayerModerationResponse } from '@/api/services/prayerService'
import { useToast } from '@/hooks/useToast'

/**
 * Prayer Support React Query Hooks
 * Manages state and caching for prayer-related operations
 */

// ============================================
// QUERY KEY FACTORY
// ============================================
const prayerKeys = {
  all: ['prayers'] as const,
  metrics: () => [...prayerKeys.all, 'metrics'] as const,
  campaignMetrics: (campaignId: string) =>
    [...prayerKeys.metrics(), campaignId] as const,
  campaigns: () => [...prayerKeys.all, 'campaigns'] as const,
  campaignPrayers: (campaignId: string) =>
    [...prayerKeys.campaigns(), campaignId] as const,
  campaignPrayersPage: (campaignId: string, page: number, limit: number) =>
    [...prayerKeys.campaignPrayers(campaignId), { page, limit }] as const,
  moderation: () => [...prayerKeys.all, 'moderation'] as const,
  creatorModeration: (campaignId: string) =>
    [...prayerKeys.moderation(), 'creator', campaignId] as const,
  adminModeration: () => [...prayerKeys.moderation(), 'admin'] as const,
  analytics: () => [...prayerKeys.all, 'analytics'] as const,
  campaignAnalytics: (campaignId: string) =>
    [...prayerKeys.analytics(), campaignId] as const,
}

// ============================================
// GET PRAYER METRICS
// ============================================
export const usePrayerMetrics = (campaignId: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: prayerKeys.campaignMetrics(campaignId),
    queryFn: () => prayerService.getPrayerMetrics(campaignId),
    staleTime: 1000 * 60 * 3, // 3 minutes
    gcTime: 1000 * 60 * 15, // 15 minutes
    enabled: !!campaignId && enabled,
  })
}

// ============================================
// GET CAMPAIGN PRAYERS
// ============================================
export const useCampaignPrayers = (
  campaignId: string,
  page: number = 1,
  limit: number = 20,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: prayerKeys.campaignPrayersPage(campaignId, page, limit),
    queryFn: () => prayerService.getCampaignPrayers(campaignId, page, limit),
    staleTime: 1000 * 60 * 2, // 2 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
    enabled: !!campaignId && enabled,
  })
}

// ============================================
// SUBMIT PRAYER
// ============================================
export const useSubmitPrayer = () => {
  const queryClient = useQueryClient()
  const { showToast } = useToast()

  return useMutation({
    mutationFn: async ({
      campaignId,
      data,
    }: {
      campaignId: string
      data: {
        type: 'tap' | 'text' | 'voice' | 'video'
        text_content?: string
        audio_file?: File
        video_file?: File
        is_anonymous: boolean
        supporter_name?: string
      }
    }) => {
      return prayerService.submitPrayer(campaignId, data)
    },
    onSuccess: (data, variables) => {
      const { campaignId } = variables

      // Invalidate related queries
      queryClient.invalidateQueries({
        queryKey: prayerKeys.campaignMetrics(campaignId),
      })
      queryClient.invalidateQueries({
        queryKey: prayerKeys.campaignPrayers(campaignId),
      })

      showToast({
        type: 'success',
        message: '🙏 Prayer submitted successfully! Thank you for your prayer support.',
        duration: 4000,
      })
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.error || 'Failed to submit prayer. Please try again.'

      showToast({
        type: 'error',
        message: errorMessage,
        duration: 4000,
      })
    },
  })
}

// ============================================
// REPORT PRAYER
// ============================================
export const useReportPrayer = () => {
  const queryClient = useQueryClient()
  const { showToast } = useToast()

  return useMutation({
    mutationFn: ({
      prayerId,
      reason,
    }: {
      prayerId: string
      reason: string
    }) => {
      return prayerService.reportPrayer(prayerId, reason)
    },
    onSuccess: () => {
      // Invalidate moderation queries
      queryClient.invalidateQueries({
        queryKey: prayerKeys.moderation(),
      })

      showToast({
        type: 'success',
        message: 'Thank you for reporting. Our team will review this prayer.',
        duration: 3000,
      })
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.error || 'Failed to report prayer. Please try again.'

      showToast({
        type: 'error',
        message: errorMessage,
        duration: 3000,
      })
    },
  })
}

// ============================================
// DELETE PRAYER
// ============================================
export const useDeletePrayer = () => {
  const queryClient = useQueryClient()
  const { showToast } = useToast()

  return useMutation({
    mutationFn: (prayerId: string) => {
      return prayerService.deletePrayer(prayerId)
    },
    onSuccess: (data, prayerId) => {
      // Invalidate prayer queries
      queryClient.invalidateQueries({
        queryKey: prayerKeys.campaigns(),
      })

      showToast({
        type: 'success',
        message: 'Prayer deleted successfully.',
        duration: 3000,
      })
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.error || 'Failed to delete prayer. Please try again.'

      showToast({
        type: 'error',
        message: errorMessage,
        duration: 3000,
      })
    },
  })
}

// ============================================
// APPROVE PRAYER
// ============================================
export const useApprovePrayer = () => {
  const queryClient = useQueryClient()
  const { showToast } = useToast()

  return useMutation({
    mutationFn: (prayerId: string) => {
      return prayerService.approvePrayer(prayerId)
    },
    onSuccess: (data) => {
      // Invalidate moderation and campaign queries
      queryClient.invalidateQueries({
        queryKey: prayerKeys.moderation(),
      })
      queryClient.invalidateQueries({
        queryKey: prayerKeys.campaigns(),
      })

      showToast({
        type: 'success',
        message: '✅ Prayer approved.',
        duration: 2000,
      })
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.error || 'Failed to approve prayer. Please try again.'

      showToast({
        type: 'error',
        message: errorMessage,
        duration: 3000,
      })
    },
  })
}

// ============================================
// REJECT PRAYER
// ============================================
export const useRejectPrayer = () => {
  const queryClient = useQueryClient()
  const { showToast } = useToast()

  return useMutation({
    mutationFn: ({
      prayerId,
      reason,
    }: {
      prayerId: string
      reason?: string
    }) => {
      return prayerService.rejectPrayer(prayerId, reason)
    },
    onSuccess: (data) => {
      // Invalidate moderation and campaign queries
      queryClient.invalidateQueries({
        queryKey: prayerKeys.moderation(),
      })
      queryClient.invalidateQueries({
        queryKey: prayerKeys.campaigns(),
      })

      showToast({
        type: 'success',
        message: '❌ Prayer rejected.',
        duration: 2000,
      })
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.error || 'Failed to reject prayer. Please try again.'

      showToast({
        type: 'error',
        message: errorMessage,
        duration: 3000,
      })
    },
  })
}

// ============================================
// GET CREATOR MODERATION QUEUE
// ============================================
export const useCreatorModerationQueue = (
  campaignId: string,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: prayerKeys.creatorModeration(campaignId),
    queryFn: () => prayerService.getCreatorModerationQueue(campaignId),
    staleTime: 1000 * 60 * 2, // 2 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
    enabled: !!campaignId && enabled,
  })
}

// ============================================
// GET ADMIN MODERATION DASHBOARD
// ============================================
export const useAdminModerationDashboard = (enabled: boolean = true) => {
  return useQuery({
    queryKey: prayerKeys.adminModeration(),
    queryFn: () => prayerService.getAdminModerationDashboard(),
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 20, // 20 minutes
    enabled,
  })
}

// ============================================
// GET CAMPAIGN PRAYER ANALYTICS
// ============================================
export const useCampaignPrayerAnalytics = (
  campaignId: string,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: prayerKeys.campaignAnalytics(campaignId),
    queryFn: () => prayerService.getCampaignPrayerAnalytics(campaignId),
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 20, // 20 minutes
    enabled: !!campaignId && enabled,
  })
}

// ============================================
// UPDATE PRAYER SETTINGS
// ============================================
export const useUpdatePrayerSettings = () => {
  const queryClient = useQueryClient()
  const { showToast } = useToast()

  return useMutation({
    mutationFn: async ({
      campaignId,
      settings,
    }: {
      campaignId: string
      settings: any
    }) => {
      // This would call backend endpoint when available
      // For now, we'll simulate the update
      console.log('🙏 Updating prayer settings:', { campaignId, settings })
      return { success: true, data: settings }
    },
    onSuccess: (data, variables) => {
      const { campaignId } = variables

      // Invalidate related queries
      queryClient.invalidateQueries({
        queryKey: prayerKeys.campaignMetrics(campaignId),
      })

      showToast({
        type: 'success',
        message: '✅ Prayer support settings updated successfully.',
        duration: 3000,
      })
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.error ||
        'Failed to update prayer settings. Please try again.'

      showToast({
        type: 'error',
        message: errorMessage,
        duration: 4000,
      })
    },
  })
}
