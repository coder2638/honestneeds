'use client'

import React from 'react'
import styled from 'styled-components'
import { COLORS, SPACING, BORDER_RADIUS, TYPOGRAPHY, SHADOWS, TRANSITIONS, MEDIA_QUERIES } from '@/styles/tokens'
import SponsorLogo from './SponsorLogo'
import { ExternalLink, Award } from 'lucide-react'

const WallContainer = styled.div`
  width: 100%;
`

const TierSection = styled.section`
  margin-bottom: ${SPACING[8]};
`

const TierHeading = styled.h3`
  font-size: ${TYPOGRAPHY.SIZE_LG};
  font-weight: ${TYPOGRAPHY.WEIGHT_SEMIBOLD};
  color: ${COLORS.MUTED_TEXT};
  margin: 0 0 ${SPACING[4]} 0;
  text-transform: uppercase;
  letter-spacing: ${TYPOGRAPHY.LETTER_SPACING_WIDE};
  display: flex;
  align-items: center;
  gap: ${SPACING[2]};
  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: ${COLORS.BORDER};
  }
`

const FeaturedGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: ${SPACING[5]};
  ${MEDIA_QUERIES.DOWN_SM} {
    grid-template-columns: 1fr;
  }
`

const FeaturedCard = styled.div`
  background: ${COLORS.SURFACE};
  border: 1px solid ${COLORS.BORDER};
  border-radius: ${BORDER_RADIUS.XL};
  padding: ${SPACING[6]};
  display: flex;
  gap: ${SPACING[4]};
  transition: all ${TRANSITIONS.BASE};
  position: relative;
  overflow: hidden;
  &::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 3px;
    background: linear-gradient(90deg, ${COLORS.ACCENT} 0%, ${COLORS.PRIMARY} 100%);
  }
  &:hover {
    box-shadow: ${SHADOWS.LG};
    transform: translateY(-2px);
  }
`

const SponsorInfo = styled.div`
  flex: 1;
  min-width: 0;
`

const SponsorName = styled.h4`
  font-size: ${TYPOGRAPHY.SIZE_LG};
  font-weight: ${TYPOGRAPHY.WEIGHT_BOLD};
  color: ${COLORS.TEXT};
  margin: 0 0 ${SPACING[1]} 0;
`

const SponsorTagline = styled.p`
  font-size: ${TYPOGRAPHY.SIZE_SM};
  color: ${COLORS.MUTED_TEXT};
  margin: 0 0 ${SPACING[2]} 0;
  line-height: ${TYPOGRAPHY.LINE_HEIGHT_NORMAL};
`

const SponsorLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: ${TYPOGRAPHY.SIZE_SM};
  color: ${COLORS.PRIMARY};
  text-decoration: none;
  &:hover { color: ${COLORS.PRIMARY_DARK}; text-decoration: underline; }
`

const TierBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: ${COLORS.ACCENT_BG};
  color: ${COLORS.ACCENT_DARK};
  padding: 2px 10px;
  border-radius: ${BORDER_RADIUS.FULL};
  font-size: ${TYPOGRAPHY.SIZE_XS};
  font-weight: ${TYPOGRAPHY.WEIGHT_SEMIBOLD};
  margin-top: ${SPACING[2]};
`

const CompactGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: ${SPACING[3]};
  ${MEDIA_QUERIES.DOWN_SM} {
    grid-template-columns: repeat(2, 1fr);
  }
`

const CompactCard = styled.div`
  background: ${COLORS.SURFACE};
  border: 1px solid ${COLORS.BORDER};
  border-radius: ${BORDER_RADIUS.LG};
  padding: ${SPACING[4]};
  display: flex;
  align-items: center;
  gap: ${SPACING[3]};
  transition: all ${TRANSITIONS.BASE};
  &:hover { box-shadow: ${SHADOWS.SM}; border-color: ${COLORS.PRIMARY_LIGHT}; }
`

const CompactName = styled.span`
  font-size: ${TYPOGRAPHY.SIZE_SM};
  font-weight: ${TYPOGRAPHY.WEIGHT_MEDIUM};
  color: ${COLORS.TEXT};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

const EmptyState = styled.div`
  text-align: center;
  padding: ${SPACING[12]} ${SPACING[6]};
  background: ${COLORS.SURFACE};
  border: 2px dashed ${COLORS.BORDER};
  border-radius: ${BORDER_RADIUS.XL};
`

const EmptyTitle = styled.h3`
  font-size: ${TYPOGRAPHY.SIZE_XL};
  font-weight: ${TYPOGRAPHY.WEIGHT_BOLD};
  color: ${COLORS.TEXT};
  margin: 0 0 ${SPACING[2]} 0;
