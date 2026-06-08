import { apiClient } from '@/lib/api'

/**
 * Donation Service
 * Handles all donation-related API calls
 */

export interface DonationAmount {
  gross: number // user's input (cents)
  platformFee: number // 20% of gross (cents)
  net: number // gross - fee (cents)
}

export interface PaymentMethodDetails {
  type: 'venmo' | 'paypal' | 'cashapp' | 'bank' | 'crypto' | 'other'
  [key: string]: string
}

export interface CreateDonationRequest {
  campaignId: string
  amount: number // cents
  paymentMethod: string // just the type: 'venmo' | 'paypal' | etc
  screenshotProof?: File | string // File object or undefined
  referralCode?: string // ✅ ADDED: Optional referral code for share conversions
}

export interface Donation {
  transactionId: string
  id: string
  campaignId: string
  campaignTitle: string
  donorId: string
  donorEmail: string
  donorName: string
  amount: number // cents (gross)
  platformFee: number // cents
  netAmount: number // cents
  paymentMethod: PaymentMethodDetails
  status: 'pending' | 'verified' | 'rejected'
  statusReason?: string
  createdAt: string
  verifiedAt?: string
  // ✅ ADDED: Share reward info if donation came from share referral
  share_reward?: {
    transaction_id: string
    amount_cents: number
    amount_dollars: string
    status: string
    hold_until_date: string
    hold_days_remaining: number
    message: string
  }
}

export interface DonationStats {
  totalDonations: number
  totalAmount: number // cents
  averageDonation: number // cents
  recentDonations: Donation[]
}

export interface CampaignDonationMetrics {
  campaignId: string
  totalDonations: number
  totalRaised: number // cents
  avgDonation: number // cents
  topDonor?: {
    name: string
    amount: number
  }
  donationsByDate: Array<{
    date: string
    count: number
    amount: number
  }>
}

class DonationService {
  /**
   * Calculate donation amounts with platform fee
   * @param gross User's input amount in cents
   * @returns Object with gross, fee, and net amounts
   */
  calculateFee(gross: number): DonationAmount {
    const platformFee = Math.round(gross * 0.2) // 20% fee
    const net = gross - platformFee

    return {
      gross,
      platformFee,
      net,
    }
  }

  /**
   * Create a new donation
   */
  async createDonation(data: CreateDonationRequest): Promise<Donation> {
    // Send as JSON (backend has express.json() middleware)
    // Backend expects: amount in DOLLARS, paymentMethod as string
    const payload: any = {
      amount: data.amount, // Already in dollars from frontend
      paymentMethod: data.paymentMethod,
    }

    // ✅ Include referral code if provided (for share conversion attribution)
    if (data.referralCode) {
      payload.referralCode = data.referralCode
    }

    try {
      const response = await apiClient.post<Donation>(
        `/campaigns/${data.campaignId}/donations`,
        payload
      )
      return response.data
    } catch (error) {
      throw error
    }
  }

  /**
   * Get my donations
   */
  async getMyDonations(page = 1, limit = 25): Promise<{
    donations: Donation[]
    total: number
    pages: number
  }> {
    const response = await apiClient.get<{
      success: boolean
      data: {
        donations: Donation[]
        pagination: { page: number; limit: number; total: number; pages: number }
      }
    }>(`/donations`, {
      params: { page, limit },
    })
    const { donations, pagination } = response.data.data
    return {
      donations,
      total: pagination.total,
      pages: pagination.pages,
    }
  }

  /**
   * Get my donation by ID
   */
  async getDonation(donationId: string): Promise<Donation> {
    const response = await apiClient.get<{
      success: boolean
      data: Donation
    }>(`/donations/${donationId}`)
    return response.data.data
  }

  /**
   * Get campaign donation metrics
   */
  async getCampaignDonationMetrics(campaignId: string): Promise<CampaignDonationMetrics> {
    const response = await apiClient.get<CampaignDonationMetrics>(
      `/campaigns/${campaignId}/donations/metrics`
    )
    return response.data
  }

  /**
   * Get all donations for a campaign (admin)
   */
  async getCampaignDonations(
    campaignId: string,
    page = 1,
    limit = 25,
    status?: 'pending' | 'verified' | 'rejected'
  ): Promise<{
    donations: Donation[]
    total: number
    pages: number
  }> {
    const response = await apiClient.get<{
      donations: Donation[]
      total: number
      pages: number
    }>(`/admin/campaigns/${campaignId}/donations`, {
      params: { page, limit, status },
    })
    return response.data
  }

  /**
   * Verify a donation (admin)
   */
  async verifyDonation(donationId: string): Promise<Donation> {
    const response = await apiClient.post<Donation>(
      `/admin/donations/${donationId}/verify`
    )
    return response.data
  }

  /**
   * Reject a donation (admin)
   */
  async rejectDonation(
    donationId: string,
    reason: string
  ): Promise<Donation> {
    const response = await apiClient.post<Donation>(
      `/admin/donations/${donationId}/reject`,
      { reason }
    )
    return response.data
  }

  /**
   * Get donation statistics for dashboard
   */
  async getDonationStats(): Promise<DonationStats> {
    const response = await apiClient.get<DonationStats>(`/donations/stats`)
    return response.data
  }
}

export const donationService = new DonationService()
