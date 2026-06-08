import { apiClient } from '@/lib/api'

/**
 * Prayer Support API Service
 * Handles all prayer-related API calls for campaign prayers
 */

export interface PrayerMetrics {
  total_prayers: number
  prayers_today: number
  public_prayers_count: number
  breakdown: {
    tap: number
    text: number
    voice: number
    video: number
  }
  unique_supporters_prayed: string[]
  prayer_goal?: number
}

export interface Prayer {
  _id: string
  prayer_id: string
  campaign_id: string
  supporter_id?: string
  supporter_name?: string
  is_anonymous: boolean
  type: 'tap' | 'text' | 'voice' | 'video'
  content?: string
  audio_url?: string
  audio_duration_seconds?: number
  video_url?: string
  video_duration_seconds?: number
  status: 'pending' | 'approved' | 'rejected'
  is_flagged: boolean
  flag_reason?: string
  report_count: number
  is_deleted: boolean
  visibility: 'public' | 'private'
  created_at: string
  updated_at: string
  sentiment?: 'positive' | 'neutral' | 'negative'
}

export interface PrayerListResponse {
  prayers: Prayer[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface PrayerModerationItem {
  _id: string
  campaign_id: string
  campaign_title: string
  prayer: Prayer
  report_reasons: string[]
  flagged_at?: string
  needs_attention: boolean
}

export interface PrayerModerationResponse {
  pending: PrayerModerationItem[]
  flagged: PrayerModerationItem[]
  reported: PrayerModerationItem[]
  total: number
}

class PrayerService {
  /**
   * Get prayer metrics for a campaign
   */
  async getPrayerMetrics(campaignId: string): Promise<PrayerMetrics> {
    try {
      console.log('🙏 [PrayerService] getPrayerMetrics:', { campaignId })

      const response = await apiClient.get<any>(
        `/campaigns/${campaignId}/prayers/metrics`
      )

      const metrics: PrayerMetrics = {
        total_prayers: response.data.data?.total_prayers || 0,
        prayers_today: response.data.data?.prayers_today || 0,
        public_prayers_count: response.data.data?.public_prayers_count || 0,
        breakdown: response.data.data?.breakdown || {
          tap: 0,
          text: 0,
          voice: 0,
          video: 0,
        },
        unique_supporters_prayed: response.data.data?.unique_supporters_prayed || [],
        prayer_goal: response.data.data?.prayer_goal,
      }

      console.log('✅ [PrayerService] getPrayerMetrics: SUCCESS', metrics)
      return metrics
    } catch (error: any) {
      console.error('❌ [PrayerService] getPrayerMetrics: FAILED', {
        error: error.message,
        campaignId,
      })
      throw error
    }
  }

  /**
   * Get paginated list of prayers for a campaign
   */
  async getCampaignPrayers(
    campaignId: string,
    page: number = 1,
    limit: number = 20
  ): Promise<PrayerListResponse> {
    try {
      console.log('🙏 [PrayerService] getCampaignPrayers:', { campaignId, page, limit })

      const response = await apiClient.get<any>(
        `/campaigns/${campaignId}/prayers`,
        {
          params: { page, limit },
        }
      )

      const formatted: PrayerListResponse = {
        prayers: response.data.data || [],
        total: response.data.pagination?.total || 0,
        page: response.data.pagination?.page || 1,
        limit: response.data.pagination?.limit || 20,
        totalPages: Math.ceil(
          (response.data.pagination?.total || 0) /
            (response.data.pagination?.limit || 20)
        ),
      }

      console.log('✅ [PrayerService] getCampaignPrayers: SUCCESS', {
        count: formatted.prayers.length,
        total: formatted.total,
      })
      return formatted
    } catch (error: any) {
      console.error('❌ [PrayerService] getCampaignPrayers: FAILED', {
        error: error.message,
        campaignId,
      })
      throw error
    }
  }

  /**
   * Submit a prayer to a campaign
   */
  async submitPrayer(
    campaignId: string,
    data: {
      type: 'tap' | 'text' | 'voice' | 'video'
      text_content?: string
      audio_file?: File
      video_file?: File
      is_anonymous: boolean
      supporter_name?: string
    }
  ): Promise<Prayer> {
    try {
      console.log('🙏 [PrayerService] submitPrayer:', { campaignId, type: data.type })

      const formData = new FormData()
      formData.append('type', data.type)
      formData.append('is_anonymous', String(data.is_anonymous))

      if (data.text_content) {
        formData.append('content', data.text_content)
      }

      if (data.audio_file) {
        formData.append('audio_file', data.audio_file)
      }

      if (data.video_file) {
        formData.append('video_file', data.video_file)
      }

      if (data.supporter_name) {
        formData.append('supporter_name', data.supporter_name)
      }

      const response = await apiClient.post<any>(
        `/campaigns/${campaignId}/prayers`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      )

      const prayer: Prayer = response.data.data

      console.log('✅ [PrayerService] submitPrayer: SUCCESS', {
        prayerId: prayer.prayer_id,
        type: prayer.type,
      })
      return prayer
    } catch (error: any) {
      console.error('❌ [PrayerService] submitPrayer: FAILED', {
        error: error.message,
        campaignId,
      })
      throw error
    }
  }

  /**
   * Report a prayer
   */
  async reportPrayer(
    prayerId: string,
    reason: string
  ): Promise<{ success: boolean; message: string }> {
    try {
      console.log('🙏 [PrayerService] reportPrayer:', { prayerId, reason })

      const response = await apiClient.post<any>(
        `/prayers/${prayerId}/report`,
        { reason }
      )

      console.log('✅ [PrayerService] reportPrayer: SUCCESS', { prayerId })
      return { success: true, message: 'Prayer reported successfully' }
    } catch (error: any) {
      console.error('❌ [PrayerService] reportPrayer: FAILED', {
        error: error.message,
        prayerId,
      })
      throw error
    }
  }

  /**
   * Delete a prayer (soft delete)
   */
  async deletePrayer(prayerId: string): Promise<{ success: boolean; message: string }> {
    try {
      console.log('🙏 [PrayerService] deletePrayer:', { prayerId })

      const response = await apiClient.delete<any>(`/prayers/${prayerId}`)

      console.log('✅ [PrayerService] deletePrayer: SUCCESS', { prayerId })
      return { success: true, message: 'Prayer deleted successfully' }
    } catch (error: any) {
      console.error('❌ [PrayerService] deletePrayer: FAILED', {
        error: error.message,
        prayerId,
      })
      throw error
    }
  }

  /**
   * Get creator's moderation queue for a campaign
   */
  async getCreatorModerationQueue(
    campaignId: string
  ): Promise<PrayerModerationResponse> {
    try {
      console.log('🙏 [PrayerService] getCreatorModerationQueue:', { campaignId })

      const response = await apiClient.get<any>(
        `/campaigns/${campaignId}/prayers/moderation-queue`
      )

      const data: PrayerModerationResponse = {
        pending: response.data.data?.pending || [],
        flagged: response.data.data?.flagged || [],
        reported: response.data.data?.reported || [],
        total: response.data.data?.total || 0,
      }

      console.log('✅ [PrayerService] getCreatorModerationQueue: SUCCESS', {
        pending: data.pending.length,
        flagged: data.flagged.length,
        reported: data.reported.length,
      })
      return data
    } catch (error: any) {
      console.error('❌ [PrayerService] getCreatorModerationQueue: FAILED', {
        error: error.message,
        campaignId,
      })
      throw error
    }
  }

  /**
   * Approve a prayer (creator only)
   */
  async approvePrayer(prayerId: string): Promise<Prayer> {
    try {
      console.log('🙏 [PrayerService] approvePrayer:', { prayerId })

      const response = await apiClient.put<any>(`/prayers/${prayerId}/approve`, {})

      console.log('✅ [PrayerService] approvePrayer: SUCCESS', { prayerId })
      return response.data.data
    } catch (error: any) {
      console.error('❌ [PrayerService] approvePrayer: FAILED', {
        error: error.message,
        prayerId,
      })
      throw error
    }
  }

  /**
   * Reject a prayer (creator only)
   */
  async rejectPrayer(
    prayerId: string,
    reason?: string
  ): Promise<Prayer> {
    try {
      console.log('🙏 [PrayerService] rejectPrayer:', { prayerId, reason })

      const response = await apiClient.put<any>(`/prayers/${prayerId}/reject`, {
        reason,
      })

      console.log('✅ [PrayerService] rejectPrayer: SUCCESS', { prayerId })
      return response.data.data
    } catch (error: any) {
      console.error('❌ [PrayerService] rejectPrayer: FAILED', {
        error: error.message,
        prayerId,
      })
      throw error
    }
  }

  /**
   * Get campaign prayer analytics (creator only)
   */
  async getCampaignPrayerAnalytics(campaignId: string): Promise<any> {
    try {
      console.log('🙏 [PrayerService] getCampaignPrayerAnalytics:', { campaignId })

      const response = await apiClient.get<any>(
        `/campaigns/${campaignId}/prayers/analytics`
      )

      console.log('✅ [PrayerService] getCampaignPrayerAnalytics: SUCCESS')
      return response.data.data
    } catch (error: any) {
      console.error('❌ [PrayerService] getCampaignPrayerAnalytics: FAILED', {
        error: error.message,
        campaignId,
      })
      throw error
    }
  }

  /**
   * Get admin moderation dashboard
   */
  async getAdminModerationDashboard(): Promise<PrayerModerationResponse> {
    try {
      console.log('🙏 [PrayerService] getAdminModerationDashboard')

      const response = await apiClient.get<any>(
        `/admin/prayers/moderation-dashboard`
      )

      const data: PrayerModerationResponse = {
        pending: response.data.data?.pending || [],
        flagged: response.data.data?.flagged || [],
        reported: response.data.data?.reported || [],
        total: response.data.data?.total || 0,
      }

      console.log('✅ [PrayerService] getAdminModerationDashboard: SUCCESS', {
        total: data.total,
      })
      return data
    } catch (error: any) {
      console.error('❌ [PrayerService] getAdminModerationDashboard: FAILED', {
        error: error.message,
      })
      throw error
    }
  }
}

export default new PrayerService()
