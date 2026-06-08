'use client'

import React, { useState } from 'react'
import styled from 'styled-components'
import { useDrawingsHistory, useDrawingDetails, useForceDrawing } from '@/api/hooks/useSweepstakes'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import { Button } from '@/components/Button'
import { Badge } from '@/components/Badge'
import { Modal } from '@/components/Modal'
import { AdminSweepstakesStats } from '@/components/analytics'
import { currencyUtils } from '@/utils/validationSchemas'

/**
 * Admin Sweepstakes Management Page
 * View current drawing stats, past drawings, and manage draws
 */

const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 24px;
`

const PageHeader = styled.div`
  margin-bottom: 32px;
`

const PageTitle = styled.h1`
  font-size: 32px;
  font-weight: 700;
  color: #111827;
  margin: 0 0 8px 0;
`

const PageSubtitle = styled.p`
  font-size: 16px;
  color: #6b7280;
  margin: 0;
`

const Section = styled.div`
  margin-bottom: 32px;
`

const SectionTitle = styled.h2`
  font-size: 22px;
  font-weight: 600;
  color: #111827;
  margin: 0 0 20px 0;
  display: flex;
  align-items: center;
  gap: 8px;
`

const TableContainer = styled.div`
  background: white;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  overflow: hidden;
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

const ActionCell = styled.div`
  display: flex;
  gap: 8px;
`

const EmptyState = styled.div`
  text-align: center;
  padding: 40px 20px;
  color: #6b7280;
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

const DrawingDetailModal = styled(Modal)`
  max-width: 600px;
`

const DetailGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 20px;
`

const DetailItem = styled.div`
  background: #f9fafb;
  padding: 12px;
  border-radius: 8px;
`

const DetailLabel = styled.p`
  font-size: 12px;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  margin: 0 0 4px 0;
`

const DetailValue = styled.p`
  font-size: 16px;
  font-weight: 600;
  color: #111827;
  margin: 0;
`

const WinnersSection = styled.div`
  margin-top: 20px;
`

const WinnerItem = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 8px 12px;
  background: #f9fafb;
  border-radius: 6px;
  margin-bottom: 8px;
  font-size: 14px;

  &:last-child {
    margin-bottom: 0;
  }
`

interface DrawingWithWinners {
  drawing: any
  winners: any[]
  entryDistribution: any[]
}

export default function AdminSweepstakesPage() {
  const [page, setPage] = useState(1)
  const [selectedDrawing, setSelectedDrawing] = useState<DrawingWithWinners | null>(null)
  const [showDetailModal, setShowDetailModal] = useState(false)

  const { data: drawingsData, isLoading: drawingsLoading } = useDrawingsHistory(page, 10)
  const { mutate: forceDrawing, isPending: isForcing } = useForceDrawing()

  const drawings = drawingsData?.drawings || []
  const totalPages = drawingsData?.pages || 1

  const handleViewDetails = async (drawingId: string) => {
    // In a real app, you'd fetch details here
    // For now, we're just showing basic modal
    setShowDetailModal(true)
  }

  const handleForceDrawing = (drawingId: string) => {
    if (window.confirm('Are you sure you want to force this drawing? This action cannot be undone.')) {
      forceDrawing(drawingId)
    }
  }

  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <Container>
        {/* Page Header */}
        <PageHeader>
          <PageTitle>🎰 Sweepstakes Management</PageTitle>
          <PageSubtitle>Manage drawings, view entry distributions, and track sweepstakes activity</PageSubtitle>
        </PageHeader>

        {/* Admin Stats Section */}
        <Section>
          <AdminSweepstakesStats />
        </Section>

        {/* Past Drawings Section */}
        <Section>
          <SectionTitle>📅 Past Drawings</SectionTitle>

          {drawingsLoading ? (
            <LoadingSpinner />
          ) : drawings.length === 0 ? (
            <TableContainer>
              <EmptyState>
                <p>No past drawings yet. Create a drawing to get started.</p>
              </EmptyState>
            </TableContainer>
          ) : (
            <>
              <TableContainer>
                <Table>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Prize</th>
                      <th>Winners</th>
                      <th>Entries</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {drawings.map((drawing) => (
                      <tr key={drawing.id}>
                        <td>
                          {new Date(drawing.drawDate || drawing.targetDate).toLocaleDateString()}
                        </td>
                        <td>
                          <strong>{currencyUtils.formatCurrency(drawing.prize)}</strong>
                        </td>
                        <td>{drawing.winners}</td>
                        <td>{drawing.currentEntries}</td>
                        <td>
                          <Badge
                            variant={
                              drawing.status === 'drawn'
                                ? 'success'
                                : drawing.status === 'completed'
                                  ? 'info'
                                  : 'warning'
                            }
                            size="sm"
                          >
                            {drawing.status === 'drawn'
                              ? 'Drawn'
                              : drawing.status === 'completed'
                                ? 'Completed'
                                : 'Pending'}
                          </Badge>
                        </td>
                        <td>
                          <ActionCell>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewDetails(drawing.id)}
                            >
                              View
                            </Button>
                            {drawing.status === 'pending' && (
                              <Button
                                variant="primary"
                                size="sm"
                                onClick={() => handleForceDrawing(drawing.id)}
                                disabled={isForcing}
                              >
                                Force Draw
                              </Button>
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
        </Section>

        {/* Drawing Detail Modal */}
        {selectedDrawing && (
          <Modal
            isOpen={showDetailModal}
            onClose={() => setShowDetailModal(false)}
            title="Drawing Details"
          >
            <div style={{ padding: '24px' }}>
              <DetailGrid>
                <DetailItem>
                  <DetailLabel>Drawing Date</DetailLabel>
                  <DetailValue>
                    {new Date(
                      selectedDrawing.drawing.drawDate || selectedDrawing.drawing.targetDate
                    ).toLocaleDateString()}
                  </DetailValue>
                </DetailItem>
                <DetailItem>
                  <DetailLabel>Prize Amount</DetailLabel>
                  <DetailValue>
                    {currencyUtils.formatCurrency(selectedDrawing.drawing.prize)}
                  </DetailValue>
                </DetailItem>
                <DetailItem>
                  <DetailLabel>Total Winners</DetailLabel>
                  <DetailValue>{selectedDrawing.winners.length}</DetailValue>
                </DetailItem>
                <DetailItem>
                  <DetailLabel>Total Entries</DetailLabel>
                  <DetailValue>{selectedDrawing.drawing.currentEntries}</DetailValue>
                </DetailItem>
              </DetailGrid>

              <WinnersSection>
                <h4 style={{ margin: '0 0 12px 0', color: '#111827' }}>🏆 Winners</h4>
                {selectedDrawing.winners.length === 0 ? (
                  <p style={{ color: '#6b7280', fontSize: '14px' }}>No winners yet</p>
                ) : (
                  selectedDrawing.winners.slice(0, 10).map((winner, index) => (
                    <WinnerItem key={winner.id}>
                      <span>
                        #{index + 1} {winner.partialName}
                      </span>
                      <span style={{ fontWeight: 600, color: '#f59e0b' }}>
                        {winner.entryCount} entries
                      </span>
                    </WinnerItem>
                  ))
                )}
              </WinnersSection>
            </div>
          </Modal>
        )}
      </Container>
    </ProtectedRoute>
  )
}
