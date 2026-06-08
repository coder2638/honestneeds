'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { donationService, type CreateDonationRequest } from '@/api/services/donationService'
import { useToast } from '@/hooks/useToast'

/**
 * Donation Hooks
 * React Query hooks for donation operations
 */

const donationKeys = {
  all: ['donations'] as const,
  lists: () => [...donationKeys.all, 'list'] as const,
  list: (page: number, limit: number) => [...donationKeys.lists(), { page, limit }] as const,
  details: () => [...donationKeys.all, 'detail'] as const,
  detail: (id: string) => [...donationKeys.details(), id] as const,
  stats: () => [...donationKeys.all, 'stats'] as const,
  campaignMetrics: (campaignId: string) => [...donationKeys.all, 'campaignMetrics', campaignId] as const,
}

/**
 * Get current user's donations
 */
export function useDonations(page = 1, limit = 25) {
  return useQuery({
    queryKey: donationKeys.list(page, limit),
    queryFn: () => donationService.getMyDonations(page, limit),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
  })
}

/**
 * Get a specific donation
 */
export function useDonation(donationId: string) {
  return useQuery({
    queryKey: donationKeys.detail(donationId),
    queryFn: () => donationService.getDonation(donationId),
    staleTime: 5 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
    enabled: !!donationId,
  })
}

/**
 * Get campaign donation metrics
 */
export function useCampaignDonationMetrics(campaignId: string) {
  return useQuery({
    queryKey: donationKeys.campaignMetrics(campaignId),
    queryFn: () => donationService.getCampaignDonationMetrics(campaignId),
    staleTime: 5 * 60 * 1000,
    enabled: !!campaignId,
    refetchInterval: 5 * 60 * 1000, // Live updates every 5 minutes
  })
}

/**
 * Get user's donation statistics
 */
export function useDonationStats() {
  return useQuery({
    queryKey: donationKeys.stats(),
    queryFn: () => donationService.getDonationStats(),
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  })
}

/**
 * Create a new donation
 */
export function useCreateDonation() {
  const queryClient = useQueryClient()
  const { showToast } = useToast()

  return useMutation({
    mutationFn: (data: CreateDonationRequest) => donationService.createDonation(data),
    onSuccess: (donation) => {
      queryClient.invalidateQueries({ queryKey: donationKeys.lists() })
      queryClient.invalidateQueries({ queryKey: donationKeys.stats() })
      queryClient.invalidateQueries({
        queryKey: donationKeys.campaignMetrics(donation.campaignId),
      })

      showToast({
        message: 'Donation received! Thank you for your support.',
        type: 'success',
      })
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message || 'Failed to create donation. Please try again.'
      showToast({
        message,
        type: 'error',
      })
    },
  })
}

/**
 * Verify a donation (admin)
 */
export function useVerifyDonation() {
  const queryClient = useQueryClient()
  const { showToast } = useToast()

  return useMutation({
    mutationFn: (donationId: string) => donationService.verifyDonation(donationId),
    onSuccess: (donation) => {
      queryClient.invalidateQueries({ queryKey: donationKeys.detail(donation.id) })
      queryClient.invalidateQueries({ queryKey: donationKeys.lists() })
      showToast({
        message: 'Donation verified successfully.',
        type: 'success',
      })
    },
    onError: (error: any) => {
      showToast({
        message: error?.response?.data?.message || 'Failed to verify donation.',
        type: 'error',
      })
    },
  })
}

/**
 * Reject a donation (admin)
 */
export function useRejectDonation() {
  const queryClient = useQueryClient()
  const { showToast } = useToast()

  return useMutation({
    mutationFn: ({ donationId, reason }: { donationId: string; reason: string }) =>
      donationService.rejectDonation(donationId, reason),
    onSuccess: (donation) => {
      queryClient.invalidateQueries({ queryKey: donationKeys.detail(donation.id) })
      queryClient.invalidateQueries({ queryKey: donationKeys.lists() })
      showToast({
        message: 'Donation rejected.',
        type: 'success',
      })
    },
    onError: (error: any) => {
      showToast({
        message: error?.response?.data?.message || 'Failed to reject donation.',
        type: 'error',
      })
    },
  })
}
