import { apiClient } from '@/lib/api'

/**
 * New Sweepstakes Service (v2)
 * Simplified monthly random drawing system
 * 
 * Models:
 * - Sweepstakes: Monthly drawing with prize
 * - WinnerClaim: Prize claim tracking
 */

// ============================================
// TYPES & INTERFACES
// ============================================

export interface Sweepstakes {
  id: string
  month: string // "2026-04"
  title: string
  description: string
  prizeAmount: number // in cents
  prizeAmountDollars: string
  prizeDescription: string
  entryStartDate: string
  entryEndDate: string
  drawingDate: string
  claimDeadline: string
  status: 'active' | 'drawing' | 'completed' | 'claimed' | 'cancelled'
  isDrawingOpen: boolean
  winnerId?: string
}

export interface WinnerCheckResult {
  drawn: boolean
  winner?: boolean | null
  prizeAmount?: number
  prizeAmountDollars?: string
  claimDeadline?: string
  claimStatus?: string | null
  canClaim?: boolean
  message?: string
}

export interface PrizeClaimRequest {
  accountName: string
  accountNumber: string
  routingNumber: string
  bankName: string
  paymentMethod?: string
}

export interface PrizeClaimResponse {
  claimId: string
  status: 'pending' | 'approved' | 'claimed' | 'rejected'
  prizeAmount: string
  expiresAt: string
}

export interface WinnerClaim {
  id: string
  sweepstakesId: string
  winnerId: string
  winnerEmail: string
  prizeAmount: string
  status: 'pending' | 'approved' | 'claimed' | 'rejected' | 'expired'
  claimedAt: string
  approvedAt?: string
  rejectionReason?: string
}

// ============================================
// PUBLIC SERVICE METHODS
// ============================================

/**
 * Get current active sweepstakes drawing
 */
export async function getCurrentSweepstakes(): Promise<{ success: boolean; data: Sweepstakes }> {
  const response = await apiClient.get('/sweepstakes/current')
  return response.data
}

/**
 * Get all sweepstakes (admin only)
 */
export async function getAllSweepstakes(): Promise<{ success: boolean; data: Sweepstakes[] }> {
  const response = await apiClient.get('/sweepstakes/admin/all')
  return response.data
}

/**
 * Check if current user won the drawing
 */
export async function checkWinner(sweepstakesId: string): Promise<{ success: boolean; data: WinnerCheckResult }> {
  const response = await apiClient.get(`/sweepstakes/${sweepstakesId}/winner`)
  return response.data
}

/**
 * Claim prize as winner
 */
export async function claimPrize(
  sweepstakesId: string,
  paymentDetails: PrizeClaimRequest
): Promise<{ success: boolean; data: PrizeClaimResponse }> {
  const response = await apiClient.post(`/sweepstakes/${sweepstakesId}/claim`, paymentDetails)
  return response.data
}

// ============================================
// ADMIN SERVICE METHODS
// ============================================

/**
 * Create a new monthly sweepstakes (admin only)
 */
export async function createSweepstakes(
  month: string,
  prizeAmount: number
): Promise<{ success: boolean; data: Sweepstakes }> {
  const response = await apiClient.post('/sweepstakes/admin/sweepstakes', { month, prizeAmount })
  return response.data
}

/**
 * Select winner for sweepstakes (admin only)
 */
export async function selectWinner(
  sweepstakesId: string,
  options: { winnerId?: string } | { randomSelection: boolean }
): Promise<{ success: boolean; data: any }> {
  const response = await apiClient.post(`/sweepstakes/${sweepstakesId}/select-winner`, options)
  return response.data
}

/**
 * Get all claims for a sweepstakes (admin only)
 */
export async function getClaimsForSweepstakes(sweepstakesId: string): Promise<{ success: boolean; data: any }> {
  const response = await apiClient.get(`/sweepstakes/${sweepstakesId}/claims`)
  return response.data
}

/**
 * Approve a prize claim (admin only)
 */
export async function approveClaim(
  sweepstakesId: string,
  claimId: string,
  options?: { adminNotes?: string }
): Promise<{ success: boolean; data: any }> {
  const response = await apiClient.put(`/sweepstakes/${sweepstakesId}/claims/${claimId}/approve`, options || {})
  return response.data
}

/**
 * Reject a prize claim (admin only)
 */
export async function rejectClaim(
  sweepstakesId: string,
  claimId: string,
  options: { rejectionReason: string; adminNotes?: string }
): Promise<{ success: boolean; data: any }> {
  const response = await apiClient.put(`/sweepstakes/${sweepstakesId}/claims/${claimId}/reject`, options)
  return response.data
}

// ============================================
// SERVICE CLASS (for backward compatibility)
// ============================================

class SimpleSweepstakesService {
  async getCurrentSweepstakes() {
    return getCurrentSweepstakes()
  }

  async checkWinner(sweepstakesId: string) {
    return checkWinner(sweepstakesId)
  }

  async claimPrize(sweepstakesId: string, paymentDetails: PrizeClaimRequest) {
    return claimPrize(sweepstakesId, paymentDetails)
  }

  // Admin methods
  async createSweepstakes(month: string, prizeAmount: number) {
    return createSweepstakes(month, prizeAmount)
  }

  async selectWinner(sweepstakesId: string, options: any) {
    return selectWinner(sweepstakesId, options)
  }

  async getClaimsForSweepstakes(sweepstakesId: string) {
    return getClaimsForSweepstakes(sweepstakesId)
  }

  async approveClaim(sweepstakesId: string, claimId: string, options?: any) {
    return approveClaim(sweepstakesId, claimId, options)
  }

  async rejectClaim(sweepstakesId: string, claimId: string, options: any) {
    return rejectClaim(sweepstakesId, claimId, options)
  }
}

export const simpleSweepstakesService = new SimpleSweepstakesService()

// Backward compatibility alias
export const sweepstakesService = simpleSweepstakesService
