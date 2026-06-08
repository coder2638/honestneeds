'use client'

import React, { useId } from 'react'
import styled, { css } from 'styled-components'
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, TRANSITIONS } from '@/styles/tokens'

const FormFieldWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: ${SPACING[4]};
  width: 100%;
`

const StyledLabel = styled.label`
  font-size: ${TYPOGRAPHY.SIZE_SM};
  font-weight: ${TYPOGRAPHY.WEIGHT_SEMIBOLD};
  color: ${COLORS.TEXT};
  margin-bottom: ${SPACING[2]};
  display: block;

  .required {
    color: ${COLORS.ERROR};
    margin-left: ${SPACING[1]};
  }
`

interface StyledInputProps {
  $hasError?: boolean
}

const StyledInput = styled.input<StyledInputProps>`
  padding: ${SPACING[2]} ${SPACING[3]};
  font-size: ${TYPOGRAPHY.SIZE_BASE};
  font-family: ${TYPOGRAPHY.FONT_BODY};
  border: 2px solid ${COLORS.BORDER};
  border-radius: ${BORDER_RADIUS.MD};
  background-color: ${COLORS.SURFACE};
  color: ${COLORS.TEXT};
  transition: all ${TRANSITIONS.BASE};

  &::placeholder {
    color: ${COLORS.MUTED_TEXT};
  }

  &:hover:not(:disabled) {
    border-color: ${COLORS.PRIMARY_LIGHT};
  }

  &:focus {
    outline: none;
    border-color: ${COLORS.PRIMARY};
    box-shadow: 0 0 0 3px ${COLORS.PRIMARY_BG};
  }

  &:disabled {
    background-color: ${COLORS.DISABLED};
    color: ${COLORS.MUTED_TEXT};
    cursor: not-allowed;
    opacity: 0.6;
  }

  ${props =>
    props.$hasError &&
    css`
      border-color: ${COLORS.ERROR};
      background-color: ${COLORS.ERROR_BG};

      &:focus {
        border-color: ${COLORS.ERROR_DARK};
        box-shadow: 0 0 0 3px ${COLORS.ERROR_BG};
      }
    `}
`

const StyledTextarea = styled.textarea<StyledInputProps>`
  padding: ${SPACING[2]} ${SPACING[3]};
  font-size: ${TYPOGRAPHY.SIZE_BASE};
  font-family: ${TYPOGRAPHY.FONT_BODY};
  border: 2px solid ${COLORS.BORDER};
  border-radius: ${BORDER_RADIUS.MD};
  background-color: ${COLORS.SURFACE};
  color: ${COLORS.TEXT};
  transition: all ${TRANSITIONS.BASE};
  min-height: 120px;
  resize: vertical;

  &::placeholder {
    color: ${COLORS.MUTED_TEXT};
  }

  &:hover:not(:disabled) {
    border-color: ${COLORS.PRIMARY_LIGHT};
  }

  &:focus {
    outline: none;
    border-color: ${COLORS.PRIMARY};
    box-shadow: 0 0 0 3px ${COLORS.PRIMARY_BG};
  }

  &:disabled {
    background-color: ${COLORS.DISABLED};
    color: ${COLORS.MUTED_TEXT};
    cursor: not-allowed;
    opacity: 0.6;
  }

  ${props =>
    props.$hasError &&
    css`
      border-color: ${COLORS.ERROR};
      background-color: ${COLORS.ERROR_BG};

      &:focus {
        border-color: ${COLORS.ERROR_DARK};
        box-shadow: 0 0 0 3px ${COLORS.ERROR_BG};
      }
    `}
`

const ErrorMessage = styled.span`
  font-size: ${TYPOGRAPHY.SIZE_SM};
  color: ${COLORS.ERROR};
  margin-top: ${SPACING[1]};
  display: block;
`

const HelperText = styled.span`
  font-size: ${TYPOGRAPHY.SIZE_SM};
  color: ${COLORS.MUTED_TEXT};
  margin-top: ${SPACING[1]};
  display: block;
`

export interface FormFieldProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string
  type?: 'text' | 'email' | 'tel' | 'number' | 'date' | 'password'
  error?: string
  helperText?: string
  required?: boolean
  textarea?: boolean
  children?: React.ReactNode
}

export const FormField = React.forwardRef<HTMLInputElement, FormFieldProps>(
  (
    {
      label,
      type = 'text',
      error,
      helperText,
      required = false,
      textarea = false,
      children,
      id,
      ...props
    },
    ref
  ) => {
    const generatedId = useId()
    const inputId = id || generatedId

    return (
      <FormFieldWrapper>
        {label && (
          <StyledLabel htmlFor={inputId}>
            {label}
            {required && <span className="required">*</span>}
          </StyledLabel>
        )}
        {children ? (
          // Render custom children if provided
          <div>{children}</div>
        ) : textarea ? (
          // Render textarea if textarea prop is true
          <StyledTextarea
            ref={ref as React.Ref<HTMLTextAreaElement>}
            id={inputId}
            $hasError={!!error}
            aria-invalid={!!error}
            aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
            {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
          />
        ) : (
          // Render default input element
          <StyledInput
            ref={ref}
            id={inputId}
            type={type}
            $hasError={!!error}
            aria-invalid={!!error}
            aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
            {...props}
          />
        )}
        {error && <ErrorMessage id={`${inputId}-error`}>{error}</ErrorMessage>}
        {!error && helperText && <HelperText id={`${inputId}-helper`}>{helperText}</HelperText>}
      </FormFieldWrapper>
    )
  }
)

FormField.displayName = 'FormField'
