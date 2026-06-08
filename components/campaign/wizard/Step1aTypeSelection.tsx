'use client'

import React from 'react'
import styled, { keyframes } from 'styled-components'

// ── Design tokens ──────────────────────────────────────────
const tokens = {
  indigo: '#4F46E5',
  indigoLight: '#EEF2FF',
  indigoMid: '#818CF8',
  indigoDark: '#4338CA',
  slate900: '#0F172A',
  slate600: '#475569',
  slate400: '#94A3B8',
  slate100: '#F1F5F9',
  slate50: '#F8FAFC',
  white: '#ffffff',
  border: '#E2E8F0',
  amber: '#D97706',
  amberLight: '#FFFBEB',
  green: '#059669',
  greenLight: '#ECFDF5',
  radius: '16px',
  radiusSm: '10px',
  transition: '0.2s cubic-bezier(0.4, 0, 0.2, 1)',
}

// ── Animations ─────────────────────────────────────────────
const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
`

// ── Shared typography ──────────────────────────────────────
const EyebrowLabel = styled.div`
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: ${tokens.indigo};
  margin-bottom: 0.75rem;
  display: flex;
  align-items: center;
  gap: 6px;

  &::before {
    content: '';
    display: inline-block;
    width: 16px;
    height: 2px;
    background: ${tokens.indigo};
    border-radius: 2px;
  }
`

const PageTitle = styled.h1`
  font-family: 'Syne', sans-serif;
  font-size: clamp(1.6rem, 4vw, 2.25rem);
  font-weight: 800;
  color: ${tokens.slate900};
  line-height: 1.15;
  margin-bottom: 0.75rem;
  letter-spacing: -0.02em;
`

const PageSubtitle = styled.p`
  font-size: 1rem;
  color: ${tokens.slate600};
  line-height: 1.65;
  max-width: 480px;
  font-weight: 300;
  margin: 0;
`

const Header = styled.div`
  margin-bottom: 2.5rem;
  animation: ${fadeUp} 0.4s ease both;
`

// ── Type card grid ─────────────────────────────────────────
const CardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin-bottom: 1.5rem;
  animation: ${fadeUp} 0.45s 0.05s ease both;

  @media (max-width: 540px) {
    grid-template-columns: 1fr;
  }
`

const CheckCircle = styled.div<{ $selected: boolean }>`
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  border: 1.5px solid ${({ $selected }) => ($selected ? tokens.indigo : tokens.border)};
  background: ${({ $selected }) => ($selected ? tokens.indigo : tokens.white)};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all ${tokens.transition};

  svg {
    opacity: ${({ $selected }) => ($selected ? 1 : 0)};
    transform: scale(${({ $selected }) => ($selected ? 1 : 0.5)});
    transition: all ${tokens.transition};
  }
`

const IconWrap = styled.div<{ $variant: 'fundraising' | 'sharing'; $selected: boolean }>`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ $variant, $selected }) =>
    $variant === 'fundraising'
      ? $selected ? 'rgba(245,158,11,0.2)' : tokens.amberLight
      : $selected ? 'rgba(16,185,129,0.2)' : tokens.greenLight};
  transition: background ${tokens.transition};
`

const CardTitle = styled.div`
  font-family: 'Syne', sans-serif;
  font-size: 1rem;
  font-weight: 700;
  color: ${tokens.slate900};
  margin-bottom: 0.35rem;
  letter-spacing: -0.01em;
`

const CardDesc = styled.div`
  font-size: 0.825rem;
  color: ${tokens.slate600};
  line-height: 1.6;
  font-weight: 300;
`

const CardTags = styled.div`
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  margin-top: 0.25rem;
`

const Tag = styled.span<{ $variant: 'amber' | 'green' }>`
  font-size: 10px;
  font-weight: 500;
  letter-spacing: 0.04em;
  padding: 3px 8px;
  border-radius: 6px;
  text-transform: uppercase;
  background: ${({ $variant }) => ($variant === 'amber' ? tokens.amberLight : tokens.greenLight)};
  color: ${({ $variant }) => ($variant === 'amber' ? '#92400E' : '#065F46')};
`

