'use client'

import React, { useState } from 'react'
import styled from 'styled-components'
import { Pause, Play, Trash2, MoreVertical, Edit2, TrendingUp, Eye } from 'lucide-react'

interface QuickActionsProps {
  campaignId: string
  status: 'draft' | 'active' | 'paused' | 'completed' | 'rejected'
  onPause?: () => void
  onResume?: () => void
  onDelete?: () => void
  onView?: () => void
  onEdit?: () => void
  onAnalytics?: () => void
  compact?: boolean
}

const ActionsContainer = styled.div<{ compact: boolean }>`
  display: flex;
  gap: ${(props) => (props.compact ? '6px' : '8px')};
  align-items: center;
  flex-wrap: wrap;

  @media (max-width: 640px) {
    gap: 4px;
  }
`

const ActionButton = styled.button<{ 
  variant?: 'primary' | 'danger' | 'secondary' | 'ghost'
  size?: 'sm' | 'md'
  compact?: boolean
}>`
  padding: ${(props) => {
    if (props.compact) return '4px 8px'
    return props.size === 'sm' ? '6px 12px' : '8px 16px'
  }};
  border-radius: 6px;
  border: ${(props) => {
    switch (props.variant) {
      case 'primary':
        return 'none'
      case 'danger':
        return 'none'
      case 'ghost':
        return '1px solid #d1d5db'
      default:
        return '1px solid #d1d5db'
    }
  }};
  background: ${(props) => {
    switch (props.variant) {
      case 'primary':
        return '#3b82f6'
      case 'danger':
        return '#ef4444'
      case 'ghost':
        return 'transparent'
      default:
        return 'white'
    }
  }};
  color: ${(props) => {
    switch (props.variant) {
      case 'primary':
        return 'white'
      case 'danger':
        return 'white'
      default:
        return '#374151'
    }
  }};
  font-size: ${(props) => (props.compact ? '12px' : '13px')};
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: ${(props) => (props.compact ? '4px' : '6px')};
  white-space: nowrap;
  min-width: fit-content;

  &:hover:not(:disabled) {
    background: ${(props) => {
      switch (props.variant) {
        case 'primary':
          return '#2563eb'
        case 'danger':
          return '#dc2626'
        case 'ghost':
          return '#f3f4f6'
        default:
          return '#f3f4f6'
      }
    }};
    border-color: #9ca3af;
  }

  &:active:not(:disabled) {
    transform: scale(0.95);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  svg {
    width: ${(props) => (props.compact ? '14px' : '16px')};
    height: ${(props) => (props.compact ? '14px' : '16px')};
  }

  @media (max-width: 768px) {
    padding: 6px 10px;
    font-size: 12px;
  }
`

const MoreButton = styled(ActionButton)`
  padding: ${(props) => (props.compact ? '4px 6px' : '8px 12px')};
`

const DropdownMenu = styled.div<{ isOpen: boolean }>`
  position: absolute;
  top: 100%;
  right: 0;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  z-index: 10;
  min-width: 180px;
  display: ${(props) => (props.isOpen ? 'block' : 'none')};
  margin-top: 8px;
  animation: slideDown 0.2s ease-out;

  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-8px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`

const MenuItem = styled.button`
  width: 100%;
  padding: 10px 16px;
  border: none;
  background: transparent;
  color: #374151;
  font-size: 13px;
  font-weight: 500;
  text-align: left;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 10px;
  border-bottom: 1px solid #f3f4f6;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: #f9fafb;
    color: #111827;
  }

  &:active {
    background: #f3f4f6;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  svg {
    width: 14px;
    height: 14px;
    flex-shrink: 0;
  }

  &.danger {
    color: #ef4444;

    &:hover {
      background: #fee2e2;
    }
  }
`

export const QuickActions: React.FC<QuickActionsProps> = ({
  campaignId,
  status,
  onPause,
  onResume,
  onDelete,
  onView,
  onEdit,
  onAnalytics,
  compact = false,
}) => {
  const [showMenu, setShowMenu] = useState(false)

  // Determine which actions to show
  const canEdit = status === 'draft'
  const canPause = status === 'active'
  const canResume = status === 'paused'
  const canDelete = status === 'draft'
  const canActivate = status === 'draft'
  const canView = !!onView

  // Count visible actions
  const visibleActionCount = [canEdit || canView, canPause || canResume, onAnalytics].filter(Boolean).length

  // If we have too many actions on mobile, hide some in menu
  const showInMenu = compact && visibleActionCount > 2

  return (
    <ActionsContainer compact={compact}>
      {/* Primary actions */}
      {onView && !showInMenu && (
        <ActionButton
          variant="primary"
          size="sm"
          compact={compact}
          onClick={onView}
          title="View campaign details"
        >
          <Eye size={14} />
          {!compact && 'View'}
        </ActionButton>
      )}

      {/* Status actions */}
      {canPause && onPause && (
        <ActionButton
          variant="secondary"
          size="sm"
          compact={compact}
          onClick={onPause}
          title="Pause campaign"
        >
          <Pause size={14} />
          {!compact && 'Pause'}
        </ActionButton>
      )}

      {canResume && onResume && (
        <ActionButton
          variant="secondary"
          size="sm"
          compact={compact}
          onClick={onResume}
          title="Resume campaign"
        >
          <Play size={14} />
          {!compact && 'Resume'}
        </ActionButton>
      )}

      {/* Analytics action */}
      {onAnalytics && !showInMenu && (
        <ActionButton
          variant="secondary"
          size="sm"
          compact={compact}
          onClick={onAnalytics}
          title="View analytics"
        >
          <TrendingUp size={14} />
          {!compact && 'Analytics'}
        </ActionButton>
      )}

      {/* More menu for secondary actions */}
      {(onEdit || onAnalytics || showInMenu) && (
        <div style={{ position: 'relative' }}>
          <MoreButton
            variant="ghost"
            size="sm"
            compact={compact}
            onClick={() => setShowMenu(!showMenu)}
            title="More actions"
          >
            <MoreVertical size={16} />
          </MoreButton>

          <DropdownMenu isOpen={showMenu}>
            {onEdit && canEdit && (
              <MenuItem
                onClick={() => {
                  onEdit()
                  setShowMenu(false)
                }}
              >
                <Edit2 size={14} />
                Edit Campaign
              </MenuItem>
            )}

            {onAnalytics && showInMenu && (
              <MenuItem
                onClick={() => {
                  onAnalytics()
                  setShowMenu(false)
                }}
              >
                <TrendingUp size={14} />
                View Analytics
              </MenuItem>
            )}

            {onView && showInMenu && (
              <MenuItem
                onClick={() => {
                  onView()
                  setShowMenu(false)
                }}
              >
                <Eye size={14} />
                View Details
              </MenuItem>
            )}

            {onDelete && canDelete && (
              <MenuItem
                className="danger"
                onClick={() => {
                  onDelete()
                  setShowMenu(false)
                }}
              >
                <Trash2 size={14} />
                Delete Campaign
              </MenuItem>
            )}
          </DropdownMenu>
        </div>
      )}

      {/* Danger action - always visible but hidden on compact */}
      {onDelete && canDelete && !compact && (
        <ActionButton
          variant="danger"
          size="sm"
          compact={compact}
          onClick={onDelete}
          title="Delete campaign (cannot be undone)"
        >
          <Trash2 size={14} />
          {!compact && 'Delete'}
        </ActionButton>
      )}

      {/* Click outside to close menu */}
      {showMenu && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 5,
          }}
          onClick={() => setShowMenu(false)}
        />
      )}
    </ActionsContainer>
  )
}

export default QuickActions
