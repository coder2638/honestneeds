'use client'

import React, { useState } from 'react'
import styled from 'styled-components'
import { MoreVertical, Eye, Flag, AlertCircle, Ban, CheckCircle, Link as LinkIcon } from 'lucide-react'
import Link from 'next/link'
import {
  useCampaignsForModeration,
  useFlagCampaign,
  useUnflagCampaign,
  useSuspendCampaign,
  useUnsuspendCampaign,
  useApproveCampaign,
} from '@/api/hooks/useAdmin'
import { useToast } from '@/hooks/useToast'
import { Button } from '@/components/Button'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import { currencyUtils } from '@/utils/validationSchemas'

/**
 * Campaign Moderation Queue
 * Review and moderate campaigns
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

const Controls = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`

const FilterSelect = styled.select`
  padding: 10px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  background: white;
  color: #1f2937;
  cursor: pointer;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: #6366f1;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
  }
`

const SortSelect = styled(FilterSelect)``

const TableContainer = styled.div`
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`

const TableScroll = styled.div`
  overflow-x: auto;
`

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;

  thead {
    background: #f8fafc;
    border-bottom: 1px solid #e2e8f0;

    th {
      padding: 16px;
      text-align: left;
      font-size: 12px;
      font-weight: 600;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
  }

  tbody {
    tr {
      border-bottom: 1px solid #e2e8f0;
      transition: background-color 0.2s;

      &:hover {
        background-color: #f8fafc;
      }

      td {
        padding: 16px;
        font-size: 14px;
        color: #1f2937;
      }
    }
  }
`

const CampaignTitle = styled(Link)`
  color: #6366f1;
  text-decoration: none;
  font-weight: 600;

  &:hover {
    text-decoration: underline;
  }
`

const StatusBadge = styled.span<{ $status: string }>`
  display: inline-block;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  background-color: ${(props) => {
    switch (props.$status) {
      case 'active':
        return '#dcfce7'
      case 'flagged':
        return '#fef08a'
      case 'suspended':
        return '#fee2e2'
      case 'pending':
        return '#e0e7ff'
      default:
        return '#f1f5f9'
    }
  }};
  color: ${(props) => {
    switch (props.$status) {
      case 'active':
        return '#15803d'
      case 'flagged':
        return '#854d0e'
      case 'suspended':
        return '#991b1b'
      case 'pending':
        return '#3730a3'
      default:
        return '#475569'
    }
  }};
`

const FlagCount = styled.span<{ $count: number }>`
  display: inline-block;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
  background-color: ${(props) => (props.$count > 0 ? '#fee2e2' : '#f1f5f9')};
  color: ${(props) => (props.$count > 0 ? '#dc2626' : '#475569')};
`

const ActionButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: #64748b;
  padding: 4px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;

  &:hover {
    background: #f1f5f9;
    color: #0f172a;
  }

  svg {
    width: 18px;
    height: 18px;
  }
`

const ActionMenu = styled.div<{ $open: boolean }>`
  position: absolute;
  top: 100%;
  right: 0;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 10;
  min-width: 180px;
  display: ${(props) => (props.$open ? 'block' : 'none')};

  button {
    width: 100%;
    padding: 10px 16px;
    border: none;
    background: none;
    cursor: pointer;
    text-align: left;
    color: #0f172a;
    font-size: 14px;
    transition: background-color 0.2s;
    border-bottom: 1px solid #f1f5f9;
    display: flex;
    align-items: center;
    gap: 8px;

    &:last-child {
      border-bottom: none;
    }

    &:hover {
      background-color: #f8fafc;
    }

    &.danger {
      color: #dc2626;
    }

    svg {
      width: 16px;
      height: 16px;
    }
  }
`

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #64748b;

  h3 {
    font-size: 18px;
    font-weight: 600;
    color: #0f172a;
    margin-bottom: 8px;
  }

  p {
    margin-bottom: 24px;
  }
`

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  padding: 20px;
  border-top: 1px solid #e2e8f0;
`

const PaginationButton = styled.button<{ $active?: boolean }>`
  padding: 8px 12px;
  border: 1px solid ${(props) => (props.$active ? '#6366f1' : '#e2e8f0')};
  background: ${(props) => (props.$active ? '#6366f1' : 'white')};
  color: ${(props) => (props.$active ? 'white' : '#0f172a')};
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    border-color: #6366f1;
    background: ${(props) => (props.$active ? '#6366f1' : '#f1f5f9')};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`

// Modal Components
const ModalOverlay = styled.div<{ $isOpen: boolean }>`
  display: ${(props) => (props.$isOpen ? 'flex' : 'none')};
  align-items: center;
  justify-content: center;
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;
`

const ModalContent = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  width: 90%;
`

const ModalHeader = styled.div`
  padding: 20px;
  border-bottom: 1px solid #e5e7eb;
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
`

const ModalBody = styled.div`
  padding: 20px;
`

const ModalFooter = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  padding: 20px;
  border-top: 1px solid #e5e7eb;
  background-color: #f9fafb;
`

const FormGroup = styled.div`
  margin-bottom: 16px;

  label {
    display: block;
    margin-bottom: 8px;
    font-size: 14px;
    font-weight: 600;
    color: #1f2937;
  }

  textarea,
  select {
    width: 100%;
    padding: 10px 12px;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    font-size: 14px;
    font-family: inherit;

    &:focus {
      outline: none;
      border-color: #6366f1;
      box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
    }
  }

  textarea {
    resize: vertical;
    min-height: 80px;
  }
`

interface CampaignModRow {
  id: string
  title: string
  creatorName: string
  goalAmount: number
  raisedAmount: number
  status: string
  flagCount: number
  flags?: Array<{ reason: string }>
  isSuspended: boolean
  suspensionReason?: string
}

export default function CampaignModerationPage() {
  const [statusFilter, setStatusFilter] = useState('all')
  const [sortBy, setSortBy] = useState('newest')
  const [currentPage, setCurrentPage] = useState(1)
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)

  const [flagDialogCampaignId, setFlagDialogCampaignId] = useState<string | null>(null)
  const [flagReason, setFlagReason] = useState('')
  const [flagNotes, setFlagNotes] = useState('')

  const [suspendDialogCampaignId, setSuspendDialogCampaignId] = useState<string | null>(null)
  const [suspendReason, setSuspendReason] = useState('')
  const [suspendDuration, setSuspendDuration] = useState<'7days' | '30days' | 'permanent'>(
    '7days'
  )
  const [notifyCreator, setNotifyCreator] = useState(true)

  const { data: campaigns, isLoading } = useCampaignsForModeration(
    currentPage,
    25,
    statusFilter === 'all' ? undefined : statusFilter,
    sortBy
  )

  const flagMutation = useFlagCampaign()
  const unflagMutation = useUnflagCampaign()
  const suspendMutation = useSuspendCampaign()
  const unsuspendMutation = useUnsuspendCampaign()
  const approveMutation = useApproveCampaign()
  const { showToast } = useToast()

  const pageSize = 25
  const totalPages = campaigns ? Math.ceil(campaigns.total / pageSize) : 1

  const handleFlagSubmit = async () => {
    if (!flagDialogCampaignId || !flagReason) return

    try {
      await flagMutation.mutateAsync({
        campaignId: flagDialogCampaignId,
        reason: flagReason,
        notes: flagNotes || undefined,
      })
      showToast({ type: 'success', message: 'Campaign flagged' })
      setFlagDialogCampaignId(null)
      setFlagReason('')
      setFlagNotes('')
    } catch (error) {
      showToast({
        type: 'error',
        message: error instanceof Error ? error.message : 'Failed to flag campaign',
      })
    }
  }

  const handleSuspendSubmit = async () => {
    if (!suspendDialogCampaignId || !suspendReason) return

    try {
      await suspendMutation.mutateAsync({
        campaignId: suspendDialogCampaignId,
        reason: suspendReason,
        duration: suspendDuration,
        notifyCreator,
      })
      showToast({ type: 'success', message: 'Campaign suspended' })
      setSuspendDialogCampaignId(null)
      setSuspendReason('')
      setSuspendDuration('7days')
      setNotifyCreator(true)
    } catch (error) {
      showToast({
        type: 'error',
        message: error instanceof Error ? error.message : 'Failed to suspend campaign',
      })
    }
  }

  return (
    <Container>
      <PageHeader>Campaign Moderation Queue</PageHeader>

      <Controls>
        <FilterSelect
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value)
            setCurrentPage(1)
          }}
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="flagged">Flagged</option>
          <option value="suspended">Suspended</option>
          <option value="pending">Pending</option>
        </FilterSelect>

        <SortSelect
          value={sortBy}
          onChange={(e) => {
            setSortBy(e.target.value)
            setCurrentPage(1)
          }}
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="flags">Most Flagged</option>
          <option value="goal">Highest Goal</option>
        </SortSelect>
      </Controls>

      <TableContainer>
        {isLoading ? (
          <div style={{ padding: '40px', textAlign: 'center' }}>
            <LoadingSpinner />
          </div>
        ) : campaigns?.campaigns && campaigns.campaigns.length > 0 ? (
          <>
            <TableScroll>
              <StyledTable>
                <thead>
                  <tr>
                    <th>Campaign</th>
                    <th>Creator</th>
                    <th>Goal</th>
                    <th>Status</th>
                    <th>Flags</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {campaigns.campaigns.map((campaign) => (
                    <tr key={campaign.id}>
                      <td>
                        <CampaignTitle href={`/campaigns/${campaign.id}`}>
                          {campaign.title}
                        </CampaignTitle>
                      </td>
                      <td>{campaign.creator_name}</td>
                      <td>{currencyUtils.formatCurrency(campaign.goal_amount)}</td>
                      <td>
                        <StatusBadge $status={campaign.isSuspended ? 'suspended' : campaign.status}>
                          {campaign.isSuspended ? 'Suspended' : campaign.status}
                        </StatusBadge>
                      </td>
                      <td>
                        <FlagCount $count={campaign.flagCount}>{campaign.flagCount}</FlagCount>
                        {campaign.flags && campaign.flags.length > 0 && (
                          <div title={campaign.flags.map((f) => f.reason).join(', ')}>
                            ({campaign.flags.map((f) => f.reason).join(', ')})
                          </div>
                        )}
                      </td>
                      <td style={{ position: 'relative' }}>
                        <ActionButton
                          onClick={() =>
                            setOpenMenuId(openMenuId === campaign.id ? null : campaign.id)
                          }
                        >
                          <MoreVertical size={18} />
                        </ActionButton>
                        <ActionMenu $open={openMenuId === campaign.id}>
                          <Link href={`/campaigns/${campaign.id}`}>
                            <button>
                              <Eye size={16} />
                              View
                            </button>
                          </Link>
                          {!campaign.isSuspended && (
                            <>
                              {campaign.flagCount === 0 && (
                                <button onClick={() => setFlagDialogCampaignId(campaign.id)}>
                                  <Flag size={16} />
                                  Flag
                                </button>
                              )}
                              {campaign.flagCount > 0 && (
                                <button onClick={() => setSuspendDialogCampaignId(campaign.id)}>
                                  <Ban size={16} />
                                  Suspend
                                </button>
                              )}
                              <button onClick={() => approveMutation.mutate(campaign.id)}>
                                <CheckCircle size={16} />
                                Approve
                              </button>
                            </>
                          )}
                          {campaign.isSuspended && (
                            <button onClick={() => unsuspendMutation.mutate(campaign.id)}>
                              <LinkIcon size={16} />
                              Unsuspend
                            </button>
                          )}
                        </ActionMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </StyledTable>
            </TableScroll>

            {totalPages > 1 && (
              <PaginationContainer>
                <PaginationButton
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(currentPage - 1)}
                >
                  Previous
                </PaginationButton>
                {Array.from({ length: totalPages }).map((_, i) => (
                  <PaginationButton
                    key={i + 1}
                    $active={currentPage === i + 1}
                    onClick={() => setCurrentPage(i + 1)}
                  >
                    {i + 1}
                  </PaginationButton>
                ))}
                <PaginationButton
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(currentPage + 1)}
                >
                  Next
                </PaginationButton>
              </PaginationContainer>
            )}
          </>
        ) : (
          <EmptyState>
            <h3>No campaigns found</h3>
            <p>Try adjusting your filters</p>
          </EmptyState>
        )}
      </TableContainer>

      {/* Flag Campaign Modal */}
      <ModalOverlay
        $isOpen={!!flagDialogCampaignId}
        onClick={() => setFlagDialogCampaignId(null)}
      >
        <ModalContent onClick={(e) => e.stopPropagation()}>
          <ModalHeader>
            <AlertCircle size={20} style={{ marginRight: '8px', display: 'inline' }} />
            Flag Campaign
          </ModalHeader>
          <ModalBody>
            <FormGroup>
              <label>Reason</label>
              <select value={flagReason} onChange={(e) => setFlagReason(e.target.value)}>
                <option value="">Select a reason...</option>
                <option value="spam">Spam</option>
                <option value="inappropriate">Inappropriate Content</option>
                <option value="fraud">Suspected Fraud</option>
                <option value="scam">Scam</option>
                <option value="misleading">Misleading Information</option>
                <option value="other">Other</option>
              </select>
            </FormGroup>
            <FormGroup>
              <label>Notes (optional)</label>
              <textarea
                value={flagNotes}
                onChange={(e) => setFlagNotes(e.target.value)}
                placeholder="Add any additional notes..."
              />
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            <Button variant="outline" onClick={() => setFlagDialogCampaignId(null)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleFlagSubmit}
              disabled={flagMutation.isPending || !flagReason}
            >
              {flagMutation.isPending ? 'Flagging...' : 'Flag Campaign'}
            </Button>
          </ModalFooter>
        </ModalContent>
      </ModalOverlay>

      {/* Suspend Campaign Modal */}
      <ModalOverlay
        $isOpen={!!suspendDialogCampaignId}
        onClick={() => setSuspendDialogCampaignId(null)}
      >
        <ModalContent onClick={(e) => e.stopPropagation()}>
          <ModalHeader>
            <Ban size={20} style={{ marginRight: '8px', display: 'inline' }} />
            Suspend Campaign
          </ModalHeader>
          <ModalBody>
            <FormGroup>
              <label>Reason</label>
              <select value={suspendReason} onChange={(e) => setSuspendReason(e.target.value)}>
                <option value="">Select a reason...</option>
                <option value="flag_violation">Multiple Flags</option>
                <option value="policy_violation">Policy Violation</option>
                <option value="fraud">Fraud Detected</option>
                <option value="inactivity">Inactive Campaign</option>
                <option value="other">Other</option>
              </select>
            </FormGroup>
            <FormGroup>
              <label>Duration</label>
              <select
                value={suspendDuration}
                onChange={(e) => setSuspendDuration(e.target.value as any)}
              >
                <option value="7days">7 Days</option>
                <option value="30days">30 Days</option>
                <option value="permanent">Permanent</option>
              </select>
            </FormGroup>
            <FormGroup>
              <label style={{ display: 'flex', alignItems: 'center', marginBottom: '0px' }}>
                <input
                  type="checkbox"
                  checked={notifyCreator}
                  onChange={(e) => setNotifyCreator(e.target.checked)}
                  style={{ marginRight: '8px' }}
                />
                Notify Creator
              </label>
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            <Button variant="outline" onClick={() => setSuspendDialogCampaignId(null)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleSuspendSubmit}
              disabled={suspendMutation.isPending || !suspendReason}
            >
              {suspendMutation.isPending ? 'Suspending...' : 'Suspend Campaign'}
            </Button>
          </ModalFooter>
        </ModalContent>
      </ModalOverlay>
    </Container>
  )
}
