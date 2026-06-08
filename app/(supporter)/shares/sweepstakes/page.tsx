'use client'

import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { useMyEntries, useCurrentDrawing } from '@/api/hooks/useSweepstakes'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import { Card } from '@/components/Card'
import { Button } from '@/components/Button'
import { Badge } from '@/components/Badge'
import { SweepstakesLeaderboard, PastWinningsTable } from '@/components/sweepstakes'
import { WinnerNotificationModal } from '@/components/sweepstakes/WinnerNotificationModal'
import { ClaimPrizeModal } from '@/components/sweepstakes/ClaimPrizeModal'
import { SweepstakesCompliance } from '@/components/campaign/SweepstakesCompliance'
import { AgeVerificationModal } from '@/components/campaign/AgeVerificationModal'
import { useAgeVerification, useSweepstakesCompliance } from '@/api/hooks/useSweepstakesCompliance'
import { currencyUtils } from '@/utils/validationSchemas'
import { useWinnerNotification } from '@/api/hooks/useSweepstakes'
import type { Winnings } from '@/api/services/sweepstakesService'

/**
 * My Sweepstakes Page
 * Supporter view: current entries, past winnings, leaderboard
 */

const Container = styled.div`
  max-width: 1200px;
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

const SectionGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  margin-bottom: 32px;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`

const InfoCard = styled(Card)`
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  color: white;
  padding: 24px;
`

const InfoCardTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 16px 0;
  opacity: 0.95;
`

const EntryCount = styled.div`
  font-size: 48px;
  font-weight: 700;
  margin-bottom: 12px;
  line-height: 1;
`

const EntryBreakdown = styled.div`
  font-size: 13px;
  line-height: 1.8;
  opacity: 0.9;
`

const BreakdownItem = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 4px 0;
`

const DrawingInfo = styled(Card)`
  background: linear-gradient(135deg, #f59e0b 0%, #f97316 100%);
  color: white;
  padding: 24px;
`

const DrawingTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 16px 0;
  opacity: 0.95;
`

const DrawingDate = styled.div`
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 8px;
`

const DrawingCountdown = styled.p`
  font-size: 14px;
  margin: 0;
  opacity: 0.9;
`

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 12px;
`

const SectionTitle = styled.h2`
  font-size: 22px;
  font-weight: 600;
  color: #111827;
  margin: 0;
`

const ActionButtons = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
`

const Section = styled.div`
  margin-bottom: 32px;
`

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 12px;
  margin-bottom: 20px;
`

const StatBox = styled.div`
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 16px;
  text-align: center;
`

const StatValue = styled.div`
  font-size: 24px;
  font-weight: 700;
  color: #111827;
  margin-bottom: 4px;
`

const StatLabel = styled.div`
  font-size: 12px;
  color: #6b7280;
  text-transform: uppercase;
  font-weight: 500;
`

const calculateDaysUntil = (targetDate: string): number => {
  const now = new Date()
  const target = new Date(targetDate)
  const diffMs = target.getTime() - now.getTime()
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24))
}

