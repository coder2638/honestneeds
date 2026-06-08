'use client'

import Link from 'next/link'
import Image from 'next/image'
import styled, { keyframes, css } from 'styled-components'
import { useState } from 'react'
import {
  TrendingUp,
  Share2,
  Heart,
  MapPin,
  Map,
  Globe,
  Zap,
  Copy,
  Check,
  Users,
  Sparkles,
  ArrowRight,
} from 'lucide-react'
import { Campaign } from '@/api/services/campaignService'
import { normalizeImageUrl } from '@/utils/imageUtils'
import Button from '@/components/ui/Button'
import { ShareWizard } from './ShareWizard'

interface CampaignCardProps {
  campaign: Campaign
  onDonate?: (campaignId: string) => void
  onShare?: (campaignId: string) => void
}

// ─── Animations ──────────────────────────────────────────────────────────────
const shimmer = keyframes`
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
`

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(6px); }
  to { opacity: 1; transform: translateY(0); }
`

// ─── Card Shell ───────────────────────────────────────────────────────────────
const Card = styled.article`
  background: #ffffff;
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid #f0f0f0;
  transition: transform 220ms ease, box-shadow 220ms ease, border-color 220ms ease;
  animation: ${fadeUp} 350ms ease both;
  display: flex;
  flex-direction: column;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.09);
    border-color: #e4e4f0;
  }
