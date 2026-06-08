'use client'

import React from 'react'
import styled from 'styled-components'
import { Check } from 'lucide-react'
import { ContextMenu, getCampaignContextMenuActions } from './ContextMenu'
import { QuickActions } from './QuickActions'

interface CampaignCardSelectableProps {
  campaign: {
    _id: string
    title: string
    raised: number
    goal: number
    donor_count?: number
    status: 'draft' | 'active' | 'paused' | 'completed' | 'rejected'
    created_at: string
    updated_at: string
    image_url?: string
    campaign_type?: string
  }
  isSelected?: boolean
  onSelectChange?: (selected: boolean) => void
  onPause?: () => void
  onResume?: () => void
  onDelete?: () => void
  onView?: () => void
  onEdit?: () => void
  onAnalytics?: () => void
  onComplete?: () => void
  showCheckbox?: boolean
  variant?: 'grid' | 'list'
}

const CardWrapper = styled.div<{ isSelected?: boolean; variant?: string }>`
  background: white;
  border: ${(props) =>
    props.isSelected ? '2px solid #3b82f6' : '1px solid #e5e7eb'};
  border-radius: 12px;
  padding: ${(props) => (props.variant === 'list' ? '16px' : '16px')};
  transition: all 0.2s ease;
  position: relative;
  cursor: pointer;

  &:hover {
    border-color: #3b82f6;
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15);
  }

  ${(props) =>
    props.isSelected &&
    `
    background: #eff6ff;
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.2);
  `}
`

const CheckboxContainer = styled.div`
  position: absolute;
  top: 12px;
  left: 12px;
  z-index: 2;
`

const Checkbox = styled.input`
  width: 20px;
  height: 20px;
  cursor: pointer;
  accent-color: #3b82f6;
`

const CheckmarkOverlay = styled.div`
  position: absolute;
  top: 12px;
  left: 12px;
  width: 20px;
  height: 20px;
  background: #3b82f6;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 12px;
  z-index: 3;
  pointer-events: none;
`

const CardContent = styled.div<{ hasCheckbox?: boolean }>`
  ${(props) => props.hasCheckbox && 'padding-left: 32px;'}
`

const CardTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: #111827;
  margin: 0 0 12px 0;
  word-break: break-word;
`

const CardMeta = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 12px;
  flex-wrap: wrap;
  font-size: 12px;
  color: #6b7280;

  @media (max-width: 640px) {
    gap: 12px;
  }
`

const StatusBadge = styled.span<{ status: string }>`
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  background: ${(props) => {
    switch (props.status) {
      case 'active':
        return '#dcfce7'
      case 'completed':
        return '#dbeafe'
      case 'paused':
        return '#fef3c7'
      case 'draft':
        return '#f3f4f6'
      default:
        return '#e5e7eb'
    }
  }};
  color: ${(props) => {
    switch (props.status) {
      case 'active':
        return '#166534'
      case 'completed':
        return '#1e40af'
      case 'paused':
        return '#92400e'
      case 'draft':
        return '#4b5563'
      default:
        return '#6b7280'
    }
  }};
`

const ProgressSection = styled.div`
  margin-bottom: 12px;
`

const ProgressLabel = styled.div`
  font-size: 13px;
  font-weight: 600;
  color: #111827;
  margin-bottom: 6px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background: #e5e7eb;
  border-radius: 4px;
  overflow: hidden;
`

const ProgressFill = styled.div<{ percentage: number }>`
  height: 100%;
  width: ${(props) => Math.min(props.percentage, 100)}%;
  background: ${(props) => {
    if (props.percentage >= 100) return '#10b981'
    if (props.percentage >= 75) return '#3b82f6'
    if (props.percentage >= 50) return '#f59e0b'
    return '#ef4444'
  }};
  transition: width 0.3s ease;
`

const ActionsRow = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid #e5e7eb;
`

/**
 * Enhanced Campaign Card with selection and context menu support
 * Used in dashboard for batch operations and quick actions
 */
export const CampaignCardSelectable: React.FC<CampaignCardSelectableProps> = ({
  campaign,
  isSelected = false,
  onSelectChange,
  onPause,
  onResume,
  onDelete,
  onView,
  onEdit,
  onAnalytics,
  onComplete,
  showCheckbox = false,
  variant = 'grid',
}) => {
  // Convert from cents to dollars if needed (assume amounts are in cents from backend)
  const raised = (campaign.raised ?? 0) / 100
  const goal = (campaign.goal ?? 0) / 100
  const progress = goal > 0 ? (raised / goal) * 100 : 0
  const daysActive = Math.floor(
    (Date.now() - new Date(campaign.created_at).getTime()) / (1000 * 60 * 60 * 24)
  )

  // Build context menu actions
  const contextActions = getCampaignContextMenuActions(campaign.status, {
    onView,
    onEdit,
    onAnalytics,
    onPause,
    onResume,
    onComplete,
    onDelete,
  })

  const handleCardClick = (e: React.MouseEvent) => {
    // Don't trigger selection if clicking on actions
    if ((e.target as HTMLElement).closest('[data-action-item]')) {
      return
    }

    if (showCheckbox) {
      e.stopPropagation()
      onSelectChange?.(!isSelected)
    }
  }

  return (
    <ContextMenu actions={contextActions}>
      <CardWrapper
        isSelected={isSelected}
        variant={variant}
        onClick={handleCardClick}
      >
        {showCheckbox && (
          <CheckboxContainer>
            <Checkbox
              type="checkbox"
              checked={isSelected}
              onChange={(e) => onSelectChange?.(e.target.checked)}
              onClick={(e) => e.stopPropagation()}
              style={{ display: 'none' }}
            />
            {isSelected && <CheckmarkOverlay>✓</CheckmarkOverlay>}
          </CheckboxContainer>
        )}

        <CardContent hasCheckbox={showCheckbox && isSelected}>
          <CardTitle>{campaign.title}</CardTitle>

          <CardMeta>
            <StatusBadge status={campaign.status}>
              {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
            </StatusBadge>
            <span>{daysActive} days active</span>
            {campaign.donor_count && <span>{campaign.donor_count} donors</span>}
          </CardMeta>

          <ProgressSection>
            <ProgressLabel>
              <span>
                ${raised.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} / ${goal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
              <span>{progress.toFixed(0)}%</span>
            </ProgressLabel>
            <ProgressBar>
              <ProgressFill percentage={progress} />
            </ProgressBar>
          </ProgressSection>

          <ActionsRow data-action-item onClick={(e) => e.stopPropagation()}>
            <QuickActions
              campaignId={campaign._id}
              status={campaign.status}
              onPause={onPause}
              onResume={onResume}
              onDelete={onDelete}
              onView={onView}
              onEdit={onEdit}
              onAnalytics={onAnalytics}
              compact={true}
            />
          </ActionsRow>
        </CardContent>
      </CardWrapper>
    </ContextMenu>
  )
}

export default CampaignCardSelectable
