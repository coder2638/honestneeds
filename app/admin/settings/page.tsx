'use client'

import React, { useState } from 'react'
import styled from 'styled-components'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { EditablePlatformSettings } from '@/components/admin/EditablePlatformSettings'
import { CategoryManager } from '@/components/admin/CategoryManager'
import { Card } from '@/components/Card'

/**
 * Admin Settings Page (Phase 5)
 * Manage platform settings, categories, and content - fully editable
 */

const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 24px;
  background: #f8fafc;
  min-height: 100vh;
`

const PageHeader = styled.div`
  margin-bottom: 32px;

  h1 {
    font-size: 32px;
    font-weight: 700;
    color: #0f172a;
    margin: 0 0 8px 0;
  }

  p {
    color: #64748b;
    margin: 0;
  }
`

const TabContainer = styled.div`
  display: flex;
  gap: 0;
  margin-bottom: 32px;
  border-bottom: 2px solid #e2e8f0;
  overflow-x: auto;

  -webkit-overflow-scrolling: touch;

  &::-webkit-scrollbar {
    height: 4px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 2px;
  }
`

const Tab = styled.button<{ $active: boolean }>`
  padding: 16px 24px;
  background: none;
  border: none;
  font-size: 16px;
  font-weight: 600;
  color: ${(props) => (props.$active ? '#0f172a' : '#64748b')};
  cursor: pointer;
  border-bottom: 3px solid ${(props) => (props.$active ? '#6366f1' : 'transparent')};
  white-space: nowrap;
  transition: all 0.2s ease;

  &:hover {
    color: ${(props) => (props.$active ? '#0f172a' : '#475569')};
  }
`

const TabContent = styled.div`
  animation: fadeIn 0.2s ease-in-out;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`

const InfoCard = styled(Card)`
  padding: 16px;
  background: #f0f9ff;
  border-left: 4px solid #0ea5e9;
  margin-bottom: 24px;

  p {
    margin: 0;
    color: #0c4a6e;
    font-size: 14px;
    line-height: 1.6;
  }
`

type TabType = 'platform' | 'categories'

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState<TabType>('platform')

  const tabs: Array<{ id: TabType; label: string; icon: string }> = [
    { id: 'platform', label: 'Platform Settings', icon: '⚙️' },
    { id: 'categories', label: 'Categories', icon: '📚' },
  ]

  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <Container>
        <PageHeader>
          <h1>🛠️ Admin Settings</h1>
          <p>Configure platform settings, categories, and content</p>
        </PageHeader>

        {/* Info Card */}
        <InfoCard>
          <p>
            💡 All changes are saved immediately and logged for audit purposes. Changes to fees and limits apply to new campaigns and transactions.
          </p>
        </InfoCard>

        {/* Tabs */}
        <TabContainer>
          {tabs.map((tab) => (
            <Tab
              key={tab.id}
              $active={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.icon} {tab.label}
            </Tab>
          ))}
        </TabContainer>

        {/* Tab Content */}
        <TabContent>
          {activeTab === 'platform' && <EditablePlatformSettings />}
          {activeTab === 'categories' && <CategoryManager />}
        </TabContent>
      </Container>
    </ProtectedRoute>
  )
}
