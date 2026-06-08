'use client'

import React from 'react'
import styled from 'styled-components'
import { TrendingUp, TrendingDown } from 'lucide-react'

interface TrendIndicatorProps {
  value: number | string
  label: string
  unit?: string
  direction?: 'up' | 'down' | 'neutral'
  percentChange?: number
  previousValue?: number
  showUnit?: boolean
  size?: 'small' | 'medium' | 'large'
}

const Container = styled.div<{ size: 'small' | 'medium' | 'large' }>`
  display: flex;
  align-items: center;
  gap: ${(props) => {
    switch (props.size) {
      case 'small': return '8px'
      case 'large': return '16px'
      default: return '12px'
    }
  }};
  font-size: ${(props) => {
    switch (props.size) {
      case 'small': return '12px'
      case 'large': return '18px'
      default: return '14px'
    }
  }};
`

const ValueBlock = styled.div<{ size: 'small' | 'medium' | 'large' }>`
  display: flex;
  flex-direction: column;
  gap: 4px;
`

const Value = styled.span<{ size: 'small' | 'medium' | 'large' }>`
  font-weight: 600;
  color: #111827;
  font-size: ${(props) => {
    switch (props.size) {
      case 'small': return '14px'
      case 'large': return '24px'
      default: return '20px'
    }
  }};
`

const Label = styled.span`
  color: #6b7280;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`

const TrendBlock = styled.div<{ direction: 'up' | 'down' | 'neutral' }>`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 10px;
  border-radius: 6px;
  background-color: ${(props) => {
    switch (props.direction) {
      case 'up': return '#dcfce7'
      case 'down': return '#fee2e2'
      default: return '#f3f4f6'
    }
  }};
  color: ${(props) => {
    switch (props.direction) {
      case 'up': return '#16a34a'
      case 'down': return '#dc2626'
      default: return '#6b7280'
    }
  }};
  font-weight: 600;
  white-space: nowrap;
`

const TrendIcon = styled.div<{ direction: 'up' | 'down' | 'neutral' }>`
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${(props) => {
    switch (props.direction) {
      case 'up': return '#16a34a'
      case 'down': return '#dc2626'
      default: return '#6b7280'
    }
  }};
`

/**
 * TrendIndicator Component
 * Displays metric values with trend direction and percentage change
 * 
 * @example
 * <TrendIndicator
 *   value={1250}
 *   label="Total Shares"
 *   unit="shares"
 *   direction="up"
 *   percentChange={12.5}
 *   size="large"
 * />
 */
export const TrendIndicator: React.FC<TrendIndicatorProps> = ({
  value,
  label,
  unit,
  direction = 'neutral',
  percentChange,
  previousValue,
  showUnit = true,
  size = 'medium',
}) => {
  // Auto-detect direction from percentChange if not provided
  let finalDirection = direction
  if (direction === 'neutral' && percentChange !== undefined) {
    finalDirection = percentChange > 0 ? 'up' : percentChange < 0 ? 'down' : 'neutral'
  }

  // Calculate percentChange from previous value if not provided
  let finalPercentChange = percentChange
  if (percentChange === undefined && previousValue !== undefined && typeof value === 'number') {
    finalPercentChange = previousValue !== 0 ? ((value - previousValue) / previousValue) * 100 : 0
  }

  const formatValue = (val: number | string) => {
    if (typeof val === 'string') return val
    if (val >= 1000000) return (val / 1000000).toFixed(1) + 'M'
    if (val >= 1000) return (val / 1000).toFixed(1) + 'K'
    return val.toFixed(0)
  }

  const displayValue = formatValue(value)
  const displayPercentChange = finalPercentChange !== undefined ? Math.abs(finalPercentChange).toFixed(1) : null

  return (
    <Container size={size}>
      <ValueBlock size={size}>
        <Label>{label}</Label>
        <Value size={size}>
          {displayValue}
          {showUnit && unit && <span style={{ fontSize: '0.7em', marginLeft: '4px' }}>({unit})</span>}
        </Value>
      </ValueBlock>

      {finalPercentChange !== undefined && (
        <TrendBlock direction={finalDirection}>
          <TrendIcon direction={finalDirection}>
            {finalDirection === 'up' && <TrendingUp size={18} />}
            {finalDirection === 'down' && <TrendingDown size={18} />}
            {finalDirection === 'neutral' && <span style={{ fontSize: '12px', fontWeight: 'bold' }}>→</span>}
          </TrendIcon>
          <span>{displayPercentChange}%</span>
        </TrendBlock>
      )}
    </Container>
  )
}

/**
 * TrendIndicatorRow Component
 * Displays multiple trend indicators in a responsive row layout
 */
const RowContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 24px;
  width: 100%;
`

interface TrendIndicatorRowProps {
  indicators: TrendIndicatorProps[]
  title?: string
}

const RowWrapper = styled.div`
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 24px;
`

const RowTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: #111827;
  margin-bottom: 20px;
  margin-top: 0;
`

export const TrendIndicatorRow: React.FC<TrendIndicatorRowProps> = ({ indicators, title }) => {
  return (
    <RowWrapper>
      {title && <RowTitle>{title}</RowTitle>}
      <RowContainer>
        {indicators.map((indicator, idx) => (
          <TrendIndicator key={idx} {...indicator} size="large" />
        ))}
      </RowContainer>
    </RowWrapper>
  )
}

export default TrendIndicator
