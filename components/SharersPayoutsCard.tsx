/**
 * Sharers Payouts Card
 * Quick access card for creator dashboard to view pending payout requests
 */

'use client'

import React from 'react'
import styled from 'styled-components'
import { useRouter } from 'next/navigation'
import { DollarSign, ChevronRight, AlertCircle } from 'lucide-react'

const Card = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  padding: 1.5rem;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &:before {
    content: '';
    position: absolute;
    top: -50%;
    right: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
    transition: all 0.3s ease;
  }

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 24px rgba(102, 126, 234, 0.4);

    &:before {
      right: -30%;
      top: -30%;
    }
  }
`

const CardContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  z-index: 1;
`

const LeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`

const IconWrapper = styled.div`
  width: 50px;
  height: 50px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
`

const TextSection = styled.div`
  h3 {
    margin: 0 0 0.25rem 0;
    font-size: 1.1rem;
    font-weight: 600;
  }

  p {
    margin: 0;
    font-size: 0.9rem;
    opacity: 0.9;
  }
`

const Badge = styled.div`
  background: rgba(255, 255, 255, 0.2);
  padding: 0.4rem 0.8rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  .dot {
    width: 8px;
    height: 8px;
    background: #ffd700;
    border-radius: 50%;
    animation: pulse 2s infinite;
  }

  @keyframes pulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }
`

const ChevronIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`

interface SharersPayoutsCardProps {
  campaignId?: string
  pendingCount?: number
  pendingAmount?: number
}

export const SharersPayoutsCard: React.FC<SharersPayoutsCardProps> = ({
  campaignId,
  pendingCount = 0,
  pendingAmount = 0
}) => {
  const router = useRouter()

  const handleClick = () => {
    if (campaignId) {
      router.push(`/creator/sharers-payouts?campaignId=${campaignId}`)
    } else {
      router.push('/creator/dashboard')
    }
  }

  return (
    <Card onClick={handleClick} title={campaignId ? "View sharers' payout requests" : "Select a campaign to manage payouts"}>
      <CardContent>
        <LeftSection>
          <IconWrapper>
            <DollarSign size={28} />
          </IconWrapper>
          <TextSection>
            <h3>
              {pendingCount > 0 ? "Sharers Payouts" : "No Pending Payouts"}
            </h3>
            <p>
              {pendingCount > 0 
                ? `${pendingCount} pending request${pendingCount !== 1 ? 's' : ''} • $${pendingAmount.toFixed(2)}`
                : 'All sharers paid up'
              }
            </p>
          </TextSection>
        </LeftSection>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {pendingCount > 0 && (
            <Badge>
              <div className="dot"></div>
              {pendingCount} pending
            </Badge>
          )}
          <ChevronIcon>
            <ChevronRight size={24} />
          </ChevronIcon>
        </div>
      </CardContent>
    </Card>
  )
}
