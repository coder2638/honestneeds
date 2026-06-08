'use client'

import React from 'react'
import styled from 'styled-components'
import { TrendingUp, DollarSign, Clock } from 'lucide-react'

interface ShareEarningsCardProps {
  totalEarned: number // in cents
  thisMonthEarned: number // in cents
  pendingPayout: number // in cents
  lastPayoutDate?: string
  isLoading?: boolean
}

const CardContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  width: 100%;
`

const EarningsCard = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  padding: 1.5rem;
  color: white;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
  }
`

const CardIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3rem;
  height: 3rem;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  margin-bottom: 1rem;

  svg {
    width: 1.5rem;
    height: 1.5rem;
    color: white;
  }
`

const CardLabel = styled.p`
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.8);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin: 0 0 0.5rem 0;
  font-weight: 500;
`

const CardValue = styled.p`
  font-size: 2rem;
  font-weight: 700;
  margin: 0;
  color: white;

  @media (max-width: 640px) {
    font-size: 1.5rem;
  }
`

const CardSubtext = styled.p`
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.7);
  margin: 0.5rem 0 0 0;
`

const MonthCard = styled(EarningsCard)`
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  box-shadow: 0 4px 15px rgba(245, 87, 108, 0.3);

  &:hover {
    box-shadow: 0 6px 20px rgba(245, 87, 108, 0.4);
  }
`

const PendingCard = styled(EarningsCard)`
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  box-shadow: 0 4px 15px rgba(79, 172, 254, 0.3);

  &:hover {
    box-shadow: 0 6px 20px rgba(79, 172, 254, 0.4);
  }
`

const SkeletonLoader = styled.div`
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;

  @keyframes loading {
    0% {
      background-position: 200% 0;
    }
    100% {
      background-position: -200% 0;
    }
  }
`

const SkeletonCard = styled(SkeletonLoader)`
  height: 200px;
  border-radius: 12px;
`

/**
 * ShareEarningsCard Component
 * Production-ready display of share earnings summary
 * Shows: total earned, this month, pending payout, last payout date
 */
export const ShareEarningsCard: React.FC<ShareEarningsCardProps> = ({
  totalEarned,
  thisMonthEarned,
  pendingPayout,
  lastPayoutDate,
  isLoading = false,
}) => {
  const formatCurrency = (cents: number): string => {
    return `$${(cents / 100).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`
  }

  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString)
      return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }).format(date)
    } catch {
      return 'N/A'
    }
  }

  if (isLoading) {
    return (
      <CardContainer>
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </CardContainer>
    )
  }

  return (
    <CardContainer>
      {/* Total Earned */}
      <EarningsCard>
        <CardIcon>
          <TrendingUp />
        </CardIcon>
        <CardLabel>Total Earned</CardLabel>
        <CardValue>{formatCurrency(totalEarned)}</CardValue>
        <CardSubtext>From all share rewards</CardSubtext>
      </EarningsCard>

      {/* This Month */}
      <MonthCard>
        <CardIcon>
          <DollarSign />
        </CardIcon>
        <CardLabel>This Month</CardLabel>
        <CardValue>{formatCurrency(thisMonthEarned)}</CardValue>
        <CardSubtext>Earned in {new Date().toLocaleString('default', { month: 'long' })}</CardSubtext>
      </MonthCard>

      {/* Pending Payout */}
      <PendingCard>
        <CardIcon>
          <Clock />
        </CardIcon>
        <CardLabel>Pending Payout</CardLabel>
        <CardValue>{formatCurrency(pendingPayout)}</CardValue>
        <CardSubtext>
          {lastPayoutDate
            ? `Last payout: ${formatDate(lastPayoutDate)}`
            : 'No payouts yet'}
        </CardSubtext>
      </PendingCard>
    </CardContainer>
  )
}
