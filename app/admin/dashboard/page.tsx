'use client'

import React, { useState } from 'react'
import styled from 'styled-components'
import { AlertCircle, TrendingUp, DollarSign, CheckCircle, Clock, Zap } from 'lucide-react'
import { useAdminOverview, useActivityFeed, useAdminAlerts } from '@/api/hooks/useAdmin'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import { currencyUtils } from '@/utils/validationSchemas'
import Link from 'next/link'

/**
 * Admin Dashboard
 * Overview of platform metrics and alerts
 */

const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 24px;
  background: #f8fafc;
  min-height: 100vh;
`

const PageHeader = styled.h1`
  font-size: 32px;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 32px 0;
`

const GridLayout = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 24px;
  margin-bottom: 32px;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
`

const StatCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  gap: 12px;
`

const StatIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 20px;

  &.primary {
    background-color: #6366f1;
  }

  &.green {
    background-color: #10b981;
  }

  &.orange {
    background-color: #f59e0b;
  }

  &.red {
    background-color: #ef4444;
  }

  &.blue {
    background-color: #3b82f6;
  }
`

const StatValue = styled.div`
  font-size: 24px;
  font-weight: 700;
  color: #0f172a;
`

const StatLabel = styled.div`
  font-size: 13px;
  color: #64748b;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`

const AlertsSection = styled.div`
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`

const SectionTitle = styled.h2`
  font-size: 18px;
  font-weight: 600;
  color: #0f172a;
  margin: 0 0 16px 0;
  display: flex;
  align-items: center;
  gap: 8px;
`

const AlertItem = styled.div<{ $severity: 'info' | 'warning' | 'error' }>`
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 12px;
  border-left: 4px solid
    ${(props) => {
      switch (props.$severity) {
        case 'error':
          return '#ef4444'
        case 'warning':
          return '#f59e0b'
        case 'info':
          return '#3b82f6'
      }
    }};
  background-color: ${(props) => {
    switch (props.$severity) {
      case 'error':
        return '#fee2e2'
      case 'warning':
        return '#fef3c7'
      case 'info':
        return '#eff6ff'
    }
  }};

  &:last-child {
    margin-bottom: 0;
  }

  a {
    color: #6366f1;
    text-decoration: none;
    font-weight: 600;

    &:hover {
      text-decoration: underline;
    }
  }
`

const AlertMessage = styled.div`
  font-size: 14px;
  color: #1f2937;
  margin-bottom: 4px;
`

const AlertCount = styled.span`
  font-weight: 700;
  color: #0f172a;
`

const ActivityFeedContainer = styled.div`
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`

const ActivityItem = styled.div`
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 12px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: center;

  &:last-child {
    margin-bottom: 0;
  }
`

const ActivityContent = styled.div`
  flex: 1;
`

const ActivityDescription = styled.div`
  font-size: 14px;
  color: #1f2937;
  font-weight: 500;
  margin-bottom: 4px;
`

const ActivityTime = styled.div`
  font-size: 12px;
  color: #6b7280;
`

const ActivityLink = styled(Link)`
  margin-left: 12px;
  padding: 6px 12px;
  background: #6366f1;
  color: white;
  border-radius: 6px;
  text-decoration: none;
  font-size: 12px;
  font-weight: 600;
  transition: background-color 0.2s;

  &:hover {
    background: #4f46e5;
  }
`

const EmptyState = styled.div`
  text-align: center;
  padding: 24px;
  color: #6b7280;
  font-size: 14px;
`

export default function AdminDashboardPage() {
  const { data: overview, isLoading: overviewLoading } = useAdminOverview()
  const { data: activityFeed, isLoading: activityLoading } = useActivityFeed(10)
  const { data: alerts, isLoading: alertsLoading } = useAdminAlerts()

  const isLoading = overviewLoading || activityLoading || alertsLoading

  if (isLoading) {
    return (
      <Container style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <LoadingSpinner />
      </Container>
    )
  }

  const uptime = overview?.platformUptime ?? 99.9

  return (
    <Container>
      <PageHeader>Admin Dashboard</PageHeader>

      {/* Overview Stats */}
      <StatsGrid>
        <StatCard>
          <StatIcon className="primary">
            <TrendingUp size={24} />
          </StatIcon>
          <StatValue>{overview?.activeCampaigns || 0}</StatValue>
          <StatLabel>Active Campaigns</StatLabel>
        </StatCard>
        <StatCard>
          <StatIcon className="green">
            <DollarSign size={24} />
          </StatIcon>
          <StatValue>{currencyUtils.formatCurrency(overview?.monthlyRevenue || 0)}</StatValue>
          <StatLabel>Monthly Revenue</StatLabel>
        </StatCard>
        <StatCard>
          <StatIcon className="orange">
            <Clock size={24} />
          </StatIcon>
          <StatValue>{overview?.pendingTransactions || 0}</StatValue>
          <StatLabel>Pending Transactions</StatLabel>
        </StatCard>
        <StatCard>
          <StatIcon className="red">
            <AlertCircle size={24} />
          </StatIcon>
          <StatValue>{overview?.sweepstakesEntryCount || 0}</StatValue>
          <StatLabel>Sweepstakes Entries</StatLabel>
        </StatCard>
        <StatCard>
          <StatIcon className="blue">
            <CheckCircle size={24} />
          </StatIcon>
          <StatValue>{uptime.toFixed(2)}%</StatValue>
          <StatLabel>Platform Uptime</StatLabel>
        </StatCard>
        <StatCard>
          <StatIcon className="primary">
            <Zap size={24} />
          </StatIcon>
          <StatValue>{currencyUtils.formatCurrency(overview?.totalPendingAmount || 0)}</StatValue>
          <StatLabel>Pending Verification</StatLabel>
        </StatCard>
      </StatsGrid>

      <GridLayout>
        {/* Activity Feed */}
        <ActivityFeedContainer>
          <SectionTitle>Recent Activity</SectionTitle>
          {activityFeed && activityFeed.length > 0 ? (
            activityFeed.map((item) => (
              <ActivityItem key={item.id}>
                <ActivityContent>
                  <ActivityDescription>{item.description}</ActivityDescription>
                  <ActivityTime>{new Date(item.timestamp).toLocaleString()}</ActivityTime>
                </ActivityContent>
                {item.relatedId && (
                  <ActivityLink href={`/admin/${item.relatedType}/${item.relatedId}`}>
                    View
                  </ActivityLink>
                )}
              </ActivityItem>
            ))
          ) : (
            <EmptyState>No recent activity</EmptyState>
          )}
        </ActivityFeedContainer>

        {/* Alerts */}
        <AlertsSection>
          <SectionTitle>Alerts</SectionTitle>
          {alerts && alerts.length > 0 ? (
            alerts.map((alert) => (
              <AlertItem key={alert.id} $severity={alert.severity}>
                <AlertMessage>
                  <AlertCount>{alert.count}</AlertCount> {alert.message}
                  {alert.link && (
                    <>
                      {' - '}
                      <Link href={alert.link} style={{ color: '#6366f1', textDecoration: 'none' }}>
                        View
                      </Link>
                    </>
                  )}
                </AlertMessage>
              </AlertItem>
            ))
          ) : (
            <EmptyState>No active alerts</EmptyState>
          )}
        </AlertsSection>
      </GridLayout>
    </Container>
  )
}