`

const EmptySubtext = styled.p`
  font-size: ${TYPOGRAPHY.SIZE_BASE};
  color: ${COLORS.MUTED_TEXT};
  margin: 0 0 ${SPACING[5]} 0;
`

const CTALink = styled.a`
  display: inline-flex;
  align-items: center;
  padding: ${SPACING[3]} ${SPACING[6]};
  background: ${COLORS.PRIMARY};
  color: ${COLORS.SURFACE};
  border-radius: ${BORDER_RADIUS.MD};
  font-weight: ${TYPOGRAPHY.WEIGHT_SEMIBOLD};
  text-decoration: none;
  transition: all ${TRANSITIONS.BASE};
  &:hover { background: ${COLORS.PRIMARY_DARK}; box-shadow: ${SHADOWS.MD}; color: ${COLORS.SURFACE}; }
`

const FEATURED_TIERS = ['platinum_national', 'gold_sponsor_org', 'silver_sponsor_org', 'champion', 'growth_partner']
const MID_TIERS = ['platinum', 'gold']

function groupSponsors(sponsors) {
  const featured = sponsors.filter((s) => FEATURED_TIERS.includes(s.tierId))
  const mid = sponsors.filter((s) => MID_TIERS.includes(s.tierId))
  const lower = sponsors.filter((s) => !FEATURED_TIERS.includes(s.tierId) && !MID_TIERS.includes(s.tierId))
  return { featured, mid, lower }
}

export default function SponsorWallGrid({ sponsors = [] }) {
  if (!sponsors.length) {
    return (
      <EmptyState>
        <div style={{ fontSize: '3rem', marginBottom: SPACING[3] }}>🌟</div>
        <EmptyTitle>No sponsors yet — Be the first!</EmptyTitle>
        <EmptySubtext>Become a founding sponsor and help build a community that sees good and does good.</EmptySubtext>
        <CTALink href="/sponsorships">Become a Founding Sponsor →</CTALink>
      </EmptyState>
    )
  }

  const { featured, mid, lower } = groupSponsors(sponsors)

  return (
    <WallContainer>
      {featured.length > 0 && (
        <TierSection>
          <TierHeading><Award size={18} /> Featured Sponsors</TierHeading>
          <FeaturedGrid>
            {featured.map((s) => (
              <FeaturedCard key={s._id}>
                <SponsorLogo logoUrl={s.logoUrl} businessName={s.businessName} size="72px" />
                <SponsorInfo>
                  <SponsorName>{s.businessName || 'Anonymous Sponsor'}</SponsorName>
                  {s.tagline && <SponsorTagline>{s.tagline}</SponsorTagline>}
                  {s.websiteUrl && (
                    <SponsorLink href={s.websiteUrl} target="_blank" rel="noopener noreferrer">
                      Visit Website <ExternalLink size={12} />
                    </SponsorLink>
                  )}
                  <TierBadge><Award size={10} /> {s.tierName}</TierBadge>
                </SponsorInfo>
              </FeaturedCard>
            ))}
          </FeaturedGrid>
        </TierSection>
      )}

      {mid.length > 0 && (
        <TierSection>
          <TierHeading>Gold & Platinum Sponsors</TierHeading>
          <FeaturedGrid>
            {mid.map((s) => (
              <FeaturedCard key={s._id}>
                <SponsorLogo logoUrl={s.logoUrl} businessName={s.businessName} size="56px" />
                <SponsorInfo>
                  <SponsorName>{s.businessName || 'Anonymous Sponsor'}</SponsorName>
                  {s.tagline && <SponsorTagline>{s.tagline}</SponsorTagline>}
                  {s.websiteUrl && (
                    <SponsorLink href={s.websiteUrl} target="_blank" rel="noopener noreferrer">
                      Visit Website <ExternalLink size={12} />
                    </SponsorLink>
                  )}
                </SponsorInfo>
              </FeaturedCard>
            ))}
          </FeaturedGrid>
        </TierSection>
      )}

      {lower.length > 0 && (
        <TierSection>
          <TierHeading>Community Sponsors</TierHeading>
          <CompactGrid>
            {lower.map((s) => (
              <CompactCard key={s._id}>
                <SponsorLogo logoUrl={s.logoUrl} businessName={s.businessName} size="40px" />
                <CompactName>{s.businessName || s.tierName}</CompactName>
              </CompactCard>
            ))}
          </CompactGrid>
        </TierSection>
      )}
    </WallContainer>
  )
}
