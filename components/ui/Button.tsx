'use client'

import React, { ReactNode } from 'react'
import styled from 'styled-components'

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  children?: ReactNode
  className?: string
  onClick?: () => void
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
  as?: 'button' | 'link'
  href?: string
  target?: string
  rel?: string
  icon?: ReactNode
}

const StyledButton = styled.button<{ $variant: string; $size: string }>`
  padding: ${(props) => {
    const sizes = {
      xs: '0.375rem 0.75rem',
      sm: '0.5rem 1rem',
      md: '0.75rem 1.5rem',
      lg: '1rem 2rem',
      xl: '1.25rem 2.5rem',
    }
    return sizes[props.$size as keyof typeof sizes] || sizes['md']
  }};

  font-size: ${(props) => {
    const sizes = {
      xs: '0.75rem',
      sm: '0.875rem',
      md: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
    }
    return sizes[props.$size as keyof typeof sizes] || sizes['md']
  }};

  font-weight: 600;
  border-radius: 0.5rem;
  border: 1px solid transparent;
  cursor: pointer;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-family: inherit;
  text-decoration: none;

  ${(props) => {
    const variants = {
      primary: `
        background-color: var(--color-primary);
        color: white;
        border-color: var(--color-primary);
        &:hover:not(:disabled) { 
          background-color: var(--color-primary-dark);
          border-color: var(--color-primary-dark);
        }
        &:active:not(:disabled) { transform: scale(0.98); }
      `,
      secondary: `
        background-color: var(--color-secondary);
        color: white;
        border-color: var(--color-secondary);
        &:hover:not(:disabled) { 
          background-color: var(--color-secondary-dark);
          border-color: var(--color-secondary-dark);
        }
      `,
      outline: `
        background-color: transparent;
        border: 2px solid var(--color-primary);
        color: var(--color-primary);
        &:hover:not(:disabled) { background-color: var(--color-primary-light); }
      `,
      ghost: `
        background-color: transparent;
        color: var(--color-primary);
        &:hover:not(:disabled) { background-color: rgba(99, 102, 241, 0.1); }
      `,
    }
    return variants[props.$variant as keyof typeof variants] || variants['primary']
  }};

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &:focus-visible {
    outline: 2px solid var(--color-primary);
    outline-offset: 2px;
  }
`

// Styled anchor element for link buttons
const StyledAnchor = styled.a<{ $variant: string; $size: string }>`
  padding: ${(props) => {
    const sizes = {
      xs: '0.375rem 0.75rem',
      sm: '0.5rem 1rem',
      md: '0.75rem 1.5rem',
      lg: '1rem 2rem',
      xl: '1.25rem 2.5rem',
    }
    return sizes[props.$size as keyof typeof sizes] || sizes['md']
  }};

  font-size: ${(props) => {
    const sizes = {
      xs: '0.75rem',
      sm: '0.875rem',
      md: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
    }
    return sizes[props.$size as keyof typeof sizes] || sizes['md']
  }};

  font-weight: 600;
  border-radius: 0.5rem;
  border: 1px solid transparent;
  cursor: pointer;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-family: inherit;
  text-decoration: none;

  ${(props) => {
    const variants = {
      primary: `
        background-color: var(--color-primary);
        color: white;
        border-color: var(--color-primary);
        &:hover { 
          background-color: var(--color-primary-dark);
          border-color: var(--color-primary-dark);
        }
        &:active { transform: scale(0.98); }
      `,
      secondary: `
        background-color: var(--color-secondary);
        color: white;
        border-color: var(--color-secondary);
        &:hover { 
          background-color: var(--color-secondary-dark);
          border-color: var(--color-secondary-dark);
        }
      `,
      outline: `
        background-color: transparent;
        border: 2px solid var(--color-primary);
        color: var(--color-primary);
        &:hover { background-color: var(--color-primary-light); }
      `,
      ghost: `
        background-color: transparent;
        color: var(--color-primary);
        &:hover { background-color: rgba(99, 102, 241, 0.1); }
      `,
    }
    return variants[props.$variant as keyof typeof variants] || variants['primary']
  }};

  &:focus-visible {
    outline: 2px solid var(--color-primary);
    outline-offset: 2px;
  }
`

export default function Button({
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  as = 'button',
  href,
  target,
  rel,
  icon,
  ...props
}: ButtonProps) {
  // Helper to render icon - handle both component functions and React elements
  const renderIcon = () => {
    if (!icon) return null;
    if (typeof icon === 'function') {
      return React.createElement(icon);
    }
    return <span>{icon}</span>;
  };

  if (as === 'link' && href) {
    // Render as a styled anchor element
    // Do NOT spread `as` prop to avoid styled-components conflicts
    return (
      <StyledAnchor
        href={href}
        target={target}
        rel={rel}
        $variant={variant}
        $size={size}
        className={className}
        {...props}
      >
        {renderIcon()}
        {children}
      </StyledAnchor>
    )
  }

  return (
    <StyledButton
      $variant={variant}
      $size={size}
      className={className}
      {...props}
    >
      {renderIcon()}
      {children}
    </StyledButton>
  )
}
