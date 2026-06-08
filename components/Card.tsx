'use client'

import React from 'react'
import styled from 'styled-components'
import { COLORS, BORDER_RADIUS, SHADOWS, SPACING, TRANSITIONS } from '@/styles/tokens'

interface StyledCardProps {
  $clickable?: boolean
  $hoverEffect?: boolean
}

const StyledCard = styled.div<StyledCardProps>`
  background-color: ${COLORS.SURFACE};
  border: 1px solid ${COLORS.BORDER};
  border-radius: ${BORDER_RADIUS.LG};
  box-shadow: ${SHADOWS.SM};
  overflow: hidden;
  transition: all ${TRANSITIONS.BASE};

  ${props =>
    props.$clickable &&
    `
    cursor: pointer;
  `}

  ${props =>
    props.$hoverEffect &&
    `
    &:hover {
      box-shadow: ${SHADOWS.LG};
      transform: translateY(-2px);
      border-color: ${COLORS.PRIMARY_LIGHT};
    }
  `}
`

const CardHeader = styled.div`
  padding: ${SPACING[6]};
  border-bottom: 1px solid ${COLORS.BORDER};
`

const CardBody = styled.div`
  padding: ${SPACING[6]};
`

const CardFooter = styled.div`
  padding: ${SPACING[6]};
  border-top: 1px solid ${COLORS.BORDER};
  background-color: ${COLORS.BG};
`

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  clickable?: boolean
  hoverEffect?: boolean
  children: React.ReactNode
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ clickable = false, hoverEffect = false, className, children, ...props }, ref) => (
    <StyledCard
      ref={ref}
      $clickable={clickable}
      $hoverEffect={hoverEffect}
      className={className}
      {...props}
    >
      {children}
    </StyledCard>
  )
)

Card.displayName = 'Card'

export const Card_Header = CardHeader
export const Card_Body = CardBody
export const Card_Footer = CardFooter
