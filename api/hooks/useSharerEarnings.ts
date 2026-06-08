/**
 * Sharer Earnings Hook
 * Fetches available earnings and balance information for supporters/sharers
 */

import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/api'

export interface SharerEarnings {
  balance_cents: number
  available_cents: number
  pending_cents: number
  reserved_cents: number
  total_earned_cents: number
  currency: string
}

export interface SharerEarningsResponse {
  success: boolean
  data: SharerEarnings
}

/**
 * Get sharer's available earnings
 * Endpoint: GET /sharer/earnings/available
 * Returns: available_cents, pending_cents, reserved_cents, total_earned_cents, balance_cents
 */
export const useSharerEarnings = () => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null

  return useQuery({
    queryKey: ['sharer', 'earnings', 'available', token], // Include token in key for dependency
    queryFn: async (): Promise<SharerEarnings> => {
      if (!token) {
        console.warn('[useSharerEarnings] No auth_token available, returning default state')
        return {
          balance_cents: 0,
          available_cents: 0,
          pending_cents: 0,
          reserved_cents: 0,
          total_earned_cents: 0,
          currency: 'USD',
        }
      }

      try {
        console.log('[useSharerEarnings] 🔄 STARTING FETCH | token:', token.substring(0, 20) + '...')
        const startTime = Date.now()
        
        const { data } = await apiClient.get<SharerEarningsResponse>(
          '/sharer/earnings/available'
        )
        
        const duration = Date.now() - startTime
        console.log(`[useSharerEarnings] ✅ SUCCESS (${duration}ms)`)
        console.log(`[useSharerEarnings]   - available_cents: ${data.data.available_cents} ($${(data.data.available_cents / 100).toFixed(2)})`)
        console.log(`[useSharerEarnings]   - reserved_cents: ${data.data.reserved_cents} ($${(data.data.reserved_cents / 100).toFixed(2)})`)
        console.log(`[useSharerEarnings]   - total_earned_cents: ${data.data.total_earned_cents} ($${(data.data.total_earned_cents / 100).toFixed(2)})`)
        console.log(`[useSharerEarnings]   - balance_cents: ${data.data.balance_cents} ($${(data.data.balance_cents / 100).toFixed(2)})`)
        
        return data.data
      } catch (error: unknown) {
        const err = error as Error
        console.error('[useSharerEarnings] ❌ FAILED:', err.message)
        // Return default values on error instead of throwing
        return {
          balance_cents: 0,
          available_cents: 0,
          pending_cents: 0,
          reserved_cents: 0,
          total_earned_cents: 0,
          currency: 'USD',
        }
      }
    },
    staleTime: 3 * 60 * 1000, // 3 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 1,
  })
}
