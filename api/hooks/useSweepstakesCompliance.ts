import { useEffect, useState, useCallback } from 'react'
import { useAuthStore } from '@/store/authStore'

// Sweepstakes restricted states (backend enforces these)
const RESTRICTED_STATES = ['FL', 'NY', 'TX']

interface SweepstakesComplianceState {
  ageVerified: boolean
  isRestrictedState: boolean
  userState?: string
}

/**
 * useSweepstakesCompliance Hook
 * Manages sweepstakes compliance state including age verification and state restrictions
 */
export const useSweepstakesCompliance = () => {
  const { user } = useAuthStore()
  const [complianceState, setComplianceState] = useState<SweepstakesComplianceState>({
    ageVerified: false,
    isRestrictedState: false,
  })

  // Check if age verification is stored in localStorage
  const checkAgeVerification = useCallback(() => {
    if (typeof window !== 'undefined' && user?.id) {
      const stored = localStorage.getItem(`sweepstakes_age_verified_${user.id}`)
      return stored === 'true'
    }
    return false
  }, [user?.id])

  // Store age verification in localStorage
  const setAgeVerified = useCallback(() => {
    if (typeof window !== 'undefined' && user?.id) {
      localStorage.setItem(`sweepstakes_age_verified_${user.id}`, 'true')
      setComplianceState((prev) => ({
        ...prev,
        ageVerified: true,
      }))
    }
  }, [user?.id])

  // Check if user is from restricted state (stored in localStorage from signup)
  const checkRestrictedState = useCallback((userState?: string) => {
    const state = userState || (typeof window !== 'undefined' ? localStorage.getItem('user_state') : null)
    if (!state) return false
    const stateCode = state.toUpperCase().slice(0, 2)
    return RESTRICTED_STATES.includes(stateCode)
  }, [])

  // Initialize compliance state on mount
  useEffect(() => {
    if (user?.id) {
      const ageVerified = checkAgeVerification()
      const isRestricted = checkRestrictedState()

      setComplianceState({
        ageVerified,
        isRestrictedState: isRestricted,
        userState: typeof window !== 'undefined' ? localStorage.getItem('user_state') || undefined : undefined,
      })
    }
  }, [user?.id, checkAgeVerification, checkRestrictedState])

  const canParticipate = () => {
    return complianceState.ageVerified && !complianceState.isRestrictedState
  }

  return {
    ...complianceState,
    setAgeVerified,
    checkRestrictedState,
    canParticipate,
    restrictedStates: RESTRICTED_STATES,
  }
}

/**
 * useStateRestrictionCheck Hook
 * Dedicated hook for checking state restrictions
 */
export const useStateRestrictionCheck = (state?: string) => {
  const [isRestricted, setIsRestricted] = useState(false)

  useEffect(() => {
    if (state) {
      const stateCode = state.toUpperCase().slice(0, 2)
      setIsRestricted(RESTRICTED_STATES.includes(stateCode))
    }
  }, [state])

  return {
    isRestricted,
    restrictedStates: RESTRICTED_STATES,
  }
}

/**
 * useAgeVerification Hook
 * Dedicated hook for managing age verification state
 */
export const useAgeVerification = () => {
  const { user } = useAuthStore()
  const [isVerified, setIsVerified] = useState(false)
  const [showModal, setShowModal] = useState(false)

  const checkVerification = useCallback(() => {
    if (typeof window !== 'undefined' && user?.id) {
      const stored = localStorage.getItem(`sweepstakes_age_verified_${user.id}`)
      return stored === 'true'
    }
    return false
  }, [user?.id])

  // Initialize verification state
  useEffect(() => {
    if (user?.id) {
      const verified = checkVerification()
      setIsVerified(verified)
    }
  }, [user?.id, checkVerification])

  const confirmAge = useCallback(() => {
    if (user?.id) {
      localStorage.setItem(`sweepstakes_age_verified_${user.id}`, 'true')
      setIsVerified(true)
      setShowModal(false)
    }
  }, [user?.id])

  const declineAge = useCallback(() => {
    setShowModal(false)
  }, [])

  const requestVerification = useCallback(() => {
    setShowModal(true)
  }, [])

  return {
    isVerified,
    showModal,
    confirmAge,
    declineAge,
    requestVerification,
  }
}
