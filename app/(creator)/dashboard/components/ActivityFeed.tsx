'use client'

import React, { useEffect, useState } from 'react'
import styled, { keyframes } from 'styled-components'
import {
  Heart,
  Zap,
  Target,
  TrendingUp,
  MessageSquare,
  Share2,
  CheckCircle,
  Clock,
} from 'lucide-react'

interface Activity {
  id: string
  type:
    | 'donation'
    | 'campaign_created'
    | 'campaign_activated'
    | 'goal_reached'
    | 'milestone'
    | 'comment'
    | 'share'
  title: string
  description: string
  timestamp: string
  campaignId?: string
  campaignTitle?: string
  amount?: number
  icon?: React.ReactNode
}

interface ActivityFeedProps {
  activities: Activity[]
  onActivityClick?: (activity: Activity) => void
  limit?: number
  isLoading?: boolean
}

/* ── Animations ── */
const shimmer = keyframes`
  0%   { background-position: -400px 0; }
  100% { background-position:  400px 0; }
`

const fadeSlideIn = keyframes`
  from { opacity: 0; transform: translateY(6px); }
  to   { opacity: 1; transform: translateY(0); }
`

/* ── Layout ── */
const FeedContainer = styled.div`
  background: #ffffff;
  border: 1px solid #f0f0ef;
  border-radius: 20px;
  padding: 24px 20px;
  /* Prevent the card itself from ever exceeding its parent */
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
  overflow: hidden;

  @media (max-width: 480px) {
    border-radius: 16px;
    padding: 16px 14px;
  }
`

const FeedHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 20px;
`

const FeedTitle = styled.h3`
  font-family: 'DM Sans', system-ui, sans-serif;
  font-size: 15px;
  font-weight: 600;
  color: #0f0f0e;
  margin: 0;
  letter-spacing: -0.2px;
  /* Don't let the title push the badge off-screen */
  min-width: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const FeedCount = styled.span`
  font-size: 12px;
  font-weight: 500;
  color: #888884;
  background: #f4f4f2;
  padding: 3px 9px;
  border-radius: 20px;
  flex-shrink: 0;
`

