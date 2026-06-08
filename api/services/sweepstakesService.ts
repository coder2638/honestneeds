import type { DonationPaymentMethod } from '@/utils/validationSchemas'

/**
 * ⚠️ DEPRECATED: Old entry-based sweepstakes system
 * Use @/api/services/simpleSweepstakesService instead
 * 
 * This file is maintained for backward compatibility with existing imports
 * It re-exports the new simplified sweepstakes service
 */

// Re-export new service for backward compatibility
export { 
  simpleSweepstakesService as sweepstakesService,
  type Sweepstakes,
  type WinnerCheckResult,
  type PrizeClaimRequest,
  type PrizeClaimResponse,
  type WinnerClaim,
  getCurrentSweepstakes,
  getAllSweepstakes,
  checkWinner,
  claimPrize,
  createSweepstakes,
  selectWinner,
  getClaimsForSweepstakes,
  approveClaim,
  rejectClaim
} from './simpleSweepstakesService'

// ============================================
// DEPRECATED TYPES (for reference/migration only)
// ============================================

/**
 * @deprecated Use Sweepstakes from simpleSweepstakesService
 */
export interface SweepstakesEntry {
  id: string
  userId: string
  campaignId?: string
  entryType: 'campaign_creation' | 'donation' | 'share'
  count: number
  earnedAt: string
}

/**
 * @deprecated Use Sweepstakes from simpleSweepstakesService
 */
export interface SweepstakesEntryBreakdown {
  campaignCreation: number
  donations: number
  donationAmount: number // in cents
  shares: number
  total: number
}

/**
 * @deprecated Old system used time-based drawings
 */
export interface Drawing {
  id: string
  targetDate: string
  drawDate?: string
  prize: number // in cents
  winners: number
  currentEntries: number
  status: 'pending' | 'drawn' | 'completed'
  createdAt: string
}

/**
 * @deprecated Use Sweepstakes from simpleSweepstakesService
 */
export interface UserDrawing {
  id: string
  targetDate: string
  drawDate?: string
  prize: number
  winners: number
  currentEntries: number
  status: 'pending' | 'drawn' | 'completed'
  userEntries: number
  userStatus: 'not_won' | 'won_unclaimed' | 'won_claimed'
  userPrize?: number
  createdAt: string
}

/**
 * @deprecated Use WinnerClaim from simpleSweepstakesService
 */
export interface Winner {
  id: string
  userId: string
  drawingId: string
  userName: string
  partialName: string
  entryCount: number
  position: number
  claimedAt?: string
  createdAt: string
}

/**
 * @deprecated Use WinnerClaim from simpleSweepstakesService
 */
export interface Winnings {
  id: string
  userId: string
  drawingId: string
  drawingDate: string
  prize: number // in cents
  status: 'won_unclaimed' | 'won_claimed'
  claimDate?: string
  claimedVia?: DonationPaymentMethod
  createdAt: string
}

/**
 * @deprecated Old admin stats format
 */
export interface AdminDrawingStats {
  drawingId: string
  targetDate: string
  currentEntries: number
  winnersCount: number
  topParticipants: Array<{
    name: string
    entryCount: number
  }>
  revenue?: number
}

/**
 * @deprecated Use individual Sweepstakes queries
 */
export interface SweepstakesStats {
  currentDrawing: Drawing
  userEntries: SweepstakesEntryBreakdown
  winnings: Winnings[]
  leaderboard: Winner[]
}


// ============================================
// DEPRECATED TYPES (kept for reference only)
// ============================================

// OLD TYPES - DO NOT USE
// Use Sweepstakes, WinnerClaim types from simpleSweepstakesService instead

export interface SweepstakesEntry {
  id: string
  userId: string
  campaignId?: string
  entryType: 'campaign_creation' | 'donation' | 'share'
  count: number
  earnedAt: string
}

export interface SweepstakesEntryBreakdown {
  campaignCreation: number
  donations: number
  donationAmount: number // in cents
  shares: number
  total: number
}

export interface Drawing {
  id: string
  targetDate: string
  drawDate?: string
  prize: number // in cents
  winners: number
  currentEntries: number
  status: 'pending' | 'drawn' | 'completed'
  createdAt: string
}

export interface UserDrawing {
  id: string
  targetDate: string
  drawDate?: string
  prize: number
  winners: number
  currentEntries: number
  status: 'pending' | 'drawn' | 'completed'
  userEntries: number
  userStatus: 'not_won' | 'won_unclaimed' | 'won_claimed'
  userPrize?: number // if won, the user's actual prize (may differ from total prize)
  createdAt: string
}

export interface Winner {
  id: string
  userId: string
  drawingId: string
  userName: string
  partialName: string // "John D."
  entryCount: number
  position: number
  claimedAt?: string
  createdAt: string
}

export interface Winnings {
  id: string
  userId: string
  drawingId: string
  drawingDate: string
  prize: number // in cents
  status: 'won_unclaimed' | 'won_claimed'
  claimDate?: string
  claimedVia?: DonationPaymentMethod
  createdAt: string
}

export interface AdminDrawingStats {
  drawingId: string
  targetDate: string
  currentEntries: number
  winnersCount: number
  topParticipants: Array<{
    name: string
    entryCount: number
  }>
  revenue?: number // optional
}

export interface SweepstakesStats {
  currentDrawing: Drawing
  userEntries: SweepstakesEntryBreakdown
  winnings: Winnings[]
  leaderboard: Winner[]
}
