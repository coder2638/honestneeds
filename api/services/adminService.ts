import { apiClient } from '@/lib/api'

/**
 * Admin API Service
 * Handles all admin/moderation endpoints
 */

export interface AdminOverviewStats {
  activeCampaigns: number
  totalRevenue: number // in cents
  monthlyRevenue: number // in cents
  pendingTransactions: number
  totalPendingAmount: number // in cents
  nextDrawingDate: string
  sweepstakesEntryCount: number
  platformUptime: number // percentage
}

export interface ActivityFeedItem {
  id: string
  timestamp: string
  type: 'campaign_created' | 'campaign_flagged' | 'transaction_received' | 'transaction_verified' | 'user_registered'
  actor: string
  description: string
  relatedId?: string
  relatedType?: string
}

export interface AdminAlert {
  id: string
  type: 'flagged_campaign' | 'high_value_transaction' | 'suspicious_activity' | 'system_health'
  severity: 'info' | 'warning' | 'error'
  count: number
  message: string
  link?: string
}

export interface CampaignForModeration {
  id: string
  title: string
  creatorId: string
  creatorName: string
  goalAmount: number
  raisedAmount: number
  status: 'draft' | 'active' | 'paused' | 'completed' | 'flagged' | 'suspended'
  flagCount: number
  flags?: Array<{ reason: string; note?: string; flaggedBy: string; timestamp: string }>
  isSuspended: boolean
  suspensionReason?: string
  suspensionExpiration?: string
  createdAt: string
}

export interface CampaignModerationList {
  campaigns: CampaignForModeration[]
  total: number
  page: number
  limit: number
}

export interface Transaction {
  id: string
  campaignId: string
  campaignTitle: string
  donorId: string
  donorName: string
  donorEmail: string
  amount: number // in cents
  paymentMethod: string
  status: 'pending' | 'verified' | 'rejected'
  proofUrl?: string
  createdAt: string
  verifiedAt?: string
  rejectionReason?: string
}

export interface TransactionList {
  transactions: Transaction[]
  total: number
  page: number
  limit: number
}

export interface AdminSettings {
  platformFee: number // percentage, e.g., 0.02 = 2%
  minDonation: number // in cents
  maxDonation: number // in cents
  sweepstakesEnabled: boolean
  sweepstakesDrawingFrequency: string
  maintenanceMode: boolean
}

class AdminService {
  /**
   * Get admin dashboard overview stats
   */
  async getAdminOverview(): Promise<AdminOverviewStats> {
    try {
      const response = await apiClient.get<AdminOverviewStats>('/admin/overview')
      return response.data
    } catch (error: any) {
      console.error('Failed to fetch admin overview:', error)
      throw error
    }
  }

  /**
   * Get recent activity feed
   */
  async getActivityFeed(limit: number = 10): Promise<ActivityFeedItem[]> {
    try {
      const response = await apiClient.get<{ items: ActivityFeedItem[] }>('/admin/activity-feed', {
        params: { limit },
      })
      return response.data.items
    } catch (error: any) {
      console.error('Failed to fetch activity feed:', error)
      throw error
    }
  }

  /**
   * Get admin alerts
   */
  async getAlerts(): Promise<AdminAlert[]> {
    try {
      const response = await apiClient.get<{ alerts: AdminAlert[] }>('/admin/alerts')
      return response.data.alerts
    } catch (error: any) {
      console.error('Failed to fetch alerts:', error)
      throw error
    }
  }

  /**
   * Get campaigns for moderation queue
   */
  async getCampaignsForModeration(
    page: number = 1,
    limit: number = 25,
    filters?: {
      status?: string
      sortBy?: string
    }
  ): Promise<CampaignModerationList> {
    try {
      const params: Record<string, any> = {
        page,
        limit,
      }

      if (filters?.status) params.status = filters.status
      if (filters?.sortBy) params.sort = filters.sortBy

      const response = await apiClient.get<CampaignModerationList>('/admin/campaigns/moderation', {
        params,
      })

      return response.data
    } catch (error: any) {
      console.error('Failed to fetch campaigns for moderation:', error)
      throw error
    }
  }

  /**
   * Flag a campaign
   */
  async flagCampaign(
    campaignId: string,
    reason: string,
    notes?: string
  ): Promise<{ success: boolean }> {
    try {
      const response = await apiClient.post<{ success: boolean }>(
        `/admin/campaigns/${campaignId}/flag`,
        { reason, notes }
      )
      return response.data
    } catch (error: any) {
      console.error('Failed to flag campaign:', error)
      throw error
    }
  }

  /**
   * Unflag a campaign
   */
  async unflagCampaign(campaignId: string): Promise<{ success: boolean }> {
    try {
      const response = await apiClient.post<{ success: boolean }>(
        `/admin/campaigns/${campaignId}/unflag`
      )
      return response.data
    } catch (error: any) {
      console.error('Failed to unflag campaign:', error)
      throw error
    }
  }

