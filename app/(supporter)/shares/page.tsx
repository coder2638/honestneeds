'use client'

import styled from 'styled-components'
import { useState } from 'react'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { ShareList } from '@/components/donation/ShareList'
import { useMyShareAnalytics } from '@/api/hooks/useMyShareAnalytics'
import { useSharerEarnings } from '@/api/hooks/useSharerEarnings'
import { MySharAnalyticsDashboard } from '@/components/campaign/MySharAnalyticsDashboard'
import { SupporterConversionAnalytics } from '@/components/share/ConversionAnalyticsDashboard'
import { WithdrawalRequestModal } from '@/components/wallet/WithdrawalRequestModal'
import { Card } from '@/components/Card'

const PageContainer = styled.div`
  min-height: 100vh;
  background-color: #f8fafc;
  padding: 2rem 1rem;
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

const FilterContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  align-items: center;

  @media (max-width: 640px) {
    flex-direction: column;
    gap: 0.75rem;
  }
`

const ReloadButton = styled.button`
  padding: 0.625rem 1.25rem;
  background-color: #6366f1;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: #4f46e5;
  }

  &:disabled {
    background-color: #cbd5e1;
    cursor: not-allowed;
  }

  &:active {
    transform: scale(0.98);
  }

  @media (max-width: 640px) {
    width: 100%;
  }
`

const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`

const StatCard = styled.div`
  background-color: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`

const StatLabel = styled.span`
  font-size: 0.85rem;
  font-weight: 600;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`

const StatValue = styled.span`
  font-size: 1.75rem;
  font-weight: 700;
  color: #0f172a;
`

const StatSubtext = styled.span`
  font-size: 0.8rem;
  color: #94a3b8;
  margin-top: 0.25rem;
`

const ChannelStatsContainer = styled.div`
  background-color: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 2rem;
`

const ChannelStatsTitle = styled.h3`
  font-size: 1rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 1rem 0;
`

const ChannelGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;

  @media (max-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
  }
`

const ChannelStat = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1rem;
  background-color: #f8fafc;
  border-radius: 6px;
  border: 1px solid #e2e8f0;
`

const ChannelLabel = styled.span`
  font-size: 0.8rem;
  font-weight: 600;
  color: #64748b;
  text-transform: uppercase;
`

const ChannelCount = styled.span`
  font-size: 1.5rem;
  font-weight: 700;
  color: #0f172a;
`

function SharesPageContent() {
  const [currentPage, setCurrentPage] = useState(1)
  const [showWithdrawalModal, setShowWithdrawalModal] = useState(false)

  const { 
    shares, 
    performance, 
    isLoading, 
    error 
  } = useMyShareAnalytics(currentPage, 25)

  const { data: earnings, isLoading: earningsLoading, error: earningsError } = useSharerEarnings()

  // Debug logging
  console.log('[SharesPage] Earnings data:', earnings)
  console.log('[SharesPage] Earnings loading:', earningsLoading)
  console.log('[SharesPage] Earnings error:', earningsError)

  const totalPages = shares?.pagination?.totalPages || 1

  return (
    <PageContainer>
      <ContentWrapper>
        <PageHeader>
          <PageTitle>My Shares</PageTitle>
          <PageDescription>
            Track all the campaigns you've shared and your referral impact
          </PageDescription>
        </PageHeader>

        {/* Earnings & Withdrawal Card */}
        <div
          style={{
            background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
            borderRadius: '12px',
            padding: '2rem',
            marginBottom: '2rem',
            color: 'white',
            boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '2rem',
            }}
          >
            <div>
              <p style={{ margin: '0 0 0.5rem 0', opacity: 0.9, fontSize: '0.9rem' }}>
                Available Balance
              </p>
              <h2 style={{ margin: 0, fontSize: '2.5rem', fontWeight: 'bold' }}>
                {earningsLoading ? '⏳ Loading...' : `$${earnings?.available_cents ? (earnings.available_cents / 100).toFixed(2) : '0.00'}`}
              </h2>
              {earningsError && <p style={{ fontSize: '0.85rem', color: '#fee2e2' }}>Error loading balance</p>}
            </div>
            <button
              onClick={() => setShowWithdrawalModal(true)}
              style={{
                backgroundColor: 'white',
                color: '#6366f1',
                border: 'none',
                padding: '0.75rem 2rem',
                borderRadius: '8px',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              Request Withdrawal
            </button>
          </div>
        </div>

        {/* Conversion Analytics Dashboard */}
        <SupporterConversionAnalytics />

        {/* Legacy Analytics Dashboard (Optional) */}
        {/* Uncomment to show alongside new conversion metrics */}
        {/* 
        <MySharAnalyticsDashboard
          shares={shares?.shares}
          performance={performance}
          isLoading={isLoading}
        />
        */}

        {/* Error Message */}
        {error && (
          <div
            style={{
              backgroundColor: '#fee2e2',
              color: '#7f1d1d',
              padding: '1rem',
              borderRadius: '8px',
              marginBottom: '1.5rem',
            }}
          >
            Failed to load shares. Please try again later.
          </div>
        )}

        {/* Share List */}
        <ShareList
          shares={shares?.shares || []}
          isLoading={isLoading}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />

        {/* Withdrawal Modal */}
        {showWithdrawalModal && (
          <WithdrawalRequestModal
            availableBalance={earnings?.available_cents || 0}
            onClose={() => setShowWithdrawalModal(false)}
            onSuccess={() => setShowWithdrawalModal(false)}
          />
        )}
      </ContentWrapper>
    </PageContainer>
  )
}

export default function SharesPage() {
  return (
    <ProtectedRoute allowedRoles={['supporter', 'creator', 'admin']}>
      <SharesPageContent />
    </ProtectedRoute>
  )
}
