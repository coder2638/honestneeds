'use client'

import styled from 'styled-components'

interface ProgressBarProps {
  current: number
  goal: number
  showPercentage?: boolean
  showValues?: boolean
  size?: 'sm' | 'md' | 'lg'
}

const heightMap = {
  sm: '0.25rem',
  md: '0.5rem',
  lg: '0.75rem',
}

const textSizeMap = {
  sm: '0.75rem',
  md: '0.875rem',
  lg: '1rem',
}

// Styled Components
const Container = styled.div`
  display: flex;
  flex-direction: column;
`

const ProgressContainer = styled.div<{ $size: 'sm' | 'md' | 'lg' }>`
  width: 100%;
  background-color: #e5e7eb;
  border-radius: 9999px;
  overflow: hidden;
  height: ${(props) => heightMap[props.$size]};
`

const ProgressFill = styled.div<{ $percentage: number }>`
  background: linear-gradient(
    to right,
    rgb(99, 102, 241),
    rgb(168, 85, 247)
  );
  border-radius: 9999px;
  height: 100%;
  width: ${(props) => props.$percentage}%;
  transition: width 0.5s ease-in-out;
`

const LabelsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 0.5rem;
`

const PercentageText = styled.span<{ $size: 'sm' | 'md' | 'lg' }>`
  font-weight: 600;
  color: #111827;
  font-size: ${(props) => textSizeMap[props.$size]};
`

const ValuesText = styled.div<{ $size: 'sm' | 'md' | 'lg' }>`
  color: #4b5563;
  font-size: ${(props) => textSizeMap[props.$size]};
`

export function ProgressBar({
  current,
  goal,
  showPercentage = true,
  showValues = true,
  size = 'md',
}: ProgressBarProps) {
  const percentage = goal > 0 ? Math.min((current / goal) * 100, 100) : 0

  return (
    <Container>
      <ProgressContainer $size={size}>
        <ProgressFill $percentage={percentage} />
      </ProgressContainer>

      {(showPercentage || showValues) && (
        <LabelsContainer>
          {showPercentage && (
            <PercentageText $size={size}>
              {percentage.toFixed(0)}% funded
            </PercentageText>
          )}
          {showValues && (
            <ValuesText $size={size}>
              ${(current / 100).toLocaleString('en-US', { maximumFractionDigits: 0 })} of $
              {(goal / 100).toLocaleString('en-US', {
                maximumFractionDigits: 0,
              })}
            </ValuesText>
          )}
        </LabelsContainer>
      )}
    </Container>
  )
}
