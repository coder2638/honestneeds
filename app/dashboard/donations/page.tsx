'use client'

import { useState, useEffect, useCallback } from 'react'
import styled from 'styled-components'
import { Calendar, TrendingUp, Filter, AlertCircle, RefreshCw } from 'lucide-react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { donationService } from '@/api/services/donationService'

type DonationStatus = 'all' | 'pending' | 'verified' | 'failed'

interface Donation {
  id: string
  transaction_id: string
  campaign_name: string
  donor_name: string
  amount_total_cents: number
  amount_creator_cents: number
  amount_platform_fee_cents: number
  payment_method: string
  status: 'pending' | 'verified' | 'failed'
  created_at: string
  verified_at?: string
}

interface DonationsSummary {
  total_raised_cents: number
  total_creator_cents: number
  verified_cents: number
  pending_cents: number
  count: number
  avg_donation_cents: number
}

interface DonationsResponse {
  donations: Donation[]
  pagination: {
    total: number
    page: number
    limit: number
    pages: number
  }
  summary: DonationsSummary
}

// ============================================================
// STYLED COMPONENTS
// ============================================================

const Container = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
`

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
  }
`

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0;

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`

const HeaderActions = styled.div`
  display: flex;
  gap: 1rem;

  @media (max-width: 768px) {
    width: 100%;
    flex-direction: column;
  }
`

const RefreshButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background-color: #ecf0ff;
  color: #6366f1;
  border: 1px solid #c7d2fe;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: #e0e7ff;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`

const SummaryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`

const SummaryCard = styled.div`
  background-color: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 0.75rem;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`

const SummaryLabel = styled.span`
  font-size: 0.875rem;
  color: #64748b;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`

const SummaryValue = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: #0f172a;
`

const SummarySubtext = styled.span`
  font-size: 0.8125rem;
  color: #94a3b8;
`

const FilterBar = styled.div`
  display: flex;
  gap: 1.5rem;
  align-items: center;
  padding: 1.5rem;
  background-color: white;
  border: 1px solid #e2e8f0;
  border-radius: 0.75rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  flex: 1;
  min-width: 200px;
`

const FilterLabel = styled.label`
  font-size: 0.875rem;
  font-weight: 600;
  color: #0f172a;
`

const FilterSelect = styled.select`
  padding: 0.625rem 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  font-size: 0.95rem;
  background-color: white;
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
`

const TableContainer = styled.div`
  background-color: white;
  border: 1px solid #e2e8f0;
  border-radius: 0.75rem;
  overflow-x: auto;
`

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 0.95rem;
`

const TableHead = styled.thead`
  background-color: #f1f5f9;
  border-bottom: 2px solid #e2e8f0;
`

const TableHeaderCell = styled.th`
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  color: #0f172a;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`

const TableBody = styled.tbody`
  & > tr {
    border-bottom: 1px solid #e2e8f0;
    transition: background-color 0.2s ease;

    &:hover {
      background-color: #f8fafc;
    }

    &:last-child {
      border-bottom: none;
    }
  }
`

const TableRow = styled.tr`
  &.status-pending {
    background-color: #fffbeb;
  }

  &.status-verified {
    background-color: #f0fdf4;
  }

  &.status-failed {
    background-color: #fef2f2;
  }
`

const TableCell = styled.td`
  padding: 1rem;
  color: #475569;
`

const DateCell = styled(TableCell)`
  font-size: 0.875rem;
  color: #64748b;
`

const CampaignCell = styled(TableCell)`
  font-weight: 600;
  color: #0f172a;
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

const DonorCell = styled(TableCell)`
  font-weight: 500;
  color: #0f172a;
`

const AmountCell = styled(TableCell)`
  font-weight: 600;
  color: #0f172a;
`

const SplitBreakdown = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  font-size: 0.8125rem;
`

const SplitRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0.25rem 0;
  color: #64748b;

  strong {
    color: #0f172a;
  }
`

const StatusBadge = styled.span<{ status: DonationStatus }>`
  display: inline-block;
  padding: 0.375rem 0.75rem;
  border-radius: 0.375rem;
  font-size: 0.8125rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;

  ${(props) => {
    switch (props.status) {
      case 'pending':
        return `
          background-color: #fef3c7;
          color: #92400e;
        `
      case 'verified':
        return `
          background-color: #dcfce7;
          color: #166534;
        `
      case 'failed':
        return `
          background-color: #fee2e2;
          color: #991b1b;
        `
      default:
        return `
          background-color: #e2e8f0;
          color: #334155;
        `
    }
  }}
`

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem 1rem;
  color: #64748b;
`

const EmptyIcon = styled(Filter)`
  width: 3rem;
  height: 3rem;
  margin: 0 auto 1rem;
  opacity: 0.5;
`

const EmptyTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: #0f172a;
  margin: 0 0 0.5rem 0;
