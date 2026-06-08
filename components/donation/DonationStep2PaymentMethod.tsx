'use client'

import { useState } from 'react'
import styled from 'styled-components'
import { AlertCircle, ExternalLink } from 'lucide-react'
import { PaymentDirectory } from '@/components/campaign/PaymentDirectory'

interface Step2PaymentMethodProps {
  paymentMethods: Array<{
    type: string
    [key: string]: any
  }>
  creatorName: string
  amount: number
  onNext: (selectedMethod: any) => void
  isLoading?: boolean
}

const Container = styled.div`
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
`

const Title = styled.h2`
  font-size: 1.875rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 0.5rem 0;

  @media (max-width: 640px) {
    font-size: 1.5rem;
  }
`

const Subtitle = styled.p`
  font-size: 0.95rem;
  color: #64748b;
  margin: 0 0 1.5rem 0;
  line-height: 1.6;
`

const SecurityNote = styled.div`
  display: flex;
  gap: 0.75rem;
  padding: 0.875rem;
  background-color: #dbeafe;
  border: 1px solid #0284c7;
  border-radius: 0.5rem;
  margin-bottom: 2rem;
  font-size: 0.85rem;
  color: #0c4a6e;
  line-height: 1.5;
  align-items: flex-start;

  svg {
    flex-shrink: 0;
    margin-top: 0.125rem;
  }
`

const AmountHighlight = styled.div`
  background-color: #ecf0ff;
  border: 2px solid #6366f1;
  border-radius: 0.5rem;
  padding: 1rem;
  margin-bottom: 2rem;
  text-align: center;
`

const AmountLabel = styled.div`
  font-size: 0.85rem;
  color: #64748b;
  margin-bottom: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-weight: 600;
`

const AmountValue = styled.div`
  font-size: 2.125rem;
  font-weight: 700;
  color: #6366f1;
  font-family: 'Courier New', monospace;
`

const ContinueButton = styled.button`
  width: 100%;
  padding: 1rem;
  background-color: #6366f1;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 2rem;

  &:hover:not(:disabled) {
    background-color: #4f46e5;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &:focus-visible {
    outline: 2px solid #6366f1;
    outline-offset: 2px;
  }
`

/**
 * DonationStep2PaymentMethod Component (REDESIGNED)
 * 
 * FIX #1: Reverse Payment Flow
 * 
 * BEFORE (WRONG): Asked supporter to enter THEIR payment method details
 * AFTER (CORRECT): Displays CREATOR's payment methods for supporter to send money to
 * 
 * This step shows the creator's payment directory and allows supporter to:
 * 1. View available payment methods
 * 2. Select their preferred method
 * 3. See instructions for sending payment
 * 4. Get QR codes where applicable
 */
export function DonationStep2PaymentMethod({
  paymentMethods,
  creatorName,
  amount,
  onNext,
  isLoading = false,
}: Step2PaymentMethodProps) {
  const [selectedMethod, setSelectedMethod] = useState<any | null>(null)

  const handleMethodSelect = (method: any) => {
    setSelectedMethod(method)
    // Auto-proceed when method selected (can click "Mark as Paid" in next step)
    onNext(method)
  }

  return (
    <Container>
      <Title>💳 Choose How to Support</Title>
      <Subtitle>
        {creatorName} is ready to receive your support. Select your preferred payment method below and follow the
        instructions to send your donation.
      </Subtitle>

      <AmountHighlight>
        <AmountLabel>Your Donation Amount</AmountLabel>
        <AmountValue>${typeof amount === 'number' ? amount.toFixed(2) : '0.00'}</AmountValue>
      </AmountHighlight>

      <SecurityNote>
        <AlertCircle size={18} />
        <div>
          <strong>Safe & Transparent:</strong> You'll send payment directly to {creatorName} outside our app. After
          you've sent the payment, return here and mark it complete so {creatorName} knows to expect it.
        </div>
      </SecurityNote>

      <PaymentDirectory
        paymentMethods={paymentMethods}
        creatorName={creatorName}
        onMethodSelect={handleMethodSelect}
      />

      <ContinueButton disabled={isLoading || !selectedMethod} aria-label="Continue to confirmation">
        {isLoading ? 'Loading...' : selectedMethod ? 'Payment Method Selected ✓' : 'Select a payment method'}
      </ContinueButton>
    </Container>
  )
}
