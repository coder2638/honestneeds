'use client'

import React from 'react'
import styled from 'styled-components'
import { TrendingUp, Users, Share2, Heart } from 'lucide-react'
import { currencyUtils } from '@/utils/validationSchemas'
import type { CampaignAnalytics } from '@/api/services/campaignService'

/**
 * Campaign Metrics Cards
 * Display key campaign metrics:
 * - Donations (count & amount)
 * - Shares (count & channel breakdown)
 * - Supporters (unique count)
 * - Sweepstakes entries earned
 */

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
  margin-bottom: 24px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  }
`

const MetricCard = styled.div`
  background: white;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  transition: all 0.2s;

  &:hover {
    border-color: #d1d5db;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  }
`

const IconWrapper = styled.div<{ $bgColor?: string }>`
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background-color: ${(props) => props.$bgColor || '#ec4899'};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
`

const MetricLabel = styled.p`
  font-size: 13px;
  font-weight: 500;
  color: #6b7280;
  text-transform: uppercase;
  margin: 0;
  letter-spacing: 0.5px;
`

const MetricValue = styled.div`
  font-size: 28px;
  font-weight: 700;
  color: #111827;
  line-height: 1;
`

const MetricSubtitle = styled.p`
  font-size: 12px;
  color: #9ca3af;
  margin: 0;
`

interface CampaignMetricsCardsProps {
  analytics?: CampaignAnalytics
  sweepstakesEntries?: number
  isLoading?: boolean
}

export function CampaignMetricsCards({
  analytics,
  sweepstakesEntries = 0,
  isLoading = false,
}: CampaignMetricsCardsProps) {
  const donations = analytics?.totalDonations || 0
  const donationAmount = analytics?.totalRaised || 0
  const shares = analytics?.totalShares || 0
  const supporters = analytics?.uniqueDonors || 0

  return (
    <Grid>
      {/* Donations Metric */}
      <MetricCard>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div style={{ flex: 1 }}>
            <MetricLabel>💰 Donations</MetricLabel>
            <MetricValue>{donations}</MetricValue>
            <MetricSubtitle>{currencyUtils.formatCurrency(donationAmount)}</MetricSubtitle>
          </div>
          <IconWrapper $bgColor="#ec4899">
            <Heart size={20} />
          </IconWrapper>
        </div>
      </MetricCard>

      {/* Shares Metric */}
      <MetricCard>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div style={{ flex: 1 }}>
            <MetricLabel>📢 Shares</MetricLabel>
            <MetricValue>{shares}</MetricValue>
            <MetricSubtitle>
              {analytics?.sharesByChannel
                ? Object.keys(analytics.sharesByChannel).length
                : 0}{' '}
              channels
            </MetricSubtitle>
          </div>
          <IconWrapper $bgColor="#3b82f6">
            <Share2 size={20} />
          </IconWrapper>
        </div>
      </MetricCard>

      {/* Supporters Metric */}
      <MetricCard>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div style={{ flex: 1 }}>
            <MetricLabel>👥 Supporters</MetricLabel>
            <MetricValue>{supporters}</MetricValue>
            <MetricSubtitle>Unique donors</MetricSubtitle>
          </div>
          <IconWrapper $bgColor="#10b981">
            <Users size={20} />
          </IconWrapper>
        </div>
      </MetricCard>

      {/* Sweepstakes Metric */}
      <MetricCard>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div style={{ flex: 1 }}>
            <MetricLabel>🎰 Sweepstakes</MetricLabel>
            <MetricValue>{sweepstakesEntries}</MetricValue>
            <MetricSubtitle>Quiz entries</MetricSubtitle>
          </div>
          <IconWrapper $bgColor="#f59e0b">
            <TrendingUp size={20} />
          </IconWrapper>
        </div>
      </MetricCard>
    </Grid>
  )
}
