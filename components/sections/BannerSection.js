'use client';

import styled from 'styled-components';
import { motion } from 'framer-motion';

const BannerWrapper = styled.section`
  position: relative;
  padding: 0;
  overflow: hidden;
  background: #FDFCFF;

  @media (min-width: 768px) {
    padding: 40px 0;
  }
`;

const BannerContainer = styled.div`
  max-width: 100%;
  margin: 0 auto;
  position: relative;
`;

const BannerImage = styled(motion.img)`
  width: 100%;
  height: auto;
  display: block;
  max-height: 500px;
  object-fit: cover;

  @media (min-width: 768px) {
    border-radius: 16px;
    margin: 0 16px;
    max-height: 600px;
  }
`;

const BannerOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(
    135deg,
    rgba(26, 42, 94, 0.15) 0%,
    rgba(245, 197, 24, 0.1) 50%,
    rgba(41, 171, 226, 0.1) 100%
  );
  pointer-events: none;
  border-radius: 16px;
  margin: 0 16px;

  @media (max-width: 768px) {
    display: none;
  }
`;

export default function BannerSection() {
  return (
    <BannerWrapper>
      <BannerContainer>
        <BannerImage
          src="/IMG-20260602-WA0000.jpg"
          alt="HonestNeed Community Banner"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        />
        <BannerOverlay />
      </BannerContainer>
    </BannerWrapper>
  );
}
