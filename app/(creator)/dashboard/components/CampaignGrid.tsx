'use client'

import React from 'react'
import styled from 'styled-components'
import { CampaignCard } from './CampaignCard'
import { Campaign } from '../hooks/useDashboardData'

/**
 * Campaign Grid Component
 * Displays campaigns in a responsive grid layout
 */

interface CampaignGridProps {
  campaigns: Campaign[]
  onPause?: (id: string) => void
  onResume?: (id: string) => void
  onDelete?: (id: string) => void
  onView?: (id: string) => void
  isLoading?: boolean
  emptyMessage?: string
}

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
  margin-bottom: 32px;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 16px;
  }
`

const SkeletonCard = styled.div`
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  overflow: hidden;
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;

  @keyframes pulse {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }
`

const SkeletonImage = styled.div`
  width: 100%;
  height: 160px;
  background: #e5e7eb;
`

const SkeletonContent = styled.div`
  padding: 16px;
`

const SkeletonLine = styled.div`
  height: 12px;
  background: #e5e7eb;
  border-radius: 6px;
  margin-bottom: 12px;

  &:last-child {
    margin-bottom: 0;
  }

  &.title {
    height: 18px;
    margin-bottom: 16px;
  }

  &.short {
    width: 60%;
  }
`

const EmptyState = styled.div`
  grid-column: 1 / -1;
  text-align: center;
  padding: 64px 24px;
  color: #6b7280;
`

const EmptyStateIcon = styled.div`
  font-size: 64px;
  margin-bottom: 16px;
  opacity: 0.5;
`

const EmptyStateTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: #374151;
  margin: 0 0 8px 0;
`

const EmptyStateMessage = styled.p`
  font-size: 14px;
  color: #6b7280;
  margin: 0;
`

/**
 * Skeleton loader for campaign cards
 */
function SkeletonLoader() {
  return (
    <SkeletonCard>
      <SkeletonImage />
      <SkeletonContent>
        <SkeletonLine className="title" />
        <SkeletonLine />
        <SkeletonLine className="short" />
        <SkeletonLine style={{ marginTop: '16px' }} />
        <SkeletonLine className="short" />
      </SkeletonContent>
    </SkeletonCard>
  )
}

/**
 * Campaign Grid Component
 */
export function CampaignGrid({
  campaigns,
  onPause,
  onResume,
  onDelete,
  onView,
  isLoading = false,
  emptyMessage = 'No campaigns found. Start by creating your first campaign!',
}: CampaignGridProps) {
  if (isLoading) {
    return (
      <GridContainer>
        {[...Array(6)].map((_, i) => (
          <SkeletonLoader key={i} />
        ))}
      </GridContainer>
    )
  }

  if (campaigns.length === 0) {
    return (
      <GridContainer>
        <EmptyState>
          <EmptyStateIcon>🎯</EmptyStateIcon>
          <EmptyStateTitle>No Campaigns Yet</EmptyStateTitle>
          <EmptyStateMessage>{emptyMessage}</EmptyStateMessage>
        </EmptyState>
      </GridContainer>
    )
  }

  return (
    <GridContainer>
      {campaigns.map((campaign) => (
        <CampaignCard
          key={campaign._id}
          campaign={campaign}
          onPause={onPause}
          onResume={onResume}
          onDelete={onDelete}
          onView={onView}
          variant="grid"
        />
      ))}
    </GridContainer>
  )
}
