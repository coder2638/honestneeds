/**
 * Referral Code Hook for Donation Tracking
 * Manages referral code extraction and passing to donation flow
 */

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'

/**
 * Hook to extract and manage referral code from URL
 * Use this in donation flows to capture the referral code for conversion tracking
 */
export const useReferralCodeFromUrl = (campaignId: string) => {
  const searchParams = useSearchParams()
  const [referralCode, setReferralCode] = useState<string | null>(null)
  const [isFromReferral, setIsFromReferral] = useState(false)

  useEffect(() => {
    // Check URL params first
    const refFromUrl = searchParams?.get('ref')
    
    // Fallback to session storage if no URL param
    const refFromSession = typeof window !== 'undefined'
      ? sessionStorage.getItem(`referral_code_${campaignId}`)
      : null

    const code = refFromUrl || refFromSession
    
    if (code) {
      setReferralCode(code)
      setIsFromReferral(true)
      
      // Clean up session storage  
      if (typeof window !== 'undefined' && !refFromUrl) {
        sessionStorage.removeItem(`referral_code_${campaignId}`)
      }
    }
  }, [campaignId, searchParams])

  return {
    referralCode,
    isFromReferral,
    // Helper function to include referral code in donation request
    attachReferralCode: (donationData: any) => ({
      ...donationData,
      referralCode: referralCode ? referralCode : undefined,
    }),
  }
}

/**
 * Hook to store and retrieve referral information
 * Useful for multi-step donation flows
 */
export const useReferralStorage = (campaignId: string) => {
  const [storedReferralCode, setStoredReferralCode] = useState<string | null>(null)

  const saveReferralCode = (code: string) => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem(`referral_code_${campaignId}`, code)
      setStoredReferralCode(code)
    }
  }

  const getReferralCode = () => {
    if (typeof window !== 'undefined') {
      const code = sessionStorage.getItem(`referral_code_${campaignId}`)
      return code
    }
    return null
  }

  const clearReferralCode = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem(`referral_code_${campaignId}`)
      setStoredReferralCode(null)
    }
  }

  return {
    storedReferralCode,
    saveReferralCode,
    getReferralCode,
    clearReferralCode,
  }
}

/**
 * Hook to generate a referral URL from scratch
 * Useful for custom share buttons or manual link generation
 */
export const useGenerateReferralUrl = (campaignId: string, referralCode: string) => {
  const [referralUrl, setReferralUrl] = useState<string>('')

  useEffect(() => {
    if (typeof window !== 'undefined' && campaignId && referralCode) {
      const url = `${window.location.origin}/campaigns/${campaignId}?ref=${referralCode}`
      setReferralUrl(url)
    }
  }, [campaignId, referralCode])

  return referralUrl
}

export default useReferralCodeFromUrl
