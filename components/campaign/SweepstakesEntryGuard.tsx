'use client'

import React from 'react'
import styled from 'styled-components'
import { AlertCircle, Lock } from 'lucide-react'
import Button from '@/components/ui/Button'
import { SweepstakesCompliance } from './SweepstakesCompliance'
import { AgeVerificationModal } from './AgeVerificationModal'
import { useAgeVerification, useSweepstakesCompliance } from '@/api/hooks/useSweepstakesCompliance'

interface SweepstakesEntryGuardProps {
  children: React.ReactNode
  onEntryEligible?: () => void
  entryType: 'campaign_creation' | 'donation' | 'share'
}

const RestrictedOverlay = styled.div`
  background: linear-gradient(135deg, rgba(239, 68, 68, 0.05) 0%, rgba(220, 38, 38, 0.05) 100%);
  border: 2px solid #fca5a5;
  border-radius: 12px;
  padding: 2rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
`

const RestrictedIcon = styled.div`
  width: 3rem;
  height: 3rem;
  background: #fee2e2;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    width: 1.75rem;
    height: 1.75rem;
    color: #dc2626;
  }
`

const RestrictedTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 700;
  color: #7f1d1d;
  margin: 0;
`

const RestrictedText = styled.p`
  font-size: 0.95rem;
  color: #b91c1c;
  margin: 0;
  line-height: 1.6;
`

const UnverifiedContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`

const WarningBanner = styled.div`
  background: #fef3c7;
  border: 1.5px solid #f59e0b;
  border-radius: 8px;
  padding: 1.25rem;
  display: flex;
  gap: 0.75rem;

  svg {
    width: 1.5rem;
    height: 1.5rem;
    color: #d97706;
    flex-shrink: 0;
  }
`

const WarningContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`

const WarningTitle = styled.h4`
  font-size: 0.95rem;
  font-weight: 600;
  color: #78350f;
  margin: 0;
`

const WarningText = styled.p`
  font-size: 0.875rem;
  color: #92400e;
  margin: 0;
  line-height: 1.5;
`

const ActionButton = styled(Button)`
  width: 100%;
  margin-top: 0.5rem;

  @media (min-width: 600px) {
    width: auto;
    margin-top: 0;
  }
`

interface EntryEligibilityProps {
  entryType: 'campaign_creation' | 'donation' | 'share'
}

const EntryTypeInfo: Record<string, { label: string; description: string }> = {
  campaign_creation: {
    label: 'Campaign Creation',
    description: 'Creating a campaign gives you 1 entry into the sweepstakes drawing.',
  },
  donation: {
    label: 'Donation',
    description: 'Each donation contributes 1 entry into the sweepstakes drawing.',
  },
  share: {
    label: 'Campaign Share',
    description: 'Sharing campaigns earns you 1 entry per successful share.',
  },
}

/**
 * SweepstakesEntryGuard Component
 * Wraps entry actions with compliance checks and age verification
 */
export const SweepstakesEntryGuard: React.FC<SweepstakesEntryGuardProps> = ({
  children,
  onEntryEligible,
  entryType,
}) => {
  const { ageVerified, isRestrictedState, canParticipate } = useSweepstakesCompliance()
  const { showModal, confirmAge, declineAge, requestVerification } = useAgeVerification()

  // If restricted state, show blocking message
  if (isRestrictedState) {
    return (
      <RestrictedOverlay>
        <RestrictedIcon>
          <Lock />
        </RestrictedIcon>
        <RestrictedTitle>Sweepstakes Not Available</RestrictedTitle>
        <RestrictedText>
          Unfortunately, sweepstakes participation is not available in your state due to legal regulations.
        </RestrictedText>
        <SweepstakesCompliance variant="card" showStateRestrictions={true} showAgeWarning={false} />
      </RestrictedOverlay>
    )
  }

  // If not age verified, show verification prompt
  if (!ageVerified) {
    return (
      <UnverifiedContainer>
        <WarningBanner>
          <AlertCircle />
          <WarningContent>
            <WarningTitle>Age Verification Required</WarningTitle>
            <WarningText>
              You must verify you are 18+ to participate in sweepstakes and earn entries from this{' '}
              {EntryTypeInfo[entryType].label.toLowerCase()}.
            </WarningText>
            <ActionButton onClick={requestVerification}>
              Verify Age & Enable Entry
            </ActionButton>
          </WarningContent>
        </WarningBanner>

        <SweepstakesCompliance variant="card" showStateRestrictions={true} showAgeWarning={true} />

        <AgeVerificationModal
          isOpen={showModal}
          onConfirm={() => {
            confirmAge()
            onEntryEligible?.()
          }}
          onDecline={declineAge}
        />
      </UnverifiedContainer>
    )
  }

  // User is eligible, render children
  return <>{children}</>
}

/**
 * SweepstakesEntryInfo Component
 * Shows entry earn information
 */
export const SweepstakesEntryInfo: React.FC<EntryEligibilityProps> = ({ entryType }) => {
  const info = EntryTypeInfo[entryType]

  return (
    <WarningBanner>
      <AlertCircle />
      <WarningContent>
        <WarningTitle>🎯 {info.label} - Earn Sweepstakes Entry</WarningTitle>
        <WarningText>{info.description}</WarningText>
      </WarningContent>
    </WarningBanner>
  )
}
