'use client'

import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import styled, { keyframes } from 'styled-components'
import { COLORS, SPACING, BORDER_RADIUS, TYPOGRAPHY, SHADOWS, TRANSITIONS } from '@/styles/tokens'
import apiClient from '@/lib/api'
import { PartyPopper, ExternalLink, Home, Users } from 'lucide-react'

const float = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
`

const PageWrapper = styled.div`
  min-height: 100vh;
  background: linear-gradient(180deg, ${COLORS.PRIMARY_BG} 0%, ${COLORS.BG} 40%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${SPACING[6]} ${SPACING[4]};
`

const Card = styled.div`
  max-width: 560px;
  width: 100%;
  background: ${COLORS.SURFACE};
  border: 1px solid ${COLORS.BORDER};
  border-radius: ${BORDER_RADIUS.XL};
  padding: ${SPACING[10]} ${SPACING[8]};
  box-shadow: ${SHADOWS.LG};
  text-align: center;
`

const IconWrapper = styled.div`
  font-size: 4rem;
  animation: ${float} 3s ease-in-out infinite;
  margin-bottom: ${SPACING[4]};
`

const Title = styled.h1`
  font-size: ${TYPOGRAPHY.SIZE_2XL};
  font-weight: ${TYPOGRAPHY.WEIGHT_BOLD};
  color: ${COLORS.TEXT};
  margin: 0 0 ${SPACING[2]} 0;
`

const Subtitle = styled.p`
  font-size: ${TYPOGRAPHY.SIZE_BASE};
  color: ${COLORS.MUTED_TEXT};
  margin: 0 0 ${SPACING[6]} 0;
  line-height: ${TYPOGRAPHY.LINE_HEIGHT_RELAXED};
`

const InfoBox = styled.div`
  background: ${COLORS.SUCCESS_BG};
  border: 1px solid ${COLORS.SUCCESS_LIGHT};
  border-radius: ${BORDER_RADIUS.LG};
  padding: ${SPACING[4]};
  margin-bottom: ${SPACING[6]};
  text-align: left;
`

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: ${TYPOGRAPHY.SIZE_SM};
  color: ${COLORS.TEXT};
  padding: ${SPACING[1]} 0;

  span:first-child { color: ${COLORS.MUTED_TEXT}; }
  span:last-child { font-weight: ${TYPOGRAPHY.WEIGHT_SEMIBOLD}; }
`

const ButtonGroup = styled.div`
  display: flex;
  gap: ${SPACING[3]};
  flex-wrap: wrap;
  justify-content: center;
`

const LinkButton = styled.a`
  display: inline-flex;
  align-items: center;
  gap: ${SPACING[2]};
  padding: ${SPACING[3]} ${SPACING[5]};
  border-radius: ${BORDER_RADIUS.MD};
  font-weight: ${TYPOGRAPHY.WEIGHT_SEMIBOLD};
  font-size: ${TYPOGRAPHY.SIZE_SM};
  text-decoration: none;
  transition: all ${TRANSITIONS.BASE};
  cursor: pointer;

  ${(p) =>
    p.$primary
      ? `
    background: ${COLORS.PRIMARY};
    color: white;
    &:hover { background: ${COLORS.PRIMARY_DARK}; box-shadow: ${SHADOWS.MD}; color: white; }
  `
      : `
    background: ${COLORS.BG};
    color: ${COLORS.TEXT};
    border: 1px solid ${COLORS.BORDER};
    &:hover { background: ${COLORS.DISABLED}; border-color: ${COLORS.PRIMARY_LIGHT}; }
  `}
`

export default function SuccessPage() {
  const params = useParams()
  const sponsorshipId = params?.sponsorshipId
  const [sponsorship, setSponsorship] = useState(null)

  useEffect(() => {
    if (sponsorshipId) {
      apiClient
        .get(`/sponsorships/${sponsorshipId}`)
        .then((res) => {
          if (res.data?.success) setSponsorship(res.data.data)
        })
        .catch(() => {})
    }
  }, [sponsorshipId])

  return (
    <PageWrapper>
      <Card>
        <IconWrapper>🎉</IconWrapper>
        <Title>Welcome Aboard, Founding Sponsor!</Title>
        <Subtitle>
          Your sponsorship is now <strong>live</strong>. Thank you for believing in community and
          supporting Honest Need. Together we win!
        </Subtitle>

        {sponsorship && (
          <InfoBox>
            <InfoRow>
              <span>Tier</span>
              <span>{sponsorship.tierName}</span>
            </InfoRow>
            <InfoRow>
              <span>Amount</span>
              <span>${sponsorship.grossAmount?.toLocaleString()}</span>
            </InfoRow>
            <InfoRow>
              <span>Status</span>
              <span style={{ color: COLORS.SUCCESS }}>✓ Active</span>
            </InfoRow>
            {sponsorship.businessName && (
              <InfoRow>
                <span>Business</span>
                <span>{sponsorship.businessName}</span>
              </InfoRow>
            )}
          </InfoBox>
        )}

        <ButtonGroup>
          <LinkButton href="/sponsor-wall" $primary>
            <Users size={16} /> View Sponsor Wall
          </LinkButton>
          <LinkButton href="/">
            <Home size={16} /> Back to Home
          </LinkButton>
        </ButtonGroup>
      </Card>
    </PageWrapper>
  )
}
