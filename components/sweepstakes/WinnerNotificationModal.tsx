'use client'

import React, { useState } from 'react'
import styled from 'styled-components'
import { X, Zap } from 'lucide-react'
import { Modal } from '@/components/Modal'
import { Button } from '@/components/Button'
import { Badge } from '@/components/Badge'
import { currencyUtils } from '@/utils/validationSchemas'
import type { Winnings } from '@/api/services/sweepstakesService'

/**
 * Winner Notification Modal
 * Shows when a user wins a sweepstakes drawing
 * Displays prize amount, entry breakdown, and claim button
 */

const Content = styled.div`
  text-align: center;
  padding: 20px;
`

const CelebrationEmoji = styled.div`
  font-size: 64px;
  margin-bottom: 16px;
  animation: bounce 0.6s ease-in-out infinite;

  @keyframes bounce {
    0%,
    100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-20px);
    }
  }
`

const Title = styled.h2`
  font-size: 28px;
  font-weight: 700;
  color: #10b981;
  margin: 0 0 8px 0;
`

const Subtitle = styled.p`
  font-size: 16px;
  color: #6b7280;
  margin: 0 0 24px 0;
`

const PrizeAmount = styled.div`
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  border-radius: 12px;
  padding: 24px;
  color: white;
  margin-bottom: 24px;
`

const PrizeLabel = styled.p`
  font-size: 14px;
  opacity: 0.9;
  margin: 0 0 8px 0;
`

const PrizeValue = styled.div`
  font-size: 48px;
  font-weight: 700;
  margin: 0;
`

const BreakdownSection = styled.div`
  background: #f3f4f6;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 24px;
  text-align: left;
`

const BreakdownTitle = styled.p`
  font-size: 12px;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  margin: 0 0 12px 0;
`

const BreakdownItem = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid #e5e7eb;
  font-size: 14px;

  &:last-child {
    border-bottom: none;
  }
`

const Actions = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 24px;

  @media (max-width: 480px) {
    flex-direction: column;
  }
`

const InfoBox = styled.div`
  background: #fef3c7;
  border-left: 4px solid #f59e0b;
  border-radius: 4px;
  padding: 12px;
  margin-top: 16px;
  font-size: 13px;
  color: #92400e;
  text-align: left;
`

interface WinnerNotificationModalProps {
  winning: Winnings
  open: boolean
  onClose: () => void
  onClaimClick: () => void
  isLoading?: boolean
}

export function WinnerNotificationModal({
  winning,
  open,
  onClose,
  onClaimClick,
  isLoading = false,
}: WinnerNotificationModalProps) {
  return (
    <Modal isOpen={open} onClose={onClose} title="">
      <Content>
        <CelebrationEmoji>🎉</CelebrationEmoji>

        <Title>You Won!</Title>
        <Subtitle>Congratulations! You've been drawn as a winner in the sweepstakes.</Subtitle>

        <PrizeAmount>
          <PrizeLabel>Your Prize</PrizeLabel>
          <PrizeValue>{currencyUtils.formatCurrency(winning.prize)}</PrizeValue>
        </PrizeAmount>

        <BreakdownSection>
          <BreakdownTitle>Winning Details</BreakdownTitle>
          <BreakdownItem>
            <span>Drawing Date:</span>
            <span>{new Date(winning.drawingDate).toLocaleDateString()}</span>
          </BreakdownItem>
          <BreakdownItem>
            <span>Prize Status:</span>
            <Badge
              variant={
                winning.status === 'won_claimed' ? 'success' : 'warning'
              }
              size="sm"
            >
              {winning.status === 'won_claimed' ? 'Claimed' : 'Unclaimed'}
            </Badge>
          </BreakdownItem>
          {winning.claimDate && (
            <BreakdownItem>
              <span>Claimed On:</span>
              <span>{new Date(winning.claimDate).toLocaleDateString()}</span>
            </BreakdownItem>
          )}
        </BreakdownSection>

        <InfoBox>
          <strong>💡 Next Steps:</strong>
          <p style={{ margin: '8px 0 0 0' }}>
            Click "Claim Prize" to select your payment method and receive your winnings.
          </p>
        </InfoBox>

        <Actions>
          <Button
            variant={winning.status === 'won_claimed' ? 'outline' : 'primary'}
            size="lg"
            onClick={onClaimClick}
            disabled={winning.status === 'won_claimed' || isLoading}
          >
            {isLoading
              ? 'Processing...'
              : winning.status === 'won_claimed'
                ? 'Prize Claimed'
                : `Claim ${currencyUtils.formatCurrency(winning.prize)}`}
          </Button>
          <Button variant="ghost" size="lg" onClick={onClose}>
            Close
          </Button>
        </Actions>
      </Content>
    </Modal>
  )
}
