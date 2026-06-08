'use client'

import React from 'react'
import styled from 'styled-components'
import { Bell, Trophy } from 'lucide-react'
import { useCampaignEntries } from '@/api/hooks/useSweepstakes'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import { Badge } from '@/components/Badge'
import Link from 'next/link'

/**
 * Sweepstakes Entry Counter
 * Display on campaign detail showing entries earned
 * Shows breakdown: campaign creation + donations + shares
 */

const Container = styled.div`
  background: linear-gradient(135deg, #f59e0b 0%, #f97316 100%);
  border-radius: 12px;
  padding: 20px;
  color: white;
  margin: 20px 0;
  box-shadow: 0 4px 12px rgba(249, 158, 11, 0.3);
`

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
`

const Title = styled.h3`
  font-size: 18px;
  font-weight: 600;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
`

const EntryCount = styled.div`
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 12px;
`

const Breakdown = styled.div`
  background: rgba(255, 255, 255, 0.15);
  border-radius: 8px;
  padding: 12px;
  font-size: 14px;
  line-height: 1.6;
  margin-bottom: 12px;

  & > div {
    display: flex;
    justify-content: space-between;
    margin: 4px 0;
  }
`

const DetailLink = styled(Link)`
  color: white;
  text-decoration: underline;
  font-weight: 500;
  font-size: 14px;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.9;
  }
`

const InfoText = styled.p`
  margin: 0;
  font-size: 13px;
  opacity: 0.9;
  line-height: 1.4;
`

interface SweepstakesEntryCounterProps {
  campaignId?: string
}

export function SweepstakesEntryCounter({
  campaignId,
}: SweepstakesEntryCounterProps) {
  const { data, isLoading } = useCampaignEntries(campaignId)

  if (isLoading) {
    return (
      <Container>
        <LoadingSpinner />
      </Container>
    )
  }

  if (!data || !data.entries) {
    return null
  }

  const { entries } = data
  const totalEntries = entries?.total || 0

  return (
    <Container>
      <Header>
        <Trophy size={24} />
        <Title>Sweepstakes Entries Earned</Title>
      </Header>

      <EntryCount>{totalEntries}</EntryCount>

      <Breakdown>
        <div>
          <span>💡 Created Campaign:</span>
          <span>{entries?.campaignCreation || 0}</span>
        </div>
        <div>
          <span>❤️ Donations:</span>
          <span>{entries?.donations || 0}</span>
        </div>
        <div>
          <span>📢 Shares:</span>
          <span>{entries?.shares || 0}</span>
        </div>
      </Breakdown>

      <DetailLink href="/sweepstakes">
        👉 See all your sweepstakes details
      </DetailLink>

      <InfoText>
        Each entry enters you into the monthly drawing for a chance to win cash prizes!
      </InfoText>
    </Container>
  )
}
