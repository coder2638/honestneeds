/**
 * SharerRewardsDashboard.tsx
 * Complete rewards dashboard page component
 * Integrates all reward components together
 */

'use client'

import React, { useState } from 'react'
import styled from 'styled-components'
import { SharerRewardsOverview } from '@/components/share/SharerRewardsOverview'
import { PendingRewardsList } from '@/components/share/PendingRewardsList'
import { VerifiedRewardsList } from '@/components/share/VerifiedRewardsList'
import { SharerPayoutRequestForm } from '@/components/share/SharerPayoutRequestForm'
import { Modal } from '@/components/Modal'

const DashboardContainer = styled.div`
  min-height: 100vh;
  background-color: #f8fafc;
  padding: 2rem 1rem;

  @media (max-width: 640px) {
    padding: 1rem;
  }
`

const ContentWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`

const PageHeader = styled.div`
  margin-bottom: 2.5rem;
`

const PageTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 0.5rem 0;

  @media (max-width: 640px) {
    font-size: 1.5rem;
  }
`

const PageDescription = styled.p`
  color: #64748b;
  margin: 0;
  font-size: 1rem;
`

const TabContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  border-bottom: 2px solid #e2e8f0;
  flex-wrap: wrap;

  @media (max-width: 640px) {
    margin-bottom: 1rem;
  }
`

const Tab = styled.button<{ $active: boolean }>`
  background: none;
  border: none;
  padding: 1rem 1.5rem;
  color: ${ props => props.$active ? '#6366f1' : '#64748b'};
  font-weight: ${props => (props.$active ? 600 : 500)};
  font-size: 1rem;
  cursor: pointer;
  border-bottom: 2px solid ${props => (props.$active ? '#6366f1' : 'transparent')};
  margin-bottom: -2px;
  transition: all 0.2s ease;

  &:hover {
    color: #0f172a;
  }

  @media (max-width: 640px) {
    padding: 0.75rem 1rem;
    font-size: 0.9rem;
  }
`

const TabContent = styled.div`
  animation: fadeIn 0.2s ease-in;

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`

interface SharerRewardsDashboardProps {
  showPayoutForm?: boolean
}

export const SharerRewardsDashboard: React.FC<SharerRewardsDashboardProps> = ({
  showPayoutForm = false,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'pending' | 'verified' | 'payout'>(
    showPayoutForm ? 'payout' : 'overview'
  )
  const [showPayoutModal, setShowPayoutModal] = useState(showPayoutForm)

  const handleRequestPayout = () => {
    setActiveTab('payout')
    setShowPayoutModal(true)
  }

  const handleClosePayoutForm = () => {
    setShowPayoutModal(false)
    setActiveTab('overview')
  }

  return (
    <DashboardContainer>
      <ContentWrapper>
        <PageHeader>
          <PageTitle>💰 Your Rewards</PageTitle>
          <PageDescription>Track your earnings, pending rewards, and manage payouts</PageDescription>
        </PageHeader>

        {/* Overview Summary */}
        <SharerRewardsOverview
          onRequestPayout={handleRequestPayout}
          onViewDetails={() => setActiveTab('verified')}
        />

        {/* Tab Navigation */}
        <TabContainer>
          <Tab
            $active={activeTab === 'pending'}
            onClick={() => setActiveTab('pending')}
          >
            ⏳ Pending ({' '}{ '30-Day Hold'})
          </Tab>
          <Tab
            $active={activeTab === 'verified'}
            onClick={() => setActiveTab('verified')}
          >
            ✓ Ready to Withdraw
          </Tab>
          <Tab
            $active={activeTab === 'payout'}
            onClick={() => setActiveTab('payout')}
          >
            💳 Request Payout
          </Tab>
        </TabContainer>

        {/* Tab Content */}
        <TabContent>
          {activeTab === 'pending' && <PendingRewardsList limit={20} />}

          {activeTab === 'verified' && (
            <VerifiedRewardsList limit={20} onRequestPayout={handleRequestPayout} />
          )}

          {activeTab === 'payout' && (
            <SharerPayoutRequestForm
              onSuccess={handleClosePayoutForm}
              onCancel={handleClosePayoutForm}
            />
          )}
        </TabContent>
      </ContentWrapper>

      {/* Payout Modal (Alternative) */}
      {showPayoutModal && activeTab !== 'payout' && (
        <Modal onClose={() => setShowPayoutModal(false)}>
          <SharerPayoutRequestForm
            onSuccess={handleClosePayoutForm}
            onCancel={handleClosePayoutForm}
          />
        </Modal>
      )}
    </DashboardContainer>
  )
}
