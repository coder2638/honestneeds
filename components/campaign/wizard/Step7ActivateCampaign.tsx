'use client'

import React, { useState } from 'react'
import styled, { keyframes, css } from 'styled-components'
import { useRouter } from 'next/navigation'
import { CheckCircle2, Loader2, AlertCircle, Rocket, FileText, Globe, Pause } from 'lucide-react'
import { usePublishCampaign } from '@/api/hooks/useCampaigns'
import { toast } from 'react-toastify'

// ─── Animations ────────────────────────────────────────────────────────────────

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
`

const popIn = keyframes`
  0%   { transform: scale(0.5); opacity: 0; }
  70%  { transform: scale(1.08); }
  100% { transform: scale(1); opacity: 1; }
`

const ringPulse = keyframes`
  0%   { box-shadow: 0 0 0 0 rgba(21, 128, 61, 0.3); }
  70%  { box-shadow: 0 0 0 16px rgba(21, 128, 61, 0); }
  100% { box-shadow: 0 0 0 0 rgba(21, 128, 61, 0); }
`

const spinAnim = keyframes`
  to { transform: rotate(360deg); }
`

const stagger = (delay: number) => css`
  animation: ${fadeUp} 0.4s ${delay}s ease both;
`

// ─── Layout ────────────────────────────────────────────────────────────────────

const Wrap = styled.div`
  font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  padding: 0.5rem 0 1rem;
`

// ─── Success icon ─────────────────────────────────────────────────────────────

const IconRing = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: #f0fdf4;
  border: 0.5px solid #bbf7d0;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: ${popIn} 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both, ${ringPulse} 1.2s 0.5s ease-out;

  svg {
    color: #15803d;
    width: 36px;
    height: 36px;
  }

  @media (prefers-color-scheme: dark) {
    background: #14532d;
    border-color: #16a34a;
    svg { color: #4ade80; }
  }
`

// ─── Header ───────────────────────────────────────────────────────────────────

const Header = styled.div`
  text-align: center;
  ${stagger(0.1)}
`

const Title = styled.h2`
  font-family: 'Syne', 'DM Sans', sans-serif;
  font-size: clamp(1.5rem, 4vw, 2rem);
  font-weight: 800;
  color: #000000;
  margin: 0 0 0.4rem;
  line-height: 1.2;
`

const Subtitle = styled.p`
  font-size: 0.9rem;
  color: #64748b;
  margin: 0;
  max-width: 380px;
  line-height: 1.6;
`

// ─── Summary card ─────────────────────────────────────────────────────────────

const SummaryCard = styled.div`
  width: 100%;
  max-width: 480px;
  background: #f1f5f9;
  border: 0.5px solid #cbd5e1;
  border-radius: 12px;
  overflow: hidden;
  ${stagger(0.15)}
`

