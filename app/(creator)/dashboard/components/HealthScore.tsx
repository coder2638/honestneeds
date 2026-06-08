'use client'

import React, { useMemo } from 'react'
import styled, { keyframes } from 'styled-components'
import { Activity, Heart, TrendingUp, Eye, Award } from 'lucide-react'
import { calculateHealthScore } from '../utils/dashboardCalculations'

interface HealthScoreComponentProps {
  campaign: {
    raised: number
    goal: number
    donor_count?: number
    status: string
    created_at: string
    updated_at: string
  }
  showBreakdown?: boolean
  size?: 'small' | 'medium' | 'large'
}

/* ── Animations ── */
const fillBar = keyframes`
  from { width: 0%; }
  to   { width: var(--fill); }
`

const drawCircle = keyframes`
  from { stroke-dashoffset: var(--circumference); }
  to   { stroke-dashoffset: var(--offset); }
`

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
`

/* ── Colour maps ── */
const levelMeta: Record<string, { label: string; bg: string; text: string; ring: string }> = {
  excellent: { label: 'Excellent', bg: '#edfaf4', text: '#1a9e61', ring: '#1a9e61' },
  good:      { label: 'Good',      bg: '#eff5ff', text: '#3470e4', ring: '#3470e4' },
  fair:      { label: 'Fair',      bg: '#fffbeb', text: '#d98a0b', ring: '#d98a0b' },
  poor:      { label: 'Poor',      bg: '#fff0f0', text: '#e0443c', ring: '#e0443c' },
}

const factorColors: Record<string, { icon: string; bar: string; bg: string }> = {
  Progress:   { icon: '#3470e4', bar: '#3470e4', bg: '#eff5ff' },
  Engagement: { icon: '#e0443c', bar: '#e0443c', bg: '#fff0f0' },
  Activity:   { icon: '#1a9e61', bar: '#1a9e61', bg: '#edfaf4' },
  Status:     { icon: '#d98a0b', bar: '#d98a0b', bg: '#fffbeb' },
  Conversion: { icon: '#7c4dff', bar: '#7c4dff', bg: '#f3f0ff' },
}

/* ── Container ── */
const ScoreContainer = styled.div`
  background: #ffffff;
  border: 1px solid #f0f0ef;
  border-radius: 20px;
  padding: 24px 20px;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
  overflow: hidden;
  animation: ${fadeIn} 0.35s ease both;

  @media (max-width: 480px) {
    border-radius: 16px;
    padding: 16px 14px;
  }
`

const SectionLabel = styled.h3`
  font-family: 'DM Sans', system-ui, sans-serif;
  font-size: 15px;
  font-weight: 600;
  color: #0f0f0e;
  margin: 0 0 20px 0;
  letter-spacing: -0.2px;
`

/* ── Hero row: ring + stats side-by-side ── */
const HeroRow = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 20px;
  /* Never let the row overflow its card */
  min-width: 0;
  max-width: 100%;

  @media (max-width: 360px) {
    gap: 14px;
  }
`

/* Fixed-size ring wrapper; shrinks at 360px breakpoint */
const RingWrap = styled.div<{ sz: 'small' | 'medium' | 'large' }>`
  flex-shrink: 0;
  /* medium = 96px, small = 80px, large = 116px */
  width: ${({ sz }) => (sz === 'small' ? 80 : sz === 'large' ? 116 : 96)}px;
  height: ${({ sz }) => (sz === 'small' ? 80 : sz === 'large' ? 116 : 96)}px;
  position: relative;

  @media (max-width: 360px) {
    width: 76px;
    height: 76px;
  }
`

const RingSvg = styled.svg`
  transform: rotate(-90deg);
  overflow: visible;
  display: block;
`

const RingTrack = styled.circle`
  fill: none;
  stroke: #f0f0ef;
  stroke-width: 6;
`

const RingFill = styled.circle<{ color: string; circumference: number; offset: number }>`
  fill: none;
  stroke: ${({ color }) => color};
  stroke-width: 6;
  stroke-linecap: round;
  stroke-dasharray: ${({ circumference }) => circumference};
  stroke-dashoffset: ${({ offset }) => offset};
  --circumference: ${({ circumference }) => circumference};
  --offset: ${({ offset }) => offset};
  animation: ${drawCircle} 1s cubic-bezier(0.34, 1.56, 0.64, 1) 0.2s both;
`

