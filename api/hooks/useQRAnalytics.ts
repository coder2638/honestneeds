import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { apiClient } from '@/lib/api'

interface QRScanAnalytics {
  campaignId: string
  totalScans: number
  scansByLocation: Record<string, number>
  scansThisWeek: number
  scansThisMonth: number
  topLocation: { name: string; scans: number } | null
  lastScannedAt?: string
}

interface StoreImpression {
  id: string
  campaignId: string
  storeLocationId: string
  scans: number
  impressions: number
  conversionRate: number
}

const QR_ANALYTICS_KEYS = {
  all: ['qr-analytics'] as const,
  campaign: (campaignId: string) => [...QR_ANALYTICS_KEYS.all, 'campaign', campaignId] as const,
  storeImpressions: (campaignId: string) => [...QR_ANALYTICS_KEYS.all, 'store-impressions', campaignId] as const,
}

/**
 * useQRAnalytics Hook
 * Fetch QR code scan analytics for a campaign
 */
export const useQRAnalytics = (campaignId?: string) => {
  return useQuery({
    queryKey: QR_ANALYTICS_KEYS.campaign(campaignId || ''),
    queryFn: async (): Promise<QRScanAnalytics> => {
      if (!campaignId) throw new Error('Campaign ID required')

      try {
        const response = await apiClient.get(`/campaigns/${campaignId}/qr-analytics`)
        return response.data.data
      } catch (error) {
        // Gracefully handle 404 - endpoint may not exist
        const axiosError = error as AxiosError
        if (axiosError?.response?.status === 404) {
          console.warn('[QRAnalytics] Endpoint not found, returning empty data', { campaignId })
          return {
            campaignId,
            totalScans: 0,
            scansByLocation: {},
            scansThisWeek: 0,
            scansThisMonth: 0,
            topLocation: null,
          }
        }
        throw error
      }
    },
    enabled: !!campaignId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
  })
}

/**
 * useQRStoreImpressions Hook
 * Fetch store-level impression data for campaign QR codes
 */
export const useQRStoreImpressions = (campaignId?: string) => {
  return useQuery({
    queryKey: QR_ANALYTICS_KEYS.storeImpressions(campaignId || ''),
    queryFn: async (): Promise<StoreImpression[]> => {
      if (!campaignId) throw new Error('Campaign ID required')

      try {
        const response = await apiClient.get(`/campaigns/${campaignId}/store-impressions`)
        return response.data.data || []
      } catch (error) {
        // Gracefully handle 404 - endpoint may not exist
        const axiosError = error as AxiosError
        if (axiosError?.response?.status === 404) {
          console.warn('[QRStoreImpressions] Endpoint not found, returning empty data', { campaignId })
          return []
        }
        throw error
      }
    },
    enabled: !!campaignId,
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  })
}

/**
 * useTrackQRScan Hook
 * Record a QR code scan
 */
export const useTrackQRScan = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: {
      campaignId: string
      storeLocationId?: string
      source?: string
    }) => {
      const response = await apiClient.post(
        `/campaigns/${data.campaignId}/track-qr-scan`,
        {
          storeLocationId: data.storeLocationId,
          source: data.source,
          timestamp: new Date().toISOString(),
        }
      )

      return response.data.data
    },
    onSuccess: (_, variables) => {
      // Invalidate related analytics
      queryClient.invalidateQueries({
        queryKey: QR_ANALYTICS_KEYS.campaign(variables.campaignId),
      })
      queryClient.invalidateQueries({
        queryKey: QR_ANALYTICS_KEYS.storeImpressions(variables.campaignId),
      })
    },
  })
}

/**
 * useDownloadFlyer Hook
 * Download a flyer PDF with QR code
 */
export const useDownloadFlyer = () => {
  return useMutation({
    mutationFn: async (data: {
      campaignId: string
      campaignTitle: string
      campaignDescription: string
      creatorName: string
      qrCodeDataUrl: string
      donateUrl: string
      fileName: string
    }) => {
      const { downloadFlyer } = await import('@/api/services/pdfExportService')

      return downloadFlyer({
        fileName: data.fileName,
        campaignTitle: data.campaignTitle,
        campaignDescription: data.campaignDescription,
        creatorName: data.creatorName,
        qrCodeDataUrl: data.qrCodeDataUrl,
        donateUrl: data.donateUrl,
      })
    },
  })
}

/**
 * useQRCodeUrl Hook
 * Generate scannable campaign URL
 */
export const useQRCodeUrl = (campaignId?: string) => {
  const APP_BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://honestneed.com'
  return campaignId ? `${APP_BASE_URL}/campaigns/${campaignId}` : ''
}
