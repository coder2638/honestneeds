'use client'

import React from 'react'
import styled from 'styled-components'
import { Heart, Share2, Clock } from 'lucide-react'
import { currencyUtils } from '@/utils/validationSchemas'

/**
 * Activity Feed
 * Display recent donations and shares for a campaign
 */

const Container = styled.div`
  background: white;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  overflow: hidden;
`

const Header = styled.div`
  background: #f9fafb;
  padding: 20px;
  border-bottom: 1px solid #e5e7eb;
`

const Title = styled.h3`
  font-size: 18px;
  font-weight: 600;
  margin: 0;
  color: #111827;
`

const Timeline = styled.div`
  padding: 20px;
  max-height: 400px;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: #f3f4f6;
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: #d1d5db;
    border-radius: 3px;

    &:hover {
      background: #9ca3af;
    }
  }
`

const Activity = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e5e7eb;

  &:last-child {
    border-bottom: none;
    margin-bottom: 0;
    padding-bottom: 0;
  }
`

const IconWrapper = styled.div<{ $bgColor?: string }>`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: ${(props) => props.$bgColor || '#ec4899'};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
  font-size: 18px;
`

const Content = styled.div`
  flex: 1;
  min-width: 0;
`

const ActivityText = styled.p`
  font-size: 14px;
  font-weight: 500;
  color: #111827;
  margin: 0 0 4px 0;
`

const ActivityAmount = styled.span`
  color: #10b981;
  font-weight: 600;
`

const ActivityTime = styled.p`
  font-size: 12px;
  color: #9ca3af;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 4px;
`

const EmptyState = styled.div`
  text-align: center;
  padding: 40px 20px;
  color: #6b7280;
  font-size: 14px;
`

interface Activity {
  id: string
  type: 'donation' | 'share'
  amount?: number // in cents, for donations
  channel?: string // for shares
  timestamp: string
  isRecent: boolean
}

interface ActivityFeedProps {
  activities?: Activity[]
  isLoading?: boolean
}

const getTimeAgo = (date: string): string => {
  const now = new Date()
  const activityDate = new Date(date)
  const diffMs = now.getTime() - activityDate.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  return activityDate.toLocaleDateString()
}

export function ActivityFeed({ activities = [], isLoading = false }: ActivityFeedProps) {
  if (isLoading) {
    return (
      <Container>
        <Header>
          <Title>📊 Recent Activity</Title>
        </Header>
        <EmptyState>Loading activity...</EmptyState>
      </Container>
    )
  }

  if (activities.length === 0) {
    return (
      <Container>
        <Header>
          <Title>📊 Recent Activity</Title>
        </Header>
        <EmptyState>
          <p>No activity yet. Share your campaign to get started!</p>
        </EmptyState>
      </Container>
    )
  }

  return (
    <Container>
      <Header>
        <Title>📊 Recent Activity</Title>
      </Header>
      <Timeline>
        {activities.map((activity) => (
          <Activity key={activity.id}>
            {activity.type === 'donation' ? (
              <>
                <IconWrapper $bgColor="#ec4899">❤️</IconWrapper>
                <Content>
                  <ActivityText>
                    Someone donated <ActivityAmount>{currencyUtils.formatCurrency(activity.amount || 0)}</ActivityAmount>
                  </ActivityText>
                  <ActivityTime>
                    <Clock size={12} />
                    {getTimeAgo(activity.timestamp)}
                  </ActivityTime>
                </Content>
              </>
            ) : (
              <>
                <IconWrapper $bgColor="#3b82f6">📢</IconWrapper>
                <Content>
                  <ActivityText>
                    {activity.channel
                      ? `Shared on ${activity.channel}`
                      : 'Campaign was shared'}
                  </ActivityText>
                  <ActivityTime>
                    <Clock size={12} />
                    {getTimeAgo(activity.timestamp)}
                  </ActivityTime>
                </Content>
              </>
            )}
          </Activity>
        ))}
      </Timeline>
    </Container>
  )
}