const RingCenter = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`

const ScoreDigit = styled.span`
  font-family: 'DM Sans', system-ui, sans-serif;
  font-size: 28px;
  font-weight: 700;
  color: #0f0f0e;
  line-height: 1;
  letter-spacing: -1px;

  @media (max-width: 360px) {
    font-size: 24px;
  }
`

const ScoreOf = styled.span`
  font-size: 10px;
  color: #a8a8a3;
  font-weight: 500;
  margin-top: 1px;
`

/* Right column: badge + stats — must shrink and not overflow */
const HeroRight = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
  overflow: hidden;
`

const LevelBadge = styled.span<{ level: string }>`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.3px;
  padding: 4px 10px;
  border-radius: 8px;
  /* Shrink to content but never overflow */
  width: fit-content;
  max-width: 100%;
  background: ${({ level }) => levelMeta[level]?.bg ?? '#f4f4f2'};
  color: ${({ level }) => levelMeta[level]?.text ?? '#888884'};
`

const LevelDot = styled.span<{ level: string }>`
  width: 6px;
  height: 6px;
  flex-shrink: 0;
  border-radius: 50%;
  background: ${({ level }) => levelMeta[level]?.ring ?? '#c0c0bb'};
`

const StatGroup = styled.div`
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  min-width: 0;
`

const HeroStat = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1px;
  min-width: 0;
`

const HeroStatValue = styled.span`
  font-family: 'DM Sans', system-ui, sans-serif;
  /* Reduced from 22px to prevent overflow on narrow screens */
  font-size: 18px;
  font-weight: 700;
  color: #0f0f0e;
  line-height: 1.1;
  letter-spacing: -0.4px;
  white-space: nowrap;

  @media (max-width: 360px) {
    font-size: 16px;
  }
`

const HeroStatLabel = styled.span`
  font-size: 11px;
  color: #888884;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

/* ── Breakdown section ── */
const Divider = styled.div`
  height: 1px;
  background: #f0f0ef;
  margin: 0 0 18px 0;
`

const BreakdownTitle = styled.p`
  font-size: 11px;
  font-weight: 600;
  color: #a8a8a3;
  text-transform: uppercase;
  letter-spacing: 0.7px;
  margin: 0 0 12px 0;
`

const FactorList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 9px;
`

const FactorRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  /* Never overflow the card */
  min-width: 0;
  max-width: 100%;
`

const FactorIconWrap = styled.div<{ name: string }>`
  width: 26px;
  height: 26px;
  border-radius: 7px;
  flex-shrink: 0;
  background: ${({ name }) => factorColors[name]?.bg ?? '#f4f4f2'};
  color: ${({ name }) => factorColors[name]?.icon ?? '#888884'};
  display: flex;
  align-items: center;
  justify-content: center;
`

const FactorLabel = styled.span`
  font-size: 12px;
  font-weight: 500;
  color: #3c3c39;
  /* Fixed width on ≥360px so bar sizes consistently; auto below */
  width: 70px;
  flex-shrink: 0;

  @media (max-width: 360px) {
    width: auto;
    min-width: 54px;
    font-size: 11px;
  }
`

/* Bar takes remaining space — flex:1 with min-width:0 is critical */
const BarTrack = styled.div`
  flex: 1;
  min-width: 0;
  height: 5px;
  border-radius: 99px;
  background: #f0f0ef;
  overflow: hidden;
`

const BarFill = styled.div<{ pct: number; name: string }>`
  height: 100%;
  width: 0%;
  border-radius: 99px;
  background: ${({ name }) => factorColors[name]?.bar ?? '#888884'};
  --fill: ${({ pct }) => Math.min(pct, 100)}%;
  animation: ${fillBar} 0.8s cubic-bezier(0.34, 1.2, 0.64, 1) both;
  animation-delay: var(--delay, 0ms);
`

const FactorVal = styled.span`
  font-size: 11px;
  font-weight: 600;
  color: #0f0f0e;
  /* Fixed width so values align; narrow enough to not overflow */
  width: 36px;
  flex-shrink: 0;
  text-align: right;
  white-space: nowrap;
`

const FactorMax = styled.span`
  color: #c0c0bb;
  font-weight: 400;
`

