import { apiClient } from '@/lib/api'
import { PaymentMethod } from '@/components/campaign/AddPaymentMethodForm'

interface ApiResponse<T> {
  success: boolean
  data: T
  error?: string
}

/**
 * Map backend payment method response to frontend interface
 * Backend uses snake_case with MongoDB _id, frontend uses camelCase with id
 */
function mapPaymentMethod(raw: any): PaymentMethod {
  return {
    // Core fields
    id: raw._id || raw.id, // ← Critical: Map _id to id
    type: raw.type,
    provider: raw.provider,
    displayName: raw.display_name || `${raw.bank_name || raw.mobile_number || raw.card_brand || raw.type}`,
    isPrimary: raw.is_primary,
    status: raw.status,
    verificationStatus: raw.verification_status,

    // Stripe fields (card)
    card_brand: raw.card_brand,
    cardLastFour: raw.card_last_four,
    card_last_four: raw.card_last_four,
    card_expiry_month: raw.card_expiry_month,
    card_expiry_year: raw.card_expiry_year,

    // Bank transfer fields (flat for lists)
    bank_account_holder: raw.bank_account_holder,
    bankAccountHolder: raw.bank_account_holder,
    bank_name: raw.bank_name,
    bankName: raw.bank_name,
    bank_account_type: raw.bank_account_type as any,
    bankAccountType: raw.bank_account_type as any,
    bank_account_last_four: raw.bank_account_last_four,
    bankAccountLastFour: raw.bank_account_last_four,

    // Mobile money fields (flat)
    mobile_number: raw.mobile_number,
    mobileNumber: raw.mobile_number,
    mobile_provider: raw.mobile_money_provider,
    mobileProvider: raw.mobile_money_provider,
  }
}

/**
 * Payment Method Service
 * Handles all API calls for payment method management
 * Uses centralized apiClient with proper baseURL and auth headers
 */
