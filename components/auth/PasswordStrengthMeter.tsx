'use client'

import styled from 'styled-components'
import { evaluatePasswordStrength } from '@/utils/validationSchemas'

interface PasswordStrengthMeterProps {
  password: string
  showLabel?: boolean
}

// Styled Components
const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`

const StrengthBarWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`

const StrengthBarBackground = styled.div`
  flex: 1;
  height: 0.5rem;
  background-color: #e5e7eb;
  border-radius: 9999px;
  overflow: hidden;
`

const StrengthBarFill = styled.div<{ $percentage: number; $color: string }>`
  height: 100%;
  background-color: ${(props) => props.$color};
  width: ${(props) => props.$percentage}%;
  transition: all 0.3s ease;
`

const StrengthLabel = styled.span<{ $color: string }>`
  font-size: 0.875rem;
  font-weight: 500;
  color: ${(props) => props.$color};
`

const FeedbackMessage = styled.p`
  font-size: 0.75rem;
  color: #4b5563;
  margin: 0;
`

// Color mapping from Tailwind classes to hex colors
const colorMap: Record<string, string> = {
  'bg-red-500': '#ef4444',
  'bg-orange-500': '#f97316',
  'bg-yellow-500': '#eab308',
  'bg-blue-500': '#3b82f6',
  'bg-green-500': '#22c55e',
}

export function PasswordStrengthMeter({ password, showLabel = true }: PasswordStrengthMeterProps) {
  if (!password) {
    return null
  }

  const strength = evaluatePasswordStrength(password)
  const percentage = ((strength.score + 1) / 5) * 100
  
  // Convert Tailwind color class to hex
  const colorHex = colorMap[strength.color] || '#3b82f6'

  return (
    <Container>
      <StrengthBarWrapper>
        {/* Strength Bar */}
        <StrengthBarBackground>
          <StrengthBarFill $percentage={percentage} $color={colorHex} />
        </StrengthBarBackground>

        {/* Strength Label */}
        {showLabel && (
          <StrengthLabel $color={colorHex}>
            {strength.label}
          </StrengthLabel>
        )}
      </StrengthBarWrapper>

      {/* Feedback Message */}
      <FeedbackMessage>{strength.feedback}</FeedbackMessage>
    </Container>
  )
}
