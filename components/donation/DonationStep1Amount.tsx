'use client'

import { useMemo, useRef, useImperativeHandle, forwardRef } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import styled from 'styled-components'
import { donationAmountSchema, type DonationAmountFormData } from '@/utils/validationSchemas'
import { FeeBreakdown } from './FeeBreakdown'

interface Step1AmountProps {
  initialAmount?: number
  onNext: (amount: number) => void
  isLoading?: boolean
}

export interface Step1AmountRef {
  submitForm: () => void
}

const Container = styled.div`
  width: 100%;
  max-width: 600px;
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
  margin: 0 0 2rem 0;
`

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`

const Label = styled.label`
  display: block;
  font-weight: 600;
  color: #0f172a;
  margin-bottom: 0.5rem;
  font-size: 0.95rem;

  span {
    color: #ef4444;
    margin-left: 0.25rem;
  }
`

const InputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`

const CurrencySymbol = styled.span`
  position: absolute;
  left: 1rem;
  font-weight: 600;
  font-size: 1.125rem;
  color: #0f172a;
  pointer-events: none;
`

const Input = styled.input<{ error?: boolean }>`
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  font-size: 1.125rem;
  border: 2px solid ${(props) => (props.error ? '#ef4444' : '#e2e8f0')};
  border-radius: 0.5rem;
  transition: all 0.2s ease;
  font-weight: 600;

  &:focus {
    outline: none;
    border-color: #6366f1;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
  }

  &:disabled {
    background-color: #f1f5f9;
    color: #94a3b8;
    cursor: not-allowed;
  }

  @media (max-width: 640px) {
    font-size: 1rem;
  }
`

const ErrorMessage = styled.span`
  display: block;
  color: #ef4444;
  font-size: 0.8125rem;
  margin-top: 0.375rem;
  font-weight: 500;
`

const PresetButtons = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
  gap: 0.75rem;
  margin-top: 1rem;
`

const PresetButton = styled.button<{ selected?: boolean }>`
  padding: 0.5rem;
  border: 2px solid ${(props) => (props.selected ? '#6366f1' : '#e2e8f0')};
  background-color: ${(props) => (props.selected ? '#ecf0ff' : '#ffffff')};
  color: ${(props) => (props.selected ? '#6366f1' : '#64748b')};
  border-radius: 0.375rem;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: #6366f1;
    background-color: #ecf0ff;
  }

  &:focus-visible {
    outline: 2px solid #6366f1;
    outline-offset: 2px;
  }
`

const Info = styled.div`
  display: flex;
  gap: 0.75rem;
  padding: 1rem;
  background-color: #f0fdf4;
  border: 1px solid #dcfce7;
  border-radius: 0.5rem;
  margin-top: 1.5rem;
  font-size: 0.875rem;
  color: #166534;
  line-height: 1.5;
`

const InfoIcon = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.25rem;
  height: 1.25rem;
  background-color: #10b981;
  color: white;
  border-radius: 50%;
  flex-shrink: 0;
  font-weight: 700;
  font-size: 0.75rem;
`

/**
 * DonationStep1Amount Component
 * First step of donation wizard: amount selection with fee calculation
 * Exposed methods allow parent to request form submission
 */
export const DonationStep1Amount = forwardRef<Step1AmountRef, Step1AmountProps>(
  function DonationStep1AmountComponent(
    {
      initialAmount = 25,
      onNext,
      isLoading = false,
    }: Step1AmountProps,
    ref
  ) {
    const formRef = useRef<HTMLFormElement>(null)
    const {
      register,
      formState: { errors },
      watch,
      setValue,
      handleSubmit,
    } = useForm<DonationAmountFormData>({
      resolver: zodResolver(donationAmountSchema),
      defaultValues: {
        amount: initialAmount,
      },
      mode: 'onChange',
    })

    // Expose submitForm method to parent via ref
    useImperativeHandle(ref, () => ({
      submitForm: () => {
        if (formRef.current) {
          formRef.current.requestSubmit()
        }
      },
    }), [])

    const amount = watch('amount')

    const presetAmounts = [10, 25, 50, 100, 250, 500]

    const calculateFee = (value: number) => {
      return Number((value * 0.2).toFixed(2))
    }

    const feeInfo = useMemo(() => {
      if (!amount) {
        return { gross: 0, fee: 0, net: 0 }
      }
      const gross = amount
      const fee = calculateFee(amount)
      const net = Number((amount - fee).toFixed(2))
      return { gross, fee, net }
    }, [amount])

    const onSubmit = (data: DonationAmountFormData) => {
      onNext(data.amount)
    }

    const handlePresetClick = (preset: number) => {
      setValue('amount', preset, { shouldValidate: true })
    }

    return (
      <Container as="form" ref={formRef} onSubmit={handleSubmit(onSubmit)}>
      <Title>How much would you like to donate?</Title>
      <Subtitle>
        Choose an amount that works for you. We'll calculate the platform fee so you know exactly how much reaches the
        creator.
      </Subtitle>

      <FormGroup>
        <Label htmlFor="donation-amount">
          Donation Amount
          <span aria-label="required">*</span>
        </Label>

        <InputWrapper>
          <CurrencySymbol>$</CurrencySymbol>
          <Input
            id="donation-amount"
            type="number"
            step="0.01"
            min="1"
            max="10000"
            placeholder="25.00"
            error={!!errors.amount}
            disabled={isLoading}
            {...register('amount', {
              valueAsNumber: true,
            })}
            aria-describedby={errors.amount ? 'amount-error' : undefined}
          />
        </InputWrapper>

        {errors.amount && (
          <ErrorMessage id="amount-error" role="alert">
            {errors.amount.message}
          </ErrorMessage>
        )}

        <PresetButtons>
          {presetAmounts.map((preset) => (
            <PresetButton
              key={preset}
              type="button"
              selected={amount === preset}
              onClick={() => handlePresetClick(preset)}
              disabled={isLoading}
            >
              ${preset}
            </PresetButton>
          ))}
        </PresetButtons>
      </FormGroup>

      {amount > 0 && <FeeBreakdown grossAmount={amount} />}

      <Info >
        <InfoIcon>ℹ️</InfoIcon>
        <div>
          <strong>Platform fee transparency:</strong> We charge 20% to maintain secure payments, prevent fraud, and
          support the platform. Your contribution helps creators directly.
        </div>
      </Info>

      {/* Hidden submit button - triggered by clicking Next in parent component */}
      <input type="submit" hidden aria-hidden="true" />
    </Container>
    )
  }
)
