/**
 * Bottom Tab Bar Component
 * Mobile-first navigation with bottom tabs following iOS/Android patterns
 */

'use client'

import React, { useState } from 'react'
import styled from 'styled-components'
import Link from 'next/link'
import { TOUCH_TARGETS, ANIMATION_DURATIONS, Z_INDEX } from '@/lib/mobile/constants'
import { mediaQueries } from '@/lib/mobile/breakpoints'

export interface BottomTabItem {
  id: string
  label: string
  icon: React.ReactNode
  href: string
  badge?: number | string
  disabled?: boolean
}

export interface BottomTabBarProps {
  items: BottomTabItem[]
  activeTab?: string
  onTabChange?: (tabId: string) => void
  variant?: 'filled' | 'outline'
}

const BottomTabBarContainer = styled.nav`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 64px;
  background: white;
  border-top: 1px solid #e5e7eb;
  display: flex;
  z-index: ${Z_INDEX.sticky};
  padding-bottom: env(safe-area-inset-bottom);
  
  /* Hide on desktop */
  ${mediaQueries.isDesktop} {
    display: none;
  }

  /* Safe area support */
  @supports (padding: max(0px)) {
    padding-bottom: max(16px, env(safe-area-inset-bottom));
  }
`

const TabsList = styled.div`
  display: flex;
  width: 100%;
  gap: 0;
`

const TabButton = styled(Link)<{ $active: boolean; $disabled: boolean }>`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  min-height: ${TOUCH_TARGETS.standard}px;
  text-decoration: none;
  color: inherit;
  border: none;
  background: transparent;
  cursor: pointer;
  transition: all ${ANIMATION_DURATIONS.fast}ms ease-out;
  user-select: none;
  position: relative;
  
  /* Base color */
  color: #6b7280;
  font-size: 12px;
  font-weight: 500;

  /* Active state */
  ${(props) =>
    props.$active &&
    `
    color: #667eea;
    
    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 3px;
      background: #667eea;
    }
  `}

  /* Hover state */
  &:hover {
    background: rgba(102, 126, 234, 0.05);
    color: ${(props) => (props.$active ? '#667eea' : '#1f2937')};
  }

  /* Active hover */
  ${(props) =>
    props.$active &&
    `
    &:hover {
      color: #5568d3;
    }
  `}

  /* Disabled state */
  ${(props) =>
    props.$disabled &&
    `
    opacity: 0.5;
    cursor: not-allowed;

    &:hover {
      background: transparent;
      color: #9ca3af;
    }
  `}

  /* Icon styles */
  svg {
    width: 24px;
    height: 24px;
    display: block;
  }

  /* Reduced motion */
  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`

const Badge = styled.span`
  position: absolute;
  top: 2px;
  right: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 20px;
  height: 20px;
  padding: 0 4px;
  background: #ef4444;
  color: white;
  font-size: 10px;
  font-weight: 700;
  border-radius: 10px;
  border: 2px solid white;
`

/**
 * Bottom Tab Bar Component
 * Mobile navigation bar with fixed bottom positioning
 */
export const BottomTabBar: React.FC<BottomTabBarProps> = ({
  items,
  activeTab,
  onTabChange,
  variant = 'filled',
}) => {
  const [localActiveTab, setLocalActiveTab] = useState(activeTab || items[0]?.id)

  const handleTabClick = (tabId: string) => {
    setLocalActiveTab(tabId)
    onTabChange?.(tabId)
  }

  return (
    <BottomTabBarContainer role="tablist">
      <TabsList>
        {items.map((item) => (
          <TabButton
            key={item.id}
            href={item.href}
            $active={activeTab ? activeTab === item.id : localActiveTab === item.id}
            $disabled={!!item.disabled}
            onClick={() => !item.disabled && handleTabClick(item.id)}
            role="tab"
            aria-selected={activeTab ? activeTab === item.id : localActiveTab === item.id}
            aria-label={item.label}
            title={item.label}
          >
            <div style={{ position: 'relative' }}>
              {item.icon}
              {item.badge && <Badge>{item.badge}</Badge>}
            </div>
            <span>{item.label}</span>
          </TabButton>
        ))}
      </TabsList>
    </BottomTabBarContainer>
  )
}

export default BottomTabBar
