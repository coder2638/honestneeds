'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  volunteerService,
  type CreateVolunteerOfferRequest,
  type VolunteerOffer,
} from '@/api/services/volunteerService'
import { useToast } from '@/hooks/useToast'

/**
 * Volunteer / Helping Hands Hooks
 * React Query hooks for volunteer operations
 */

const volunteerKeys = {
  all: ['volunteers'] as const,
  lists: () => [...volunteerKeys.all, 'list'] as const,
  list: (page: number, limit: number) => [...volunteerKeys.lists(), { page, limit }] as const,
  details: () => [...volunteerKeys.all, 'detail'] as const,
  detail: (id: string) => [...volunteerKeys.details(), id] as const,
  campaignOffers: (campaignId: string) => [...volunteerKeys.all, 'campaignOffers', campaignId] as const,
  campaignOffersByStatus: (campaignId: string, status: string) =>
    [...volunteerKeys.campaignOffers(campaignId), { status }] as const,
  stats: () => [...volunteerKeys.all, 'stats'] as const,
  campaignMetrics: (campaignId: string) => [...volunteerKeys.all, 'campaignMetrics', campaignId] as const,
  myOffers: () => [...volunteerKeys.all, 'myOffers'] as const,
  myOffersList: (page: number, limit: number) =>
    [...volunteerKeys.myOffers(), { page, limit }] as const,
}

/**
 * Get current user's volunteer offers
 */
export function useMyVolunteerOffers(page = 1, limit = 25) {
  return useQuery({
    queryKey: volunteerKeys.myOffersList(page, limit),
    queryFn: () => volunteerService.getMyVolunteerOffers(page, limit),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
  })
}

/**
 * Get a specific volunteer offer
 */
export function useVolunteerOffer(offerId: string) {
  return useQuery({
    queryKey: volunteerKeys.detail(offerId),
    queryFn: () => volunteerService.getVolunteerOffer(offerId),
    staleTime: 5 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
    enabled: !!offerId,
  })
}

/**
 * Get campaign volunteer offers (creator dashboard)
 */
export function useCampaignVolunteerOffers(campaignId: string, status?: string) {
  return useQuery({
    queryKey: status
      ? volunteerKeys.campaignOffersByStatus(campaignId, status)
      : volunteerKeys.campaignOffers(campaignId),
    queryFn: () =>
      volunteerService.getCampaignVolunteerOffers(
        campaignId,
        status as any
      ),
    staleTime: 3 * 60 * 1000, // 3 minutes (more real-time for creator)
    gcTime: 10 * 60 * 1000, // 10 minutes
    enabled: !!campaignId,
  })
}

/**
 * Get campaign volunteer metrics (creator analytics)
 */
export function useCampaignVolunteerMetrics(campaignId: string) {
  return useQuery({
    queryKey: volunteerKeys.campaignMetrics(campaignId),
    queryFn: () => volunteerService.getCampaignVolunteerMetrics(campaignId),
    staleTime: 5 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
    enabled: !!campaignId,
  })
}

/**
 * Get user's volunteer statistics
 */
export function useVolunteerStatistics() {
  return useQuery({
    queryKey: volunteerKeys.stats(),
    queryFn: () => volunteerService.getVolunteerStatistics(),
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  })
}

/**
 * Submit a new volunteer offer (volunteer action)
 */
export function useCreateVolunteerOffer() {
  const queryClient = useQueryClient()
  const { showToast } = useToast()

  return useMutation({
    mutationFn: (request: CreateVolunteerOfferRequest) =>
      volunteerService.createVolunteerOffer(request),
    onSuccess: (data) => {
      // Invalidate lists and stats
      queryClient.invalidateQueries({ queryKey: volunteerKeys.myOffers() })
      queryClient.invalidateQueries({ queryKey: volunteerKeys.stats() })
      queryClient.invalidateQueries({
        queryKey: volunteerKeys.campaignOffers(data.campaignId),
      })

      showToast({
        type: 'success',
        message: 'Your volunteer offer has been submitted! The campaign creator will review it soon.',
      })
    },
    onError: (error: any) => {
      showToast({
        type: 'error',
        message: error.message || 'Failed to submit volunteer offer. Please try again.',
      })
    },
  })
}

/**
 * Accept volunteer offer (creator action)
 */
export function useAcceptVolunteerOffer() {
  const queryClient = useQueryClient()
  const { showToast } = useToast()

  return useMutation({
    mutationFn: ({ offerId, notes }: { offerId: string; notes?: string }) =>
      volunteerService.acceptVolunteerOffer(offerId, notes),
    onSuccess: (data) => {
      // Invalidate campaign offers and metrics
      queryClient.invalidateQueries({
        queryKey: volunteerKeys.campaignOffers(data.campaignId),
      })
      queryClient.invalidateQueries({
        queryKey: volunteerKeys.campaignMetrics(data.campaignId),
      })

      showToast({
        type: 'success',
        message: 'Volunteer offer accepted! Contact information has been shared.',
      })
    },
    onError: (error: any) => {
      showToast({
        type: 'error',
        message: error.message || 'Failed to accept volunteer offer. Please try again.',
      })
    },
  })
}

/**
 * Decline volunteer offer (creator action)
 */
export function useDeclineVolunteerOffer() {
  const queryClient = useQueryClient()
  const { showToast } = useToast()

  return useMutation({
    mutationFn: ({
      offerId,
      declineReason,
      notes,
    }: {
      offerId: string
      declineReason: string
      notes?: string
    }) => volunteerService.declineVolunteerOffer(offerId, declineReason, notes),
    onSuccess: (data) => {
      // Invalidate campaign offers and metrics
      queryClient.invalidateQueries({
        queryKey: volunteerKeys.campaignOffers(data.campaignId),
      })
      queryClient.invalidateQueries({
        queryKey: volunteerKeys.campaignMetrics(data.campaignId),
      })

      showToast({
        type: 'success',
        message: 'Volunteer offer declined. A message has been sent to the volunteer.',
      })
    },
    onError: (error: any) => {
      showToast({
        type: 'error',
        message: error.message || 'Failed to decline volunteer offer. Please try again.',
      })
    },
  })
}

/**
 * Complete volunteer offer (creator action)
 */
export function useCompleteVolunteerOffer() {
  const queryClient = useQueryClient()
  const { showToast } = useToast()

  return useMutation({
    mutationFn: ({ offerId, notes }: { offerId: string; notes?: string }) =>
      volunteerService.completeVolunteerOffer(offerId, notes),
    onSuccess: (data) => {
      // Invalidate campaign offers and metrics
      queryClient.invalidateQueries({
        queryKey: volunteerKeys.campaignOffers(data.campaignId),
      })
      queryClient.invalidateQueries({
        queryKey: volunteerKeys.campaignMetrics(data.campaignId),
      })
      queryClient.invalidateQueries({ queryKey: volunteerKeys.stats() })

      showToast({
        type: 'success',
        message: 'Volunteer offer marked as completed!',
      })
    },
    onError: (error: any) => {
      showToast({
        type: 'error',
        message: error.message || 'Failed to complete volunteer offer. Please try again.',
      })
    },
  })
}
