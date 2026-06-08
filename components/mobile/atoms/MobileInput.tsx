/**
 * Mobile Input Component
 * Handles different input types with mobile-specific keyboards and validation
 */

'use client'

import React, { useState, CSSProperties } from 'react'
import styled from 'styled-components'
import { mediaQueries } from '@/lib/mobile/breakpoints'
import { TOUCH_TARGETS, ANIMATION_DURATIONS } from '@/lib/mobile/constants'

export interface MobileInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helper?: string
  type?: 'text' | 'email' | 'tel' | 'number' | 'password' | 'date' | 'search'
  fullWidth?: boolean
  showPassword?: boolean
}

const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`

const Label = styled.label`
  font-size: 14px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 2px;
`

const InputContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`

const StyledInput = styled.input<{ $hasError: boolean; $fullWidth: boolean }>`
  /* Base styles */
  width: ${(props) => (props.$fullWidth ? '100%' : 'auto')};
  min-width: 100%;
  min-height: ${TOUCH_TARGETS.standard}px;
  padding: 12px 16px;
  font-size: 16px; /* Prevents iOS zoom */
  font-family: inherit;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  background: white;
  color: #1f2937;
  transition: all ${ANIMATION_DURATIONS.fast}ms ease-out;
  -webkit-appearance: none;
  appearance: none;

  /* Placeholder styles */
  &::placeholder {
    color: #9ca3af;
  }

  /* Focus state */
  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }

  /* Error state */
  ${(props) =>
    props.$hasError &&
    `
    border-color: #ef4444;
    
    &:focus {
      box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
    }
  `}

  /* Disabled state */
  &:disabled {
    background: #f3f4f6;
    color: #9ca3af;
    cursor: not-allowed;
  }

  /* Mobile specific */
  ${mediaQueries.isTouchDevice} {
    min-height: ${TOUCH_TARGETS.recommended}px;
    padding: 14px 16px;
  }

  /* Remove iOS default styling */
  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  /* Firefox remove spinner */
  &[type='number'] {
    -moz-appearance: textfield;
  }

  /* Reduce motion */
  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`

const PasswordToggle = styled.button`
  position: absolute;
  right: 12px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  color: #6b7280;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 44px;
  min-height: 44px;

  &:hover {
    color: #1f2937;
  }

  &:focus {
    outline: none;
  }
`

const ErrorMessage = styled.span`
  font-size: 12px;
  color: #ef4444;
  font-weight: 500;
`

const HelperText = styled.span`
  font-size: 12px;
  color: #6b7280;
`

/**
 * Get mobile input configuration based on type
 */
const getMobileInputConfig = (type: string) => {
  switch (type) {
    case 'tel':
      return {
        inputMode: 'tel' as const,
        pattern: '[0-9]*',
        autoComplete: 'tel',
      }
    case 'email':
      return {
        inputMode: 'email' as const,
        autoComplete: 'email',
      }
    case 'number':
      return {
        inputMode: 'decimal' as const,
        pattern: '[0-9.]*',
      }
    case 'search':
      return {
        inputMode: 'search' as const,
      }
    case 'password':
      return {
        autoComplete: 'current-password',
      }
    default:
      return {}
  }
}

/**
 * Mobile Input Component
 */
export const MobileInput = React.forwardRef<HTMLInputElement, MobileInputProps>(
  (
    {
      label,
      error,
      helper,
      type = 'text',
      fullWidth = true,
      showPassword: showPasswordProp = false,
      onChange,
      ...rest
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(showPasswordProp)
    const inputConfig = getMobileInputConfig(type)
    const inputType = type === 'password' && showPassword ? 'text' : type

    const handlePasswordToggle = (e: React.MouseEvent) => {
      e.preventDefault()
      setShowPassword(!showPassword)
    }

    return (
      <InputWrapper>
        {label && <Label htmlFor={rest.id}>{label}</Label>}

        <InputContainer>
          <StyledInput
            ref={ref}
            type={inputType}
            $hasError={!!error}
            $fullWidth={fullWidth}
            {...inputConfig}
            {...rest}
            onChange={onChange}
          />

          {type === 'password' && (
            <PasswordToggle
              type="button"
              onClick={handlePasswordToggle}
              title={showPassword ? 'Hide password' : 'Show password'}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? (
                <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10 2c-4.97 0-9.29 3.064-11.43 7.5C.71 13.936 5.03 17 10 17s9.29-3.064 11.43-7.5C19.29 5.064 14.97 2 10 2zm0 12c-2.48 0-4.5-2.015-4.5-4.5S7.52 5 10 5s4.5 2.015 4.5 4.5S12.48 14 10 14zm0-7c-1.38 0-2.5 1.12-2.5 2.5S8.62 12 10 12s2.5-1.12 2.5-2.5S11.38 7 10 7z" />
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M11.93 5.43L10 3.5a7.5 7.5 0 00-10.43 6.5 9.96 9.96 0 003.91 6.29l1.42-1.42A8 8 0 0110 4a7.5 7.5 0 011.93 1.43zm6.5 6.57c1.16-1.96 1.84-4.24 1.84-6.5 0-.42-.04-.83-.1-1.24l-1.42 1.42c.06.35.1.7.1 1.07 0 3.86-3.13 7-7 7-1.07 0-2.08-.24-2.99-.67l-1.42 1.42A9.98 9.98 0 0010 17c3.03 0 5.87-1.02 8.13-2.73l1.3 1.3 1.42-1.42-.92-.92zm-2.58-4c0-1.38-1.12-2.5-2.5-2.5V4c2.48 0 4.5 2.02 4.5 4.5h-2z" />
                </svg>
              )}
            </PasswordToggle>
          )}
        </InputContainer>

        {error && <ErrorMessage>{error}</ErrorMessage>}
        {helper && !error && <HelperText>{helper}</HelperText>}
      </InputWrapper>
    )
  }
)

MobileInput.displayName = 'MobileInput'

export default MobileInput