`

const EmptyText = styled.p`
  margin: 0;
  color: #64748b;
`

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  border-top: 1px solid #e2e8f0;
`

const PaginationButton = styled.button<{ active?: boolean; disabled?: boolean }>`
  padding: 0.5rem 1rem;
  border: 1px solid #e2e8f0;
  background-color: ${(props) => (props.active ? '#6366f1' : 'white')};
  color: ${(props) => (props.active ? 'white' : '#0f172a')};
  border-radius: 0.375rem;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s ease;
  opacity: ${(props) => (props.disabled ? 0.5 : 1)};
  pointer-events: ${(props) => (props.disabled ? 'none' : 'auto')};

  &:hover:not(:disabled) {
    background-color: #ecf0ff;
    border-color: #6366f1;
  }
`

const ErrorBox = styled.div`
  display: flex;
  gap: 1rem;
  padding: 1rem;
  background-color: #fee2e2;
  border: 1px solid #fecaca;
  border-radius: 0.5rem;
  color: #991b1b;
  margin-bottom: 1.5rem;
`

const ErrorIcon = styled(AlertCircle)`
  flex-shrink: 0;
  margin-top: 0.125rem;
`

// ============================================================
// HELPER FUNCTIONS
// ============================================================

const formatCurrency = (cents: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(cents / 100)
}

