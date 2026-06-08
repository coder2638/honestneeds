'use client'

import React from 'react'
import styled from 'styled-components'
import { Eye, Edit2, Pause, Play, Trash2, MoreVertical, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import { Campaign } from '../hooks/useDashboardData'

/**
 * Campaign Card Component
 * Displays campaign information in grid or compact card format
 */

interface CampaignCardProps {
  campaign: Campaign
  onPause?: (id: string) => void
  onResume?: (id: string) => void
  onDelete?: (id: string) => void
  onView?: (id: string) => void
  variant?: 'grid' | 'compact'
}

const CardContainer = styled.div<{ $variant?: string }>`
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;

  ${(props) =>
    props.$variant === 'compact'
      ? `
    padding: 16px;
    display: flex;
    gap: 16px;
    align-items: center;
  `
      : `
    display: flex;
    flex-direction: column;
    height: 100%;
  `}

  &:hover {
    border-color: #3b82f6;
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.1);
  }

  @media (max-width: 768px) {
    flex-direction: column;
    padding: 12px;
  }
`

const ImageContainer = styled.div<{ $variant?: string }>`
  width: 100%;
  height: ${(props) => (props.$variant === 'compact' ? '60px' : '160px')};
  background: linear-gradient(135deg, #e5e7eb 0%, #f3f4f6 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${(props) => (props.$variant === 'compact' ? '24px' : '48px')};
  color: #d1d5db;
  overflow: hidden;
  flex-shrink: 0;

  ${(props) =>
    props.$variant === 'compact'
      ? `
    width: 60px;
    height: 60px;
    border-radius: 8px;
  `
      : `
    border-radius: 12px 12px 0 0;
  `}

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  @media (max-width: 768px) {
    height: 120px;
    font-size: 32px;
  }
`

const ContentContainer = styled.div`
  padding: 16px;
  display: flex;
  flex-direction: column;
  flex: 1;

  @media (max-width: 768px) {
    padding: 12px;
  }
`

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
  gap: 8px;
`

const Title = styled.h3`
  font-size: 16px;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
  flex: 1;
  word-break: break-word;
`

const StatusBadge = styled.span<{ $status: string }>`
  padding: 4px 12px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  white-space: nowrap;
  flex-shrink: 0;

  ${(props) => {
    switch (props.$status) {
      case 'active':
        return `background: #dcfce7; color: #166534;`
      case 'paused':
        return `background: #fef3c7; color: #92400e;`
      case 'draft':
        return `background: #f3f4f6; color: #4b5563;`
      case 'completed':
        return `background: #dbeafe; color: #0c4a6e;`
      default:
        return `background: #fee2e2; color: #7f1d1d;`
    }
  }};
`

const Description = styled.p`
  font-size: 13px;
  color: #6b7280;
  margin: 0 0 12px 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`

const ProgressContainer = styled.div`
  margin-bottom: 12px;
`

const ProgressLabel = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 12px;
  color: #6b7280;

  strong {
    color: #0f172a;
    font-weight: 600;
  }
`

const ProgressBar = styled.div`
  width: 100%;
  height: 6px;
  background: #e5e7eb;
  border-radius: 3px;
  overflow: hidden;
`

const ProgressFill = styled.div<{ $percentage: number }>`
  width: ${(props) => `${Math.min(props.$percentage, 100)}%`};
  height: 100%;
  background: ${(props) => {
    if (props.$percentage >= 100) return '#10b981'
    if (props.$percentage >= 75) return '#3b82f6'
    if (props.$percentage >= 50) return '#f59e0b'
    return '#ef4444'
  }};
  transition: width 0.3s ease;
`

const MetaInfo = styled.div`
  display: flex;
  gap: 16px;
  font-size: 12px;
  color: #6b7280;
  margin-bottom: 12px;

  span {
    display: flex;
    align-items: center;
    gap: 4px;
  }

  @media (max-width: 768px) {
    flex-wrap: wrap;
    gap: 8px;
  }
`

const ActionsContainer = styled.div`
  display: flex;
  gap: 8px;
  margin-top: auto;
`

const ActionButton = styled.button<{ $variant?: 'primary' | 'secondary' | 'danger' }>`
  flex: 1;
  padding: 8px 12px;
  border: none;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  transition: all 0.2s ease;

  ${(props) => {
    switch (props.$variant) {
      case 'danger':
        return `
        background: #fee2e2;
        color: #dc2626;
        
        &:hover {
          background: #fecaca;
        }
      `
      case 'secondary':
        return `
        background: #f3f4f6;
        color: #374151;
        
        &:hover {
          background: #e5e7eb;
        }
      `
      default:
        return `
        background: #dbeafe;
        color: #0c4a6e;
        
        &:hover {
          background: #bfdbfe;
        }
      `
    }
  }};

  @media (max-width: 768px) {
    font-size: 11px;
    padding: 6px 10px;
  }
`

const MenuItem = styled.button`
  background: none;
  border: none;
  padding: 8px;
  cursor: pointer;
  color: #6b7280;
  display: flex;
  align-items: center;
  transition: color 0.2s ease;

  &:hover {
    color: #3b82f6;
  }
`

/**
 * Utility function to get emoji for campaign type
 */
function getCampaignEmoji(title: string): string {
  const lowerTitle = title.toLowerCase()
  if (lowerTitle.includes('food')) return '🍕'
  if (lowerTitle.includes('medical') || lowerTitle.includes('health')) return '🏥'
  if (lowerTitle.includes('education') || lowerTitle.includes('school')) return '🎓'
  if (lowerTitle.includes('community')) return '👥'
  if (lowerTitle.includes('disaster') || lowerTitle.includes('emergency')) return '🆘'
  if (lowerTitle.includes('environment') || lowerTitle.includes('earth')) return '🌍'
  return '🎯'
}

/**
 * Campaign Card Component
 */
export const CampaignCard = React.forwardRef<HTMLDivElement, CampaignCardProps>(
  (
    {
      campaign,
      onPause,
      onResume,
      onDelete,
      onView,
      variant = 'grid',
    },
    ref
  ) => {
    const progressPercentage = campaign.goal > 0 ? (campaign.raised / campaign.goal) * 100 : 0
    const isActive = campaign.status === 'active'
    const emoji = getCampaignEmoji(campaign.title)

    return (
      <CardContainer ref={ref} $variant={variant}>
        <ImageContainer $variant={variant}>
          {campaign.image_url ? (
            <img src={campaign.image_url} alt={campaign.title} />
          ) : (
            emoji
          )}
        </ImageContainer>

        <ContentContainer>
          <Header>
            <Title>{campaign.title}</Title>
            <StatusBadge $status={campaign.status}>{campaign.status}</StatusBadge>
          </Header>

          {campaign.description && variant !== 'compact' && (
            <Description>{campaign.description}</Description>
          )}

          <ProgressContainer>
            <ProgressLabel>
              <span>
                <strong>
                  ${((campaign.raised ?? 0) / 100).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </strong>
                {' '}/ ${((campaign.goal ?? 0) / 100).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
              <span>{Math.round(progressPercentage)}%</span>
            </ProgressLabel>
            <ProgressBar>
              <ProgressFill $percentage={progressPercentage} />
            </ProgressBar>
          </ProgressContainer>

          <MetaInfo>
            <span>{campaign.donor_count || 0} donors</span>
            <span>•</span>
            <span>
              {new Date(campaign.updated_at).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
              })}
            </span>
          </MetaInfo>

          <ActionsContainer>
            {onView && (
              <ActionButton $variant="primary" onClick={() => onView(campaign._id)}>
                <Eye size={14} />
                View
              </ActionButton>
            )}

            {isActive && onPause && (
              <ActionButton $variant="secondary" onClick={() => onPause(campaign._id)}>
                <Pause size={14} />
                Pause
              </ActionButton>
            )}

            {!isActive && campaign.status === 'paused' && onResume && (
              <ActionButton $variant="secondary" onClick={() => onResume(campaign._id)}>
                <Play size={14} />
                Resume
              </ActionButton>
            )}

            {campaign.status === 'draft' && onDelete && (
              <ActionButton $variant="danger" onClick={() => onDelete(campaign._id)}>
                <Trash2 size={14} />
                Delete
              </ActionButton>
            )}
          </ActionsContainer>
        </ContentContainer>
      </CardContainer>
    )
  }
)

CampaignCard.displayName = 'CampaignCard'
