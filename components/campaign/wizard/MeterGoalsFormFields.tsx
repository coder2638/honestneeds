'use client'

import React, { useCallback } from 'react'
import styled from 'styled-components'
import { AlertCircle } from 'lucide-react'

type MeterType = 'helping_hands' | 'customers'

interface MeterGoalsFormFieldsProps {
  selectedMeters: MeterType[]
  helpingHandsGoal?: number
  customersGoal?: number
  onChange: (field: string, value: number) => void
  errors?: Record<string, string>
}

const Container = styled.div`
  background: linear-gradient(135deg, #fef3c7 0%, #faf5e4 100%);
  border: 2px solid #fcd34d;
  border-radius: 12px;
  padding: 2rem;
  margin-top: 2rem;

  @media (max-width: 640px) {
    padding: 1.5rem;
  }
`

const Title = styled.h3`
  margin: 0 0 0.5rem 0;
  font-size: 1.25rem;
  font-weight: 700;
  color: #b45309;
  display: flex;
  align-items: center;
  gap: 0.75rem;
`

const Description = styled.p`
  margin: 0 0 1.5rem 0;
  font-size: 0.95rem;
  color: #92400e;
  line-height: 1.6;
`

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
`

const InputWithSlider = styled.div`
  display: flex;
  gap: 1rem;
  align-items: flex-end;

  @media (max-width: 640px) {
    flex-direction: column;
    align-items: stretch;
  }

  input[type='range'] {
    flex: 1;
    height: 6px;
    cursor: pointer;
    border-radius: 3px;
    outline: none;
    -webkit-appearance: none;
    appearance: none;
    background: linear-gradient(to right, #f59e0b 0%, #f59e0b var(--value, 50%), #e5e7eb var(--value, 50%), #e5e7eb 100%);

    &::-webkit-slider-thumb {
      -webkit-appearance: none;
      appearance: none;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: #f59e0b;
      cursor: pointer;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
      transition: all 0.2s ease;

      &:hover {
        background: #d97706;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
      }
    }

    &::-moz-range-thumb {
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: #f59e0b;
      cursor: pointer;
      border: none;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
      transition: all 0.2s ease;

      &:hover {
        background: #d97706;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
      }
    }
  }

  input[type='number'] {
    width: 120px;
    padding: 0.75rem;
    border: 2px solid #fcd34d;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 600;
    text-align: center;
    color: #1f2937;
    background-color: white;
    transition: all 0.2s ease;

    &:hover {
      border-color: #f59e0b;
      box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.1);
    }

    &:focus {
      outline: none;
      border-color: #f59e0b;
      box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.15);
    }

    @media (max-width: 640px) {
      width: 100%;
    }
  }
`

const DisplayValue = styled.div`
  font-size: 0.875rem;
  color: #78350f;
  font-weight: 500;
  margin-top: 0.5rem;
  padding: 0.5rem;
  background-color: rgba(255, 255, 255, 0.5);
  border-radius: 4px;
  text-align: center;
`

const ErrorBox = styled.div`
  background-color: #fee2e2;
  border-left: 4px solid #ef4444;
  border-radius: 6px;
  padding: 0.75rem;
  display: flex;
  gap: 0.75rem;
  color: #dc2626;
  font-size: 0.875rem;
  line-height: 1.5;
  margin-top: 0.5rem;

  svg {
    flex-shrink: 0;
    margin-top: 0.125rem;
  }
`

const MeterNote = styled.div`
  background-color: rgba(255, 255, 255, 0.7);
  border-left: 4px solid #f59e0b;
  border-radius: 6px;
  padding: 0.875rem;
  font-size: 0.875rem;
  color: #92400e;
  line-height: 1.6;
  margin-top: 1rem;
