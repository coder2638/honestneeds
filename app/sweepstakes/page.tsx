'use client'

import { useState, useEffect } from 'react'
import styled from 'styled-components'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Gift, Clock, DollarSign, Users, CheckCircle2, AlertCircle } from 'lucide-react'
import { toast } from 'react-toastify'
import { useCurrentSweepstakes, useCheckWinner } from '@/api/hooks/useSimpleSweepstakes'
import { useAuthStore } from '@/store/authStore'
import Button from '@/components/ui/Button'

// Styled Components
const PageContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem 1rem;
`

const Content = styled.div`
  max-width: 900px;
  margin: 0 auto;
`

const Header = styled.div`
  text-align: center;
  color: white;
  margin-bottom: 3rem;

  h1 {
    font-size: 2.5rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
  }

  p {
    font-size: 1.1rem;
    opacity: 0.95;
  }
`

const DrawingCard = styled.div`
  background: white;
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  margin-bottom: 2rem;
`

const DrawingTitle = styled.h2`
  font-size: 1.75rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;

  svg {
    color: #667eea;
  }
`

const PrizeSection = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 0.75rem;
  padding: 2rem;
  text-align: center;
  margin-bottom: 2rem;

  .prize-label {
    font-size: 0.875rem;
    opacity: 0.9;
    margin-bottom: 0.5rem;
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  .prize-amount {
    font-size: 3rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
  }

  .prize-description {
    font-size: 1.1rem;
    opacity: 0.95;
  }
`

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  margin-bottom: 2rem;

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`

const InfoCard = styled.div`
  background: #f3f4f6;
  border-radius: 0.75rem;
  padding: 1.5rem;
  text-align: center;

  .info-icon {
    font-size: 1.75rem;
    margin-bottom: 0.75rem;
    opacity: 0.7;
  }

  .info-label {
    font-size: 0.875rem;
    color: #6b7280;
    margin-bottom: 0.5rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .info-value {
    font-size: 1.25rem;
    font-weight: 600;
    color: #111827;
  }
`

const StatusSection = styled.div`
  background: #f0fdf4;
  border: 2px solid #86efac;
  border-radius: 0.75rem;
  padding: 1.5rem;
  margin-bottom: 2rem;

  &.info {
    background: #eff6ff;
    border-color: #93c5fd;
  }

  &.error {
    background: #fef2f2;
    border-color: #fecaca;
  }

  .status-header {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 0.75rem;

    svg {
      width: 20px;
      height: 20px;
      flex-shrink: 0;
    }

    strong {
      font-weight: 600;
      font-size: 1.1rem;
    }
  }

  .status-text {
    color: #374151;
    line-height: 1.6;
  }
`

const CTAButton = styled(Button)`
  width: 100%;
  padding: 1rem;
  font-size: 1.1rem;
  min-height: 56px;
`

const DrawingOpenBanner = styled.div`
  background: linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(34, 197, 94, 0.05) 100%);
  border-left: 4px solid #22c55e;
  padding: 1rem;
  border-radius: 0.5rem;
  margin-bottom: 1.5rem;

  p {
    color: #166534;
    font-weight: 500;
    margin: 0;
  }
