/**
 * Mobile Button Component
 * Touch-friendly button with 44x44px minimum size
 */

'use client'

import React, { CSSProperties } from 'react'
import styled from 'styled-components'
import { mediaQueries } from '@/lib/mobile/breakpoints'
import { TOUCH_TARGETS, ANIMATION_DURATIONS, Z_INDEX } from '@/lib/mobile/constants'

export interface MobileButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  size?: 'small' | 'medium' | 'large'
  fullWidth?: boolean
  loading?: boolean
  disabled?: boolean
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'
  children?: React.ReactNode
}

const StyledButton = styled.button<{
  $variant: string
  $size: string
  $fullWidth: boolean
  $isLoading: boolean
}>`
  /* Base styles */
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 16px;
  cursor: pointer;
  transition: all ${ANIMATION_DURATIONS.fast}ms ease-out;
  white-space: nowrap;
  user-select: none;
  -webkit-user-select: none;

  /* Touch target sizing (44x44px minimum) */
  min-height: ${TOUCH_TARGETS.standard}px;
  min-width: ${TOUCH_TARGETS.standard}px;
  padding: 12px 16px;

  /* Full width option */
  ${(props) => props.$fullWidth && 'width: 100%;'}

  /* Size variants */
  ${(props) => {
    switch (props.$size) {
      case 'small':
        return `
          min-height: 36px;
          min-width: 36px;
          padding: 8px 12px;
          font-size: 14px;
        `
      case 'large':
        return `
          min-height: 56px;
          min-width: 56px;
          padding: 16px 24px;
          font-size: 18px;
        `
      default:
        return ''
    }
  }}

  /* Prevent zoom on iOS */
  font-size: 16px;

  /* Color variants */
  ${(props) => {
    switch (props.$variant) {
      case 'primary':
        return `
          background: #667eea;
          color: white;
          
          &:active {
            background: #5568d3;
          }
          
          &:hover {
            background: #7c8ff0;
          }
        `
      case 'secondary':
        return `
          background: #e5e7eb;
          color: #1f2937;
          
          &:active {
            background: #d1d5db;
          }
          
          &:hover {
            background: #f3f4f6;
          }
        `
      case 'outline':
        return `
          background: transparent;
          color: #667eea;
          border: 2px solid #667eea;
          
          &:active {
            background: rgba(102, 126, 234, 0.1);
          }
          
          &:hover {
            background: rgba(102, 126, 234, 0.05);
          }
        `
      case 'ghost':
        return `
          background: transparent;
          color: #1f2937;
          
          &:active {
            background: rgba(0, 0, 0, 0.1);
          }
          
          &:hover {
            background: rgba(0, 0, 0, 0.05);
          }
        `
      case 'danger':
        return `
          background: #ef4444;
          color: white;
          
          &:active {
            background: #dc2626;
          }
          
          &:hover {
            background: #f87171;
          }
        `
      default:
        return ''
    }
  }}

  /* Disabled state */
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    
    &:active, &:hover {
      background: inherit;
    }
  }

  /* Loading state */
  ${(props) =>
    props.$isLoading &&
    `
    color: transparent;
    pointer-events: none;
  `}

  /* Focus state (accessibility) */
  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }

  /* Mobile optimizations */
  ${mediaQueries.isTouchDevice} {
    /* Increase touch target for touch devices */
    min-height: ${TOUCH_TARGETS.recommended}px;
    min-width: ${TOUCH_TARGETS.recommended}px;
    padding: 14px 20px;
  }

  /* Tablet and desktop */
  ${mediaQueries.isPointerDevice} {
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    }
  }

  /* Reduced motion */
  @media (prefers-reduced-motion: reduce) {
    transition: none;
    
    &:hover {
      transform: none;
    }
  }
`

const Spinner = styled.div`
  position: absolute;
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`

/**
 * Mobile Button Component
 */
export const MobileButton = React.forwardRef<HTMLButtonElement, MobileButtonProps>(
  (
    {
      variant = 'primary',
      size = 'medium',
      fullWidth = false,
      loading = false,
      disabled = false,
      icon,
      iconPosition = 'left',
      children,
      style,
      ...rest
    },
    ref
  ) => {
    return (
      <StyledButton
        ref={ref}
        $variant={variant}
        $size={size}
        $fullWidth={fullWidth}
        $isLoading={loading}
        disabled={disabled || loading}
        {...rest}
      >
        {loading && <Spinner />}

        {icon && iconPosition === 'left' && !loading && icon}

        {children}

        {icon && iconPosition === 'right' && !loading && icon}
      </StyledButton>
    )
  }
)

MobileButton.displayName = 'MobileButton'

export default MobileButton