export const paymentMethodService = {
  /**
   * Get all payment methods for the current user
   */
  async getPaymentMethods(): Promise<ApiResponse<PaymentMethod[]>> {
    try {
      const response = await apiClient.get('/payment-methods')
      // Backend returns { success, data: { payment_methods: [], count: X } }
      const paymentMethods = response.data.data?.payment_methods || []
      // Map all payment methods from backend format to frontend interface
      const mappedMethods = paymentMethods.map(mapPaymentMethod)
      return {
        success: true,
        data: mappedMethods,
      }
    } catch (error) {
      const errorMessage = (error as any)?.response?.data?.message
      return {
        success: false,
        data: [],
        error: errorMessage || 'Failed to fetch payment methods',
      }
    }
  },

  /**
   * Get primary payment method for the current user
   */
  async getPrimaryPaymentMethod(): Promise<ApiResponse<PaymentMethod>> {
    try {
      const response = await apiClient.get('/payment-methods/primary')
      // Backend returns { success, data: { payment_method: {...} } }
      const paymentMethod = response.data.data?.payment_method || response.data.data
      // Map to frontend interface
      const mapped = mapPaymentMethod(paymentMethod)
      return {
        success: true,
        data: mapped,
      }
    } catch (error) {
      const errorMessage = (error as any)?.response?.data?.message
      return {
        success: false,
        data: null as any,
        error: errorMessage || 'Failed to fetch primary payment method',
      }
    }
  },

  /**
   * Add a new payment method
   * Converts frontend format to backend format
   */
  async addPaymentMethod(method: PaymentMethod): Promise<ApiResponse<PaymentMethod>> {
    try {
      // Convert frontend format to backend format
      const backendPayload = this.convertToBackendFormat(method)
      
      const response = await apiClient.post('/payment-methods', backendPayload)
      // Backend returns { success, data: { payment_method: {...} } }
      const paymentMethod = response.data.data?.payment_method || response.data.data
      // Map to frontend interface
      const mapped = mapPaymentMethod(paymentMethod)
      return {
        success: true,
        data: mapped,
      }
    } catch (error) {
      const errorMessage = (error as any)?.response?.data?.message
      return {
        success: false,
        data: null as any,
        error: errorMessage || 'Failed to add payment method',
      }
    }
  },

  /**
   * Convert frontend PaymentMethod format to backend API format
   */
  convertToBackendFormat(method: PaymentMethod): Record<string, any> {
    const basePayload = {
      type: method.type,
    }

    switch (method.type) {
      case 'bank_transfer':
        return {
          ...basePayload,
          bank_account: method.bank_account,
        }

      case 'mobile_money':
        return {
          ...basePayload,
          mobile_number: method.mobile_number,
          mobile_provider: method.mobile_provider,
        }

      case 'stripe':
        return {
          ...basePayload,
          stripe_token: method.stripe_token,
        }

      default:
        return basePayload
    }
  },

  /**
   * Update an existing payment method
   * Converts frontend format to backend format
   */
  async updatePaymentMethod(
    id: string,
    method: Partial<PaymentMethod>
  ): Promise<ApiResponse<PaymentMethod>> {
    try {
      // Convert frontend format to backend format (only convert type-specific fields)
      const backendPayload = this.convertToBackendFormat(method as PaymentMethod)
      
      const response = await apiClient.patch(`/payment-methods/${id}`, backendPayload)
      // Backend returns { success, data: { payment_method: {...} } }
      const paymentMethod = response.data.data?.payment_method || response.data.data
      // Map to frontend interface
      const mapped = mapPaymentMethod(paymentMethod)
      return {
        success: true,
        data: mapped,
      }
    } catch (error) {
      const errorMessage = (error as any)?.response?.data?.message
      return {
        success: false,
        data: null as any,
        error: errorMessage || 'Failed to update payment method',
      }
    }
  },

  /**
   * Delete a payment method
   */
  async deletePaymentMethod(id: string): Promise<ApiResponse<null>> {
    try {
      await apiClient.delete(`/payment-methods/${id}`)
      return {
        success: true,
        data: null,
      }
    } catch (error) {
      const errorMessage = (error as any)?.response?.data?.message
      return {
        success: false,
        data: null,
        error: errorMessage || 'Failed to delete payment method',
      }
    }
  },

  /**
   * Set a payment method as primary
   */
  async setPrimaryPaymentMethod(id: string): Promise<ApiResponse<PaymentMethod>> {
    try {
      const response = await apiClient.patch(
        `/payment-methods/${id}/set-primary`
      )
      // Backend returns { success, data: { payment_method: {...} } }
      const paymentMethod = response.data.data?.payment_method || response.data.data
      // Map to frontend interface
      const mapped = mapPaymentMethod(paymentMethod)
      return {
        success: true,
        data: mapped,
      }
    } catch (error) {
      const errorMessage = (error as any)?.response?.data?.message
      return {
        success: false,
        data: null as any,
        error: errorMessage || 'Failed to set primary payment method',
      }
    }
  },

  /**
   * Verify a payment method with a test transaction
   */
  async verifyPaymentMethod(id: string): Promise<ApiResponse<null>> {
    try {
      await apiClient.post(`/payment-methods/${id}/verify`)
      return {
        success: true,
        data: null,
      }
    } catch (error) {
      const errorMessage = (error as any)?.response?.data?.message
      return {
        success: false,
        data: null,
        error: errorMessage || 'Failed to verify payment method',
      }
    }
  },

  /**
   * Get supported payment methods (for UI population)
   */
  async getSupportedPaymentMethods(): Promise<
    ApiResponse<{
      type: string
      label: string
      emoji: string
      icon: string
      international?: boolean
    }[]>
  > {
    try {
      const response = await apiClient.get('/payment-methods/supported')
      return {
        success: true,
        data: response.data.data || [],
      }
    } catch (error) {
      // Return hardcoded list as fallback
      return {
        success: true,
        data: [
          { type: 'paypal', label: 'PayPal', emoji: '🅿️', icon: 'PayPal' },
          { type: 'venmo', label: 'Venmo', emoji: '💬', icon: 'MessageCircle' },
          { type: 'cashapp', label: 'Cash App', emoji: '💵', icon: 'DollarSign' },
          {
            type: 'bank',
            label: 'Bank Transfer',
            emoji: '🏦',
            icon: 'Building2',
          },
          { type: 'crypto', label: 'Cryptocurrency', emoji: '₿', icon: 'Coins' },
          {
            type: 'wise',
            label: 'Wise',
            emoji: '🌍',
            icon: 'Globe',
            international: true,
          },
          {
            type: 'sendwave',
            label: 'SendWave',
            emoji: '📱',
            icon: 'Smartphone',
            international: true,
          },
          {
            type: 'westernunion',
            label: 'Western Union',
            emoji: '🌐',
            icon: 'Send',
            international: true,
          },
          {
            type: 'other',
            label: 'Other',
            emoji: '📝',
            icon: 'FileText',
          },
        ],
      }
    }
  },
}
