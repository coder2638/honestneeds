/**
 * ShareEarningsDisplay.tsx
 * Component to display earning potential for paid sharing campaigns
 * Shows real-time earnings, platform breakdown, and earning potential
 */

'use client'

import React from 'react'
import styled from 'styled-components'
import { TrendingUp, DollarSign, Target, Award } from 'lucide-react'
import { useShareEarnings, useShareEarningPotential } from '@/api/hooks/useShareEarnings'

interface ShareEarningsDisplayProps {
  campaignId: string
  isCreator?: boolean
  compact?: boolean
}

const Container = styled.div`
  margin: 20px 0;
`

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;

  h3 {
    margin: 0;
    font-size: 18px;
    font-weight: 600;
    color: #1f2937;
  }

  svg {
    color: #10b981;
  }
`

const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
  margin-bottom: 20px;
`

const MetricCard = styled.div`
  background: linear-gradient(135deg, #667eea15 0%, #764ba215 100%);
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 16px;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  }
`

const MetricLabel = styled.div`
  font-size: 12px;
  color: #9ca3af;
  text-transform: uppercase;
  font-weight: 500;
  letter-spacing: 0.5px;
  margin-bottom: 8px;
`

const MetricValue = styled.div`
  font-size: 28px;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 4px;
  font-variant-numeric: tabular-nums;
`

const MetricSubtext = styled.div`
  font-size: 12px;
  color: #6b7280;
`

const PotentialBox = styled.div`
  background: #ecfdf5;
  border: 1px solid #a7f3d0;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
`

const PotentialLabel = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  font-weight: 600;
  color: #047857;
  margin-bottom: 8px;

  svg {
    width: 16px;
    height: 16px;
  }
`

const PotentialValue = styled.div`
  font-size: 24px;
  font-weight: 700;
  color: #065f46;
  margin-bottom: 4px;

  small {
    font-size: 12px;
    color: #10b981;
    font-weight: 500;
  }
`

const PotentialMetrics = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid #a7f3d0;
`

const PotentialMetric = styled.div`
  font-size: 12px;

  .label {
    color: #6b7280;
    margin-bottom: 2px;
  }

  .value {
    font-size: 16px;
    font-weight: 600;
    color: #047857;
  }
`

const PlatformBreakdown = styled.div`
  margin-top: 16px;
`

const PlatformLabel = styled.div`
  font-size: 12px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`

const PlatformList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

const PlatformItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 12px;
  background: #f9fafb;
  border-radius: 6px;
  border: 1px solid #e5e7eb;
  font-size: 13px;
`

const PlatformName = styled.span`
  font-weight: 500;
  color: #1f2937;
`

const PlatformStats = styled.span`
  color: #6b7280;
  font-size: 12px;

  strong {
    color: #667eea;
    font-weight: 600;
  }
`

const LoadingState = styled.div`
  text-align: center;
  padding: 20px;
  color: #9ca3af;
  font-size: 14px;
`

const ErrorState = styled.div`
  padding: 12px 16px;
  background: #fee2e2;
  color: #991b1b;
  border: 1px solid #fca5a5;
  border-radius: 6px;
  font-size: 13px;
