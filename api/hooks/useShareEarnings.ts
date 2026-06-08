/**
 * useShareEarnings.ts
 * Custom hook for managing share earnings and earning potential calculations
 * Provides real-time earning data for paid sharing campaigns
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'

export interface ShareEarnings {
  campaignId: string
  totalEarningsCents: number
  totalEarningsDollars: number
  pendingEarningsCents: number
  pendingEarningsDollars: number
  verifiedEarningsCents: number
  verifiedEarningsDollars: number
  totalShares: number
  verifiedShares: number
  pendingShares: number
  rejectedShares: number
  earningsByPlatform: {
    [platform: string]: {
      shares: number
      earningsCents: number
      earningsDollars: number
    }
  }
  estimatedMonthlyEarnings: {
    earningsCents: number
    earningsDollars: number
    shareCount: number
  }
}

export interface ShareEarningPotential {
  campaignId: string
  rewardPerShareCents: number
  rewardPerShareDollars: number
  totalBudgetCents: number
  totalBudgetDollars: number
  remainingBudgetCents: number
  remainingBudgetDollars: number
  maxPossibleShares: number
  alreadyRewarded: number
  sharesRemaining: number
}

export interface ShareLeaderboard {
  position: number
  sharerId: string
  sharerName: string
  totalShares: number
  totalEarningsCents: number
  totalEarningsDollars: number
  topPlatform: string
}

/**
 * Get earned amount for a specific campaign
 */
export const useShareEarnings = (campaignId: string) => {
  return useQuery(
    ['shareEarnings', campaignId],
    async () => {
      const response = await axios.get<{
        success: boolean
        data: ShareEarnings
      }>(`${API_BASE_URL}/campaigns/${campaignId}/share-earnings`, {
        headers: {
          Authorization: `Bearer ${typeof window !== 'undefined' ? localStorage.getItem('token') : ''}`,
        },
      })
      return response.data.data
    },
    {
      enabled: !!campaignId,
      staleTime: 30000, // 30 seconds for real-time feel
      cacheTime: 300000, // 5 minutes
      refetchInterval: 30000, // Refetch every 30 seconds
    }
  )
}

/**
 * Get earning potential for a campaign
 */
export const useShareEarningPotential = (campaignId: string) => {
  return useQuery(
    ['shareEarningPotential', campaignId],
    async () => {
      const response = await axios.get<{
        success: boolean
        data: ShareEarningPotential
      }>(`${API_BASE_URL}/campaigns/${campaignId}/share-earning-potential`, {
        headers: {
          Authorization: `Bearer ${typeof window !== 'undefined' ? localStorage.getItem('token') : ''}`,
        },
      })
      return response.data.data
    },
    {
      enabled: !!campaignId,
      staleTime: 60000, // 1 minute
      cacheTime: 300000, // 5 minutes
    }
  )
}

/**
 * Get share earnings leaderboard
 */
export const useShareEarningsLeaderboard = (campaignId: string, limit = 10) => {
  return useQuery(
    ['shareLeaderboard', campaignId, limit],
    async () => {
      const response = await axios.get<{
        success: boolean
        data: ShareLeaderboard[]
      }>(`${API_BASE_URL}/campaigns/${campaignId}/share-leaderboard?limit=${limit}`, {
        headers: {
          Authorization: `Bearer ${typeof window !== 'undefined' ? localStorage.getItem('token') : ''}`,
        },
      })
      return response.data.data
    },
    {
      enabled: !!campaignId,
      staleTime: 120000, // 2 minutes
      cacheTime: 600000, // 10 minutes
    }
  )
}

/**
 * Record a share and track earning potential
 */
export const useRecordShareWithEarnings = () => {
  const queryClient = useQueryClient()

  return useMutation(
    async (data: {
      campaignId: string
      platform: string
    }) => {
      const response = await axios.post(
        `${API_BASE_URL}/campaigns/${data.campaignId}/shares`,
        {
          channel: data.platform,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${typeof window !== 'undefined' ? localStorage.getItem('token') : ''}`,
          },
        }
      )
      return response.data
    },
    {
      onSuccess: (data, variables) => {
        // Invalidate earnings-related queries
        queryClient.invalidateQueries({ queryKey: ['shareEarnings', variables.campaignId] })
        queryClient.invalidateQueries({ queryKey: ['shareEarningPotential', variables.campaignId] })
        queryClient.invalidateQueries({ queryKey: ['shareLeaderboard', variables.campaignId] })
      },
    }
  )
}

/**
 * Request share payout
 */
export const useRequestSharePayout = () => {
  const queryClient = useQueryClient()

  return useMutation(
    async (data: {
      campaignId: string
      amountCents: number
    }) => {
      const response = await axios.post(
        `${API_BASE_URL}/share-payouts/request`,
        {
          campaign_id: data.campaignId,
          amount_cents: data.amountCents,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${typeof window !== 'undefined' ? localStorage.getItem('token') : ''}`,
          },
        }
      )
      return response.data
    },
    {
      onSuccess: (data, variables) => {
        queryClient.invalidateQueries({ queryKey: ['shareEarnings', variables.campaignId] })
        queryClient.invalidateQueries({ queryKey: ['sharesWallet'] })
      },
    }
  )
}

/**
 * Get all campaigns user is earning from (with active earnings)
 */
export const useMyShareEarningsCampaigns = () => {
  return useQuery(
    ['myShareCampaigns'],
    async () => {
      const response = await axios.get<{
        success: boolean
        data: Array<{campaignId: string; title: string; totalEarnings: number; totalShares: number}>
      }>(`${API_BASE_URL}/user/share-campaigns`, {
        headers: {
          Authorization: `Bearer ${typeof window !== 'undefined' ? localStorage.getItem('token') : ''}`,
        },
      })
      return response.data.data
    },
    {
      staleTime: 60000, // 1 minute
      cacheTime: 300000, // 5 minutes
      refetchInterval: 30000, // Refetch every 30 seconds
    }
  )
}

export default {
  useShareEarnings,
  useShareEarningPotential,
  useShareEarningsLeaderboard,
  useRecordShareWithEarnings,
  useRequestSharePayout,
  useMyShareEarningsCampaigns,
}
