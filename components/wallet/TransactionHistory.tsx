/**
 * Transaction History Component
 * Displays list of wallet transactions
 */

'use client'

import React, { useState } from 'react'
import styled from 'styled-components'
import {
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle,
  AlertCircle,
  ChevronDown,
  ChevronUp
} from 'lucide-react'
import { useTransactionHistory } from '@/api/hooks/useWallet'
import { LoadingSpinner } from '@/components/LoadingSpinner'

const Container = styled.div`
  width: 100%;
`

const FilterBar = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
`

const FilterButton = styled.button<{ active?: boolean }>`
  padding: 0.5rem 1rem;
  border-radius: 6px;
  border: 1px solid #e2e8f0;
  background: ${(props) => (props.active ? '#667eea' : 'white')};
  color: ${(props) => (props.active ? 'white' : '#64748b')};
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.2s;

  &:hover {
    border-color: #667eea;
    ${(props) => !props.$active && 'color: #667eea;'}
  }
`

const Table = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
  background: white;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  overflow: hidden;
`

const TableRow = styled.div<{ expandable?: boolean }>`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr auto;
  gap: 1.5rem;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid #e2e8f0;
  align-items: center;
  transition: background 0.2s;

  &:hover {
    background: #f8fafc;
  }

  &:last-child {
    border-bottom: none;
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr auto;
    gap: 1rem;
  }
`

const TableHeader = styled(TableRow)`
  background: #f8fafc;
  font-weight: 600;
  font-size: 0.875rem;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.05em;

  &:hover {
    background: #f8fafc;
  }
`

const TransactionType = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`

const TypeIcon = styled.div<{ type: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  background: ${(props) => {
    switch (props.type) {
      case 'reward':
      case 'commission':
        return '#dcfce7'
      case 'deposit':
        return '#dbeafe'
      case 'withdrawal':
        return '#fef3c7'
      default:
        return '#f1f5f9'
    }
  }};
  color: ${(props) => {
    switch (props.type) {
      case 'reward':
      case 'commission':
        return '#16a34a'
      case 'deposit':
        return '#0284c7'
      case 'withdrawal':
        return '#ca8a04'
      default:
        return '#64748b'
    }
  }};

  svg {
    width: 1.25rem;
    height: 1.25rem;
  }
`

const TypeLabel = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
`

const TypeName = styled.span`
  font-weight: 600;
  color: #0f172a;
  text-transform: capitalize;
`

const TypeDescription = styled.span`
  font-size: 0.75rem;
  color: #94a3b8;
`

const Amount = styled.div<{ positive?: boolean }>`
  text-align: right;
  color: ${(props) => (props.positive ? '#16a34a' : '#dc2626')};
  font-weight: 600;
  font-size: 1rem;

  @media (max-width: 768px) {
    display: none;
  }
`

const Date = styled.div`
  color: #64748b;
  font-size: 0.875rem;
  text-align: right;

  @media (max-width: 768px) {
    display: none;
  }
`

const Status = styled.div<{ status: string }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.375rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  width: fit-content;
  margin-left: auto;

  background: ${(props) => {
    switch (props.status) {
      case 'completed':
        return '#dcfce7'
      case 'pending':
        return '#fef3c7'
      case 'failed':
        return '#fee2e2'
      default:
        return '#f1f5f9'
    }
  }};

  color: ${(props) => {
    switch (props.status) {
      case 'completed':
        return '#166534'
      case 'pending':
        return '#713f12'
      case 'failed':
        return '#7f1d1d'
      default:
        return '#475569'
    }
  }};

  svg {
    width: 1rem;
    height: 1rem;
  }

  @media (max-width: 768px) {
    grid-column: 2;
    grid-row: 1;
  }
`

const ExpandButton = styled.button`
  background: none;
  border: none;
  color: #64748b;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;

  &:hover {
    color: #0f172a;
    background: #f1f5f9;
    border-radius: 6px;
  }

  svg {
    width: 1.25rem;
    height: 1.25rem;
  }

  @media (max-width: 768px) {
    display: none;
  }
`

const ExpandedContent = styled.div`
  padding: 1.5rem 1.5rem 0 1.5rem;
  background: #f8fafc;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1rem;
`

const ExpandedField = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;

  label {
    font-size: 0.75rem;
    color: #94a3b8;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    font-weight: 600;
  }

  value {
    font-size: 0.875rem;
    color: #0f172a;
    font-weight: 500;
  }
`

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem 2rem;
  color: #64748b;

  svg {
    width: 3rem;
    height: 3rem;
    margin-bottom: 1rem;
    opacity: 0.5;
  }

  h3 {
    font-size: 1.125rem;
    font-weight: 600;
    color: #0f172a;
    margin-bottom: 0.5rem;
  }

  p {
    font-size: 0.875rem;
  }
`

const PaginationControls = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e2e8f0;
`

const PaginationButton = styled.button<{ disabled?: boolean }>`
  padding: 0.5rem 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  background: white;
  color: #667eea;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    border-color: #667eea;
    background: #f8fafc;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    color: #94a3b8;
  }
`

const PageInfo = styled.span`
  color: #64748b;
  font-size: 0.875rem;
