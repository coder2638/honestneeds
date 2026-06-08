'use client'

import React, { useState } from 'react'
import styled from 'styled-components'
import { CheckCircle, XCircle, Clock, Eye } from 'lucide-react'
import {
  useTransactionsForVerification,
  useVerifyTransaction,
  useRejectTransaction,
  useBulkVerifyTransactions,
  useBulkRejectTransactions,
} from '@/api/hooks/useAdmin'
import { useToast } from '@/hooks/useToast'
import { Button } from '@/components/Button'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import { currencyUtils } from '@/utils/validationSchemas'

/**
 * Transaction Verification
 * Admin review and verify donations
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
  align-items: center;

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

const BulkActionButtons = styled.div`
  display: flex;
  gap: 8px;
  margin-left: auto;

  @media (max-width: 768px) {
    margin-left: 0;
  }
`

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

      input[type='checkbox'] {
        cursor: pointer;
      }
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

        input[type='checkbox'] {
          cursor: pointer;
        }
      }
    }
  }
`

const StatusBadge = styled.span<{ $status: string }>`
  display: inline-block;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 6px;
  background-color: ${(props) => {
    switch (props.$status) {
      case 'verified':
        return '#dcfce7'
      case 'pending':
        return '#fef3c7'
      case 'rejected':
        return '#fee2e2'
      default:
        return '#f1f5f9'
    }
  }};
  color: ${(props) => {
    switch (props.$status) {
      case 'verified':
        return '#15803d'
      case 'pending':
        return '#854d0e'
      case 'rejected':
        return '#991b1b'
      default:
        return '#475569'
    }
  }};
`

const ActionButtons = styled.div`
  display: flex;
  gap: 8px;

  button {
    padding: 6px 12px;
    font-size: 12px;
    border: 1px solid #d1d5db;
    background: white;
    color: #1f2937;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
      border-color: #6366f1;
      background: #6366f1;
      color: white;
    }

    &.reject {
      color: #dc2626;
      border-color: #fca5a5;

      &:hover {
        background: #dc2626;
        border-color: #dc2626;
        color: white;
      }
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

// Modal for rejection reason
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

  textarea {
    width: 100%;
    padding: 10px 12px;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    font-size: 14px;
    font-family: inherit;
    min-height: 80px;
    resize: vertical;

    &:focus {
      outline: none;
      border-color: #6366f1;
      box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
    }
  }
`

const ModalFooter = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  padding: 20px;
  border-top: 1px solid #e5e7eb;
  background-color: #f9fafb;
`

interface Transaction {
  id: string
  campaignTitle: string
  donorName: string
  donorEmail: string
  amount: number
  paymentMethod: string
  status: 'pending' | 'verified' | 'rejected'
  createdAt: string
}

export default function TransactionVerificationPage() {
  const [statusFilter, setStatusFilter] = useState('pending')
  const [sortBy, setSortBy] = useState('date-desc')
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedTransactions, setSelectedTransactions] = useState<Set<string>>(new Set())

  const [rejectDialogId, setRejectDialogId] = useState<string | null>(null)
  const [rejectReason, setRejectReason] = useState('')

  const { data: transactions, isLoading } = useTransactionsForVerification(
    currentPage,
    25,
    statusFilter === 'all' ? undefined : statusFilter,
    sortBy
  )

  const verifyMutation = useVerifyTransaction()
  const rejectMutation = useRejectTransaction()
  const bulkVerifyMutation = useBulkVerifyTransactions()
  const bulkRejectMutation = useBulkRejectTransactions()
  const { showToast } = useToast()

  const pageSize = 25
  const totalPages = transactions ? Math.ceil(transactions.total / pageSize) : 1

  const handleSelectAll = (checked: boolean) => {
    if (checked && transactions?.transactions) {
      setSelectedTransactions(new Set(transactions.transactions.map((t) => t.id)))
    } else {
      setSelectedTransactions(new Set())
    }
  }

  const handleSelectTransaction = (id: string, checked: boolean) => {
    const newSet = new Set(selectedTransactions)
    if (checked) {
      newSet.add(id)
    } else {
      newSet.delete(id)
    }
    setSelectedTransactions(newSet)
  }

  const handleBulkVerify = async () => {
    if (selectedTransactions.size === 0) return

    try {
      await bulkVerifyMutation.mutateAsync(Array.from(selectedTransactions))
      showToast({ type: 'success', message: `${selectedTransactions.size} transactions verified` })
      setSelectedTransactions(new Set())
    } catch (error) {
      showToast({
        type: 'error',
        message: error instanceof Error ? error.message : 'Failed to verify transactions',
      })
    }
  }

  const handleBulkReject = async () => {
    if (selectedTransactions.size === 0) return

    try {
      await bulkRejectMutation.mutateAsync({
        transactionIds: Array.from(selectedTransactions),
        reason: 'Bulk rejection by admin',
      })
      showToast({ type: 'success', message: `${selectedTransactions.size} transactions rejected` })
      setSelectedTransactions(new Set())
    } catch (error) {
      showToast({
        type: 'error',
        message: error instanceof Error ? error.message : 'Failed to reject transactions',
      })
    }
  }

  const handleRejectSingle = async () => {
    if (!rejectDialogId || !rejectReason) return

    try {
      await rejectMutation.mutateAsync({
        transactionId: rejectDialogId,
        reason: rejectReason,
      })
      showToast({ type: 'success', message: 'Transaction rejected' })
      setRejectDialogId(null)
      setRejectReason('')
    } catch (error) {
      showToast({
        type: 'error',
        message: error instanceof Error ? error.message : 'Failed to reject transaction',
      })
    }
  }

  const allSelected =
    selectedTransactions.size > 0 &&
    transactions?.transactions &&
    selectedTransactions.size === transactions.transactions.length

  return (
    <Container>
      <PageHeader>Transaction Verification</PageHeader>

      <Controls>
        <FilterSelect
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value)
            setCurrentPage(1)
            setSelectedTransactions(new Set())
          }}
        >
          <option value="pending">Pending</option>
          <option value="verified">Verified</option>
          <option value="rejected">Rejected</option>
          <option value="all">All</option>
        </FilterSelect>

        <SortSelect
          value={sortBy}
          onChange={(e) => {
            setSortBy(e.target.value)
            setCurrentPage(1)
          }}
        >
          <option value="date-desc">Newest First</option>
          <option value="date-asc">Oldest First</option>
          <option value="amount-desc">Highest Amount</option>
          <option value="amount-asc">Lowest Amount</option>
        </SortSelect>

        {selectedTransactions.size > 0 && (
          <BulkActionButtons>
            <Button
              variant="primary"
              onClick={handleBulkVerify}
              disabled={bulkVerifyMutation.isPending}
            >
              Verify {selectedTransactions.size}
            </Button>
            <Button
              variant="outline"
              onClick={handleBulkReject}
              disabled={bulkRejectMutation.isPending}
            >
              Reject {selectedTransactions.size}
            </Button>
          </BulkActionButtons>
        )}
      </Controls>

      <TableContainer>
        {isLoading ? (
          <div style={{ padding: '40px', textAlign: 'center' }}>
            <LoadingSpinner />
          </div>
        ) : transactions?.transactions && transactions.transactions.length > 0 ? (
          <>
            <TableScroll>
              <StyledTable>
                <thead>
                  <tr>
                    <th>
                      <input
                        type="checkbox"
                        checked={allSelected}
                        onChange={(e) => handleSelectAll(e.target.checked)}
                      />
                    </th>
                    <th>Amount</th>
                    <th>Campaign</th>
                    <th>Donor</th>
                    <th>Method</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.transactions.map((transaction) => (
                    <tr key={transaction.id}>
                      <td>
                        <input
                          type="checkbox"
                          checked={selectedTransactions.has(transaction.id)}
                          onChange={(e) =>
                            handleSelectTransaction(transaction.id, e.target.checked)
                          }
                        />
                      </td>
                      <td>{currencyUtils.formatCurrency(transaction.amount)}</td>
                      <td>{transaction.campaignTitle}</td>
                      <td>
                        {transaction.donorName}
                        <br />
                        <span style={{ fontSize: '12px', color: '#6b7280' }}>
                          {transaction.donorEmail}
                        </span>
                      </td>
                      <td>{transaction.paymentMethod}</td>
                      <td>{new Date(transaction.createdAt).toLocaleDateString()}</td>
                      <td>
                        <StatusBadge $status={transaction.status}>
                          {transaction.status === 'verified' && (
                            <CheckCircle size={14} />
                          )}
                          {transaction.status === 'pending' && <Clock size={14} />}
                          {transaction.status === 'rejected' && <XCircle size={14} />}
                          {transaction.status.charAt(0).toUpperCase() +
                            transaction.status.slice(1)}
                        </StatusBadge>
                      </td>
                      <td>
                        {transaction.status === 'pending' && (
                          <ActionButtons>
                            <button
                              onClick={() =>
                                verifyMutation.mutate(transaction.id)
                              }
                              disabled={verifyMutation.isPending}
                            >
                              Verify
                            </button>
                            <button
                              className="reject"
                              onClick={() => setRejectDialogId(transaction.id)}
                            >
                              Reject
                            </button>
                          </ActionButtons>
                        )}
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
                {Array.from({ length: Math.min(totalPages, 10) }).map((_, i) => (
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
            <h3>No transactions found</h3>
            <p>All transactions in this status have been processed</p>
          </EmptyState>
        )}
      </TableContainer>

      {/* Reject Reason Modal */}
      <ModalOverlay $isOpen={!!rejectDialogId} onClick={() => setRejectDialogId(null)}>
        <ModalContent onClick={(e) => e.stopPropagation()}>
          <ModalHeader>
            <XCircle size={20} style={{ marginRight: '8px', display: 'inline' }} />
            Reject Transaction
          </ModalHeader>
          <ModalBody>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>
              Rejection Reason
            </label>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Explain why this transaction is being rejected..."
            />
          </ModalBody>
          <ModalFooter>
            <Button variant="outline" onClick={() => setRejectDialogId(null)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleRejectSingle}
              disabled={rejectMutation.isPending || !rejectReason}
            >
              {rejectMutation.isPending ? 'Rejecting...' : 'Reject'}
            </Button>
          </ModalFooter>
        </ModalContent>
      </ModalOverlay>
    </Container>
  )
}
