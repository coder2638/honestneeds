'use client'

import React from 'react'
import styled, { css } from 'styled-components'
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS, TRANSITIONS } from '@/styles/tokens'

interface StyledButtonProps {
  $variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  $size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  $isLoading?: boolean
  $fullWidth?: boolean
}

const variantStyles = {
  primary: css`
    background-color: ${COLORS.PRIMARY};
    color: ${COLORS.SURFACE};
    border: 2px solid transparent;

    &:hover:not(:disabled) {
      background-color: ${COLORS.PRIMARY_DARK};
      box-shadow: ${SHADOWS.MD};
    }

    &:active:not(:disabled) {
      transform: scale(0.98);
    }

    &:focus-visible {
      outline-offset: 2px;
      box-shadow: ${SHADOWS.FOCUS};
    }
  `,
  secondary: css`
    background-color: ${COLORS.SECONDARY};
    color: ${COLORS.SURFACE};
    border: 2px solid transparent;

    &:hover:not(:disabled) {
      background-color: ${COLORS.SECONDARY_DARK};
      box-shadow: ${SHADOWS.MD};
    }

    &:active:not(:disabled) {
      transform: scale(0.98);
    }

    &:focus-visible {
      outline-offset: 2px;
      box-shadow: ${SHADOWS.FOCUS};
    }
  `,
  outline: css`
    background-color: transparent;
    color: ${COLORS.PRIMARY};
    border: 2px solid ${COLORS.PRIMARY};

    &:hover:not(:disabled) {
      background-color: ${COLORS.PRIMARY_BG};
      border-color: ${COLORS.PRIMARY_DARK};
    }

    &:focus-visible {
      outline-offset: 2px;
      box-shadow: ${SHADOWS.FOCUS};
    }
  `,
  ghost: css`
    background-color: transparent;
    color: ${COLORS.PRIMARY};
    border: 2px solid transparent;

    &:hover:not(:disabled) {
      background-color: ${COLORS.PRIMARY_BG};
    }

    &:focus-visible {
      outline-offset: 2px;
      box-shadow: ${SHADOWS.FOCUS};
    }
  `,
}

const sizeStyles = {
  xs: css`
    padding: ${SPACING[1]} ${SPACING[2]};
    font-size: ${TYPOGRAPHY.SIZE_XS};
    font-weight: ${TYPOGRAPHY.WEIGHT_MEDIUM};
    min-height: 28px;
    gap: ${SPACING[1]};
  `,
  sm: css`
    padding: ${SPACING[2]} ${SPACING[3]};
    font-size: ${TYPOGRAPHY.SIZE_SM};
    font-weight: ${TYPOGRAPHY.WEIGHT_MEDIUM};
    min-height: 36px;
    gap: ${SPACING[2]};
  `,
  md: css`
    padding: ${SPACING[2]} ${SPACING[4]};
    font-size: ${TYPOGRAPHY.SIZE_BASE};
    font-weight: ${TYPOGRAPHY.WEIGHT_MEDIUM};
    min-height: 44px;
    gap: ${SPACING[2]};
  `,
  lg: css`
    padding: ${SPACING[3]} ${SPACING[6]};
    font-size: ${TYPOGRAPHY.SIZE_LG};
    font-weight: ${TYPOGRAPHY.WEIGHT_SEMIBOLD};
    min-height: 48px;
    gap: ${SPACING[2]};
  `,
  xl: css`
    padding: ${SPACING[3]} ${SPACING[8]};
    font-size: ${TYPOGRAPHY.SIZE_LG};
    font-weight: ${TYPOGRAPHY.WEIGHT_SEMIBOLD};
    min-height: 56px;
    gap: ${SPACING[3]};
  `,
}

const StyledButton = styled.button<StyledButtonProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-family: ${TYPOGRAPHY.FONT_BODY};
  border-radius: ${BORDER_RADIUS.MD};
  border: none;
  cursor: pointer;
  transition: all ${TRANSITIONS.BASE};
  text-decoration: none;
  white-space: nowrap;
  user-select: none;
  position: relative;

  /* Variant styles */
  ${props => variantStyles[props.$variant || 'primary']}

  /* Size styles */
  ${props => sizeStyles[props.$size || 'md']}

  /* Full width */
  ${props => props.$fullWidth && 'width: 100%;'}

  /* Disabled state */
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  /* Loading state */
  ${props =>
    props.$isLoading &&
    css`
      color: transparent;

      &::after {
        content: '';
        position: absolute;
        width: 16px;
        height: 16px;
        top: 50%;
        left: 50%;
        margin-left: -8px;
        margin-top: -8px;
        border: 2px solid currentColor;
        border-radius: 50%;
        border-top-color: transparent;
        animation: spin 0.6s linear infinite;
      }

      @keyframes spin {
        to {
          transform: rotate(360deg);
        }
      }
    `}
`

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  isLoading?: boolean
  fullWidth?: boolean
  children: React.ReactNode
  as?: 'button' | 'link'
  href?: string
  target?: string
  rel?: string
}

const StyledLink = styled.a<StyledButtonProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-family: ${TYPOGRAPHY.FONT_BODY};
  border-radius: ${BORDER_RADIUS.MD};
  border: none;
  cursor: pointer;
  transition: all ${TRANSITIONS.BASE};
  text-decoration: none;
  white-space: nowrap;
  user-select: none;
  position: relative;

  /* Variant styles */
  ${props => variantStyles[props.$variant || 'primary']}

  /* Size styles */
  ${props => sizeStyles[props.$size || 'md']}

  /* Full width */
  ${props => props.$fullWidth && 'width: 100%;'}

  /* Disabled state */
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  /* Loading state */
  ${props =>
    props.$isLoading &&
    css`
      color: transparent;

      &::after {
        content: '';
        position: absolute;
        width: 16px;
        height: 16px;
        top: 50%;
        left: 50%;
        margin-left: -8px;
        margin-top: -8px;
        border: 2px solid currentColor;
        border-radius: 50%;
        border-top-color: transparent;
        animation: spin 0.6s linear infinite;
      }

      @keyframes spin {
        to {
          transform: rotate(360deg);
        }
      }
    `}
`

export const Button = React.forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      fullWidth = false,
      disabled,
      children,
      as = 'button',
      href,
      target,
      rel,
      ...props
    },
    ref
  ) => {
    // Render as anchor/link when as="link" and href is provided
    if (as === 'link' && href) {
      return (
        <StyledLink
          ref={ref as React.Ref<HTMLAnchorElement>}
          href={href}
          target={target}
          rel={rel}
          $variant={variant}
          $size={size}
          $isLoading={isLoading}
          $fullWidth={fullWidth}
          {...props}
        >
          {children}
        </StyledLink>
      )
    }

    return (
      <StyledButton
        ref={ref as React.Ref<HTMLButtonElement>}
        $variant={variant}
        $size={size}
        $isLoading={isLoading}
        $fullWidth={fullWidth}
        disabled={disabled || isLoading}
        {...props}
      >
        {children}
      </StyledButton>
    )
  }
)

Button.displayName = 'Button'