`

/**
 * ShareEarningsDisplay Component
 */
const ShareEarningsDisplay: React.FC<ShareEarningsDisplayProps> = ({
  campaignId,
  isCreator = false,
  compact = false,
}) => {
  const { data: earnings, isLoading: earningsLoading, error: earningsError } = useShareEarnings(campaignId)
  const { data: potential, isLoading: potentialLoading } = useShareEarningPotential(campaignId)

  if (earningsError) {
    return (
      <Container>
        <ErrorState>Unable to load earnings data. Please try again later.</ErrorState>
      </Container>
    )
  }

  // Compact mode - just show key metrics
  if (compact) {
    if (earningsLoading || potentialLoading) {
      return <LoadingState>Loading earnings...</LoadingState>
    }

    return (
      <Container>
        <Header>
          <TrendingUp size={20} />
          <h3>Earning Potential</h3>
        </Header>

        <MetricsGrid>
          {potential && (
            <MetricCard>
              <MetricLabel>Reward Per Share</MetricLabel>
              <MetricValue>${(potential.rewardPerShareDollars || 0).toFixed(2)}</MetricValue>
              <MetricSubtext>Up to {potential.sharesRemaining || 0} more shares available</MetricSubtext>
            </MetricCard>
          )}

          {earnings && (
            <MetricCard>
              <MetricLabel>Your Total Earnings</MetricLabel>
              <MetricValue>${(earnings.totalEarningsDollars || 0).toFixed(2)}</MetricValue>
              <MetricSubtext>{earnings.verifiedShares || 0} verified shares</MetricSubtext>
            </MetricCard>
          )}
        </MetricsGrid>
      </Container>
    )
  }

  // Full mode - detailed breakdown
  if (earningsLoading || potentialLoading) {
    return (
      <Container>
        <LoadingState>Loading earnings data...</LoadingState>
      </Container>
    )
  }

  return (
    <Container>
      <Header>
        <TrendingUp size={20} />
        <h3>{isCreator ? 'Sharing Campaign Earnings' : 'Earn Money Sharing This Campaign'}</h3>
      </Header>

      {/* Earning Potential Box */}
      {potential && (
        <PotentialBox>
          <PotentialLabel>
            <Target size={16} />
            Maximum Earning Potential
          </PotentialLabel>
          <PotentialValue>
            ${(potential.totalBudgetDollars || 0).toFixed(2)}
            <br />
            <small>Pool for all sharers</small>
          </PotentialValue>
          <PotentialMetrics>
            <PotentialMetric>
              <div className="label">Per Share</div>
              <div className="value">${(potential.rewardPerShareDollars || 0).toFixed(2)}</div>
            </PotentialMetric>
            <PotentialMetric>
              <div className="label">Shares Remaining</div>
              <div className="value">{potential.sharesRemaining || 0}</div>
            </PotentialMetric>
          </PotentialMetrics>
        </PotentialBox>
      )}

      {/* Current Earnings Metrics */}
      <MetricsGrid>
        <MetricCard>
          <MetricLabel>
            <DollarSign size={14} /> Total Earned
          </MetricLabel>
          <MetricValue>${(earnings?.totalEarningsDollars || 0).toFixed(2)}</MetricValue>
          <MetricSubtext>
            {earnings?.verifiedShares || 0} verified shares
            {earnings?.pendingShares && earnings.pendingShares > 0 ? ` + ${earnings.pendingShares} pending` : ''}
          </MetricSubtext>
        </MetricCard>

        <MetricCard>
          <MetricLabel>
            <Award size={14} /> Pending Verification
          </MetricLabel>
          <MetricValue>${(earnings?.pendingEarningsDollars || 0).toFixed(2)}</MetricValue>
          <MetricSubtext>{earnings?.pendingShares || 0} shares awaiting verification</MetricSubtext>
        </MetricCard>

        <MetricCard>
          <MetricLabel>Total Shares</MetricLabel>
          <MetricValue>{earnings?.totalShares || 0}</MetricValue>
          <MetricSubtext>
            {earnings?.verifiedShares || 0} verified • {earnings?.pendingShares || 0} pending
          </MetricSubtext>
        </MetricCard>
      </MetricsGrid>

      {/* Platform Breakdown */}
      {earnings && Object.keys(earnings.earningsByPlatform || {}).length > 0 && (
        <PlatformBreakdown>
          <PlatformLabel>Earnings by Platform</PlatformLabel>
          <PlatformList>
            {Object.entries(earnings.earningsByPlatform).map(([platform, data]) => (
              <PlatformItem key={platform}>
                <PlatformName>{platform.charAt(0).toUpperCase() + platform.slice(1)}</PlatformName>
                <PlatformStats>
                  <strong>{data.shares}</strong> shares • ${data.earningsDollars.toFixed(2)}
                </PlatformStats>
              </PlatformItem>
            ))}
          </PlatformList>
        </PlatformBreakdown>
      )}

      {/* Estimated Monthly Earnings */}
      {earnings?.estimatedMonthlyEarnings && (
        <PotentialBox style={{ background: '#f0fdf4', borderColor: '#86efac', marginTop: '16px' }}>
          <PotentialLabel>
            <TrendingUp size={16} style={{ color: '#22c55e' }} />
            Estimated Monthly Earnings
          </PotentialLabel>
          <PotentialValue style={{ color: '#15803d' }}>
            ${earnings.estimatedMonthlyEarnings.earningsDollars.toFixed(2)}
          </PotentialValue>
          <MetricSubtext style={{ color: '#16a34a' }}>
            Based on {earnings.estimatedMonthlyEarnings.shareCount} shares per month
          </MetricSubtext>
        </PotentialBox>
      )}
    </Container>
  )
}

export default ShareEarningsDisplay
