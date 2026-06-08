/**
 * ScheduleCampaignModal.tsx
 * Modal component for scheduling campaign activation with DatePicker
 * Allows creators to choose when their draft campaign should go live
 */

'use client'

import React, { useState } from 'react'
import styled from 'styled-components'
import { X, Calendar, Clock, AlertCircle } from 'lucide-react'

interface ScheduleCampaignModalProps {
  campaignId: string
  campaignTitle?: string
  isOpen: boolean
  onClose: () => void
  onSchedule: (scheduledTime: Date) => Promise<void>
  existingScheduledTime?: Date | null
}

const Overlay = styled.div<{ isOpen: boolean }>`
  display: ${props => (props.isOpen ? 'block' : 'none')};
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
  animation: fadeIn 0.2s ease-in;

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`

const ModalCore = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  border-radius: 12px;
  padding: 32px;
  max-width: 500px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  z-index: 1000;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: slideUp 0.3s ease-out;

  @keyframes slideUp {
    from {
      transform: translate(-50%, -40%);
      opacity: 0;
    }
    to {
      transform: translate(-50%, -50%);
      opacity: 1;
    }
  }
`

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;

  h2 {
    margin: 0;
    font-size: 24px;
    font-weight: 700;
    color: #1f2937;
  }
`

const CloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: #9ca3af;
  font-size: 24px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    color: #6b7280;
  }
`

const InfoBox = styled.div`
  display: flex;
  gap: 12px;
  padding: 12px 16px;
  background: #fef3c7;
  border-left: 4px solid #f59e0b;
  border-radius: 6px;
  margin-bottom: 24px;
  font-size: 14px;
  color: #92400e;

  svg {
    flex-shrink: 0;
    margin-top: 2px;
  }
`

const FormGroup = styled.div`
  margin-bottom: 24px;
`

const Label = styled.label`
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 8px;
`

const DateTimeInputWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
`

const InputField = styled.input`
  padding: 10px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  font-family: inherit;

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }

  &:disabled {
    background: #f3f4f6;
    cursor: not-allowed;
  }
`

const PreviewBox = styled.div`
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  padding: 16px;
  margin-bottom: 24px;
`

const PreviewLabel = styled.div`
  font-size: 12px;
  color: #9ca3af;
  font-weight: 500;
  text-transform: uppercase;
  margin-bottom: 8px;
`

const PreviewValue = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
`

const PreviewMetadata = styled.div`
  font-size: 13px;
  color: #6b7280;
  margin-top: 8px;
  display: flex;
  align-items: center;
  gap: 4px;
`

const ValidationMessage = styled.div<{ type: 'error' | 'warning' | 'info' }>`
  font-size: 13px;
  padding: 8px 12px;
  border-radius: 6px;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 8px;

  ${props => {
    switch (props.type) {
      case 'error':
        return 'background: #fee2e2; color: #991b1b; border-left: 3px solid #dc2626;'
      case 'warning':
        return 'background: #fef3c7; color: #92400e; border-left: 3px solid #f59e0b;'
      case 'info':
        return 'background: #dbeafe; color: #0c4a6e; border-left: 3px solid #0284c7;'
    }
  }}
`

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
`

const Button = styled.button<{ variant?: 'primary' | 'secondary' | 'danger' }>`
  flex: 1;
  padding: 12px 16px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  ${props => {
    switch (props.variant) {
      case 'danger':
        return `
          background: #fee2e2;
          color: #991b1b;
          border: 1px solid #fca5a5;

          &:hover {
            background: #fecaca;
          }

          &:disabled {
            background: #f3f4f6;
            color: #9ca3af;
            cursor: not-allowed;
          }
        `
      case 'secondary':
        return `
          background: #f3f4f6;
          color: #374151;
          border: 1px solid #d1d5db;

          &:hover {
            background: #e5e7eb;
          }

          &:disabled {
            background: #f3f4f6;
            color: #9ca3af;
            cursor: not-allowed;
          }
        `
      default:
        return `
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;

          &:hover:not(:disabled) {
            transform: translateY(-2px);
            box-shadow: 0 8px 16px rgba(102, 126, 234, 0.4);
          }

          &:active:not(:disabled) {
            transform: translateY(0);
          }

          &:disabled {
            background: #d1d5db;
            cursor: not-allowed;
          }
        `
    }
  }}
`

const ConstraintsInfo = styled.div`
  font-size: 12px;
  color: #6b7280;
  line-height: 1.6;
  margin-bottom: 16px;

  ul {
    margin: 8px 0 0 16px;
    padding: 0;

    li {
      margin: 4px 0;
    }
  }
`

/**
 * ScheduleCampaignModal Component
 */