const TypeCard = styled.button<{ $selected: boolean }>`
  position: relative;
  background: ${({ $selected }) => ($selected ? tokens.indigoLight : tokens.white)};
  border: 1.5px solid ${({ $selected }) => ($selected ? tokens.indigo : tokens.border)};
  border-radius: ${tokens.radius};
  padding: 1.75rem 1.5rem;
  cursor: pointer;
  text-align: left;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  overflow: hidden;
  outline: none;
  box-shadow: ${({ $selected }) =>
    $selected ? '0 8px 32px rgba(79,70,229,0.15)' : 'none'};
  transition: all ${tokens.transition};

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(79,70,229,0.04) 0%, transparent 60%);
    opacity: ${({ $selected }) => ($selected ? 1 : 0)};
    transition: opacity ${tokens.transition};
  }

  &:hover {
    border-color: ${tokens.indigoMid};
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(79,70,229,0.1);

    &::before { opacity: 1; }
  }

  &:focus-visible {
    box-shadow: 0 0 0 3px rgba(79,70,229,0.3);
    border-color: ${tokens.indigo};
  }
`

// ── Icons ──────────────────────────────────────────────────
const FundraisingIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"
      stroke="#D97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const SharingIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <circle cx="18" cy="5" r="3" stroke="#059669" strokeWidth="2"/>
    <circle cx="6" cy="12" r="3" stroke="#059669" strokeWidth="2"/>
    <circle cx="18" cy="19" r="3" stroke="#059669" strokeWidth="2"/>
    <path d="M8.59 13.51l6.83 3.98M15.41 6.51L8.59 10.49"
      stroke="#059669" strokeWidth="2" strokeLinecap="round"/>
  </svg>
)

const CheckIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
    <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

// ── Component ──────────────────────────────────────────────
interface Step1aTypeSelectionProps {
  selectedType: 'fundraising' | 'sharing' | null
  onTypeSelect: (type: 'fundraising' | 'sharing') => void
}

export const Step1aTypeSelection: React.FC<Step1aTypeSelectionProps> = ({
  selectedType,
  onTypeSelect,
}) => (
  <div>
    <Header>
      <EyebrowLabel>Campaign type</EyebrowLabel>
      <PageTitle>What kind of campaign<br />are you launching?</PageTitle>
      <PageSubtitle>
        Pick the model that fits your goal — raise funds directly or
        reward your community for spreading the word.
      </PageSubtitle>
    </Header>

    <CardsGrid role="group" aria-label="Campaign type selection">
      {/* Fundraising */}
      <TypeCard
        type="button"
        $selected={selectedType === 'fundraising'}
        onClick={() => onTypeSelect('fundraising')}
        aria-pressed={selectedType === 'fundraising'}
      >
        <CheckCircle $selected={selectedType === 'fundraising'}>
          <CheckIcon />
        </CheckCircle>
        <IconWrap $variant="fundraising" $selected={selectedType === 'fundraising'}>
          <FundraisingIcon />
        </IconWrap>
        <div>
          <CardTitle>Fundraising</CardTitle>
          <CardDesc>
            Collect direct donations. Set a monetary goal, choose payment
            methods, and track every dollar raised.
          </CardDesc>
        </div>
        <CardTags>
          <Tag $variant="amber">Donations</Tag>
          <Tag $variant="amber">Goal tracking</Tag>
        </CardTags>
      </TypeCard>

      {/* Sharing */}
      <TypeCard
        type="button"
        $selected={selectedType === 'sharing'}
        onClick={() => onTypeSelect('sharing')}
        aria-pressed={selectedType === 'sharing'}
      >
        <CheckCircle $selected={selectedType === 'sharing'}>
          <CheckIcon />
        </CheckCircle>
        <IconWrap $variant="sharing" $selected={selectedType === 'sharing'}>
          <SharingIcon />
        </IconWrap>
        <div>
          <CardTitle>Sharing Campaign</CardTitle>
          <CardDesc>
            Reward supporters for sharing. Set a budget per share and
            track viral spread across social platforms.
          </CardDesc>
        </div>
        <CardTags>
          <Tag $variant="green">Viral reach</Tag>
          <Tag $variant="green">Rewards</Tag>
        </CardTags>
      </TypeCard>
    </CardsGrid>
  </div>
)