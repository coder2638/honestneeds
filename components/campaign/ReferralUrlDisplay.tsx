/**
 * Referral URL Display Component
 * Shows shareable referral URL with tracking and copy functionality
 */

'use client'

import React, { useState } from 'react'
import styled from 'styled-components'
import { Copy, Check, Share2, ExternalLink } from 'lucide-react'
import Button from '@/components/ui/Button'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1.5rem;
  background: #f9fafb;
  border-radius: 0.75rem;
  border: 1px solid #e5e7eb;
`

const Label = styled.label`
  font-weight: 600;
  color: #111827;
  font-size: 0.9375rem;
  display: block;
  margin-bottom: 0.5rem;
`

const URLContainer = styled.div`
  display: flex;
  gap: 0.75rem;
  align-items: center;
`

const URLInput = styled.input`
  flex: 1;
  padding: 0.75rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-family: 'Monaco', 'Courier New', monospace;
  font-size: 0.875rem;
  background: white;
  color: #111827;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }

  &::selection {
    background-color: rgba(102, 126, 234, 0.2);
  }
`

const CopyButton = styled(Button)<{ copied?: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: ${(props) => (props.copied ? '#10b981' : '#667eea')};
  color: white;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;

  &:hover {
    background: ${(props) => (props.copied ? '#059669' : '#5a67d8')};
  }

  svg {
    width: 1rem;
    height: 1rem;
  }
`

const InfoSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding-top: 0.5rem;
  border-top: 1px solid #d1d5db;
`

const InfoText = styled.p`
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0;
  line-height: 1.5;

  strong {
    color: #111827;
    font-weight: 600;
  }
`

const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 0.75rem;
  margin-top: 1rem;
`

const StatItem = styled.div`
  padding: 0.75rem;
  background: white;
  border-radius: 0.5rem;
  text-align: center;
  border: 1px solid #e5e7eb;
`

const StatValue = styled.div`
  font-size: 1.25rem;
  font-weight: 700;
  color: #667eea;
`

const StatLabel = styled.div`
  font-size: 0.75rem;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-top: 0.25rem;
`

const ActionButtons = styled.div`
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
  margin-top: 0.5rem;
`

const ShareIconButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.625rem 0.875rem;
  border: 1px solid #d1d5db;
  background: white;
  border-radius: 0.5rem;
  cursor: pointer;
  font-size: 0.875rem;
  color: #6b7280;
  transition: all 0.2s;

  &:hover {
    border-color: #667eea;
    color: #667eea;
    background: #f3f4f6;
  }

  svg {
    width: 1rem;
    height: 1rem;
  }
`

interface ReferralUrlDisplayProps {
  campaignId: string
  referralCode: string
  campaignTitle?: string
  rewardAmount?: number
  stats?: {
    clicks?: number
    conversions?: number
    conversionRate?: number
  }
  onCopySuccess?: () => void
}

/**
 * Component to display and manage referral URLs for shares
 */
export const ReferralUrlDisplay: React.FC<ReferralUrlDisplayProps> = ({
  campaignId,
  referralCode,
  campaignTitle = 'Campaign',
  rewardAmount = 0,
  stats,
  onCopySuccess,
}) => {
  const [copied, setCopied] = useState(false)

  // Generate the full referral URL
  const referralUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/campaigns/${campaignId}?ref=${referralCode}`
    : ''

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(referralUrl)
      setCopied(true)
      onCopySuccess?.()
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy URL:', error)
    }
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: campaignTitle,
        text: `Earn $${(rewardAmount / 100).toFixed(2)} for each donation via my referral link`,
        url: referralUrl,
      }).catch(err => console.log('Share cancelled:', err))
    }
  }

  const handleOpenLink = () => {
    window.open(referralUrl, '_blank')
  }

  return (
    <Container>
      <div>
        <Label htmlFor="referral-url">Your Unique Referral Link</Label>
        <URLContainer>
          <URLInput
            id="referral-url"
            type="text"
            value={referralUrl}
            readOnly
            onClick={(e) => e.currentTarget.select()}
          />
          <CopyButton
            copied={copied}
            onClick={handleCopy}
            title={copied ? 'Copied!' : 'Copy to clipboard'}
          >
            {copied ? (
              <>
                <Check size={16} />
                Copied
              </>
            ) : (
              <>
                <Copy size={16} />
                Copy
              </>
            )}
          </CopyButton>
        </URLContainer>
      </div>

      <InfoSection>
        <InfoText>
          <strong>How it works:</strong> Share this link with your friends and network. When they click it and make a donation, you'll earn <strong>${(rewardAmount / 100).toFixed(2)}</strong> as a reward.
        </InfoText>
        <InfoText>
          The <code style={{ background: '#f3f4f6', padding: '0.125rem 0.375rem', borderRadius: '0.25rem' }}>?ref={referralCode}</code> parameter tracks clicks and attributes donations to your share.
        </InfoText>
      </InfoSection>

      {stats && (
        <StatsContainer>
          {typeof stats.clicks === 'number' && (
            <StatItem>
              <StatValue>{stats.clicks}</StatValue>
              <StatLabel>Clicks</StatLabel>
            </StatItem>
          )}
          {typeof stats.conversions === 'number' && (
            <StatItem>
              <StatValue>{stats.conversions}</StatValue>
              <StatLabel>Conversions</StatLabel>
            </StatItem>
          )}
          {typeof stats.conversionRate === 'number' && (
            <StatItem>
              <StatValue>{stats.conversionRate.toFixed(1)}%</StatValue>
              <StatLabel>Conv. Rate</StatLabel>
            </StatItem>
          )}
        </StatsContainer>
      )}

      <ActionButtons>
        <ShareIconButton
          onClick={handleOpenLink}
          title="Open link in new tab"
        >
          <ExternalLink size={16} />
          Preview
        </ShareIconButton>

        {navigator.share && (
          <ShareIconButton
            onClick={handleShare}
            title="Share using device share menu"
          >
            <Share2 size={16} />
            Share
          </ShareIconButton>
        )}
      </ActionButtons>
    </Container>
  )
}

export default ReferralUrlDisplay