/* ── Timeline ── */
const Timeline = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
`

const TimelineTrack = styled.div`
  position: absolute;
  left: 17px;
  top: 36px;
  bottom: 20px;
  width: 1px;
  background: linear-gradient(to bottom, #e8e8e5 0%, transparent 100%);
  pointer-events: none;

  @media (max-width: 480px) {
    left: 15px;
  }
`

/* ── Activity Item ── */
const ActivityItem = styled.div<{ isNew?: boolean }>`
  position: relative;
  display: flex;
  align-items: flex-start;
  /* Gap between icon and content — shrinks on mobile */
  gap: 12px;
  padding: 10px 8px;
  border-radius: 12px;
  cursor: pointer;
  transition: background 0.18s ease;
  animation: ${fadeSlideIn} 0.3s ease both;
  /* Critical: prevent children from expanding this beyond its container */
  min-width: 0;
  max-width: 100%;
  box-sizing: border-box;

  &:hover {
    background: #f8f8f6;
  }

  ${({ isNew }) =>
    isNew &&
    `
    background: #f0f7ff;
    &:hover { background: #e8f2ff; }
  `}

  @media (max-width: 480px) {
    gap: 10px;
    padding: 8px 4px;
  }
`

/* ── Icon colours ── */
const iconMeta: Record<string, { bg: string; color: string }> = {
  donation:           { bg: '#fff0f0', color: '#e0443c' },
  campaign_created:   { bg: '#fffbeb', color: '#d98a0b' },
  campaign_activated: { bg: '#edfaf4', color: '#1a9e61' },
  goal_reached:       { bg: '#f3f0ff', color: '#7c4dff' },
  milestone:          { bg: '#e8fafb', color: '#0896a8' },
  comment:            { bg: '#eff5ff', color: '#3470e4' },
  share:              { bg: '#fff0f8', color: '#d83d8e' },
}

const IconDot = styled.div<{ type: string }>`
  flex-shrink: 0;
  width: 34px;
  height: 34px;
  border-radius: 10px;
  background: ${({ type }) => iconMeta[type]?.bg ?? '#f4f4f2'};
  color: ${({ type }) => iconMeta[type]?.color ?? '#888884'};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 1px;
  position: relative;
  z-index: 1;

  @media (max-width: 480px) {
    width: 30px;
    height: 30px;
    border-radius: 8px;
  }
`

/* ── Content — must never overflow its flex cell ── */
const ActivityBody = styled.div`
  flex: 1;
  /* This is the key rule: a flex child won't shrink below min-content
     unless you set min-width: 0 explicitly */
  min-width: 0;
  max-width: 100%;
  display: flex;
  flex-direction: column;
  gap: 3px;
  overflow: hidden;
`

const ActivityTitle = styled.p`
  font-family: 'DM Sans', system-ui, sans-serif;
  font-size: 13.5px;
  font-weight: 600;
  color: #0f0f0e;
  margin: 0;
  line-height: 1.35;
  letter-spacing: -0.1px;
  /* Wrap instead of overflow */
  white-space: normal;
  word-break: break-word;

  @media (max-width: 480px) {
    font-size: 13px;
  }
`

const ActivityDescription = styled.p`
  font-size: 12.5px;
  color: #6b6b66;
  margin: 0;
  line-height: 1.45;
  /* Wrap on mobile instead of forcing single line */
  white-space: normal;
  word-break: break-word;
  overflow: hidden;

  @media (max-width: 480px) {
    font-size: 12px;
  }
`

const ActivityMeta = styled.div`
  display: flex;
  align-items: center;
  /* Wrap tags to next line rather than overflow */
  flex-wrap: wrap;
  gap: 5px;
  margin-top: 5px;
`

const Timestamp = styled.span`
  font-size: 11.5px;
  color: #a8a8a3;
  display: flex;
  align-items: center;
  gap: 3px;
  flex-shrink: 0;
`

const CampaignTag = styled.span`
  font-size: 11px;
  font-weight: 500;
  background: #eff5ff;
  color: #3470e4;
  padding: 2px 8px;
  border-radius: 6px;
  /* Truncate with ellipsis rather than blowing out the row */
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  /* Allow it to shrink but cap it */
  min-width: 0;
  max-width: min(160px, 45vw);
`

const AmountBadge = styled.span`
  font-size: 12px;
  font-weight: 700;
  color: #1a9e61;
  background: #edfaf4;
  padding: 2px 8px;
  border-radius: 6px;
  letter-spacing: -0.2px;
  flex-shrink: 0;
`

const NewDot = styled.span`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #3470e4;
  flex-shrink: 0;
  margin-top: 7px;
`

/* ── Empty state ── */
const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 36px 20px;
  gap: 10px;
`

const EmptyIconWrap = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 14px;
  background: #f4f4f2;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #c0c0bb;
`

const EmptyText = styled.p`
  font-size: 13px;
  color: #a8a8a3;
  margin: 0;
  text-align: center;
  line-height: 1.5;
`

/* ── Skeleton ── */
const SkeletonBar = styled.div<{ w?: string }>`
  height: 10px;
  width: ${({ w }) => w ?? '100%'};
  max-width: 100%;
  border-radius: 6px;
  background: linear-gradient(90deg, #f0f0ee 25%, #e4e4e1 50%, #f0f0ee 75%);
  background-size: 400px 100%;
  animation: ${shimmer} 1.4s ease-in-out infinite;
`

const SkeletonItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 10px 8px;
`

const SkeletonDot = styled.div`
  width: 34px;
  height: 34px;
  border-radius: 10px;
  flex-shrink: 0;
  background: linear-gradient(90deg, #f0f0ee 25%, #e4e4e1 50%, #f0f0ee 75%);
  background-size: 400px 100%;
  animation: ${shimmer} 1.4s ease-in-out infinite;
`

/* ── Helpers ── */
const getIcon = (type: string) => {
  switch (type) {
    case 'donation':           return <Heart size={15} />
    case 'campaign_created':   return <Zap size={15} />
    case 'campaign_activated': return <TrendingUp size={15} />
    case 'goal_reached':       return <Target size={15} />
    case 'milestone':          return <CheckCircle size={15} />
    case 'comment':            return <MessageSquare size={15} />
    case 'share':              return <Share2 size={15} />
    default:                   return <Clock size={15} />
  }
}

const formatTime = (timestamp: string): string => {
  const date = new Date(timestamp)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)
  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

/* ── Component ── */
export const ActivityFeed: React.FC<ActivityFeedProps> = ({
  activities,
  onActivityClick,
  limit = 10,
  isLoading = false,
}) => {
  const [displayActivities, setDisplayActivities] = useState<Activity[]>([])

  useEffect(() => {
    setDisplayActivities(activities.slice(0, limit))
  }, [activities, limit])

  if (isLoading) {
    return (
      <FeedContainer>
        <FeedHeader>
          <FeedTitle>Recent Activity</FeedTitle>
        </FeedHeader>
        <Timeline>
          {[1, 2, 3].map((i) => (
            <SkeletonItem key={i}>
              <SkeletonDot />
              <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 8, paddingTop: 4 }}>
                <SkeletonBar w="55%" />
                <SkeletonBar w="80%" />
                <SkeletonBar w="30%" />
              </div>
            </SkeletonItem>
          ))}
        </Timeline>
      </FeedContainer>
    )
  }

  if (displayActivities.length === 0) {
    return (
      <FeedContainer>
        <FeedHeader>
          <FeedTitle>Recent Activity</FeedTitle>
        </FeedHeader>
        <EmptyState>
          <EmptyIconWrap>
            <MessageSquare size={22} />
          </EmptyIconWrap>
          <EmptyText>No activity yet. Start a campaign to see updates here.</EmptyText>
        </EmptyState>
      </FeedContainer>
    )
  }

  return (
    <FeedContainer>
      <FeedHeader>
        <FeedTitle>Recent Activity</FeedTitle>
        <FeedCount>{displayActivities.length} events</FeedCount>
      </FeedHeader>
      <Timeline>
        <TimelineTrack />
        {displayActivities.map((activity, index) => {
          const isNew = index === 0
          return (
            <ActivityItem
              key={activity.id}
              isNew={isNew}
              onClick={() => onActivityClick?.(activity)}
              style={{ animationDelay: `${index * 40}ms` }}
            >
              <IconDot type={activity.type}>{getIcon(activity.type)}</IconDot>
              <ActivityBody>
                <ActivityTitle>{activity.title}</ActivityTitle>
                <ActivityDescription>{activity.description}</ActivityDescription>
                <ActivityMeta>
                  <Timestamp>
                    <Clock size={10} />
                    {formatTime(activity.timestamp)}
                  </Timestamp>
                  {activity.amount != null && (
                    <AmountBadge>+${activity.amount.toFixed(2)}</AmountBadge>
                  )}
                  {activity.campaignTitle && (
                    <CampaignTag title={activity.campaignTitle}>
                      {activity.campaignTitle}
                    </CampaignTag>
                  )}
                </ActivityMeta>
              </ActivityBody>
              {isNew && <NewDot />}
            </ActivityItem>
          )
        })}
      </Timeline>
    </FeedContainer>
  )
}

export default ActivityFeed