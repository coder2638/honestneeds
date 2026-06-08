'use client'

import React, { useCallback } from 'react'
import styled from 'styled-components'
import { Users, TrendingUp, DollarSign, Info, Check } from 'lucide-react'

type MeterType = 'money' | 'helping_hands' | 'customers'

interface MeterSelectionStepProps {
  selectedMeters: MeterType[]
  onChange: (meters: MeterType[]) => void
  campaignType: 'fundraising' | 'sharing'
}

const Container = styled.div`
  display: grid;
  gap: 2rem;
`

const SectionTitle = styled.h3`
  margin: 0 0 1rem 0;
  font-size: 1.25rem;
  font-weight: 700;
  color: #0f172a;
`

const SectionDescription = styled.p`
  margin: 0 0 1.5rem 0;
  font-size: 0.95rem;
  color: #64748b;
  line-height: 1.6;
`

const MeterGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`

const MeterCard = styled.div<{ selected: boolean; disabled?: boolean }>`
  position: relative;
  border: 2px solid ${(props) => (props.selected ? '#6366f1' : '#e2e8f0')};
  border-radius: 12px;
  padding: 1.5rem;
  cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};
  transition: all 0.2s ease;
  background-color: ${(props) => (props.selected ? '#ede9fe' : props.disabled ? '#f1f5f9' : '#ffffff')};
  opacity: ${(props) => (props.disabled ? 0.6 : 1)};

  &:hover {
    border-color: ${(props) => (props.disabled ? '#e2e8f0' : '#6366f1')};
    background-color: ${(props) => (props.disabled ? '#f1f5f9' : '#ede9fe')};
    box-shadow: ${(props) =>
      props.disabled ? 'none' : '0 4px 12px rgba(99, 102, 241, 0.1)'};
  }
`

const MeterHeader = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 1rem;
`