`

const LoadingSkeleton = styled.div`
  background: linear-gradient(90deg, #f3f4f6 0%, #e5e7eb 50%, #f3f4f6 100%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
  border-radius: 0.75rem;
  height: 100px;

  @keyframes loading {
    0% {
      background-position: 200% 0;
    }
    100% {
      background-position: -200% 0;
    }
  }
`

export default function SweepstakesPage() {
  const router = useRouter()
  const { user } = useAuthStore()
  const { data: sweepstakesResponse, isLoading: isLoadingSweepstakes } = useCurrentSweepstakes()
  const [sweepstakesId, setSweepstakesId] = useState<string | null>(null)
  const { data: winnerResponse, isLoading: isLoadingWinner } = useCheckWinner(sweepstakesId)

  useEffect(() => {
    if (sweepstakesResponse?.data) {
      setSweepstakesId(sweepstakesResponse.data.id)
    }
  }, [sweepstakesResponse])

  const sweepstakes = sweepstakesResponse?.data
  const winnerData = winnerResponse?.data

  const handleClaimClick = () => {
    if (!user) {
      toast.error('❌ Please log in to claim your prize')
      router.push(`/login?redirect=/sweepstakes/${sweepstakesId}/claim`)
    } else if (sweepstakesId) {
      router.push(`/sweepstakes/${sweepstakesId}/claim`)
    }
  }

  if (isLoadingSweepstakes) {
    return (
      <PageContainer>
        <Content>
          <Header>
            <h1>🎰 Monthly Sweepstakes</h1>
            <p>Your chance to win big!</p>
          </Header>
          <DrawingCard>
            <LoadingSkeleton />
          </DrawingCard>
        </Content>
      </PageContainer>
    )
  }

  if (!sweepstakes) {
    return (
      <PageContainer>
        <Content>
          <Header>
            <h1>🎰 Monthly Sweepstakes</h1>
            <p>Your chance to win big!</p>
          </Header>
          <DrawingCard>
            <StatusSection className="info">
              <div className="status-header">
                <AlertCircle />
                <strong>No Active Drawing</strong>
              </div>
              <p className="status-text">
                There is currently no active sweepstakes drawing. Please check back soon for our next monthly
                drawing!
              </p>
            </StatusSection>
          </DrawingCard>
        </Content>
      </PageContainer>
    )
  }

  const isDrawingOpen = sweepstakes.isDrawingOpen
  const hasBeenDrawn = !isDrawingOpen && sweepstakes.status === 'completed'
  const isWinner = winnerData?.winner === true
  const hasNotWon = winnerData?.winner === false
  const drawnButNotOpen = hasBeenDrawn && !isLoadingWinner

  return (
    <PageContainer>
      <Content>
        <Header>
          <h1>🎰 Monthly Sweepstakes</h1>
          <p>Your chance to win big every month!</p>
        </Header>

        <DrawingCard>
          <DrawingTitle>
            <Gift />
            {sweepstakes.title}
          </DrawingTitle>

          {/* Prize Section */}
          <PrizeSection>
            <div className="prize-label">Total Prize</div>
            <div className="prize-amount">${sweepstakes.prizeAmountDollars}</div>
            <div className="prize-description">{sweepstakes.prizeDescription}</div>
          </PrizeSection>

          {/* Drawing Status */}
          {isDrawingOpen && (
            <DrawingOpenBanner>
              <p>✅ Drawing is OPEN - All eligible users are automatically included!</p>
            </DrawingOpenBanner>
          )}

          {drawnButNotOpen && isWinner && (
            <DrawingOpenBanner style={{ background: 'rgba(255, 215, 0, 0.1)', borderLeftColor: '#ffd700' }}>
              <p style={{ color: '#854d0e' }}>🎉 Congratulations! You won this drawing!</p>
            </DrawingOpenBanner>
          )}

          {drawnButNotOpen && hasNotWon && (
            <DrawingOpenBanner style={{ background: 'rgba(107, 114, 128, 0.1)', borderLeftColor: '#6b7280' }}>
              <p style={{ color: '#374151' }}>
                💔 Drawing completed. Better luck next month! Keep participating to increase your chances.
              </p>
            </DrawingOpenBanner>
          )}

          {/* Drawing Timeline */}
          <InfoGrid>
            <InfoCard>
              <div className="info-icon">📅</div>
              <div className="info-label">Entry Period</div>
              <div className="info-value">
                {new Date(sweepstakes.entryStartDate).toLocaleDateString()} -{' '}
                {new Date(sweepstakes.entryEndDate).toLocaleDateString()}
              </div>
            </InfoCard>

            <InfoCard>
              <div className="info-icon">⏰</div>
              <div className="info-label">Drawing Date</div>
              <div className="info-value">
                {new Date(sweepstakes.drawingDate).toLocaleDateString()}
              </div>
            </InfoCard>

            <InfoCard>
              <div className="info-icon">🏆</div>
              <div className="info-label">Claim Deadline</div>
              <div className="info-value">
                {new Date(sweepstakes.claimDeadline).toLocaleDateString()}
              </div>
            </InfoCard>

            <InfoCard>
              <div className="info-icon">👥</div>
              <div className="info-label">Status</div>
              <div className="info-value" style={{ textTransform: 'capitalize' }}>
                {sweepstakes.status}
              </div>
            </InfoCard>
          </InfoGrid>

          {/* Drawing Description */}
          <p style={{ color: '#6b7280', lineHeight: 1.6, marginBottom: '2rem' }}>
            {sweepstakes.description}
          </p>

          {/* How It Works */}
          <StatusSection className="info">
            <div className="status-header">
              <AlertCircle />
              <strong>How It Works</strong>
            </div>
            <div className="status-text">
              <ul style={{ marginLeft: '1.5rem', lineHeight: 1.8 }}>
                <li>All users with an active account are automatically eligible</li>
                <li>Must be 18+ years old and not from restricted states (FL, NY, IL)</li>
                <li>Random winner is selected on the drawing date</li>
                <li>Winner has until the claim deadline to claim their prize</li>
                <li>Prize is paid via the winner's selected payment method</li>
              </ul>
            </div>
          </StatusSection>

          {/* Winner Actions */}
          {drawnButNotOpen && isWinner && !isLoadingWinner && (
            <div>
              <StatusSection style={{ background: '#f0fdf4', borderColor: '#86efac', marginBottom: '2rem' }}>
                <div className="status-header">
                  <CheckCircle2 style={{ color: '#22c55e' }} />
                  <strong>🎉 You Won!</strong>
                </div>
                <p className="status-text">
                  Congratulations! You have been selected as a winner of this month's sweepstakes. Claim your
                  ${sweepstakes.prizeAmountDollars} prize before the deadline!
                </p>
              </StatusSection>

              <CTAButton onClick={handleClaimClick} variant="primary">
                💰 Claim Your Prize
              </CTAButton>
            </div>
          )}

          {/* Not Winner Status */}
          {drawnButNotOpen && hasNotWon && (
            <StatusSection>
              <div className="status-header">
                <AlertCircle />
                <strong>Drawing Complete</strong>
              </div>
              <p className="status-text">
                The winner for this month's drawing has been selected. You weren't chosen this time, but you're
                automatically entered in next month's drawing! Keep an eye out for the next opportunity.
              </p>
            </StatusSection>
          )}

          {/* Waiting for Drawing */}
          {isDrawingOpen && (
            <div>
              <StatusSection className="info">
                <div className="status-header">
                  <CheckCircle2 style={{ color: '#3b82f6' }} />
                  <strong>You're Entered!</strong>
                </div>
                <p className="status-text">
                  Your account is automatically eligible for this drawing. The winner will be selected on{' '}
                  {new Date(sweepstakes.drawingDate).toLocaleDateString()}. Check back then to see if you won!
                </p>
              </StatusSection>

              <CTAButton disabled style={{ opacity: 0.6, cursor: 'not-allowed' }} variant="secondary">
                ⏳ Waiting for Drawing...
              </CTAButton>
            </div>
          )}

          {/* Not Logged In */}
          {!user && (
            <StatusSection className="error">
              <div className="status-header">
                <AlertCircle style={{ color: '#dc2626' }} />
                <strong>Sign In Required</strong>
              </div>
              <p className="status-text">
                You must be logged in to participate in the sweepstakes. Sign in to automatically enter today's
                drawing!
              </p>

              <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem' }}>
                <Link href={`/login?redirect=/sweepstakes/${sweepstakesId}`} style={{ flex: 1 }}>
                  <Button variant="primary" size="lg" style={{ width: '100%' }}>
                    🔐 Sign In
                  </Button>
                </Link>
                <Link href="/register" style={{ flex: 1 }}>
                  <Button variant="secondary" size="lg" style={{ width: '100%' }}>
                    📝 Create Account
                  </Button>
                </Link>
              </div>
            </StatusSection>
          )}
        </DrawingCard>

        {/* Additional Info */}
        <DrawingCard style={{ background: '#f9fafb' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem', color: '#111827' }}>
            ❓ Frequently Asked Questions
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <strong style={{ color: '#111827', display: 'block', marginBottom: '0.5rem' }}>
                How do I participate?
              </strong>
              <p style={{ color: '#6b7280', margin: 0 }}>
                Simply have an active account! All eligible users are automatically entered into the drawing.
              </p>
            </div>

            <div>
              <strong style={{ color: '#111827', display: 'block', marginBottom: '0.5rem' }}>
                What makes me eligible?
              </strong>
              <p style={{ color: '#6b7280', margin: 0 }}>
                You must be 18 years old, not located in Florida, New York, or Illinois, and have an active
                account in good standing.
              </p>
            </div>

            <div>
              <strong style={{ color: '#111827', display: 'block', marginBottom: '0.5rem' }}>
                How is the winner selected?
              </strong>
              <p style={{ color: '#6b7280', margin: 0 }}>
                Winners are selected randomly from all eligible participants. Every account has an equal chance
                of winning!
              </p>
            </div>

            <div>
              <strong style={{ color: '#111827', display: 'block', marginBottom: '0.5rem' }}>
                How do I claim my prize?
              </strong>
              <p style={{ color: '#6b7280', margin: 0 }}>
                If you win, you'll see a "Claim Your Prize" button. Click it and provide your banking details
                to receive your prize!
              </p>
            </div>
          </div>
        </DrawingCard>
      </Content>
    </PageContainer>
  )
}
