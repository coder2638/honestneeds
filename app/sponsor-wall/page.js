'use client'

import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { COLORS, SPACING, BORDER_RADIUS, TYPOGRAPHY, SHADOWS, MEDIA_QUERIES } from '@/styles/tokens'
import SponsorWallGrid from '@/components/sponsorships/SponsorWallGrid'
import apiClient from '@/lib/api'
import { Heart } from 'lucide-react'

const PageWrapper = styled.div`
  min-height: 100vh;
  background: ${COLORS.BG};
`

const Hero = styled.section`
  background: linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4338ca 100%);
  padding: ${SPACING[12]} ${SPACING[4]};
  text-align: center;
  position: relative;
  &::after {
    content: '';
    position: absolute;
    bottom: 0; left: 0; right: 0;
    height: 60px;
    background: linear-gradient(transparent, ${COLORS.BG});
  }
`

const HeroTitle = styled.h1`
  font-size: ${TYPOGRAPHY.SIZE_3XL};
  font-weight: ${TYPOGRAPHY.WEIGHT_EXTRABOLD};
  color: white;
  margin: 0 0 ${SPACING[3]} 0;
  ${MEDIA_QUERIES.DOWN_SM} { font-size: ${TYPOGRAPHY.SIZE_2XL}; }
`

const HeroSub = styled.p`
  font-size: ${TYPOGRAPHY.SIZE_LG};
  color: rgba(255, 255, 255, 0.75);
  max-width: 550px;
  margin: 0 auto;
  line-height: ${TYPOGRAPHY.LINE_HEIGHT_RELAXED};
`

const Content = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  padding: ${SPACING[8]} ${SPACING[4]} ${SPACING[12]};
`

const LoadingWrapper = styled.div`
  text-align: center;
  padding: ${SPACING[12]};
  color: ${COLORS.MUTED_TEXT};
`

export default function SponsorWallPage() {
  const [sponsors, setSponsors] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    apiClient
      .get('/sponsorships/public')
      .then((res) => {
        if (res.data?.success) setSponsors(res.data.data || [])
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <PageWrapper>
      <Hero>
        <HeroTitle>Our Founding Sponsors</HeroTitle>
        <HeroSub>
          These businesses and individuals believe in community, transparency, and mutual support.
        </HeroSub>
      </Hero>

      <Content>
        {loading ? (
          <LoadingWrapper>Loading sponsors...</LoadingWrapper>
        ) : (
          <SponsorWallGrid sponsors={sponsors} />
        )}
      </Content>
    </PageWrapper>
  )
}
