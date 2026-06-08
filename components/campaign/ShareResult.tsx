/**
 * Share Result Component
 * Displays share success with referral URL and tracking info
 */

'use client'

import React from 'react'
import Link from 'next/link'
import styled from 'styled-components'
import Button from '@/components/ui/Button'
import { ReferralUrlDisplay } from './ReferralUrlDisplay'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`

const SuccessHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: #ecfdf5;
  border-radius: 0.75rem;
  border-left: 4px solid #10b981;
`

const SuccessIcon = styled.div`
  font-size: 2rem;
  line-height: 1;
`

const SuccessMessage = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`

const SuccessTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 700;
  color: #059669;
  margin: 0;
`

const SuccessText = styled.p`
  font-size: 0.875rem;
  color: #047857;
  margin: 0;
`

const InfoBox = styled.div`
  padding: 1rem;
  background: #eff6ff;
  border-radius: 0.75rem;
  border-left: 4px solid #3b82f6;
  display: flex;
  gap: 0.75rem;
`

const InfoIcon = styled.div`
  flex-shrink: 0;
  color: #3b82f6;
  font-size: 1.25rem;
  line-height: 1;
  display: flex;
  align-items: center;
`

const InfoContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`

const InfoTitle = styled.h4`
  font-size: 0.9375rem;
  font-weight: 600;
  color: #1e40af;
  margin: 0;
`

const InfoText = styled.p`
  font-size: 0.875rem;
  color: #1e3a8a;
  margin: 0;
  line-height: 1.5;
`

const StepsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`

const StepItem = styled.div`
  display: flex;
  gap: 1rem;
  padding: 1rem;
  background: #f9fafb;
  border-radius: 0.75rem;
  border: 1px solid #e5e7eb;
`

const StepNumber = styled.div`
  min-width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #667eea;
  color: white;
  font-weight: 700;
  border-radius: 50%;
  font-size: 0.875rem;
`

const StepContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`

const StepTitle = styled.h5`
  font-weight: 600;
  color: #111827;
  margin: 0;
  font-size: 0.9375rem;
`

const StepDescription = styled.p`
  color: #6b7280;
  font-size: 0.875rem;
  margin: 0;
  line-height: 1.5;
`

const ActionButtons = styled.div`
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
`

const EarningsCallout = styled.div`
  padding: 1rem;
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  border-left: 4px solid #f59e0b;
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-top: 1.5rem;

  @media (max-width: 640px) {
    flex-direction: column;
    align-items: flex-start;
  }
`

const EarningsInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`

const EarningsLabel = styled.span`
  font-size: 0.875rem;
  font-weight: 600;
  color: #78350f;
  text-transform: uppercase;
`

const EarningsAmount = styled.span`
  font-size: 1.5rem;
  font-weight: 700;
  color: #f59e0b;
`

const EarningsDescription = styled.span`
  font-size: 0.8125rem;
  color: #92400e;
`

const EarningsButton = styled.button`
  whitespace: nowrap;
  background: #f59e0b;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #d97706;
  }

  &:active {
    transform: scale(0.98);
  }
`

const ActionButton = styled(Button)`
  flex: 1;
`

interface ShareResultProps {
  campaignId: string
  campaignTitle: string
  referralCode: string
  rewardAmount: number // in cents
  sharedPlatform?: string
  onCopySuccess?: () => void
  onClose?: () => void
}

/**
 * Share Result Component
 * Shows success message and referral URL with next steps
 */
