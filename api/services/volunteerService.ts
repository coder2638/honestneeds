import { apiClient } from '@/lib/api'
import { AxiosError } from 'axios'

/**
 * Volunteer Service
 * Handles all volunteer/Helping Hands system API calls
 */

export type VolunteerStatus = 'pending' | 'accepted' | 'declined' | 'completed'

export interface VolunteerSkill {
  name: string
  yearsOfExperience?: number
}

export interface CreateVolunteerOfferRequest {
  campaignId: string
  offerType: 'fundraising' | 'community_support' | 'direct_assistance' | 'other'
  title: string // e.g., "Helping with construction"
  description: string // What they're offering to help with
  skills: string[] // Array of skill names
  availabilityStartDate: string // ISO datetime string
  availabilityEndDate: string // ISO datetime string
  hoursPerWeek: number // Hours per week available
  estimatedHours: number // Total estimated hours
  experienceLevel: 'beginner' | 'intermediate' | 'expert'
  isCertified?: boolean // Optional certification flag
  certificationDetails?: string // Optional certification details
  contactEmail: string // Helper's email address
  contactPhone: string // Helper's phone number
}

export interface VolunteerOffer {
  id: string
  campaignId: string
  campaignTitle: string
  volunteerId: string
  volunteerName: string
  volunteerEmail: string
  volunteerPhone?: string
  title: string
  description: string
  skillsOffered: VolunteerSkill[]
  availability: {
    startDate: string
    endDate: string
    hoursPerWeek: number
  }
  contactEmail: string // Helper's email address
  contactPhone: string // Helper's phone number
  contact_details?: {
    email?: string
    phone?: string
  }
  status: VolunteerStatus
  createdAt: string
  acceptedAt?: string
  declinedAt?: string
  declineReason?: string
  completedAt?: string
  notes?: string // Creator notes after accepting/declining
}

export interface VolunteerStatistics {
  totalOffers: number
  acceptedOffers: number
  pendingOffers: number
  completedOffers: number
  averageHoursPerWeek: number
  topSkillsNeeded: Array<{
    skill: string
    demandCount: number
  }>
}

export interface CampaignVolunteerMetrics {
  campaignId: string
  totalVolunteerOffers: number
  acceptedVolunteers: number
  totalHoursCommitted: number
  skillsRepresented: string[]
  activeVolunteers: Array<{
    name: string
    skill: string
    hoursPerWeek: number
  }>
}

