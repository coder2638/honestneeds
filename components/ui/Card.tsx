import React from 'react'
import styled from 'styled-components'

const CardContainer = styled.div`
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  overflow: hidden;
`

const CardHeaderContainer = styled.div`
  padding: 16px;
  border-bottom: 1px solid #e5e7eb;
`

const CardTitleText = styled.h3`
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #111827;
`

const CardContentContainer = styled.div`
  padding: 16px;
`

interface CardProps {
  children: React.ReactNode
  className?: string
}

interface CardHeaderProps {
  children: React.ReactNode
  className?: string
}

interface CardTitleProps {
  children: React.ReactNode
  className?: string
}

interface CardContentProps {
  children: React.ReactNode
  className?: string
}

export const Card: React.FC<CardProps> = ({ children, className }) => (
  <CardContainer className={className}>
    {children}
  </CardContainer>
)

export const CardHeader: React.FC<CardHeaderProps> = ({ children, className }) => (
  <CardHeaderContainer className={className}>
    {children}
  </CardHeaderContainer>
)

export const CardTitle: React.FC<CardTitleProps> = ({ children, className }) => (
  <CardTitleText className={className}>
    {children}
  </CardTitleText>
)

export const CardContent: React.FC<CardContentProps> = ({ children, className }) => (
  <CardContentContainer className={className}>
    {children}
  </CardContentContainer>
)
