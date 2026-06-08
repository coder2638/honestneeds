'use client'

import React, { useState, useMemo } from 'react'
import styled from 'styled-components'
import { ChevronDown, Trash2, Check, AlertCircle, Search } from 'lucide-react'
import { useAdminModerationQueue, useBulkApprovePrayers, useBulkRejectPrayers, useBulkFlagPrayers } from '@/api/hooks/useAdminPrayers'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import { Button } from '@/components/Button'
import { Card } from '@/components/Card'
import { COLORS, SPACING, TYPOGRAPHY } from '@/styles/tokens'

/**
 * Admin Prayer Moderation Queue
 * Global view of all prayers pending moderation
 */

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${SPACING[6]};
`

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: ${SPACING[4]};
`

const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${COLORS.TEXT};
  margin: 0;
`

const FilterBar = styled.div`
  display: flex;
  gap: ${SPACING[3]};
  flex-wrap: wrap;
  align-items: center;
`

const FilterSelect = styled.select`
  padding: ${SPACING[2]} ${SPACING[3]};
  border: 1px solid ${COLORS.BORDER};
  border-radius: 0.375rem;
  font-size: ${TYPOGRAPHY.SIZE_SM};
  background: ${COLORS.SURFACE};
  color: ${COLORS.TEXT};
  cursor: pointer;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: ${COLORS.PRIMARY};
  }
`

const SearchInput = styled.input`
  padding: ${SPACING[2]} ${SPACING[3]};
  border: 1px solid ${COLORS.BORDER};
  border-radius: 0.375rem;
  font-size: ${TYPOGRAPHY.SIZE_SM};
  width: 200px;
  background: ${COLORS.SURFACE};
  color: ${COLORS.TEXT};
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: ${COLORS.PRIMARY};
  }

  &::placeholder {
    color: ${COLORS.MUTED_TEXT};
  }
`

const ActionBar = styled.div<{ show: boolean }>`
  display: ${(props) => props.show ? 'flex' : 'none'};
  gap: ${SPACING[2]};
  align-items: center;
  padding: ${SPACING[3]};
  background: #dcfce7;
  border: 1px solid #bbf7d0;
  border-radius: 0.375rem;
`

const SelectionCount = styled.span`
  font-size: ${TYPOGRAPHY.SIZE_SM};
  color: #166534;
  font-weight: 600;
`

const ReasonSelect = styled.select`
  padding: ${SPACING[1]} ${SPACING[2]};
  border: 1px solid ${COLORS.BORDER};
  border-radius: 0.25rem;
  font-size: 0.75rem;
  background: ${COLORS.SURFACE};
  color: ${COLORS.TEXT};
  cursor: pointer;
`

const TableContainer = styled.div`
  overflow-x: auto;
  border: 1px solid ${COLORS.BORDER};
  border-radius: 0.5rem;
`

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: ${TYPOGRAPHY.SIZE_SM};
`

const Th = styled.th`
  padding: ${SPACING[3]};
  text-align: left;
  background: ${COLORS.BG};
  border-bottom: 1px solid ${COLORS.BORDER};
  font-weight: 600;
  color: ${COLORS.TEXT};

  input {
    cursor: pointer;
  }
`

const Td = styled.td`
  padding: ${SPACING[3]};
  border-bottom: 1px solid ${COLORS.BORDER};
  color: ${COLORS.MUTED_TEXT};

  &:first-child {
    width: 40px;
  }
`

const Tr = styled.tr<{ selected?: boolean }>`
  background: ${(props) => (props.selected ? '#eff6ff' : COLORS.SURFACE)};
  transition: background 0.2s;

  &:hover {
    background: ${(props) => (props.selected ? '#eff6ff' : COLORS.BG)};
  }
`

const PrayerContent = styled.div`
  max-width: 300px;
  word-break: break-word;
  line-height: 1.4;
`

const BadgeGroup = styled.div`
  display: flex;
  gap: ${SPACING[1]};
  flex-wrap: wrap;
`

const Badge = styled.span<{ variant?: string }>`
  padding: ${SPACING[1]} ${SPACING[2]};
  border-radius: 0.25rem;
  font-size: 0.6875rem;
  font-weight: 600;
  white-space: nowrap;

  ${(props) => {
    switch (props.variant) {
      case 'flagged':
        return 'background: #fef3c7; color: #92400e;'
      case 'submitted':
        return `background: #dbeafe; color: #0c4a6e;`
      case 'reported':
        return 'background: #fee2e2; color: #991b1b;'
      case 'type-text':
        return 'background: #e0e7ff; color: #3730a3;'
      case 'type-voice':
        return 'background: #dcfce7; color: #166534;'
      case 'type-video':
        return 'background: #fed7aa; color: #92400e;'
      default:
        return `background: ${COLORS.BG}; color: ${COLORS.TEXT};`
    }
  }}