const formatDate = (timestamp: string): string => {
  return new Date(timestamp).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const getStatusColor = (status: string): 'pending' | 'verified' | 'failed' | 'all' => {
  if (status === 'pending' || status === 'verified' || status === 'failed') {
    return status as 'pending' | 'verified' | 'failed'
  }
  return 'all'
}

// ============================================================
// COMPONENT
// ============================================================

/**
 * CreatorDonationsPage Component
 * Displays all donations to creator's campaigns with filtering,
 * status tracking, and split payment breakdown
 */
export default function CreatorDonationsPage() {
  const [status, setStatus] = useState<DonationStatus>('all')
  const [page, setPage] = useState(1)
  const limit = 10
  const queryClient = useQueryClient()

  // Fetch donations data
  const {
    data: donationsData,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['myDonations', status, page],
    queryFn: () => donationService.getMyDonations({ page, limit, status: status === 'all' ? undefined : status }),
    staleTime: 30000, // 30 seconds
  })

  // Real-time updates: listen for donation status changes
  useEffect(() => {
    console.log('Setting up WebSocket listener for donation updates...')

    // In production, this would connect to WebSocket
    // For now, simulate polling
    const pollInterval = setInterval(() => {
      queryClient.invalidateQueries({ queryKey: ['myDonations'] })
    }, 5000) // Poll every 5 seconds

    return () => clearInterval(pollInterval)
  }, [queryClient])

  const handleStatusChange = (newStatus: DonationStatus) => {
    setStatus(newStatus)
    setPage(1) // Reset to first page
  }

  const handlePageChange = (newPage: number) => {
    setPage(newPage)
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleRefresh = () => {
    refetch()
  }

  const donations = donationsData?.data?.donations || []
  const summary = donationsData?.data?.summary
  const pagination = donationsData?.data?.pagination

  return (
    <Container data-testid="creator-donations-page">
      {/* Header */}
      <Header>
        <Title>Donations</Title>
        <HeaderActions>
          <RefreshButton
            onClick={handleRefresh}
            disabled={isLoading}
            data-testid="refresh-button"
            title="Refresh donations list"
          >
            <RefreshCw size={18} />
            Refresh
          </RefreshButton>
        </HeaderActions>
      </Header>

      {/* Summary Cards */}
      {summary && (
        <SummaryGrid data-testid="donations-summary">
          <SummaryCard>
            <SummaryLabel>Total Raised</SummaryLabel>
            <SummaryValue data-testid="total-raised-value">
              {formatCurrency(summary.total_raised_cents)}
            </SummaryValue>
            <SummarySubtext data-testid="total-donations-count">
              {summary.count} {summary.count === 1 ? 'donation' : 'donations'}
            </SummarySubtext>
          </SummaryCard>

          <SummaryCard>
            <SummaryLabel>Your Payout</SummaryLabel>
            <SummaryValue data-testid="creator-total-value">
              {formatCurrency(summary.total_creator_cents)}
            </SummaryValue>
            <SummarySubtext>(80% of donations)</SummarySubtext>
          </SummaryCard>

          <SummaryCard>
            <SummaryLabel>Verified</SummaryLabel>
            <SummaryValue data-testid="verified-amount-value">
              {formatCurrency(summary.verified_cents)}
            </SummaryValue>
            <SummarySubtext>Ready for payout</SummarySubtext>
          </SummaryCard>

          <SummaryCard>
            <SummaryLabel>Pending</SummaryLabel>
            <SummaryValue data-testid="pending-amount-value">
              {formatCurrency(summary.pending_cents)}
            </SummaryValue>
            <SummarySubtext>Awaiting verification</SummarySubtext>
          </SummaryCard>

          <SummaryCard>
            <SummaryLabel>Average Donation</SummaryLabel>
            <SummaryValue data-testid="average-donation-value">
              {formatCurrency(summary.avg_donation_cents)}
            </SummaryValue>
            <SummarySubtext>Per donation</SummarySubtext>
          </SummaryCard>

          <SummaryCard>
            <SummaryLabel>Platform Fees</SummaryLabel>
            <SummaryValue data-testid="platform-fee-total-value">
              {formatCurrency(summary.total_raised_cents - summary.total_creator_cents)}
            </SummaryValue>
            <SummarySubtext>(20% of donations)</SummarySubtext>
          </SummaryCard>
        </SummaryGrid>
      )}

      {/* Error Box */}
      {isError && (
        <ErrorBox role="alert">
          <ErrorIcon size={20} />
          <div>
            <strong>Error loading donations:</strong>{' '}
            {error instanceof Error ? error.message : 'An error occurred'}
          </div>
        </ErrorBox>
      )}

      {/* Filter Bar */}
      <FilterBar>
        <FilterGroup>
          <FilterLabel htmlFor="status-filter">Filter by Status</FilterLabel>
          <FilterSelect
            id="status-filter"
            value={status}
            onChange={(e) => handleStatusChange(e.target.value as DonationStatus)}
            data-testid="status-filter"
          >
            <option value="all">All Donations</option>
            <option value="pending">Pending</option>
            <option value="verified">Verified</option>
            <option value="failed">Failed</option>
          </FilterSelect>
        </FilterGroup>
      </FilterBar>

      {/* Donations Table */}
      {isLoading ? (
        <EmptyState>
          <div>Loading donations...</div>
        </EmptyState>
      ) : donations.length === 0 ? (
        <EmptyState data-testid="empty-state">
          <EmptyIcon />
          <EmptyTitle>No donations yet</EmptyTitle>
          <EmptyText>
            {status === 'all'
              ? 'Share your campaign to start receiving donations!'
              : `No ${status} donations to display.`}
          </EmptyText>
        </EmptyState>
      ) : (
        <>
          <TableContainer>
            <Table data-testid="donations-list">
              <TableHead>
                <tr>
                  <TableHeaderCell>Date</TableHeaderCell>
                  <TableHeaderCell>Campaign</TableHeaderCell>
                  <TableHeaderCell>Donor</TableHeaderCell>
                  <TableHeaderCell>Amount</TableHeaderCell>
                  <TableHeaderCell>Status</TableHeaderCell>
                </tr>
              </TableHead>
              <TableBody>
                {donations.map((donation) => (
                  <TableRow
                    key={donation.id}
                    className={`status-${donation.status}`}
                    data-testid="donation-row"
                  >
                    <DateCell data-testid="donation-date">
                      {formatDate(donation.created_at)}
                    </DateCell>
                    <CampaignCell data-testid="donation-campaign">
                      {donation.campaign_name}
                    </CampaignCell>
                    <DonorCell data-testid="donation-donor">
                      {donation.donor_name}
                    </DonorCell>
                    <AmountCell data-testid="donation-amount">
                      <SplitBreakdown>
                        <SplitRow>
                          <span>Total: </span>
                          <strong>{formatCurrency(donation.amount_total_cents)}</strong>
                        </SplitRow>
                        <SplitRow>
                          <span data-testid="creator-amount">
                            You (80%):
                          </span>
                          <strong style={{ color: '#10b981' }}>
                            {formatCurrency(donation.amount_creator_cents)}
                          </strong>
                        </SplitRow>
                        <SplitRow>
                          <span data-testid="platform-fee">
                            Platform (20%):
                          </span>
                          <strong style={{ color: '#6366f1' }}>
                            {formatCurrency(donation.amount_platform_fee_cents)}
                          </strong>
                        </SplitRow>
                      </SplitBreakdown>
                    </AmountCell>
                    <TableCell data-testid="donation-status">
                      <StatusBadge status={getStatusColor(donation.status)}>
                        {donation.status}
                      </StatusBadge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Pagination */}
          {pagination && pagination.pages > 1 && (
            <Pagination>
              <PaginationButton
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
              >
                ← Previous
              </PaginationButton>

              {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((p) => (
                <PaginationButton
                  key={p}
                  active={p === page}
                  onClick={() => handlePageChange(p)}
                >
                  {p}
                </PaginationButton>
              ))}

              <PaginationButton
                onClick={() => handlePageChange(page + 1)}
                disabled={page === pagination.pages}
              >
                Next →
              </PaginationButton>
            </Pagination>
          )}
        </>
      )}
    </Container>
  )
}
