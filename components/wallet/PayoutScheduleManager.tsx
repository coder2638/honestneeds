/**
 * Payout Schedule Manager
 * Allows users to configure automatic payout settings
 */

'use client'

import React, { useState } from 'react'
import styled from 'styled-components'
import { Calendar, Clock, AlertCircle, CheckCircle, Loader } from 'lucide-react'
import { usePayoutSchedule, useChangePayoutSchedule } from '@/api/hooks/useWallet'
import { Button } from '@/components/Button'
import { LoadingSpinner } from '@/components/LoadingSpinner'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`

const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`

const SectionTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: #0f172a;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  svg {
    width: 1.25rem;
    height: 1.25rem;
    color: #667eea;
  }
`

const ScheduleOptions = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
`

const ScheduleOption = styled.button<{ selected?: boolean }>`
  padding: 1.25rem;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  background: white;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  transition: all 0.2s;
  position: relative;

  ${(props) =>
    props.selected &&
    `
    border-color: #667eea;
    background: #f0f4ff;
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.15);
  `}

  &:hover {
    border-color: #667eea;
    background: ${(props) => (props.selected ? '#f0f4ff' : '#f8fafc')};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  svg {
    width: 1.5rem;
    height: 1.5rem;
    color: ${(props) => (props.selected ? '#667eea' : '#94a3b8')};
  }
`

const ScheduleLabel = styled.span`
  font-weight: 600;
  color: #0f172a;
  font-size: 0.9375rem;
`

const ScheduleFrequency = styled.span`
  font-size: 0.75rem;
  color: #64748b;
`

const UpcomingPayouts = styled.div`
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`

const PayoutItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
  border-bottom: 1px solid #e2e8f0;

  &:last-child {
    border-bottom: none;
  }
`

const PayoutDate = styled.span`
  font-weight: 500;
  color: #0f172a;
`

const PayoutStatus = styled.span`
  font-size: 0.875rem;
  color: #64748b;
`

const InfoBox = styled.div<{ type: 'info' | 'warning' | 'success' }>`
  display: flex;
  gap: 1rem;
  padding: 1rem 1.25rem;
  border-radius: 12px;
  border-left: 4px solid;

  ${(props) => {
    switch (props.type) {
      case 'info':
        return `
          background: #dbeafe;
          border-color: #0284c7;
          color: #0c4a6e;
        `
      case 'warning':
        return `
          background: #fef3c7;
          border-color: #ca8a04;
          color: #713f12;
        `
      case 'success':
        return `
          background: #dcfce7;
          border-color: #16a34a;
          color: #166534;
        `
    }
  }}

  svg {
    width: 1.25rem;
    height: 1.25rem;
    flex-shrink: 0;
    margin-top: 0.125rem;
  }

  strong {
    display: block;
    margin-bottom: 0.25rem;
  }
`

const ActionButton = styled(Button)`
  align-self: flex-start;
  margin-top: 1rem;
`

const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
`

const ErrorMessage = styled.span`
  color: #dc2626;
  font-size: 0.875rem;
  margin-top: 0.5rem;
  display: block;
`

/**
 * Payout Schedule Manager Component
 */
