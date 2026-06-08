import { apiClient } from '@/lib/api'

/**
 * Category for Content Management
 */
export interface AdminCategory {
  id: string
  name: string
  group: string
  description: string
  icon?: string
  order: number
  isActive: boolean
  campaignCount: number
}

/**
 * Platform Content
 */
export interface PlatformContent {
  id: string
  type: 'manifesto' | 'about' | 'terms' | 'privacy'
  title: string
  content: string
  htmlContent: string
  updatedAt: string
  updatedBy: string
  version: number
}

/**
 * Platform Settings (Editable)
 */
export interface PlatformSettings {
  id: string
  platformFeePercentage: number
  sweepstakesPoolAmount: number
  minDonationAmount: number
  maxDonationAmount: number
  minCampaignGoal: number
  maxCampaignGoal: number
  campaignDurationMin: number
  campaignDurationMax: number
  sweepstakesDrawingSchedule: string
  payoutThreshold: number
  maintenanceMode: boolean
  maintenanceMessage?: string
  updatedAt: string
  updatedBy: string
}

/**
 * Admin Content Service
 * Manages categories, manifesto, terms, and platform settings
 */
class AdminContentService {
  /**
   * Get all categories
   */
  async getCategories(): Promise<AdminCategory[]> {
    try {
      const response = await apiClient.get('/admin/categories')
      return response.data
    } catch (error) {
      console.error('Failed to fetch categories:', error)
      throw error
    }
  }

  /**
   * Create new category
   */
  async createCategory(data: {
    name: string
    group: string
    description: string
    icon?: string
    order: number
  }): Promise<AdminCategory> {
    try {
      const response = await apiClient.post('/admin/categories', data)
      return response.data
    } catch (error) {
      console.error('Failed to create category:', error)
      throw error
    }
  }

  /**
   * Update category
   */
  async updateCategory(categoryId: string, data: Partial<AdminCategory>): Promise<AdminCategory> {
    try {
      const response = await apiClient.patch(`/admin/categories/${categoryId}`, data)
      return response.data
    } catch (error) {
      console.error(`Failed to update category ${categoryId}:`, error)
      throw error
    }
  }

  /**
   * Delete category
   */
  async deleteCategory(categoryId: string): Promise<{ success: boolean }> {
    try {
      const response = await apiClient.delete(`/admin/categories/${categoryId}`)
      return response.data
    } catch (error) {
      console.error(`Failed to delete category ${categoryId}:`, error)
      throw error
    }
  }

  /**
   * Reorder categories (bulk update)
   */
  async reorderCategories(categories: { id: string; order: number }[]): Promise<AdminCategory[]> {
    try {
      const response = await apiClient.post('/admin/categories/reorder', { categories })
      return response.data
    } catch (error) {
      console.error('Failed to reorder categories:', error)
      throw error
    }
  }

  /**
   * Get platform content (manifesto, about, terms, privacy)
   */
  async getPlatformContent(type: 'manifesto' | 'about' | 'terms' | 'privacy'): Promise<PlatformContent> {
    try {
      const response = await apiClient.get(`/admin/content/${type}`)
      return response.data
    } catch (error) {
      console.error(`Failed to fetch content for ${type}:`, error)
      throw error
    }
  }

  /**
   * Update platform content
   */
  async updatePlatformContent(
    type: 'manifesto' | 'about' | 'terms' | 'privacy',
    data: { title: string; content: string }
  ): Promise<PlatformContent> {
    try {
      const response = await apiClient.patch(`/admin/content/${type}`, data)
      return response.data
    } catch (error) {
      console.error(`Failed to update ${type} content:`, error)
      throw error
    }
  }

  /**
   * Get all platform content versions history
   */
  async getContentVersionHistory(type: 'manifesto' | 'about' | 'terms' | 'privacy'): Promise<PlatformContent[]> {
    try {
      const response = await apiClient.get(`/admin/content/${type}/history`)
      return response.data
    } catch (error) {
      console.error(`Failed to fetch version history for ${type}:`, error)
      throw error
    }
  }

  /**
   * Restore previous version of content
   */
  async restoreContentVersion(type: string, version: number): Promise<PlatformContent> {
    try {
      const response = await apiClient.post(`/admin/content/${type}/restore`, { version })
      return response.data
    } catch (error) {
      console.error(`Failed to restore version ${version} for ${type}:`, error)
      throw error
    }
  }

  /**
   * Get platform settings (editable)
   */
  async getPlatformSettings(): Promise<PlatformSettings> {
    try {
      const response = await apiClient.get('/admin/settings')
      return response.data
    } catch (error) {
      console.error('Failed to fetch platform settings:', error)
      throw error
    }
  }

  /**
   * Update platform settings
   */
  async updatePlatformSettings(data: Partial<PlatformSettings>): Promise<PlatformSettings> {
    try {
      const response = await apiClient.patch('/admin/settings', data)
      return response.data
    } catch (error) {
      console.error('Failed to update platform settings:', error)
      throw error
    }
  }

  /**
   * Update maintenance mode
   */
  async setMaintenanceMode(enabled: boolean, message?: string): Promise<PlatformSettings> {
    try {
      const response = await apiClient.patch('/admin/settings/maintenance', {
        maintenanceMode: enabled,
        maintenanceMessage: message,
      })
      return response.data
    } catch (error) {
      console.error('Failed to set maintenance mode:', error)
      throw error
    }
  }

  /**
   * Get settings changelog
   */
  async getSettingsChangelog(limit: number = 50): Promise<Array<{
    timestamp: string
    changedBy: string
    changes: Record<string, { old: any; new: any }>
  }>> {
    try {
      const response = await apiClient.get(`/admin/settings/changelog?limit=${limit}`)
      return response.data
    } catch (error) {
      console.error('Failed to fetch settings changelog:', error)
      throw error
    }
  }

  /**
   * Load default settings (reset to defaults)
   */
  async loadDefaultSettings(): Promise<PlatformSettings> {
    try {
      const response = await apiClient.post('/admin/settings/reset-to-defaults')
      return response.data
    } catch (error) {
      console.error('Failed to reset settings to defaults:', error)
      throw error
    }
  }

  /**
   * Validate settings before saving
   */
  async validateSettings(settings: Partial<PlatformSettings>): Promise<{ valid: boolean; errors?: string[] }> {
    try {
      const response = await apiClient.post('/admin/settings/validate', settings)
      return response.data
    } catch (error) {
      console.error('Failed to validate settings:', error)
      throw error
    }
  }
}

export const adminContentService = new AdminContentService()