export default function MySweepstakesPage() {
  const { data: sweepstakesData, isLoading: entriesLoading } = useMyEntries()
  const { data: drawingData, isLoading: drawingLoading } = useCurrentDrawing()
  const { data: winnerNotification } = useWinnerNotification()
  const [showWinnerModal, setShowWinnerModal] = useState(false)
  const [showClaimModal, setShowClaimModal] = useState(false)
  const [selectedWinning, setSelectedWinning] = useState<Winnings | null>(null)

  // Compliance state - use the correct hook for age verification
  const { isRestrictedState } = useSweepstakesCompliance()
  const { isVerified: ageVerified, showModal, confirmAge, declineAge, requestVerification } = useAgeVerification()

  console.log('🔐 [MySweepstakesPage] Age verification state:', {
    ageVerified,
    isRestrictedState,
    showModal,
  })

  // Log hook data for debugging
  useEffect(() => {
    console.log('📊 [MySweepstakesPage] sweepstakesData STRUCTURE:', {
      hasUserEntries: !!sweepstakesData?.userEntries,
      hasCurrentDrawing: !!sweepstakesData?.currentDrawing,
      keys: Object.keys(sweepstakesData || {})
    })
    console.log('📊 [MySweepstakesPage] sweepstakesData.userEntries:', sweepstakesData?.userEntries)
    console.log('📊 [MySweepstakesPage] sweepstakesData.currentDrawing:', sweepstakesData?.currentDrawing)
    console.log('📊 [MySweepstakesPage] drawingData:', drawingData)
    console.log('📊 [MySweepstakesPage] entriesLoading:', entriesLoading)
    console.log('📊 [MySweepstakesPage] drawingLoading:', drawingLoading)
  }, [sweepstakesData, drawingData, entriesLoading, drawingLoading])

  // Show winner modal if there's a notification
  useEffect(() => {
    if (winnerNotification?.hasWon && winnerNotification?.winning) {
      setSelectedWinning(winnerNotification.winning)
      setShowWinnerModal(true)
    }
  }, [winnerNotification])

  const isLoading = entriesLoading || drawingLoading

  const entries = sweepstakesData?.userEntries
  const drawing = sweepstakesData?.currentDrawing || drawingData

  console.log('🎯 [MySweepstakesPage] Computed entries:', entries)
  console.log('🎯 [MySweepstakesPage] Computed drawing:', drawing)

  const daysUntilDrawing = drawing
    ? calculateDaysUntil(drawing.targetDate)
    : 0

  return (
    <>
      <Container>
        {/* Page Header */}
        <PageHeader>
          <PageTitle>🎰 My Sweepstakes</PageTitle>
          <PageSubtitle>Track your entries, past winnings, and chances to win cash prizes!</PageSubtitle>
        </PageHeader>

        {/* Compliance Notice */}
        {!isRestrictedState && (
          <SweepstakesCompliance
            variant="card"
            showStateRestrictions={true}
            showAgeWarning={true}
          />
        )}

        {isLoading ? (
          <LoadingSpinner />
        ) : isRestrictedState ? (
          <Card style={{ padding: '2rem', background: '#fee2e2', borderColor: '#fca5a5' }}>
            <h3 style={{ color: '#7f1d1d', marginTop: 0 }}>🚫 Sweepstakes Not Available</h3>
            <p style={{ color: '#b91c1c', marginBottom: 0 }}>
              Unfortunately, due to state regulations, sweepstakes participation is not available in your location.
              Please contact support for more information.
            </p>
          </Card>
        ) : !ageVerified ? (
          <Card style={{ padding: '2rem', background: '#fef3c7', borderColor: '#f59e0b' }}>
            <h3 style={{ color: '#78350f', marginTop: 0 }}>⚠️ Age Verification Required</h3>
            <p style={{ color: '#92400e', marginBottom: '1rem' }}>
              You must verify you are 18 years or older to track sweepstakes entries and participate in drawings.
            </p>
            <Button onClick={requestVerification}>
              Verify Age & Begin Tracking Entries
            </Button>
          </Card>
        ) : (
          <>
            {/* Section 1: Current Entries & Drawing Info */}
            <SectionGrid>
              <InfoCard>
                <InfoCardTitle>📊 Your Current Entries</InfoCardTitle>
                <EntryCount>{entries?.total || 0}</EntryCount>
                <EntryBreakdown>
                  <BreakdownItem>
                    <span>💡 Campaign Creation:</span>
                    <span>{entries?.campaignCreation || 0}</span>
                  </BreakdownItem>
                  <BreakdownItem>
                    <span>❤️ Donations:</span>
                    <span>{entries?.donations || 0}</span>
                  </BreakdownItem>
                  <BreakdownItem>
                    <span>📢 Shares:</span>
                    <span>{entries?.shares || 0}</span>
                  </BreakdownItem>
                </EntryBreakdown>
              </InfoCard>

              <DrawingInfo>
                <DrawingTitle>🎯 Next Drawing</DrawingTitle>
                {drawing ? (
                  <>
                    <DrawingDate>
                      {new Date(drawing.targetDate).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </DrawingDate>
                    <DrawingCountdown>
                      {daysUntilDrawing > 0
                        ? `${daysUntilDrawing} day${daysUntilDrawing !== 1 ? 's' : ''} away`
                        : 'Drawing today!'}
                    </DrawingCountdown>
                    <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.2)' }}>
                      <small style={{ opacity: 0.9 }}>
                        Entries in drawing: {drawing.currentEntries}
                      </small>
                    </div>
                  </>
                ) : (
                  <p>No active drawing at the moment</p>
                )}
              </DrawingInfo>
            </SectionGrid>

            {/* Quick Stats */}
            <Section>
              <SectionTitle>Your Stats</SectionTitle>
              <StatsGrid>
                <StatBox>
                  <StatValue>{entries?.total || 0}</StatValue>
                  <StatLabel>Total Entries</StatLabel>
                </StatBox>
                <StatBox>
                  <StatValue>
                    {entries?.donationAmount ? (entries.donationAmount / 100).toFixed(0) : 0}
                  </StatValue>
                  <StatLabel>Donated ($)</StatLabel>
                </StatBox>
                <StatBox>
                  <StatValue>{entries?.shares || 0}</StatValue>
                  <StatLabel>Shares Made</StatLabel>
                </StatBox>
              </StatsGrid>
            </Section>

            {/* Section 2: Past Winnings */}
            <Section>
              <SectionHeader>
                <SectionTitle>🏆 Past Winnings</SectionTitle>
              </SectionHeader>
              <PastWinningsTable pageSize={5} />
            </Section>

            {/* Section 3: Leaderboard */}
            <Section>
              <SectionHeader>
                <SectionTitle>📈 Current Leaderboard</SectionTitle>
              </SectionHeader>
              <SweepstakesLeaderboard limit={10} />
            </Section>

            {/* Info Section */}
            <Section>
              <Card style={{ padding: '24px', background: '#ecfdf5', borderColor: '#86efac' }}>
                <h3 style={{ marginTop: 0, color: '#166534' }}>💡 How It Works</h3>
                <ul style={{ color: '#166534', lineHeight: '1.8' }}>
                  <li>Each entry you earn goes into the monthly drawing</li>
                  <li>More entries = better chances to win</li>
                  <li>Winners are selected randomly from all entries</li>
                  <li>Prize amounts vary each month</li>
                  <li>You can claim your prize via Venmo, PayPal, Bank Transfer, or Crypto</li>
                </ul>
              </Card>
            </Section>
          </>
        )}

        {/* Winner Notification Modal */}
        {selectedWinning && (
          <WinnerNotificationModal
            winning={selectedWinning}
            open={showWinnerModal}
            onClose={() => setShowWinnerModal(false)}
            onClaimClick={() => {
              setShowWinnerModal(false)
              setShowClaimModal(true)
            }}
          />
        )}

        {/* Claim Prize Modal */}
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

        {/* Age Verification Modal */}
        <AgeVerificationModal
          isOpen={showModal}
          onConfirm={confirmAge}
          onDecline={declineAge}
        />
      </Container>
    </>
  )
}