  /**
   * Suspend a campaign
   */
  async suspendCampaign(
    campaignId: string,
    reason: string,
    duration: '7days' | '30days' | 'permanent',
    notifyCreator: boolean = true
  ): Promise<{ success: boolean }> {
    try {
      const response = await apiClient.post<{ success: boolean }>(
        `/admin/campaigns/${campaignId}/suspend`,
        { reason, duration, notifyCreator }
      )
      return response.data
    } catch (error: any) {
      console.error('Failed to suspend campaign:', error)
      throw error
    }
  }

  /**
   * Unsuspend a campaign
   */
  async unsuspendCampaign(campaignId: string): Promise<{ success: boolean }> {
    try {
      const response = await apiClient.post<{ success: boolean }>(
        `/admin/campaigns/${campaignId}/unsuspend`
      )
      return response.data
    } catch (error: any) {
      console.error('Failed to unsuspend campaign:', error)
      throw error
    }
  }

  /**
   * Approve a campaign
   */
  async approveCampaign(campaignId: string): Promise<{ success: boolean }> {
    try {
      const response = await apiClient.post<{ success: boolean }>(
        `/admin/campaigns/${campaignId}/approve`
      )
      return response.data
    } catch (error: any) {
      console.error('Failed to approve campaign:', error)
      throw error
    }
  }

  /**
   * Get transactions for verification
   */
  async getTransactionsForVerification(
    page: number = 1,
    limit: number = 25,
    filters?: {
      status?: string
      sortBy?: string
    }
  ): Promise<TransactionList> {
    try {
      const params: Record<string, any> = {
        page,
        limit,
      }

      if (filters?.status) params.status = filters.status
      if (filters?.sortBy) params.sort = filters.sortBy

      const response = await apiClient.get<TransactionList>('/admin/transactions', {
        params,
      })

      return response.data
    } catch (error: any) {
      console.error('Failed to fetch transactions:', error)
      throw error
    }
  }

  /**
   * Get transaction detail
   */
  async getTransactionDetail(transactionId: string): Promise<Transaction> {
    try {
      const response = await apiClient.get<Transaction>(`/admin/transactions/${transactionId}`)
      return response.data
    } catch (error: any) {
      console.error('Failed to fetch transaction detail:', error)
      throw error
    }
  }

  /**
   * Verify a transaction
   */
  async verifyTransaction(transactionId: string): Promise<{ success: boolean }> {
    try {
      const response = await apiClient.post<{ success: boolean }>(
        `/admin/transactions/${transactionId}/verify`
      )
      return response.data
    } catch (error: any) {
      console.error('Failed to verify transaction:', error)
      throw error
    }
  }

  /**
   * Bulk verify transactions
   */
  async bulkVerifyTransactions(transactionIds: string[]): Promise<{ success: boolean }> {
    try {
      const response = await apiClient.post<{ success: boolean }>(
        '/admin/transactions/bulk-verify',
        { transactionIds }
      )
      return response.data
    } catch (error: any) {
      console.error('Failed to bulk verify transactions:', error)
      throw error
    }
  }

  /**
   * Reject a transaction
   */
  async rejectTransaction(
    transactionId: string,
    reason: string
  ): Promise<{ success: boolean }> {
    try {
      const response = await apiClient.post<{ success: boolean }>(
        `/admin/transactions/${transactionId}/reject`,
        { reason }
      )
      return response.data
    } catch (error: any) {
      console.error('Failed to reject transaction:', error)
      throw error
    }
  }

  /**
   * Bulk reject transactions
   */
  async bulkRejectTransactions(
    transactionIds: string[],
    reason: string
  ): Promise<{ success: boolean }> {
    try {
      const response = await apiClient.post<{ success: boolean }>(
        '/admin/transactions/bulk-reject',
        { transactionIds, reason }
      )
      return response.data
    } catch (error: any) {
      console.error('Failed to bulk reject transactions:', error)
      throw error
    }
  }

  /**
   * Get admin settings
   */
  async getAdminSettings(): Promise<AdminSettings> {
    try {
      const response = await apiClient.get<AdminSettings>('/admin/settings')
      return response.data
    } catch (error: any) {
      console.error('Failed to fetch admin settings:', error)
      throw error
    }
  }

  /**
   * Update admin settings (Phase 2)
   */
  async updateAdminSettings(settings: Partial<AdminSettings>): Promise<AdminSettings> {
    try {
      const response = await apiClient.patch<AdminSettings>('/admin/settings', settings)
      return response.data
    } catch (error: any) {
      console.error('Failed to update admin settings:', error)
      throw error
    }
  }
}

export const adminService = new AdminService()
