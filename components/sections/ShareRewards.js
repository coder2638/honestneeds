'use client';

import { useState } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { motion } from 'framer-motion';

// ─── Brand Colors (derived from HonestNeed logo) ───────────────────────────
// Primary yellow-gold: #F5C518 / #FFD700
// Sky blue (Need):     #29ABE2 / #3BB5E8
// Warm red outline:    #CC2222
// Lush green banner:   #2E8B2E
// Hot pink accent:     #E83E8C
// Deep navy:           #1A1A3E
// Sunshine orange:     #FF8C00

// ─── Keyframes ─────────────────────────────────────────────────────────────
const floatY = keyframes`
  0%, 100% { transform: translateY(0px) rotate(-2deg); }
  50%       { transform: translateY(-8px) rotate(2deg); }
`;

const shimmer = keyframes`
  0%   { background-position: -200% center; }
  100% { background-position:  200% center; }
`;

const pulse = keyframes`
  0%, 100% { box-shadow: 0 0 0 0 rgba(245, 197, 24, 0.4); }
  50%       { box-shadow: 0 0 0 12px rgba(245, 197, 24, 0); }
`;

const rotateStar = keyframes`
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
`;

const connectorFlow = keyframes`
  0%   { stroke-dashoffset: 100; }
  100% { stroke-dashoffset: 0; }
`;

// ─── Section Wrapper ────────────────────────────────────────────────────────
const Section = styled.section`
  position: relative;
  padding: 80px 16px 96px;
  background: linear-gradient(160deg, #0d1b3e 0%, #1a2a5e 40%, #0d2244 100%);
  overflow: hidden;
  font-family: 'Nunito', 'Poppins', system-ui, sans-serif;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse 80% 60% at 50% -10%, rgba(41, 171, 226, 0.18) 0%, transparent 70%),
                radial-gradient(ellipse 60% 40% at 90% 90%, rgba(245, 197, 24, 0.12) 0%, transparent 60%);
    pointer-events: none;
  }
`;

const Decoration = styled.div`
  position: absolute;
  pointer-events: none;
  user-select: none;
  font-size: ${({ size }) => size || '28px'};
  opacity: 0.18;
  top: ${({ top }) => top};
  left: ${({ left }) => left};
  right: ${({ right }) => right};
  bottom: ${({ bottom }) => bottom};
  animation: ${floatY} ${({ dur }) => dur || '4s'} ease-in-out infinite;
  animation-delay: ${({ delay }) => delay || '0s'};
`;

const Container = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
`;

// ─── Header ─────────────────────────────────────────────────────────────────
const Header = styled.div`
  text-align: center;
  margin-bottom: 56px;
`;

const BadgePill = styled(motion.div)`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(245, 197, 24, 0.15);
  border: 1px solid rgba(245, 197, 24, 0.4);
  border-radius: 9999px;
  padding: 6px 18px;
  margin-bottom: 20px;
  font-size: 13px;
  font-weight: 700;
  color: #F5C518;
  letter-spacing: 0.08em;
  text-transform: uppercase;
`;

const BadgeDot = styled.span`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #F5C518;
  animation: ${pulse} 2s ease-in-out infinite;
  display: inline-block;
