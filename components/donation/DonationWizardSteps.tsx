'use client'

import { ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react'
import styled from 'styled-components'

interface StepIndicatorProps {
  currentStep: number
  totalSteps: number
}

interface WizardActionsProps {
  currentStep: number
  totalSteps: number
  canGoBack?: boolean
  canContinue?: boolean
  onBack?: () => void
  onNext?: () => void
  onPublish?: () => void
  isSubmitting?: boolean
  publishLabel?: string
}

const StepContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-bottom: 2rem;
  gap: 1rem;

  @media (max-width: 640px) {
    margin-bottom: 1.5rem;
  }
`

const StepItem = styled.div<{ active: boolean; completed: boolean }>`
  display: flex;
  align-items: center;
  flex: 1;

  @media (max-width: 640px) {
    flex-direction: column;
  }
`

const StepCircle = styled.div<{ active: boolean; completed: boolean }>`
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.875rem;
  transition: all 0.3s ease;
  flex-shrink: 0;

  ${(props) => {
    if (props.completed) {
      return `
        background-color: #10b981;
        color: white;
        border: 2px solid #10b981;
      `
    }
    if (props.active) {
      return `
        background-color: #6366f1;
        color: white;
        border: 2px solid #6366f1;
        box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1);
      `
    }
    return `
      background-color: #f1f5f9;
      color: #64748b;
      border: 2px solid #e2e8f0;
    `
  }};

  @media (max-width: 640px) {
    width: 2rem;
    height: 2rem;
    font-size: 0.75rem;
  }
`

const StepLabel = styled.span<{ active: boolean; completed: boolean }>`
  margin-left: 0.75rem;
  font-weight: 500;
  color: ${(props) => (props.active || props.completed ? '#0f172a' : '#64748b')};
  white-space: nowrap;

  @media (max-width: 640px) {
    margin-left: 0;
    margin-top: 0.25rem;
    font-size: 0.75rem;
    text-align: center;
  }
`

const Connector = styled.div<{ completed: boolean }>`
  flex: 1;
  height: 2px;
  background-color: ${(props) => (props.completed ? '#10b981' : '#e2e8f0')};
  margin: 0 0.5rem;
  transition: background-color 0.3s ease;

  @media (max-width: 640px) {
    display: none;
  }
`

const ActionsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-top: 2rem;
  gap: 1rem;

  @media (max-width: 640px) {
    flex-direction: column-reverse;
    margin-top: 1.5rem;
  }
`

const Button = styled.button<{ variant?: 'primary' | 'secondary' | 'ghost'; disabled?: boolean }>`
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  border: none;
  font-size: 1rem;

  ${(props) => {
    const { variant, disabled } = props
    const baseStyles = disabled ? 'opacity: 0.5; cursor: not-allowed;' : ''

    if (variant === 'secondary') {
      return `
        background-color: #f1f5f9;
        color: #0f172a;
        border: 2px solid #e2e8f0;
        ${baseStyles}
        
        &:hover:not(:disabled) {
          background-color: #e2e8f0;
        }
      `
    }

    if (variant === 'ghost') {
      return `
        background-color: transparent;
        color: #6366f1;
        ${baseStyles}
        
        &:hover:not(:disabled) {
          background-color: rgba(99, 102, 241, 0.1);
        }
      `
    }

    // Primary variant (default)
    return `
      background-color: #6366f1;
      color: white;
      ${baseStyles}
      
      &:hover:not(:disabled) {
        background-color: #4f46e5;
      }
    `
  }};

  &:focus-visible {
    outline: 2px solid #6366f1;
    outline-offset: 2px;
  }

  @media (max-width: 640px) {
    width: 100%;
    padding: 0.875rem 1rem;
  }
`

/**
 * StepIndicator Component
 * Displays progress through donation wizard steps
 */
export function StepIndicator({ currentStep, totalSteps }: StepIndicatorProps) {
  const steps = Array.from({ length: totalSteps }, (_, i) => i + 1)

  return (
    <StepContainer role="progressbar" aria-valuenow={currentStep} aria-valuemin={1} aria-valuemax={totalSteps}>
      {steps.map((step, index) => (
        <StepItem key={step} active={step === currentStep} completed={step < currentStep}>
          <StepCircle active={step === currentStep} completed={step < currentStep}>
            {step < currentStep ? <CheckCircle size={20} /> : step}
          </StepCircle>
          <StepLabel active={step === currentStep} completed={step < currentStep}>
            {step === 1 ? 'Amount' : step === 2 ? 'Payment' : 'Confirm'}
          </StepLabel>
          {index < steps.length - 1 && <Connector completed={step < currentStep} />}
        </StepItem>
      ))}
    </StepContainer>
  )
}

/**
 * WizardActions Component
 * Displays navigation buttons for the wizard
 */
export function WizardActions({
  currentStep,
  totalSteps,
  canGoBack = true,
  canContinue = true,
  onBack,
  onNext,
  onPublish,
  isSubmitting = false,
  publishLabel = 'Confirm Donation',
}: WizardActionsProps) {
  const isLastStep = currentStep === totalSteps
  const isFirstStep = currentStep === 1

  return (
    <ActionsContainer>
      <Button
        variant="secondary"
        onClick={onBack}
        disabled={isFirstStep || !canGoBack || isSubmitting}
        aria-label="Go to previous step"
      >
        <ArrowLeft size={20} />
        Back
      </Button>

      {!isLastStep ? (
        <Button
          onClick={onNext}
          disabled={!canContinue || isSubmitting}
          aria-label={`Go to step ${currentStep + 1}`}
        >
          Next
          <ArrowRight size={20} />
        </Button>
      ) : (
        <Button
          onClick={onPublish}
          disabled={!canContinue || isSubmitting}
          aria-label="Confirm and submit donation"
        >
          {isSubmitting ? 'Processing...' : publishLabel}
        </Button>
      )}
    </ActionsContainer>
  )
}
