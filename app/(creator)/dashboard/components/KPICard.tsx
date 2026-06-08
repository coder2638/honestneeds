'use client'

import React from 'react'
import styled from 'styled-components'
import { TrendingUp, TrendingDown, Minus, ArrowRight } from 'lucide-react'

/**
 * KPI Card Component
 * Displays key performance indicators with trend indicators and comparisons
 */

interface KPICardProps {
  title: string
  value: string | number
  unit?: string
  trend?: {
    direction: 'up' | 'down' | 'neutral'
    percentage: number
    period: string
  }
  comparison?: {
    label: string
    value: string
  }
  icon?: React.ReactNode
  color?: 'primary' | 'success' | 'warning' | 'danger'
  action?: {
    label: string
    onClick: () => void
  }
  isLoading?: boolean
}

const CardContainer = styled.div<{ $color?: string }>`
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 24px;
  transition: all 0.3s ease;
  min-height: 180px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  &:hover {
    border-color: #bfdbfe;
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15);
  }

  @media (max-width: 768px) {
    padding: 16px;
    min-height: auto;
  }
`

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
`

const TitleContainer = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
`

const IconWrapper = styled.div<{ $color?: string }>`
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  background: ${(props) => {
    switch (props.$color) {
      case 'success':
        return '#dcfce7'
      case 'warning':
        return '#fef3c7'
      case 'danger':
        return '#fee2e2'
      default:
        return '#eff6ff'
    }
  }};
  color: ${(props) => {
    switch (props.$color) {
      case 'success':
        return '#22c55e'
      case 'warning':
        return '#eab308'
      case 'danger':
        return '#ef4444'
      default:
        return '#3b82f6'
    }
  }};
`

const Title = styled.h3`
  font-size: 13px;
  font-weight: 600;
  color: #6b7280;
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`

const ValueContainer = styled.div`
  margin-bottom: 12px;
`

const Value = styled.div<{ $color?: string }>`
  font-size: 32px;
  font-weight: 700;
  margin: 4px 0;
  color: ${(props) => {
    switch (props.$color) {
      case 'success':
        return '#22c55e'
      case 'warning':
        return '#eab308'
      case 'danger':
        return '#ef4444'
      default:
        return '#0f172a'
    }
  }};

  @media (max-width: 768px) {
    font-size: 24px;
  }
`

const TrendContainer = styled.div<{ $direction: 'up' | 'down' | 'neutral' }>`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 600;
  color: ${(props) => {
    switch (props.$direction) {
      case 'up':
        return '#10b981'
      case 'down':
        return '#ef4444'
      default:
        return '#6b7280'
    }
  }};
  margin-bottom: 8px;
`

const ComparisonText = styled.div`
  font-size: 12px;
  color: #6b7280;
  margin-top: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const ActionLink = styled.button`
  margin-top: 12px;
  background: none;
  border: none;
  color: #3b82f6;
  cursor: pointer;
  font-size: 12px;
  font-weight: 600;
  padding: 0;
  display: flex;
  align-items: center;
  gap: 4px;
  transition: gap 0.2s ease;

  &:hover {
    gap: 8px;
  }
`

const SkeletonLoader = styled.div`
  background: linear-gradient(-90deg, #f0f0f0 0%, #f8f8f8 50%, #f0f0f0 100%);
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

const ValueSkeleton = styled(SkeletonLoader)`
  height: 32px;
  border-radius: 6px;
  margin: 4px 0;
`

/**
 * KPI Card Component
 */
export const KPICard = React.forwardRef<HTMLDivElement, KPICardProps>(
  (
    {
      title,
      value,
      unit = '',
      trend,
      comparison,
      icon,
      color = 'primary',
      action,
      isLoading = false,
    },
    ref
  ) => {
    const getTrendIcon = () => {
      if (!trend) return null
      switch (trend.direction) {
        case 'up':
          return <TrendingUp size={16} />
        case 'down':
          return <TrendingDown size={16} />
        case 'neutral':
          return <Minus size={16} />
      }
    }

    return (
      <CardContainer ref={ref}>
        <div>
          <CardHeader>
            <TitleContainer>
              {icon && <IconWrapper $color={color}>{icon}</IconWrapper>}
              <Title>{title}</Title>
            </TitleContainer>
          </CardHeader>

          <ValueContainer>
            {isLoading ? (
              <ValueSkeleton />
            ) : (
              <>
                <Value $color={color}>
                  {unit}
                  {typeof value === 'number' ? value.toLocaleString() : value}
                </Value>
                {trend && (
                  <TrendContainer $direction={trend.direction}>
                    {getTrendIcon()}
                    <span>
                      {trend.direction === 'up' ? '+' : trend.direction === 'down' ? '-' : ''}
                      {trend.percentage}% {trend.period}
                    </span>
                  </TrendContainer>
                )}
              </>
            )}
          </ValueContainer>

          {comparison && !isLoading && (
            <ComparisonText>
              <span>{comparison.label}</span>
              <strong>{comparison.value}</strong>
            </ComparisonText>
          )}
        </div>

        {action && !isLoading && (
          <ActionLink onClick={action.onClick}>
            {action.label}
            <ArrowRight size={14} />
          </ActionLink>
        )}
      </CardContainer>
    )
  }
)

KPICard.displayName = 'KPICard'

/**
 * KPI Cards Container with responsive grid
 */

interface KPICardsGridProps {
  cards: KPICardProps[]
  isLoading?: boolean
}

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  margin-bottom: 32px;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`

export function KPICardsGrid({ cards, isLoading = false }: KPICardsGridProps) {
  return (
    <GridContainer>
      {cards.map((card, index) => (
        <KPICard
          key={`${card.title}-${index}`}
          {...card}
          isLoading={isLoading}
        />
      ))}
    </GridContainer>
  )
}
