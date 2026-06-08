import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/api'

interface UserShare {
  shareId: string
  campaignId: string
  campaignTitle: string
  channel: string
  is_paid: boolean
  reward_amount: number // in cents
  status: 'completed' | 'pending_verification' | 'verified' | 'pending'
  createdAt: string
}

interface ReferralPerformance {
  totalReferrals: number
  totalConversions: number
  conversionRate: number
  totalRewardEarned: number
  sharesByChannel: Record<string, number>
  topPerformingCampaign?: {
    campaignId: string
    campaignTitle: string
    shares: number
    referrals: number
    revenue: number
  }
}

interface MySharesResponse {
  shares: UserShare[]
  total: number
  page: number
  limit: number
}

const SHARE_ANALYTICS_KEYS = {
  all: ['my-shares'],
  list: (page: number, limit: number) => [...SHARE_ANALYTICS_KEYS.all, 'list', { page, limit }],
  performance: () => [...SHARE_ANALYTICS_KEYS.all, 'performance'],
  referrals: (page: number, limit: number) => [...SHARE_ANALYTICS_KEYS.all, 'referrals', { page, limit }],
}

/**
 * Get user's shares with pagination
 * Endpoint: GET /user/shares
 */
export function useMyShares(page: number = 1, limit: number = 25) {
  return useQuery({
    queryKey: SHARE_ANALYTICS_KEYS.list(page, limit),
    queryFn: async (): Promise<MySharesResponse> => {
      try {
        const response = await apiClient.get<MySharesResponse>('/user/shares', {
          params: { page, limit },
        })
        return response.data
      } catch (error: any) {
        console.error('Failed to fetch user shares:', error)
        throw error
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
  })
}

/**
 * Get supporter's referral performance
 * Endpoint: GET /user/referral-performance
 */
export function useMyReferralPerformance(page: number = 1, limit: number = 25) {
  return useQuery({
    queryKey: SHARE_ANALYTICS_KEYS.referrals(page, limit),
    queryFn: async (): Promise<ReferralPerformance> => {
      try {
        const response = await apiClient.get<ReferralPerformance>('/user/referral-performance', {
          params: { page, limit },
        })
        return response.data
      } catch (error: any) {
        console.error('Failed to fetch referral performance:', error)
        // Return empty data if endpoint doesn't exist
        return {
          totalReferrals: 0,
          totalConversions: 0,
          conversionRate: 0,
          totalRewardEarned: 0,
          sharesByChannel: {},
        }
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
  })
}

/**
 * Get share analytics combining both shares and referral performance
 */
export function useMyShareAnalytics(page: number = 1, limit: number = 25) {
  const shares = useMyShares(page, limit)
  const performance = useMyReferralPerformance(page, limit)

  return {
    shares: shares.data,
    sharesLoading: shares.isPending,
    sharesError: shares.error,
    performance: performance.data,
    performanceLoading: performance.isPending,
    performanceError: performance.error,
    isLoading: shares.isPending || performance.isPending,
    refetch: () => {
      shares.refetch()
      performance.refetch()
    },
  }
}
