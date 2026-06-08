/**
 * Campaign Payout Management Hooks
 * Creator side: View and manage sharer withdrawal requests
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/api'

// ============================================================================
// TYPES
// ============================================================================

export interface SharerPayoutRequest {
  id: string
  amount: number
  fee: number
  net_payout: number
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled'
  requested_at: string
  sharer: {
    id: string
    name: string
    email: string
    username: string
    profile_picture?: string
  }
  payment_method: {
    type: string
    last4?: string
    account_holder?: string
    account_type?: string
    display_name?: string
    // Bank transfer details
    bank_account_holder?: string
    bank_name?: string
    bank_account_type?: string
    bank_account_last_four?: string
    bank_routing_number_last_four?: string
    // Mobile money details
    mobile_number?: string
    mobile_country_code?: string
    mobile_money_provider?: string
    // Card details
    card_last_four?: string
    card_brand?: string
    // Stripe details
    stripe_payment_method_id?: string
  }
}

export interface PayoutSummary {
  pending: { count: number; amount: number; fees: number }
  processing: { count: number; amount: number; fees: number }
  completed: { count: number; amount: number; fees: number }
  failed: { count: number; amount: number; fees: number }
  cancelled: { count: number; amount: number; fees: number }
}

// ============================================================================
// HOOKS
// ============================================================================

/**
 * Get all withdrawal requests from sharers for a specific campaign
 */
export const useCampaignPayoutRequests = (
  campaignId: string | null,
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled' | 'all' = 'pending',
  page: number = 1,
  limit: number = 20
) => {
  return useQuery({
    queryKey: ['campaign', campaignId, 'payout-requests', status, page, limit],
    queryFn: async () => {
      if (!campaignId) return null

      console.log(`[useCampaignPayoutRequests] 🔍 Fetching ${status} payouts for campaign: ${campaignId}`)
      const { data } = await apiClient.get(`/campaigns/${campaignId}/payout-requests`, {
        params: { status, page, limit }
      })

      console.log(`[useCampaignPayoutRequests] ✅ Found ${data.data.withdrawals.length} requests`)
      return data.data
    },
    enabled: !!campaignId,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 1
  })
}

/**
 * Get summary of all payouts for a campaign
 */
export const useCampaignPayoutSummary = (campaignId: string | null) => {
  return useQuery({
    queryKey: ['campaign', campaignId, 'payout-summary'],
    queryFn: async () => {
      if (!campaignId) return null

      console.log(`[useCampaignPayoutSummary] 📊 Fetching payout summary for campaign: ${campaignId}`)
      const { data } = await apiClient.get(`/campaigns/${campaignId}/payout-summary`)

      console.log(`[useCampaignPayoutSummary] ✅ Summary loaded`)
      return data.data
    },
    enabled: !!campaignId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
    retry: 1
  })
}

/**
 * Mark a withdrawal as paid
 */
export const useMarkPayoutAsPaid = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      campaignId,
      withdrawalId,
      transaction_id,
      notes
    }: {
      campaignId: string
      withdrawalId: string
      transaction_id?: string
      notes?: string
    }) => {
      console.log(`[useMarkPayoutAsPaid] 💸 Marking ${withdrawalId} as paid`)
      const { data } = await apiClient.patch(
        `/campaigns/${campaignId}/payouts/${withdrawalId}/mark-paid`,
        { transaction_id, notes }
      )
      console.log(`[useMarkPayoutAsPaid] ✅ Success - status: ${data.data.status}`)
      return data.data
    },
    onSuccess: (_, { campaignId }) => {
      // Invalidate both requests and summary queries
      console.log(`[useMarkPayoutAsPaid] 🔄 Invalidating cache for campaign: ${campaignId}`)
      queryClient.invalidateQueries({ queryKey: ['campaign', campaignId, 'payout-requests'] })
      queryClient.invalidateQueries({ queryKey: ['campaign', campaignId, 'payout-summary'] })
    },
    onError: (error: any) => {
      console.error(`[useMarkPayoutAsPaid] ❌ Failed:`, error.response?.data?.error || error.message)
    }
  })
}

export default {
  useCampaignPayoutRequests,
  useCampaignPayoutSummary,
  useMarkPayoutAsPaid
}