const SummaryCardHead = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0.875rem 1.25rem;
  background: #e2e8f0;
  border-bottom: 0.5px solid #cbd5e1;
  font-size: 0.8rem;
  font-weight: 600;
  color: #0f172a;
  letter-spacing: 0.04em;
  text-transform: uppercase;

  svg { width: 14px; height: 14px; color: #0f172a; }
`

const SummaryRows = styled.div`
  padding: 0.375rem 0;
`

const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.65rem 1.25rem;

  & + & {
    border-top: 0.5px solid #cbd5e1;
  }
`

const RowLabel = styled.span`
  font-size: 0.85rem;
  color: #475569;
`

const RowVal = styled.span`
  font-size: 0.875rem;
  font-weight: 600;
  color: #0f172a;
  text-align: right;
  max-width: 60%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

const DraftBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: #e2e8f0;
  color: #0f172a;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 3px 10px;
  border-radius: 100px;
`

// ─── What happens next ────────────────────────────────────────────────────────

const NextStepsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.75rem;
  width: 100%;
  max-width: 480px;
  ${stagger(0.2)}

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`

const NextStepItem = styled.div`
  background: #f1f5f9;
  border: 0.5px solid #cbd5e1;
  border-radius: 10px;
  padding: 0.875rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  @media (max-width: 480px) {
    flex-direction: row;
    align-items: flex-start;
  }
`

const NextStepIcon = styled.div<{ $bg: string; $color: string }>`
  width: 32px;
  height: 32px;
  border-radius: 7px;
  background: ${({ $bg }) => $bg};
  color: ${({ $color }) => $color};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  svg { width: 15px; height: 15px; }
`

const NextStepText = styled.div`
  font-size: 0.78rem;
  color: #475569;
  line-height: 1.45;

  strong {
    display: block;
    color: #0f172a;
    font-weight: 600;
    margin-bottom: 2px;
    font-size: 0.8rem;
  }
`

// ─── Error box ────────────────────────────────────────────────────────────────

const ErrorBox = styled.div`
  width: 100%;
  max-width: 480px;
  display: flex;
  align-items: flex-start;
  gap: 9px;
  padding: 0.875rem 1rem;
  background: #fef2f2;
  border-radius: 8px;
  border: 0.5px solid #fecaca;
  font-size: 0.85rem;
  color: #991b1b;
  line-height: 1.5;
  animation: ${fadeUp} 0.25s ease both;

  svg { width: 15px; height: 15px; flex-shrink: 0; margin-top: 2px; }

  @media (prefers-color-scheme: dark) {
    background: #450a0a;
    border-color: #7f1d1d;
    color: #fca5a5;
  }
`

// ─── Actions ──────────────────────────────────────────────────────────────────

const Actions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
  width: 100%;
  max-width: 480px;
  ${stagger(0.25)}
`

const ActivateBtn = styled.button<{ $loading?: boolean }>`
  width: 100%;
  padding: 0.9rem;
  background: ${({ $loading }) => $loading ? '#94a3b8' : '#15803d'};
  color: #fff;
  border: none;
  border-radius: 8px;
  font-family: 'DM Sans', sans-serif;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: ${({ $loading }) => $loading ? 'not-allowed' : 'pointer'};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: background 0.15s, transform 0.12s;

  svg { width: 17px; height: 17px; }

  &:hover:not(:disabled) { background: #166534; }
  &:active:not(:disabled) { transform: scale(0.99); }
`

const SpinIcon = styled(Loader2)`
  animation: ${spinAnim} 0.8s linear infinite;
`

const DraftBtn = styled.button`
  width: 100%;
  padding: 0.75rem;
  background: transparent;
  color: #64748b;
  border: 0.5px solid #e2e8f0;
  border-radius: 8px;
  font-family: 'DM Sans', sans-serif;
  font-size: 0.875rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  transition: background 0.15s, color 0.15s;

  svg { width: 15px; height: 15px; }

  &:hover { background: #f8fafc; color: #0f172a; }
  &:disabled { opacity: 0.5; cursor: not-allowed; }

  @media (prefers-color-scheme: dark) {
    border-color: #334155;
    &:hover { background: #1e293b; color: #e2e8f0; }
  }
`

const Divider = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: #cbd5e1;
  font-size: 0.75rem;

  &::before, &::after {
    content: '';
    flex: 1;
    height: 0.5px;
    background: #e2e8f0;
  }

  @media (prefers-color-scheme: dark) {
    &::before, &::after { background: #334155; }
  }
`

// ─── Component ────────────────────────────────────────────────────────────────

interface Step7ActivateCampaignProps {
  campaignId: string
  campaignTitle: string
  campaignType: string
  onCompleted: () => void
}

export const Step7ActivateCampaign: React.FC<Step7ActivateCampaignProps> = ({
  campaignId,
  campaignTitle,
  campaignType,
  onCompleted,
}) => {
  const router = useRouter()
  const publishMutation = usePublishCampaign()
  const [isActivating, setIsActivating] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const handleActivate = async () => {
    setIsActivating(true)
    setErrorMsg(null)
    try {
      await publishMutation.mutateAsync(campaignId)
      toast.success('Campaign is now live!')
      onCompleted()
      router.push(`/campaigns/${campaignId}`)
    } catch (error: any) {
      const msg = error.response?.data?.message ?? 'Failed to activate campaign. Please try again.'
      setErrorMsg(msg)
      toast.error(msg)
    } finally {
      setIsActivating(false)
    }
  }

  const handleKeepDraft = () => {
    toast.info('Campaign saved as draft.')
    onCompleted()
    router.push(`/campaigns/${campaignId}`)
  }

  const NEXT_STEPS = [
    {
      icon: Globe,
      iconBg: '#eff6ff',
      iconColor: '#1d4ed8',
      label: 'Goes live',
      desc: 'Visible in feeds and search immediately',
    },
    {
      icon: Rocket,
      iconBg: '#f0fdf4',
      iconColor: '#15803d',
      label: 'Supporters find you',
      desc: 'Donate, share, and follow updates',
    },
    {
      icon: Pause,
      iconBg: '#fef9c3',
      iconColor: '#a16207',
      label: 'Always in control',
      desc: 'Pause or complete anytime from your dashboard',
    },
  ]

  return (
    <Wrap>
      <IconRing>
        <CheckCircle2 />
      </IconRing>

      <Header>
        <Title>Campaign is ready to launch</Title>
        <Subtitle>
          You've finished all the setup. Activate now to start receiving support, or save as a draft
          to review before going live.
        </Subtitle>
      </Header>

      <SummaryCard>
        <SummaryCardHead>
          <FileText /> Campaign details
        </SummaryCardHead>
        <SummaryRows>
          <SummaryRow>
            <RowLabel>Title</RowLabel>
            <RowVal title={campaignTitle}>{campaignTitle}</RowVal>
          </SummaryRow>
          <SummaryRow>
            <RowLabel>Type</RowLabel>
            <RowVal style={{ textTransform: 'capitalize' }}>{campaignType} campaign</RowVal>
          </SummaryRow>
          <SummaryRow>
            <RowLabel>Current status</RowLabel>
            <RowVal>
              <DraftBadge>Draft</DraftBadge>
            </RowVal>
          </SummaryRow>
        </SummaryRows>
      </SummaryCard>

      <NextStepsGrid>
        {NEXT_STEPS.map(({ icon: Icon, iconBg, iconColor, label, desc }) => (
          <NextStepItem key={label}>
            <NextStepIcon $bg={iconBg} $color={iconColor}>
              <Icon />
            </NextStepIcon>
            <NextStepText>
              <strong>{label}</strong>
              {desc}
            </NextStepText>
          </NextStepItem>
        ))}
      </NextStepsGrid>

      {errorMsg && (
        <ErrorBox>
          <AlertCircle />
          <span>{errorMsg}</span>
        </ErrorBox>
      )}

      <Actions>
        <ActivateBtn
          $loading={isActivating}
          disabled={isActivating}
          onClick={handleActivate}
          aria-label="Activate campaign and make it live"
        >
          {isActivating ? (
            <><SpinIcon /> Activating campaign…</>
          ) : (
            <><Rocket /> Activate campaign now</>
          )}
        </ActivateBtn>

        <Divider>or</Divider>

        <DraftBtn onClick={handleKeepDraft} disabled={isActivating} aria-label="Save as draft">
          <FileText /> Save as draft for now
        </DraftBtn>
      </Actions>
    </Wrap>
  )
}

export default Step7ActivateCampaign