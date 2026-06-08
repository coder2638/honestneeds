'use client'

import styled from 'styled-components'
import { useState } from 'react'
import { toast } from 'react-toastify'
import { useGetCreatorBoosts, useExtendBoost, useCancelBoost } from '@/api/hooks/useBoosts'
import { BOOST_TIERS } from '@/utils/boostValidationSchemas'
import { TrendingUp, Clock, Eye, MessageCircle, ShoppingCart, Zap } from 'lucide-react'
import { LoadingSpinner } from '@/components/LoadingSpinner'

// Styled Components
const Container = styled.div`
  width: 100%;
`

const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3rem;
`

const ErrorContainer = styled.div`
  background-color: #fee2e2;
  border: 1px solid #fecaca;
  border-radius: 0.375rem;
  padding: 1rem;

  p {
    color: #7f1d1d;
    font-size: 0.875rem;
  }
`

const EmptyStateContainer = styled.div`
  text-align: center;
  padding: 3rem;

  svg {
    margin: 0 auto 1rem;
    opacity: 0.4;
  }

  h3 {
    font-size: 1.125rem;
    font-weight: 600;
    color: #111827;
    margin-bottom: 0.25rem;
  }

  p {
    color: #6b7280;
    font-size: 0.875rem;
  }
`

const BoostsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }
`

const BoostCard = styled.div`
  background-color: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  padding: 1.5rem;
  transition: all 200ms ease;

  &:hover {
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  }
`

const CardHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 1rem;
`

const TitleSection = styled.div`
  h3 {
    font-size: 1.125rem;
    font-weight: 600;
    color: #111827;
    margin-bottom: 0.25rem;
  }

  p {
    font-size: 0.875rem;
    color: #6b7280;
  }
`

const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.75rem;
  background-color: #dcfce7;
  color: #166534;
  font-size: 0.75rem;
  font-weight: 600;
  border-radius: 9999px;
`

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e5e7eb;
`

const StatItem = styled.div`
  text-align: center;

  p {
    font-size: 0.75rem;
    color: #6b7280;
    margin-bottom: 0.25rem;
  }

  strong {
    font-size: 1.25rem;
    font-weight: 700;
    color: #111827;
  }
`

const ProgressSection = styled.div`
  margin-bottom: 1rem;
`

const ProgressLabel = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;

  p {
    font-size: 0.875rem;
    font-weight: 500;
    color: #374151;
  }

  span {
    font-size: 0.875rem;
    font-weight: 600;
    color: #111827;
  }
`

const ProgressBar = styled.div`
  width: 100%;
  height: 0.5rem;
  background-color: #e5e7eb;
  border-radius: 9999px;
  overflow: hidden;
`

const ProgressFill = styled.div<{ $percentage: number }>`
  height: 100%;
  width: ${(props) => Math.min(100, props.$percentage)}%;
  background: linear-gradient(90deg, #3b82f6 0%, #2563eb 100%);
  transition: width 200ms ease;
`

const PercentageText = styled.p`
  font-size: 0.75rem;
  color: #6b7280;
  margin-top: 0.25rem;
`

const PriceInfo = styled.div`
  padding-bottom: 1rem;
  margin-bottom: 1rem;
  border-bottom: 1px solid #e5e7eb;

  p {
    font-size: 0.875rem;
    color: #6b7280;
  }
`

const ActionButtons = styled.div`
  display: flex;
  gap: 0.5rem;
`

const ExtendButton = styled.button`
  flex: 1;
  padding: 0.5rem 0.75rem;
  background: linear-gradient(90deg, #3b82f6 0%, #2563eb 100%);
  color: white;
  font-size: 0.75rem;
  font-weight: 600;
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: all 200ms ease;

  &:hover:not(:disabled) {
    box-shadow: 0 4px 6px -1px rgba(37, 99, 235, 0.3);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`

const CancelButton = styled.button`
  flex: 1;
  padding: 0.5rem 0.75rem;
  background-color: #f3f4f6;
  color: #111827;
  font-size: 0.75rem;
  font-weight: 600;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: all 200ms ease;

  &:hover:not(:disabled) {
    background-color: #e5e7eb;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`

const PaginationContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e5e7eb;
`

const PaginationButtons = styled.div`
  display: flex;
  gap: 0.5rem;
