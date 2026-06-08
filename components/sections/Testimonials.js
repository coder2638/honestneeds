'use client';

import styled, { keyframes, css } from 'styled-components';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { useRef, useState, useEffect, useCallback } from 'react';
import { FiStar, FiCheckCircle, FiMapPin, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import Container, { Section } from '../ui/Container';
import Avatar from '../ui/Avatar';

// ─── Keyframes ────────────────────────────────────────────────────────────────

const floatUp = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-14px); }
`;

const glowPulse = keyframes`
  0%, 100% { opacity: 0.5; transform: scale(1); }
  50% { opacity: 0.9; transform: scale(1.08); }
`;

const fadeSlideIn = keyframes`
  from { opacity: 0; transform: translateY(32px); }
  to { opacity: 1; transform: translateY(0); }
`;

const dotExpand = keyframes`
  0% { transform: scaleX(1); }
  50% { transform: scaleX(2.2); }
  100% { transform: scaleX(1); }
`;

// ─── Section Wrapper ──────────────────────────────────────────────────────────

const TestimonialsSection = styled.section`
  position: relative;
  padding: 96px 0 104px;
  overflow: hidden;
  background: #F8FAFF;

  /* Multi-tone radial wash */
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background:
      radial-gradient(ellipse 65% 45% at 0% 30%, rgba(253, 224, 71, 0.1) 0%, transparent 60%),
      radial-gradient(ellipse 55% 45% at 100% 20%, rgba(56, 189, 248, 0.09) 0%, transparent 55%),
      radial-gradient(ellipse 50% 50% at 50% 100%, rgba(244, 63, 94, 0.07) 0%, transparent 55%),
      radial-gradient(ellipse 40% 30% at 80% 70%, rgba(34, 197, 94, 0.06) 0%, transparent 50%);
    pointer-events: none;
    z-index: 0;
  }

  /* Dot texture */
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background-image: radial-gradient(circle, rgba(15, 23, 42, 0.05) 1px, transparent 1px);
    background-size: 28px 28px;
    pointer-events: none;
    z-index: 0;
    mask-image: radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 100%);
  }
`;

const InnerContainer = styled(Container)`
  position: relative;
  z-index: 1;
`;

// ─── Floating Blobs ───────────────────────────────────────────────────────────

const Blob = styled.div`
  position: absolute;
  border-radius: 50%;
  filter: blur(70px);
  pointer-events: none;
  z-index: 0;
`;

const BlobYellow = styled(Blob)`
  width: 280px; height: 280px;
  background: rgba(253, 224, 71, 0.2);
  top: -60px; left: -80px;
  animation: ${glowPulse} 7s ease-in-out infinite;
`;

const BlobBlue = styled(Blob)`
  width: 220px; height: 220px;
  background: rgba(56, 189, 248, 0.16);
  top: 30px; right: -60px;
  animation: ${glowPulse} 9s ease-in-out infinite 3s;
`;

const BlobGreen = styled(Blob)`
  width: 180px; height: 180px;
  background: rgba(34, 197, 94, 0.13);
  bottom: 80px; left: 20%;
  animation: ${glowPulse} 11s ease-in-out infinite 5s;
`;

// ─── Section Header ───────────────────────────────────────────────────────────

const SectionHeader = styled.div`
  text-align: center;
  margin-bottom: 64px;
`;

const Eyebrow = styled(motion.div)`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 5px 16px;
  background: rgba(99, 102, 241, 0.08);
  border: 1.5px solid rgba(99, 102, 241, 0.2);
  border-radius: 999px;
  font-size: 12.5px;
  font-weight: 700;
  color: #6366F1;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  margin-bottom: 20px;
