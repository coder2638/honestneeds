'use client'

import styled from 'styled-components'
import { useCampaignShareBudget } from '@/api/hooks/useShares'

interface ShareBudgetBadgeProps {
  campaignId: string
  compact?: boolean
}

const BadgeContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`

const BudgetLabel = styled.span`
  font-size: 0.8rem;
  font-weight: 600;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`

const BudgetInfo = styled.span`
  font-size: 0.95rem;
  font-weight: 700;
  color: #0f172a;
`

const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background-color: #e2e8f0;
  border-radius: 4px;
  overflow: hidden;
`

const ProgressFill = styled.div<{ percentage: number; isDepleted: boolean }>`
  height: 100%;
  background-color: ${props => (props.isDepleted ? '#ef4444' : '#10b981')};
  width: ${props => props.percentage}%;
  transition: width 0.3s ease;
  border-radius: 4px;
`

const DepletedBadge = styled.div`
  display: inline-flex;
  align-items: center;
  padding: 0.4rem 0.8rem;
  background-color: #fee2e2;
  color: #7f1d1d;
  border: 1px solid #fca5a5;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 600;
  gap: 0.5rem;
`

const CompactContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`

export function ShareBudgetBadge({ campaignId, compact = false }: ShareBudgetBadgeProps) {
  const { data: budget, isLoading, error } = useCampaignShareBudget(campaignId)

  if (isLoading || !budget) {
    return null
  }

  if (error) {
    return null
  }

  const isDepleted = budget.remainingBudget <= 0
  const percentage = (
    ((budget.totalBudget - budget.remainingBudget) / budget.totalBudget) *
    100
  ).toFixed(1)

  const formatCurrency = (cents: number): string => {
    return `$${(cents / 100).toFixed(2)}`
  }

  if (compact) {
    return (
      <CompactContainer>
        <BudgetInfo>
          {formatCurrency(budget.remainingBudget)} of{' '}
          {formatCurrency(budget.totalBudget)} remaining
        </BudgetInfo>
        {isDepleted && <Badge>🔴 Depleted</Badge>}
      </CompactContainer>
    )
  }

  return (
    <BadgeContainer>
      <div>
        <BudgetLabel>Share Budget</BudgetLabel>
      </div>

      {isDepleted ? (
        <DepletedBadge>
          <span>🔴</span>
          <span>Budget Depleted</span>
        </DepletedBadge>
      ) : (
        <>
          <BudgetInfo>
            {formatCurrency(budget.remainingBudget)} of{' '}
            {formatCurrency(budget.totalBudget)} remaining
          </BudgetInfo>
          <ProgressBar>
            <ProgressFill percentage={parseFloat(percentage)} isDepleted={isDepleted} />
          </ProgressBar>
          <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
            {percentage}% used
          </span>
        </>
      )}
    </BadgeContainer>
  )
}

const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-weight: 600;
  font-size: 0.85rem;
  color: #7f1d1d;
`
