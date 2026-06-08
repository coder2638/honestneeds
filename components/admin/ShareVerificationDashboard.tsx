'use client'

import React, { useState, useCallback } from 'react'
import styled from 'styled-components'
import { Check, X, AlertCircle, ChevronDown, Search, Filter, Mail } from 'lucide-react'
import Button from '@/components/ui/Button'
import Card from '@/components/Card'
import { Modal } from '@/components/Modal'
import FormField from '@/components/FormField'
import axios from 'axios'

interface Share {
  share_id: string
  campaign_id: string
  campaign_title: string
  supporter_id: string
  supporter_name: string
  supporter_email: string
  channel: string
  reward_amount: number
  is_paid: boolean
  status: 'pending_verification' | 'verified' | 'rejected' | 'appealed'
  rejection_reason?: string
  appeal_status?: 'pending' | 'approved' | 'rejected'
  created_at: string
}

const Container = styled.div`
  min-height: 100vh;
  background-color: #f8fafc;
  padding: 2rem 1rem;
`

const Header = styled.div`
  max-width: 1400px;
  margin: 0 auto 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;

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
`

const Stats = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
  max-width: 1400px;
  margin: 0 auto 2rem;
`

const StatCard = styled(Card)`
  padding: 1rem;
  text-align: center;
`

const StatValue = styled.div`
  font-size: 1.75rem;
  font-weight: 700;
  color: #0f172a;
`

const StatLabel = styled.div`
  font-size: 0.875rem;
  color: #64748b;
  margin-top: 0.25rem;
`

const FilterBar = styled.div`
  max-width: 1400px;
  margin: 0 auto 1.5rem;
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`

const FilterSelect = styled.select`
  padding: 0.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 0.875rem;
  background: white;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
`

const ShareList = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  display: grid;
  gap: 1rem;
`

const ShareItem = styled(Card)<{ $isDangerous?: boolean }>`
  padding: 1.5rem;
  border-left: 4px solid ${props => {
    if (props.$isDangerous) return '#ef4444'
    return '#667eea'
  }};
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`

const ShareHeader = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 1rem;
  margin-bottom: 1rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`

const ShareMeta = styled.div`
  display: grid;
  gap: 0.25rem;
`

const ShareTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: #0f172a;
  margin: 0;
`

const ShareSubtitle = styled.p`
  font-size: 0.875rem;
  color: #64748b;
  margin: 0;
`

const StatusBadge = styled.span<{ $status: string }>`
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.8125rem;
  font-weight: 600;
  background-color: ${props => {
    switch (props.$status) {
      case 'pending_verification':
        return '#FEF3C7'
      case 'verified':
        return '#D1FAE5'
      case 'rejected':
        return '#FEE2E2'
      case 'appealed':
        return '#E0E7FF'
      default:
        return '#F3F4F6'
    }
  }};
  color: ${props => {
    switch (props.$status) {
      case 'pending_verification':
        return '#92400E'
      case 'verified':
        return '#047857'
      case 'rejected':
        return '#7F1D1D'
      case 'appealed':
        return '#4F46E5'
      default:
        return '#374151'
    }
  }};
`

const ShareDetails = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1rem;
  font-size: 0.875rem;
`

const DetailRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`

const DetailLabel = styled.span`
  font-weight: 600;
  color: #64748b;
  text-transform: uppercase;
  font-size: 0.75rem;
`

const DetailValue = styled.span`
  color: #0f172a;
`

const ShareActions = styled.div`
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
`

const ActionButton = styled(Button)`
  font-size: 0.875rem;
  padding: 0.5rem 1rem;
`

const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  max-height: 80vh;
  overflow-y: auto;
`

const ReasonBox = styled.div`
  padding: 1rem;
  background: #f3f4f6;
  border-radius: 8px;
  border-left: 4px solid #ef4444;
`

const ReasonText = styled.p`
  margin: 0;
  color: #1f2937;
  line-height: 1.6;
