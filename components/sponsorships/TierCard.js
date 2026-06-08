'use client'

import React from 'react'
import styled, { css } from 'styled-components'
import { COLORS, SPACING, SHADOWS, BORDER_RADIUS, TYPOGRAPHY, TRANSITIONS } from '@/styles/tokens'
import { Check, Star } from 'lucide-react'

/* ───── Styled Components ───── */

const CardContainer = styled.div`
  position: relative;
  background: ${COLORS.SURFACE};
  border: 2px solid ${(props) => (props.$popular ? COLORS.ACCENT : COLORS.BORDER)};
  border-radius: ${BORDER_RADIUS.XL};
  padding: ${SPACING[6]};
  display: flex;
  flex-direction: column;
  transition: all ${TRANSITIONS.BASE};
  overflow: hidden;

  ${(props) =>
    props.$popular &&
    css`
      box-shadow: 0 0 0 1px ${COLORS.ACCENT}, ${SHADOWS.LG};
      transform: scale(1.02);
    `}

  &:hover {
    box-shadow: ${SHADOWS.LG};
    transform: translateY(-4px);
    border-color: ${(props) => props.$accentColor || COLORS.PRIMARY};
  }
`

const PopularBadge = styled.div`
  position: absolute;
  top: -1px;
  right: -1px;
  background: linear-gradient(135deg, ${COLORS.ACCENT} 0%, ${COLORS.ACCENT_DARK} 100%);
  color: white;
  padding: 4px 16px;
  font-size: ${TYPOGRAPHY.SIZE_XS};
  font-weight: ${TYPOGRAPHY.WEIGHT_BOLD};
  letter-spacing: ${TYPOGRAPHY.LETTER_SPACING_WIDE};
  text-transform: uppercase;
  border-radius: 0 ${BORDER_RADIUS.XL} 0 ${BORDER_RADIUS.LG};
  display: flex;
  align-items: center;
  gap: 4px;
`

const TierIcon = styled.span`
  font-size: 2rem;
  margin-bottom: ${SPACING[2]};
  display: block;
`

const TierName = styled.h3`
  font-size: ${TYPOGRAPHY.SIZE_LG};
  font-weight: ${TYPOGRAPHY.WEIGHT_BOLD};
  color: ${COLORS.TEXT};
  margin: 0 0 ${SPACING[1]} 0;
`

const PriceRow = styled.div`
  display: flex;
  align-items: baseline;
  gap: ${SPACING[1]};
  margin-bottom: ${SPACING[4]};
`

const Price = styled.span`
  font-size: ${TYPOGRAPHY.SIZE_3XL};
  font-weight: ${TYPOGRAPHY.WEIGHT_EXTRABOLD};
  color: ${(props) => props.$color || COLORS.PRIMARY};
  line-height: 1;
`

const PriceSuffix = styled.span`
  font-size: ${TYPOGRAPHY.SIZE_SM};
  color: ${COLORS.MUTED_TEXT};
`

const PartnershipBadge = styled.span`
  display: inline-block;
  background: ${COLORS.PRIMARY_BG};
  color: ${COLORS.PRIMARY_DARK};
  padding: 2px 8px;
  border-radius: ${BORDER_RADIUS.FULL};
  font-size: ${TYPOGRAPHY.SIZE_XS};
  font-weight: ${TYPOGRAPHY.WEIGHT_SEMIBOLD};
  margin-bottom: ${SPACING[3]};
`

const Divider = styled.hr`
  border: none;
  border-top: 1px solid ${COLORS.BORDER};
  margin: ${SPACING[3]} 0;
`

const BenefitList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0 0 ${SPACING[5]} 0;
  flex: 1;
`

const BenefitItem = styled.li`
  display: flex;
  align-items: flex-start;
  gap: ${SPACING[2]};
  padding: ${SPACING[1]} 0;
  font-size: ${TYPOGRAPHY.SIZE_SM};
  color: ${COLORS.TEXT};
  line-height: ${TYPOGRAPHY.LINE_HEIGHT_NORMAL};

  svg {
    flex-shrink: 0;
    margin-top: 2px;
    color: ${COLORS.SUCCESS};
  }
`

const CTAButton = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: ${SPACING[3]} ${SPACING[4]};
  background: ${(props) =>
    props.$popular
      ? `linear-gradient(135deg, ${COLORS.ACCENT} 0%, ${COLORS.ACCENT_DARK} 100%)`
      : COLORS.PRIMARY};
  color: ${COLORS.SURFACE};
  font-weight: ${TYPOGRAPHY.WEIGHT_SEMIBOLD};
  font-size: ${TYPOGRAPHY.SIZE_BASE};
  border-radius: ${BORDER_RADIUS.MD};
  text-decoration: none;
  cursor: pointer;
  transition: all ${TRANSITIONS.BASE};
  border: none;

  &:hover {
    transform: translateY(-1px);
    box-shadow: ${SHADOWS.MD};
    opacity: 0.95;
    color: ${COLORS.SURFACE};
  }
`

/* ───── Component ───── */

export default function TierCard({ tier }) {
  const { id, name, price, recurring, popular, benefits, color, icon, partnershipYears } = tier

  return (
    <CardContainer $popular={popular} $accentColor={color} id={`tier-card-${id}`}>
      {popular && (
        <PopularBadge>
          <Star size={12} /> Most Popular
        </PopularBadge>
      )}

      <TierIcon>{icon}</TierIcon>
      <TierName>{name}</TierName>

      <PriceRow>
        <Price $color={color}>${price.toLocaleString()}</Price>
        <PriceSuffix>{recurring ? '/month' : 'one-time'}</PriceSuffix>
      </PriceRow>

      {partnershipYears && (
        <PartnershipBadge>{partnershipYears}-Year Partnership</PartnershipBadge>
      )}

      <Divider />

      <BenefitList>
        {benefits.map((benefit, i) => (
          <BenefitItem key={i}>
            <Check size={16} />
            <span>{benefit}</span>
          </BenefitItem>
        ))}
      </BenefitList>

      <CTAButton href={`/sponsorships/checkout/${id}`} $popular={popular}>
        Become a {popular ? '⭐ ' : ''}Sponsor
      </CTAButton>
    </CardContainer>
  )
}
