'use client'

import React, { useMemo, useState } from 'react'
import styled from 'styled-components'
import { Card } from '@/components/Card'
import Button from '@/components/ui/Button'
import { WithdrawalRequestModal } from '@/components/wallet/WithdrawalRequestModal'

interface ShareAnalyticsProps {
  shares?: Array<{
    shareId: string
    campaignId: string
    campaignTitle: string
    channel: string
    is_paid: boolean
    reward_amount: number
    status: 'completed' | 'pending_verification' | 'verified'
    createdAt: string
  }>
  performance?: {
    totalReferrals: number
    totalConversions: number
    conversionRate: number
    totalRewardEarned: number
    sharesByChannel: Record<string, number>
    topPerformingCampaign?: {
      campaignId: string
      campaignTitle: string
      shares: number
      referrals: number
      revenue: number
    }
  }
  isLoading?: boolean
}

const Container = styled.div`
  display: grid;
  gap: 24px;
`

const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
`

const MetricCard = styled(Card)`
  padding: 20px;
  border: 2px solid #e5e7eb;
  transition: all 0.2s;
  background: white;

  &:hover {
    border-color: #d1d5db;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  }
`

const MetricLabel = styled.p`
  font-size: 13px;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  margin: 0 0 8px 0;
  letter-spacing: 0.5px;
`

const MetricValue = styled.p`
  font-size: 32px;
  font-weight: 700;
  color: #111827;
  margin: 0;
  line-height: 1;
`

const MetricSubtext = styled.div`
  margin-top: 8px;
  font-size: 13px;
  color: #6b7280;
`

const ChannelGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 12px;
`

const ChannelCard = styled(Card)`
  padding: 16px;
  border: 1px solid #e5e7eb;
  text-align: center;
  transition: all 0.2s;
  background: white;

  &:hover {
    border-color: #d1d5db;
    background: #f9fafb;
  }
`

const ChannelEmoji = styled.div`
  font-size: 24px;
  margin-bottom: 8px;
`

const ChannelName = styled.p`
  font-size: 12px;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  margin: 0 0 8px 0;
  letter-spacing: 0.5px;
`

const ChannelCount = styled.p`
  font-size: 20px;
  font-weight: 700;
  color: #111827;
  margin: 0;
`

const SectionTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: #111827;
  margin: 0 0 16px 0;
`

const EmptyState = styled.div`
  padding: 32px 24px;
  text-align: center;
  background: #f9fafb;
  border: 1px dashed #d1d5db;
  border-radius: 8px;
`

const EmptyStateText = styled.p`
  color: #6b7280;
  margin: 0;
  font-size: 14px;
`

const PerformanceCard = styled(Card)`
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
`

const PerformanceLabel = styled.p`
  font-size: 13px;
  font-weight: 600;
  text-transform: uppercase;
  margin: 0 0 8px 0;
  letter-spacing: 0.5px;
  opacity: 0.9;
`

const PerformanceValue = styled.p`
  font-size: 32px;
  font-weight: 700;
  margin: 0;
  line-height: 1;
`

const TopCampaignCard = styled(Card)`
  padding: 20px;
  border-left: 4px solid #fbbf24;
  background: #fffbeb;
  border-radius: 8px;
`

const TopCampaignTitle = styled.p`
  font-size: 14px;
  font-weight: 600;
  color: #111827;
  margin: 0 0 8px 0;
`

const TopCampaignStats = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
`

const TopCampaignStat = styled.div`
  text-align: center;
`

const TopCampaignStatLabel = styled.p`
  font-size: 11px;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  margin: 0;
`

const TopCampaignStatValue = styled.p`
  font-size: 18px;
  font-weight: 700;
  color: #111827;
  margin: 4px 0 0 0;
`

const WithdrawButton = styled(Button)`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
  color: white !important;
  border: none !important;
  padding: 0.75rem 1.5rem !important;
  font-size: 1rem !important;
  font-weight: 600 !important;
  border-radius: 8px !important;
  cursor: pointer;
  width: 100%;
  max-width: 300px;
  transition: all 0.2s;

  &:hover {
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }
`

const CHANNEL_EMOJIS: Record<string, string> = {
  facebook: '👍',
  twitter: '𝕏',
  linkedin: '💼',
  email: '📧',
  whatsapp: '💬',
  telegram: '📱',
  instagram: '📷',
  reddit: '🔴',
  tiktok: '🎵',
  sms: '💭',
  link: '🔗',
  other: '🌐',
}

/**
 * MySharAnalyticsDashboard Component
 * Displays individual sharer's personal share analytics and rewards
 * Shows: earnings, referrals, conversions, shares by platform, top performing campaign
 */
export const MySharAnalyticsDashboard: React.FC<ShareAnalyticsProps> = ({
  shares = [],
  performance,
  isLoading = false,
}) => {
  const [showWithdrawalModal, setShowWithdrawalModal] = useState(false)
  
  const totalShares = shares.length
  const totalRewardsEarned = (performance?.totalRewardEarned || 0) / 100 // Convert cents to dollars
  const totalReferrals = performance?.totalReferrals || 0
  const totalConversions = performance?.totalConversions || 0
  const conversionRate = performance?.conversionRate || 0
  const topCampaign = performance?.topPerformingCampaign

  // Calculate paid vs unpaid shares
  const paidShares = useMemo(() => {
    return shares.filter((s) => s.is_paid).length
  }, [shares])

  const channelsWithData = useMemo(() => {
    const sharesByChannel = performance?.sharesByChannel || {}
    const channels = Object.entries(sharesByChannel || {}).map(([channel, count]) => ({
      name: channel,
      emoji: CHANNEL_EMOJIS[channel] || '🌐',
      count: count as number,
    }))
    return channels.sort((a, b) => b.count - a.count)
  }, [performance])

  if (isLoading) {
    return (
      <Container>
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <p style={{ color: '#6b7280' }}>Loading your share analytics...</p>
        </div>
      </Container>
    )
  }

  return (
    <Container>
      {/* Key Performance Metrics */}
      <div>
        <SectionTitle>💰 Your Share Performance</SectionTitle>
        <MetricsGrid>
          <PerformanceCard>
            <PerformanceLabel>Total Rewards Earned</PerformanceLabel>
            <PerformanceValue>${totalRewardsEarned.toFixed(2)}</PerformanceValue>
            <MetricSubtext>From {totalShares} share{totalShares !== 1 ? 's' : ''}</MetricSubtext>
          </PerformanceCard>

          <MetricCard>
            <MetricLabel>📢 Total Shares</MetricLabel>
            <MetricValue>{totalShares}</MetricValue>
            <MetricSubtext>
              {paidShares > 0 ? `${paidShares} paid ${paidShares === 1 ? 'share' : 'shares'}` : 'Share campaigns to earn'}
            </MetricSubtext>
          </MetricCard>

          <MetricCard>
            <MetricLabel>🎯 Total Referrals</MetricLabel>
            <MetricValue>{totalReferrals}</MetricValue>
            <MetricSubtext>People clicked your link</MetricSubtext>
          </MetricCard>

          <MetricCard>
            <MetricLabel>✅ Conversions</MetricLabel>
            <MetricValue>{totalConversions}</MetricValue>
            <MetricSubtext>
              {conversionRate > 0 && `${conversionRate.toFixed(1)}% conversion rate`}
              {conversionRate === 0 && 'No conversions yet'}
            </MetricSubtext>
          </MetricCard>
        </MetricsGrid>
        
        {/* Withdraw Button */}
        {totalRewardsEarned > 0 && (
          <div style={{ marginTop: '1.5rem' }}>
            <WithdrawButton
              onClick={() => setShowWithdrawalModal(true)}
            >
              💰 Withdraw ${totalRewardsEarned.toFixed(2)}
            </WithdrawButton>
          </div>
        )}
      </div>

      {/* Shares by Platform */}
      {totalShares > 0 ? (
        <div>
          <SectionTitle>📱 Your Shares by Platform</SectionTitle>
          {channelsWithData.length > 0 ? (
            <ChannelGrid>
              {channelsWithData.map((channel) => (
                <ChannelCard key={channel.name}>
                  <ChannelEmoji>{channel.emoji}</ChannelEmoji>
                  <ChannelName>{channel.name}</ChannelName>
                  <ChannelCount>{channel.count}</ChannelCount>
                </ChannelCard>
              ))}
            </ChannelGrid>
          ) : (
            <EmptyState>
              <EmptyStateText>No shares recorded yet</EmptyStateText>
            </EmptyState>
          )}
        </div>
      ) : (
        <div>
          <SectionTitle>📱 Your Shares by Platform</SectionTitle>
          <EmptyState>
            <EmptyStateText>
              👉 Start sharing campaigns to earn rewards! Click on campaigns and share them on your favorite platforms.
            </EmptyStateText>
          </EmptyState>
        </div>
      )}

      {/* Top Performing Campaign */}
      {topCampaign && (
        <div>
          <SectionTitle>⭐ Your Top Performing Campaign</SectionTitle>
          <TopCampaignCard>
            <TopCampaignTitle>🎯 {topCampaign.campaignTitle}</TopCampaignTitle>
            <TopCampaignStats>
              <TopCampaignStat>
                <TopCampaignStatLabel>Shares</TopCampaignStatLabel>
                <TopCampaignStatValue>{topCampaign.shares}</TopCampaignStatValue>
              </TopCampaignStat>
              <TopCampaignStat>
                <TopCampaignStatLabel>Referrals</TopCampaignStatLabel>
                <TopCampaignStatValue>{topCampaign.referrals}</TopCampaignStatValue>
              </TopCampaignStat>
              <TopCampaignStat>
                <TopCampaignStatLabel>Revenue</TopCampaignStatLabel>
                <TopCampaignStatValue>${(topCampaign.revenue / 100).toFixed(2)}</TopCampaignStatValue>
              </TopCampaignStat>
            </TopCampaignStats>
          </TopCampaignCard>
        </div>
      )}

      {/* Help Section */}
      {totalShares === 0 && (
        <Card style={{ padding: '20px', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '8px' }}>
          <SectionTitle style={{ color: '#1e40af', marginBottom: '12px' }}>📖 How Share Rewards Work</SectionTitle>
          <p style={{ margin: '0 0 12px 0', color: '#1e40af', fontSize: '14px', lineHeight: '1.6' }}>
            1. <strong>Find a campaign</strong> that offers "Get Paid to Share"<br />
            2. <strong>Click "Share to Earn"</strong> and select your platform<br />
            3. <strong>Share the campaign</strong> with your network<br />
            4. <strong>Earn rewards</strong> automatically when people click your link
          </p>
          <p style={{ margin: '0', color: '#1e40af', fontSize: '13px', fontStyle: 'italic' }}>
            The more you share, the more you earn. Your rewards update in real-time.
          </p>
        </Card>
      )}

      {/* Withdrawal Modal */}
      {showWithdrawalModal && (
        <WithdrawalRequestModal
          availableBalance={Math.floor(totalRewardsEarned * 100)}
          onClose={() => setShowWithdrawalModal(false)}
          onSuccess={() => setShowWithdrawalModal(false)}
        />
      )}
    </Container>
  )
}
