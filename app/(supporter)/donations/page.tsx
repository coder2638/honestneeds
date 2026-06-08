'use client'

import styled from 'styled-components'
import { useState, useEffect } from 'react'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { DonationList } from '@/components/donation/DonationList'
import { DonationDetailModal } from '@/components/donation/DonationDetailModal'
import { useDonations } from '@/api/hooks/useDonations'

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

const StatusFilter = styled.select`
  padding: 0.625rem 1rem;
  border-radius: 6px;
  border: 1px solid #e2e8f0;
  background-color: white;
  color: #0f172a;
  font-weight: 500;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: #cbd5e1;
  }

  &:focus {
    outline: none;
    border-color: #6366f1;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
  }

  @media (max-width: 640px) {
    width: 100%;
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

type StatusFilter = 'all' | 'pending' | 'verified' | 'rejected'

function DonationHistoryContent() {
  const [currentPage, setCurrentPage] = useState(1)
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [selectedTransactionId, setSelectedTransactionId] = useState<string | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [reloading, setReloading] = useState(false)

  const { data, isLoading, refetch, error } = useDonations(currentPage, 25)

  useEffect(() => {
    // Auto-refetch every 30 seconds to check for status updates
    const interval = setInterval(() => {
      refetch()
    }, 30000)

    return () => clearInterval(interval)
  }, [refetch])

  const donations = data?.donations || []
  const total = data?.total || 0
  const totalPages = Math.ceil(total / 25)

  // Filter donations by status
  const filteredDonations =
    statusFilter === 'all'
      ? donations
      : donations.filter(d => d.status === statusFilter)

  const stats = {
    totalDonations: total,
    totalAmount: donations.reduce((sum, d) => sum + d.amount, 0) / 100,
    verified: donations.filter(d => d.status === 'verified').length,
    pending: donations.filter(d => d.status === 'pending').length,
  }

  const handleViewDetails = (transactionId: string) => {
    setSelectedTransactionId(transactionId)
    setIsDetailOpen(true)
  }

  const handleReload = async () => {
    setReloading(true)
    try {
      await refetch()
    } finally {
      setReloading(false)
    }
  }

  return (
    <PageContainer>
      <ContentWrapper>
        <PageHeader>
          <PageTitle>Donation History</PageTitle>
          <PageDescription>
            Track all your donations and their verification status
          </PageDescription>
        </PageHeader>

        {/* Stats Section */}
        {total > 0 && (
          <StatsContainer>
            <StatCard>
              <StatLabel>Total Donations</StatLabel>
              <StatValue>{stats.totalDonations}</StatValue>
              <StatSubtext>All time</StatSubtext>
            </StatCard>
            <StatCard>
              <StatLabel>Total Amount</StatLabel>
              <StatValue>${stats.totalAmount.toFixed(2)}</StatValue>
              <StatSubtext>Across all campaigns</StatSubtext>
            </StatCard>
            <StatCard>
              <StatLabel>Verified</StatLabel>
              <StatValue>{stats.verified}</StatValue>
              <StatSubtext>{stats.verified === 1 ? 'donation' : 'donations'}</StatSubtext>
            </StatCard>
            <StatCard>
              <StatLabel>Pending Review</StatLabel>
              <StatValue>{stats.pending}</StatValue>
              <StatSubtext>Awaiting approval</StatSubtext>
            </StatCard>
          </StatsContainer>
        )}

        {/* Filters */}
        <FilterContainer>
          <StatusFilter
            value={statusFilter}
            onChange={e => {
              setStatusFilter(e.target.value as StatusFilter)
              setCurrentPage(1)
            }}
          >
            <option value="all">All Donations</option>
            <option value="pending">Pending Review</option>
            <option value="verified">Verified</option>
            <option value="rejected">Rejected</option>
          </StatusFilter>

          <ReloadButton onClick={handleReload} disabled={reloading}>
            {reloading ? 'Refreshing...' : 'Refresh'}
          </ReloadButton>
        </FilterContainer>

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
            Failed to load donations. Please try again later.
          </div>
        )}

        {/* Donation List */}
        <DonationList
          donations={filteredDonations}
          isLoading={isLoading}
          onViewDetails={handleViewDetails}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </ContentWrapper>

      {/* Detail Modal */}
      <DonationDetailModal
        transactionId={selectedTransactionId}
        isOpen={isDetailOpen}
        onClose={() => {
          setIsDetailOpen(false)
          setSelectedTransactionId(null)
        }}
      />
    </PageContainer>
  )
}

export default function DonationHistoryPage() {
  return (
    <ProtectedRoute allowedRoles={['supporter', 'creator', 'admin']}>
      <DonationHistoryContent />
    </ProtectedRoute>
  )
}
