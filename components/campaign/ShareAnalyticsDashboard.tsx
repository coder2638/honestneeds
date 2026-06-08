'use client'

import React, { useMemo } from 'react'
import styled from 'styled-components'
import { Card } from '@/components/Card'
import { currencyUtils } from '@/utils/validationSchemas'

interface ShareAnalyticsProps {
  analytics?: {
    totalShares?: number
    sharesByChannel?: Record<string, number>
    [key: string]: any
  }
  campaign?: {
    share_config?: {
      total_budget?: number
      amount_per_share?: number
      is_paid_sharing_active?: boolean
      share_channels?: string[]
    }
    [key: string]: any
  }
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
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 12px;
`

const ChannelCard = styled(Card)`
  padding: 16px;
  border: 1px solid #e5e7eb;
  text-align: center;
  transition: all 0.2s;

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
  font-size: 13px;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  margin: 0 0 8px 0;
  letter-spacing: 0.5px;
`

const ChannelCount = styled.p`
  font-size: 24px;
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

const RewardBadge = styled.span`
  display: inline-block;
  background: #dbeafe;
  color: #1e40af;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 600;
  margin-top: 4px;
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
 * ShareAnalyticsDashboard Component
 * Displays detailed share analytics including platform breakdown,
 * rewards earned, and performance metrics
 */
export const ShareAnalyticsDashboard: React.FC<ShareAnalyticsProps> = ({
  analytics,
  campaign,
}) => {
  const totalShares = analytics?.totalShares || 0
  const sharesByChannel = analytics?.sharesByChannel || {}
  const shareConfig = campaign?.share_config

  // Calculate share rewards
  const rewardPerShare = shareConfig?.amount_per_share ? shareConfig.amount_per_share / 100 : 0
  const totalRewardsEarned = totalShares * rewardPerShare
  const isPaidSharing = shareConfig?.is_paid_sharing_active || false

  // Calculate budget info
  const totalBudget = shareConfig?.total_budget ? shareConfig.total_budget / 100 : 0
  const budgetRemaining = shareConfig?.current_budget_remaining ? shareConfig.current_budget_remaining / 100 : totalBudget - totalRewardsEarned
  const budgetUsed = totalRewardsEarned // Use actual rewards earned as budget spent

  // Get enabled channels from config
  const enabledChannels = shareConfig?.share_channels || []

  // Format channels for display
  const channelsWithData = useMemo(() => {
    const allChannels = enabledChannels.length > 0 ? enabledChannels : Object.keys(sharesByChannel)
    
    return allChannels.map((channel) => ({
      name: channel,
      emoji: CHANNEL_EMOJIS[channel] || '🌐',
      count: sharesByChannel[channel] || 0,
      reward: (sharesByChannel[channel] || 0) * rewardPerShare,
    }))
  }, [enabledChannels, sharesByChannel, rewardPerShare])

  // Count active channels (channels with shares)
  const activeChannels = Object.keys(sharesByChannel).length

  return (
    <Container>
      {/* Share Metrics */}
      <div>
        <SectionTitle>🎯 Share Performance Summary</SectionTitle>
        <MetricsGrid>
          <MetricCard>
            <MetricLabel>📢 Total Shares</MetricLabel>
            <MetricValue>{totalShares}</MetricValue>
            <MetricSubtext>
              {activeChannels > 0 ? `From ${activeChannels} platform${activeChannels !== 1 ? 's' : ''}` : 'No shares yet'}
            </MetricSubtext>
          </MetricCard>

          {isPaidSharing && (
            <MetricCard>
              <MetricLabel>💰 Total Rewards Earned</MetricLabel>
              <MetricValue>{currencyUtils.formatCurrency(totalRewardsEarned * 100)}</MetricValue>
              <MetricSubtext>
                {rewardPerShare > 0 ? `$${rewardPerShare.toFixed(2)} per share` : 'N/A'}
              </MetricSubtext>
            </MetricCard>
          )}

          {isPaidSharing && totalBudget > 0 && (
            <MetricCard>
              <MetricLabel>💵 Budget Status</MetricLabel>
              <MetricValue>{totalBudget > 0 ? ((totalRewardsEarned / totalBudget) * 100).toFixed(2) : '0'}%</MetricValue>
              <MetricSubtext>
                {currencyUtils.formatCurrency(totalRewardsEarned * 100)} of{' '}
                {currencyUtils.formatCurrency(totalBudget * 100)}
              </MetricSubtext>
            </MetricCard>
          )}

          <MetricCard>
            <MetricLabel>📊 Average Shares/Day</MetricLabel>
            <MetricValue>{totalShares > 0 ? (totalShares / 7).toFixed(1) : '0'}</MetricValue>
            <MetricSubtext>Last 7 days (estimated)</MetricSubtext>
          </MetricCard>
        </MetricsGrid>
      </div>

      {/* Shares by Channel */}
      {totalShares > 0 ? (
        <div>
          <SectionTitle>📱 Shares by Platform</SectionTitle>
          <ChannelGrid>
            {channelsWithData.map((channel) => (
              <ChannelCard key={channel.name}>
                <ChannelEmoji>{channel.emoji}</ChannelEmoji>
                <ChannelName>{channel.name}</ChannelName>
                <ChannelCount>{channel.count}</ChannelCount>
                {isPaidSharing && channel.reward > 0 && (
                  <RewardBadge>
                    +{currencyUtils.formatCurrency(channel.reward * 100)}
                  </RewardBadge>
                )}
              </ChannelCard>
            ))}
          </ChannelGrid>
        </div>
      ) : (
        <div>
          <SectionTitle>📱 Shares by Platform</SectionTitle>
          <EmptyState>
            <EmptyStateText>
              No shares yet. Start sharing your campaign to see performance data!
            </EmptyStateText>
          </EmptyState>
        </div>
      )}

      {/* Paid Sharing Info */}
      {isPaidSharing && (
        <div>
          <SectionTitle>💡 Get Paid to Share</SectionTitle>
          <MetricsGrid>
            <MetricCard style={{ background: '#f0fdf4', borderColor: '#bbf7d0' }}>
              <MetricLabel>Reward per Share</MetricLabel>
              <MetricValue>${rewardPerShare.toFixed(2)}</MetricValue>
              <MetricSubtext>Split with each supporter who shares</MetricSubtext>
            </MetricCard>

            <MetricCard style={{ background: '#fef3c7', borderColor: '#fcd34d' }}>
              <MetricLabel>Remaining Budget</MetricLabel>
              <MetricValue>{currencyUtils.formatCurrency(budgetRemaining * 100)}</MetricValue>
              <MetricSubtext>
                Can reward ~{Math.floor(budgetRemaining / rewardPerShare)} more share
                {Math.floor(budgetRemaining / rewardPerShare) !== 1 ? 's' : ''}
              </MetricSubtext>
            </MetricCard>
          </MetricsGrid>
        </div>
      )}

      {/* Help Text */}
      {totalShares === 0 && (
        <div>
          <SectionTitle>📖 How Share Analytics Work</SectionTitle>
          <Card style={{ padding: '16px', background: '#eff6ff', borderColor: '#bfdbfe', border: '1px solid' }}>
            <p style={{ margin: 0, color: '#1e40af', fontSize: '14px', lineHeight: '1.6' }}>
              Share analytics track how many times your campaign is shared on different social platforms. 
              {isPaidSharing && ' Supporters earn rewards for sharing your campaign.'} 
              The data updates every 5 minutes.
            </p>
          </Card>
        </div>
      )}
    </Container>
  )
}
