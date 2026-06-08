'use client'

import styled from 'styled-components'
import { TrendingUp, Users, Gift } from 'lucide-react'

interface ShareInfoSectionProps {
  share_config?: {
    amount_per_share?: number
    total_budget?: number
    share_channels?: string[]
    current_budget_remaining?: number
  }
}

const Container = styled.div`
  background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
  border: 1px solid #93c5fd;
  border-radius: 0.5rem;
  padding: 1.5rem;
  margin-bottom: 1.5rem;

  @media (min-width: 640px) {
    padding: 2rem;
    margin-bottom: 2rem;
  }
`

const Title = styled.h3`
  font-size: 1.125rem;
  font-weight: 700;
  color: #0c4a6e;
  margin: 0 0 1rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  @media (min-width: 640px) {
    font-size: 1.25rem;
    margin-bottom: 1.25rem;
  }
`

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin-bottom: 1rem;

  @media (min-width: 640px) {
    grid-template-columns: repeat(3, 1fr);
    gap: 1.25rem;
    margin-bottom: 1.25rem;
  }
`

const StatCard = styled.div`
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: 0.375rem;
  padding: 1rem;
  text-align: center;

  @media (min-width: 640px) {
    padding: 1.25rem;
  }
`

const StatIcon = styled.div`
  font-size: 1.75rem;
  margin-bottom: 0.5rem;

  @media (min-width: 640px) {
    font-size: 2rem;
  }
`

const StatLabel = styled.p`
  font-size: 0.75rem;
  color: #0c4a6e;
  margin: 0 0 0.5rem 0;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;

  @media (min-width: 640px) {
    font-size: 0.8rem;
    margin-bottom: 0.625rem;
  }
`

const StatValue = styled.p`
  font-size: 1.25rem;
  font-weight: 700;
  color: #0c4a6e;
  margin: 0;

  @media (min-width: 640px) {
    font-size: 1.5rem;
  }
`

const DescriptionText = styled.p`
  font-size: 0.875rem;
  color: #0c4a6e;
  line-height: 1.5;
  margin: 0;

  @media (min-width: 640px) {
    font-size: 0.95rem;
  }

  strong {
    font-weight: 600;
  }

  ul {
    margin: 0.75rem 0 0 1.25rem;
    padding: 0;
  }

  li {
    margin-bottom: 0.5rem;
  }
`

export function ShareInfoSection({ share_config }: ShareInfoSectionProps) {
  if (!share_config) return null

  const rewardPerShare = share_config.amount_per_share
    ? (share_config.amount_per_share / 100).toFixed(2)
    : '0.50'

  const totalBudget = share_config.total_budget
    ? (share_config.total_budget / 100).toFixed(2)
    : '0.00'

  const budgetRemaining = share_config.current_budget_remaining
    ? (share_config.current_budget_remaining / 100).toFixed(2)
    : totalBudget

  const shareCount = Math.floor((parseFloat(totalBudget) * 100) / parseFloat(rewardPerShare))

  return (
    <Container>
      <Title>
        💰 Get Paid to Share
      </Title>

      <StatsGrid>
        <StatCard>
          <StatIcon>💵</StatIcon>
          <StatLabel>Earn per Share</StatLabel>
          <StatValue>${rewardPerShare}</StatValue>
        </StatCard>

        <StatCard>
          <StatIcon>🎯</StatIcon>
          <StatLabel>Total Budget</StatLabel>
          <StatValue>${totalBudget}</StatValue>
        </StatCard>

        <StatCard>
          <StatIcon>🔄</StatIcon>
          <StatLabel>Shares Available</StatLabel>
          <StatValue>{shareCount}</StatValue>
        </StatCard>
      </StatsGrid>

      <DescriptionText>
        <strong>How it works:</strong>
        <ul>
          <li>Click "Share to Earn" to create your unique referral link</li>
          <li>Share the link on social media (Twitter, Facebook, LinkedIn, etc.)</li>
          <li>When someone clicks your link and donates, you earn <strong>${rewardPerShare}</strong></li>
          <li>Your earnings are held for 30 days to prevent fraud, then you can withdraw</li>
          <li>No limit on earnings - share with as many people as you want!</li>
        </ul>
      </DescriptionText>
    </Container>
  )
}
