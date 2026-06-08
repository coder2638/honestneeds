/**
 * ShareActionButton.tsx
 * Button component for sharers to share campaign and earn rewards
 * Handles platform selection, reward tracking, and feedback
 */

'use client'

import React, { useState } from 'react'
import styled from 'styled-components'
import { SharePlatformModal } from './SharePlatformModal'
import { RewardConfirmationModal } from './RewardConfirmationModal'

const StyledButton = styled.button`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 0.875rem 1.75rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    background: #cbd5e1;
    cursor: not-allowed;
    box-shadow: none;
  }

  @media (max-width: 640px) {
    width: 100%;
    justify-content: center;
    padding: 0.75rem 1.5rem;
  }
`

const RewardBadge = styled.span`
  background-color: rgba(255, 255, 255, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.5);
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: 500;
  margin-left: auto;

  @media (max-width: 640px) {
    margin-left: 0;
  }
`

interface ShareActionButtonProps {
  campaignId: string
  campaignTitle: string
  rewardAmount: number // in cents
  isActive?: boolean
  paidSharingActive?: boolean
}

export const ShareActionButton: React.FC<ShareActionButtonProps> = ({
  campaignId,
  campaignTitle,
  rewardAmount,
  isActive = true,
  paidSharingActive = true,
}) => {
  const [showPlatformModal, setShowPlatformModal] = useState(false)
  const [showRewardConfirmation, setShowRewardConfirmation] = useState(false)
  const [earnedReward, setEarnedReward] = useState<{
    amountDollars: string
    holdExpiresAt: string
    daysRemaining: number
  } | null>(null)

  const handleShareClick = () => {
    if (!isActive) return
    setShowPlatformModal(true)
  }

  const handleRewardConfirmed = (rewardData: {
    amountDollars: string
    holdExpiresAt: string
    daysRemaining: number
  }) => {
    setEarnedReward(rewardData)
    setShowRewardConfirmation(true)
    setTimeout(() => {
      setShowRewardConfirmation(false)
      setShowPlatformModal(false)
      setEarnedReward(null)
    }, 3000)
  }

  const isDisabled = !isActive || !paidSharingActive

  return (
    <>
      <StyledButton
        onClick={handleShareClick}
        disabled={isDisabled}
        title={
          !isActive
            ? 'This campaign is not currently active'
            : !paidSharingActive
              ? 'Paid sharing is not available for this campaign'
              : 'Share and earn rewards!'
        }
      >
        <span>📤 Share to Earn</span>
        {rewardAmount > 0 && <RewardBadge>${(rewardAmount / 100).toFixed(2)}</RewardBadge>}
      </StyledButton>

      {showPlatformModal && (
        <SharePlatformModal
          campaignId={campaignId}
          campaignTitle={campaignTitle}
          rewardAmount={rewardAmount}
          onClose={() => setShowPlatformModal(false)}
          onRewardConfirmed={handleRewardConfirmed}
        />
      )}

      {showRewardConfirmation && earnedReward && (
        <RewardConfirmationModal
          amountDollars={earnedReward.amountDollars}
          holdExpiresAt={earnedReward.holdExpiresAt}
          daysRemaining={earnedReward.daysRemaining}
        />
      )}
    </>
  )
}