class VolunteerService {
  /**
   * Create a volunteer offer for a campaign
   * @param request Volunteer offer details
   * @returns Created volunteer offer
   */
  async createVolunteerOffer(request: CreateVolunteerOfferRequest): Promise<VolunteerOffer> {
    try {
      const response = await apiClient.post('/volunteers/offers', request)
      return this.transformVolunteerOffer(response.data.data)
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 'Failed to submit volunteer offer. Please try again.'
      )
    }
  }

  /**
   * Transform backend snake_case response to camelCase
   */
  private transformVolunteerOffer(data: any): VolunteerOffer {
    return {
      id: data.id || data._id,
      campaignId: data.campaign_id || data.campaignId,
      campaignTitle: data.campaign_title || data.campaignTitle,
      volunteerId: data.volunteer_id || data.volunteerId,
      volunteerName: data.volunteer_name || data.volunteerName,
      volunteerEmail: data.volunteer_email || data.volunteerEmail,
      volunteerPhone: data.volunteer_phone || data.volunteerPhone,
      title: data.title,
      description: data.description,
      skillsOffered: (data.skills_offered || data.skillsOffered || []).map((skill: any) => ({
        name: skill.name,
        yearsOfExperience: skill.years_of_experience || skill.yearsOfExperience,
      })),
      availability: {
        startDate: data.availability?.start_date || data.availability?.startDate,
        endDate: data.availability?.end_date || data.availability?.endDate,
        hoursPerWeek: data.availability?.hours_per_week || data.availability?.hoursPerWeek || 0,
      },
      contactEmail: data.contactEmail || data.contact_details?.email || '',
      contactPhone: data.contactPhone || data.contact_details?.phone || '',
      status: data.status,
      createdAt: data.created_at || data.createdAt,
      acceptedAt: data.accepted_at || data.acceptedAt,
      declinedAt: data.declined_at || data.declinedAt,
      declineReason: data.decline_reason || data.declineReason,
      completedAt: data.completed_at || data.completedAt,
      notes: data.notes,
    }
  }

  /**
   * Get campaign volunteer offers (creator view)
   * @param campaignId Campaign ID
   * @param status Filter by status (optional)
   * @returns List of volunteer offers
   */
  async getCampaignVolunteerOffers(
    campaignId: string,
    status?: VolunteerStatus
  ): Promise<VolunteerOffer[]> {
    try {
      const params = status ? { status } : {}
      const response = await apiClient.get(`/campaigns/${campaignId}/volunteer-offers`, {
        params,
      })
      const offers = response.data.data || []
      return offers.map((offer: any) => this.transformVolunteerOffer(offer))
    } catch (error) {
      const axiosError = error as AxiosError
      // Return empty array for 404 errors (endpoint not implemented)
      if (axiosError.response?.status === 404) {
        console.debug(`Volunteer offers endpoint not available for campaign ${campaignId}`)
        return []
      }
      const errorMessage = (axiosError.response?.data as Record<string, string>)?.message
      throw new Error(
        errorMessage || 'Failed to fetch volunteer offers. Please try again.'
      )
    }
  }

  /**
   * Get a specific volunteer offer
   * @param volunteerId Volunteer offer ID
   * @returns Volunteer offer details
   */
  async getVolunteerOffer(volunteerId: string): Promise<VolunteerOffer> {
    try {
      const response = await apiClient.get(`/volunteers/offers/${volunteerId}`)
      return this.transformVolunteerOffer(response.data.data)
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 'Failed to fetch volunteer offer. Please try again.'
      )
    }
  }

  /**
   * Accept a volunteer offer (creator action)
   * @param volunteerId Volunteer offer ID
   * @param notes Optional notes for the volunteer
   * @returns Updated volunteer offer
   */
  async acceptVolunteerOffer(volunteerId: string, notes?: string): Promise<VolunteerOffer> {
    try {
      const response = await apiClient.patch(`/volunteers/offers/${volunteerId}/accept`, {
        notes,
      })
      return this.transformVolunteerOffer(response.data.data)
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 'Failed to accept volunteer offer. Please try again.'
      )
    }
  }

  /**
   * Decline a volunteer offer (creator action)
   * @param volunteerId Volunteer offer ID
   * @param declineReason Reason for declining
   * @param notes Optional notes/feedback for the volunteer
   * @returns Updated volunteer offer
   */
  async declineVolunteerOffer(
    volunteerId: string,
    declineReason: string,
    notes?: string
  ): Promise<VolunteerOffer> {
    try {
      const response = await apiClient.patch(`/volunteers/offers/${volunteerId}/decline`, {
        declineReason,
        notes,
      })
      return this.transformVolunteerOffer(response.data.data)
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 'Failed to decline volunteer offer. Please try again.'
      )
    }
  }

  /**
   * Mark a volunteer offer as completed (creator action)
   * @param volunteerId Volunteer offer ID
   * @param notes Completion notes
   * @returns Updated volunteer offer
   */
  async completeVolunteerOffer(volunteerId: string, notes?: string): Promise<VolunteerOffer> {
    try {
      const response = await apiClient.patch(`/volunteers/offers/${volunteerId}/complete`, {
        notes,
      })
      return this.transformVolunteerOffer(response.data.data)
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 'Failed to mark offer as completed. Please try again.'
      )
    }
  }

  /**
   * Get user's volunteer offers (volunteer dashboard)
   * @param page Pagination page
   * @param limit Items per page
   * @returns List of volunteer offers from the current user
   */
  async getMyVolunteerOffers(page = 1, limit = 25): Promise<VolunteerOffer[]> {
    try {
      const response = await apiClient.get('/volunteers/my-offers', {
        params: { page, limit },
      })
      const offers = response.data.data || []
      return offers.map((offer: any) => this.transformVolunteerOffer(offer))
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message ||
          'Failed to fetch your volunteer offers. Please try again.'
      )
    }
  }

  /**
   * Get campaign volunteer statistics (creator analytics)
   * @param campaignId Campaign ID
   * @returns Volunteer statistics for the campaign
   */
  async getCampaignVolunteerMetrics(campaignId: string): Promise<CampaignVolunteerMetrics> {
    try {
      const response = await apiClient.get(`/campaigns/${campaignId}/volunteer-metrics`)
      return response.data.data
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message ||
          'Failed to fetch volunteer metrics. Please try again.'
      )
    }
  }

  /**
   * Get overall volunteer statistics (user dashboard)
   * @returns User's volunteer statistics
   */
  async getVolunteerStatistics(): Promise<VolunteerStatistics> {
    try {
      const response = await apiClient.get('/volunteers/statistics')
      return response.data.data
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message ||
          'Failed to fetch volunteer statistics. Please try again.'
      )
    }
  }
}

export const volunteerService = new VolunteerService()
