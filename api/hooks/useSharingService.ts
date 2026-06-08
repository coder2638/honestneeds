'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { sharingService } from '@/api/services/sharingService'
import { useToast } from '@/hooks/useToast'

/**
 * Sharing & Referral Hooks
 * React Query hooks for sharing operations
 */

const sharingKeys = {
  all: ['sharing'] as const,
  shares: () => [...sharingKeys.all, 'shares'] as const,
  list: (page: number, limit: number) => [...sharingKeys.shares(), { page, limit }] as const,
  metrics: () => [...sharingKeys.all, 'metrics'] as const,
  campaignMetrics: (campaignId: string) => [...sharingKeys.metrics(), campaignId] as const,
  stats: () => [...sharingKeys.all, 'stats'] as const,
  referralHistory: (page: number, limit: number) =>
    [...sharingKeys.all, 'referralHistory', { page, limit }] as const,
}

/**
 * Generate a referral link for a campaign
 */
export function useGenerateReferralLink() {
  const { showToast } = useToast()

  return useMutation({
    mutationFn: (campaignId: string) => sharingService.generateReferralLink(campaignId),
    onSuccess: () => {
      showToast({
        message: 'Referral link generated!',
        type: 'success',
      })
    },
    onError: (error: any) => {
      showToast({
        message: error?.response?.data?.message || 'Failed to generate referral link.',
        type: 'error',
      })
    },
  })
}

/**
 * Record a share action (track sharing)
 */
export function useRecordShare() {
  const queryClient = useQueryClient()
  const { showToast } = useToast()

  return useMutation({
    mutationFn: ({ campaignId, channel }: { campaignId: string; channel: string }) =>
      sharingService.recordShare(campaignId, channel),
    onSuccess: (share) => {
      queryClient.invalidateQueries({
        queryKey: sharingKeys.campaignMetrics(share.campaignId),
      })
      queryClient.invalidateQueries({ queryKey: sharingKeys.stats() })

      showToast({
        message: 'Share recorded! Thank you for sharing.',
        type: 'success',
      })
    },
    onError: (error: any) => {
      console.error('Share error:', error)
      // Don't show error for share tracking - it's not critical
    },
  })
}

/**
 * Get campaign share metrics
 */
export function useCampaignShareMetrics(campaignId: string) {
  return useQuery({
    queryKey: sharingKeys.campaignMetrics(campaignId),
    queryFn: () => sharingService.getCampaignShareMetrics(campaignId),
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!campaignId,
    refetchInterval: 10 * 60 * 1000, // Live updates every 10 minutes
  })
}

/**
 * Get current user's shares
 */
export function useMyShares(page = 1, limit = 25) {
  return useQuery({
    queryKey: sharingKeys.list(page, limit),
    queryFn: () => sharingService.getMyShares(page, limit),
    staleTime: 5 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
  })
}

/**
 * Get user's share statistics
 */
export function useShareStats() {
  return useQuery({
    queryKey: sharingKeys.stats(),
    queryFn: () => sharingService.getShareStats(),
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  })
}

/**
 * Get QR code for a share link
 */
export function useQRCode() {
  const { showToast } = useToast()

  return useMutation({
    mutationFn: (shareLink: string) => sharingService.getQRCode(shareLink),
    onError: (error: any) => {
      showToast({
        message: error?.response?.data?.message || 'Failed to generate QR code.',
        type: 'error',
      })
    },
  })
}

/**
 * Track a referral click
 */
export function useTrackReferralClick() {
  return useMutation({
    mutationFn: (referralId: string) => sharingService.trackReferralClick(referralId),
  })
}

/**
 * Get referral history for user
 */
export function useReferralHistory(page = 1, limit = 25) {
  return useQuery({
    queryKey: sharingKeys.referralHistory(page, limit),
    queryFn: () => sharingService.getReferralHistory(page, limit),
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  })
}
