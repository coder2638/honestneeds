'use client'

import React, { useEffect, useRef } from 'react'
import styled, { keyframes, css } from 'styled-components'
import { usePrayerMetrics } from '@/api/hooks/usePrayers'
import { LoadingSpinner } from '@/components/LoadingSpinner'

// ─── Tokens ────────────────────────────────────────────────────────────────────

const t = {
  sand:        '#FAF8F4',
  cream:       '#F3EFE8',
  clay:        '#E8E0D4',
  border:      '#DDD8CF',
  slate:       '#2C2B28',
  charcoal:    '#4A4845',
  muted:       '#8A857D',
  // Warm violet — intentional, not generic purple
  violet:      '#7C5CBF',
  violetLight: '#F0EBF9',
  violetMid:   '#B89FE0',
  violetDark:  '#5A3D9A',
  // Gold accent for "goal reached"
  gold:        '#C49A2A',
  goldLight:   '#FBF5E0',
  // Success
  forest:      '#1A5C3A',
  forestLight: '#EDF7F1',
}

// ─── Animations ────────────────────────────────────────────────────────────────

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
`

const fillBar = keyframes`
  from { width: 0%; }
  to   { width: var(--target-width); }
`

const orbFloat = keyframes`
  0%, 100% { transform: translateY(0px) scale(1); }
  50%       { transform: translateY(-6px) scale(1.04); }
`

const shimmerSweep = keyframes`
  0%   { background-position: -300% center; }
  100% { background-position: 300% center; }
`

const glowPulse = keyframes`
  0%, 100% { box-shadow: 0 0 0 0 rgba(124, 92, 191, 0.25); }
  50%       { box-shadow: 0 0 0 8px rgba(124, 92, 191, 0); }
`

const spinSlow = keyframes`
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
`

const countUp = keyframes`
  from { opacity: 0; transform: scale(0.7); }
  to   { opacity: 1; transform: scale(1); }
`

// ─── Styled Components ─────────────────────────────────────────────────────────

const Wrapper = styled.div`
  width: 100%;
  font-family: 'DM Sans', sans-serif;
  animation: ${fadeUp} 0.5s ease both;
`

// ── Header ──────────────────────────────────────────────────────────────────────

const Header = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1.5rem;

  @media (max-width: 480px) {
    flex-direction: column;
    gap: 0.75rem;
  }
`

const TitleBlock = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`

const OrbIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: ${t.violetLight};
  border: 1px solid rgba(124, 92, 191, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  flex-shrink: 0;
  animation: ${orbFloat} 4s ease-in-out infinite;
`

const TitleText = styled.div``

const Title = styled.h3`
  font-family: 'Syne', sans-serif;
  font-size: 1rem;
  font-weight: 700;
  color: ${t.slate};
  margin: 0;
  line-height: 1.2;
`

const Subtitle = styled.p`
  font-size: 0.75rem;
  color: ${t.muted};
  margin: 2px 0 0;
`

const CounterBlock = styled.div`
  text-align: right;
  flex-shrink: 0;

  @media (max-width: 480px) {
    text-align: left;
  }
`

const CountDisplay = styled.div`
  display: flex;
  align-items: baseline;
  gap: 4px;
  justify-content: flex-end;
  animation: ${countUp} 0.6s cubic-bezier(0.22, 1, 0.36, 1) both;

  @media (max-width: 480px) {
    justify-content: flex-start;
  }
`

const CountCurrent = styled.span`
  font-family: 'Syne', sans-serif;
  font-size: 1.75rem;
  font-weight: 800;
  color: ${t.violet};
  line-height: 1;
`

const CountSep = styled.span`
  font-size: 1rem;
  color: ${t.clay};
  font-weight: 300;
`

const CountGoal = styled.span`
  font-size: 1rem;
  color: ${t.muted};
  font-weight: 400;
`

const CountLabel = styled.div`
  font-size: 0.7rem;
  color: ${t.muted};
  text-align: right;
  margin-top: 2px;
  text-transform: uppercase;
  letter-spacing: 0.6px;
  font-weight: 500;

  @media (max-width: 480px) {
    text-align: left;
  }
`

