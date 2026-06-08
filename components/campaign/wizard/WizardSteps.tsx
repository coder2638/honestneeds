'use client'

import React from 'react'
import styled, { keyframes, css } from 'styled-components'
import { ChevronLeft, ChevronRight, Check, Loader2 } from 'lucide-react'

// ─── Animations ────────────────────────────────────────────────────────────────

const checkPop = keyframes`
  0%   { transform: scale(0.5); opacity: 0; }
  70%  { transform: scale(1.15); }
  100% { transform: scale(1); opacity: 1; }
`

const spinAnim = keyframes`
  to { transform: rotate(360deg); }
`

// ─────────────────────────────────────────────────────────────────────────────
// STEP INDICATOR
// ─────────────────────────────────────────────────────────────────────────────

const IndicatorWrap = styled.nav`
  font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif;
  width: 100%;
  margin-bottom: 2.5rem;

  @media (max-width: 640px) {
    margin-bottom: 1.75rem;
  }
`

// ── Mobile: thin progress bar + label ────────────────────────────────────────

const MobileProgress = styled.div`
  display: none;

  @media (max-width: 640px) {
    display: flex;
    flex-direction: column;
    gap: 0.6rem;
  }
`

const MobileProgressBar = styled.div`
  width: 100%;
  height: 3px;
  background: #e2e8f0;
  border-radius: 100px;
  overflow: hidden;

  @media (prefers-color-scheme: dark) { background: #334155; }
`

const MobileProgressFill = styled.div<{ $pct: number }>`
  height: 100%;
  width: ${({ $pct }) => $pct}%;
  background: #1d4ed8;
  border-radius: 100px;
  transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1);
`

const MobileProgressMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const MobileStepLabel = styled.div`
  font-size: 0.85rem;
  font-weight: 500;
  color: #0f172a;

  @media (prefers-color-scheme: dark) { color: #f1f5f9; }
`

const MobileStepCount = styled.div`
  font-size: 0.78rem;
  color: #94a3b8;
  font-variant-numeric: tabular-nums;
`

// ── Desktop: full step row ────────────────────────────────────────────────────

const DesktopRow = styled.ol`
  display: flex;
  align-items: center;
  list-style: none;
  padding: 0;
  margin: 0;
  gap: 0;

  @media (max-width: 640px) { display: none; }
`

interface StepItemProps { $active: boolean; $completed: boolean }

const StepItemEl = styled.li<StepItemProps>`
  display: flex;
  align-items: center;
  flex: 1;
  min-width: 0;

  /* connector line after each item except last */
  &:not(:last-child) {
    &::after {
      content: '';
      flex: 1;
      height: 1.5px;
      background: ${({ $completed }) => $completed ? '#1d4ed8' : '#e2e8f0'};
      transition: background 0.3s;
      margin: 0 6px;

      @media (prefers-color-scheme: dark) {
        background: ${({ $completed }) => $completed ? '#3b82f6' : '#334155'};
      }
    }
  }
`

const StepInner = styled.div`
  display: flex;
  align-items: center;
  gap: 7px;
  flex-shrink: 0;
`

interface BadgeProps { $active: boolean; $completed: boolean }

const Badge = styled.div<BadgeProps>`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 600;
  flex-shrink: 0;
  transition: background 0.2s, border-color 0.2s;
  border: 1.5px solid transparent;

  ${({ $active, $completed }) => {
    if ($completed) return css`
      background: #1d4ed8;
      color: #fff;
      border-color: #1d4ed8;

      svg { animation: ${checkPop} 0.3s ease both; }
    `
    if ($active) return css`
      background: #fff;
      color: #1d4ed8;
      border-color: #1d4ed8;
      box-shadow: 0 0 0 3px #dbeafe;
    `
    return css`
      background: #f8fafc;
      color: #94a3b8;
      border-color: #e2e8f0;
    `
  }}

  svg { width: 13px; height: 13px; }

  @media (prefers-color-scheme: dark) {
    ${({ $active, $completed }) => {
      if ($completed) return css`background: #1d4ed8; border-color: #1d4ed8;`
      if ($active) return css`background: #0f172a; border-color: #3b82f6; box-shadow: 0 0 0 3px #1e3a8a;`
      return css`background: #1e293b; border-color: #334155; color: #64748b;`
    }}
  }
`

interface LabelProps { $active: boolean }

const StepLabel = styled.span<LabelProps>`
  font-size: 0.78rem;
  font-weight: ${({ $active }) => $active ? '500' : '400'};
  color: ${({ $active }) => $active ? '#0f172a' : '#94a3b8'};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 80px;
  transition: color 0.2s;

  @media (max-width: 900px) { display: none; }

  @media (prefers-color-scheme: dark) {
    color: ${({ $active }) => $active ? '#f1f5f9' : '#64748b'};
  }