`

export interface TransactionHistoryProps {
  limit?: number
  showFilters?: boolean
}

/**
 * Transaction History Component
 */
export const TransactionHistory: React.FC<TransactionHistoryProps> = ({ limit = 20, showFilters = true }) => {
  const [page, setPage] = useState(1)
  const [typeFilter, setTypeFilter] = useState('all')
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set())

  const { data: transactionData, isLoading } = useTransactionHistory(
    page,
    limit,
    typeFilter === 'all' ? 'all' : (typeFilter as any)
  )

  if (isLoading) {
    return <LoadingSpinner />
  }

  const transactions = transactionData?.transactions || []
  const pagination = transactionData?.pagination || { page: 1, pages: 1, total: 0 }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'reward':
      case 'commission':
        return <TrendingUp size={20} />
      case 'withdrawal':
        return <TrendingDown size={20} />
      case 'deposit':
        return <TrendingUp size={20} />
      default:
        return <Clock size={20} />
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle size={16} />
      case 'pending':
        return <Clock size={16} />
      case 'failed':
        return <AlertCircle size={16} />
      default:
        return <Clock size={16} />
    }
  }

  const formatCurrency = (cents: number) => {
    return (cents / 100).toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD'
    })
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const toggleRow = (transactionId: string) => {
    const newExpanded = new Set(expandedRows)
    if (newExpanded.has(transactionId)) {
      newExpanded.delete(transactionId)
    } else {
      newExpanded.add(transactionId)
    }
    setExpandedRows(newExpanded)
  }

  if (transactions.length === 0) {
    return (
      <Container>
        {showFilters && (
          <FilterBar>
            <FilterButton $active={typeFilter === 'all'} onClick={() => setTypeFilter('all')}>
              All Types
            </FilterButton>
            <FilterButton $active={typeFilter === 'reward'} onClick={() => setTypeFilter('reward')}>
              Rewards
            </FilterButton>
            <FilterButton $active={typeFilter === 'withdrawal'} onClick={() => setTypeFilter('withdrawal')}>
              Withdrawals
            </FilterButton>
            <FilterButton $active={typeFilter === 'deposit'} onClick={() => setTypeFilter('deposit')}>
              Deposits
            </FilterButton>
          </FilterBar>
        )}

        <EmptyState>
          <Clock />
          <h3>No transactions yet</h3>
          <p>Your transaction history will appear here once you earn rewards or request payouts.</p>
        </EmptyState>
      </Container>
    )
  }

  return (
    <Container>
      {showFilters && (
        <FilterBar>
          <FilterButton active={typeFilter === 'all'} onClick={() => setTypeFilter('all')}>
            All Types
          </FilterButton>
          <FilterButton active={typeFilter === 'reward'} onClick={() => setTypeFilter('reward')}>
            Rewards
          </FilterButton>
          <FilterButton active={typeFilter === 'withdrawal'} onClick={() => setTypeFilter('withdrawal')}>
            Withdrawals
          </FilterButton>
          <FilterButton active={typeFilter === 'deposit'} onClick={() => setTypeFilter('deposit')}>
            Deposits
          </FilterButton>
        </FilterBar>
      )}

      <Table>
        <TableHeader>
          <div />
          <div>Description</div>
          <div>Amount</div>
          <div>Date</div>
          <div>Status</div>
          <div />
        </TableHeader>

        {transactions.map((transaction) => {
          const isExpanded = expandedRows.has(transaction.id)
          const isPositive = ['reward', 'commission', 'deposit'].includes(transaction.type)

          return (
            <React.Fragment key={transaction.id}>
              <TableRow expandable={true}>
                <TransactionType>
                  <TypeIcon type={transaction.type}>{getTypeIcon(transaction.type)}</TypeIcon>
                  <TypeLabel>
                    <TypeName>{transaction.type}</TypeName>
                    <TypeDescription>{transaction.description}</TypeDescription>
                  </TypeLabel>
                </TransactionType>

                <div style={{ display: 'none' }} />

                <Amount positive={isPositive}>
                  {isPositive ? '+' : '-'}
                  {formatCurrency(Math.abs(transaction.amount))}
                </Amount>

                <Date>{formatDate(transaction.created_at)}</Date>

                <Status status={transaction.status}>
                  {getStatusIcon(transaction.status)}
                  {transaction.status}
                </Status>

                <ExpandButton onClick={() => toggleRow(transaction.id)} title="View details">
                  {isExpanded ? <ChevronUp /> : <ChevronDown />}
                </ExpandButton>
              </TableRow>

              {isExpanded && (
                <ExpandedContent>
                  <ExpandedField>
                    <label>Transaction ID</label>
                    <value>{transaction.id}</value>
                  </ExpandedField>
                  <ExpandedField>
                    <label>Amount</label>
                    <value>{formatCurrency(transaction.amount)} USD</value>
                  </ExpandedField>
                  <ExpandedField>
                    <label>Type</label>
                    <value style={{ textTransform: 'capitalize' }}>{transaction.type}</value>
                  </ExpandedField>
                  <ExpandedField>
                    <label>Date</label>
                    <value>{formatDate(transaction.created_at)}</value>
                  </ExpandedField>
                  <ExpandedField>
                    <label>Status</label>
                    <value style={{ textTransform: 'capitalize' }}>{transaction.status}</value>
                  </ExpandedField>
                  <ExpandedField>
                    <label>Reference</label>
                    <value style={{ fontSize: '0.75rem', fontFamily: 'monospace' }}>{transaction.reference}</value>
                  </ExpandedField>
                </ExpandedContent>
              )}
            </React.Fragment>
          )
        })}
      </Table>

      {pagination.pages > 1 && (
        <PaginationControls>
          <PaginationButton disabled={page === 1} onClick={() => setPage(page - 1)}>
            Previous
          </PaginationButton>
          <PageInfo>
            Page {pagination.page} of {pagination.pages}
          </PageInfo>
          <PaginationButton disabled={page === pagination.pages} onClick={() => setPage(page + 1)}>
            Next
          </PaginationButton>
        </PaginationControls>
      )}
    </Container>
  )
}

export default TransactionHistory
