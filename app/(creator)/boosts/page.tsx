'use client'

import styled from 'styled-components'
import { BoostManager } from '@/components/boost'

// Styled Components
const PageContainer = styled.div`
  min-height: 100vh;
  background-color: #f9fafb;
  padding: 2rem 1rem;

  @media (min-width: 640px) {
    padding: 2rem;
  }
`

const Header = styled.div`
  max-width: 1400px;
  margin: 0 auto 2rem;
`

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 0.5rem;

  @media (min-width: 640px) {
    font-size: 2.5rem;
  }
`

const Description = styled.p`
  font-size: 1rem;
  color: #6b7280;
`

const ContentContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  background-color: white;
  border-radius: 0.5rem;
  padding: 2rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

  @media (max-width: 640px) {
    padding: 1rem;
  }
`

/**
 * Creator Boosts Dashboard Page
 * Shows all active and past boosts for the creator
 */
export default function BoostsPage() {
  return (
    <PageContainer>
      <Header>
        <Title>Campaign Boosts</Title>
        <Description>Manage your campaign visibility boosts and track their performance</Description>
      </Header>

      <ContentContainer>
        <BoostManager />
      </ContentContainer>
    </PageContainer>
  )
}