`

const PaginationButton = styled.button`
  padding: 0.5rem 1rem;
  border: 1px solid #d1d5db;
  background-color: white;
  color: #374151;
  font-size: 0.875rem;
  font-weight: 500;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: all 200ms ease;

  &:hover:not(:disabled) {
    background-color: #f9fafb;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`

/**
 * BoostManager Component
 * Displays and manages creator's active boosts
 * Integrated with Next.js frontend
 */
export const BoostManager: React.FC = () => {
  const [page, setPage] = useState(1)
  const [limit] = useState(10)

  const { data, isLoading, error } = useGetCreatorBoosts(page, limit)
  const extendMutation = useExtendBoost()
  const cancelMutation = useCancelBoost()

  const handleExtend = async (boostId: string) => {
    try {
      await extendMutation.mutateAsync(boostId)
      toast.success('Boost extended for 30 days!')
    } catch (error) {
      toast.error(`Error extending boost: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  const handleCancel = async (boostId: string) => {
    if (!window.confirm('Are you sure you want to cancel this boost? This action cannot be undone.')) {
      return
    }

    try {
      await cancelMutation.mutateAsync({ boostId })
      toast.success('Boost cancelled successfully')
    } catch (error) {
      toast.error(`Error cancelling boost: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  if (isLoading) {
    return (
      <LoadingContainer>
        <LoadingSpinner />
      </LoadingContainer>
    )
  }

  if (error) {
    return (
      <ErrorContainer>
        <p>
          Error loading boosts:{' '}
          {error instanceof Error ? error.message : 'Unknown error'}
        </p>
      </ErrorContainer>
    )
  }

  const boosts = data?.boosts || []
  const pagination = data?.pagination

  if (boosts.length === 0) {
    return (
      <EmptyStateContainer>
        <Zap size={48} />
        <h3>No active boosts</h3>
        <p>Start boosting your campaigns to increase visibility!</p>
      </EmptyStateContainer>
    )
  }

  return (
    <Container>
      <BoostsGrid>
        {boosts.map((boost: any) => {
          const tierData = BOOST_TIERS[boost.tier as keyof typeof BOOST_TIERS]

          return (
            <BoostCard key={boost._id}>
              <CardHeader>
                <TitleSection>
                  <h3>{tierData?.name}</h3>
                  <p>Visibility: {boost.visibility_weight}x</p>
                </TitleSection>
                <Badge>✓ Active</Badge>
              </CardHeader>

              {/* Stats */}
              <StatsGrid>
                <StatItem>
                  <p>Views</p>
                  <strong>{boost.stats.views}</strong>
                </StatItem>
                <StatItem>
                  <p>Engagement</p>
                  <strong>{boost.stats.engagement}</strong>
                </StatItem>
                <StatItem>
                  <p>Conversions</p>
                  <strong>{boost.stats.conversions}</strong>
                </StatItem>
              </StatsGrid>

              {/* Progress */}
              <ProgressSection>
                <ProgressLabel>
                  <p>Time Remaining</p>
                  <span>{boost.days_remaining} days</span>
                </ProgressLabel>
                <ProgressBar>
                  <ProgressFill $percentage={boost.percentage_complete} />
                </ProgressBar>
                <PercentageText>{boost.percentage_complete}% complete</PercentageText>
              </ProgressSection>

              {/* Price Info */}
              <PriceInfo>
                <p>Paid: {boost.price}</p>
              </PriceInfo>

              {/* Actions */}
              <ActionButtons>
                <ExtendButton
                  onClick={() => handleExtend(boost._id)}
                  disabled={extendMutation.isPending}
                >
                  {extendMutation.isPending ? 'Extending...' : 'Extend 30 Days'}
                </ExtendButton>
                <CancelButton
                  onClick={() => handleCancel(boost._id)}
                  disabled={cancelMutation.isPending}
                >
                  {cancelMutation.isPending ? 'Cancelling...' : 'Cancel'}
                </CancelButton>
              </ActionButtons>
            </BoostCard>
          )
        })}
      </BoostsGrid>

      {/* Pagination */}
      {pagination && pagination.pages > 1 && (
        <PaginationContainer>
          <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
            Page {pagination.page} of {pagination.pages}
          </p>
          <PaginationButtons>
            <PaginationButton
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
            >
              Previous
            </PaginationButton>
            <PaginationButton
              onClick={() => setPage(Math.min(pagination.pages, page + 1))}
              disabled={page === pagination.pages}
            >
              Next
            </PaginationButton>
          </PaginationButtons>
        </PaginationContainer>
      )}
    </Container>
  )
}

export default BoostManager