// ── Progress Bar ─────────────────────────────────────────────────────────────────

const BarWrap = styled.div`
  position: relative;
  margin-bottom: 0.625rem;
`

const BarTrack = styled.div`
  width: 100%;
  height: 10px;
  background: ${t.cream};
  border: 1px solid ${t.border};
  border-radius: 100px;
  overflow: hidden;
`

const BarFill = styled.div<{ $pct: number; $reached: boolean }>`
  height: 100%;
  border-radius: 100px;
  --target-width: ${p => p.$pct}%;
  width: var(--target-width);
  background: ${p => p.$reached
    ? `linear-gradient(90deg, ${t.gold}, #E8B830)`
    : `linear-gradient(90deg, ${t.violet}, ${t.violetDark})`
  };
  animation: ${fillBar} 1.4s cubic-bezier(0.22, 1, 0.36, 1) both;
  animation-delay: 0.2s;
  position: relative;
  overflow: hidden;

  /* Shimmer sweep */
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(
      90deg,
      transparent 0%,
      rgba(255,255,255,0.4) 50%,
      transparent 100%
    );
    background-size: 300% 100%;
    animation: ${shimmerSweep} 2.5s ease infinite;
    animation-delay: 0.8s;
  }

  ${p => p.$reached && css`
    animation: ${glowPulse} 2s ease infinite;
  `}
`

const BarMeta = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 0.5rem;
`

const PctLabel = styled.span`
  font-size: 0.75rem;
  font-weight: 600;
  color: ${t.violet};
`

const GoalReachedBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  background: ${t.goldLight};
  border: 1px solid rgba(196, 154, 42, 0.3);
  color: ${t.gold};
  font-size: 0.72rem;
  font-weight: 700;
  padding: 3px 10px;
  border-radius: 100px;
  font-family: 'Syne', sans-serif;
  letter-spacing: 0.3px;
`

// ── Breakdown Grid ────────────────────────────────────────────────────────────────

const BreakdownWrap = styled.div`
  margin-top: 1.25rem;
  padding-top: 1.25rem;
  border-top: 1px solid ${t.clay};
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.625rem;

  @media (max-width: 480px) {
    grid-template-columns: repeat(2, 1fr);
  }
`

const BreakdownTile = styled.div<{ $active: boolean }>`
  background: ${p => p.$active ? t.violetLight : t.sand};
  border: 1px solid ${p => p.$active ? 'rgba(124,92,191,0.25)' : t.border};
  border-radius: 12px;
  padding: 0.75rem 0.5rem;
  text-align: center;
  transition: background 200ms, border-color 200ms;
  position: relative;
  overflow: hidden;
`

const BreakdownIcon = styled.div`
  font-size: 1.25rem;
  margin-bottom: 5px;
  line-height: 1;
`

const BreakdownCount = styled.div<{ $active: boolean }>`
  font-family: 'Syne', sans-serif;
  font-size: 1rem;
  font-weight: 700;
  color: ${p => p.$active ? t.violet : t.muted};
  line-height: 1;
  margin-bottom: 3px;
`

const BreakdownType = styled.div`
  font-size: 0.65rem;
  text-transform: uppercase;
  letter-spacing: 0.6px;
  font-weight: 500;
  color: ${t.muted};
`

// ── Today's Prayers ────────────────────────────────────────────────────────────────

const TodayBanner = styled.div`
  margin-top: 1rem;
  display: flex;
  align-items: center;
  gap: 8px;
  background: ${t.violetLight};
  border: 1px solid rgba(124, 92, 191, 0.2);
  border-radius: 10px;
  padding: 0.625rem 0.875rem;
  font-size: 0.8rem;
  color: ${t.violet};
  font-weight: 500;
`

const TodayCount = styled.span`
  font-family: 'Syne', sans-serif;
  font-weight: 800;