`

const EmptyState = styled.div`
  padding: ${SPACING[10]};
  text-align: center;
  color: ${COLORS.MUTED_TEXT};
  font-size: ${TYPOGRAPHY.SIZE_SM};
`

const RejectReasonModal = styled.div<{ show: boolean }>`
  display: ${(props) => (props.show ? 'fixed' : 'none')};
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`

const Modal = styled.div`
  background: ${COLORS.SURFACE};
  border-radius: 0.5rem;
  padding: ${SPACING[6]};
  max-width: 400px;
  width: 90%;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
`

const ModalTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 700;
  margin: 0 0 ${SPACING[4]} 0;
  color: ${COLORS.TEXT};
`

const ModalSelect = styled.select`
  width: 100%;
  padding: ${SPACING[2]};
  border: 1px solid ${COLORS.BORDER};
  border-radius: 0.375rem;
  font-size: ${TYPOGRAPHY.SIZE_SM};
  background: ${COLORS.SURFACE};
  color: ${COLORS.TEXT};
  margin-bottom: ${SPACING[4]};
`

const ModalButtons = styled.div`
  display: flex;
  gap: ${SPACING[2]};
  justify-content: flex-end;
`

interface PrayerModerationType {
  prayer_id: string
  campaign_id: { _id: string; title: string; creator_id: string }
  type: string
  content?: string
  status: string
  report_count: number
  is_anonymous: boolean
  created_at: string
  supporter_id?: { _id: string; name: string }
}

