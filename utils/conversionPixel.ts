/**
 * Conversion Pixel Tracker
 * Fires conversion events when donations or actions complete
 * Tracks conversions for referral attribution
 */

import { useEffect, useCallback } from 'react';
import { useConversionFlow } from '@/api/hooks/useConversionTracking';

/**
 * Hook: Fire conversion pixel after donation
 * Call this after a successful donation to record conversion
 * 
 * @param campaignId - Campaign ID
 * @param referralCode - Referral code from URL (if available)
 * @param donationAmount - Amount donated in cents
 * @param metadata - Additional context (optional)
 */
export function useConversionPixel(
  campaignId: string | null,
  referralCode: string | null,
  donationAmount: number = 0,
  metadata?: Record<string, unknown>
) {
  const { recordConversion, isLoading, error } = useConversionFlow();

  /**
   * Fire a donation conversion pixel
   */
  const fireConversionPixel = useCallback(
    async (amount: number = donationAmount) => {
      if (!campaignId || !referralCode) {
        console.warn('ConversionPixel: Missing campaignId or referralCode', {
          campaignId,
          referralCode,
        });
        return;
      }

      try {
        const result = await recordConversion({
          campaignId,
          ref: referralCode,
          conversionType: 'donation',
          conversionValue: amount,
          metadata: {
            timestamp: new Date().toISOString(),
            source: 'donation_pixel',
            ...metadata,
          },
        });

        if (result.success) {
          console.log('✅ Conversion recorded:', result.message);
          // Dispatch custom event for UI updates
          window.dispatchEvent(
            new CustomEvent('conversionRecorded', {
              detail: {
                message: result.message,
                data: result.data,
              },
            })
          );
        }

        return result;
      } catch (err) {
        console.error('❌ Conversion pixel error:', err);
        return { success: false, message: 'Failed to record conversion' };
      }
    },
    [campaignId, referralCode, donationAmount, recordConversion, metadata]
  );

  return {
    fireConversionPixel,
    isLoading,
    error,
  };
}

/**
 * Component: Auto-fire conversion pixel on mount
 * Use when you want to automatically track a conversion on page load
 * 
 * Example: <AutoConversionPixel campaignId={id} referralCode={ref} donationAmount={5000} />
 */
export function AutoConversionPixel({
  campaignId,
  referralCode,
  donationAmount,
  metadata,
}: {
  campaignId: string | null;
  referralCode: string | null;
  donationAmount?: number;
  metadata?: Record<string, unknown>;
}) {
  const { fireConversionPixel } = useConversionPixel(
    campaignId,
    referralCode,
    donationAmount || 0,
    metadata
  );

  useEffect(() => {
    // Auto-fire on mount if we have required params
    if (campaignId && referralCode && donationAmount && donationAmount > 0) {
      fireConversionPixel(donationAmount);
    }
  }, [campaignId, referralCode, donationAmount, fireConversionPixel]);

  return null; // This component doesn't render anything
}

/**
 * Integration: After successful donation
 * Call this from your donation success handler
 * 
 * Example usage in donation component:
 * 
 * ```tsx
 * const { fireConversionPixel } = useConversionPixel(campaignId, referralCode);
 * 
 * const handleDonationSuccess = async (amount) => {
 *   // Process donation...
 *   await fireConversionPixel(amount);
 *   // Show success message...
 * };
 * ```
 * 
 * For automatic tracking (e.g., on redirect page after donation):
 * 
 * ```tsx
 * export function DonationSuccessPage() {
 *   const searchParams = useSearchParams();
 *   const campaignId = searchParams.get('campaignId');
 *   const ref = searchParams.get('ref');
 *   const amount = parseInt(searchParams.get('amount') || '0');
 *   
 *   return (
 *     <>
 *       <AutoConversionPixel 
 *         campaignId={campaignId} 
 *         referralCode={ref} 
 *         donationAmount={amount}
 *       />
 *       <SuccessMessage amount={amount} />
 *     </>
 *   );
 * }
 * ```
 */

/**
 * Utility: Get referral code from URL
 * Extracts ?ref parameter from current URL
 */
export function getReferralCodeFromUrl(): string | null {
  if (typeof window === 'undefined') return null;

  const searchParams = new URLSearchParams(window.location.search);
  const ref = searchParams.get('ref');
  return ref;
}

/**
 * Utility: Get campaign ID from URL path
 * Extracts campaign ID from /campaigns/:id URL pattern
 */
export function getCampaignIdFromUrl(): string | null {
  if (typeof window === 'undefined') return null;

  const match = window.location.pathname.match(/\/campaigns\/([a-f0-9]{24})/);
  return match ? match[1] : null;
}

/**
 * Utility: Generate referral URL for sharing
 * Creates URL with referral code as parameter
 * 
 * Example:
 * generateReferralUrl('campaign123', 'ABC123', 'facebook')
 * → https://example.com/campaigns/campaign123?ref=ABC123&source=facebook
 */
export function generateReferralUrl(
  campaignId: string,
  referralCode: string,
  source?: string
): string {
  const baseUrl = typeof window !== 'undefined'
    ? `${window.location.protocol}//${window.location.host}`
    : process.env.REACT_APP_BASE_URL || 'https://honestneed.com';

  const url = new URL(`/campaigns/${campaignId}`, baseUrl);
  url.searchParams.set('ref', referralCode);
  
  if (source) {
    url.searchParams.set('source', source);
  }
  
  url.searchParams.set('t', Math.floor(Date.now() / 1000).toString()); // cache bust

  return url.toString();
}

/**
 * Utility: Decode referral metadata from URL
 * Returns referral code, campaign ID, and other params from current URL
 */
export function decodeReferralUrlParams() {
  const ref = getReferralCodeFromUrl();
  const campaignId = getCampaignIdFromUrl();
  
  if (typeof window === 'undefined') {
    return { ref: null, campaignId: null, source: null, timestamp: null };
  }

  const searchParams = new URLSearchParams(window.location.search);
  const source = searchParams.get('source');
  const timestamp = searchParams.get('t');

  return {
    ref,
    campaignId,
    source,
    timestamp,
    isReferral: !!ref && !!campaignId,
  };
}

export default useConversionPixel;
