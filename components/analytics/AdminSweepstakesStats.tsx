'use client'

import React from 'react'
import styled from 'styled-components'
import { TrendingUp, Users, Trophy } from 'lucide-react'
import { useAdminStats } from '@/api/hooks/useSweepstakes'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import { Badge } from '@/components/Badge'
import { currencyUtils } from '@/utils/validationSchemas'

/**
 * Admin Sweepstakes Stats
 * Dashboard showing sweepstakes statistics for admin
 */

const Container = styled.div`
  background: white;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  overflow: hidden;
`

const Header = styled.div`
  background: linear-gradient(135deg, #f59e0b 0%, #f97316 100%);
  color: white;
  padding: 20px;
`

const Title = styled.h3`
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 8px 0;
`

const Subtitle = styled.p`
  font-size: 13px;
  opacity: 0.9;
  margin: 0;
`

const Content = styled.div`
  padding: 24px;
`

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 24px;
`

const StatCard = styled.div`
  display: flex;
  gap: 12px;
  padding: 16px;
  background: #f9fafb;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
`

const StatIcon = styled.div<{ $bgColor?: string }>`
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background-color: ${(props) => props.$bgColor || '#3b82f6'};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
`

const StatContent = styled.div`
  flex: 1;
`

const StatLabel = styled.p`
  font-size: 12px;
  font-weight: 500;
  color: #6b7280;
  text-transform: uppercase;
  margin: 0 0 4px 0;
`

const StatValue = styled.p`
  font-size: 24px;
  font-weight: 700;
  color: #111827;
  margin: 0;
`

const Section = styled.div`
  margin-bottom: 24px;
`

const SectionTitle = styled.h4`
  font-size: 14px;
  font-weight: 600;
  color: #111827;
  margin: 0 0 12px 0;
  text-transform: uppercase;
  display: flex;
  align-items: center;
  gap: 8px;
`

const DisplayItem = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid #e5e7eb;
  font-size: 14px;

  &:last-child {
    border-bottom: none;
  }
`

const Name = styled.span`
  color: #111827;
  font-weight: 500;
`

const Value = styled.span`
  color: #6b7280;
`

export function AdminSweepstakesStats() {
  const { data, isLoading } = useAdminStats()

  if (isLoading) {
    return (
      <Container>
        <Header>
          <Title>🎰 Sweepstakes Statistics</Title>
        </Header>
        <Content>
          <LoadingSpinner />
        </Content>
      </Container>
    )
  }

  if (!data) {
    return null
  }

  const { currentDrawing, upcomingDrawings, totalEarnings } = data

  const daysUntilDrawing = currentDrawing
    ? Math.ceil(
        (new Date(currentDrawing.targetDate).getTime() - new Date().getTime()) /
          (1000 * 60 * 60 * 24)
      )
    : 0

  return (
    <Container>
      <Header>
        <Title>🎰 Sweepstakes Statistics</Title>
        <Subtitle>Current drawing and entry distribution</Subtitle>
      </Header>

      <Content>
        {/* Main Stats Grid */}
        <Grid>
          <StatCard>
            <StatIcon $bgColor="#3b82f6">
              <Trophy size={20} />
            </StatIcon>
            <StatContent>
              <StatLabel>Current Entries</StatLabel>
              <StatValue>{currentDrawing.currentEntries}</StatValue>
            </StatContent>
          </StatCard>

          <StatCard>
            <StatIcon $bgColor="#f59e0b">
              <TrendingUp size={20} />
            </StatIcon>
            <StatContent>
              <StatLabel>Days to Drawing</StatLabel>
              <StatValue>{Math.max(0, daysUntilDrawing)}</StatValue>
            </StatContent>
          </StatCard>

          <StatCard>
            <StatIcon $bgColor="#10b981">
              <Users size={20} />
            </StatIcon>
            <StatContent>
              <StatLabel>Total Earnings</StatLabel>
              <StatValue>{currencyUtils.formatCurrency(totalEarnings * 100)}</StatValue>
            </StatContent>
          </StatCard>
        </Grid>

        {/* Current Drawing Section */}
        <Section>
          <SectionTitle>📅 Current Drawing</SectionTitle>
          <DisplayItem>
            <Name>Target Date:</Name>
            <Value>{new Date(currentDrawing.targetDate).toLocaleDateString()}</Value>
          </DisplayItem>
          <DisplayItem>
            <Name>Entry Count:</Name>
            <Value>{currentDrawing.currentEntries}</Value>
          </DisplayItem>
          <DisplayItem>
            <Name>Status:</Name>
            <Value>
              <Badge variant="success" size="sm">
                Active
              </Badge>
            </Value>
          </DisplayItem>
        </Section>

        {/* Top Participants Section */}
        {currentDrawing.topParticipants.length > 0 && (
          <Section>
            <SectionTitle>🏆 Top Participants (Anonymized)</SectionTitle>
            {currentDrawing.topParticipants.slice(0, 5).map((participant, index) => (
              <DisplayItem key={index}>
                <Name>
                  {index === 0 && '🥇'} {index === 1 && '🥈'} {index === 2 && '🥉'}{' '}
                  {participant.name}
                </Name>
                <Value>{participant.entryCount} entries</Value>
              </DisplayItem>
            ))}
          </Section>
        )}

        {/* Upcoming Drawings Section */}
        {upcomingDrawings.length > 0 && (
          <Section>
            <SectionTitle>📋 Upcoming Drawings</SectionTitle>
            {upcomingDrawings.slice(0, 3).map((drawing) => (
              <DisplayItem key={drawing.id}>
                <Name>{new Date(drawing.targetDate).toLocaleDateString()}</Name>
                <Value>
                  {drawing.currentEntries} entries · Prize:{' '}
                  {currencyUtils.formatCurrency(drawing.prize)}
                </Value>
              </DisplayItem>
            ))}
          </Section>
        )}
      </Content>
    </Container>
  )
}