export const PayoutScheduleManager: React.FC = () => {
  const [selectedSchedule, setSelectedSchedule] = useState<'weekly' | 'bi-weekly' | 'monthly' | 'manual' | null>(null)
  const [isChanging, setIsChanging] = useState(false)

  const { data: schedule, isLoading: scheduleLoading, refetch } = usePayoutSchedule()
  const { mutate: changeSchedule, isPending: isChangePending, error } = useChangePayoutSchedule()

  React.useEffect(() => {
    if (schedule?.schedule_type) {
      setSelectedSchedule(schedule.schedule_type)
    }
  }, [schedule])

  const handleChangeSchedule = () => {
    if (!selectedSchedule) return

    setIsChanging(true)
    changeSchedule(selectedSchedule, {
      onSuccess: () => {
        setIsChanging(false)
        refetch()
      },
      onError: () => {
        setIsChanging(false)
      }
    })
  }

  if (scheduleLoading) {
    return (
      <LoadingContainer>
        <LoadingSpinner />
      </LoadingContainer>
    )
  }

  const formatDateList = (dates: string[] | undefined) => {
    if (!dates || dates.length === 0) return []
    return dates.slice(0, 3).map((date) => {
      const d = new Date(date)
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      })
    })
  }

  const upcomingDates = formatDateList(schedule?.next_payout_dates)

  return (
    <Container>
      {/* Current Schedule Info */}
      <Section>
        <SectionTitle>
          <Calendar />
          Current Schedule
        </SectionTitle>

        <InfoBox type="info">
          <Clock size={20} />
          <div>
            <strong>Schedule Type</strong>
            {schedule?.schedule_type ? (
              <span style={{ textTransform: 'capitalize' }}>
                Automatic {schedule.schedule_type.replace('-', ' ')} payouts
              </span>
            ) : (
              <span>No schedule set</span>
            )}
          </div>
        </InfoBox>

        {schedule?.current_pending_amount > 0 && (
          <InfoBox type="success">
            <CheckCircle size={20} />
            <div>
              <strong>Ready to Payout</strong>
              ${(schedule.current_pending_amount / 100).toLocaleString('en-US', { minimumFractionDigits: 2 })} is
              waiting to be processed
            </div>
          </InfoBox>
        )}
      </Section>

      {/* Schedule Selection */}
      <Section>
        <SectionTitle>
          <Calendar />
          Choose Your Payout Schedule
        </SectionTitle>

        <ScheduleOptions>
          <ScheduleOption
            selected={selectedSchedule === 'weekly'}
            onClick={() => setSelectedSchedule('weekly')}
            disabled={isChangePending}
          >
            <Calendar size={1.5} />
            <ScheduleLabel>Weekly</ScheduleLabel>
            <ScheduleFrequency>Every Monday</ScheduleFrequency>
          </ScheduleOption>

          <ScheduleOption
            selected={selectedSchedule === 'bi-weekly'}
            onClick={() => setSelectedSchedule('bi-weekly')}
            disabled={isChangePending}
          >
            <Calendar size={1.5} />
            <ScheduleLabel>Bi-Weekly</ScheduleLabel>
            <ScheduleFrequency>Every 2 weeks</ScheduleFrequency>
          </ScheduleOption>

          <ScheduleOption
            selected={selectedSchedule === 'monthly'}
            onClick={() => setSelectedSchedule('monthly')}
            disabled={isChangePending}
          >
            <Calendar size={1.5} />
            <ScheduleLabel>Monthly</ScheduleLabel>
            <ScheduleFrequency>First of month</ScheduleFrequency>
          </ScheduleOption>

          <ScheduleOption
            selected={selectedSchedule === 'manual'}
            onClick={() => setSelectedSchedule('manual')}
            disabled={isChangePending}
          >
            <Clock size={1.5} />
            <ScheduleLabel>Manual</ScheduleLabel>
            <ScheduleFrequency>On demand</ScheduleFrequency>
          </ScheduleOption>
        </ScheduleOptions>

        {error && (
          <ErrorMessage>
            Failed to update schedule. Please try again.
          </ErrorMessage>
        )}

        {selectedSchedule && selectedSchedule !== schedule?.schedule_type && (
          <ActionButton
            onClick={handleChangeSchedule}
            disabled={isChangePending}
          >
            {isChangePending ? (
              <>
                <Loader size={16} style={{ animation: 'spin 1s linear infinite' }} />
                Updating...
              </>
            ) : (
              'Update Schedule'
            )}
          </ActionButton>
        )}
      </Section>

      {/* Upcoming Payouts */}
      {upcomingDates.length > 0 && (
        <Section>
          <SectionTitle>
            <Clock />
            Upcoming Scheduled Payouts
          </SectionTitle>

          <UpcomingPayouts>
            {upcomingDates.map((date, index) => (
              <PayoutItem key={`${date}-${index}`}>
                <PayoutDate>{date}</PayoutDate>
                <PayoutStatus>
                  {index === 0 ? 'Next payout' : `In ${(index + 1) * (selectedSchedule === 'weekly' ? 7 : 14)} days`}
                </PayoutStatus>
              </PayoutItem>
            ))}
          </UpcomingPayouts>
        </Section>
      )}

      {/* Schedule Tips */}
      <Section>
        <SectionTitle>
          <AlertCircle />
          Schedule Tips
        </SectionTitle>

        <InfoBox type="info">
          <AlertCircle size={20} />
          <div>
            <strong>Minimum Balance Required</strong>
            Your account must have at least $5 available to trigger an automatic payout. Manual payouts can be
            requested anytime above the $5 minimum.
          </div>
        </InfoBox>

        <InfoBox type="info">
          <AlertCircle size={20} />
          <div>
            <strong>Processing Times Vary</strong>
            Actual payout times depend on your chosen payment method. Bank transfers typically take 3-5 business days,
            while Stripe payouts complete in 2-3 days.
          </div>
        </InfoBox>
      </Section>
    </Container>
  )
}

export default PayoutScheduleManager