`

// ─── Component ────────────────────────────────────────────────────────────────

interface StepIndicatorProps {
  currentStep: number
  totalSteps: number
  stepLabels: string[]
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({
  currentStep,
  totalSteps,
  stepLabels,
}) => {
  const pct = Math.round(((currentStep - 1) / (totalSteps - 1)) * 100)
  const currentLabel = stepLabels[currentStep - 1] ?? `Step ${currentStep}`

  return (
    <IndicatorWrap aria-label="Campaign creation progress">
      {/* Mobile view */}
      <MobileProgress>
        <MobileProgressBar role="progressbar" aria-valuenow={currentStep} aria-valuemin={1} aria-valuemax={totalSteps} aria-label={currentLabel}>
          <MobileProgressFill $pct={pct} />
        </MobileProgressBar>
        <MobileProgressMeta>
          <MobileStepLabel>{currentLabel}</MobileStepLabel>
          <MobileStepCount>{currentStep} / {totalSteps}</MobileStepCount>
        </MobileProgressMeta>
      </MobileProgress>

      {/* Desktop view */}
      <DesktopRow>
        {Array.from({ length: totalSteps }, (_, i) => {
          const n = i + 1
          const isActive = n === currentStep
          const isCompleted = n < currentStep
          return (
            <StepItemEl key={n} $active={isActive} $completed={isCompleted}>
              <StepInner>
                <Badge $active={isActive} $completed={isCompleted} aria-label={isCompleted ? `${stepLabels[i]} completed` : isActive ? `${stepLabels[i]} current` : stepLabels[i]}>
                  {isCompleted ? <Check /> : n}
                </Badge>
                <StepLabel $active={isActive}>{stepLabels[i]}</StepLabel>
              </StepInner>
            </StepItemEl>
          )
        })}
      </DesktopRow>
    </IndicatorWrap>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// WIZARD ACTIONS
// ─────────────────────────────────────────────────────────────────────────────

const ActionsBar = styled.div`
  font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  margin-top: 2.5rem;
  padding-top: 1.5rem;
  border-top: 0.5px solid #e2e8f0;

  @media (prefers-color-scheme: dark) { border-color: #334155; }

  @media (max-width: 480px) {
    flex-direction: column-reverse;
    gap: 0.625rem;
  }
`

const BackBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 0.7rem 1.1rem;
  background: transparent;
  color: #64748b;
  border: 0.5px solid #e2e8f0;
  border-radius: 8px;
  font-family: 'DM Sans', sans-serif;
  font-size: 0.875rem;
  font-weight: 400;
  cursor: pointer;
  transition: background 0.15s, color 0.15s, border-color 0.15s;
  white-space: nowrap;

  svg { width: 15px; height: 15px; }

  &:hover:not(:disabled) {
    background: #f8fafc;
    color: #0f172a;
    border-color: #cbd5e1;
  }

  &:disabled { opacity: 0.4; cursor: not-allowed; }

  @media (max-width: 480px) { width: 100%; justify-content: center; }

  @media (prefers-color-scheme: dark) {
    border-color: #334155;
    &:hover:not(:disabled) { background: #1e293b; color: #e2e8f0; }
  }
`

const NextBtn = styled.button<{ $isSubmit?: boolean }>`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 0.75rem 1.4rem;
  background: ${({ $isSubmit }) => $isSubmit ? '#15803d' : '#1d4ed8'};
  color: #fff;
  border: none;
  border-radius: 8px;
  font-family: 'DM Sans', sans-serif;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s, transform 0.12s;
  white-space: nowrap;

  svg { width: 16px; height: 16px; }

  &:hover:not(:disabled) {
    background: ${({ $isSubmit }) => $isSubmit ? '#166534' : '#1e40af'};
  }

  &:active:not(:disabled) { transform: scale(0.99); }

  &:disabled { background: #94a3b8; cursor: not-allowed; }

  @media (max-width: 480px) { width: 100%; justify-content: center; }
`

const SpinLoader = styled(Loader2)`
  animation: ${spinAnim} 0.8s linear infinite;
`

const StepHint = styled.div`
  font-size: 0.75rem;
  color: #94a3b8;
  text-align: center;
  flex: 1;

  @media (max-width: 480px) { display: none; }
`

// ─── Component ────────────────────────────────────────────────────────────────

interface WizardActionsProps {
  currentStep: number
  totalSteps: number
  onBack: () => void
  onNext: () => void
  onSubmit?: () => void
  isLoading?: boolean
  canProceed?: boolean
  nextLabel?: string
}

export const WizardActions: React.FC<WizardActionsProps> = ({
  currentStep,
  totalSteps,
  onBack,
  onNext,
  onSubmit,
  isLoading = false,
  canProceed = true,
  nextLabel,
}) => {
  const isFirstStep = currentStep === 1
  const isFinalStep = currentStep === totalSteps
  const stepsLeft = totalSteps - currentStep

  return (
    <ActionsBar>
      <BackBtn
        onClick={onBack}
        disabled={isFirstStep || isLoading}
        aria-label="Go to previous step"
      >
        <ChevronLeft /> Back
      </BackBtn>

      {!isFinalStep && stepsLeft > 1 && (
        <StepHint>{stepsLeft} step{stepsLeft !== 1 ? 's' : ''} left</StepHint>
      )}

      <NextBtn
        $isSubmit={isFinalStep}
        onClick={isFinalStep ? onSubmit : onNext}
        disabled={!canProceed || isLoading}
        aria-label={isFinalStep ? 'Publish campaign' : 'Go to next step'}
      >
        {isLoading ? (
          <><SpinLoader /> {isFinalStep ? 'Publishing…' : 'Saving…'}</>
        ) : isFinalStep ? (
          nextLabel ?? 'Publish campaign'
        ) : (
          <>{nextLabel ?? 'Continue'} <ChevronRight /></>
        )}
      </NextBtn>
    </ActionsBar>
  )
}