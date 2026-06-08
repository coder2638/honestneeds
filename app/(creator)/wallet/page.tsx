/**
 * Wallet Page
 * Main wallet dashboard page for both creators and supporters
 */

'use client'

import React, { useState } from 'react'
import styled from 'styled-components'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/Tabs'
import { PageContainer } from '@/components/PageContainer'
import PageHeader from '@/components/PageHeader'
import WalletDashboard from '@/components/wallet/WalletDashboard'
import TransactionHistory from '@/components/wallet/TransactionHistory'
import PayoutScheduleManager from '@/components/wallet/PayoutScheduleManager'
import WalletSettings from '@/components/wallet/WalletSettings'
import ErrorBoundary from '@/components/ErrorBoundary'

const TabsContainer = styled.div`
  margin-top: 2rem;
`

const TabContent = styled.div`
  padding: 2rem 0;
  background: white;
  border-radius: 12px;
  animation: fadeIn 0.3s ease-in;

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

const BreadcrumbNav = styled.nav`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  font-size: 0.9375rem;
`

const BreadcrumbLink = styled.a`
  color: #667eea;
  text-decoration: none;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`

const BreadcrumbSeparator = styled.span`
  color: #cbd5e1;
  margin: 0 0.5rem;
`

const BreadcrumbCurrent = styled.span`
  color: #0f172a;
  font-weight: 500;
`

/**
 * Wallet Page Component
 */
export default function WalletPage() {
  const [activeTab, setActiveTab] = useState('overview')

  return (
    <PageContainer>
      {/* Breadcrumb Navigation */}
      <BreadcrumbNav>
        <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
        <BreadcrumbSeparator>/</BreadcrumbSeparator>
        <BreadcrumbCurrent>Wallet</BreadcrumbCurrent>
      </BreadcrumbNav>

      {/* Page Header */}
      <PageHeader
        title="Wallet"
        description="Manage your earnings, track payouts, and configure payment methods"
      />

      {/* Tabbed Interface */}
      <TabsContainer>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="payouts">Payout Schedule</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabContent>
            <TabsContent value="overview">
              <ErrorBoundary fallback="Failed to load wallet overview">
                <WalletDashboard />
              </ErrorBoundary>
            </TabsContent>
          </TabContent>

          {/* Transactions Tab */}
          <TabContent>
            <TabsContent value="transactions">
              <ErrorBoundary fallback="Failed to load transaction history">
                <TransactionHistory />
              </ErrorBoundary>
            </TabsContent>
          </TabContent>

          {/* Payout Schedule Tab */}
          <TabContent>
            <TabsContent value="payouts">
              <ErrorBoundary fallback="Failed to load payout schedule">
                <PayoutScheduleManager />
              </ErrorBoundary>
            </TabsContent>
          </TabContent>

          {/* Settings Tab */}
          <TabContent>
            <TabsContent value="settings">
              <ErrorBoundary fallback="Failed to load wallet settings">
                <WalletSettings />
              </ErrorBoundary>
            </TabsContent>
          </TabContent>
        </Tabs>
      </TabsContainer>
    </PageContainer>
  )
}
