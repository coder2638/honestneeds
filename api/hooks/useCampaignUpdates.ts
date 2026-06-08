'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  campaignUpdateService,
  CampaignUpdate,
  CreateUpdatePayload,
} from '@/api/services/campaignUpdateService'

const CAMPAIGN_UPDATE_KEYS = {
  all: ['campaignUpdates'],
  lists: () => [...CAMPAIGN_UPDATE_KEYS.all, 'list'],
  list: (campaignId: string) => [...CAMPAIGN_UPDATE_KEYS.lists(), campaignId],
  details: () => [...CAMPAIGN_UPDATE_KEYS.all, 'detail'],
  detail: (campaignId: string, updateId: string) => [
    ...CAMPAIGN_UPDATE_KEYS.details(),
    campaignId,
    updateId,
  ],
}

/**
 * Get all campaign updates
 */
export const useCampaignUpdates = (campaignId: string) => {
  return useQuery({
    queryKey: CAMPAIGN_UPDATE_KEYS.list(campaignId),
    queryFn: () => campaignUpdateService.getCampaignUpdates(campaignId),
    enabled: !!campaignId, // Only run when campaignId is provided
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes (formerly cacheTime)
    retry: 1, // Retry once on failure
  })
}

/**
 * Get single campaign update
 */
export const useCampaignUpdate = (campaignId: string, updateId: string) => {
  return useQuery({
    queryKey: CAMPAIGN_UPDATE_KEYS.detail(campaignId, updateId),
    queryFn: () => campaignUpdateService.getCampaignUpdate(campaignId, updateId),
    enabled: !!campaignId && !!updateId, // Only run when both IDs are provided
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    retry: 1,
  })
}

/**
 * Create campaign update mutation
 */
export const useCreateCampaignUpdate = (campaignId: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateUpdatePayload) =>
      campaignUpdateService.createCampaignUpdate(campaignId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CAMPAIGN_UPDATE_KEYS.list(campaignId) })
    },
  })
}

/**
 * Update campaign update mutation
 */
export const useUpdateCampaignUpdate = (campaignId: string, updateId: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: Partial<CreateUpdatePayload>) =>
      campaignUpdateService.updateCampaignUpdate(campaignId, updateId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CAMPAIGN_UPDATE_KEYS.list(campaignId) })
      queryClient.invalidateQueries({
        queryKey: CAMPAIGN_UPDATE_KEYS.detail(campaignId, updateId),
      })
    },
  })
}

/**
 * Delete campaign update mutation
 */
export const useDeleteCampaignUpdate = (campaignId: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (updateId: string) =>
      campaignUpdateService.deleteCampaignUpdate(campaignId, updateId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CAMPAIGN_UPDATE_KEYS.list(campaignId) })
    },
  })
}