`

interface AdminShareVerificationProps {
  onShareVerified?: (share: Share) => void
  onShareRejected?: (share: Share) => void
}

export const AdminShareVerification: React.FC<AdminShareVerificationProps> = ({
  onShareVerified,
  onShareRejected,
}) => {
  const [shares, setShares] = useState<Share[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedShare, setSelectedShare] = useState<Share | null>(null)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [showRejectModal, setShowRejectModal] = useState(false)
  const [showAppealModal, setShowAppealModal] = useState(false)
  const [rejectReason, setRejectReason] = useState('')
  const [appealReviewReason, setAppealReviewReason] = useState('')
  const [appealApproved, setAppealApproved] = useState(true)
  const [statusFilter, setStatusFilter] = useState('pending_verification')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  // Fetch pending shares
  const fetchShares = useCallback(async () => {
    setLoading(true)
    try {
      const response = await axios.get('/api/shares/admin/shares/pending', {
        params: {
          status: statusFilter,
          page,
          limit: 20,
          sortBy: 'created_at',
          sortOrder: 'desc',
        },
      })

      if (response.data.success) {
        setShares(response.data.data.shares)
        setTotalPages(response.data.data.pagination.totalPages)
      }
    } catch (error) {
      console.error('Failed to fetch shares:', error)
    } finally {
      setLoading(false)
    }
  }, [statusFilter, page])

  React.useEffect(() => {
    fetchShares()
  }, [fetchShares])

  // Verify share
  const handleVerifyShare = async () => {
    if (!selectedShare) return

    try {
      const response = await axios.post(
        `/api/shares/admin/shares/${selectedShare.share_id}/verify`,
        {}
      )

      if (response.data.success) {
        setShares(shares.filter(s => s.share_id !== selectedShare.share_id))
        setShowDetailModal(false)
        setSelectedShare(null)
        onShareVerified?.(selectedShare)
      }
    } catch (error) {
      console.error('Failed to verify share:', error)
    }
  }

  // Reject share
  const handleRejectShare = async () => {
    if (!selectedShare || !rejectReason.trim()) return

    try {
      const response = await axios.post(
        `/api/shares/admin/shares/${selectedShare.share_id}/reject`,
        { reason: rejectReason }
      )

      if (response.data.success) {
        setShares(shares.filter(s => s.share_id !== selectedShare.share_id))
        setShowDetailModal(false)
        setShowRejectModal(false)
        setRejectReason('')
        setSelectedShare(null)
        onShareRejected?.(selectedShare)
      }
    } catch (error) {
      console.error('Failed to reject share:', error)
    }
  }

  // Review appeal
  const handleReviewAppeal = async () => {
    if (!selectedShare || !appealReviewReason.trim()) return

    try {
      const response = await axios.post(
        `/api/shares/admin/shares/${selectedShare.share_id}/appeal/review`,
        {
          approved: appealApproved,
          reviewReason: appealReviewReason,
        }
      )

      if (response.data.success) {
        setShares(shares.filter(s => s.share_id !== selectedShare.share_id))
        setShowDetailModal(false)
        setShowAppealModal(false)
        setAppealReviewReason('')
        setSelectedShare(null)
      }
    } catch (error) {
      console.error('Failed to review appeal:', error)
    }
  }

  const pendingCount = shares.filter(s => s.status === 'pending_verification').length
  const appealsCount = shares.filter(s => s.status === 'appealed').length
  const rejectedCount = shares.filter(s => s.status === 'rejected').length

  return (
    <Container>
      <Header>
        <Title>Share Verification</Title>
      </Header>

      <Stats>
        <StatCard>
          <StatValue>{pendingCount}</StatValue>
          <StatLabel>Pending Review</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{appealsCount}</StatValue>
          <StatLabel>Appeals</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{rejectedCount}</StatValue>
          <StatLabel>Rejected</StatLabel>
        </StatCard>
      </Stats>

      <FilterBar>
        <FilterSelect
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value)
            setPage(1)
          }}
        >
          <option value="pending_verification">Pending Verification</option>
          <option value="appealed">Appeals</option>
          <option value="rejected">Rejected</option>
          <option value="verified">Verified</option>
        </FilterSelect>
      </FilterBar>

      <ShareList>
        {loading ? (
          <Card style={{ padding: '2rem', textAlign: 'center' }}>
            <p style={{ color: '#64748b' }}>Loading shares...</p>
          </Card>
        ) : shares.length === 0 ? (
          <Card style={{ padding: '2rem', textAlign: 'center' }}>
            <p style={{ color: '#64748b' }}>No shares to review</p>
          </Card>
        ) : (
          shares.map(share => (
            <ShareItem
              key={share.share_id}
              $isDangerous={share.status === 'rejected'}
              onClick={() => {
                setSelectedShare(share)
                setShowDetailModal(true)
              }}
            >
              <ShareHeader>
                <ShareMeta>
                  <ShareTitle>
                    {share.campaign_title}{' '}
                    <StatusBadge $status={share.status}>
                      {share.status === 'pending_verification' && '⏳ Pending'}
                      {share.status === 'verified' && '✅ Verified'}
                      {share.status === 'rejected' && '❌ Rejected'}
                      {share.status === 'appealed' && '📋 Appealed'}
                    </StatusBadge>
                  </ShareTitle>
                  <ShareSubtitle>
                    Shared by {share.supporter_name} via {share.channel}
                  </ShareSubtitle>
                </ShareMeta>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a' }}>
                    ${(share.reward_amount / 100).toFixed(2)}
                  </div>
                  <div style={{ fontSize: '0.875rem', color: '#64748b' }}>
                    {new Date(share.created_at).toLocaleDateString()}
                  </div>
                </div>
              </ShareHeader>

              <ShareDetails>
                <DetailRow>
                  <DetailLabel>Share ID</DetailLabel>
                  <DetailValue>{share.share_id}</DetailValue>
                </DetailRow>
                <DetailRow>
                  <DetailLabel>Supporter Email</DetailLabel>
                  <DetailValue>{share.supporter_email}</DetailValue>
                </DetailRow>
                <DetailRow>
                  <DetailLabel>Channel</DetailLabel>
                  <DetailValue>{share.channel}</DetailValue>
                </DetailRow>
                <DetailRow>
                  <DetailLabel>Paid Share</DetailLabel>
                  <DetailValue>{share.is_paid ? 'Yes' : 'No'}</DetailValue>
                </DetailRow>
              </ShareDetails>

              <ShareActions>
                {share.status === 'pending_verification' && (
                  <>
                    <ActionButton
                      onClick={(e) => {
                        e.stopPropagation()
                        handleVerifyShare()
                      }}
                      style={{ background: '#10b981', color: 'white' }}
                    >
                      <Check size={16} style={{ marginRight: '0.5rem' }} />
                      Verify
                    </ActionButton>
                    <ActionButton
                      onClick={(e) => {
                        e.stopPropagation()
                        setShowRejectModal(true)
                      }}
                      style={{ background: '#ef4444', color: 'white' }}
                    >
                      <X size={16} style={{ marginRight: '0.5rem' }} />
                      Reject
                    </ActionButton>
                  </>
                )}

                {share.status === 'appealed' && (
                  <>
                    <ActionButton
                      onClick={(e) => {
                        e.stopPropagation()
                        setAppealApproved(true)
                        setShowAppealModal(true)
                      }}
                      style={{ background: '#10b981', color: 'white' }}
                    >
                      Approve Appeal
                    </ActionButton>
                    <ActionButton
                      onClick={(e) => {
                        e.stopPropagation()
                        setAppealApproved(false)
                        setShowAppealModal(true)
                      }}
                      style={{ background: '#ef4444', color: 'white' }}
                    >
                      Reject Appeal
                    </ActionButton>
                  </>
                )}

                {share.status === 'rejected' && share.appeal_status !== 'pending' && (
                  <ActionButton
                    onClick={(e) => {
                      e.stopPropagation()
                      handleVerifyShare()
                    }}
                    style={{ background: '#3b82f6', color: 'white' }}
                  >
                    Override & Verify
                  </ActionButton>
                )}
              </ShareActions>
            </ShareItem>
          ))
        )}
      </ShareList>

      {/* Detail Modal */}
      {showDetailModal && selectedShare && (
        <Modal isOpen={showDetailModal} onClose={() => setShowDetailModal(false)}>
          <ModalContent>
            <h2>{selectedShare.campaign_title}</h2>
            
            <div>
              <h3>Supporter Information</h3>
              <p><strong>Name:</strong> {selectedShare.supporter_name}</p>
              <p><strong>Email:</strong> {selectedShare.supporter_email}</p>
            </div>

            <div>
              <h3>Share Details</h3>
              <p><strong>Share ID:</strong> {selectedShare.share_id}</p>
              <p><strong>Channel:</strong> {selectedShare.channel}</p>
              <p><strong>Reward:</strong> ${(selectedShare.reward_amount / 100).toFixed(2)}</p>
              <p><strong>Status:</strong> <StatusBadge $status={selectedShare.status}>{selectedShare.status}</StatusBadge></p>
            </div>

            {selectedShare.rejection_reason && (
              <div>
                <h3>Rejection Reason</h3>
                <ReasonBox>
                  <ReasonText>{selectedShare.rejection_reason}</ReasonText>
                </ReasonBox>
              </div>
            )}

            {selectedShare.appeal_status === 'pending' && selectedShare.status === 'appealed' && (
              <div>
                <h3>Appeal</h3>
                <ReasonBox>
                  <ReasonText>{selectedShare}</ReasonText>
                </ReasonBox>
              </div>
            )}
          </ModalContent>
        </Modal>
      )}

      {/* Reject Modal */}
      {showRejectModal && (
        <Modal isOpen={showRejectModal} onClose={() => setShowRejectModal(false)}>
          <ModalContent>
            <h2>Reject Share</h2>
            <p>Share ID: {selectedShare?.share_id}</p>
            
            <FormField
              label="Rejection Reason"
              as="textarea"
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Explain why this share is being rejected..."
              rows={5}
            />

            <div style={{ display: 'flex', gap: '1rem' }}>
              <Button onClick={handleRejectShare} style={{ flex: 1 }}>
                Reject Share
              </Button>
              <Button
                variant="secondary"
                onClick={() => {
                  setShowRejectModal(false)
                  setRejectReason('')
                }}
                style={{ flex: 1 }}
              >
                Cancel
              </Button>
            </div>
          </ModalContent>
        </Modal>
      )}

      {/* Appeal Review Modal */}
      {showAppealModal && (
        <Modal isOpen={showAppealModal} onClose={() => setShowAppealModal(false)}>
          <ModalContent>
            <h2>{appealApproved ? 'Approve' : 'Reject'} Appeal</h2>
            <p>Share ID: {selectedShare?.share_id}</p>
            
            <FormField
              label="Decision Reason"
              as="textarea"
              value={appealReviewReason}
              onChange={(e) => setAppealReviewReason(e.target.value)}
              placeholder="Explain your decision..."
              rows={5}
            />

            <div style={{ display: 'flex', gap: '1rem' }}>
              <Button onClick={handleReviewAppeal} style={{ flex: 1 }}>
                {appealApproved ? 'Approve' : 'Reject'}
              </Button>
              <Button
                variant="secondary"
                onClick={() => {
                  setShowAppealModal(false)
                  setAppealReviewReason('')
                }}
                style={{ flex: 1 }}
              >
                Cancel
              </Button>
            </div>
          </ModalContent>
        </Modal>
      )}
    </Container>
  )
}

export default AdminShareVerification