`;

const SectionTitle = styled(motion.h2)`
  font-family: 'Nunito', 'Poppins', sans-serif;
  font-size: clamp(30px, 5vw, 52px);
  font-weight: 900;
  line-height: 1.1;
  color: #ffffff;
  margin-bottom: 16px;
  letter-spacing: -0.02em;

  span.yellow {
    background: linear-gradient(90deg, #F5C518, #FFD700, #F5C518);
    background-size: 200% auto;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: ${shimmer} 3s linear infinite;
  }

  span.blue {
    color: #29ABE2;
    -webkit-text-fill-color: #29ABE2;
  }
`;

const SectionSubtitle = styled(motion.p)`
  font-size: 16px;
  color: rgba(255, 255, 255, 0.6);
  max-width: 520px;
  margin: 0 auto;
  line-height: 1.7;
`;

// ─── Calculator Card ─────────────────────────────────────────────────────────
const CalcCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 24px;
  padding: 32px 36px;
  max-width: 620px;
  margin: 0 auto 64px;
  box-shadow: 0 24px 64px rgba(0, 0, 0, 0.35);

  @media (max-width: 480px) {
    padding: 24px 20px;
  }
`;

const CalcHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 28px;
`;

const CalcIcon = styled.div`
  width: 44px;
  height: 44px;
  border-radius: 14px;
  background: linear-gradient(135deg, #F5C518, #FF8C00);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  flex-shrink: 0;
`;

const CalcTitle = styled.h3`
  font-size: 20px;
  font-weight: 800;
  color: #ffffff;
  margin: 0;
`;

const CalcSubLabel = styled.span`
  font-size: 12px;
  color: rgba(255, 255, 255, 0.45);
  display: block;
  font-weight: 500;
`;

const SliderLabel = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 10px;
`;

const SliderText = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.65);
`;

const SliderValue = styled.span`
  font-size: 28px;
  font-weight: 900;
  color: #F5C518;
  font-family: 'Nunito', sans-serif;
`;

const StyledSlider = styled.input`
  width: 100%;
  height: 6px;
  border-radius: 9999px;
  background: linear-gradient(
    to right,
    #F5C518 0%,
    #F5C518 ${({ pct }) => pct}%,
    rgba(255,255,255,0.12) ${({ pct }) => pct}%,
    rgba(255,255,255,0.12) 100%
  );
  outline: none;
  -webkit-appearance: none;
  cursor: pointer;
  margin-bottom: 28px;
  transition: background 0.1s;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 22px;
    height: 22px;
    border-radius: 50%;
    background: #F5C518;
    box-shadow: 0 0 0 4px rgba(245, 197, 24, 0.25), 0 4px 12px rgba(0,0,0,0.3);
    cursor: pointer;
    transition: transform 0.15s;
    &:hover { transform: scale(1.15); }
  }

  &::-moz-range-thumb {
    width: 22px;
    height: 22px;
    border-radius: 50%;
    background: #F5C518;
    border: none;
    box-shadow: 0 0 0 4px rgba(245, 197, 24, 0.25);
    cursor: pointer;
  }
`;

const ResultGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 20px;

  @media (max-width: 400px) {
    grid-template-columns: 1fr;
  }
`;

const ResultTile = styled.div`
  background: ${({ accent }) => accent
    ? 'linear-gradient(135deg, rgba(245,197,24,0.15), rgba(255,140,0,0.1))'
    : 'rgba(255,255,255,0.06)'};
  border: 1px solid ${({ accent }) => accent ? 'rgba(245,197,24,0.3)' : 'rgba(255,255,255,0.08)'};
  border-radius: 14px;
  padding: 16px 18px;
`;

const TileLabel = styled.div`
  font-size: 11px;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.45);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin-bottom: 6px;
`;

const TileValue = styled.div`
  font-size: ${({ large }) => large ? '22px' : '18px'};
  font-weight: 900;
  color: ${({ accent }) => accent ? '#F5C518' : '#ffffff'};
`;

const InfoBanner = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  background: rgba(41, 171, 226, 0.1);
  border: 1px solid rgba(41, 171, 226, 0.25);
  border-radius: 12px;
  padding: 12px 16px;
`;

const InfoIcon = styled.span`
  font-size: 16px;
  flex-shrink: 0;
  margin-top: 1px;
`;

const InfoText = styled.p`
  font-size: 13px;
  color: rgba(255,255,255,0.6);
  margin: 0;
  line-height: 1.55;
`;

// ─── Steps Flow ──────────────────────────────────────────────────────────────
const StepsLabel = styled(motion.div)`
  text-align: center;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: rgba(255,255,255,0.35);
  margin-bottom: 28px;
`;

/* CRITICAL: always horizontal — even on mobile (320px+) */
const StepsRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: center;
  gap: 0;
  position: relative;
  width: 100%;
`;

const StepWrapper = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  padding: 0 4px;
`;

/* Connector line between steps */
const ConnectorLine = styled.div`
  flex: 0 0 auto;
  width: clamp(16px, 4vw, 40px);
  height: 2px;
  background: linear-gradient(90deg, rgba(245,197,24,0.5), rgba(41,171,226,0.5));
  margin-top: 40px; /* align with center of icon */
  flex-shrink: 0;
  position: relative;

  &::after {
    content: '›';
    position: absolute;
    right: -6px;
    top: 50%;
    transform: translateY(-50%);
    color: #29ABE2;
    font-size: 14px;
    line-height: 1;
  }
