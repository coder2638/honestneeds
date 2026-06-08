import styled, { keyframes } from 'styled-components'

interface SkeletonProps {
  className?: string
}

// Keyframes for pulse animation
const pulse = keyframes`
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
`

// Styled Components
const StyledSkeleton = styled.div`
  background: linear-gradient(
    to right,
    #f3f4f6,
    rgba(243, 244, 246, 0.8),
    #f3f4f6
  );
  animation: ${pulse} 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  border-radius: 0.25rem;
`

export default function Skeleton({ className = '' }: SkeletonProps) {
  return <StyledSkeleton className={className} />
}
