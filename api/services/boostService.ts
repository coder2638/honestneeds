import axios from 'axios'
import { CreateBoostSessionInput, BoostResponse, BoostSessionResponse } from '@/utils/boostValidationSchemas'

/**
 * Boost Service
 * Handles all boost-related API calls
 * Integrated with Next.js frontend
 */

class BoostService {
  private baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'
  private api = axios.create({
    baseURL: this.baseURL,
  });

  constructor() {
    // Add auth interceptor
    this.api.interceptors.request.use((config) => {
      const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Add response error handler
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Handle auth errors
          localStorage.removeItem('auth_token');
          window.location.href = '/auth/login';
        }
        return Promise.reject(error);
      }
    );
  }

  /**
   * Get available boost tiers
   */
  async getBoostTiers() {
    try {
      const response = await this.api.get('/boosts/tiers');
      return {
        success: true,
        data: response.data.data,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch boost tiers',
      };
    }
  }

  /**
   * Create a checkout session for boost purchase
   */
  async createCheckoutSession(data: CreateBoostSessionInput) {
    try {
      const response = await this.api.post<any>('/boosts/create-session', {
        campaign_id: data.campaign_id,
        tier: data.tier,
      });

      return {
        success: true,
        data: response.data.data as BoostSessionResponse,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to create checkout session',
      };
    }
  }

  /**
   * Get boost details for a specific campaign
   */
  async getCampaignBoost(campaignId: string) {
    try {
      const response = await this.api.get<any>(`/boosts/campaign/${campaignId}`);
      return {
        success: true,
        data: response.data.data,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch campaign boost',
      };
    }
  }

  /**
   * Get all active boosts for the current user
   */
  async getCreatorBoosts(page: number = 1, limit: number = 10) {
    try {
      const response = await this.api.get<any>('/boosts/my-boosts', {
        params: { page, limit },
      });

      return {
        success: true,
        data: response.data.data,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch your boosts',
      };
    }
  }

  /**
   * Extend an active boost for additional 30 days
   */
  async extendBoost(boostId: string) {
    try {
      const response = await this.api.post<any>(`/boosts/${boostId}/extend`);

      return {
        success: true,
        data: response.data.data,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to extend boost',
      };
    }
  }

  /**
   * Cancel an active boost
   */
  async cancelBoost(boostId: string, reason?: string) {
    try {
      const response = await this.api.post<any>(`/boosts/${boostId}/cancel`, {
        reason: reason || 'user_cancelled',
      });

      return {
        success: true,
        data: response.data,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to cancel boost',
      };
    }
  }

  /**
   * Update boost statistics (internal)
   */
  async updateBoostStats(boostId: string, views: number, engagement: number, conversions: number) {
    try {
      const response = await this.api.post<any>(`/boosts/${boostId}/update-stats`, {
        views,
        engagement,
        conversions,
      });

      return {
        success: true,
        data: response.data.data,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to update boost stats',
      };
    }
  }

  /**
   * Get Stripe checkout session status
   */
  async getSessionStatus(sessionId: string) {
    try {
      const response = await this.api.get<any>(`/boosts/session/${sessionId}/status`);

      return {
        success: true,
        data: response.data.data,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch session status',
      };
    }
  }
}

export default new BoostService();
