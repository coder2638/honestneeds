'use client'

import React, { useState } from 'react'
import styled from 'styled-components'
import { FileText, Shield, AlertTriangle } from 'lucide-react'
import PrayerModerationQueue from '@/components/admin/PrayerModerationQueue'
import SpamDetectionDashboard from '@/components/admin/SpamDetectionDashboard'
import ComplianceReport from '@/components/admin/ComplianceReport'

/**
 * Admin Prayer Management Page
 * Prayer moderation, spam detection, and compliance reporting
 */

const Container = styled.div`
  min-height: 100vh;
  background: #f9fafb;
  padding: 24px;
`

const Wrapper = styled.div`
  max-width: 1400px;
  margin: 0 auto;
`

const PageHeader = styled.div`
  margin-bottom: 32px;
`

const PageTitle = styled.h1`
  font-size: 32px;
  font-weight: 700;
  color: #111827;
  margin: 0 0 8px 0;
`

const PageDescription = styled.p`
  font-size: 14px;
  color: #6b7280;
  margin: 0;
`

const TabContainer = styled.div`
  display: flex;
  gap: 4px;
  margin-bottom: 24px;
  border-bottom: 2px solid #e5e7eb;
  overflow-x: auto;
`

const Tab = styled.button<{ active: boolean }>`
  padding: 12px 16px;
  border: none;
  background: none;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  color: ${(props) => (props.active ? '#3b82f6' : '#6b7280')};
  border-bottom: ${(props) => (props.active ? '3px solid #3b82f6' : 'none')};
  margin-bottom: -2px;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 8px;
  white-space: nowrap;

  &:hover {
    color: ${(props) => (props.active ? '#3b82f6' : '#374151')};
  }
`

const TabIcon = styled.span`
  display: flex;
  align-items: center;
`

const ContentArea = styled.div`
  background: white;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`

const NotificationBanner = styled.div<{ severity: 'info' | 'warning' | 'critical' }>`
  padding: 12px 16px;
  border-radius: 6px;
  margin-bottom: 24px;
  border-left: 4px solid
    ${(props) =>
      props.severity === 'critical'
        ? '#ef4444'
        : props.severity === 'warning'
        ? '#f59e0b'
        : '#3b82f6'};
  background: ${(props) =>
    props.severity === 'critical'
      ? '#fef2f2'
      : props.severity === 'warning'
      ? '#fffbeb'
      : '#eff6ff'};
  color: ${(props) =>
    props.severity === 'critical'
      ? '#7f1d1d'
      : props.severity === 'warning'
      ? '#78350f'
      : '#0c4a6e'};
  font-size: 13px;
  display: flex;
  align-items: center;
  gap: 8px;
`

type TabType = 'moderation' | 'spam' | 'compliance'

export default function AdminPrayerPage() {
  const [activeTab, setActiveTab] = useState<TabType>('moderation')

  const renderContent = () => {
    switch (activeTab) {
      case 'moderation':
        return <PrayerModerationQueue />
      case 'spam':
        return <SpamDetectionDashboard />
      case 'compliance':
        return <ComplianceReport />
      default:
        return null
    }
  }

  return (
    <Container>
      <Wrapper>
        <PageHeader>
          <PageTitle>🙏 Prayer Management</PageTitle>
          <PageDescription>
            Moderate prayers, detect spam patterns, and generate compliance reports
          </PageDescription>
        </PageHeader>

        {/* System Status Banner */}
        <NotificationBanner severity="info">
          ℹ️ All prayer systems operational. Last sync: 2 minutes ago
        </NotificationBanner>

        {/* Tab Navigation */}
        <TabContainer>
          <Tab
            active={activeTab === 'moderation'}
            onClick={() => setActiveTab('moderation')}
          >
            <TabIcon>📋</TabIcon>
            Moderation Queue
          </Tab>

          <Tab
            active={activeTab === 'spam'}
            onClick={() => setActiveTab('spam')}
          >
            <TabIcon>🚨</TabIcon>
            Spam Detection
          </Tab>

          <Tab
            active={activeTab === 'compliance'}
            onClick={() => setActiveTab('compliance')}
          >
            <TabIcon>📊</TabIcon>
            Compliance Report
          </Tab>
        </TabContainer>

        {/* Content Area */}
        <ContentArea>{renderContent()}</ContentArea>

        {/* Footer Information */}
        <div
          style={{
            marginTop: '32px',
            paddingTop: '16px',
            borderTop: '1px solid #e5e7eb',
            fontSize: '12px',
            color: '#9ca3af',
          }}
        >
          <p>
            Prayer moderation system v1.0 | Last updated:{' '}
            {new Date().toLocaleString()} | Version Hash: #ADMIN-PRAYERS-v4.1
          </p>
        </div>
      </Wrapper>
    </Container>
  )
}
