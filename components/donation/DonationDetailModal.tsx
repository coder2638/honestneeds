'use client'

import styled from 'styled-components'
import { useState } from 'react'
import { useDonation } from '@/api/hooks/useDonations'
import { Modal } from '@/components/Modal'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import { DonationStatusBadge, type DonationStatus } from './DonationStatusBadge'

interface DonationDetailModalProps {
  transactionId: string | null
  isOpen: boolean
  onClose: () => void
}

const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;

  @media (max-width: 640px) {
    gap: 0.5rem;
    max-height: 60vh;
    overflow-y: auto;
  }
`

const SectionHeader = styled.h3`
  font-size: 1.125rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e2e8f0;

  &:first-child {
    border-top: none;
    padding-top: 0;
    margin-top: 0;
  }

  @media (max-width: 640px) {
    font-size: 0.8rem;
    margin-top: 0.25rem;
    padding-top: 0.25rem;
    margin-bottom: 0.25rem;
    border-top: none;
  }
`

const FieldRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 0.75rem 0;
  gap: 1rem;

  @media (max-width: 640px) {
    flex-direction: row;
    padding: 0.2rem 0;
    gap: 0.25rem;
    align-items: center;
  }
`

const FieldLabel = styled.span`
  font-size: 0.875rem;
  font-weight: 600;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  min-width: 120px;

  @media (max-width: 640px) {
    font-size: 0.65rem;
    min-width: 60px;
    flex-shrink: 0;
  }
`

const FieldValue = styled.span`
  font-size: 1rem;
  color: #0f172a;
  font-weight: 500;
  word-break: break-word;

  @media (max-width: 640px) {
    font-size: 0.75rem;
  }
`

const AmountContainer = styled.div`
  background-color: #f0f9ff;
  border: 1px solid #bfdbfe;
  border-radius: 8px;
  padding: 1rem;
  margin: 0.5rem 0;

  @media (max-width: 640px) {
    padding: 0.4rem;
    margin: 0.15rem 0;
  }
`

const AmountRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
  font-size: 0.95rem;

  &.total {
    font-weight: 700;
    color: #6366f1;
    border-top: 1px solid #bfdbfe;
    padding-top: 0.75rem;
    margin-top: 0.75rem;
  }

  @media (max-width: 640px) {
    padding: 0.15rem 0;
    font-size: 0.7rem;

    &.total {
      padding-top: 0.25rem;
      margin-top: 0.25rem;
    }
  }
`

const TimelineContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;

  @media (max-width: 640px) {
    gap: 0.25rem;
  }
`

const TimelineItem = styled.div`
  display: flex;
  gap: 1rem;

  &::before {
    content: '';
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background-color: #6366f1;
    flex-shrink: 0;
    margin-top: 0.25rem;
  }

  @media (max-width: 640px) {
    gap: 0.3rem;

    &::before {
      width: 8px;
      height: 8px;
      margin-top: 0.1rem;
    }
  }
`

const TimelineText = styled.div`
  flex: 1;

  .status {
    font-weight: 700;
    color: #0f172a;
    font-size: 0.95rem;
  }

  .timestamp {
    font-size: 0.875rem;
    color: #64748b;
    margin-top: 0.25rem;
  }

  @media (max-width: 640px) {
    .status {
      font-size: 0.65rem;
      margin: 0;
    }

    .timestamp {
      font-size: 0.6rem;
      margin-top: 0.05rem;
    }
  }
`

const ButtonGroup = styled.div`
  display: flex;
  gap: 0.75rem;
  margin-top: 1.5rem;
  justify-content: flex-end;

  @media (max-width: 640px) {
    gap: 0.3rem;
    margin-top: 0.5rem;
    flex-wrap: wrap;
    justify-content: center;
  }
`

const Button = styled.button`
  padding: 0.625rem 1.25rem;
  border-radius: 6px;
  border: none;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.2s ease;

  @media (max-width: 640px) {
    padding: 0.35rem 0.75rem;
    font-size: 0.65rem;
    flex: 1;
    min-width: 70px;
  }

  &.primary {
    background-color: #6366f1;
    color: white;

    &:hover {
      background-color: #4f46e5;
    }

    &:disabled {
      background-color: #cbd5e1;
      cursor: not-allowed;
    }
  }

  &.secondary {
    background-color: transparent;
    color: #6366f1;
    border: 1px solid #6366f1;

    &:hover {
      background-color: #ede9fe;
    }
  }
`

const MaskedMethod = styled.span`
  font-family: 'Courier New', monospace;
  background-color: #f1f5f9;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;

  @media (max-width: 640px) {
    font-size: 0.7rem;
    padding: 0.1rem 0.3rem;
  }
`

