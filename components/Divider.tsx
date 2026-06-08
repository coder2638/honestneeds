'use client'

import React from 'react'
import styled from 'styled-components'
import { COLORS, TYPOGRAPHY, SPACING } from '@/styles/tokens'

interface StyledDividerProps {
  $orientation?: 'horizontal' | 'vertical'
}

const StyledDivider = styled.div<StyledDividerProps>`
  background-color: ${COLORS.DIVIDER};
  ${props =>
    props.$orientation === 'vertical'
      ? `
    width: 1px;
    height: 100%;
    min-height: 24px;
  `
      : `
    width: 100%;
    height: 1px;
  `}
`

const DividerWithLabel = styled.div`
  display: flex;
  align-items: center;
  gap: ${SPACING[4]};

  &::before,
  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background-color: ${COLORS.DIVIDER};
  }
`

const DividerLabel = styled.span`
  color: ${COLORS.MUTED_TEXT};
  font-size: ${TYPOGRAPHY.SIZE_SM};
  font-weight: ${TYPOGRAPHY.WEIGHT_MEDIUM};
  white-space: nowrap;
`

export interface DividerProps {
  orientation?: 'horizontal' | 'vertical'
  label?: string
  className?: string
}

export const Divider = React.forwardRef<HTMLDivElement, DividerProps>(
  ({ orientation = 'horizontal', label, className }, ref) => {
    if (label && orientation === 'horizontal') {
      return (
        <DividerWithLabel ref={ref} className={className}>
          <DividerLabel>{label}</DividerLabel>
        </DividerWithLabel>
      )
    }

    return <StyledDivider ref={ref} $orientation={orientation} className={className} />
  }
)

Divider.displayName = 'Divider'
