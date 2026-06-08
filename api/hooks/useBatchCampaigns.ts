'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { useAuthStore } from '@/store/authStore'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

interface BatchResponse {
  success: boolean
  updated: number
  errors?: Array<{
    campaignId: string
    error: string
  }>
  message?: string
}

/**
 * Hook for batch pause campaigns
 */
export function useBatchPauseCampaigns() {
  const queryClient = useQueryClient()
  const { token } = useAuthStore()

  return useMutation({
    mutationFn: async (campaignIds: string[]) => {
      const response = await axios.post<BatchResponse>(
        `${API_BASE_URL}/campaigns/batch/pause`,
        { campaignIds },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      )
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] })
      queryClient.invalidateQueries({ queryKey: ['campaign-stats'] })
    },
  })
}

/**
 * Hook for batch complete campaigns
 */
export function useBatchCompleteCampaigns() {
  const queryClient = useQueryClient()
  const { token } = useAuthStore()

  return useMutation({
    mutationFn: async (campaignIds: string[]) => {
      const response = await axios.post<BatchResponse>(
        `${API_BASE_URL}/campaigns/batch/complete`,
        { campaignIds },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      )
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] })
      queryClient.invalidateQueries({ queryKey: ['campaign-stats'] })
    },
  })
}

/**
 * Hook for batch delete campaigns
 */
export function useBatchDeleteCampaigns() {
  const queryClient = useQueryClient()
  const { token } = useAuthStore()

  return useMutation({
    mutationFn: async (campaignIds: string[]) => {
      const response = await axios.post<BatchResponse>(
        `${API_BASE_URL}/campaigns/batch/delete`,
        { campaignIds },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      )
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] })
      queryClient.invalidateQueries({ queryKey: ['campaign-stats'] })
    },
  })
}

/**
 * Hook for batch resume campaigns (reverse of pause)
 */
export function useBatchResumeCampaigns() {
  const queryClient = useQueryClient()
  const { token } = useAuthStore()

  return useMutation({
    mutationFn: async (campaignIds: string[]) => {
      const response = await axios.post<BatchResponse>(
        `${API_BASE_URL}/campaigns/batch/resume`,
        { campaignIds },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      )
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] })
      queryClient.invalidateQueries({ queryKey: ['campaign-stats'] })
    },
  })
}

/**
 * Hook for batch activate campaigns
 */
export function useBatchActivateCampaigns() {
  const queryClient = useQueryClient()
  const { token } = useAuthStore()

  return useMutation({
    mutationFn: async (campaignIds: string[]) => {
      const response = await axios.post<BatchResponse>(
        `${API_BASE_URL}/campaigns/batch/activate`,
        { campaignIds },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      )
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] })
      queryClient.invalidateQueries({ queryKey: ['campaign-stats'] })
    },
  })
}
