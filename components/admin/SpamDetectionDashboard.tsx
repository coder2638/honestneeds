'use client'

import React from 'react'
import styled from 'styled-components'
import { AlertTriangle, TrendingUp, Users, Ban } from 'lucide-react'
import { useSpamDetectionData } from '@/api/hooks/useAdminPrayers'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import { Card } from '@/components/Card'

/**
 * Admin Spam Detection Dashboard
 * Real-time spam patterns and high-risk prayers
 */

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const Title = styled.h2`
  font-size: 24px;
  font-weight: 700;
  color: #111827;
  margin: 0;
`

const RefreshTime = styled.span`
  font-size: 12px;
  color: #9ca3af;
`

const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
`

const MetricCard = styled(Card)`
  padding: 20px;
  background: white;
  border: 1px solid #e5e7eb;
  display: flex;
  align-items: flex-start;
  gap: 16px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: #3b82f6;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07);
  }
`

const IconWrapper = styled.div<{ color?: string }>`
  width: 48px;
  height: 48px;
  border-radius: 8px;
  background: ${(props) => props.color || '#f3f4f6'};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  svg {
    color: ${(props) =>
      props.color === '#fee2e2'
        ? '#991b1b'
        : props.color === '#fef3c7'
        ? '#92400e'
        : props.color === '#dbeafe'
        ? '#0c4a6e'
        : '#374151'};
  }
`

const MetricContent = styled.div`
  flex: 1;
`

const MetricLabel = styled.div`
  font-size: 12px;
  color: #6b7280;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`

const MetricValue = styled.div`
  font-size: 28px;
  font-weight: 700;
  color: #111827;
  margin-top: 4px;
`

const MetricChange = styled.div<{ positive?: boolean }>`
  font-size: 12px;
  color: ${(props) => (props.positive ? '#059669' : '#dc2626')};
  margin-top: 4px;
`

const SectionTitle = styled.h3`
  font-size: 18px;
  font-weight: 700;
  color: #111827;
  margin: 20px 0 12px 0;
`

const ListContainer = styled.div`
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  overflow: hidden;
`

const ListItem = styled.div`
  padding: 12px 16px;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: #f9fafb;
  }
`

const ItemLabel = styled.div`
  color: #374151;
  flex: 1;
`

const ItemCount = styled.div`
  background: #fee2e2;
  color: #991b1b;
  padding: 4px 8px;
  border-radius: 4px;
  font-weight: 600;
  font-size: 12px;
`

const Pattern = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid #e5e7eb;

  &:last-child {
    border-bottom: none;
  }
`

const PatternName = styled.div`
  font-size: 13px;
  color: #374151;
  flex: 1;
`

const PatternBars = styled.div`
  display: flex;
  gap: 6px;
  align-items: flex-end;
  height: 30px;
