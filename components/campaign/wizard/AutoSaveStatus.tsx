'use client'

import React from 'react'
import styled from 'styled-components'
import { Check, AlertCircle, Loader } from 'lucide-react'

interface AutoSaveStatusProps {
  status: 'idle' | 'saving' | 'saved' | 'error'
  lastSavedAt: Date | null
  showTimestamp?: boolean
}

const StatusContainer = styled.div<{ $status: string }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-size: 0.875rem;
  white-space: nowrap;
  transition: all 0.3s ease;

  ${(props) => {
    switch (props.$status) {
      case 'saving':
        return `
          background-color: #FEF3C7;
          color: #92400E;
          border: 1px solid #FBBF24;
        `
      case 'saved':
        return `
          background-color: #D1FAE5;
          color: #065F46;
          border: 1px solid #6EE7B7;
        `
      case 'error':
        return `
          background-color: #FEE2E2;
          color: #991B1B;
          border: 1px solid #FCA5A5;
        `
      default:
        return `
          background-color: transparent;
          color: #6B7280;
          border: none;
          opacity: 0.6;
        `
    }
  }}
`

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1rem;
  height: 1rem;

  svg {
    width: 100%;
    height: 100%;
  }
`

const TextWrapper = styled.span`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`

const Timestamp = styled.span`
  font-size: 0.75rem;
  opacity: 0.8;
`

/**
 * AutoSaveStatus Component
 * Displays the auto-save status for the campaign wizard
 * Shows saving, saved, or error states with visual indicators
 */
export const AutoSaveStatus: React.FC<AutoSaveStatusProps> = ({
  status,
  lastSavedAt,
  showTimestamp = true,
}) => {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  if (status === 'idle' && !lastSavedAt) {
    return null
  }

  return (
    <StatusContainer $status={status}>
      <IconWrapper>
        {status === 'saving' && <Loader size={14} className="animate-spin" />}
        {status === 'saved' && <Check size={14} />}
        {status === 'error' && <AlertCircle size={14} />}
      </IconWrapper>

      <TextWrapper>
        {status === 'saving' && <span>Saving draft...</span>}
        {status === 'saved' && (
          <>
            <span>Draft saved</span>
            {showTimestamp && lastSavedAt && <Timestamp>{formatTime(lastSavedAt)}</Timestamp>}
          </>
        )}
        {status === 'error' && <span>Failed to save draft</span>}
      </TextWrapper>
    </StatusContainer>
  )
}

export default AutoSaveStatus
