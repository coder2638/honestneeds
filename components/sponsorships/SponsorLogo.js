'use client'

import React, { useState } from 'react'
import styled from 'styled-components'
import { COLORS, SPACING, BORDER_RADIUS, TYPOGRAPHY, SHADOWS, TRANSITIONS } from '@/styles/tokens'

const LogoWrapper = styled.div`
  width: ${(props) => props.$size || '64px'};
  height: ${(props) => props.$size || '64px'};
  border-radius: ${BORDER_RADIUS.LG};
  overflow: hidden;
  border: 2px solid ${COLORS.BORDER};
  background: ${COLORS.BG};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all ${TRANSITIONS.BASE};

  &:hover {
    box-shadow: ${SHADOWS.SM};
    border-color: ${COLORS.PRIMARY_LIGHT};
  }
`

const LogoImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`

const FallbackInitial = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, ${COLORS.PRIMARY} 0%, ${COLORS.PRIMARY_DARK} 100%);
  color: ${COLORS.SURFACE};
  font-size: ${(props) => props.$fontSize || TYPOGRAPHY.SIZE_XL};
  font-weight: ${TYPOGRAPHY.WEIGHT_BOLD};
  text-transform: uppercase;
`

export default function SponsorLogo({ logoUrl, businessName, size = '64px' }) {
  const [hasError, setHasError] = useState(false)

  const initial = (businessName || '?').charAt(0)

  if (!logoUrl || hasError) {
    return (
      <LogoWrapper $size={size}>
        <FallbackInitial $fontSize={parseInt(size) > 64 ? TYPOGRAPHY.SIZE_2XL : TYPOGRAPHY.SIZE_LG}>
          {initial}
        </FallbackInitial>
      </LogoWrapper>
    )
  }

  return (
    <LogoWrapper $size={size}>
      <LogoImage
        src={logoUrl}
        alt={`${businessName || 'Sponsor'} logo`}
        onError={() => setHasError(true)}
      />
    </LogoWrapper>
  )
}
