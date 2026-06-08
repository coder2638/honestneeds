'use client'

import styled from 'styled-components'
import { BOOST_TIERS } from '@/utils/boostValidationSchemas'
import { Check } from 'lucide-react'

interface BoostTierCardProps {
  tier: keyof typeof BOOST_TIERS
  isSelected?: boolean
  onSelect?: (tier: keyof typeof BOOST_TIERS) => void
  disabled?: boolean
}

// Styled Components
const CardContainer = styled.div<{ $isSelected: boolean; $disabled: boolean }>`
  position: relative;
  border-radius: 0.5rem;
  border: 2px solid ${(props) => (props.$isSelected ? '#3b82f6' : '#e5e7eb')};
  padding: 1.5rem;
  transition: all 200ms ease;
  background-color: ${(props) => (props.$isSelected ? '#eff6ff' : '#ffffff')};
  box-shadow: ${(props) =>
    props.$isSelected ? '0 4px 6px -1px rgba(0, 0, 0, 0.1)' : '0 1px 2px 0 rgba(0, 0, 0, 0.05)'};
  cursor: ${(props) => (props.$disabled ? 'not-allowed' : 'pointer')};
  opacity: ${(props) => (props.$disabled ? 0.5 : 1)};

  &:hover {
    ${(props) =>
      !props.$disabled &&
      `
      border-color: #d1d5db;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    `}
  }
`

const RecommendedBadge = styled.div`
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%);
  display: inline-block;
`

const BadgeText = styled.span`
  background-color: #3b82f6;
  color: white;
  font-size: 0.75rem;
  font-weight: 700;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  display: inline-block;
`

const CheckIcon = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.5rem;
  height: 1.5rem;
  background-color: #3b82f6;
  color: white;
  border-radius: 9999px;
`

const Title = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 0.5rem;
`

const PricingSection = styled.div`
  margin-bottom: 1rem;
  padding-bottom: 1rem;
`

const Price = styled.span`
  font-size: 2rem;
  font-weight: 700;
  color: #111827;
`

const Duration = styled.span`
  color: #6b7280;
  margin-left: 0.5rem;
`

const VisibilityBadge = styled.div`
  margin-bottom: 1rem;
  padding: 0.75rem;
  background-color: #dbeafe;
  border-radius: 0.375rem;
`

const VisibilityText = styled.p`
  font-size: 0.875rem;
  font-weight: 600;
  color: #1e40af;
`

const FeaturesList = styled.ul`
  list-style: none;
  padding: 0;
  margin-bottom: 1.5rem;
  space: 0.5rem;
`

const FeatureItem = styled.li`
  display: flex;
  align-items: flex-start;
  margin-bottom: 0.5rem;

  &:before {
    content: '✓';
    color: #10b981;
    font-weight: bold;
    width: 1.25rem;
    margin-right: 0.5rem;
    flex-shrink: 0;
  }

  span {
    font-size: 0.875rem;
    color: #374151;
  }
`

const SelectButton = styled.button<{ $isSelected: boolean; $disabled: boolean }>`
  width: 100%;
  padding: 0.75rem 1rem;
  border-radius: 0.375rem;
  font-weight: 600;
  font-size: 0.875rem;
  transition: all 200ms ease;
  border: none;
  cursor: ${(props) => (props.$disabled ? 'not-allowed' : 'pointer')};
  opacity: ${(props) => (props.$disabled ? 0.5 : 1)};

  background-color: ${(props) => (props.$isSelected ? '#3b82f6' : '#f3f4f6')};
  color: ${(props) => (props.$isSelected ? 'white' : '#111827')};

  &:hover {
    ${(props) =>
      !props.$disabled &&
      `
      background-color: ${props.$isSelected ? '#2563eb' : '#e5e7eb'};
    `}
  }
`

/**
 * BoostTierCard Component
 * Displays a single boost tier with features and CTA
 */
export const BoostTierCard: React.FC<BoostTierCardProps> = ({
  tier,
  isSelected = false,
  onSelect,
  disabled = false,
}) => {
  const tierData = BOOST_TIERS[tier]

  if (!tierData) return null

  return (
    <CardContainer $isSelected={isSelected} $disabled={disabled} onClick={() => !disabled && onSelect?.(tier)}>
      {tierData.recommended && (
        <RecommendedBadge>
          <BadgeText>RECOMMENDED</BadgeText>
        </RecommendedBadge>
      )}

      {isSelected && (
        <CheckIcon>
          <Check size={18} />
        </CheckIcon>
      )}

      <Title>{tierData.name}</Title>

      <PricingSection>
        <Price>${tierData.price.toFixed(2)}</Price>
        <Duration>/ {tierData.duration_days} days</Duration>
      </PricingSection>

      <VisibilityBadge>
        <VisibilityText>{tierData.visibility_weight}x visibility multiplier</VisibilityText>
      </VisibilityBadge>

      <FeaturesList>
        {tierData.features.map((feature, index) => (
          <FeatureItem key={index}>
            <span>{feature}</span>
          </FeatureItem>
        ))}
      </FeaturesList>

      <SelectButton $isSelected={isSelected} $disabled={disabled}>
        {isSelected ? 'Selected' : 'Select'}
      </SelectButton>
    </CardContainer>
  )
}

export default BoostTierCard
