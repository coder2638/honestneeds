'use client'

import React, { useState, useCallback } from 'react'
import styled from 'styled-components'
import { useCampaignPayoutRequests, useCampaignPayoutSummary, useMarkPayoutAsPaid } from '@/api/hooks/useCampaignPayouts'
import { useRouter, useParams } from 'next/navigation'
import { 
  DollarSign, 
  ArrowRight, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  Send,
  Filter,
  ChevronLeft,
  Eye,
  X,
  Copy
} from 'lucide-react'
import { useToast } from '@/hooks/useToast'

const PageWrapper = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 2rem;
`

const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
`

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2rem;

  h1 {
    font-size: 2rem;
    font-weight: 700;
    color: #1a1a1a;
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .breadcrumb {
    display: flex;
    gap: 8px;
    align-items: center;
    color: #666;
    font-size: 0.9rem;
    margin-bottom: 12px;

    button {
      background: none;
      border: none;
      color: #0066cc;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 4px;

      &:hover {
        text-decoration: underline;
      }
    }
  }

  .campaign-title {
    color: #666;
    font-size: 0.95rem;
    margin-top: 0.5rem;
  }
`

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`

const StatCard = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border-left: 4px solid ${props => props.color || '#0066cc'};

  .label {
    font-size: 0.9rem;
    color: #666;
    font-weight: 500;
    margin-bottom: 0.5rem;
  }

  .value {
    font-size: 1.8rem;
    font-weight: 700;
    color: #1a1a1a;
  }

  .subtext {
    font-size: 0.8rem;
    color: #999;
    margin-top: 0.5rem;
  }
`

const FilterBar = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  align-items: center;
  flex-wrap: wrap;

  button {
    padding: 0.5rem 1rem;
    border: 2px solid #e0e0e0;
    background: white;
    color: #333;
    border-radius: 8px;
    cursor: pointer;
    font-weight: 500;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    gap: 0.5rem;

    &:hover {
      border-color: #0066cc;
    }

    &[data-active="true"] {
      border-color: #0066cc;
      background: #0066cc;
      color: white;
    }
  }
`

const RequestsTable = styled.div`
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    background: transparent;
    padding: 0;
    box-shadow: none;
  }
`

const TableHeader = styled.div`
  display: grid;
  grid-template-columns: 2fr 1.5fr 1.5fr 1fr 1fr auto;
  gap: 1rem;
  padding: 1.5rem;
  background: #f9f9f9;
  font-weight: 600;
  color: #333;
  border-bottom: 2px solid #e0e0e0;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;

  @media (max-width: 768px) {
    display: none;
  }
`

const TableRow = styled.div`
  display: grid;
  grid-template-columns: 2fr 1.5fr 1.5fr 1fr 1fr auto;
  gap: 1rem;
  padding: 1.5rem;
  border-bottom: 1px solid #f0f0f0;
  align-items: center;

  &:hover {
    background: #fafafa;
  }

  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    border: 1px solid #e0e0e0;
    border-radius: 12px;
    margin-bottom: 1rem;
    background: white;
    padding: 1rem;
    border-bottom: 1px solid #e0e0e0;

    &:hover {
      background: #fafafa;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }
  }
`

const SharerInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;

  img {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    object-fit: cover;
    background: #e0e0e0;
  }

  .details {
    h4 {
      margin: 0;
      font-size: 0.95rem;
      color: #1a1a1a;
    }

    p {
      margin: 4px 0 0 0;
      font-size: 0.85rem;
      color: #666;
    }
  }

  @media (max-width: 768px) {
    width: 100%;

    img {
      width: 50px;
      height: 50px;
    }

    .details {
      flex: 1;

      h4 {
        font-size: 1rem;
      }

      p {
        font-size: 0.8rem;
      }
    }
  }
`

const PaymentDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;

  .type {
    font-size: 0.9rem;
    font-weight: 600;
    color: #0066cc;
  }

  .details {
    font-size: 0.85rem;
    color: #666;
  }

  @media (max-width: 768px) {
    width: 100%;
    background: #f8f9fa;
    padding: 0.75rem;
    border-radius: 8px;
    border-left: 4px solid #0066cc;

    .type {
      font-size: 0.85rem;
      text-transform: uppercase;
      font-weight: 700;
    }

    .details {
      font-size: 0.8rem;
    }
  }
`

const AmountColumn = styled.div`
  text-align: right;

  .amount {
    font-size: 1rem;
    font-weight: 700;
    color: #1a1a1a;
  }

  .with-fee {
    font-size: 0.8rem;
    color: #999;
    margin-top: 2px;
  }

  @media (max-width: 768px) {
    width: 100%;
    text-align: left;
    background: #f8f9fa;
    padding: 0.75rem;
    border-radius: 8px;
    border-left: 4px solid #28a745;

    .amount {
      font-size: 1.3rem;
    }

    .with-fee {
      font-size: 0.75rem;
      margin-top: 0.25rem;
    }
  }
`

const StatusBadge = styled.span`
  display: inline-block;
  padding: 0.4rem 0.8rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  
  &.pending {
    background: #fff3cd;
    color: #856404;
  }

  &.processing {
    background: #d1ecf1;
    color: #0c5460;
  }

  &.completed {
    background: #d4edda;
    color: #155724;
  }

  &.failed {
    background: #f8d7da;
    color: #721c24;
  }
`

const ActionButtons = styled.div`
  display: flex;
  gap: 0.5rem;

  button {
    padding: 0.4rem 0.8rem;
    border: none;
    background: #0066cc;
    color: white;
    border-radius: 6px;
    cursor: pointer;
    font-size: 0.8rem;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 4px;
    transition: all 0.2s;

    &:hover:not(:disabled) {
      background: #0052a3;
      transform: translateY(-1px);
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }

  @media (max-width: 768px) {
    width: 100%;
    gap: 0.5rem;
    flex-wrap: wrap;

    button {
      flex: 1;
      min-width: 100px;
      justify-content: center;
      padding: 0.5rem 0.75rem;
      font-size: 0.75rem;
    }
  }
`

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: #666;

  svg {
    width: 64px;
    height: 64px;
    margin-bottom: 1rem;
    opacity: 0.5;
  }

  h3 {
    font-size: 1.3rem;
    margin-bottom: 0.5rem;
    color: #333;
  }

  p {
    font-size: 0.95rem;
  }
`

const LoadingState = styled.div`
  padding: 4rem 2rem;
  text-align: center;
  color: #666;
`

const Overlay = styled.div<{ isOpen: boolean }>`
  display: ${props => props.isOpen ? 'block' : 'none'};
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
`

const DetailModal = styled.div<{ isOpen: boolean }>`
  display: ${props => props.isOpen ? 'flex' : 'none'};
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  border-radius: 12px;
  padding: 2rem;
  max-width: 600px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
  z-index: 1001;
  flex-direction: column;
  gap: 1.5rem;
`

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 2px solid #e0e0e0;
  padding-bottom: 1rem;
  margin-bottom: 1rem;

  h2 {
    margin: 0;
    font-size: 1.5rem;
    color: #1a1a1a;
  }

  button {
    background: none;
    border: none;
    cursor: pointer;
    color: #666;
    padding: 0.5rem;
    display: flex;
    align-items: center;
    justify-content: center;

    &:hover {
      color: #1a1a1a;
    }
  }
`

const ModalSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;

  h3 {
    font-size: 1.1rem;
    font-weight: 600;
    color: #333;
    margin: 0 0 0.5rem 0;
  }
`

const DetailField = styled.div`
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 8px;
  border-left: 4px solid #0066cc;

  .label {
    font-size: 0.8rem;
    color: #666;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 0.5rem;
  }

  .value {
    font-size: 1rem;
    color: #1a1a1a;
    font-weight: 500;
    word-break: break-all;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
  }

  .copy-btn {
    background: none;
    border: 1px solid #ddd;
    padding: 0.3rem 0.6rem;
    border-radius: 4px;
    cursor: pointer;
    color: #0066cc;
    font-size: 0.75rem;
    display: flex;
    align-items: center;
    gap: 0.3rem;
    transition: all 0.2s;
    flex-shrink: 0;

    &:hover {
      background: #0066cc;
      color: white;
    }
  }
`

const SharerDetails = styled.div`
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 8px;
  display: flex;
  gap: 1rem;
  align-items: center;

  img {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    object-fit: cover;
    background: #e0e0e0;
  }

  .info {
    h4 {
      margin: 0;
      font-size: 1rem;
      color: #1a1a1a;
    }

    p {
      margin: 4px 0 0 0;
      font-size: 0.9rem;
      color: #666;
    }
  }
`

/**
 * Creator Sharers Payouts - Campaign Detail
 * View and manage withdrawal requests for a specific campaign
 */

// Memoize statusOptions outside component to prevent recreation
const STATUS_OPTIONS = [
  { value: 'pending', label: 'Pending', icon: Clock },
  { value: 'processing', label: 'Processing', icon: ArrowRight },
  { value: 'completed', label: 'Completed', icon: CheckCircle },
  { value: 'all', label: 'All', icon: Filter }
]

export default function CampaignPayoutsPage() {
  const router = useRouter()
  const params = useParams()
  const campaignId = params.campaignId as string
  const [selectedStatus, setSelectedStatus] = useState('pending')
  const [page, setPage] = useState(1)
  const [selectedRequest, setSelectedRequest] = useState<any>(null)
  const [copiedField, setCopiedField] = useState<string | null>(null)
  const { showToast } = useToast()

  // Fetch payout requests - stable dependencies
  const { 
    data: requestsData, 
    isLoading: requestsLoading, 
    error: requestsError 
  } = useCampaignPayoutRequests(
    campaignId,
    selectedStatus as any,
    page
  )

  // Fetch summary - stable dependencies
  const { data: summaryData } = useCampaignPayoutSummary(campaignId)

  // Mark as paid mutation
  const { mutate: markAsPaid, isPending: isMarking } = useMarkPayoutAsPaid()

  const handleMarkAsPaid = useCallback((withdrawalId: string) => {
    markAsPaid(
      {
        campaignId,
        withdrawalId,
        notes: `Marked as sent by creator`
      },
      {
        onSuccess: () => {
          showToast({ type: 'success', message: 'Payment marked as sent! Sharer will be notified.' })
        },
        onError: (error: Error) => {
          const errorMessage = (error as any).response?.data?.error || 'Failed to mark as paid'
          showToast({ type: 'error', message: errorMessage })
        }
      }
    )
  }, [campaignId, markAsPaid, showToast])

  // Memoize clipboard handler to prevent recreation on every render
  const handleCopyToClipboard = useCallback((text: string, fieldName: string) => {
    navigator.clipboard.writeText(text)
    setCopiedField(fieldName)
    const timeoutId = setTimeout(() => setCopiedField(null), 2000)
    return () => clearTimeout(timeoutId)
  }, [])

  return (
    <PageWrapper>
      <Container>
        <Header>
          <div>
            <div className="breadcrumb">
              <button onClick={() => router.back()}>
                <ChevronLeft size={16} /> Back
              </button>
            </div>
            <h1>
              <DollarSign size={32} />
              Sharers Payouts
            </h1>
            <div className="campaign-title">
              Manage withdrawal requests for this campaign
            </div>
          </div>
        </Header>

        {/* Summary Stats */}
        {summaryData && (
          <StatsGrid>
            <StatCard color="#0066cc">
              <div className="label">Total Pending</div>
              <div className="value">${(summaryData.totalPending || 0).toFixed(2)}</div>
              <div className="subtext">{summaryData.pendingCount || 0} requests</div>
            </StatCard>
            <StatCard color="#ffc107">
              <div className="label">Processing</div>
              <div className="value">${(summaryData.totalProcessing || 0).toFixed(2)}</div>
              <div className="subtext">{summaryData.processingCount || 0} requests</div>
            </StatCard>
            <StatCard color="#28a745">
              <div className="label">Completed</div>
              <div className="value">${(summaryData.totalCompleted || 0).toFixed(2)}</div>
              <div className="subtext">{summaryData.completedCount || 0} paid</div>
            </StatCard>
          </StatsGrid>
        )}

        {/* Status Filter Bar */}
        <FilterBar>
          {STATUS_OPTIONS.map((option) => {
            const IconComponent = option.icon
            return (
              <button
                key={option.value}
                onClick={() => {
                  setSelectedStatus(option.value)
                  setPage(1)
                }}
                title={`Filter by ${option.label}`}
                data-active={selectedStatus === option.value}
              >
                <IconComponent size={16} />
                {option.label}
              </button>
            )
          })}
        </FilterBar>

        {/* Requests Table */}
        {requestsLoading ? (
          <LoadingState>Loading payout requests...</LoadingState>
        ) : requestsError ? (
          <EmptyState>
            <AlertCircle />
            <h3>Error Loading Requests</h3>
            <p>{(requestsError as any).message || 'Failed to load payout requests'}</p>
          </EmptyState>
        ) : !requestsData?.withdrawals || requestsData.withdrawals.length === 0 ? (
          <EmptyState>
            <DollarSign />
            <h3>No {selectedStatus} Payouts</h3>
            <p>Sharers will create withdrawal requests when they want to claim their earnings.</p>
          </EmptyState>
        ) : (
          <RequestsTable>
            <TableHeader>
              <div>Sharer</div>
              <div>Payment Method</div>
              <div>Amount</div>
              <div>Status</div>
              <div>Requested</div>
              <div>Action</div>
            </TableHeader>

            {requestsData.withdrawals.map((request: any) => (
              <TableRow key={request.id}>
                <SharerInfo>
                  {request.sharer.profile_picture && (
                    <img src={request.sharer.profile_picture} alt={request.sharer.name} />
                  )}
                  <div className="details">
                    <h4>{request.sharer.name}</h4>
                    <p>@{request.sharer.username} • {request.sharer.email}</p>
                  </div>
                </SharerInfo>

                <PaymentDetails>
                  <div className="type">
                    {request.payment_method.type.replace('_', ' ').toUpperCase()}
                  </div>
                  <div className="details">
                    {request.payment_method.account_holder && `${request.payment_method.account_holder} `}
                    {request.payment_method.last4 && `•••• ${request.payment_method.last4}`}
                  </div>
                </PaymentDetails>

                <AmountColumn>
                  <div className="amount">${request.amount.toFixed(2)}</div>
                  <div className="with-fee">-${request.fee.toFixed(2)} fee</div>
                </AmountColumn>

                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem',
                  alignItems: 'flex-start',
                }}>
                  <StatusBadge className={request.status}>
                    {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                  </StatusBadge>
                </div>

                <div style={{
                  fontSize: '0.9rem',
                  color: '#666',
                }}>
                  {new Date(request.requested_at).toLocaleDateString()}
                </div>

                <ActionButtons>
                  <button
                    onClick={() => setSelectedRequest(request)}
                    title="View account details"
                    style={{
                      background: '#17a2b8',
                    }}
                  >
                    <Eye size={14} /> Details
                  </button>
                  {request.status === 'pending' && (
                    <button
                      onClick={() => handleMarkAsPaid(request.id)}
                      disabled={isMarking}
                      title="Mark as sent to sharer"
                    >
                      <Send size={14} /> Send
                    </button>
                  )}
                  {request.status === 'processing' && (
                    <span style={{ color: '#17a2b8', fontWeight: '600', fontSize: '0.8rem' }}>
                      ✓ Marked as sent
                    </span>
                  )}
                  {request.status === 'completed' && (
                    <span style={{ color: '#28a745', fontWeight: '600', fontSize: '0.8rem' }}>
                      ✓ Completed
                    </span>
                  )}
                </ActionButtons>
              </TableRow>
            ))}
          </RequestsTable>
        )}

        {/* Pagination */}
        {requestsData?.pagination && requestsData.pagination.pages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '2rem' }}>
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              style={{
                padding: '0.5rem 1rem',
                border: '1px solid #e0e0e0',
                borderRadius: '6px',
                cursor: page === 1 ? 'not-allowed' : 'pointer',
                opacity: page === 1 ? 0.5 : 1
              }}
            >
              Previous
            </button>
            <span style={{ display: 'flex', alignItems: 'center', padding: '0 1rem' }}>
              Page {page} of {requestsData.pagination.pages}
            </span>
            <button
              onClick={() => setPage(Math.min(requestsData.pagination.pages, page + 1))}
              disabled={page === requestsData.pagination.pages}
              style={{
                padding: '0.5rem 1rem',
                border: '1px solid #e0e0e0',
                borderRadius: '6px',
                cursor: page === requestsData.pagination.pages ? 'not-allowed' : 'pointer',
                opacity: page === requestsData.pagination.pages ? 0.5 : 1
              }}
            >
              Next
            </button>
          </div>
        )}
      </Container>

      {/* Account Details Modal */}
      <Overlay isOpen={!!selectedRequest} onClick={() => setSelectedRequest(null)} />
      <DetailModal isOpen={!!selectedRequest}>
        {selectedRequest && (
          <>
            <ModalHeader>
              <h2>Sharer Account Details</h2>
              <button onClick={() => setSelectedRequest(null)}>
                <X size={24} />
              </button>
            </ModalHeader>

            {/* Sharer Information */}
            <ModalSection>
              <SharerDetails>
                {selectedRequest.sharer.profile_picture && (
                  <img src={selectedRequest.sharer.profile_picture} alt={selectedRequest.sharer.name} />
                )}
                <div className="info">
                  <h4>{selectedRequest.sharer.name}</h4>
                  <p>@{selectedRequest.sharer.username}</p>
                  <p>{selectedRequest.sharer.email}</p>
                </div>
              </SharerDetails>
            </ModalSection>

            {/* Payout Amount Details */}
            <ModalSection>
              <h3>📊 Payout Details</h3>
              <DetailField>
                <div className="label">Requested Amount</div>
                <div className="value">${selectedRequest.amount.toFixed(2)}</div>
              </DetailField>
              <DetailField>
                <div className="label">Processing Fee</div>
                <div className="value">-${selectedRequest.fee.toFixed(2)}</div>
              </DetailField>
              <DetailField>
                <div className="label">Amount After Fee</div>
                <div className="value">${(selectedRequest.amount - selectedRequest.fee).toFixed(2)}</div>
              </DetailField>
              <DetailField>
                <div className="label">Status</div>
                <div className="value">
                  <StatusBadge className={selectedRequest.status}>
                    {selectedRequest.status.charAt(0).toUpperCase() + selectedRequest.status.slice(1)}
                  </StatusBadge>
                </div>
              </DetailField>
              <DetailField>
                <div className="label">Requested Date</div>
                <div className="value">{new Date(selectedRequest.requested_at).toLocaleString()}</div>
              </DetailField>
            </ModalSection>

            {/* Payment Method Details */}
            <ModalSection>
              <h3>💳 Payment Method Details</h3>
              <DetailField>
                <div className="label">Payment Method Type</div>
                <div className="value">
                  {selectedRequest.payment_method.type.replace(/_/g, ' ').toUpperCase()}
                </div>
              </DetailField>

              {/* Bank Transfer Details */}
              {selectedRequest.payment_method.type === 'bank_transfer' && (
                <>
                  {selectedRequest.payment_method.bank_account_holder && (
                    <DetailField>
                      <div className="label">Account Holder Name</div>
                      <div className="value">
                        <span>{selectedRequest.payment_method.bank_account_holder}</span>
                        <button
                          className="copy-btn"
                          onClick={() =>
                            handleCopyToClipboard(
                              selectedRequest.payment_method.bank_account_holder,
                              'bank_account_holder'
                            )
                          }
                        >
                          <Copy size={12} />
                          {copiedField === 'bank_account_holder' ? 'Copied!' : 'Copy'}
                        </button>
                      </div>
                    </DetailField>
                  )}

                  {selectedRequest.payment_method.bank_name && (
                    <DetailField>
                      <div className="label">Bank Name</div>
                      <div className="value">
                        <span>{selectedRequest.payment_method.bank_name}</span>
                        <button
                          className="copy-btn"
                          onClick={() =>
                            handleCopyToClipboard(
                              selectedRequest.payment_method.bank_name,
                              'bank_name'
                            )
                          }
                        >
                          <Copy size={12} />
                          {copiedField === 'bank_name' ? 'Copied!' : 'Copy'}
                        </button>
                      </div>
                    </DetailField>
                  )}

                  {selectedRequest.payment_method.bank_account_number && (
                    <DetailField>
                      <div className="label">Account Number</div>
                      <div className="value">
                        <span>{selectedRequest.payment_method.bank_account_number}</span>
                        <button
                          className="copy-btn"
                          onClick={() =>
                            handleCopyToClipboard(
                              selectedRequest.payment_method.bank_account_number,
                              'bank_account_number'
                            )
                          }
                        >
                          <Copy size={12} />
                          {copiedField === 'bank_account_number' ? 'Copied!' : 'Copy'}
                        </button>
                      </div>
                    </DetailField>
                  )}

                  {selectedRequest.payment_method.bank_account_type && (
                    <DetailField>
                      <div className="label">Account Type</div>
                      <div className="value">
                        {selectedRequest.payment_method.bank_account_type.charAt(0).toUpperCase() +
                          selectedRequest.payment_method.bank_account_type.slice(1)}
                      </div>
                    </DetailField>
                  )}

                  {selectedRequest.payment_method.bank_routing_number && (
                    <DetailField>
                      <div className="label">Routing Number</div>
                      <div className="value">
                        <span>{selectedRequest.payment_method.bank_routing_number}</span>
                        <button
                          className="copy-btn"
                          onClick={() =>
                            handleCopyToClipboard(
                              selectedRequest.payment_method.bank_routing_number,
                              'bank_routing_number'
                            )
                          }
                        >
                          <Copy size={12} />
                          {copiedField === 'bank_routing_number' ? 'Copied!' : 'Copy'}
                        </button>
                      </div>
                    </DetailField>
                  )}

                  {/* Note about account details */}
                  <div style={{
                    background: '#e3f2fd',
                    padding: '1rem',
                    borderRadius: '8px',
                    borderLeft: '4px solid #1976d2',
                    fontSize: '0.9rem',
                    color: '#0d47a1',
                    marginTop: '1rem'
                  }}>
                    <strong>💡 Note:</strong> Full account and routing numbers are displayed here for bank transfer processing. Keep this information secure and only share with authorized payment processors.
                  </div>
                </>
              )}

              {/* Mobile Money Details */}
              {selectedRequest.payment_method.type === 'mobile_money' && (
                <>
                  {selectedRequest.payment_method.mobile_money_provider && (
                    <DetailField>
                      <div className="label">Mobile Money Provider</div>
                      <div className="value">
                        {selectedRequest.payment_method.mobile_money_provider.toUpperCase()}
                      </div>
                    </DetailField>
                  )}

                  {selectedRequest.payment_method.mobile_number && (
                    <DetailField>
                      <div className="label">Mobile Number</div>
                      <div className="value">
                        <span>{selectedRequest.payment_method.mobile_number}</span>
                        <button
                          className="copy-btn"
                          onClick={() =>
                            handleCopyToClipboard(
                              selectedRequest.payment_method.mobile_number,
                              'mobile_number'
                            )
                          }
                        >
                          <Copy size={12} />
                          {copiedField === 'mobile_number' ? 'Copied!' : 'Copy'}
                        </button>
                      </div>
                    </DetailField>
                  )}

                  {selectedRequest.payment_method.mobile_country_code && (
                    <DetailField>
                      <div className="label">Country Code</div>
                      <div className="value">
                        {selectedRequest.payment_method.mobile_country_code}
                      </div>
                    </DetailField>
                  )}
                </>
              )}

              {/* Card Details */}
              {selectedRequest.payment_method.type === 'stripe' && (
                <>
                  {selectedRequest.payment_method.card_brand && (
                    <DetailField>
                      <div className="label">Card Brand</div>
                      <div className="value">
                        {selectedRequest.payment_method.card_brand.charAt(0).toUpperCase() +
                          selectedRequest.payment_method.card_brand.slice(1)}
                      </div>
                    </DetailField>
                  )}

                  {selectedRequest.payment_method.card_last_four && (
                    <DetailField>
                      <div className="label">Card Last 4</div>
                      <div className="value">•••• {selectedRequest.payment_method.card_last_four}</div>
                    </DetailField>
                  )}
                </>
              )}
            </ModalSection>
          </>
        )}
      </DetailModal>
    </PageWrapper>
  )
}
