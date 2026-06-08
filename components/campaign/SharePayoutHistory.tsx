'use client'

import React, { useState } from 'react'
import styled from 'styled-components'
import { ChevronDown, ChevronUp, Clock, CheckCircle, XCircle } from 'lucide-react'

interface PayoutRecord {
  id: string
  amount: number // in cents
  status: 'pending' | 'processing' | 'completed' | 'failed'
  paymentMethod: string
  createdAt: string
  completedAt?: string
  campaignTitle: string
  earningsCount: number
}

interface SharePayoutHistoryProps {
  payouts: PayoutRecord[]
  isLoading?: boolean
  onRequestPayout?: () => void
}

const Container = styled.div`
  background: white;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  overflow: hidden;
`

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  background-color: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
`

const HeaderTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: #0f172a;
  margin: 0;
`

const RequestButton = styled.button`
  background-color: #22c55e;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: #16a34a;
    transform: translateY(-1px);
  }

  &:disabled {
    background-color: #cbd5e1;
    cursor: not-allowed;
    transform: none;
  }
`

const TableContainer = styled.div`
  overflow-x: auto;
`

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;

  @media (max-width: 768px) {
    display: block;
  }
`

const TableHead = styled.thead`
  background-color: #f8fafc;
  border-bottom: 2px solid #e2e8f0;

  @media (max-width: 768px) {
    display: none;
  }
`

const TableHeaderCell = styled.th`
  padding: 1rem;
  text-align: left;
  font-size: 0.875rem;
  font-weight: 600;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`

const TableBody = styled.tbody`
  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
  }
`

const TableRow = styled.tr`
  border-bottom: 1px solid #e2e8f0;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #f8fafc;
  }

  @media (max-width: 768px) {
    display: block;
    margin-bottom: 1rem;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    padding: 1rem;
    position: relative;
  }
`

const TableCell = styled.td`
  padding: 1rem;
  color: #0f172a;
  font-size: 0.95rem;

  @media (max-width: 768px) {
    display: flex;
    justify-content: space-between;
    padding: 0.5rem 0;

    &::before {
      content: attr(data-label);
      font-weight: 600;
      color: #64748b;
      min-width: 150px;
    }
  }
`

const AmountCell = styled(TableCell)`
  font-weight: 600;
  color: #22c55e;
`

const StatusBadge = styled.div<{ status: string }>`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 600;
  width: fit-content;

  background-color: ${(props) => {
    switch (props.status) {
      case 'completed':
        return '#d1fae5'
      case 'processing':
        return '#fef3c7'
      case 'pending':
        return '#e0e7ff'
      case 'failed':
        return '#fee2e2'
      default:
        return '#f3f4f6'
    }
  }};

  color: ${(props) => {
    switch (props.status) {
      case 'completed':
        return '#065f46'
      case 'processing':
        return '#92400e'
      case 'pending':
        return '#3730a3'
      case 'failed':
        return '#7f1d1d'
      default:
        return '#374151'
    }
  }};

  svg {
    width: 1rem;
    height: 1rem;
  }
`

const SkeletonRow = styled(TableRow)`
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
    animation: shimmer 2s infinite;
  }

  @keyframes shimmer {
    0% {
      background-position: -1000px 0;
    }
    100% {
      background-position: 1000px 0;
    }
  }
`

const EmptyState = styled.div`
  padding: 3rem 1.5rem;
  text-align: center;
  color: #64748b;
`

const EmptyIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
`

const EmptyText = styled.p`
  font-size: 1rem;
  margin: 0;
`

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'completed':
      return <CheckCircle size={16} />
    case 'processing':
      return <Clock size={16} />
    case 'failed':
      return <XCircle size={16} />
    case 'pending':
      return <Clock size={16} />
    default:
      return null
  }
}

const getStatusLabel = (status: string): string => {
  return status.charAt(0).toUpperCase() + status.slice(1)
}

const formatCurrency = (cents: number): string => {
  return `$${(cents / 100).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
}

const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date)
  } catch {
    return 'N/A'
  }
}

/**
 * SharePayoutHistory Component
 * Production-ready display of payout transaction history
 * Shows status, amount, payment method, and dates
 */
export const SharePayoutHistory: React.FC<SharePayoutHistoryProps> = ({
  payouts,
  isLoading = false,
  onRequestPayout,
}) => {
  if (payouts.length === 0 && !isLoading) {
    return (
      <Container>
        <Header>
          <HeaderTitle>Payout History</HeaderTitle>
          <RequestButton onClick={onRequestPayout}>Request Payout</RequestButton>
        </Header>
        <EmptyState>
          <EmptyIcon>💸</EmptyIcon>
          <EmptyText>No payouts yet. Start sharing campaigns to earn rewards!</EmptyText>
        </EmptyState>
      </Container>
    )
  }

  return (
    <Container>
      <Header>
        <HeaderTitle>Payout History ({payouts.length})</HeaderTitle>
        <RequestButton onClick={onRequestPayout} disabled={isLoading}>
          Request New Payout
        </RequestButton>
      </Header>

      <TableContainer>
        <Table>
          <TableHead>
            <tr>
              <TableHeaderCell>Date Requested</TableHeaderCell>
              <TableHeaderCell>Amount</TableHeaderCell>
              <TableHeaderCell>Status</TableHeaderCell>
              <TableHeaderCell>Payment Method</TableHeaderCell>
              <TableHeaderCell>Shares Completed</TableHeaderCell>
            </tr>
          </TableHead>
          <TableBody>
            {isLoading ? (
              // Skeleton loaders
              [1, 2, 3].map((i) => (
                <SkeletonRow key={i}>
                  <TableCell data-label="Date" style={{ backgroundColor: '#f0f0f0' }} />
                  <TableCell data-label="Amount" style={{ backgroundColor: '#f0f0f0' }} />
                  <TableCell data-label="Status" style={{ backgroundColor: '#f0f0f0' }} />
                  <TableCell data-label="Method" style={{ backgroundColor: '#f0f0f0' }} />
                  <TableCell data-label="Shares" style={{ backgroundColor: '#f0f0f0' }} />
                </SkeletonRow>
              ))
            ) : (
              payouts.map((payout) => (
                <TableRow key={payout.id}>
                  <TableCell data-label="Date Requested">
                    {formatDate(payout.createdAt)}
                  </TableCell>
                  <AmountCell data-label="Amount">
                    {formatCurrency(payout.amount)}
                  </AmountCell>
                  <TableCell data-label="Status">
                    <StatusBadge status={payout.status}>
                      {getStatusIcon(payout.status)}
                      {getStatusLabel(payout.status)}
                    </StatusBadge>
                  </TableCell>
                  <TableCell data-label="Payment Method">
                    {payout.paymentMethod}
                  </TableCell>
                  <TableCell data-label="Shares Completed">
                    {payout.earningsCount}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  )
}
