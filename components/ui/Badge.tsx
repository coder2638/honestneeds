import React from 'react'
import styled from 'styled-components'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info'
  className?: string
}

const variantStyles: Record<string, { bg: string; color: string }> = {
  primary: { bg: '#c7d2fe', color: '#3730a3' },
  secondary: { bg: '#e5e7eb', color: '#374151' },
  success: { bg: '#dcfce7', color: '#166534' },
  warning: { bg: '#fef3c7', color: '#92400e' },
  danger: { bg: '#fee2e2', color: '#991b1b' },
  info: { bg: '#dbeafe', color: '#1e40af' },
  default: { bg: '#f3f4f6', color: '#111827' },
}

const StyledBadge = styled.span<{ $variant?: string }>`
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;
  background: ${(props) => {
    const variant = props.$variant || 'default'
    const style = variantStyles[variant] || variantStyles.default
    return style.bg
  }};
  color: ${(props) => {
    const variant = props.$variant || 'default'
    const style = variantStyles[variant] || variantStyles.default
    return style.color
  }};
`

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'default', className }) => {
  return (
    <StyledBadge $variant={variant} className={className}>
      {children}
    </StyledBadge>
  )
}

export default Badge
