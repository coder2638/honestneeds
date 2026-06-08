'use client'

import styled from 'styled-components'
import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { Loader, Mail, ArrowLeft } from 'lucide-react'
import Button from '@/components/ui/Button'
import { forgotPasswordSchema, type ForgotPasswordFormData } from '@/utils/validationSchemas'
import { useForgotPassword } from '@/api/hooks/useAuth'

// Styled Components
const Container = styled.div`
  width: 100%;
  max-width: 28rem;
  margin: 0 auto;
`

const BackLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  color: #667eea;
  text-decoration: none;
  margin-bottom: 1rem;
  transition: color 200ms;
  font-weight: 500;

  &:hover {
    color: #764ba2;
  }

  &:focus {
    outline: 2px solid #667eea;
    outline-offset: 2px;
    border-radius: 2px;
  }
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

const InputField = styled.input<{ $hasError: boolean }>`
  width: 100%;
  padding: 0.625rem 1rem;
  border: 2px solid;
  border-radius: 0.5rem;
  font-size: 1rem;
  transition: all 200ms;
  background-color: #f9fafb;

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

const SuccessContainer = styled.div`
  width: 100%;
  max-width: 28rem;
  margin: 0 auto;
`

const SuccessHeader = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`

const IconWrapper = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 4rem;
  height: 4rem;
  background-color: #dcfce7;
  border-radius: 9999px;
  margin-bottom: 1rem;

  svg {
    width: 2rem;
    height: 2rem;
    color: #16a34a;
  }
`

const SuccessTitle = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 0.5rem;
`

const SuccessMessage = styled.p`
  color: #6b7280;
  margin-bottom: 1rem;
  line-height: 1.5;

  span {
    font-weight: 600;
    color: #111827;
  }
`

const AlertBox = styled.div`
  background-color: #eff6ff;
  border: 1px solid #bfdbfe;
  border-radius: 0.5rem;
  padding: 1rem;
  margin-bottom: 1.5rem;

  p {
    font-size: 0.875rem;
    color: #1e3a8a;

    span {
      font-weight: 600;
    }
  }
`

const ActionsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`

const HelpSection = styled.div`
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e5e7eb;
  text-align: center;

  p {
    font-size: 0.875rem;
    color: #6b7280;
    margin-bottom: 0.75rem;

    &:last-child {
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
  }
`

export default function ForgotPasswordPage() {
  const [submitted, setSubmitted] = useState(false)
  const [resendTimer, setResendTimer] = useState(0)
  const [submittedEmail, setSubmittedEmail] = useState('')

  const { mutate: forgotPassword, isPending } = useForgotPassword()

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: 'onBlur',
  })

  const email = watch('email')

  // Countdown timer for resend
  useEffect(() => {
    let interval: NodeJS.Timeout

    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1)
      }, 1000)
    }

    return () => clearInterval(interval)
  }, [resendTimer])

  const onSubmit = (data: ForgotPasswordFormData) => {
    forgotPassword(
      { email: data.email },
      {
        onSuccess: () => {
          setSubmitted(true)
          setSubmittedEmail(data.email)
          setResendTimer(30)
          reset()
        },
      }
    )
  }

  const handleResend = () => {
    if (resendTimer === 0) {
      forgotPassword(
        { email: submittedEmail },
        {
          onSuccess: () => {
            setResendTimer(30)
          },
        }
      )
    }
  }

  if (submitted) {
    return (
      <SuccessContainer>
        <SuccessHeader>
          <IconWrapper>
            <Mail />
          </IconWrapper>
          <SuccessTitle>Check Your Email</SuccessTitle>
          <SuccessMessage>
            We've sent a password reset link to <span>{submittedEmail}</span>
          </SuccessMessage>
          <AlertBox>
            <p>
              The reset link will expire in <span>24 hours</span>. If you don't see the email, check your spam folder.
            </p>
          </AlertBox>
        </SuccessHeader>

        <ActionsWrapper>
          <Button
            type="button"
            variant="primary"
            size="md"
            disabled={resendTimer > 0 || isPending}
            onClick={handleResend}
          >
            {isPending ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Loader size={18} />
                Sending...
              </div>
            ) : resendTimer > 0 ? (
              `Resend in ${resendTimer}s`
            ) : (
              'Resend Link'
            )}
          </Button>

          <Button
            as="link"
            href="/login"
            variant="outline"
            size="md"
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
          >
            <ArrowLeft size={18} />
            Back to Login
          </Button>
        </ActionsWrapper>

        <HelpSection>
          <p>Didn't receive the email?</p>
          <p>
            <Link href="/contact">Contact support</Link> for assistance
          </p>
        </HelpSection>
      </SuccessContainer>
    )
  }

  return (
    <Container>
      <HeaderSection>
        <BackLink href="/login">
          <ArrowLeft size={18} />
          Back to login
        </BackLink>
        <Title>Reset Password</Title>
        <Subtitle>Enter your email address and we'll send you a link to reset your password.</Subtitle>
      </HeaderSection>

      <FormWrapper onSubmit={handleSubmit(onSubmit)}>
        <FormGroup>
          <Label htmlFor="email">Email Address</Label>
          <InputField
            id="email"
            type="email"
            placeholder="you@example.com"
            disabled={isPending}
            $hasError={!!errors.email}
            {...register('email')}
            aria-invalid={errors.email ? 'true' : 'false'}
            aria-describedby={errors.email ? 'email-error' : undefined}
          />
          {errors.email && (
            <ErrorMessage id="email-error">{errors.email.message}</ErrorMessage>
          )}
        </FormGroup>

        <Button
          type="submit"
          variant="primary"
          size="md"
          disabled={isPending || !email}
        >
          {isPending ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Loader size={18} />
              Sending...
            </div>
          ) : (
            'Send Reset Link'
          )}
        </Button>
      </FormWrapper>

      <InfoBox>
        <p>
          <span>Note:</span> For security reasons, reset links expire after 24 hours.
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