`

/**
 * MeterGoalsFormFields Component
 * Production-ready form for setting goals on optional meters
 * Allows creators to set targets for Helping Hands and Customers meters
 */
export const MeterGoalsFormFields: React.FC<MeterGoalsFormFieldsProps> = ({
  selectedMeters,
  helpingHandsGoal = 0,
  customersGoal = 0,
  onChange,
  errors = {},
}) => {
  if (!selectedMeters || selectedMeters.length === 0) {
    return null
  }

  const hasHelpingHands = selectedMeters.includes('helping_hands')
  const hasCustomers = selectedMeters.includes('customers')

  if (!hasHelpingHands && !hasCustomers) {
    return null
  }

  const handleHelpingHandsChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = parseInt(e.currentTarget.value) || 0
      onChange('helpingHandsGoal', Math.max(1, Math.min(10000, value)))
    },
    [onChange]
  )

  const handleCustomersChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = parseInt(e.currentTarget.value) || 0
      onChange('customersGoal', Math.max(1, Math.min(1000000, value)))
    },
    [onChange]
  )

  return (
    <Container>
      <Title>🎯 Optional Meter Goals</Title>
      <Description>
        Set targets for your other support meters. These are optional but help supporters understand
        your goals.
      </Description>

      <FormGrid>
        {hasHelpingHands && (
          <div>
            <label style={{ fontWeight: '600', marginBottom: '0.5rem', display: 'block', color: '#111827' }}>
              🛠️ Helping Hands Goal
            </label>
            <InputWithSlider>
              <input
                type="range"
                min="1"
                max="10000"
                value={helpingHandsGoal}
                onChange={handleHelpingHandsChange}
                style={{ '--value': `${(helpingHandsGoal / 10000) * 100}%` } as React.CSSProperties}
                title="Drag to set volunteer goal"
              />
              <input
                type="number"
                value={helpingHandsGoal || ''}
                onChange={handleHelpingHandsChange}
                min="1"
                max="10000"
                placeholder="# of volunteers"
              />
            </InputWithSlider>
            {errors.helpingHandsGoal && (
              <ErrorBox>
                <AlertCircle size={16} />
                <span>{errors.helpingHandsGoal}</span>
              </ErrorBox>
            )}
            <DisplayValue>
              {helpingHandsGoal > 0
                ? `Target: ${helpingHandsGoal.toLocaleString()} volunteer${helpingHandsGoal !== 1 ? 's' : ''}`
                : 'No goal set'}
            </DisplayValue>
            <MeterNote>
              <strong>How it works:</strong> Set a target number of volunteers you&apos;d like to help
              with your campaign. This helps potential helpers understand the scope.
            </MeterNote>
          </div>
        )}

        {hasCustomers && (
          <div>
            <label style={{ fontWeight: '600', marginBottom: '0.5rem', display: 'block', color: '#111827' }}>
              📈 Customers Goal
            </label>
            <InputWithSlider>
              <input
                type="range"
                min="1"
                max="1000000"
                value={customersGoal}
                onChange={handleCustomersChange}
                style={{ '--value': `${Math.min((customersGoal / 1000000) * 100, 100)}%` } as React.CSSProperties}
                title="Drag to set customer goal"
              />
              <input
                type="number"
                value={customersGoal || ''}
                onChange={handleCustomersChange}
                min="1"
                max="1000000"
                placeholder="# of customers"
              />
            </InputWithSlider>
            {errors.customersGoal && (
              <ErrorBox>
                <AlertCircle size={16} />
                <span>{errors.customersGoal}</span>
              </ErrorBox>
            )}
            <DisplayValue>
              {customersGoal > 0
                ? `Target: ${customersGoal.toLocaleString()} customer${customersGoal !== 1 ? 's' : ''}`
                : 'No goal set'}
            </DisplayValue>
            <MeterNote>
              <strong>How it works:</strong> Set a target for customer/client acquisitions. As you
              reach milestones, the meter updates to show your business growth progress.
            </MeterNote>
          </div>
        )}
      </FormGrid>
    </Container>
  )
}
