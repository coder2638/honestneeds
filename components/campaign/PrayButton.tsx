'use client'

import React from 'react'
import styled from 'styled-components'
import { Button } from '@/components/Button'
import { COLORS, SPACING, BORDER_RADIUS, TRANSITIONS } from '@/styles/tokens'

interface PrayButtonProps {
  campaignId: string
  onPrayerSubmitted?: () => void
  disabled?: boolean
  className?: string
  showCount?: boolean
  prayerCount?: number
}

const Container = styled.div`
  display: flex;
  align-items: center;
  gap: ${SPACING.SM};
`

const PrayerCountDisplay = styled.div`
  display: flex;
  align-items: center;
  gap: ${SPACING.XS};
  font-size: 0.875rem;
  color: ${COLORS.TEXT_SECONDARY};
  background-color: ${COLORS.BACKGROUND_SECONDARY};
  border-radius: 9999px;
  padding: ${SPACING.XS} ${SPACING.SM};
  font-weight: 500;
`

/**
 * PrayButton Component
 * Displays prayer button to trigger prayer modal
 * Used in campaign cards and campaign detail pages
 */
const PrayButton: React.FC<PrayButtonProps> = ({
  campaignId,
  onPrayerSubmitted,
  disabled = false,
  className = '',
  showCount = false,
  prayerCount = 0,
}) => {
  const handleClick = () => {
    // This will be connected to PrayerModal via parent component
    // Emits event or calls callback to open modal
  }

  return (
    <Container className={className}>
      <Button
        variant="primary"
        size="sm"
        onClick={handleClick}
        disabled={disabled}
        title="Send a prayer of support"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: SPACING.SM,
          borderRadius: '9999px',
        }}
      >
        <span>🙏</span>
        <span>Pray</span>
      </Button>

      {showCount && prayerCount > 0 && (
        <PrayerCountDisplay>
          <span>✨</span>
          <span>{prayerCount}</span>
          <span>{prayerCount === 1 ? 'prayer' : 'prayers'}</span>
        </PrayerCountDisplay>
      )}
    </Container>
  )
}

export { PrayButton }