/* ── Component ── */
export const HealthScore: React.FC<HealthScoreComponentProps> = ({
  campaign,
  showBreakdown = true,
  size = 'medium',
}) => {
  const healthData = useMemo(() => calculateHealthScore(campaign), [campaign])

  const factors = useMemo(() => {
    const goalProgress = campaign.goal > 0 ? (campaign.raised / campaign.goal) * 100 : 0
    const progressScore = Math.min(goalProgress / 100, 1) * 30
    const engagementScore = Math.min((campaign.donor_count || 0) / 50, 1) * 20
    const daysSinceUpdate =
      (Date.now() - new Date(campaign.updated_at).getTime()) / (1000 * 60 * 60 * 24)
    const activityScore = Math.max(0, 1 - daysSinceUpdate / 30) * 20
    const daysOld =
      (Date.now() - new Date(campaign.created_at).getTime()) / (1000 * 60 * 60 * 24)
    let ageScore = 0
    if (campaign.status === 'active' && daysOld <= 90) ageScore = 15
    else if (campaign.status === 'completed') ageScore = 15
    else if (campaign.status === 'draft') ageScore = 0
    else ageScore = 7.5
    const avgDonation =
      campaign.donor_count && campaign.donor_count > 0
        ? campaign.raised / campaign.donor_count
        : 0
    const conversionScore = Math.min(avgDonation / 50, 1) * 15

    return [
      { name: 'Progress',   icon: <TrendingUp size={13} />, weight: 30, score: progressScore },
      { name: 'Engagement', icon: <Heart size={13} />,      weight: 20, score: engagementScore },
      { name: 'Activity',   icon: <Activity size={13} />,   weight: 20, score: activityScore },
      { name: 'Status',     icon: <Award size={13} />,      weight: 15, score: ageScore },
      { name: 'Conversion', icon: <Eye size={13} />,        weight: 15, score: conversionScore },
    ]
  }, [campaign])

  /* SVG ring math — sized to match RingWrap */
  const ringSize = size === 'small' ? 80 : size === 'large' ? 116 : 96
  const cx = ringSize / 2
  const r = cx - 7
  const circumference = 2 * Math.PI * r
  const offset = circumference - (healthData.score / 100) * circumference
  const ringColor = levelMeta[healthData.level]?.ring ?? '#888884'

  const raisedFmt = campaign.raised.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
  const goalFmt = campaign.goal.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })

  return (
    <ScoreContainer>
      <SectionLabel>Health Score</SectionLabel>

      <HeroRow>
        {/* Radial ring */}
        <RingWrap sz={size}>
          <RingSvg width={ringSize} height={ringSize} viewBox={`0 0 ${ringSize} ${ringSize}`}>
            <RingTrack cx={cx} cy={cx} r={r} />
            <RingFill cx={cx} cy={cx} r={r} color={ringColor} circumference={circumference} offset={offset} />
          </RingSvg>
          <RingCenter>
            <ScoreDigit>{healthData.score}</ScoreDigit>
            <ScoreOf>/100</ScoreOf>
          </RingCenter>
        </RingWrap>

        {/* Stats */}
        <HeroRight>
          <LevelBadge level={healthData.level}>
            <LevelDot level={healthData.level} />
            {levelMeta[healthData.level]?.label ?? healthData.level}
          </LevelBadge>
          <StatGroup>
            <HeroStat>
              <HeroStatValue>${raisedFmt}</HeroStatValue>
              <HeroStatLabel>of ${goalFmt} goal</HeroStatLabel>
            </HeroStat>
            <HeroStat>
              <HeroStatValue>{campaign.donor_count ?? 0}</HeroStatValue>
              <HeroStatLabel>donors</HeroStatLabel>
            </HeroStat>
          </StatGroup>
        </HeroRight>
      </HeroRow>

      {showBreakdown && (
        <>
          <Divider />
          <BreakdownTitle>Score breakdown</BreakdownTitle>
          <FactorList>
            {factors.map((f, i) => {
              const pct = f.weight > 0 ? (f.score / f.weight) * 100 : 0
              return (
                <FactorRow key={f.name}>
                  <FactorIconWrap name={f.name}>{f.icon}</FactorIconWrap>
                  <FactorLabel>{f.name}</FactorLabel>
                  <BarTrack>
                    <BarFill
                      pct={pct}
                      name={f.name}
                      style={{ '--delay': `${i * 80 + 200}ms` } as React.CSSProperties}
                    />
                  </BarTrack>
                  <FactorVal>
                    {f.score.toFixed(1)}<FactorMax>/{f.weight}</FactorMax>
                  </FactorVal>
                </FactorRow>
              )
            })}
          </FactorList>
        </>
      )}
    </ScoreContainer>
  )
}

export default HealthScore