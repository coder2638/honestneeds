'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import styled from 'styled-components'
import { CheckCircle, Home, Heart, ArrowRight } from 'lucide-react'
import { useEffect } from 'react'
import { useConversionPixel } from '@/utils/conversionPixel'

interface DonationSuccessModalProps {
  transactionId: string
  amount: number
  campaignId: string
  campaignTitle: string
  isOpen: boolean
  referralCode?: string | null
  onClose?: () => void
}

const Overlay = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
  opacity: ${(props) => (props.isOpen ? 1 : 0)};
  pointer-events: ${(props) => (props.isOpen ? 'auto' : 'none')};
  transition: opacity 0.3s ease;
  padding: 1rem;
`

const Modal = styled.div<{ isOpen: boolean }>`
  background-color: white;
  border-radius: 1rem;
  padding: 2rem;
  max-width: 500px;
  width: 100%;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  transform: ${(props) => (props.isOpen ? 'scale(1)' : 'scale(0.95)')};
  transition: transform 0.3s ease;
  max-height: 90vh;
  overflow-y: auto;

  @media (max-width: 640px) {
    padding: 1.5rem;
    border-radius: 0.75rem;
  }
`

const IconContainer = styled.div`
  text-align: center;
  margin-bottom: 1.5rem;
`

const CheckIcon = styled(CheckCircle)`
  width: 4rem;
  height: 4rem;
  color: #10b981;
  margin: 0 auto;
  animation: scaleIn 0.5s ease;

  @keyframes scaleIn {
    from {
      transform: scale(0.5);
      opacity: 0;
    }
    to {
      transform: scale(1);
      opacity: 1;
    }
  }
`

const Title = styled.h2`
  font-size: 1.875rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 0.5rem 0;
  text-align: center;
  line-height: 1.2;

  @media (max-width: 640px) {
    font-size: 1.5rem;
  }
`

const Subtitle = styled.p`
  font-size: 1rem;
  color: #64748b;
  text-align: center;
  margin: 0 0 2rem 0;
`

const DetailsCard = styled.div`
  background-color: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  padding: 1rem;
  margin-bottom: 1.5rem;
`

const DetailRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid #e2e8f0;

  &:last-child {
    border-bottom: none;
  }
`

const DetailLabel = styled.span`
  color: #64748b;
  font-size: 0.875rem;
  font-weight: 500;
`

const DetailValue = styled.span`
  color: #0f172a;
  font-size: 0.95rem;
  font-weight: 600;
`

const InfoBox = styled.div`
  background-color: #ecf0ff;
  border: 1px solid #c7d2fe;
  border-radius: 0.5rem;
  padding: 1rem;
  margin-bottom: 1.5rem;
  font-size: 0.875rem;
  color: #4f46e5;
  line-height: 1.6;

  strong {
    display: block;
    margin-bottom: 0.5rem;
  }
`

const ButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`

const Button = styled(Link)<{ variant?: 'primary' | 'secondary' }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.875rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.2s ease;
  cursor: pointer;
  border: none;
  font-size: 0.95rem;

  ${(props) => {
    if (props.variant === 'secondary') {
      return `
        background-color: #f1f5f9;
        color: #0f172a;
        border: 2px solid #e2e8f0;

        &:hover {
          background-color: #e2e8f0;
        }
      `
    }

    return `
      background-color: #6366f1;
      color: white;

      &:hover {
        background-color: #4f46e5;
      }
    `
  }};

  &:focus-visible {
    outline: 2px solid #6366f1;
    outline-offset: 2px;
  }

  @media (max-width: 640px) {
    padding: 0.875rem 1rem;
  }
`

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

const formatDate = (timestamp: string) => {
  return new Date(timestamp).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

/**
 * DonationSuccessModal Component
 * Modal displayed after successful donation submission
 */
export function DonationSuccessModal({
  transactionId,
  amount,
  campaignId,
  campaignTitle,
  isOpen,
  referralCode,
}: DonationSuccessModalProps) {
  const router = useRouter()
  const { fireConversionPixel } = useConversionPixel(campaignId, referralCode || '', amount * 100)

  // Fire conversion pixel when modal opens with a referral code
  useEffect(() => {
    if (isOpen && referralCode && fireConversionPixel) {
      console.log('🎯 DonationSuccessModal: Recording conversion pixel', {
        campaignId,
        referralCode,
        amount
      })
      // Fire the conversion pixel programmatically
      fireConversionPixel()
    }
  }, [isOpen, referralCode, campaignId, amount, fireConversionPixel])

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      router.push(`/campaigns/${campaignId}`)
    }
  }

  return (
    <Overlay isOpen={isOpen} onClick={handleOverlayClick} role="presentation">
      <Modal isOpen={isOpen} role="alertdialog" aria-labelledby="success-title" aria-describedby="success-description">
        <IconContainer>
          <CheckIcon aria-hidden="true" />
        </IconContainer>

        <Title id="success-title">🎉 Donation Received!</Title>
        <Subtitle id="success-description">Thank you for your generous support!</Subtitle>

        <DetailsCard>
          <DetailRow>
            <DetailLabel>Transaction ID</DetailLabel>
            <DetailValue>{transactionId}</DetailValue>
          </DetailRow>
          <DetailRow>
            <DetailLabel>Amount</DetailLabel>
            <DetailValue>{formatCurrency(amount)}</DetailValue>
          </DetailRow>
          <DetailRow>
            <DetailLabel>Campaign</DetailLabel>
            <DetailValue>{campaignTitle}</DetailValue>
          </DetailRow>
          <DetailRow>
            <DetailLabel>Date</DetailLabel>
            <DetailValue>{formatDate(new Date().toISOString())}</DetailValue>
          </DetailRow>
        </DetailsCard>

        <InfoBox>
          <strong>What happens next?</strong>
          The creator will review your payment and process it within 24-48 hours. You'll receive an email confirmation
          once verified. You can check your donation status anytime in your donation history.
        </InfoBox>

        <InfoBox style={{ backgroundColor: '#f3e8ff', borderColor: '#e9d5ff', color: '#7e22ce' }}>
          <strong>💜 Want to do more?</strong>
          Consider adding a prayer of encouragement for this campaign. Your prayers complement your generous donation!
        </InfoBox>

        <ButtonGroup>
          <Button href={`/campaigns/${campaignId}`} aria-label={`Return to ${campaignTitle} campaign`}>
            <Heart size={20} />
            View Campaign
          </Button>
          <Button href="/donations" variant="secondary" aria-label="View all your donations">
            View My Donations
            <ArrowRight size={20} />
          </Button>
          <Button href="/campaigns" variant="secondary" aria-label="Browse more campaigns to support">
            <Home size={20} />
            Browse More Campaigns
          </Button>
        </ButtonGroup>
      </Modal>
    </Overlay>
  )
}