export function DonationDetailModal({
  transactionId,
  isOpen,
  onClose,
}: DonationDetailModalProps) {
  const { data: donation, isLoading, error } = useDonation(transactionId || '')
  const [downloading, setDownloading] = useState(false)

  const handleDownloadReceipt = async () => {
    if (!donation) return

    setDownloading(true)
    try {
      // In a real app, this would download from the backend
      // For now, we'll create a simple text-based receipt
      const receiptContent = `
DONATION RECEIPT
================
Transaction ID: ${donation.transactionId}
Date: ${new Date(donation.createdAt).toLocaleDateString()}
Campaign: ${donation.campaignTitle}

Amount: $${(donation.amount / 100).toFixed(2)}
Status: ${donation.status}

Payment Method: ${maskPaymentMethod(donation.paymentMethod)}

Thank you for your donation!
      `.trim()

      const element = document.createElement('a')
      element.setAttribute(
        'href',
        'data:text/plain;charset=utf-8,' + encodeURIComponent(receiptContent)
      )
      element.setAttribute('download', `receipt-${donation.transactionId}.txt`)
      element.style.display = 'none'
      document.body.appendChild(element)
      element.click()
      document.body.removeChild(element)
    } finally {
      setDownloading(false)
    }
  }

  if (!isOpen) {
    return null
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Donation Details">
      {isLoading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
          <LoadingSpinner />
        </div>
      ) : error ? (
        <div
          style={{
            padding: '1.5rem',
            backgroundColor: '#fee2e2',
            borderRadius: '8px',
            color: '#7f1d1d',
          }}
        >
          Failed to load donation details. Please try again.
        </div>
      ) : donation ? (
        <ModalContent>
          <div>
            <SectionHeader>Transaction Information</SectionHeader>
            <FieldRow>
              <FieldLabel>Transaction ID</FieldLabel>
              <FieldValue>{donation.transactionId}</FieldValue>
            </FieldRow>
            <FieldRow>
              <FieldLabel>Status</FieldLabel>
              <div>
                <DonationStatusBadge status={donation.status as DonationStatus} />
              </div>
            </FieldRow>
            <FieldRow>
              <FieldLabel>Date</FieldLabel>
              <FieldValue>
                {new Date(donation.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </FieldValue>
            </FieldRow>
          </div>

          <div>
            <SectionHeader>Campaign</SectionHeader>
            <FieldRow>
              <FieldLabel>Campaign</FieldLabel>
              <FieldValue>{donation.campaignTitle}</FieldValue>
            </FieldRow>
          </div>

          <div>
            <SectionHeader>Amount Details</SectionHeader>
            <AmountContainer>
              <AmountRow>
                <span>Donation Amount:</span>
                <span>${(donation.amount / 100).toFixed(2)}</span>
              </AmountRow>
              <AmountRow>
                <span>Platform Fee (20%):</span>
                <span>${((donation.amount / 100) * 0.2).toFixed(2)}</span>
              </AmountRow>
              <AmountRow className="total">
                <span>Total Amount Charged:</span>
                <span>${(donation.amount / 100).toFixed(2)}</span>
              </AmountRow>
            </AmountContainer>
          </div>

          <div>
            <SectionHeader>Payment Method</SectionHeader>
            <FieldRow>
              <FieldLabel>Method Details</FieldLabel>
              <MaskedMethod>{maskPaymentMethod(donation.paymentMethod)}</MaskedMethod>
            </FieldRow>
          </div>

          <div>
            <SectionHeader>Status History</SectionHeader>
            <TimelineContainer>
              <TimelineItem>
                <TimelineText>
                  <div className="status">Donation Submitted</div>
                  <div className="timestamp">
                    {new Date(donation.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                </TimelineText>
              </TimelineItem>

              {donation.status === 'verified' && (
                <TimelineItem>
                  <TimelineText>
                    <div className="status">Payment Verified</div>
                    <div className="timestamp">
                      {donation.verifiedAt ? new Date(donation.verifiedAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      }) : 'Recently verified'}
                    </div>
                  </TimelineText>
                </TimelineItem>
              )}

              {donation.status === 'rejected' && (
                <TimelineItem>
                  <TimelineText>
                    <div className="status">Payment Rejected</div>
                    <div className="timestamp">
                      {new Date(donation.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                  </TimelineText>
                </TimelineItem>
              )}
            </TimelineContainer>
          </div>

          <ButtonGroup>
            <Button className="secondary" onClick={onClose}>
              Close
            </Button>
            {donation.status === 'verified' && (
              <Button
                className="primary"
                onClick={handleDownloadReceipt}
                disabled={downloading}
              >
                {downloading ? 'Downloading...' : 'Download Receipt'}
              </Button>
            )}
          </ButtonGroup>
        </ModalContent>
      ) : null}
    </Modal>
  )
}

function maskPaymentMethod(method: string | Record<string, any>): string {
  if (!method) return 'N/A'

  // If method is a string, just capitalize it
  if (typeof method === 'string') {
    return method.charAt(0).toUpperCase() + method.slice(1)
  }

  // If method is an object
  const type = method.type || 'unknown'

  switch (type) {
    case 'venmo':
      return `Venmo: ${method.username ? method.username.substring(0, 2) + '***' : '***'}`
    case 'paypal':
      return `PayPal: ${maskEmail(method.email)}`
    case 'cashapp':
      return `Cash App: ${method.cashtag ? method.cashtag.substring(0, 2) + '***' : '***'}`
    case 'bank':
      return `Bank Transfer: ****${method.accountNumber ? method.accountNumber.slice(-4) : '****'}`
    case 'crypto':
      return `Crypto (${method.cryptoType || 'Unknown'}): ${maskAddress(method.walletAddress)}`
    default:
      return `${type.charAt(0).toUpperCase() + type.slice(1)}: ****`
  }
}

function maskEmail(email: string): string {
  if (!email) return '***'
  const [local, domain] = email.split('@')
  return `${local.substring(0, 2)}***@${domain}`
}

function maskAddress(address: string): string {
  if (!address || address.length < 8) return '***'
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`
}