`;

const SectionTitle = styled(motion.h2)`
  font-family: 'Nunito', 'Poppins', sans-serif;
  font-size: clamp(28px, 4vw, 44px);
  font-weight: 800;
  color: #0F172A;
  letter-spacing: -0.02em;
  line-height: 1.1;
  margin-bottom: 16px;

  .accent {
    background: linear-gradient(135deg, #F59E0B 0%, #EF4444 50%, #EC4899 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
`;

const SectionSubtitle = styled(motion.p)`
  font-size: 17px;
  color: #64748B;
  max-width: 480px;
  margin: 0 auto;
  line-height: 1.6;
  font-weight: 500;
`;

// ─── Desktop Grid ─────────────────────────────────────────────────────────────

const DesktopGrid = styled.div`
  display: none;

  @media (min-width: 1024px) {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
    margin-bottom: 64px;
  }
`;

// ─── Card ─────────────────────────────────────────────────────────────────────

const CardWrapper = styled(motion.div)`
  position: relative;
  border-radius: 24px;
  padding: 32px 28px 28px;
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(12px);
  border: 1.5px solid rgba(255, 255, 255, 0.8);
  box-shadow:
    0 4px 24px rgba(15, 23, 42, 0.07),
    0 1px 3px rgba(15, 23, 42, 0.05);
  transition: box-shadow 0.3s ease, transform 0.3s ease;
  cursor: default;

  &:hover {
    box-shadow:
      0 16px 48px rgba(15, 23, 42, 0.12),
      0 4px 12px rgba(15, 23, 42, 0.06);
    transform: translateY(-4px);
  }

  /* Subtle top accent gradient line */
  &::before {
    content: '';
    position: absolute;
    top: 0; left: 24px; right: 24px;
    height: 2px;
    background: ${({ $accentColor }) => $accentColor || 'linear-gradient(90deg, #F59E0B, #EF4444)'};
    border-radius: 0 0 2px 2px;
    opacity: 0.7;
  }
`;

const BigQuote = styled.div`
  font-family: Georgia, serif;
  font-size: 72px;
  line-height: 0.6;
  font-weight: 900;
  color: ${({ $color }) => $color || '#F59E0B'};
  opacity: 0.18;
  margin-bottom: -8px;
  user-select: none;
  letter-spacing: -4px;
`;

const QuoteText = styled.p`
  font-size: 15.5px;
  color: #334155;
  line-height: 1.75;
  font-style: italic;
  margin-bottom: 24px;
  font-weight: 500;
`;

const CardFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`;

const AuthorBlock = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const AuthorInitial = styled.div`
  width: 42px;
  height: 42px;
  border-radius: 50%;
  background: ${({ $bg }) => $bg || 'linear-gradient(135deg, #F59E0B, #EF4444)'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: 800;
  color: white;
  flex-shrink: 0;
`;

const AuthorMeta = styled.div`
  .name {
    font-size: 14px;
    font-weight: 700;
    color: #0F172A;
    margin-bottom: 2px;
  }
`;

const LocationBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  font-weight: 600;
  color: #94A3B8;

  svg { width: 11px; height: 11px; }
`;

const StarRow = styled.div`
  display: flex;
  gap: 2px;

  svg {
    width: 13px;
    height: 13px;
    color: #F59E0B;
  }
`;

const VerifiedBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 11.5px;
  font-weight: 700;
  color: #22C55E;
  background: rgba(34, 197, 94, 0.08);
  border: 1px solid rgba(34, 197, 94, 0.2);
  padding: 4px 10px;
  border-radius: 999px;
  white-space: nowrap;

  svg { width: 12px; height: 12px; }
`;

// ─── Mobile Carousel ──────────────────────────────────────────────────────────

const MobileCarousel = styled.div`
  display: block;
  margin-bottom: 56px;
  overflow: hidden;
  position: relative;

  @media (min-width: 1024px) {
    display: none;
  }
`;

const CarouselTrack = styled(motion.div)`
  display: flex;
  gap: 16px;
  cursor: grab;
  user-select: none;

  &:active {
    cursor: grabbing;
  }
`;

const CarouselSlide = styled.div`
  min-width: calc(100vw - 64px);
  max-width: 360px;
  flex-shrink: 0;

  @media (min-width: 640px) {
    min-width: 420px;
  }
`;

const DotsRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  margin-top: 20px;
`;

const Dot = styled.button`
  height: 7px;
  border-radius: 999px;
  border: none;
  cursor: pointer;
  transition: all 0.35s cubic-bezier(0.2, 0.9, 0.2, 1);
  padding: 0;
  background: ${({ $active }) => $active ? 'linear-gradient(90deg, #F59E0B, #EF4444)' : '#CBD5E1'};
  width: ${({ $active }) => $active ? '28px' : '7px'};
  opacity: ${({ $active }) => $active ? 1 : 0.5};
`;

// ─── Impact Stats ─────────────────────────────────────────────────────────────

const ImpactStrip = styled(motion.div)`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0;
  flex-wrap: wrap;
  background: white;
  border-radius: 20px;
  border: 1.5px solid #E2E8F0;
  box-shadow: 0 4px 20px rgba(15, 23, 42, 0.06);
  padding: 0;
  overflow: hidden;
  margin-bottom: 64px;
`;

const ImpactStat = styled.div`
  flex: 1;
  min-width: 140px;
  padding: 28px 24px;
  text-align: center;
  position: relative;

  &:not(:last-child)::after {
    content: '';
    position: absolute;
    right: 0; top: 20%; bottom: 20%;
    width: 1px;
    background: #E2E8F0;
  }

  .value {
    font-family: 'Nunito', sans-serif;
    font-size: 26px;
    font-weight: 800;
    color: #0F172A;
    letter-spacing: -0.03em;
    display: block;
    margin-bottom: 4px;
  }

  .label {
    font-size: 12px;
    font-weight: 600;
    color: #94A3B8;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .icon {
    font-size: 20px;
    display: block;
    margin-bottom: 8px;
  }
`;

// ─── Video Section ────────────────────────────────────────────────────────────

const VideoWrapper = styled(motion.div)`
  position: relative;
  max-width: 760px;
  margin: 0 auto;
`;

const VideoGlowRing = styled.div`
  position: absolute;
  inset: -16px;
  border-radius: 32px;
  background: linear-gradient(135deg, rgba(245, 158, 11, 0.3), rgba(239, 68, 68, 0.25), rgba(99, 102, 241, 0.2));
  filter: blur(24px);
  z-index: 0;
`;

const VideoCard = styled.div`
  position: relative;
  z-index: 1;
  border-radius: 24px;
  overflow: hidden;
  box-shadow:
    0 20px 64px rgba(15, 23, 42, 0.2),
    0 4px 16px rgba(15, 23, 42, 0.1);
  border: 1.5px solid rgba(255,255,255,0.3);
  background: #000;
`;

const VideoInner = styled.div`
  position: relative;
  padding-top: 56.25%;
`;

const StyledVideo = styled.video`
  position: absolute;
  top: 0; left: 0;
  width: 100%; height: 100%;
  object-fit: cover;
`;

const VideoCaption = styled.p`
  text-align: center;
  margin-top: 20px;
  font-size: 14px;
  color: #94A3B8;
  font-style: italic;
  font-weight: 500;
  letter-spacing: 0.01em;
`;

// ─── Data ─────────────────────────────────────────────────────────────────────

const testimonials = [
  {
    text: "HonestNeed helped us pay rent for two weeks — strangers showed up when we needed them most. The community support was overwhelming.",
    name: "Sarah M.",
    location: "Modesto, CA",
    initial: "S",
    accentGradient: 'linear-gradient(90deg, #F59E0B, #EF4444)',
    avatarBg: 'linear-gradient(135deg, #F59E0B, #EF4444)',
    quoteColor: '#F59E0B',
  },
  {
    text: "I raised $800 for school supplies in 48 hours. The share rewards feature made my students' project possible. Incredible platform!",
    name: "Tariq S.",
    location: "Sacramento, CA",
    initial: "T",
    accentGradient: 'linear-gradient(90deg, #6366F1, #38BDF8)',
    avatarBg: 'linear-gradient(135deg, #6366F1, #38BDF8)',
    quoteColor: '#6366F1',
  },
  {
    text: "We found volunteers to renovate a shelter — the locality filters are brilliant. Connecting with local people made all the difference.",
    name: "Mike R.",
    location: "Fresno, CA",
    initial: "M",
    accentGradient: 'linear-gradient(90deg, #22C55E, #06B6D4)',
    avatarBg: 'linear-gradient(135deg, #22C55E, #06B6D4)',
    quoteColor: '#22C55E',
  },
];

const impactStats = [
  { icon: '🏘️', value: '1,200+', label: 'Campaigns Created' },
  { icon: '🤝', value: '8,400+', label: 'Supporters' },
  { icon: '💸', value: '$120K+', label: 'Funds Moved Directly' },
  { icon: '⭐', value: '4.9 / 5', label: 'Avg. Rating' },
];

// ─── Testimonial Card (reusable) ──────────────────────────────────────────────

function TestimonialCard({ t, variants }) {
  return (
    <CardWrapper
      variants={variants}
      $accentColor={t.accentGradient}
      whileHover={{ y: -4 }}
    >
      <BigQuote $color={t.quoteColor}>&ldquo;&ldquo;</BigQuote>
      <QuoteText>&ldquo;{t.text}&rdquo;</QuoteText>
      <CardFooter>
        <AuthorBlock>
          <AuthorInitial $bg={t.avatarBg}>{t.initial}</AuthorInitial>
          <AuthorMeta>
            <div className="name">{t.name}</div>
            <LocationBadge>
              <FiMapPin />
              {t.location}
            </LocationBadge>
            <StarRow style={{ marginTop: 4 }}>
              {[...Array(5)].map((_, i) => (
                <FiStar key={i} fill="currentColor" />
              ))}
            </StarRow>
          </AuthorMeta>
        </AuthorBlock>
        <VerifiedBadge>
          <FiCheckCircle />
          Verified
        </VerifiedBadge>
      </CardFooter>
    </CardWrapper>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.2, 0.9, 0.2, 1] },
  },
};

export default function Testimonials() {
  // Carousel state
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const trackRef = useRef(null);
  const autoPlayRef = useRef(null);
  const slideCount = testimonials.length;

  const SLIDE_WIDTH = 320; // approximate; real width computed on mount
  const GAP = 16;

  const goTo = useCallback((idx) => {
    const clamped = ((idx % slideCount) + slideCount) % slideCount;
    setActiveIndex(clamped);
  }, [slideCount]);

  // Auto-play
  const resetAutoPlay = useCallback(() => {
    clearInterval(autoPlayRef.current);
    autoPlayRef.current = setInterval(() => {
      setActiveIndex(prev => (prev + 1) % slideCount);
    }, 4000);
  }, [slideCount]);

  useEffect(() => {
    resetAutoPlay();
    return () => clearInterval(autoPlayRef.current);
  }, [resetAutoPlay]);

  // Compute x offset for active index
  const getOffset = (idx) => {
    if (!trackRef.current) return 0;
    const slides = trackRef.current.querySelectorAll('[data-slide]');
    if (!slides[idx]) return 0;
    const trackRect = trackRef.current.getBoundingClientRect();
    const slideRect = slides[idx].getBoundingClientRect();
    const containerPad = 32;
    return -(slideRect.left - trackRect.left - containerPad);
  };

  return (
    <TestimonialsSection>
      <BlobYellow />
      <BlobBlue />
      <BlobGreen />

      <InnerContainer>
        {/* ── Header ─────────────────────────────────────────────────── */}
        <SectionHeader>
          <Eyebrow
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            💬 Real Stories
          </Eyebrow>
          <SectionTitle
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: 0.08 }}
          >
            <span className="accent">Success Stories</span>
          </SectionTitle>
          <SectionSubtitle
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.16 }}
          >
            Real people, real impact. See how HonestNeed is changing lives one community at a time.
          </SectionSubtitle>
        </SectionHeader>

        {/* ── Impact Stats Strip ─────────────────────────────────────── */}
        <ImpactStrip
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, delay: 0.1 }}
        >
          {impactStats.map((s, i) => (
            <ImpactStat key={i}>
              <span className="icon">{s.icon}</span>
              <span className="value">{s.value}</span>
              <span className="label">{s.label}</span>
            </ImpactStat>
          ))}
        </ImpactStrip>

        {/* ── Desktop Grid ───────────────────────────────────────────── */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
        >
          <DesktopGrid>
            {testimonials.map((t, i) => (
              <TestimonialCard key={i} t={t} variants={itemVariants} />
            ))}
          </DesktopGrid>
        </motion.div>

        {/* ── Mobile Carousel ────────────────────────────────────────── */}
        <MobileCarousel>
          <motion.div
            ref={trackRef}
            style={{
              display: 'flex',
              gap: `${GAP}px`,
              paddingLeft: 32,
              paddingRight: 32,
            }}
            animate={{ x: activeIndex === 0 ? 0 : -(activeIndex * (SLIDE_WIDTH + GAP)) }}
            transition={{ type: 'spring', stiffness: 260, damping: 30 }}
            drag="x"
            dragConstraints={{ left: -((slideCount - 1) * (SLIDE_WIDTH + GAP)), right: 0 }}
            onDragStart={() => {
              setIsDragging(true);
              clearInterval(autoPlayRef.current);
            }}
            onDragEnd={(e, info) => {
              setIsDragging(false);
              if (info.offset.x < -60) goTo(activeIndex + 1);
              else if (info.offset.x > 60) goTo(activeIndex - 1);
              resetAutoPlay();
            }}
          >
            {testimonials.map((t, i) => (
              <div
                key={i}
                data-slide
                style={{
                  minWidth: `${SLIDE_WIDTH}px`,
                  maxWidth: `${SLIDE_WIDTH}px`,
                  flexShrink: 0,
                }}
              >
                <TestimonialCard t={t} variants={{}} />
              </div>
            ))}
          </motion.div>

          <DotsRow>
            {testimonials.map((_, i) => (
              <Dot
                key={i}
                $active={i === activeIndex}
                onClick={() => { goTo(i); resetAutoPlay(); }}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </DotsRow>
        </MobileCarousel>

        {/* ── Video Section ──────────────────────────────────────────── */}
        <VideoWrapper
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6 }}
        >
          <VideoGlowRing />
          <VideoCard>
            <VideoInner>
              <StyledVideo
                src="https://res.cloudinary.com/dctvil2gu/video/upload/v1779616053/modified-video_lotu6r.mp4"
                controls
                playsInline
              >
                Your browser does not support the video tag.
              </StyledVideo>
            </VideoInner>
          </VideoCard>
          <VideoCaption>
            Real communities. Real impact. Real kindness — powered by HonestNeed.
          </VideoCaption>
        </VideoWrapper>
      </InnerContainer>
    </TestimonialsSection>
  );
}