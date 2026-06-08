'use client'

import styled from 'styled-components'
import { Users, Heart, TrendingUp, Handshake } from 'lucide-react'

/**
 * Multi-Meter Display Component
 * Shows 1-3 campaign progress meters: Money, Helping Hands, Customers
 * 
 * FIX #2: Multi-Meter System Implementation
 * Replaces single ProgressBar for campaigns that track multiple support types
 */

export type MeterType = 'money' | 'helping_hands' | 'customers'

export interface MeterData {
  type: MeterType
  current: number
  goal: number
  label: string
  icon: React.ReactNode
  color: string
  description: string
}

interface MultiMeterDisplayProps {
  meters: MeterData[]
  campaignTitle?: string
  showLabels?: boolean
  size?: 'sm' | 'md' | 'lg'
}

const Container = styled.div`
  display: grid;
  gap: 2rem;
  width: 100%;

  @media (max-width: 768px) {
    gap: 1.5rem;
  }
`

const MeterCard = styled.div<{ color: string; size: string }>`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`

const MeterHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.25rem;
`

const MeterIcon = styled.div<{ color: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border-radius: 0.5rem;
  background-color: ${(props) => props.color}22;
  color: ${(props) => props.color};
  flex-shrink: 0;
`

const MeterLabel = styled.h3`
  font-size: 0.95rem;
  font-weight: 600;
  color: #0f172a;
  margin: 0;
`

const MeterDescription = styled.p`
  font-size: 0.8rem;
  color: #64748b;
  margin: 0;
  line-height: 1.4;
`

const ProgressBarContainer = styled.div`
  position: relative;
  width: 100%;
`

const ProgressBarBackground = styled.div`
  width: 100%;
  height: 12px;
  background-color: #e2e8f0;
  border-radius: 9999px;
  overflow: hidden;
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.05);
`

const ProgressBarFill = styled.div<{ percentage: number; color: string }>`
  height: 100%;
  background: linear-gradient(
    90deg,
    ${(props) => props.color} 0%,
    ${(props) => props.color}dd 100%
  );
  width: ${(props) => Math.min(props.percentage, 100)}%;
  border-radius: 9999px;
  transition: width 0.5s ease;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.3),
      transparent
    );
    border-radius: 9999px;
  }
`

const MeterStats = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.85rem;
  color: #64748b;
`

const StatValue = styled.span`
  font-weight: 600;
  color: #0f172a;
  font-family: 'Courier New', monospace;
`

const PercentageLabel = styled.span<{ color: string }>`
  font-weight: 700;
  color: ${(props) => props.color};
  font-size: 0.9rem;
