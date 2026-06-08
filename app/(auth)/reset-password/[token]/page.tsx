'use client'

import styled from 'styled-components'
import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Eye, EyeOff, Loader, AlertCircle, CheckCircle } from 'lucide-react'
import Button from '@/components/ui/Button'
import { PasswordStrengthMeter } from '@/components/auth/PasswordStrengthMeter'
import { resetPasswordSchema, type ResetPasswordFormData } from '@/utils/validationSchemas'
import { useResetPassword } from '@/api/hooks/useAuth'
import { authService } from '@/api/services/authService'

// Styled Components
const Container = styled.div`
  width: 100%;
  max-width: 28rem;
  margin: 0 auto;
`

const LoadingWrapper = styled.div`
  text-align: center;

  svg {
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`

const LoadingIcon = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 3rem;
  height: 3rem;
  background-color: #e5e7eb;
  border-radius: 9999px;
  margin-bottom: 1rem;

  svg {
    width: 1.5rem;
    height: 1.5rem;
    color: #6b7280;
  }
`

const LoadingText = styled.p`
  color: #6b7280;
  font-size: 1rem;
`

const StateCard = styled.div`
  width: 100%;
  max-width: 28rem;
  margin: 0 auto;
`

const StateHeader = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`

const IconWrapper = styled.div<{ $variant: 'error' | 'success' }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 4rem;
  height: 4rem;
  background-color: ${props =>
    props.$variant === 'error' ? '#fee2e2' : '#dcfce7'};
  border-radius: 9999px;
  margin-bottom: 1rem;

  svg {
    width: 2rem;
    height: 2rem;
    color: ${props =>
      props.$variant === 'error' ? '#dc2626' : '#16a34a'};
  }
`

const StateTitle = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 0.5rem;
`

const StateMessage = styled.p`
  color: #6b7280;
  line-height: 1.5;
`

const ActionsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`

const HeaderSection = styled.div`
  margin-bottom: 2rem;
`

const Title = styled.h1`
  font-size: 1.875rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 0.5rem;
`

const Subtitle = styled.p`
  color: #6b7280;
  font-size: 1rem;
  line-height: 1.5;

  span {
    font-weight: 600;
    color: #111827;
  }
`

const FormWrapper = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`

const Label = styled.label`
  display: block;
  font-size: 0.875rem;
  font-weight: 600;
  color: #1f2937;
`

const PasswordInputWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
`

const PasswordInput = styled.input<{ $hasError: boolean }>`
  width: 100%;
  padding: 0.625rem 2.5rem 0.625rem 1rem;
  border: 2px solid;
  border-radius: 0.5rem;
  font-size: 1rem;
  transition: all 200ms;
  background-color: #f9fafb;
  padding-right: 2.5rem;

  &::placeholder {
    color: #9ca3af;
  }

  &:focus {
    outline: none;
    background-color: #ffffff;
  }

  ${props => {
    if (props.$hasError) {
      return `
        border-color: #ef4444;
        background-color: rgba(254, 242, 242, 0.5);

        &:focus {
          border-color: #dc2626;
          box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
          background-color: #ffffff;
        }
      `
    }
    return `
      border-color: #e5e7eb;

      &:hover {
        border-color: #d1d5db;
        background-color: #f3f4f6;
      }

      &:focus {
        border-color: #667eea;
        box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        background-color: #ffffff;
      }
    `
  }}

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    background-color: #f3f4f6;
  }
