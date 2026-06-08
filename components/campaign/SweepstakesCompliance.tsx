'use client'

import React from 'react'
import styled from 'styled-components'
import { AlertCircle, CheckCircle, Info } from 'lucide-react'

interface SweepstakesComplianceProps {
  variant?: 'banner' | 'card' | 'modal'
  showStateRestrictions?: boolean
  showAgeWarning?: boolean
}

const BannerContainer = styled.div`
  background: linear-gradient(135deg, #fef3c7 0%, #fcd34d 100%);
  border: 2px solid #f59e0b;
  border-radius: 8px;
  padding: 1.25rem;
  margin-bottom: 1.5rem;
`

const CardContainer = styled.div`
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
`

const ModalContainer = styled.div`
  background: white;
  border-radius: 12px;
  padding: 2rem;
`

const ComplianceTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 1rem 0;
  display: flex;
  align-items: center;
  gap: 0.75rem;

  svg {
    width: 1.5rem;
    height: 1.5rem;
    color: #f59e0b;
  }
`

const ComplianceSection = styled.div`
  margin-bottom: 1.25rem;

  &:last-child {
    margin-bottom: 0;
  }
`

const SectionTitle = styled.h4`
  font-size: 0.95rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 0.5rem 0;
`

const ComplianceText = styled.p`
  font-size: 0.875rem;
  color: #4b5563;
  line-height: 1.6;
  margin: 0;

  strong {
    color: #0f172a;
    font-weight: 600;
  }
`

const StatesList = styled.ul`
  font-size: 0.875rem;
  color: #4b5563;
  margin: 0;
  padding-left: 1.5rem;
  line-height: 1.6;

  li {
    margin-bottom: 0.25rem;

    &:last-child {
      margin-bottom: 0;
    }
  }
`

const WarningBox = styled.div`
  background: #fef3c7;
  border-left: 4px solid #f59e0b;
  padding: 1rem;
  border-radius: 4px;
  display: flex;
  gap: 0.75rem;
  margin-top: 0.75rem;

  svg {
    width: 1.25rem;
    height: 1.25rem;
    color: #d97706;
    flex-shrink: 0;
    margin-top: 0.125rem;
  }
`

const WarningText = styled.p`
  font-size: 0.875rem;
  color: #78350f;
  margin: 0;
  line-height: 1.5;
`

const CheckMark = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #16a34a;
  margin-bottom: 0.5rem;

  svg {
    width: 1.125rem;
    height: 1.125rem;
  }

  &:last-child {
    margin-bottom: 0;
  }
`

const DisclaimerText = styled.p`
  font-size: 0.8rem;
  color: #6b7280;
  margin: 1rem 0 0 0;
  font-style: italic;
  line-height: 1.5;
`

/**
 * SweepstakesCompliance Component
 * Displays sweepstakes compliance information including age verification,
 * state restrictions, and legal terms
 */
export const SweepstakesCompliance: React.FC<SweepstakesComplianceProps> = ({
  variant = 'card',
  showStateRestrictions = true,
  showAgeWarning = true,
}) => {
  const Container = variant === 'banner' ? BannerContainer : variant === 'modal' ? ModalContainer : CardContainer

  return (
    <Container>
      <ComplianceTitle>
        <AlertCircle />
        Sweepstakes Compliance & Legal Notice
      </ComplianceTitle>

      <ComplianceSection>
        <SectionTitle>🎯 Age Requirement</SectionTitle>
        <ComplianceText>
          You must be <strong>18 years of age or older</strong> to participate in this sweepstakes. By entering, you confirm that you meet this requirement and comply with all applicable laws.
        </ComplianceText>
        {showAgeWarning && (
          <WarningBox>
            <AlertCircle />
            <WarningText>
              Age verification will be conducted for all winners before prize distribution.
              False statements about age may result in disqualification and forfeiture of prizes.
            </WarningText>
          </WarningBox>
        )}
      </ComplianceSection>

      {showStateRestrictions && (
        <ComplianceSection>
          <SectionTitle>🚫 State Restrictions</SectionTitle>
          <ComplianceText>
            This sweepstakes is <strong>NOT available to residents of:</strong>
          </ComplianceText>
          <StatesList>
            <li>Florida</li>
            <li>New York</li>
            <li>Texas</li>
          </StatesList>
          <WarningBox>
            <AlertCircle />
            <WarningText>
              If you reside in a restricted state, you are prohibited from entering.
              Entries from restricted states will be automatically disqualified.
            </WarningText>
          </WarningBox>
        </ComplianceSection>
      )}

      <ComplianceSection>
        <SectionTitle>✅ Prize & Drawing Information</SectionTitle>
        <CheckMark>
          <CheckCircle />
          Prize pool: $500 total
        </CheckMark>
        <CheckMark>
          <CheckCircle />
          Winner selected: Every 2 months (June 3, August 3, October 3, etc.)
        </CheckMark>
        <CheckMark>
          <CheckCircle />
          Odds depend on number of entries received
        </CheckMark>
      </ComplianceSection>

      <ComplianceSection>
        <SectionTitle>📋 Entry Methods</SectionTitle>
        <ComplianceText>
          Entries are earned through:
          <ul style={{ margin: '0.5rem 0 0 1.5rem', paddingLeft: 0 }}>
            <li>Creating a campaign (1 entry)</li>
            <li>Making a donation (1 entry per donation)</li>
            <li>Sharing campaigns (1 entry per share)</li>
          </ul>
        </ComplianceText>
        <ComplianceText style={{ marginTop: '0.5rem' }}>
          No purchase necessary. Valid entries only; duplicate entries disqualified.
        </ComplianceText>
      </ComplianceSection>

      <ComplianceSection>
        <SectionTitle>⚖️ Legal Terms</SectionTitle>
        <ComplianceText>
          This sweepstakes is conducted in accordance with applicable federal, state, and local laws. Winners are selected randomly. HonestNeed reserves the right to disqualify any participant for fraudulent activity or violation of these terms. Prize is awarded as-is with no warranties. Void where prohibited by law.
        </ComplianceText>
      </ComplianceSection>

      <DisclaimerText>
        By participating, you agree to these terms and the official sweepstakes rules available upon request.
        For complete sweepstakes rules, contact{' '}
        <strong>legal@honestneed.com</strong>
      </DisclaimerText>
    </Container>
  )
}

/**
 * Export for different use cases
 */
export const SweepstakesComplianceBanner = (props: Omit<SweepstakesComplianceProps, 'variant'>) => (
  <SweepstakesCompliance {...props} variant="banner" />
)

export const SweepstakesComplianceCard = (props: Omit<SweepstakesComplianceProps, 'variant'>) => (
  <SweepstakesCompliance {...props} variant="card" />
)

export const SweepstakesComplianceModal = (props: Omit<SweepstakesComplianceProps, 'variant'>) => (
  <SweepstakesCompliance {...props} variant="modal" />
)
