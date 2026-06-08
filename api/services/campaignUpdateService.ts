import { apiClient } from '@/lib/api'
import { AxiosError } from 'axios'

export interface CampaignUpdate {
  id: string
  campaignId: string
  creatorId: string
  title: string
  content: string
  imageUrl?: string
  createdAt: string
  updatedAt: string
}

export interface CreateUpdatePayload {
  title: string
  content: string
  imageUrl?: string
}

/**
 * Campaign Update Service
 * Manages campaign progress updates and comments
 */

export const campaignUpdateService = {
  /**
   * Get all updates for a campaign
   */
  async getCampaignUpdates(campaignId: string): Promise<CampaignUpdate[]> {
    try {
      const response = await apiClient.get<{
        success: boolean
        message: string
        data: { updates: CampaignUpdate[]; pagination: any }
      }>(`/campaigns/${campaignId}/updates`)
      // Extract the updates array from the nested response structure
      const updates = response.data?.data?.updates || []
      console.log('✅ Campaign updates fetched:', { campaignId, count: updates.length, data: response.data })
      return updates
    } catch (error) {
      const axiosError = error as AxiosError
      // Return empty array for 404 errors (endpoint not implemented)
      if (axiosError.response?.status === 404) {
        console.debug(`Campaign updates endpoint not available for campaign ${campaignId}`)
        return []
      }
      console.error('Failed to fetch campaign updates:', { campaignId, error: error instanceof Error ? error.message : error })
      // Return empty array instead of throwing to prevent UI crashes
      return []
    }
  },

  /**
   * Get single update by ID
   */
  async getCampaignUpdate(campaignId: string, updateId: string): Promise<CampaignUpdate> {
    try {
      const response = await apiClient.get<{
        success: boolean
        message: string
        data: CampaignUpdate
      }>(`/campaigns/${campaignId}/updates/${updateId}`)
      return response.data?.data || {}
    } catch (error) {
      console.error('Failed to fetch campaign update:', error)
      throw error
    }
  },

  /**
   * Create new campaign update
   */
  async createCampaignUpdate(
    campaignId: string,
    payload: CreateUpdatePayload
  ): Promise<CampaignUpdate> {
    try {
      const response = await apiClient.post<{
        success: boolean
        message: string
        data: CampaignUpdate
      }>(`/campaigns/${campaignId}/updates`, payload)
      return response.data?.data || {}
    } catch (error) {
      console.error('Failed to create campaign update:', error)
      throw error
    }
  },

  /**
   * Update existing campaign update
   */
  async updateCampaignUpdate(
    campaignId: string,
    updateId: string,
    payload: Partial<CreateUpdatePayload>
  ): Promise<CampaignUpdate> {
    try {
      const response = await apiClient.put<{
        success: boolean
        message: string
        data: CampaignUpdate
      }>(`/campaigns/${campaignId}/updates/${updateId}`, payload)
      return response.data?.data || {}
    } catch (error) {
      console.error('Failed to update campaign update:', error)
      throw error
    }
  },

  /**
   * Delete campaign update
   */
  async deleteCampaignUpdate(campaignId: string, updateId: string): Promise<void> {
    try {
      await apiClient.delete(`/campaigns/${campaignId}/updates/${updateId}`)
    } catch (error) {
      console.error('Failed to delete campaign update:', error)
      throw error
    }
  },
}
