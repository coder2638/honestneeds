import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import * as sweepstakesService from '../services/simpleSweepstakesService'
import type {
  Sweepstakes,
  WinnerCheckResult,
  PrizeClaimRequest,
  PrizeClaimResponse,
} from '../services/simpleSweepstakesService'

/**
 * React Query hooks for simplified sweepstakes system (v2)
 * Manages state, caching, and mutations for monthly random drawing
 */

// Query key factory for consistent cache management
const sweepstakesKeys = {
  all: ['sweepstakes-v2'],
  current: () => [...sweepstakesKeys.all, 'current'],
  winner: (sweepstakesId: string) => [...sweepstakesKeys.all, 'winner', sweepstakesId],
  claims: (sweepstakesId: string) => [...sweepstakesKeys.all, 'claims', sweepstakesId],
}

// ============================================
// PUBLIC HOOKS
// ============================================

/**
 * Get current active sweepstakes drawing
 * Cache stale time: 5 minutes (drawing details don't change often)
 */
export function useCurrentSweepstakes() {
  return useQuery({
    queryKey: sweepstakesKeys.current(),
    queryFn: () => sweepstakesService.getCurrentSweepstakes(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
  })
}

/**
 * Get all sweepstakes (admin)
 * Cache stale time: 2 minutes
 */
export function useAllSweepstakes() {
  return useQuery({
    queryKey: [...sweepstakesKeys.all, 'list'],
    queryFn: () => sweepstakesService.getAllSweepstakes(),
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
  })
}

/**
 * Check if current user won the drawing
 * No caching - always fresh (user state can change)
 */
export function useCheckWinner(sweepstakesId: string | null) {
  return useQuery({
    queryKey: sweepstakesKeys.winner(sweepstakesId || ''),
    queryFn: () => sweepstakesService.checkWinner(sweepstakesId!),
    enabled: !!sweepstakesId,
    staleTime: 1 * 60 * 1000, // 1 minute
    gcTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  })
}

/**
 * Claim prize mutation
 */
export function useClaimPrize() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ sweepstakesId, paymentDetails }: {
      sweepstakesId: string
      paymentDetails: PrizeClaimRequest
    }) => sweepstakesService.claimPrize(sweepstakesId, paymentDetails),
    onSuccess: (response, variables) => {
      toast.success('✅ Prize claim submitted successfully!', {
        position: 'top-right',
        autoClose: 5000,
        toastId: 'claim-prize-success',
      })

      // Invalidate winner check to reflect new claim status
      queryClient.invalidateQueries({
        queryKey: sweepstakesKeys.winner(variables.sweepstakesId),
      })
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to claim prize'
      toast.error(`❌ ${message}`, {
        position: 'top-right',
        autoClose: 5000,
        toastId: 'claim-prize-error',
      })
    },
  })
}

// ============================================
// ADMIN HOOKS
// ============================================

/**
 * Create new sweepstakes mutation
 */
export function useCreateSweepstakes() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ month, prizeAmount }: { month: string; prizeAmount: number }) =>
      sweepstakesService.createSweepstakes(month, prizeAmount),
    onSuccess: () => {
      toast.success('✅ Sweepstakes created successfully!', {
        position: 'top-right',
        autoClose: 5000,
        toastId: 'create-sweepstakes-success',
      })

      // Invalidate current sweepstakes to refresh
      queryClient.invalidateQueries({ queryKey: sweepstakesKeys.current() })
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to create sweepstakes'
      toast.error(`❌ ${message}`, {
        position: 'top-right',
        autoClose: 5000,
        toastId: 'create-sweepstakes-error',
      })
    },
  })
}

/**
 * Select winner mutation
 */
export function useSelectWinner(sweepstakesId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (options: { winnerId?: string } | { randomSelection: boolean }) =>
      sweepstakesService.selectWinner(sweepstakesId, options),
    onSuccess: () => {
      toast.success('✅ Winner selected successfully!', {
        position: 'top-right',
        autoClose: 5000,
        toastId: 'select-winner-success',
      })

      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: sweepstakesKeys.current() })
      queryClient.invalidateQueries({ queryKey: sweepstakesKeys.claims(sweepstakesId) })
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to select winner'
      toast.error(`❌ ${message}`, {
        position: 'top-right',
        autoClose: 5000,
        toastId: 'select-winner-error',
      })
    },
  })
}

/**
 * Get claims for sweepstakes (admin)
 */
export function useClaimsForSweepstakes(sweepstakesId: string) {
  return useQuery({
    queryKey: sweepstakesKeys.claims(sweepstakesId),
    queryFn: () => sweepstakesService.getClaimsForSweepstakes(sweepstakesId),
    enabled: !!sweepstakesId,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 1,
  })
}

/**
 * Approve claim mutation
 */
export function useApproveClaim(sweepstakesId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ claimId, adminNotes }: { claimId: string; adminNotes?: string }) =>
      sweepstakesService.approveClaim(sweepstakesId, claimId, { adminNotes }),
    onSuccess: () => {
      toast.success('✅ Claim approved successfully!', {
        position: 'top-right',
        autoClose: 5000,
        toastId: 'approve-claim-success',
      })

      // Invalidate claims
      queryClient.invalidateQueries({ queryKey: sweepstakesKeys.claims(sweepstakesId) })
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to approve claim'
      toast.error(`❌ ${message}`, {
        position: 'top-right',
        autoClose: 5000,
        toastId: 'approve-claim-error',
      })
    },
  })
}

/**
 * Reject claim mutation
 */
export function useRejectClaim(sweepstakesId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ claimId, rejectionReason, adminNotes }: {
      claimId: string
      rejectionReason: string
      adminNotes?: string
    }) => sweepstakesService.rejectClaim(sweepstakesId, claimId, { rejectionReason, adminNotes }),
    onSuccess: () => {
      toast.success('✅ Claim rejected successfully!', {
        position: 'top-right',
        autoClose: 5000,
        toastId: 'reject-claim-success',
      })

      // Invalidate claims
      queryClient.invalidateQueries({ queryKey: sweepstakesKeys.claims(sweepstakesId) })
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to reject claim'
      toast.error(`❌ ${message}`, {
        position: 'top-right',
        autoClose: 5000,
        toastId: 'reject-claim-error',
      })
    },
  })
}
