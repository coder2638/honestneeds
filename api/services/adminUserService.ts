import { apiClient } from '@/lib/api'

/**
 * User Verification Status Types
 */
export type UserVerificationStatus = 'unverified' | 'pending' | 'verified' | 'rejected'

/**
 * User Block Reason Types
 */
export type UserBlockReason =
  | 'fraud'
  | 'policy_violation'
  | 'spam'
  | 'inappropriate_content'
  | 'reported_by_users'
  | 'manual_admin'
  | 'other'

/**
 * User Report Type
 */
export interface UserReport {
  id: string
  reportedUserId: string
  reportingUserId: string
  reason: string
  description: string
  status: 'pending' | 'resolved' | 'dismissed'
  createdAt: string
  resolvedAt?: string
}

/**
 * User Profile for Admin View
 */
export interface AdminUserProfile {
  id: string
  email: string
  name: string
  avatar?: string
  role: 'creator' | 'supporter' | 'admin'
  verificationStatus: UserVerificationStatus
  isBlocked: boolean
  blockReason?: UserBlockReason
  blockDate?: string
  blockedBy?: string
  blockedReason?: string
  createdAt: string
  lastLoginAt?: string
  totalCampaigns: number
  totalDonations: number
  totalDonated: number
  totalShares: number
  sweepstakesEntries: number
  reports: UserReport[]
  reportCount: number
}

/**
 * User List Item for Admin UI
 */
export interface AdminUserListItem {
  id: string
  email: string
  name: string
  role: 'creator' | 'supporter' | 'admin'
  verificationStatus: UserVerificationStatus
  isBlocked: boolean
  totalCampaigns: number
  totalDonations: number
  createdAt: string
  lastLoginAt?: string
}

/**
 * Admin User Service
 * Manages user viewing, verification, blocking, and reporting
 */
class AdminUserService {
  /**
   * Get paginated list of all users
   */
  async getUsers(page: number = 1, limit: number = 20, filters?: {
    role?: 'creator' | 'supporter'
    verificationStatus?: UserVerificationStatus
    isBlocked?: boolean
    search?: string
  }): Promise<{
    users: AdminUserListItem[]
    total: number
    page: number
    limit: number
  }> {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(filters?.role && { role: filters.role }),
        ...(filters?.verificationStatus && { verificationStatus: filters.verificationStatus }),
        ...(filters?.isBlocked !== undefined && { isBlocked: filters.isBlocked.toString() }),
        ...(filters?.search && { search: filters.search }),
      })

      const response = await apiClient.get(`/admin/users?${params}`)
      return response.data
    } catch (error) {
      console.error('Failed to fetch users:', error)
      throw error
    }
  }

  /**
   * Get detailed user profile
   */
  async getUserProfile(userId: string): Promise<AdminUserProfile> {
    try {
      const response = await apiClient.get(`/admin/users/${userId}`)
      return response.data
    } catch (error) {
      console.error(`Failed to fetch user profile for ${userId}:`, error)
      throw error
    }
  }

  /**
   * Verify a user (change status to 'verified')
   */
  async verifyUser(userId: string, notes?: string): Promise<AdminUserProfile> {
    try {
      const response = await apiClient.patch(`/admin/users/${userId}/verify`, {
        notes,
      })
      return response.data
    } catch (error) {
      console.error(`Failed to verify user ${userId}:`, error)
      throw error
    }
  }

  /**
   * Reject user verification
   */
  async rejectVerification(userId: string, reason: string): Promise<AdminUserProfile> {
    try {
      const response = await apiClient.patch(`/admin/users/${userId}/reject-verification`, {
        reason,
      })
      return response.data
    } catch (error) {
      console.error(`Failed to reject verification for ${userId}:`, error)
      throw error
    }
  }

  /**
   * Block a user account
   */
  async blockUser(userId: string, reason: UserBlockReason, explanation?: string): Promise<AdminUserProfile> {
    try {
      const response = await apiClient.patch(`/admin/users/${userId}/block`, {
        reason,
        explanation,
      })
      return response.data
    } catch (error) {
      console.error(`Failed to block user ${userId}:`, error)
      throw error
    }
  }

  /**
   * Unblock a user account
   */
  async unblockUser(userId: string): Promise<AdminUserProfile> {
    try {
      const response = await apiClient.patch(`/admin/users/${userId}/unblock`)
      return response.data
    } catch (error) {
      console.error(`Failed to unblock user ${userId}:`, error)
      throw error
    }
  }

  /**
   * Get user reports (reports ABOUT this user)
   */
  async getUserReports(userId: string): Promise<UserReport[]> {
    try {
      const response = await apiClient.get(`/admin/users/${userId}/reports`)
      return response.data
    } catch (error) {
      console.error(`Failed to fetch reports for user ${userId}:`, error)
      throw error
    }
  }

  /**
   * Get all pending reports in system
   */
  async getPendingReports(page: number = 1, limit: number = 20): Promise<{
    reports: UserReport[]
    total: number
  }> {
    try {
      const response = await apiClient.get(`/admin/reports?page=${page}&limit=${limit}&status=pending`)
      return response.data
    } catch (error) {
      console.error('Failed to fetch pending reports:', error)
      throw error
    }
  }

  /**
   * Resolve a user report
   */
  async resolveReport(reportId: string, action: 'dismiss' | 'block_user' | 'warn_user', notes?: string): Promise<UserReport> {
    try {
      const response = await apiClient.patch(`/admin/reports/${reportId}/resolve`, {
        action,
        notes,
      })
      return response.data
    } catch (error) {
      console.error(`Failed to resolve report ${reportId}:`, error)
      throw error
    }
  }

  /**
   * Create manual user report (admin action)
   */
  async createManualReport(userId: string, reason: string, description: string): Promise<UserReport> {
    try {
      const response = await apiClient.post(`/admin/reports`, {
        reportedUserId: userId,
        reason,
        description,
        isManualReport: true,
      })
      return response.data
    } catch (error) {
      console.error(`Failed to create report for user ${userId}:`, error)
      throw error
    }
  }

  /**
   * Export user data (GDPR compliance)
   */
  async exportUserData(userId: string): Promise<Blob> {
    try {
      const response = await apiClient.get(`/admin/users/${userId}/export`, {
        responseType: 'blob',
      })
      return response.data
    } catch (error) {
      console.error(`Failed to export user data for ${userId}:`, error)
      throw error
    }
  }

  /**
   * Delete user account (hard delete with anonymization option)
   */
  async deleteUser(userId: string, anonymize: boolean = true): Promise<{ success: boolean }> {
    try {
      const response = await apiClient.delete(`/admin/users/${userId}`, {
        data: { anonymize },
      })
      return response.data
    } catch (error) {
      console.error(`Failed to delete user ${userId}:`, error)
      throw error
    }
  }

  /**
   * Get user statistics for admin dashboard
   */
  async getUserStatistics(): Promise<{
    totalUsers: number
    creatorsCount: number
    supportersCount: number
    verifiedCount: number
    blockedCount: number
    newUsersThisWeek: number
    pendingVerifications: number
  }> {
    try {
      const response = await apiClient.get('/admin/users/statistics')
      return response.data
    } catch (error) {
      console.error('Failed to fetch user statistics:', error)
      throw error
    }
  }
}

export const adminUserService = new AdminUserService()
