'use client'

import React from 'react'
import styled, { keyframes } from 'styled-components'
import { COLORS } from '@/styles/tokens'

const spin = keyframes`
  to {
    transform: rotate(360deg);
  }
`

interface StyledSpinnerProps {
  $size?: 'sm' | 'md' | 'lg'
  $color?: string
}

const sizeMap = {
  sm: '24px',
  md: '40px',
  lg: '60px',
}

const StyledSpinner = styled.div<StyledSpinnerProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: ${props => sizeMap[props.$size || 'md']};
  height: ${props => sizeMap[props.$size || 'md']};

  svg {
    animation: ${spin} 0.8s linear infinite;
  }
`

const Spinner = styled.svg`
  stroke: ${props => props.color || COLORS.PRIMARY};
`

export interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  color?: string
  className?: string
}

export const LoadingSpinner = React.forwardRef<HTMLDivElement, LoadingSpinnerProps>(
  ({ size = 'md', color = COLORS.PRIMARY, className }, ref) => {
    const sizeValue = sizeMap[size]
    const strokeWidth = size === 'sm' ? 3 : size === 'lg' ? 2 : 2.5

    return (
      <StyledSpinner ref={ref} $size={size} className={className}>
        <Spinner
          width={sizeValue}
          height={sizeValue}
          viewBox="0 0 50 50"
          color={color}
          aria-label="Loading"
          role="status"
        >
          <circle
            cx="25"
            cy="25"
            r="20"
            fill="none"
            strokeWidth={strokeWidth}
            strokeDasharray="31.4 125.6"
            opacity="0.7"
          />
        </Spinner>
      </StyledSpinner>
    )
  }
)

LoadingSpinner.displayName = 'LoadingSpinner'