`;

const StepCard = styled(motion.div)`
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.10);
  border-radius: 20px;
  padding: clamp(12px, 3vw, 24px) clamp(8px, 2vw, 18px);
  text-align: center;
  width: 100%;
  cursor: default;
  transition: border-color 0.25s, background 0.25s;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: ${({ gradient }) => gradient};
    opacity: 0;
    transition: opacity 0.3s;
    border-radius: inherit;
  }

  &:hover::before { opacity: 1; }
  &:hover { border-color: rgba(255,255,255,0.22); }
`;

const StepIconRing = styled.div`
  width: clamp(44px, 9vw, 64px);
  height: clamp(44px, 9vw, 64px);
  border-radius: 50%;
  background: ${({ bg }) => bg};
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 10px;
  font-size: clamp(18px, 4vw, 26px);
  box-shadow: 0 8px 24px ${({ glow }) => glow || 'rgba(0,0,0,0.3)'};
  flex-shrink: 0;
`;

const StepNum = styled.div`
  position: absolute;
  top: 8px;
  right: 10px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: rgba(255,255,255,0.1);
  font-size: 10px;
  font-weight: 900;
  color: rgba(255,255,255,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StepTitle = styled.h4`
  font-size: clamp(12px, 2.5vw, 15px);
  font-weight: 800;
  color: #ffffff;
  margin: 0 0 6px;
  line-height: 1.2;
`;

const StepDesc = styled.p`
  font-size: clamp(10px, 2vw, 12px);
  color: rgba(255, 255, 255, 0.5);
  line-height: 1.5;
  margin: 0;
`;

// ─── CTA ─────────────────────────────────────────────────────────────────────
const CTARow = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 48px;
`;

const CTAButton = styled(motion.button)`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background: linear-gradient(135deg, #F5C518 0%, #FF8C00 100%);
  color: #1A1A3E;
  font-family: 'Nunito', sans-serif;
  font-size: 15px;
  font-weight: 900;
  padding: 14px 32px;
  border-radius: 9999px;
  border: none;
  cursor: pointer;
  box-shadow: 0 8px 32px rgba(245, 197, 24, 0.35);
  transition: box-shadow 0.2s;
  letter-spacing: 0.01em;

  &:hover {
    box-shadow: 0 12px 40px rgba(245, 197, 24, 0.55);
  }

  svg {
    width: 18px;
    height: 18px;
  }
`;

// ─── Data ─────────────────────────────────────────────────────────────────────
const steps = [
  {
    number: 1,
    icon: '💰',
    title: 'Set Your Budget',
    description: 'Decide how much to allocate as share rewards when you launch your campaign.',
    gradient: 'linear-gradient(135deg, rgba(245,197,24,0.12), rgba(255,140,0,0.08))',
    bg: 'linear-gradient(135deg, #F5C518, #FF8C00)',
    glow: 'rgba(245,197,24,0.35)',
  },
  {
    number: 2,
    icon: '📣',
    title: 'People Share',
    description: 'Supporters spread your campaign across their networks, reaching more hearts.',
    gradient: 'linear-gradient(135deg, rgba(41,171,226,0.12), rgba(59,181,232,0.08))',
    bg: 'linear-gradient(135deg, #29ABE2, #1E90FF)',
    glow: 'rgba(41,171,226,0.35)',
  },
  {
    number: 3,
    icon: '🎁',
    title: 'Earn Rewards',
    description: 'Every donation via a share earns the sharer real credits from your budget.',
    gradient: 'linear-gradient(135deg, rgba(232,62,140,0.12), rgba(204,34,34,0.08))',
    bg: 'linear-gradient(135deg, #E83E8C, #CC2222)',
    glow: 'rgba(232,62,140,0.35)',
  },
];

// ─── Component ────────────────────────────────────────────────────────────────
export default function ShareRewards() {
  const [shareBudget, setShareBudget] = useState(100);

  const min = 20, max = 500;
  const pct = ((shareBudget - min) / (max - min)) * 100;
  const platformFee = shareBudget * 0.20;
  const availableForSharers = shareBudget - platformFee;
  const estimatedShares = Math.floor(availableForSharers / 5);

  return (
    <Section>
      {/* Decorative background emojis */}
      <Decoration top="6%" left="3%" size="36px" dur="5s" delay="0s">🌈</Decoration>
      <Decoration top="12%" right="4%" size="28px" dur="4.5s" delay="1s">⭐</Decoration>
      <Decoration bottom="8%" left="5%" size="32px" dur="6s" delay="0.5s">💎</Decoration>
      <Decoration bottom="15%" right="6%" size="30px" dur="5.5s" delay="1.5s">🎉</Decoration>
      <Decoration top="40%" left="1%" size="24px" dur="4s" delay="2s">✨</Decoration>
      <Decoration top="55%" right="2%" size="26px" dur="5s" delay="0.8s">🌟</Decoration>

      <Container>
        {/* ── Header ── */}
        <Header>
          <BadgePill
            initial={{ opacity: 0, scale: 0.85 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            <BadgeDot /> Share Rewards Program
          </BadgePill>

          <SectionTitle
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: 0.1 }}
          >
            Spread the Word,{' '}
            <span className="yellow">Earn</span>{' '}
            <span className="blue">Together</span>
          </SectionTitle>

          <SectionSubtitle
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: 0.2 }}
          >
            Reward your community for sharing your campaign — every share that leads to a donation earns real credits.
          </SectionSubtitle>
        </Header>

        {/* ── Calculator ── */}
        <CalcCard
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15 }}
        >
          <CalcHeader>
            <CalcIcon>🧮</CalcIcon>
            <div>
              <CalcTitle>Reward Calculator</CalcTitle>
              <CalcSubLabel>See how far your budget goes</CalcSubLabel>
            </div>
          </CalcHeader>

          <SliderLabel>
            <SliderText>Share Budget</SliderText>
            <SliderValue>${shareBudget}</SliderValue>
          </SliderLabel>

          <StyledSlider
            type="range"
            min={min}
            max={max}
            step="10"
            pct={pct}
            value={shareBudget}
            onChange={(e) => setShareBudget(Number(e.target.value))}
          />

          <ResultGrid>
            <ResultTile>
              <TileLabel>Platform Fee (20%)</TileLabel>
              <TileValue>−${platformFee.toFixed(2)}</TileValue>
            </ResultTile>
            <ResultTile>
              <TileLabel>Net Budget</TileLabel>
              <TileValue>${availableForSharers.toFixed(2)}</TileValue>
            </ResultTile>
            <ResultTile accent>
              <TileLabel>Per Share Payout</TileLabel>
              <TileValue accent large>$5.00</TileValue>
            </ResultTile>
            <ResultTile accent>
              <TileLabel>Est. Rewarded Shares</TileLabel>
              <TileValue accent large>{estimatedShares}</TileValue>
            </ResultTile>
          </ResultGrid>

          <InfoBanner>
            <InfoIcon>ℹ️</InfoIcon>
            <InfoText>
              Once the budget runs out, people can still share for free. The honor system ensures fair and transparent reward distribution.
            </InfoText>
          </InfoBanner>
        </CalcCard>

        {/* ── Steps Flow ── */}
        <StepsLabel
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          How it works
        </StepsLabel>

        {/* Always horizontal — no vertical stacking on mobile */}
        <StepsRow>
          {steps.map((step, i) => (
            <>
              <StepWrapper key={step.number}>
                <StepCard
                  gradient={step.gradient}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 + i * 0.12 }}
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                >
                  <StepNum>{step.number}</StepNum>
                  <StepIconRing bg={step.bg} glow={step.glow}>
                    {step.icon}
                  </StepIconRing>
                  <StepTitle>{step.title}</StepTitle>
                  <StepDesc>{step.description}</StepDesc>
                </StepCard>
              </StepWrapper>

              {i < steps.length - 1 && (
                <ConnectorLine key={`connector-${i}`} />
              )}
            </>
          ))}
        </StepsRow>

        {/* ── CTA ── */}
        <CTARow>
          <CTAButton
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="18" cy="5" r="3" />
              <circle cx="6" cy="12" r="3" />
              <circle cx="18" cy="19" r="3" />
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
            </svg>
            How to Set Share Rewards
          </CTAButton>
        </CTARow>
      </Container>
    </Section>
  );
}