`

const MetersGrid = styled.div<{ columnCount: number }>`
  display: grid;
  grid-template-columns: repeat(
    ${(props) => Math.min(props.columnCount, 3)},
    1fr
  );
  gap: 1.5rem;
  width: 100%;

  @media (max-width: 768px) {
    grid-template-columns: ${(props) =>
      props.columnCount === 1 ? '1fr' : `repeat(${Math.min(props.columnCount, 2)}, 1fr)`};
    gap: 1.25rem;
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`

const MeterItemWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 1rem;
  background-color: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 0.75rem;
  transition: all 0.2s ease;

  &:hover {
    border-color: #cbd5e1;
    background-color: #ffffff;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }
`

/**
 * Helper function to create meter data
 */
export function createMeterData(
  type: MeterType,
  current: number,
  goal: number
): MeterData {
  const meterConfigs: Record<MeterType, Omit<MeterData, 'current' | 'goal'>> = {
    money: {
      type: 'money',
      label: '💰 Money Raised',
      icon: <TrendingUp size={20} />,
      color: '#3b82f6',
      description: 'Monetary donations received',
    },
    helping_hands: {
      type: 'helping_hands',
      label: '🙌 Helping Hands',
      icon: <Handshake size={20} />,
      color: '#10b981',
      description: 'Volunteers offering support',
    },
    customers: {
      type: 'customers',
      label: '👥 Customers',
      icon: <Users size={20} />,
      color: '#f59e0b',
      description: 'New customers/referrals',
    },
  }

  const config = meterConfigs[type]
  return {
    ...config,
    current,
    goal,
  }
}

/**
 * Meter Item Component
 * Individual meter display with progress bar
 */
function MeterItem({
  meter,
  showLabel = true,
}: {
  meter: MeterData
  showLabel?: boolean
}) {
  const percentage = meter.goal > 0 ? (meter.current / meter.goal) * 100 : 0
  const displayPercentage = Math.min(percentage, 100)

  // Format display values based on meter type
  const formatValue = (value: number, type: MeterType): string => {
    if (type === 'money') {
      return `$${(value / 100).toLocaleString('en-US', { maximumFractionDigits: 0 })}`
    }
    return value.toString()
  }

  const currentDisplay = formatValue(meter.current, meter.type)
  const goalDisplay = formatValue(meter.goal, meter.type)

  return (
    <MeterItemWrapper>
      {showLabel && (
        <MeterHeader>
          <MeterIcon color={meter.color}>{meter.icon}</MeterIcon>
          <div>
            <MeterLabel>{meter.label}</MeterLabel>
            <MeterDescription>{meter.description}</MeterDescription>
          </div>
        </MeterHeader>
      )}

      <ProgressBarContainer>
        <ProgressBarBackground>
          <ProgressBarFill percentage={displayPercentage} color={meter.color} />
        </ProgressBarBackground>
      </ProgressBarContainer>

      <MeterStats>
        <span>
          <StatValue>{currentDisplay}</StatValue> of <StatValue>{goalDisplay}</StatValue>
        </span>
        <PercentageLabel color={meter.color}>{displayPercentage.toFixed(0)}%</PercentageLabel>
      </MeterStats>
    </MeterItemWrapper>
  )
}

/**
 * Main MultiMeterDisplay Component
 * Renders 1-3 meters in a responsive grid
 */
export function MultiMeterDisplay({
  meters,
  campaignTitle,
  showLabels = true,
  size = 'md',
}: MultiMeterDisplayProps) {
  if (!meters || meters.length === 0) {
    return null
  }

  return (
    <Container>
      {campaignTitle && showLabels && (
        <div style={{ marginBottom: '0.5rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
            Campaign Progress
          </h2>
        </div>
      )}

      <MetersGrid columnCount={meters.length}>
        {meters.map((meter, index) => (
          <MeterItem key={`${meter.type}-${index}`} meter={meter} showLabel={showLabels} />
        ))}
      </MetersGrid>
    </Container>
  )
}

/**
 * Simplified SingleMeterDisplay (for backward compatibility)
 * Used when campaign tracks only money
 */
export function SingleMeterDisplay({
  current,
  goal,
  label = '💰 Money Raised',
  showLabel = true,
}: {
  current: number
  goal: number
  label?: string
  showLabel?: boolean
}) {
  const meterData = createMeterData('money', current, goal)
  meterData.label = label

  return (
    <MeterItemWrapper>
      {showLabel && (
        <MeterHeader>
          <MeterIcon color={meterData.color}>{meterData.icon}</MeterIcon>
          <div>
            <MeterLabel>{meterData.label}</MeterLabel>
          </div>
        </MeterHeader>
      )}

      <ProgressBarContainer>
        <ProgressBarBackground>
          <ProgressBarFill
            percentage={Math.min((current / goal) * 100, 100)}
            color={meterData.color}
          />
        </ProgressBarBackground>
      </ProgressBarContainer>

      <MeterStats>
        <span>
          <StatValue>${(current / 100).toLocaleString('en-US', { maximumFractionDigits: 0 })}</StatValue> of{' '}
          <StatValue>${(goal / 100).toLocaleString('en-US', { maximumFractionDigits: 0 })}</StatValue>
        </span>
        <PercentageLabel color={meterData.color}>
          {Math.min((current / goal) * 100, 100).toFixed(0)}%
        </PercentageLabel>
      </MeterStats>
    </MeterItemWrapper>
  )
}
