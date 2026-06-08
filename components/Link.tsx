'use client'

import React from 'react'
import styled from 'styled-components'
import { COLORS, TYPOGRAPHY, TRANSITIONS } from '@/styles/tokens'

interface StyledLinkProps {
  $variant?: 'primary' | 'secondary' | 'muted'
  $underline?: 'always' | 'hover' | 'never'
}

const variantStyles = {
  primary: `
    color: ${COLORS.PRIMARY};
    
    &:hover {
      color: ${COLORS.PRIMARY_DARK};
    }
  `,
  secondary: `
    color: ${COLORS.SECONDARY};
    
    &:hover {
      color: ${COLORS.SECONDARY_DARK};
    }
  `,
  muted: `
    color: ${COLORS.MUTED_TEXT};
    
    &:hover {
      color: ${COLORS.TEXT};
    }
  `,
}

const underlineStyles = {
  always: `text-decoration: underline;`,
  hover: `
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  `,
  never: `text-decoration: none;`,
}

const StyledLinkElement = styled.a<StyledLinkProps>`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  font-weight: ${TYPOGRAPHY.WEIGHT_MEDIUM};
  transition: all ${TRANSITIONS.BASE};
  position: relative;

  ${props => variantStyles[props.$variant || 'primary']}
  ${props => underlineStyles[props.$underline || 'hover']}

  &:focus-visible {
    outline: 2px solid ${COLORS.PRIMARY};
    outline-offset: 2px;
    border-radius: 2px;
  }

  &:active {
    opacity: 0.8;
  }
`

export interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string
  variant?: 'primary' | 'secondary' | 'muted'
  underline?: 'always' | 'hover' | 'never'
  children: React.ReactNode
  icon?: React.ReactNode
}

export const LinkComponent = React.forwardRef<HTMLAnchorElement, LinkProps>(
  (
    {
      href,
      variant = 'primary',
      underline = 'hover',
      children,
      icon,
      className,
      ...props
    },
    ref
  ) => (
    <StyledLinkElement
      ref={ref}
      href={href}
      $variant={variant}
      $underline={underline}
      className={className}
      {...props}
    >
      {icon && <span>{icon}</span>}
        <span>{children}</span>
      </StyledLinkElement>
  )
)

LinkComponent.displayName = 'Link'

export default LinkComponent