const MeterIcon = styled.div<{ color: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3rem;
  height: 3rem;
  background-color: ${(props) => props.color};
  border-radius: 8px;
  flex-shrink: 0;

  svg {
    color: white;
    width: 1.5rem;
    height: 1.5rem;
  }
`

const MeterTitle = styled.h4`
  margin: 0 0 0.25rem 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: #0f172a;
`

const MeterSubtitle = styled.p`
  margin: 0;
  font-size: 0.75rem;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-weight: 500;
`

const MeterDescription = styled.p`
  margin: 0 0 1rem 0;
  font-size: 0.9rem;
  color: #475569;
  line-height: 1.5;
`

const Features = styled.ul`
  margin: 0;
  padding: 0 0 0 1.5rem;
  list-style: none;
  font-size: 0.875rem;
  color: #64748b;
  line-height: 1.7;

  li {
    margin-bottom: 0.5rem;
    padding-left: 0.5rem;

    &:before {
      content: '✓ ';
      color: #10b981;
      font-weight: 600;
      margin-right: 0.5rem;
    }
  }
`

const DisabledNotice = styled.div`
  background-color: #fef3c7;
  border: 1px solid #fcd34d;
  border-radius: 6px;
  padding: 0.75rem;
  font-size: 0.875rem;
  color: #b45309;
  display: flex;
  gap: 0.75rem;
  align-items: flex-start;

  svg {
    flex-shrink: 0;
    margin-top: 0.125rem;
  }
`

const SelectionCheckmark = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.5rem;
  height: 1.5rem;
  background-color: #6366f1;
  border-radius: 50%;
  color: white;

  svg {
    width: 0.9rem;
    height: 0.9rem;
  }
`

const InfoBox = styled.div`
  background-color: #eff6ff;
  border-left: 4px solid #3b82f6;
  border-radius: 6px;
  padding: 1rem;
  display: flex;
  gap: 0.75rem;
  font-size: 0.875rem;
  color: #1e40af;
  line-height: 1.6;

  svg {
    flex-shrink: 0;
    margin-top: 0.125rem;
  }
`

const METER_CONFIG: Record<
  MeterType,
  {
    title: string
    subtitle: string
    description: string
    features: string[]
    icon: React.ReactNode
    color: string
    availableFor: ('fundraising' | 'sharing')[]
  }
> = {
  money: {
    title: '💰 Money Meter',
    subtitle: 'Track Funding',
    description: 'Track donations and measure campaign funding progress toward your goal.',
    features: [
      'Track monetary donations',
      'Display funding progress',
      'Show funds raised vs. goal',
      'Monitor total supporters',
    ],
    icon: <DollarSign />,
    color: '#10b981',
    availableFor: ['fundraising', 'sharing'],
  },
  helping_hands: {
    title: '🛠️ Helping Hands Meter',
    subtitle: 'Track Volunteers',
    description:
      'Accept volunteer help and track the number of people supporting your cause with their time and effort.',
    features: [
      'Collect volunteer offers',
      'Accept or decline help',
      'Track volunteer commitments',
      'Display volunteer count',
      'Connect with skilled helpers',
    ],
    icon: <Users />,
    color: '#f59e0b',
    availableFor: ['fundraising'],
  },
  customers: {
    title: '📈 Customers Meter',
    subtitle: 'Track Growth',
    description:
      'For businesses and service providers: track customer/client acquisitions and growth milestones.',
    features: [
      'Set customer acquisition goals',
      'Track referrals and sign-ups',
      'Display customer count',
      'Measure business growth',
      'Celebrate milestones',
    ],
    icon: <TrendingUp />,
    color: '#3b82f6',
    availableFor: ['fundraising'],
  },
}

/**
 * MeterSelectionStep Component
 * Production-ready meter selection for campaigns
 * Allows creators to choose which support meters apply to their campaign
 */
export const MeterSelectionStep: React.FC<MeterSelectionStepProps> = ({
  selectedMeters,
  onChange,
  campaignType,
}) => {
  const handleToggleMeter = useCallback(
    (meter: MeterType) => {
      const config = METER_CONFIG[meter]
      
      // Check if meter is available for this campaign type
      if (!config.availableFor.includes(campaignType)) {
        return
      }

      const isSelected = selectedMeters.includes(meter)
      if (isSelected) {
        // Don't allow deselecting Money meter - it's required
        if (meter === 'money') {
          return
        }
        onChange(selectedMeters.filter((m) => m !== meter))
      } else {
        onChange([...selectedMeters, meter])
      }
    },
    [selectedMeters, onChange, campaignType]
  )

  const activeMeterCount = selectedMeters.length

  return (
    <Container>
      <div>
        <SectionTitle>Support Meters for Your Campaign</SectionTitle>
        <SectionDescription>
          Choose which types of support you want to track for your campaign. Supporters can help in
          multiple ways - by donating money, volunteering time, or becoming customers/clients. You
          must select at least the Money meter.
        </SectionDescription>

        <InfoBox>
          <Info size={18} />
          <span>
            <strong>Multiple meters:</strong> Supporters can contribute through any meter you select.
            Each meter displays separately to show different types of progress.
          </span>
        </InfoBox>
      </div>

      <MeterGrid>
        {(['money', 'helping_hands', 'customers'] as MeterType[]).map((meterType) => {
          const config = METER_CONFIG[meterType]
          const isAvailable = config.availableFor.includes(campaignType)
          const isSelected = selectedMeters.includes(meterType)
          const isRequired = meterType === 'money'

          return (
            <MeterCard
              key={meterType}
              selected={isSelected}
              disabled={!isAvailable}
              onClick={() => isAvailable && handleToggleMeter(meterType)}
            >
              {isSelected && (
                <SelectionCheckmark>
                  <Check size={16} />
                </SelectionCheckmark>
              )}

              <MeterHeader>
                <MeterIcon color={config.color}>{config.icon}</MeterIcon>
                <div>
                  <MeterTitle>{config.title}</MeterTitle>
                  <MeterSubtitle>{config.subtitle}</MeterSubtitle>
                </div>
              </MeterHeader>

              <MeterDescription>{config.description}</MeterDescription>

              <Features>
                {config.features.map((feature, idx) => (
                  <li key={idx}>{feature}</li>
                ))}
              </Features>

              {isRequired && (
                <div
                  style={{
                    marginTop: '1rem',
                    paddingTop: '1rem',
                    borderTop: '1px solid #e2e8f0',
                    fontSize: '0.75rem',
                    color: '#64748b',
                    fontWeight: 500,
                  }}
                >
                  ✓ Required
                </div>
              )}

              {!isAvailable && (
                <DisabledNotice style={{ marginTop: '1rem' }}>
                  <Info size={16} />
                  <span>Only available for fundraising campaigns</span>
                </DisabledNotice>
              )}
            </MeterCard>
          )
        })}
      </MeterGrid>

      <div
        style={{
          backgroundColor: '#f0fdf4',
          border: '1px solid #dbeafe',
          borderRadius: '8px',
          padding: '1rem',
          fontSize: '0.875rem',
          color: '#166534',
          lineHeight: '1.6',
        }}
      >
        <strong>Selected Meters: {activeMeterCount}</strong>
        <div style={{ marginTop: '0.5rem' }}>
          {selectedMeters.length === 0 ? (
            <span style={{ color: '#dc2626' }}>Please select at least one meter</span>
          ) : (
            selectedMeters.map((meter) => `${METER_CONFIG[meter].title}`).join(' + ')
          )}
        </div>
      </div>
    </Container>
  )
}