`

const PatternBar = styled.div<{ height: number }>`
  width: 6px;
  height: ${(props) => props.height}px;
  background: linear-gradient(180deg, #3b82f6 0%, #1e40af 100%);
  border-radius: 3px;
`

const HighRiskList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

const HighRiskItem = styled.div`
  padding: 12px;
  background: #fef3c7;
  border: 1px solid #fcd34d;
  border-radius: 6px;
  font-size: 12px;

  strong {
    color: #92400e;
    display: block;
    margin-bottom: 4px;
  }

  p {
    color: #78350f;
    margin: 0;
  }
`

const EmptyState = styled.div`
  padding: 32px;
  text-align: center;
  color: #9ca3af;
  font-size: 14px;
`

export default function SpamDetectionDashboard() {
  const { data: spamData, isLoading, error } = useSpamDetectionData()

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (error) {
    return (
      <EmptyState>
        <p>Failed to load spam detection data</p>
      </EmptyState>
    )
  }

  const stats = spamData?.stats || {}
  const topSpammers = spamData?.topSpammers || []
  const flagReasons = spamData?.flagReasons || {}
  const patterns = spamData?.patterns || {}

  return (
    <Container>
      <Header>
        <div>
          <Title>🚨 Spam Detection Dashboard</Title>
        </div>
        <RefreshTime>Last updated: {new Date().toLocaleTimeString()}</RefreshTime>
      </Header>

      {/* Metrics Grid */}
      <MetricsGrid>
        <MetricCard>
          <IconWrapper color="#fee2e2">
            <AlertTriangle size={24} />
          </IconWrapper>
          <MetricContent>
            <MetricLabel>High-Risk Prayers</MetricLabel>
            <MetricValue>{stats.highRiskCount || 0}</MetricValue>
            <MetricChange positive={stats.highRiskTrend === 'down'}>
              {stats.highRiskTrend === 'up' ? '↑' : '↓'} vs last 24h
            </MetricChange>
          </MetricContent>
        </MetricCard>

        <MetricCard>
          <IconWrapper color="#fee2e2">
            <Ban size={24} />
          </IconWrapper>
          <MetricContent>
            <MetricLabel>Active Violations</MetricLabel>
            <MetricValue>{stats.activeViolations || 0}</MetricValue>
            <MetricChange positive={false}>
              {stats.newViolations || 0} new today
            </MetricChange>
          </MetricContent>
        </MetricCard>

        <MetricCard>
          <IconWrapper color="#fef3c7">
            <TrendingUp size={24} />
          </IconWrapper>
          <MetricContent>
            <MetricLabel>Flagged Today</MetricLabel>
            <MetricValue>{stats.flaggedToday || 0}</MetricValue>
            <MetricChange>
              {stats.approvalRate || 0}% auto-approved
            </MetricChange>
          </MetricContent>
        </MetricCard>

        <MetricCard>
          <IconWrapper color="#dbeafe">
            <Users size={24} />
          </IconWrapper>
          <MetricContent>
            <MetricLabel>At-Risk Users</MetricLabel>
            <MetricValue>{stats.atRiskUsers || 0}</MetricValue>
            <MetricChange>
              {stats.blockedToday || 0} blocked today
            </MetricChange>
          </MetricContent>
        </MetricCard>
      </MetricsGrid>

      {/* Top Spammers */}
      <div>
        <SectionTitle>👤 Top Spammers (Last 30 Days)</SectionTitle>
        <ListContainer>
          {topSpammers.length === 0 ? (
            <EmptyState>No spam patterns detected</EmptyState>
          ) : (
            topSpammers.map((spammer: any, idx: number) => (
              <ListItem key={idx}>
                <ItemLabel>
                  {spammer.name || 'Anonymous'} (ID: {spammer.userId})
                </ItemLabel>
                <ItemCount>{spammer.flagCount}</ItemCount>
              </ListItem>
            ))
          )}
        </ListContainer>
      </div>

      {/* Flag Reasons Breakdown */}
      <div>
        <SectionTitle>📊 Flag Reasons Distribution</SectionTitle>
        <ListContainer>
          {Object.entries(flagReasons).length === 0 ? (
            <EmptyState>No flag data available</EmptyState>
          ) : (
            Object.entries(flagReasons).map(([reason, count]: [string, any]) => (
              <ListItem key={reason}>
                <ItemLabel>{reason}</ItemLabel>
                <ItemCount>{count}</ItemCount>
              </ListItem>
            ))
          )}
        </ListContainer>
      </div>

      {/* Spam Patterns */}
      <div>
        <SectionTitle>📈 Detected Spam Patterns</SectionTitle>
        <ListContainer>
          {Object.keys(patterns).length === 0 ? (
            <EmptyState>No patterns detected</EmptyState>
          ) : (
            Object.entries(patterns).map(([pattern, count]: [string, any]) => {
              const maxCount = Math.max(
                ...Object.values(patterns).map((v: any) => v)
              )
              const height = ((count as number) / maxCount) * 30
              return (
                <Pattern key={pattern}>
                  <PatternName>{pattern}</PatternName>
                  <PatternBars>
                    {Array.from({ length: 7 }).map((_, i) => (
                      <PatternBar
                        key={i}
                        height={Math.random() * 30}
                      />
                    ))}
                  </PatternBars>
                  <div style={{ marginLeft: '16px', fontWeight: 600 }}>
                    {count}
                  </div>
                </Pattern>
              )
            })
          )}
        </ListContainer>
      </div>
    </Container>
  )
}
