'use client'

import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Modal } from '@/components/Modal'
import { Button } from '@/components/Button'
import { FormField } from '@/components/FormField'
import { Badge } from '@/components/Badge'
import { claimPrizeSchema, type ClaimPrizeFormData } from '@/utils/validationSchemas'
import { currencyUtils } from '@/utils/validationSchemas'
import { useClaimPrize } from '@/api/hooks/useSweepstakes'
import type { Winnings } from '@/api/services/sweepstakesService'

/**
 * Claim Prize Modal
 * Allows user to select payment method and claim a prize
 */

const Form = styled.form`
  padding: 24px;
`

const Section = styled.div`
  margin-bottom: 24px;
`

const SectionTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 16px 0;
  color: #111827;
`

const MethodGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 12px;
`

const MethodButton = styled.button<{ selected: boolean }>`
  border: 2px solid ${(props) => (props.selected ? '#6366f1' : '#e5e7eb')};
  border-radius: 8px;
  padding: 12px;
  background: ${(props) => (props.selected ? '#eef2ff' : '#f9fafb')};
  cursor: pointer;
  transition: all 0.2s;
  font-size: 13px;
  font-weight: 500;

  &:hover {
    border-color: #6366f1;
    background: #eef2ff;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`

const DetailBox = styled.div`
  background: #f3f4f6;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
`

const DetailLabel = styled.p`
  font-size: 12px;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  margin: 0 0 8px 0;
`

const DetailValue = styled.p`
  font-size: 16px;
  font-weight: 500;
  margin: 0;
  color: #111827;
`

const ConfirmationBox = styled.div`
  background: #ecfdf5;
  border: 1px solid #86efac;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 24px;
`

const ConfirmationText = styled.p`
  font-size: 14px;
  color: #166534;
  margin: 0;
  line-height: 1.6;
`

const Actions = styled.div`
  display: flex;
  gap: 12px;

  @media (max-width: 480px) {
    flex-direction: column;
  }
`

const StyledSelect = styled.select`
  padding: 8px 12px;
  font-size: 14px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  background-color: white;
  color: #111827;
  cursor: pointer;
  transition: all 0.2s;
  font-family: inherit;

  &:hover {
    border-color: #6366f1;
  }

  &:focus {
    outline: none;
    border-color: #6366f1;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`

const SelectWrapper = styled.div`
  margin-bottom: 24px;
`

const SelectLabel = styled.label`
  font-size: 12px;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  display: block;
  margin-bottom: 8px;
`

interface ClaimPrizeModalProps {
  winning: Winnings
  open: boolean
  onClose: () => void
}

type PaymentMethodType = 'venmo' | 'paypal' | 'cashapp' | 'bank' | 'crypto' | 'other'

const PAYMENT_METHOD_LABELS: Record<PaymentMethodType, string> = {
  venmo: 'Venmo',
  paypal: 'PayPal',
  cashapp: 'Cash App',
  bank: 'Bank Transfer',
  crypto: 'Cryptocurrency',
  other: 'Other',
}