`

// ─── Image ─────────────────────────────────────────────────────────────────────
const ImageWrap = styled.div`
  position: relative;
  height: 180px;
  background: linear-gradient(135deg, #f0efff 0%, #ede8ff 100%);
  overflow: hidden;
  flex-shrink: 0;

  img {
    transition: transform 400ms ease;
  }

  ${Card}:hover & img {
    transform: scale(1.04);
  }
`

const ImagePlaceholder = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f5f3ff 0%, #ede9fe 50%, #e0f2fe 100%);

  svg {
    width: 40px;
    height: 40px;
    color: #c4b5fd;
  }
`

// ─── Badge cluster ──────────────────────────────────────────────────────────────
const BadgeRow = styled.div`
  position: absolute;
  top: 10px;
  left: 10px;
  right: 10px;
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
`

const Badge = styled.span<{
  $variant?: 'scope' | 'trending' | 'done' | 'earn' | 'boost'
  $scope?: string
  $tier?: string
}>`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 3px 9px;
  border-radius: 999px;
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.3px;
  backdrop-filter: blur(8px);
  line-height: 1.6;

  ${({ $variant, $scope, $tier }) => {
    if ($variant === 'earn') return css`
      background: rgba(255, 255, 255, 0.92);
      color: #0369a1;
      border: 1px solid rgba(14, 165, 233, 0.35);
    `
    if ($variant === 'trending') return css`
      background: rgba(255, 255, 255, 0.92);
      color: #b45309;
      border: 1px solid rgba(251, 191, 36, 0.5);
    `
    if ($variant === 'done') return css`
      background: rgba(255, 255, 255, 0.92);
      color: #15803d;
      border: 1px solid rgba(34, 197, 94, 0.4);
    `
    if ($variant === 'boost') {
      const tierStyles: Record<string, string> = {
        basic: 'background: rgba(219,234,254,0.95); color: #1e40af; border: 1px solid rgba(96,165,250,0.4);',
        pro: 'background: rgba(233,213,255,0.95); color: #6b21a8; border: 1px solid rgba(192,132,252,0.4);',
        premium: 'background: rgba(254,243,199,0.95); color: #b45309; border: 1px solid rgba(251,191,36,0.5);',
      }
      return css`${tierStyles[$tier || 'basic'] || tierStyles.basic}`
    }
    if ($variant === 'scope') {
      const scopeMap: Record<string, string> = {
        local: 'background:rgba(219,234,254,0.92);color:#1e40af;border:1px solid rgba(96,165,250,0.4);',
        regional: 'background:rgba(220,252,231,0.92);color:#14532d;border:1px solid rgba(74,222,128,0.4);',
        national: 'background:rgba(243,232,255,0.92);color:#6b21a8;border:1px solid rgba(192,132,252,0.4);',
        global: 'background:rgba(255,237,213,0.92);color:#9a3412;border:1px solid rgba(251,146,60,0.4);',
      }
      return css`${scopeMap[$scope || ''] || 'background:rgba(243,244,246,0.92);color:#374151;border:1px solid rgba(156,163,175,0.4);'}`
    }
    return ''
  }}
`

// ─── Body ──────────────────────────────────────────────────────────────────────
const Body = styled.div`
  padding: 14px 16px 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  flex: 1;
`

const TitleRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`

const Title = styled.h3`
  font-size: 0.95rem;
  font-weight: 700;
  color: #111827;
  line-height: 1.35;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin: 0;
  letter-spacing: -0.01em;
  transition: color 200ms;

  a:hover & {
    color: #6366f1;
  }
`

const CreatorName = styled.p`
  font-size: 0.75rem;
  color: #9ca3af;
  margin: 0;
  font-weight: 500;

  span {
    color: #6366f1;
    transition: color 180ms;
  }

  a:hover span {
    color: #4f46e5;
  }
`

// ─── Progress ──────────────────────────────────────────────────────────────────
const ProgressSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`

const ProgressMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
`

const RaisedAmount = styled.span`
  font-size: 0.85rem;
  font-weight: 700;
  color: #111827;
`

const GoalAmount = styled.span`
  font-size: 0.72rem;
  color: #9ca3af;
  font-weight: 500;
`

const ProgressTrack = styled.div`
  height: 5px;
  background: #f3f4f6;
  border-radius: 999px;
  overflow: hidden;
`

const ProgressFill = styled.div<{ $pct: number }>`
  height: 100%;
  width: ${p => Math.min(p.$pct, 100)}%;
  background: ${p => p.$pct >= 100
    ? 'linear-gradient(90deg, #10b981, #34d399)'
    : 'linear-gradient(90deg, #6366f1, #818cf8)'};
  border-radius: 999px;
  transition: width 600ms cubic-bezier(0.4, 0, 0.2, 1);
`

const ProgressPct = styled.span<{ $pct: number }>`
  font-size: 0.7rem;
  font-weight: 700;
  color: ${p => p.$pct >= 100 ? '#10b981' : '#6366f1'};
`

// ─── Stats ─────────────────────────────────────────────────────────────────────
const StatsRow = styled.div`
  display: flex;
  gap: 12px;
`

const Stat = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 0.75rem;
  color: #6b7280;
  font-weight: 500;

  svg {
    color: #d1d5db;
    flex-shrink: 0;
  }

  strong {
    color: #374151;
    font-weight: 700;
  }
`

// ─── Actions ───────────────────────────────────────────────────────────────────
const Actions = styled.div`
  display: flex;
  gap: 8px;
  margin-top: auto;
`

const DonateBtn = styled.button`
  flex: 1;
  height: 38px;
  border-radius: 10px;
  border: none;
  background: linear-gradient(135deg, #6366f1 0%, #818cf8 100%);
  color: white;
  font-size: 0.8rem;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  letter-spacing: 0.2px;
  transition: opacity 180ms, transform 120ms;

  &:hover { opacity: 0.9; transform: scale(1.01); }
  &:active { transform: scale(0.98); }
`

const ShareBtn = styled.button`
  width: 38px;
  height: 38px;
  border-radius: 10px;
  border: 1.5px solid #e5e7eb;
  background: #fafafa;
  color: #6b7280;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: border-color 180ms, background 180ms, color 180ms;

  &:hover {
    border-color: #6366f1;
    background: #eef2ff;
    color: #6366f1;
  }
`

const ShareEarnBtn = styled(DonateBtn)`
  background: linear-gradient(135deg, #0ea5e9 0%, #38bdf8 100%);
`

const CopyBtn = styled(ShareBtn)<{ $copied?: boolean }>`
  ${p => p.$copied && css`
    border-color: #10b981;
    background: #ecfdf5;
    color: #10b981;
  `}
`

const ViewLink = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  font-size: 0.72rem;
  font-weight: 600;
  color: #9ca3af;
  text-decoration: none;
  transition: color 180ms;
  letter-spacing: 0.1px;

  &:hover { color: #6366f1; }
  svg { transition: transform 180ms; }
  &:hover svg { transform: translateX(2px); }
`

// ─── Helpers ───────────────────────────────────────────────────────────────────
const scopeIcon = (scope?: string) => {
  const map: Record<string, JSX.Element> = {
    local: <MapPin size={10} />,
    regional: <Map size={10} />,
    national: <Globe size={10} />,
    global: <Zap size={10} />,
  }
  return scope ? map[scope] : null
}

const fmt = (cents: number) =>
  (cents / 100).toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })

// ─── Component ─────────────────────────────────────────────────────────────────
export function CampaignCard({ campaign, onDonate, onShare }: CampaignCardProps) {
  const [wizardOpen, setWizardOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  const goalAmount = campaign.goals?.[0]?.target_amount ?? 0
  const raised = campaign.total_donation_amount ?? 0
  const pct = goalAmount > 0 ? Math.min((raised / goalAmount) * 100, 100) : 0

  const handleCopy = () => {
    const url = `${window.location.origin}/campaigns/${campaign.id}`
    navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const isSharing = campaign.campaign_type === 'sharing'
  const tierLabel = (campaign.current_boost_tier ?? 'basic')
  const tierEmoji: Record<string, string> = { basic: '⚡', pro: '🚀', premium: '👑' }

  return (
    <Card>
      {/* ── Image ── */}
      <ImageWrap>
        {campaign.image_url || campaign.image?.url ? (
          <Image
            src={normalizeImageUrl(campaign.image_url || campaign.image?.url) || '/placeholder-campaign.png'}
            alt={campaign.image?.alt || campaign.title}
            fill
            style={{ objectFit: 'cover' }}
          />
        ) : (
          <ImagePlaceholder>
            <Sparkles />
          </ImagePlaceholder>
        )}

        <BadgeRow>
          {campaign.is_boosted && (
            <Badge $variant="boost" $tier={tierLabel}>
              {tierEmoji[tierLabel]} {tierLabel.charAt(0).toUpperCase() + tierLabel.slice(1)}
            </Badge>
          )}
          {isSharing && <Badge $variant="earn">💰 Share to Earn</Badge>}
          {campaign.geographicScope && (
            <Badge $variant="scope" $scope={campaign.geographicScope}>
              {scopeIcon(campaign.geographicScope)}
              {campaign.geographicScope.charAt(0).toUpperCase() + campaign.geographicScope.slice(1)}
            </Badge>
          )}
          {campaign.trending && (
            <Badge $variant="trending"><TrendingUp size={10} /> Trending</Badge>
          )}
          {campaign.status === 'completed' && (
            <Badge $variant="done">✓ Completed</Badge>
          )}
        </BadgeRow>
      </ImageWrap>

      {/* ── Body ── */}
      <Body>
        {/* Title */}
        <TitleRow>
          <Link href={`/campaigns/${campaign.id}`} style={{ textDecoration: 'none' }}>
            <Title>{campaign.title}</Title>
          </Link>
        </TitleRow>

        {/* Progress */}
        <ProgressSection>
          <ProgressMeta>
            <RaisedAmount>{fmt(raised)}</RaisedAmount>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <GoalAmount>of {fmt(goalAmount)}</GoalAmount>
              <ProgressPct $pct={pct}>{pct.toFixed(0)}%</ProgressPct>
            </div>
          </ProgressMeta>
          <ProgressTrack>
            <ProgressFill $pct={pct} />
          </ProgressTrack>
        </ProgressSection>

        {/* Stats */}
        <StatsRow>
          {isSharing ? (
            <Stat>
              <Share2 size={13} />
              <strong>{(campaign.share_count ?? 0).toLocaleString()}</strong> shares
            </Stat>
          ) : (
            <Stat>
              <Heart size={13} />
              <strong>{(campaign.total_donation_amount ?? 0) > 0
                ? fmt(campaign.total_donation_amount!)
                : '$0'}
              </strong>
            </Stat>
          )}
          <Stat>
            <Users size={13} />
            <strong>{(campaign.total_donors ?? 0).toLocaleString()}</strong> supporters
          </Stat>
        </StatsRow>

        {/* Actions */}
        <Actions>
          {isSharing ? (
            <>
              <ShareEarnBtn onClick={() => setWizardOpen(true)}>
                💰 Share to Earn
              </ShareEarnBtn>
              <CopyBtn onClick={handleCopy} $copied={copied} title="Copy link">
                {copied ? <Check size={15} /> : <Copy size={15} />}
              </CopyBtn>
            </>
          ) : (
            <>
              <DonateBtn onClick={() => onDonate?.(campaign.id)}>
                <Heart size={14} /> Donate
              </DonateBtn>
              <ShareBtn onClick={() => onShare?.(campaign.id)} title="Share">
                <Share2 size={15} />
              </ShareBtn>
            </>
          )}
        </Actions>

        <ViewLink href={`/campaigns/${campaign.id}`}>
          View details <ArrowRight size={12} />
        </ViewLink>
      </Body>

      <ShareWizard
        isOpen={wizardOpen}
        onClose={() => setWizardOpen(false)}
        campaignId={campaign.id}
        campaignTitle={campaign.title}
        campaignDescription={campaign.description || campaign.full_description}
        creator_name={campaign.creator_name}
        share_config={campaign.share_config}
      />
    </Card>
  )
}