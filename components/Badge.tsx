'use client'

import React from 'react'
import styled from 'styled-components'
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, TRANSITIONS } from '@/styles/tokens'

type BadgeVariant = 'default' | 'success' | 'error' | 'warning' | 'info'
type BadgeSize = 'sm' | 'md' | 'lg'

interface StyledBadgeProps {
  $variant?: BadgeVariant
  $size?: BadgeSize
}

const variantStyles: Record<BadgeVariant, { bg: string; text: string; border: string }> = {
  default: {
    bg: COLORS.DISABLED,
    text: COLORS.TEXT,
    border: COLORS.BORDER,
  },
  success: {
    bg: COLORS.SUCCESS_BG,
    text: COLORS.SUCCESS_DARK,
    border: COLORS.SUCCESS_LIGHT,
  },
  error: {
    bg: COLORS.ERROR_BG,
    text: COLORS.ERROR_DARK,
    border: COLORS.ERROR_LIGHT,
  },
  warning: {
    bg: COLORS.WARNING_BG,
    text: COLORS.WARNING_DARK,
    border: COLORS.WARNING_LIGHT,
  },
  info: {
    bg: COLORS.INFO_BG,
    text: COLORS.INFO_DARK,
    border: COLORS.INFO_LIGHT,
  },
}

const sizeStyles: Record<BadgeSize, { padding: string; fontSize: string }> = {
  sm: {
    padding: `${SPACING[1]} ${SPACING[2]}`,
    fontSize: TYPOGRAPHY.SIZE_XS,
  },
  md: {
    padding: `${SPACING[1]} ${SPACING[3]}`,
    fontSize: TYPOGRAPHY.SIZE_SM,
  },
  lg: {
    padding: `${SPACING[2]} ${SPACING[4]}`,
    fontSize: TYPOGRAPHY.SIZE_BASE,
  },
}

const StyledBadge = styled.span<StyledBadgeProps>`
  display: inline-flex;
  align-items: center;
  gap: ${SPACING[1]};
  ${props => {
    const variant = (props.$variant as BadgeVariant) || 'default'
    const style = variantStyles[variant] || variantStyles.default
    return `
      background-color: ${style?.bg || COLORS.DISABLED};
      color: ${style?.text || COLORS.TEXT};
      border: 1px solid ${style?.border || COLORS.BORDER};
    `
  }}
  ${props => {
    const size = (props.$size as BadgeSize) || 'md'
    const style = sizeStyles[size] || sizeStyles.md
    return `
      padding: ${style?.padding || `${SPACING[1]} ${SPACING[3]}`};
      font-size: ${style?.fontSize || TYPOGRAPHY.SIZE_SM};
    `
  }}
  border-radius: ${BORDER_RADIUS.FULL};
  font-weight: ${TYPOGRAPHY.WEIGHT_SEMIBOLD};
  transition: all ${TRANSITIONS.BASE};
  width: fit-content;

  &:hover {
    opacity: 0.8;
  }
`

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant
  size?: BadgeSize
  children: React.ReactNode
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ variant = 'default', size = 'md', children, className, ...props }, ref) => (
    <StyledBadge
      ref={ref}
      $variant={variant}
      $size={size}
      className={className}
      {...props}
    >
      {children}
    </StyledBadge>
  )
)

Badge.displayName = 'Badge'