const ScheduleCampaignModal: React.FC<ScheduleCampaignModalProps> = ({
  campaignId,
  campaignTitle = 'Your Campaign',
  isOpen,
  onClose,
  onSchedule,
  existingScheduledTime,
}) => {
  const [selectedDate, setSelectedDate] = useState<string>('')
  const [selectedTime, setSelectedTime] = useState<string>('09:00')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Initialize form with existing scheduled time if available
  React.useEffect(() => {
    if (existingScheduledTime && isOpen) {
      const date = new Date(existingScheduledTime)
      const dateStr = date.toISOString().split('T')[0]
      const timeStr = date.toTimeString().substring(0, 5)
      setSelectedDate(dateStr)
      setSelectedTime(timeStr)
    } else if (isOpen) {
      // Default to tomorrow at 9 AM
      const tomorrow = new Date()
      tomorrow.setDate(tomorrow.getDate() + 1)
      const dateStr = tomorrow.toISOString().split('T')[0]
      setSelectedDate(dateStr)
      setSelectedTime('09:00')
    }
    setError(null)
  }, [isOpen, existingScheduledTime])

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(e.target.value)
    setError(null)
  }

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedTime(e.target.value)
    setError(null)
  }

  const handleSchedule = async () => {
    try {
      setError(null)
      setIsLoading(true)

      if (!selectedDate) {
        setError('Please select a date')
        return
      }

      if (!selectedTime) {
        setError('Please select a time')
        return
      }

      // Combine date and time
      const scheduledDateTime = new Date(`${selectedDate}T${selectedTime}:00`)

      if (isNaN(scheduledDateTime.getTime())) {
        setError('Invalid date or time')
        return
      }

      if (scheduledDateTime <= new Date()) {
        setError('Scheduled time must be in the future')
        return
      }

      if (scheduledDateTime > new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)) {
        setError('Cannot schedule more than 1 year in advance')
        return
      }

      await onSchedule(scheduledDateTime)
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to schedule campaign')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    setError(null)
    onClose()
  }

  // Calculate minimum date (tomorrow)
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const minDate = tomorrow.toISOString().split('T')[0]

  // Calculate maximum date (1 year from now)
  const maxDate = new Date()
  maxDate.setFullYear(maxDate.getFullYear() + 1)
  const maxDateStr = maxDate.toISOString().split('T')[0]

  // Format preview date
  const previewDate = selectedDate && selectedTime ? new Date(`${selectedDate}T${selectedTime}:00`) : null
  const previewDateStr = previewDate
    ? previewDate.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'Select date and time'
  const previewTimeStr = previewDate ? previewDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }) : ''
  const daysUntilActivation = previewDate ? Math.ceil((previewDate.getTime() - Date.now()) / (24 * 60 * 60 * 1000)) : 0

  return (
    <>
      <Overlay isOpen={isOpen} onClick={handleCancel} />
      <ModalCore>
        <Header>
          <h2>Schedule Campaign Activation</h2>
          <CloseButton onClick={handleCancel}>
            <X size={24} />
          </CloseButton>
        </Header>

        <InfoBox>
          <AlertCircle size={20} />
          <div>
            <strong>{campaignTitle}</strong> will be automatically activated on your chosen date and time. Supporters will then be able to find and donate to your campaign.
          </div>
        </InfoBox>

        {error && (
          <ValidationMessage type="error">
            <AlertCircle size={16} />
            {error}
          </ValidationMessage>
        )}

        <FormGroup>
          <Label>Activation Date & Time</Label>
          <DateTimeInputWrapper>
            <div>
              <InputField
                type="date"
                value={selectedDate}
                onChange={handleDateChange}
                min={minDate}
                max={maxDateStr}
                disabled={isLoading}
              />
            </div>
            <div>
              <InputField
                type="time"
                value={selectedTime}
                onChange={handleTimeChange}
                disabled={isLoading}
              />
            </div>
          </DateTimeInputWrapper>
        </FormGroup>

        {previewDate && (
          <PreviewBox>
            <PreviewLabel>Activation Preview</PreviewLabel>
            <PreviewValue>{previewDateStr}</PreviewValue>
            <PreviewMetadata>
              <Clock size={14} />
              {previewTimeStr} (UTC)
            </PreviewMetadata>
            {daysUntilActivation >= 0 && (
              <PreviewMetadata style={{ marginTop: '8px' }}>
                <Calendar size={14} />
                {daysUntilActivation === 0
                  ? 'Activating today'
                  : `${daysUntilActivation} ${daysUntilActivation === 1 ? 'day' : 'days'} from now`}
              </PreviewMetadata>
            )}
          </PreviewBox>
        )}

        <ConstraintsInfo>
          <strong>Requirements:</strong>
          <ul>
            <li>Must be at least 1 day in the future</li>
            <li>Cannot exceed 1 year from today</li>
            <li>Campaign remains in draft until activation time</li>
            <li>You can reschedule or cancel anytime before activation</li>
          </ul>
        </ConstraintsInfo>

        <ButtonGroup>
          <Button variant="secondary" onClick={handleCancel} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleSchedule} disabled={isLoading || !selectedDate || !selectedTime}>
            {isLoading ? 'Scheduling...' : existingScheduledTime ? 'Update Schedule' : 'Schedule Campaign'}
          </Button>
        </ButtonGroup>

        {existingScheduledTime && (
          <Button
            variant="danger"
            onClick={async () => {
              // Call onSchedule with null or special indicator to cancel
              // Or expose a separate cancel method
            }}
            disabled={isLoading}
          >
            Cancel Scheduled Activation
          </Button>
        )}
      </ModalCore>
    </>
  )
}

export default ScheduleCampaignModal
