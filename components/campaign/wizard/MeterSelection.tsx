'use client'

import styled from 'styled-components'
import { Hand, TrendingUp, Users } from 'lucide-react'

/**
 * Meter Selection Component
 * Allows creators to select which meters to track in their campaign
 * 
 * FIX #2: Multi-Meter System - Meter Selection UI
 */

export type MeterType = 'money' | 'helping_hands' | 'customers'

interface MeterSelectOption {
  id: MeterType
  label: string
  icon: React.ReactNode
  description: string
  color: string
  requiresGoal: boolean
}

interface MeterSelectionProps {
  selected: MeterType[]
  onSelect: (meters: MeterType[], helpingHandsGoal?: number, customersGoal?: number) => void
  helpingHandsGoal?: number
  customersGoal?: number
  errors?: Record<string, string>
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`

const Title = styled.h3`
  font-size: 1.125rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 0.5rem 0;
`

const Description = styled.p`
  font-size: 0.9rem;
  color: #64748b;
  margin: 0 0 1.5rem 0;
  line-height: 1.6;
`

const MeterOptions = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`

const MeterOption = styled.label<{ selected: boolean; color: string }>`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1.5rem;
  border: 2px solid ${(props) => (props.selected ? props.color : '#e2e8f0')};
  background-color: ${(props) => (props.selected ? props.color + '11' : '#ffffff')};
  border-radius: 0.75rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${(props) => props.color};
    background-color: ${(props) => props.color + '08'};
  }

  input {
    display: none;
  }
`

const OptionHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`

const OptionIcon = styled.div<{ color: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border-radius: 0.5rem;
  background-color: ${(props) => props.color}22;
  color: ${(props) => props.color};
  flex-shrink: 0;
`

const OptionLabel = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`

const OptionTitle = styled.span`
  font-weight: 700;
  color: #0f172a;
  font-size: 0.95rem;
`

const OptionDescription = styled.span`
  font-size: 0.8rem;
  color: #64748b;
  line-height: 1.3;
`

const Checkbox = styled.div<{ selected: boolean; color: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.5rem;
  height: 1.5rem;
  border: 2px solid ${(props) => (props.selected ? props.color : '#cbd5e1')};
  background-color: ${(props) => (props.selected ? props.color : 'white')};
  border-radius: 0.375rem;
  flex-shrink: 0;
  color: white;
  font-weight: 700;

  svg {
    width: 1rem;
    height: 1rem;
  }
`

const GoalInputContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`

const GoalLabel = styled.label`
  font-size: 0.85rem;
  font-weight: 600;
  color: #0f172a;
`

const GoalInput = styled.input`
  padding: 0.5rem 0.75rem;
  border: 1px solid #cbd5e1;
  border-radius: 0.375rem;
  font-size: 0.9rem;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: #6366f1;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
  }
`

const SelectionSummary = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 1rem;
  background-color: #ecf0ff;
  border: 1px solid #c7d2fe;
  border-radius: 0.5rem;
  margin-top: 1rem;
`

const SummaryLabel = styled.span`
  font-size: 0.9rem;
  font-weight: 600;
  color: #4f46e5;
`

const SummaryValue = styled.span`
  font-size: 0.85rem;
  color: #6366f1;
  font-weight: 500;
`

const ErrorText = styled.span`
  font-size: 0.85rem;
  color: #ef4444;
  font-weight: 500;
  margin-top: 0.25rem;
`

/**
 * MeterSelection Component
 * Displays selectable meters for creator campaign setup
 */
export function MeterSelection({
  selected,
  onSelect,
  helpingHandsGoal,
  customersGoal,
  errors,
}: MeterSelectionProps) {
  const meterOptions: MeterSelectOption[] = [
    {
      id: 'money',
      label: '💰 Money Raised',
      icon: <TrendingUp size={20} />,
      description: 'Track monetary donations from supporters',
      color: '#3b82f6',
      requiresGoal: false,
    },
    {
      id: 'helping_hands',
      label: '🙌 Helping Hands',
      icon: <Hand size={20} />,
      description: 'Track volunteers offering labor, services, or time',
      color: '#10b981',
      requiresGoal: true,
    },
    {
      id: 'customers',
      label: '👥 Customers',
      icon: <Users size={20} />,
      description: 'Track new customers or referrals for your business',
      color: '#f59e0b',
      requiresGoal: true,
    },
  ]

  const handleMeterToggle = (meterId: MeterType) => {
    const newSelected = selected.includes(meterId)
      ? selected.filter((m) => m !== meterId)
      : [...selected, meterId]

    onSelect(
      newSelected,
      helpingHandsGoal,
      customersGoal
    )
  }

  const handleGoalChange = (meterId: MeterType, value: number) => {
    if (meterId === 'helping_hands') {
      onSelect(selected, value, customersGoal)
    } else if (meterId === 'customers') {
      onSelect(selected, helpingHandsGoal, value)
    }
  }

  const selectedCount = selected.length

  return (
    <Container>
      <div>
        <Title>📊 Select Campaign Meters</Title>
        <Description>
          Choose which support metrics to track for your campaign. You can select 1-3 meters.
          Money meter is always available for fundraising campaigns.
        </Description>
      </div>

      <MeterOptions>
        {meterOptions.map((option) => (
          <MeterOption
            key={option.id}
            selected={selected.includes(option.id)}
            color={option.color}
          >
            <input
              type="checkbox"
              checked={selected.includes(option.id)}
              onChange={() => handleMeterToggle(option.id)}
              disabled={option.id === 'money'} // Money is required
            />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <OptionHeader>
                <OptionIcon color={option.color}>{option.icon}</OptionIcon>
                <OptionLabel>
                  <OptionTitle>{option.label}</OptionTitle>
                  <OptionDescription>{option.description}</OptionDescription>
                </OptionLabel>
              </OptionHeader>

              <Checkbox selected={selected.includes(option.id)} color={option.color}>
                {selected.includes(option.id) && '✓'}
              </Checkbox>
            </div>

            {selected.includes(option.id) && option.requiresGoal && (
              <GoalInputContainer>
                <GoalLabel htmlFor={`${option.id}-goal`}>
                  {option.id === 'helping_hands' ? 'Volunteer Goal' : 'Customer Goal'}
                </GoalLabel>
                <GoalInput
                  id={`${option.id}-goal`}
                  type="number"
                  min="1"
                  value={
                    option.id === 'helping_hands'
                      ? helpingHandsGoal || ''
                      : customersGoal || ''
                  }
                  onChange={(e) => handleGoalChange(option.id, parseInt(e.target.value) || 0)}
                  placeholder={`Enter target ${option.id === 'helping_hands' ? 'volunteers' : 'customers'}`}
                />
                {errors?.[`${option.id}_goal`] && (
                  <ErrorText>{errors[`${option.id}_goal`]}</ErrorText>
                )}
              </GoalInputContainer>
            )}
          </MeterOption>
        ))}
      </MeterOptions>

      {selectedCount > 0 && (
        <SelectionSummary>
          <SummaryLabel>✓ Selected Metrics: {selectedCount}</SummaryLabel>
          {selected.map((meter) => {
            const option = meterOptions.find((o) => o.id === meter)
            return (
              <SummaryValue key={meter}>
                {option?.label}
                {meter === 'helping_hands' && helpingHandsGoal && ` (Goal: ${helpingHandsGoal})`}
                {meter === 'customers' && customersGoal && ` (Goal: ${customersGoal})`}
              </SummaryValue>
            )
          })}
        </SelectionSummary>
      )}
    </Container>
  )
}
