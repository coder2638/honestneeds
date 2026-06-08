/**
 * Mobile Card Component
 * Touch-friendly card for content display
 */

'use client'

import React from 'react'
import styled from 'styled-components'
import { mediaQueries } from '@/lib/mobile/breakpoints'
import { SHADOWS, ANIMATION_DURATIONS, BORDER_RADIUS } from '@/lib/mobile/constants'

export interface MobileCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'outlined' | 'filled'
  padding?: 'none' | 'small' | 'normal' | 'large'
  interactive?: boolean
  clickable?: boolean
  children?: React.ReactNode
}

const getPaddingValue = (padding: string): string => {
  switch (padding) {
    case 'none':
      return '0'
    case 'small':
      return '12px'
    case 'large':
      return '20px'
    case 'normal':
    default:
      return '16px'
  }
}

const StyledCard = styled.div<{
  $variant: string
  $padding: string
  $interactive: boolean
}>`
  /* Base styles */
  padding: ${(props) => getPaddingValue(props.$padding)};
  border-radius: ${BORDER_RADIUS.base}px;
  background: white;
  transition: all ${ANIMATION_DURATIONS.fast}ms ease-out;

  /* Variant styles */
  ${(props) => {
    switch (props.$variant) {
      case 'elevated':
        return `
          box-shadow: ${SHADOWS.md};
        `
      case 'outlined':
        return `
          border: 1px solid #e5e7eb;
        `
      case 'filled':
        return `
          background: #f9fafb;
          border: 1px solid #e5e7eb;
        `
      case 'default':
      default:
        return `
          box-shadow: ${SHADOWS.sm};
        `
    }
  }}

  /* Interactive state */
  ${(props) =>
    props.$interactive &&
    `
    &:hover {
      box-shadow: ${SHADOWS.lg};
      transform: translateY(-2px);
    }

    &:active {
      transform: translateY(0);
    }
  `}

  /* Clickable state */
  cursor: ${(props) => (props.$interactive ? 'pointer' : 'default')};

  /* Mobile optimizations */
  ${mediaQueries.isMobile} {
    border-radius: ${BORDER_RADIUS.md}px;
  }

  /* Reduced motion */
  @media (prefers-reduced-motion: reduce) {
    transition: none;

    &:hover {
      transform: none;
    }
  }
`

/**
 * Mobile Card Component
 */
export const MobileCard = React.forwardRef<HTMLDivElement, MobileCardProps>(
  (
    {
      variant = 'default',
      padding = 'normal',
      interactive = false,
      clickable = false,
      children,
      onClick,
      role,
      tabIndex,
      ...rest
    },
    ref
  ) => {
    const isInteractive = interactive || clickable || !!onClick
    const isClickable = clickable || !!onClick

    return (
      <StyledCard
        ref={ref}
        $variant={variant}
        $padding={padding}
        $interactive={isInteractive}
        onClick={onClick}
        role={isClickable ? role || 'button' : role}
        tabIndex={isClickable ? tabIndex ?? 0 : tabIndex}
        {...rest}
      >
        {children}
      </StyledCard>
    )
  }
)

MobileCard.displayName = 'MobileCard'

export default MobileCard