`

// ── Loading Skeleton ───────────────────────────────────────────────────────────────

const skeletonPulse = keyframes`
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.4; }
`

const SkeletonBar = styled.div<{ $w?: string; $h?: string }>`
  width: ${p => p.$w || '100%'};
  height: ${p => p.$h || '12px'};
  background: ${t.cream};
  border-radius: 100px;
  animation: ${skeletonPulse} 1.5s ease infinite;
`

// ─── Component ────────────────────────────────────────────────────────────────

interface PrayerMeterProps {
  campaignId: string
  goalPrayers?: number
  showBreakdown?: boolean
  className?: string
  animated?: boolean
}

const PRAYER_TYPES = [
  { key: 'tap',   label: 'Taps',   icon: '🤲' },
  { key: 'text',  label: 'Words',  icon: '✍️' },
  { key: 'voice', label: 'Voice',  icon: '🎙️' },
  { key: 'video', label: 'Video',  icon: '🎥' },
]

export function PrayerMeter({
  campaignId,
  goalPrayers = 100,
  showBreakdown = true,
  className = '',
  animated = true,
}: PrayerMeterProps) {
  const { data: metrics, isLoading, error } = usePrayerMetrics(campaignId)

  if (isLoading) {
    return (
      <Wrapper className={className}>
        <Header>
          <TitleBlock>
            <SkeletonBar $w="40px" $h="40px" style={{ borderRadius: 12 }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <SkeletonBar $w="120px" $h="14px" />
              <SkeletonBar $w="80px" $h="10px" />
            </div>
          </TitleBlock>
          <SkeletonBar $w="60px" $h="28px" style={{ borderRadius: 8 }} />
        </Header>
        <SkeletonBar $h="10px" style={{ marginBottom: '0.5rem' }} />
        <SkeletonBar $w="40px" $h="10px" />
      </Wrapper>
    )
  }

  if (error || !metrics) return null

  const total    = metrics.total_prayers || 0
  const pct      = Math.min((total / goalPrayers) * 100, 100)
  const reached  = total >= goalPrayers
  const breakdown = metrics.breakdown || { tap: 0, text: 0, voice: 0, video: 0 }
  const today    = metrics.prayers_today || 0

  return (
    <Wrapper className={className}>
      <Header>
        <TitleBlock>
          <OrbIcon>🙏</OrbIcon>
          <TitleText>
            <Title>Prayer Support</Title>
            <Subtitle>Community prayers for this campaign</Subtitle>
          </TitleText>
        </TitleBlock>

        <CounterBlock>
          <CountDisplay>
            <CountCurrent>{total.toLocaleString()}</CountCurrent>
            <CountSep>/</CountSep>
            <CountGoal>{goalPrayers.toLocaleString()}</CountGoal>
          </CountDisplay>
          <CountLabel>prayers sent</CountLabel>
        </CounterBlock>
      </Header>

      {/* Progress */}
      <BarWrap>
        <BarTrack>
          <BarFill $pct={pct} $reached={reached} />
        </BarTrack>
        <BarMeta>
          <PctLabel>{pct.toFixed(0)}% of goal</PctLabel>
          {reached && (
            <GoalReachedBadge>
              ✦ Goal reached
            </GoalReachedBadge>
          )}
        </BarMeta>
      </BarWrap>

      {/* Type Breakdown */}
      {showBreakdown && (
        <BreakdownWrap>
          {PRAYER_TYPES.map(({ key, label, icon }) => {
            const count = breakdown[key] || 0
            return (
              <BreakdownTile key={key} $active={count > 0}>
                <BreakdownIcon>{icon}</BreakdownIcon>
                <BreakdownCount $active={count > 0}>{count}</BreakdownCount>
                <BreakdownType>{label}</BreakdownType>
              </BreakdownTile>
            )
          })}
        </BreakdownWrap>
      )}

      {/* Today */}
      {today > 0 && (
        <TodayBanner>
          ✨
          <span>
            <TodayCount>{today}</TodayCount>{' '}
            prayer{today !== 1 ? 's' : ''} received today
          </span>
        </TodayBanner>
      )}
    </Wrapper>
  )
}

export default PrayerMeter