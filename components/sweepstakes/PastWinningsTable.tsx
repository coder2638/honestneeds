'use client'

import React, { useState } from 'react'
import styled from 'styled-components'
import { useMyWinnings } from '@/api/hooks/useSweepstakes'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import { Badge } from '@/components/Badge'
import { Button } from '@/components/Button'
import { currencyUtils } from '@/utils/validationSchemas'
import { ClaimPrizeModal } from './ClaimPrizeModal'
import type { Winnings } from '@/api/services/sweepstakesService'

/**
 * Past Winnings Table
 * Display all past winnings for a user
 */

const Container = styled.div`
  background: white;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  overflow: hidden;
`

const Header = styled.div`
  background: #f9fafb;
  padding: 20px;
  border-bottom: 1px solid #e5e7eb;
`

const Title = styled.h3`
  font-size: 18px;
  font-weight: 600;
  margin: 0;
  color: #111827;
`

const TableContainer = styled.div`
  overflow-x: auto;
`

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;

  thead {
    background-color: #f9fafb;
    border-bottom: 2px solid #e5e7eb;
  }

  th {
    padding: 12px 16px;
    text-align: left;
    font-size: 13px;
    font-weight: 600;
    color: #6b7280;
    text-transform: uppercase;
  }

  td {
    padding: 12px 16px;
    border-bottom: 1px solid #e5e7eb;
    font-size: 14px;
  }

  tbody tr:hover {
    background-color: #f9fafb;
  }
`

const StatusCell = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`

const ActionCell = styled.div`
  text-align: right;
`

const EmptyState = styled.div`
  text-align: center;
  padding: 40px 20px;
  color: #6b7280;
  font-size: 14px;
`

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  padding: 16px;
  border-top: 1px solid #e5e7eb;
  background-color: #f9fafb;
`

interface PastWinningsTableProps {
  pageSize?: number
}

export function PastWinningsTable({ pageSize = 10 }: PastWinningsTableProps) {
  const [page, setPage] = useState(1)
  const [selectedWinning, setSelectedWinning] = useState<Winnings | null>(null)
  const [showClaimModal, setShowClaimModal] = useState(false)

  const { data, isLoading } = useMyWinnings(page, pageSize)

  if (isLoading) {
    return (
      <Container>
        <Header>
          <Title>🏆 Past Winnings</Title>
        </Header>
        <LoadingSpinner />
      </Container>
    )
  }

  const winnings = data?.winnings || []
  const totalPages = data?.pages || 1

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'won_claimed':
        return 'success'
      case 'won_unclaimed':
        return 'warning'
      default:
        return 'default'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'won_claimed':
        return '✓ Claimed'
      case 'won_unclaimed':
        return '⏳ Unclaimed'
      default:
        return status
    }
  }

  const handleClaimClick = (winning: Winnings) => {
    setSelectedWinning(winning)
    setShowClaimModal(true)
  }

  return (
    <>
      <Container>
        <Header>
          <Title>🏆 Past Winnings</Title>
        </Header>

        {winnings.length === 0 ? (
          <EmptyState>
            <p>You haven't won yet. Keep sharing to increase your chances!</p>
          </EmptyState>
        ) : (
          <>
            <TableContainer>
              <Table>
                <thead>
                  <tr>
                    <th>Drawing Date</th>
                    <th>Prize Amount</th>
                    <th>Status</th>
                    <th style={{ textAlign: 'right' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {winnings.map((winning) => (
                    <tr key={winning.id}>
                      <td>{new Date(winning.drawingDate).toLocaleDateString()}</td>
                      <td>
                        <strong>{currencyUtils.formatCurrency(winning.prize)}</strong>
                      </td>
                      <td>
                        <StatusCell>
                          <Badge variant={getStatusVariant(winning.status)} size="sm">
                            {getStatusLabel(winning.status)}
                          </Badge>
                        </StatusCell>
                      </td>
                      <td>
                        <ActionCell>
                          {winning.status === 'won_unclaimed' ? (
                            <Button
                              variant="primary"
                              size="sm"
                              onClick={() => handleClaimClick(winning)}
                            >
                              Claim
                            </Button>
                          ) : (
                            <span style={{ fontSize: '12px', color: '#6b7280' }}>—</span>
                          )}
                        </ActionCell>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </TableContainer>

            {totalPages > 1 && (
              <Pagination>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                >
                  ← Previous
                </Button>

                <span style={{ fontSize: '14px', color: '#6b7280' }}>
                  Page {page} of {totalPages}
                </span>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(Math.min(totalPages, page + 1))}
                  disabled={page === totalPages}
                >
                  Next →
                </Button>
              </Pagination>
            )}
          </>
        )}
      </Container>

      {selectedWinning && (
        <ClaimPrizeModal
          winning={selectedWinning}
          open={showClaimModal}
          onClose={() => {
            setShowClaimModal(false)
            setSelectedWinning(null)
          }}
        />
      )}
    </>
  )
}
