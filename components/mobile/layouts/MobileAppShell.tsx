/**
 * Mobile App Shell Component
 * Provides the base layout structure for mobile applications with proper safe area handling
 */

'use client'

import React from 'react'
import styled from 'styled-components'
import { ANIMATION_DURATIONS } from '@/lib/mobile/constants'
import { mediaQueries } from '@/lib/mobile/breakpoints'

export interface MobileAppShellProps {
  header?: React.ReactNode
  footer?: React.ReactNode
  children?: React.ReactNode
  enableSafeArea?: boolean
  hideHeaderOnScroll?: boolean
}

export const MobileAppShellContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  height: 100dvh; /* Dynamic viewport height for iOS */
  background: #fafafa;
  
  /* Safe area padding for notches */
  padding-top: max(16px, env(safe-area-inset-top));
  padding-bottom: max(16px, env(safe-area-inset-bottom));
  
  @media (max-width: 599px) {
    height: 100dvh;
  }
`

export const MobileAppShellHeader = styled.header<{ $hideOnScroll?: boolean }>`
  position: sticky;
  top: 0;
  z-index: 100;
  background: white;
  border-bottom: 1px solid #e5e7eb;
  padding: 12px 16px;
  padding-top: max(12px, env(safe-area-inset-top));
  transition: transform ${ANIMATION_DURATIONS.fast}ms ease-out;
  
  ${(props) => props.$hideOnScroll && `&.hide-on-scroll { transform: translateY(-100%); }`}
`

export const MobileAppShellContent = styled.main`
  flex: 1;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch; /* Momentum scrolling for iOS */
  overflow-x: hidden;
  padding: 16px;
  
  @media (max-width: 599px) {
    padding: 12px;
    padding-bottom: calc(64px + 12px + env(safe-area-inset-bottom));
  }
`

export const MobileAppShellFooter = styled.footer`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 200;
  background: white;
  border-top: 1px solid #e5e7eb;
  padding-bottom: env(safe-area-inset-bottom);
  
  /* Hide on desktop */
  ${mediaQueries.isDesktop} {
    display: none;
  }
`

/**
 * Mobile App Shell Component
 * Provides base layout with header, content, and footer
 */
export const MobileAppShell: React.FC<MobileAppShellProps> = ({
  header,
  footer,
  children,
  enableSafeArea = true,
  hideHeaderOnScroll = false,
}) => {
  return (
    <MobileAppShellContainer>
      {header && <MobileAppShellHeader $hideOnScroll={hideHeaderOnScroll}>{header}</MobileAppShellHeader>}
      <MobileAppShellContent>{children}</MobileAppShellContent>
      {footer && <MobileAppShellFooter>{footer}</MobileAppShellFooter>}
    </MobileAppShellContainer>
  )
}

export default MobileAppShell