export function ClaimPrizeModal({
  winning,
  open,
  onClose,
}: ClaimPrizeModalProps) {
  console.log('🏆 [ClaimPrizeModal] Rendering with winning:', winning)
  
  const { mutate: claimPrize, isPending } = useClaimPrize()
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethodType>('venmo')
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    setValue,
  } = useForm<ClaimPrizeFormData>({
    resolver: zodResolver(claimPrizeSchema),
    mode: 'onChange',
    defaultValues: {
      paymentMethod: {
        type: 'venmo',
      } as any,
    },
  })
  
  // Log form state changes
  useEffect(() => {
    console.log('🏆 [ClaimPrizeModal] Form validation state:', {
      isValid,
      errors: errors,
      drawingId: watch('drawingId'),
      paymentType: watch('paymentMethod.type'),
    })
  }, [isValid, errors, watch])

  const paymentType = watch('paymentMethod.type') as PaymentMethodType | undefined

  // Update payment method type when selected method changes
  useEffect(() => {
    console.log('🏆 [ClaimPrizeModal] Payment method changed to:', selectedMethod)
    // Reset payment method fields to clear old values from previous selection
    const resetData: any = { type: selectedMethod }
    switch (selectedMethod) {
      case 'venmo':
        resetData.username = ''
        break
      case 'paypal':
        resetData.email = ''
        break
      case 'cashapp':
        resetData.cashtag = ''
        break
      case 'bank':
        resetData.routingNumber = ''
        resetData.accountNumber = ''
        break
      case 'crypto':
        resetData.walletAddress = ''
        resetData.cryptoType = ''
        break
      case 'other':
        resetData.details = ''
        break
    }
    setValue('paymentMethod' as any, resetData)
  }, [selectedMethod, setValue])

  const onSubmit = (data: ClaimPrizeFormData) => {
    console.log('🏆 [ClaimPrizeModal onSubmit] CALLED - Form data:', data)
    console.log('🏆 [ClaimPrizeModal onSubmit] Payment method type:', data.paymentMethod.type)
    console.log('🏆 [ClaimPrizeModal onSubmit] Winning ID:', winning.id)
    claimPrize(
      {
        winningId: winning.id,
        paymentMethod: data.paymentMethod,
      },
      {
        onSuccess: () => {
          console.log('🏆 [ClaimPrizeModal] Prize claim successful, closing modal')
          onClose()
        },
      }
    )
  }
  
  const handleFormSubmit = handleSubmit(onSubmit, (errors) => {
    console.error('🏆 [ClaimPrizeModal handleFormSubmit] Validation FAILED:', errors)
  })

  // Type-safe error accessor for discriminated union
  const getPaymentError = (field: string | undefined): string | undefined => {
    if (!field) return undefined
    const paymentErrors = errors.paymentMethod
    if (!paymentErrors || typeof paymentErrors === 'string') return undefined
    if ('message' in paymentErrors) return paymentErrors.message
    return (paymentErrors as any)?.[field]?.message
  }

  return (
    <Modal
      isOpen={open}
      onClose={onClose}
      title={`Claim ${currencyUtils.formatCurrency(winning.prize)}`}
    >
      <Form onSubmit={handleFormSubmit}>
        <Section>
          <SectionTitle>Prize Details</SectionTitle>
          <DetailBox>
            <DetailLabel>Amount</DetailLabel>
            <DetailValue>{currencyUtils.formatCurrency(winning.prize)}</DetailValue>
          </DetailBox>
        </Section>

        <Section>
          <SectionTitle>Select Payment Method</SectionTitle>
          <MethodGrid>
            {Object.entries(PAYMENT_METHOD_LABELS).map(([method, label]) => (
              <MethodButton
                key={method}
                type="button"
                selected={selectedMethod === method}
                onClick={() => setSelectedMethod(method as PaymentMethodType)}
              >
                {label}
              </MethodButton>
            ))}
          </MethodGrid>
        </Section>

        {/* Payment Method Fields - Rendered based on selection */}
        {selectedMethod === 'venmo' && (
          <Section>
            <SectionTitle>Venmo Details</SectionTitle>
            <FormField
              label="Venmo Username"
              placeholder="@username"
              {...register('paymentMethod.username')}
              error={getPaymentError('username')}
              helperText="Your Venmo @ username"
            />
          </Section>
        )}

        {selectedMethod === 'paypal' && (
          <Section>
            <SectionTitle>PayPal Details</SectionTitle>
            <FormField
              label="PayPal Email"
              type="email"
              placeholder="you@example.com"
              {...register('paymentMethod.email')}
              error={getPaymentError('email')}
              helperText="Your PayPal account email"
            />
          </Section>
        )}

        {selectedMethod === 'cashapp' && (
          <Section>
            <SectionTitle>Cash App Details</SectionTitle>
            <FormField
              label="Cash App Tag"
              placeholder="$cashtag"
              {...register('paymentMethod.cashtag')}
              error={getPaymentError('cashtag')}
              helperText="Your Cash App $ tag"
            />
          </Section>
        )}

        {selectedMethod === 'bank' && (
          <Section>
            <SectionTitle>Bank Transfer Details</SectionTitle>
            <FormField
              label="Routing Number"
              placeholder="123456789"
              {...register('paymentMethod.routingNumber')}
              error={getPaymentError('routingNumber')}
              helperText="9-digit routing number"
            />
            <FormField
              label="Account Number"
              placeholder="1234567890"
              {...register('paymentMethod.accountNumber')}
              error={getPaymentError('accountNumber')}
              helperText="9-17 digit account number"
            />
          </Section>
        )}

        {selectedMethod === 'crypto' && (
          <Section>
            <SectionTitle>Cryptocurrency Details</SectionTitle>
            <FormField
              label="Wallet Address"
              placeholder="1A1z7agoat..."
              {...register('paymentMethod.walletAddress')}
              error={getPaymentError('walletAddress')}
              helperText="Your crypto wallet address"
            />
            <SelectWrapper>
              <SelectLabel>Crypto Type</SelectLabel>
              <StyledSelect {...register('paymentMethod.cryptoType')}>
                <option value="">Select a cryptocurrency</option>
                <option value="bitcoin">Bitcoin (BTC)</option>
                <option value="ethereum">Ethereum (ETH)</option>
                <option value="usdc">USDC</option>
                <option value="other">Other</option>
              </StyledSelect>
              {getPaymentError('cryptoType') && (
                <div style={{ color: '#dc2626', fontSize: '12px', marginTop: '4px' }}>
                  {getPaymentError('cryptoType')}
                </div>
              )}
            </SelectWrapper>
          </Section>
        )}

        {selectedMethod === 'other' && (
          <Section>
            <SectionTitle>Payment Details</SectionTitle>
            <FormField
              label="Payment Method Details"
              placeholder="Enter your payment method details..."
              {...register('paymentMethod.details')}
              error={getPaymentError('details')}
              helperText="Provide any details needed for this payment method"
            />
          </Section>
        )}

        <ConfirmationBox>
          <ConfirmationText>
            ✓ By claiming, you confirm that the payment method above is correct and you
            are authorized to receive funds to this account.
          </ConfirmationText>
        </ConfirmationBox>

        <Actions>
          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={isPending}
            fullWidth
            onClick={() => console.log('🏆 [ClaimPrizeModal Button] CLICKED')}
          >
            {isPending ? 'Processing...' : `Claim ${currencyUtils.formatCurrency(winning.prize)}`}
          </Button>
          <Button type="button" variant="ghost" size="lg" onClick={onClose} disabled={isPending}>
            Cancel
          </Button>
        </Actions>
      </Form>
    </Modal>
  )
}