`

const VisibilityToggle = styled.button`
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  color: #6b7280;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 200ms;

  &:hover {
    color: #111827;
  }

  &:focus {
    outline: 2px solid #667eea;
    outline-offset: 2px;
    border-radius: 4px;
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  svg {
    width: 1.125rem;
    height: 1.125rem;
  }
`

const ErrorMessage = styled.p`
  font-size: 0.875rem;
  color: #dc2626;
  font-weight: 500;
`

const InfoBox = styled.div`
  margin-top: 1.5rem;
  padding: 1rem;
  background-color: #eff6ff;
  border: 1px solid #bfdbfe;
  border-radius: 0.5rem;

  p {
    font-size: 0.875rem;
    color: #1e3a8a;
    line-height: 1.5;

    span {
      font-weight: 600;
    }
  }
`

const FooterLink = styled.div`
  margin-top: 2rem;
  text-align: center;
  padding-top: 1.5rem;
  border-top: 1px solid #e5e7eb;

  p {
    font-size: 0.875rem;
    color: #6b7280;
  }

  a {
    color: #667eea;
    font-weight: 600;
    text-decoration: none;
    transition: color 200ms;

    &:hover {
      color: #764ba2;
      text-decoration: underline;
    }

    &:focus {
      outline: 2px solid #667eea;
      outline-offset: 2px;
      border-radius: 2px;
    }
  }
`

const HelpSection = styled.div`
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e5e7eb;
  text-align: center;

  p {
    font-size: 0.75rem;
    color: #9ca3af;
  }

  a {
    color: #667eea;
    font-weight: 600;
    text-decoration: none;
    transition: color 200ms;

    &:hover {
      color: #764ba2;
    }
  }
`

export default function ResetPasswordPage() {
  const params = useParams()
  const token = params.token as string

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [tokenState, setTokenState] = useState<'loading' | 'valid' | 'invalid'>('loading')
  const [tokenEmail, setTokenEmail] = useState<string>('')
  const [success, setSuccess] = useState(false)

  const { mutate: resetPassword, isPending } = useResetPassword()

  const {
    register: registerField,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    mode: 'onBlur',
  })

  const password = watch('password')
  const confirmPassword = watch('confirmPassword')

  // Verify token on page load
  useEffect(() => {
    const verifyToken = async () => {
      try {
        const result = await authService.verifyResetToken(token)

        if (result.valid) {
          setTokenState('valid')
          setTokenEmail(result.email || '')
        } else {
          setTokenState('invalid')
        }
      } catch (error) {
        setTokenState('invalid')
      }
    }

    if (token) {
      verifyToken()
    } else {
      setTokenState('invalid')
    }
  }, [token])

  const onSubmit = (data: ResetPasswordFormData) => {
    resetPassword(
      {
        token,
        password: data.password,
      },
      {
        onSuccess: () => {
          setSuccess(true)
        },
      }
    )
  }

  // Loading state
  if (tokenState === 'loading') {
    return (
      <Container>
        <LoadingWrapper>
          <LoadingIcon>
            <Loader />
          </LoadingIcon>
          <LoadingText>Verifying your reset link...</LoadingText>
        </LoadingWrapper>
      </Container>
    )
  }

  // Invalid token state
  if (tokenState === 'invalid') {
    return (
      <StateCard>
        <StateHeader>
          <IconWrapper $variant="error">
            <AlertCircle />
          </IconWrapper>
          <StateTitle>Link Expired</StateTitle>
          <StateMessage>
            This password reset link has expired or is invalid. Password reset links are only valid for 24 hours.
          </StateMessage>
        </StateHeader>

        <ActionsWrapper>
          <Button
            as="link"
            href="/forgot-password"
            variant="primary"
            size="md"
          >
            Request New Link
          </Button>

          <Button as="link" href="/login" variant="outline" size="md">
            Back to Login
          </Button>
        </ActionsWrapper>

        <HelpSection>
          <p>
            Need help?{' '}
            <Link href="/contact">Contact support</Link>
          </p>
        </HelpSection>
      </StateCard>
    )
  }

  // Success state
  if (success) {
    return (
      <StateCard>
        <StateHeader>
          <IconWrapper $variant="success">
            <CheckCircle />
          </IconWrapper>
          <StateTitle>Password Reset Successful</StateTitle>
          <StateMessage>
            Your password has been reset successfully. You can now sign in with your new password.
          </StateMessage>
        </StateHeader>

        <Button as="link" href="/login" variant="primary" size="md">
          Go to Login
        </Button>

        <HelpSection>
          <p>
            Having trouble?{' '}
            <Link href="/contact">Contact support</Link>
          </p>
        </HelpSection>
      </StateCard>
    )
  }

  // Valid token - show form
  return (
    <Container>
      <HeaderSection>
        <Title>Set New Password</Title>
        <Subtitle>
          Creating new password for <span>{tokenEmail}</span>
        </Subtitle>
      </HeaderSection>

      <FormWrapper onSubmit={handleSubmit(onSubmit)}>
        {/* Password Field */}
        <FormGroup>
          <Label htmlFor="password">New Password</Label>
          <PasswordInputWrapper>
            <PasswordInput
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              disabled={isPending}
              $hasError={!!errors.password}
              {...registerField('password')}
              aria-invalid={errors.password ? 'true' : 'false'}
              aria-describedby={errors.password ? 'password-error' : undefined}
            />
            <VisibilityToggle
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              disabled={isPending}
            >
              {showPassword ? <EyeOff /> : <Eye />}
            </VisibilityToggle>
          </PasswordInputWrapper>
          {errors.password && (
            <ErrorMessage id="password-error">{errors.password.message}</ErrorMessage>
          )}
          {password && <PasswordStrengthMeter password={password} />}
        </FormGroup>

        {/* Confirm Password Field */}
        <FormGroup>
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <PasswordInputWrapper>
            <PasswordInput
              id="confirmPassword"
              type={showConfirm ? 'text' : 'password'}
              placeholder="••••••••"
              disabled={isPending}
              $hasError={!!errors.confirmPassword}
              {...registerField('confirmPassword')}
              aria-invalid={errors.confirmPassword ? 'true' : 'false'}
              aria-describedby={errors.confirmPassword ? 'confirmPassword-error' : undefined}
            />
            <VisibilityToggle
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              aria-label={showConfirm ? 'Hide password' : 'Show password'}
              disabled={isPending}
            >
              {showConfirm ? <EyeOff /> : <Eye />}
            </VisibilityToggle>
          </PasswordInputWrapper>
          {errors.confirmPassword && (
            <ErrorMessage id="confirmPassword-error">{errors.confirmPassword.message}</ErrorMessage>
          )}
        </FormGroup>

        {/* Submit Button */}
        <Button
          type="submit"
          variant="primary"
          size="md"
          disabled={isPending || !password || !confirmPassword}
        >
          {isPending ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Loader size={18} />
              Resetting...
            </div>
          ) : (
            'Reset Password'
          )}
        </Button>
      </FormWrapper>

      <InfoBox>
        <p>
          <span>Security Tip:</span> Use a strong, unique password that you don't use on other websites.
        </p>
      </InfoBox>

      <FooterLink>
        <p>
          Remember your password?{' '}
          <Link href="/login">Sign in</Link>
        </p>
      </FooterLink>

      <HelpSection>
        <p>
          Still need help?{' '}
          <Link href="/contact">Contact support</Link>
        </p>
      </HelpSection>
    </Container>
  )
}
