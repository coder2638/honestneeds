'use client'

import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { Eye, Edit2, Pause, Play, Trash2, TrendingUp, Share2 } from 'lucide-react'

interface ContextMenuAction {
  id: string
  label: string
  icon: React.ReactNode
  onClick: () => void
  disabled?: boolean
  danger?: boolean
}

interface ContextMenuPosition {
  x: number
  y: number
}

interface ContextMenuProps {
  actions: ContextMenuAction[]
  children: React.ReactNode
  onOpen?: () => void
  onClose?: () => void
}

const ContextMenuWrapper = styled.div`
  position: relative;
  width: 100%;
`

const ContextMenuContainer = styled.div<{ position: ContextMenuPosition | null }>`
  position: fixed;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  min-width: 200px;
  display: ${(props) => (props.position ? 'block' : 'none')};
  top: ${(props) => (props.position ? `${props.position.y}px` : '0')};
  left: ${(props) => (props.position ? `${props.position.x}px` : '0')};
  animation: fadeIn 0.15s ease-out;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: scale(0.95);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }
`

const MenuDivider = styled.div`
  height: 1px;
  background: #e5e7eb;
  margin: 4px 0;
`

const MenuItem = styled.button<{ isDanger?: boolean; disabled?: boolean }>`
  width: 100%;
  padding: 10px 16px;
  border: none;
  background: transparent;
  color: ${(props) => (props.isDanger ? '#ef4444' : '#374151')};
  font-size: 13px;
  font-weight: 500;
  text-align: left;
  cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 10px;
  opacity: ${(props) => (props.disabled ? 0.5 : 1)};

  &:hover:not(:disabled) {
    background: ${(props) => (props.isDanger ? '#fee2e2' : '#f9fafb')};
  }

  &:active:not(:disabled) {
    background: ${(props) => (props.isDanger ? '#fecaca' : '#f3f4f6')};
  }

  svg {
    width: 14px;
    height: 14px;
    flex-shrink: 0;
  }
`

const Overlay = styled.div<{ isVisible: boolean }>`
  position: fixed;
  inset: 0;
  z-index: 999;
  display: ${(props) => (props.isVisible ? 'block' : 'none')};
`

/**
 * ContextMenu Component
 * Provides right-click context menu functionality
 *
 * Usage:
 * <ContextMenu actions={[
 *   { id: 'view', label: 'View', icon: <Eye />, onClick: () => {} },
 *   { id: 'edit', label: 'Edit', icon: <Edit />, onClick: () => {} },
 * ]}>
 *   <CampaignCard />
 * </ContextMenu>
 */
export const ContextMenu: React.FC<ContextMenuProps> = ({
  actions,
  children,
  onOpen,
  onClose,
}) => {
  const [position, setPosition] = useState<ContextMenuPosition | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  // Handle right-click
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault()
    onOpen?.()

    // Calculate menu position
    let x = e.clientX
    let y = e.clientY

    // Adjust if menu would go off-screen
    const menuWidth = 200
    const menuHeight = actions.length * 40 + 20

    if (x + menuWidth > window.innerWidth) {
      x = window.innerWidth - menuWidth - 10
    }

    if (y + menuHeight > window.innerHeight) {
      y = window.innerHeight - menuHeight - 10
    }

    setPosition({ x, y })
  }

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setPosition(null)
        onClose?.()
      }
    }

    if (position) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => {
        document.removeEventListener('mousedown', handleClickOutside)
      }
    }
  }, [position, onClose])

  // Handle keyboard (Escape)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setPosition(null)
        onClose?.()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [onClose])

  const handleMenuItemClick = (action: ContextMenuAction) => {
    if (!action.disabled) {
      action.onClick()
      setPosition(null)
      onClose?.()
    }
  }

  return (
    <ContextMenuWrapper ref={containerRef} onContextMenu={handleContextMenu}>
      {children}

      <Overlay isVisible={!!position} onClick={() => setPosition(null)} />

      <ContextMenuContainer position={position} ref={menuRef}>
        {actions.map((action, index) => (
          <React.Fragment key={action.id}>
            <MenuItem
              onClick={() => handleMenuItemClick(action)}
              disabled={action.disabled}
              isDanger={action.danger}
              title={action.label}
            >
              {action.icon}
              {action.label}
            </MenuItem>
            {index < actions.length - 1 && (
              <MenuDivider />
            )}
          </React.Fragment>
        ))}
      </ContextMenuContainer>
    </ContextMenuWrapper>
  )
}

/**
 * Pre-built context menu actions for campaigns
 */
export const getCampaignContextMenuActions = (
  status: string,
  handlers: {
    onView?: () => void
    onEdit?: () => void
    onAnalytics?: () => void
    onPause?: () => void
    onResume?: () => void
    onComplete?: () => void
    onDelete?: () => void
    onShare?: () => void
  }
): ContextMenuAction[] => {
  const actions: ContextMenuAction[] = []

  // View action
  if (handlers.onView) {
    actions.push({
      id: 'view',
      label: 'View Details',
      icon: <Eye size={14} />,
      onClick: handlers.onView,
    })
  }

  // Edit action (draft only)
  if (status === 'draft' && handlers.onEdit) {
    actions.push({
      id: 'edit',
      label: 'Edit Campaign',
      icon: <Edit2 size={14} />,
      onClick: handlers.onEdit,
    })
  }

  // Analytics action
  if (handlers.onAnalytics) {
    actions.push({
      id: 'analytics',
      label: 'View Analytics',
      icon: <TrendingUp size={14} />,
      onClick: handlers.onAnalytics,
    })
  }

  // Share action
  if (handlers.onShare) {
    actions.push({
      id: 'share',
      label: 'Share Campaign',
      icon: <Share2 size={14} />,
      onClick: handlers.onShare,
    })
  }

  // Pause/Resume action
  if (status === 'active' && handlers.onPause) {
    actions.push({
      id: 'pause',
      label: 'Pause Campaign',
      icon: <Pause size={14} />,
      onClick: handlers.onPause,
    })
  } else if (status === 'paused' && handlers.onResume) {
    actions.push({
      id: 'resume',
      label: 'Resume Campaign',
      icon: <Play size={14} />,
      onClick: handlers.onResume,
    })
  }

  // Complete action
  if ((status === 'active' || status === 'paused') && handlers.onComplete) {
    actions.push({
      id: 'complete',
      label: 'Complete Campaign',
      icon: <Edit2 size={14} />,
      onClick: handlers.onComplete,
    })
  }

  // Delete action (draft only)
  if (status === 'draft' && handlers.onDelete) {
    actions.push({
      id: 'delete',
      label: 'Delete Campaign',
      icon: <Trash2 size={14} />,
      onClick: handlers.onDelete,
      danger: true,
    })
  }

  return actions
}

export default ContextMenu
