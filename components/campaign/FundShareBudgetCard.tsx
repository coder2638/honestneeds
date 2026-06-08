'use client'

import React from 'react'
import styled from 'styled-components'
import { Heart, ExternalLink } from 'lucide-react'
import Button from '@/components/ui/Button'

export interface FundableShareBudget {
  id: string
  campaignId: string
  campaignTitle: string
  creatorName: string
  creatorAvatar?: string
  currentBudget: number // in cents
  targetBudget: number // in cents - goal amount
  rewardPerShare: number // in cents
  description: string
  category: string
  fundedBy: number // count of supporters who've funded this
}

interface FundShareBudgetCardProps {
  budget: FundableShareBudget
  onFund: () => void
  isLoading?: boolean
}

const CardContainer = styled.div`
  background: white;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  padding: 1.5rem;
  transition: all 0.2s ease;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  height: 100%;

  &:hover {
    border-color: #cbd5e1;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  }
`

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
`

const CreatorInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex: 1;
`

const Avatar = styled.div`
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1rem;
  flex-shrink: 0;
`

const CreatorDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`

const CreatorName = styled.p`
  font-weight: 600;
  color: #0f172a;
  margin: 0;
  font-size: 0.95rem;
`

const CreatorRole = styled.p`
  font-size: 0.75rem;
  color: #64748b;
  margin: 0;
`

const Badge = styled.div`
  background-color: #fef3c7;
  color: #92400e;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
  white-space: nowrap;
  flex-shrink: 0;
`

const Title = styled.h3`
  font-size: 1.125rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
  word-break: break-word;
`

const Description = styled.p`
  font-size: 0.9rem;
  color: #64748b;
  margin: 0;
  line-height: 1.5;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
`

const ProgressContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`

const ProgressLabel = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.875rem;
`

const ProgressAmount = styled.span`
  font-weight: 600;
  color: #0f172a;
`

const ProgressPercent = styled.span`
  color: #667eea;
  font-weight: 700;
`

const ProgressBar = styled.div`
  width: 100%;
  height: 6px;
  background-color: #e2e8f0;
  border-radius: 3px;
  overflow: hidden;
`

const ProgressFill = styled.div<{ percentage: number }>`
  height: 100%;
  width: ${(props) => `${Math.min(props.percentage, 100)}%`};
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  border-radius: 3px;
  transition: width 0.3s ease;
`

const Stats = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
`

const StatBox = styled.div`
  background-color: #f8fafc;
  border-radius: 8px;
  padding: 0.75rem;
  text-align: center;
`

const StatLabel = styled.p`
  font-size: 0.75rem;
  color: #64748b;
  margin: 0 0 0.25rem 0;
  text-transform: uppercase;
  letter-spacing: 0.3px;
  font-weight: 600;
`

const StatValue = styled.p`
  font-size: 1.125rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
`

const FundersCount = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8rem;
  color: #64748b;
  padding: 0.75rem;
  background-color: #f8fafc;
  border-radius: 6px;
  justify-content: center;

  svg {
    width: 1rem;
    height: 1rem;
    color: #ec4899;
  }
`

const formatCurrency = (cents: number): string => {
  return `$${(cents / 100).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
}

const ButtonWrapper = styled.div`
  margin-top: auto;

  button {
    width: 100%;
  }
`

/**
 * FundShareBudgetCard Component
 * Production-ready card showing fundable share budget
 * Part of crowdfunded virality feature
 */
export const FundShareBudgetCard: React.FC<FundShareBudgetCardProps> = ({
  budget,
  onFund,
  isLoading = false,
}) => {
  const percentage = (budget.currentBudget / budget.targetBudget) * 100
  const initialLetter = budget.creatorName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <CardContainer>
      <Header>
        <CreatorInfo>
          <Avatar>{initialLetter}</Avatar>
          <CreatorDetails>
            <CreatorName>{budget.creatorName}</CreatorName>
            <CreatorRole>Campaign Creator</CreatorRole>
          </CreatorDetails>
        </CreatorInfo>
        <Badge>💪 Needs Funding</Badge>
      </Header>

      <Title>{budget.campaignTitle}</Title>
      <Description>{budget.description}</Description>

      <ProgressContainer>
        <ProgressLabel>
          <ProgressAmount>{formatCurrency(budget.currentBudget)}</ProgressAmount>
          <ProgressPercent>{Math.round(percentage)}%</ProgressPercent>
        </ProgressLabel>
        <ProgressBar>
          <ProgressFill percentage={percentage} />
        </ProgressBar>
        <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
          Goal: {formatCurrency(budget.targetBudget)}
        </span>
      </ProgressContainer>

      <Stats>
        <StatBox>
          <StatLabel>Reward/Share</StatLabel>
          <StatValue>{formatCurrency(budget.rewardPerShare)}</StatValue>
        </StatBox>
        <StatBox>
          <StatLabel>Category</StatLabel>
          <StatValue style={{ fontSize: '0.95rem' }}>{budget.category}</StatValue>
        </StatBox>
      </Stats>

      <FundersCount>
        <Heart size={16} />
        {budget.fundedBy} supporter{budget.fundedBy !== 1 ? 's' : ''} helping
      </FundersCount>

      <ButtonWrapper>
        <Button
          variant="primary"
          onClick={onFund}
          disabled={isLoading}
        >
          {isLoading ? 'Processing...' : '❤️ Fund This Budget'}
        </Button>
      </ButtonWrapper>
    </CardContainer>
  )
}