export default function PrayerModerationQueue() {
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [filters, setFilters] = useState({
    status: ['submitted', 'flagged'],
    sortBy: 'created_at',
    sortOrder: -1,
    limit: 50,
    offset: 0,
  })
  const [showRejectModal, setShowRejectModal] = useState(false)
  const [rejectReason, setRejectReason] = useState('')

  // Queries
  const { data: queueData, isLoading } = useAdminModerationQueue(filters)
  const { mutate: bulkApprove, isPending: isApproving } = useBulkApprovePrayers()
  const { mutate: bulkReject, isPending: isRejecting } = useBulkRejectPrayers()
  const { mutate: bulkFlag, isPending: isFlagging } = useBulkFlagPrayers()

  const prayers = queueData?.prayers || []
  const total = queueData?.pagination?.total || 0

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(prayers.map((p) => p._id))
    } else {
      setSelectedIds([])
    }
  }

  const handleSelectPrayer = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds([...selectedIds, id])
    } else {
      setSelectedIds(selectedIds.filter((sid) => sid !== id))
    }
  }

  const handleApprove = () => {
    if (selectedIds.length === 0) return
    bulkApprove(selectedIds)
    setSelectedIds([])
  }

  const handleRejectClick = () => {
    if (selectedIds.length === 0) return
    setShowRejectModal(true)
  }

  const handleRejectSubmit = () => {
    if (selectedIds.length === 0 || !rejectReason) return
    bulkReject({ prayerIds: selectedIds, reason: rejectReason })
    setSelectedIds([])
    setRejectReason('')
    setShowRejectModal(false)
  }

  const handleFlag = () => {
    if (selectedIds.length === 0) return
    bulkFlag({ prayerIds: selectedIds, reason: 'admin_flag' })
    setSelectedIds([])
  }

  if (isLoading) {
    return <LoadingSpinner />
  }

  return (
    <Container>
      <Header>
        <Title>🙏 Prayer Moderation Queue</Title>
        <BadgeGroup>
          <Badge variant="submitted">
            Submitted: {queueData?.stats?.submitted || 0}
          </Badge>
          <Badge variant="flagged">
            Flagged: {queueData?.stats?.flagged || 0}
          </Badge>
          <Badge variant="reported">
            Reported: {queueData?.stats?.rejected || 0}
          </Badge>
        </BadgeGroup>
      </Header>

      <FilterBar>
        <FilterSelect
          multiple
          value={filters.status}
          onChange={(e) =>
            setFilters({
              ...filters,
              status: Array.from(e.target.selectedOptions, (opt) => opt.value),
            })
          }
        >
          <option value="submitted">Submitted</option>
          <option value="flagged">Flagged</option>
          <option value="rejected">Rejected</option>
          <option value="approved">Approved</option>
        </FilterSelect>

        <FilterSelect
          value={filters.sortBy}
          onChange={(e) =>
            setFilters({ ...filters, sortBy: e.target.value })
          }
        >
          <option value="created_at">Newest First</option>
          <option value="report_count">Most Reported</option>
          <option value="type">Prayer Type</option>
        </FilterSelect>

        <SearchInput
          placeholder="Search campaign..."
          onChange={(e) => {
            // Implement search logic
          }}
        />

        <span style={{ marginLeft: 'auto', fontSize: '12px', color: '#6b7280' }}>
          Showing {prayers.length} of {total} prayers
        </span>
      </FilterBar>

      <ActionBar show={selectedIds.length > 0}>
        <SelectionCount>{selectedIds.length} selected</SelectionCount>

        <Button
          onClick={handleApprove}
          disabled={isApproving}
          style={{ background: '#10b981', color: 'white', marginLeft: 'auto' }}
        >
          <Check size={16} />
          Approve Selected
        </Button>

        <Button
          onClick={handleRejectClick}
          disabled={isRejecting}
          style={{ background: '#ef4444', color: 'white' }}
        >
          <Trash2 size={16} />
          Reject Selected
        </Button>

        <Button
          onClick={handleFlag}
          disabled={isFlagging}
          style={{ background: '#f59e0b', color: 'white' }}
        >
          <AlertCircle size={16} />
          Flag Selected
        </Button>
      </ActionBar>

      {prayers.length === 0 ? (
        <EmptyState>
          <p>No prayers pending moderation</p>
          <p style={{ fontSize: '12px' }}>All caught up! ✨</p>
        </EmptyState>
      ) : (
        <TableContainer>
          <Table>
            <thead>
              <tr>
                <Th>
                  <input
                    type="checkbox"
                    checked={selectedIds.length === prayers.length}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                  />
                </Th>
                <Th>Prayer</Th>
                <Th>Campaign</Th>
                <Th>Type</Th>
                <Th>Status</Th>
                <Th>Reports</Th>
                <Th>Date</Th>
              </tr>
            </thead>
            <tbody>
              {prayers.map((prayer: PrayerModerationType) => (
                <Tr
                  key={prayer._id}
                  selected={selectedIds.includes(prayer._id)}
                >
                  <Td>
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(prayer._id)}
                      onChange={(e) =>
                        handleSelectPrayer(prayer._id, e.target.checked)
                      }
                    />
                  </Td>
                  <Td>
                    <PrayerContent>
                      {prayer.content
                        ? prayer.content.substring(0, 60) + '...'
                        : `[${prayer.type}]`}
                    </PrayerContent>
                  </Td>
                  <Td>{prayer.campaign_id?.title || 'Unknown'}</Td>
                  <Td>
                    <Badge variant={`type-${prayer.type}`}>
                      {prayer.type}
                    </Badge>
                  </Td>
                  <Td>
                    <Badge
                      variant={
                        prayer.status === 'flagged' ? 'flagged' : 'submitted'
                      }
                    >
                      {prayer.status}
                    </Badge>
                  </Td>
                  <Td>
                    {prayer.report_count > 0 ? (
                      <Badge variant="reported">{prayer.report_count}</Badge>
                    ) : (
                      '0'
                    )}
                  </Td>
                  <Td>
                    {new Date(prayer.created_at).toLocaleDateString()}
                  </Td>
                </Tr>
              ))}
            </tbody>
          </Table>
        </TableContainer>
      )}

      {/* Reject Reason Modal */}
      <RejectReasonModal show={showRejectModal}>
        <Modal>
          <ModalTitle>Reason for Rejection</ModalTitle>
          <ModalSelect
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
          >
            <option value="">Select a reason...</option>
            <option value="profanity_detected">Profanity Detected</option>
            <option value="spam_pattern">Spam Pattern</option>
            <option value="inappropriate_content">Inappropriate Content</option>
            <option value="harassment">Harassment</option>
            <option value="other">Other</option>
          </ModalSelect>
          <ModalButtons>
            <Button
              onClick={() => setShowRejectModal(false)}
              style={{ background: '#f3f4f6' }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleRejectSubmit}
              disabled={!rejectReason}
              style={{ background: '#ef4444', color: 'white' }}
            >
              Reject
            </Button>
          </ModalButtons>
        </Modal>
      </RejectReasonModal>
    </Container>
  )
}
