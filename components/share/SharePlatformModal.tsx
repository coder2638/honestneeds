/**
 * SharePlatformModal.tsx
 * Modal for selecting social media platform and tracking share action
 */

'use client'

import React, { useState } from 'react'
import styled from 'styled-components'
import { Modal } from '@/components/Modal'
import { useCreateShareReward } from '@/api/hooks/useSharerRewards'

const ModalTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 1.5rem 0;
`

const ModalDescription = styled.p`
  color: #64748b;
  margin: 0 0 1.5rem 0;
  line-height: 1.5;
`

const RewardInfo = styled.div`
  background-color: #f0fdf4;
  border: 1px solid #bbf7d0;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const RewardAmount = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`

const RewardLabel = styled.span`
  font-size: 0.85rem;
  color: #15803d;
  font-weight: 600;
`

const RewardValue = styled.span`
  font-size: 1.75rem;
  font-weight: 700;
  color: #15803d;
`

const HoldInfo = styled.span`
  font-size: 0.8rem;
  color: #047857;
`

const PlatformGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;

  @media (max-width: 480px) {
    grid-template-columns: repeat(3, 1fr);
  }
`

const PlatformButton = styled.button<{ $selected: boolean; $disabled: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  border: 2px solid ${props => (props.$selected ? '#667eea' : '#e2e8f0')};
  background-color: ${props => (props.$selected ? '#f3f1ff' : '#f8fafc')};
  border-radius: 8px;
  cursor: ${props => (props.$disabled ? 'not-allowed' : 'pointer')};
  opacity: ${props => (props.$disabled ? 0.5 : 1)};
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    border-color: #667eea;
    background-color: #f3f1ff;
  }

  &:active:not(:disabled) {
    transform: scale(0.95);
  }
`

const PlatformIcon = styled.span`
  font-size: 2rem;
`

const PlatformName = styled.span`
  font-size: 0.85rem;
  font-weight: 600;
  color: #0f172a;
  text-align: center;
`

const ButtonContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;

  @media (max-width: 480px) {
    flex-direction: column;
  }
`

const SubmitButton = styled.button`
  flex: 1;
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 16px rgba(102, 126, 234, 0.3);
  }

  &:disabled {
    background: #cbd5e1;
    cursor: not-allowed;
  }
`

const CancelButton = styled.button`
  flex: 1;
  padding: 0.75rem 1.5rem;
  background-color: white;
  color: #64748b;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background-color: #f8fafc;
    border-color: #94a3b8;
  }
`

const PLATFORMS = [
  { id: 'instagram', name: 'Instagram', icon: '📷' },
  { id: 'tiktok', name: 'TikTok', icon: '🎵' },
  { id: 'twitter', name: 'X (Twitter)', icon: '𝕏' },
  { id: 'facebook', name: 'Facebook', icon: '📘' },
  { id: 'linkedin', name: 'LinkedIn', icon: '💼' },
  { id: 'reddit', name: 'Reddit', icon: '🤖' },
  { id: 'whatsapp', name: 'WhatsApp', icon: '💬' },
  { id: 'telegram', name: 'Telegram', icon: '✈️' },
]

interface SharePlatformModalProps {
  campaignId: string
  campaignTitle: string
  rewardAmount: number
  onClose: () => void
  onRewardConfirmed: (rewardData: {
    amountDollars: string
    holdExpiresAt: string
    daysRemaining: number
  }) => void
}

export const SharePlatformModal: React.FC<SharePlatformModalProps> = ({
  campaignId,
  campaignTitle,
  rewardAmount,
  onClose,
  onRewardConfirmed,
}) => {
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null)
  // Placeholder: useCreateShareReward hook would be created to call the backend
  // For now, we'll simulate the reward

  const handleShare = async () => {
    if (!selectedPlatform) return

    // TODO: Call actual API endpoint to create reward
    // const result = await createShareReward({ campaignId, platform: selectedPlatform, ...proofData })

    // Simulate success
    const mockHoldExpiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
    const daysRemaining = 30

    onRewardConfirmed({
      amountDollars: (rewardAmount / 100).toFixed(2),
      holdExpiresAt: mockHoldExpiresAt.toISOString(),
      daysRemaining,
    })
  }

  return (
    <Modal onClose={onClose}>
      <ModalTitle>Share "{campaignTitle}" to Earn</ModalTitle>
      <ModalDescription>
        Select a platform and share the campaign. Your reward will be held for 30 days as part of our fraud prevention process, then you can request a payout.
      </ModalDescription>

      <RewardInfo>
        <RewardAmount>
          <RewardLabel>Reward for Sharing:</RewardLabel>
          <RewardValue>${(rewardAmount / 100).toFixed(2)}</RewardValue>
        </RewardAmount>
        <HoldInfo>
          30-day hold<br />
          Then payout eligible
        </HoldInfo>
      </RewardInfo>

      <PlatformGrid>
        {PLATFORMS.map(platform => (
          <PlatformButton
            key={platform.id}
            $selected={selectedPlatform === platform.id}
            $disabled={false}
            onClick={() => setSelectedPlatform(platform.id)}
          >
            <PlatformIcon>{platform.icon}</PlatformIcon>
            <PlatformName>{platform.name}</PlatformName>
          </PlatformButton>
        ))}
      </PlatformGrid>

      <ButtonContainer>
        <SubmitButton
          onClick={handleShare}
          disabled={!selectedPlatform}
        >
          ✓ Confirm Share
        </SubmitButton>
        <CancelButton onClick={onClose}>
          Cancel
        </CancelButton>
      </ButtonContainer>
    </Modal>
  )
}