export const ShareResult: React.FC<ShareResultProps> = ({
  campaignId,
  campaignTitle,
  referralCode,
  rewardAmount,
  sharedPlatform,
  onCopySuccess,
  onClose,
}) => {
  const handleCopySuccess = () => {
    onCopySuccess?.()
  }

  const referralUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/campaigns/${campaignId}?ref=${referralCode}`
    : ''

  return (
    <Container>
      {/* Success Header */}
      <SuccessHeader>
        <SuccessIcon>🎉</SuccessIcon>
        <SuccessMessage>
          <SuccessTitle>Share recorded successfully!</SuccessTitle>
          <SuccessText>
            Your unique referral link is now tracking clicks and conversions
          </SuccessText>
        </SuccessMessage>
      </SuccessHeader>

      {/* Share Info */}
      <InfoBox>
        <InfoIcon>ℹ️</InfoIcon>
        <InfoContent>
          <InfoTitle>How you earn</InfoTitle>
          <InfoText>
            Share your referral link on {sharedPlatform ? sharedPlatform : 'social media'}. When someone clicks your link and donates to <strong>{campaignTitle}</strong>, you'll earn <strong>${(rewardAmount / 100).toFixed(2)}</strong>.
          </InfoText>
        </InfoContent>
      </InfoBox>

      {/* Referral URL Display */}
      <ReferralUrlDisplay
        campaignId={campaignId}
        referralCode={referralCode}
        campaignTitle={campaignTitle}
        rewardAmount={rewardAmount}
        onCopySuccess={handleCopySuccess}
      />

      {/* Earnings Callout */}
      <EarningsCallout>
        <EarningsInfo>
          <EarningsLabel>💵 You could earn</EarningsLabel>
          <EarningsAmount>${(rewardAmount / 100).toFixed(2)}</EarningsAmount>
          <EarningsDescription>
            per person who donates through your link
          </EarningsDescription>
        </EarningsInfo>
        <Link href="/app/shares" style={{ textDecoration: 'none' }}>
          <EarningsButton>
            View All Earnings
          </EarningsButton>
        </Link>
      </EarningsCallout>

      {/* Next Steps */}
      <InfoBox style={{ borderLeftColor: '#f59e0b', background: '#fffbeb' }}>
        <InfoIcon style={{ color: '#f59e0b' }}>📋</InfoIcon>
        <InfoContent>
          <InfoTitle style={{ color: '#92400e' }}>What's next?</InfoTitle>
          <StepsContainer>
            <StepItem style={{ background: 'transparent', border: 'none', padding: '0.5rem 0' }}>
              <StepNumber style={{ background: '#f59e0b' }}>1</StepNumber>
              <StepContent>
                <StepTitle style={{ color: '#92400e' }}>Share your link</StepTitle>
                <StepDescription style={{ color: '#78350f' }}>
                  Copy the referral URL and share it on social media, email, or messaging apps
                </StepDescription>
              </StepContent>
            </StepItem>

            <StepItem style={{ background: 'transparent', border: 'none', padding: '0.5rem 0' }}>
              <StepNumber style={{ background: '#f59e0b' }}>2</StepNumber>
              <StepContent>
                <StepTitle style={{ color: '#92400e' }}>Track clicks</StepTitle>
                <StepDescription style={{ color: '#78350f' }}>
                  We'll automatically track when people click your referral link
                </StepDescription>
              </StepContent>
            </StepItem>

            <StepItem style={{ background: 'transparent', border: 'none', padding: '0.5rem 0' }}>
              <StepNumber style={{ background: '#f59e0b' }}>3</StepNumber>
              <StepContent>
                <StepTitle style={{ color: '#92400e' }}>Get rewarded</StepTitle>
                <StepDescription style={{ color: '#78350f' }}>
                  When they donate, you'll earn ${(rewardAmount / 100).toFixed(2)} automatically
                </StepDescription>
              </StepContent>
            </StepItem>
          </StepsContainer>
        </InfoContent>
      </InfoBox>

      {/* Action Buttons */}
      <ActionButtons>
        <ActionButton
          variant="primary"
          onClick={onClose}
        >
          Done
        </ActionButton>
        <ActionButton
          variant="secondary"
          onClick={() => window.open(referralUrl, '_blank')}
        >
          Preview Link
        </ActionButton>
      </ActionButtons>
    </Container>
  )
}

export default ShareResult
