'use client'

import styled, { keyframes } from 'styled-components'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import {
  Eye, EyeOff, Loader, AlertCircle,
  CheckCircle2, Shield, ArrowRight,
} from 'lucide-react'
import Image from 'next/image'
import Button from '@/components/ui/Button'
import { PasswordStrengthMeter } from '@/components/auth/PasswordStrengthMeter'
import { registerSchema } from '@/utils/validationSchemas'
import { useRegister, useCheckEmailExists } from '@/api/hooks/useAuth'

// ─── Brand Tokens (shared with login) ─────────────────────────────────────────
const tokens = {
  amber:     '#255eb3',
  amberDk:   '#2972df',
  amberLt:   '#c3cfe9',
  amberGlow: 'rgba(255, 255, 255, 0.18)',
  teal:      '#0D9488',
  tealDk:    '#0F766E',
  tealLt:    'rgba(13, 148, 136, 0.08)',
  ink:       '#1C1917',
  inkMid:    '#808080',
  inkSoft:   '#979797',
  inkXsoft:  '#9c9c9c',
  surface:   '#ffffff',
  surfaceAlt:'#dddddd',
  border:    '#e2e2e2',
  errorRed:  '#DC2626',
  errorBg:   'rgba(255, 131, 131, 0.06)',
  successGreen:'#059669',
  successBg:  'rgba(5, 150, 105, 0.06)',
  white:     '#FFFFFF',
}

// ─── Keyframes ─────────────────────────────────────────────────────────────────
const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
`
const fadeIn = keyframes`
  from { opacity: 0; }
  to   { opacity: 1; }
`
const float = keyframes`
  0%, 100% { transform: translateY(0) rotate(0deg); }
  33%       { transform: translateY(-10px) rotate(1deg); }
  66%       { transform: translateY(5px) rotate(-0.5deg); }
`
const shimmer = keyframes`
  0%   { background-position: -200% center; }
  100% { background-position:  200% center; }
`
const spinAnim = keyframes`
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
`
const sectionIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
`

// ─── Page Layout ────────────────────────────────────────────────────────────────
const Page = styled.div`
  min-height: 100vh;
  width: 100%;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  
  padding: 2.5rem 1.25rem 3rem;
  position: relative;
  overflow: hidden;
`

const BubbleBase = styled.div`
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
  animation: ${float} ease-in-out infinite;
`

const Bubble1 = styled(BubbleBase)`
  width: 380px; height: 380px;
  top: -100px; right: -100px;
  background: radial-gradient(circle at 40% 40%, rgba(245,158,11,0.13), transparent 70%);
  animation-duration: 16s;
`
const Bubble2 = styled(BubbleBase)`
  width: 240px; height: 240px;
  bottom: -60px; left: -70px;
  background: radial-gradient(circle at 60% 60%, rgba(13,148,136,0.1), transparent 70%);
  animation-duration: 20s;
  animation-delay: -8s;
`
const Bubble3 = styled(BubbleBase)`
  width: 100px; height: 100px;
  top: 40%; right: 6%;
  background: radial-gradient(circle, rgba(245,158,11,0.07), transparent 70%);
  animation-duration: 24s;
  animation-delay: -12s;
`

const Wrap = styled.div`
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 460px;
  animation: ${fadeUp} 0.55s cubic-bezier(0.22, 1, 0.36, 1) both;
`

// ─── Logo & Header ─────────────────────────────────────────────────────────────
const Header = styled.header`
  text-align: center;
  margin-bottom: 2rem;
  animation: ${fadeIn} 0.5s ease both;
`

const LogoWrapper = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.25rem;
`

const LogoImg = styled.div`
  position: relative;
  width: 160px;
  height: 80px;
  filter: drop-shadow(0 4px 12px rgba(0,0,0,0.12));
  transition: transform 300ms ease, filter 300ms ease;

  &:hover {
    transform: scale(1.04);
    filter: drop-shadow(0 6px 18px rgba(0,0,0,0.18));
  }
`

const Title = styled.h1`
  font-family: 'Georgia', 'Times New Roman', serif;
  font-size: clamp(1.75rem, 5vw, 2.125rem);
  font-weight: 700;
  color: ${tokens.ink};
  margin: 0 0 0.4rem;
  letter-spacing: -0.03em;
  line-height: 1.15;
`

const Subtitle = styled.p`
  font-size: 0.9375rem;
  color: ${tokens.inkSoft};
  margin: 0;
  line-height: 1.5;
`

// ─── Card ───────────────────────────────────────────────────────────────────────
const Card = styled.div`
  background: ${tokens.white};
  border-radius: 20px;
  padding: 2rem;
  border: 1.5px solid ${tokens.border};
  box-shadow:
    0 1px 3px rgba(0,0,0,0.04),
    0 8px 32px rgba(28,25,23,0.07),
    0 0 0 1px rgba(245,158,11,0.04) inset;
  animation: ${fadeUp} 0.6s 0.05s cubic-bezier(0.22, 1, 0.36, 1) both;

  @media (min-width: 480px) {
    padding: 2.25rem 2.5rem;
  }
`

// ─── Section divider inside form ───────────────────────────────────────────────
const SectionLabel = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.25rem;
  animation: ${sectionIn} 0.4s ease both;
  animation-delay: ${props => props.$delay || '0s'};
`

const SectionDot = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${tokens.amber};
  flex-shrink: 0;
`

const SectionTitle = styled.span`
  font-size: 0.8rem;
  font-weight: 700;
  color: ${tokens.inkSoft};
  text-transform: uppercase;
  letter-spacing: 0.08em;
`

const SectionLine = styled.div`
  flex: 1;
  height: 1px;
  background: ${tokens.border};
`

// ─── Form Sections ─────────────────────────────────────────────────────────────
const FormBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  margin-bottom: 1.75rem;
`

const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
`

const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${tokens.inkMid};
  letter-spacing: 0.01em;
`

const InputBox = styled.div`
  position: relative;
`

const Input = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  font-size: 1rem;
  font-weight: 500;
  color: ${tokens.ink};
  background: ${tokens.surface};
  border: 1.5px solid ${tokens.border};
  border-radius: 10px;
  transition: border-color 180ms, box-shadow 180ms, background 180ms;
  outline: none;
  box-sizing: border-box;

  &::placeholder { color: ${tokens.inkXsoft}; }

  &:hover:not(:disabled) {
    border-color: #D6D3D1;
    background: ${tokens.white};
  }

  &:focus {
    border-color: ${tokens.amber};
    background: ${tokens.white};
    box-shadow: 0 0 0 3px ${tokens.amberGlow};
  }

  &[data-state='error'] {
    border-color: ${tokens.errorRed};
    background: ${tokens.errorBg};
    &:focus { box-shadow: 0 0 0 3px rgba(220,38,38,0.12); }
  }

  &[data-state='success'] {
    border-color: ${tokens.successGreen};
    background: ${tokens.successBg};
    &:focus { border-color: ${tokens.successGreen}; box-shadow: 0 0 0 3px rgba(5,150,105,0.12); }
  }

  &:disabled { opacity: 0.55; cursor: not-allowed; }
`

const PasswordInput = styled(Input)`
  padding-right: 3rem;
`

const EyeBtn = styled.button`
  position: absolute;
  right: 0.875rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  color: ${tokens.inkXsoft};
  padding: 0.2rem;
  display: flex;
  align-items: center;
  transition: color 150ms;

  &:hover { color: ${tokens.inkMid}; }
  &:focus-visible { outline: 2px solid ${tokens.amber}; outline-offset: 2px; border-radius: 4px; }
  &:disabled { opacity: 0.4; cursor: not-allowed; }
`

const HelpText = styled.p`
  font-size: 0.8125rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.375rem;
  margin: 0;

  color: ${props => {
    switch (props.$variant) {
      case 'error':   return tokens.errorRed
      case 'success': return tokens.successGreen
      default:        return tokens.inkSoft
    }
  }};
`

// ─── Checkbox / Terms ──────────────────────────────────────────────────────────
const TermsRow = styled.label`
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  cursor: pointer;
  padding: 0.875rem;
  background: ${tokens.surfaceAlt};
  border-radius: 10px;
  border: 1.5px solid ${tokens.border};
  transition: border-color 150ms, background 150ms;

  &:hover { border-color: ${tokens.amber}; background: ${tokens.amberLt}; }

  input[type='checkbox'] {
    width: 18px;
    height: 18px;
    min-width: 18px;
    margin-top: 1px;
    cursor: pointer;
    accent-color: ${tokens.amber};
    border-radius: 4px;

    &:focus-visible { outline: 2px solid ${tokens.amber}; outline-offset: 2px; }
  }
`

const TermsText = styled.span`
  font-size: 0.875rem;
  color: ${tokens.inkMid};
  line-height: 1.5;

  a {
    color: ${tokens.teal};
    font-weight: 600;
    text-decoration: none;
    transition: color 150ms;

    &:hover { color: ${tokens.tealDk}; text-decoration: underline; }
  }
`

// ─── Submit Button ─────────────────────────────────────────────────────────────
const SubmitBtn = styled.button`
  width: 100%;
  padding: 0.875rem 1.5rem;
  margin-top: 0.25rem;
  border-radius: 11px;
  border: none;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  letter-spacing: 0.01em;
  position: relative;
  overflow: hidden;
  transition: transform 150ms, box-shadow 150ms, opacity 150ms;

  background: linear-gradient(135deg, ${tokens.amber} 0%, ${tokens.amberDk} 100%);
  color: white;
  box-shadow: 0 4px 16px ${tokens.amberGlow};

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(
      105deg,
      transparent 30%,
      rgba(255,255,255,0.25) 50%,
      transparent 70%
    );
    background-size: 200% 100%;
    opacity: 0;
    transition: opacity 200ms;
  }

  &:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 6px 24px rgba(245,158,11,0.35);
    &::before { opacity: 1; animation: ${shimmer} 0.8s linear; }
  }

  &:active:not(:disabled) {
    transform: translateY(0);
    box-shadow: 0 2px 8px ${tokens.amberGlow};
  }

  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
    box-shadow: none;
  }

  svg.spin { animation: ${spinAnim} 1s linear infinite; }
`

const ArrowIcon = styled(ArrowRight)`
  transition: transform 200ms;
  ${SubmitBtn}:hover:not(:disabled) & { transform: translateX(3px); }
`

// ─── Security Badge ────────────────────────────────────────────────────────────
const SecurityBadge = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 1rem;
  padding: 0.625rem 1rem;
  background: ${tokens.tealLt};
  border-radius: 8px;
  border: 1px solid rgba(13,148,136,0.2);
  font-size: 0.8125rem;
  color: ${tokens.tealDk};
  font-weight: 600;
`

// ─── Footer ────────────────────────────────────────────────────────────────────
const Footer = styled.footer`
  margin-top: 1.5rem;
  text-align: center;
  animation: ${fadeIn} 0.5s 0.15s ease both;
`

const FooterText = styled.p`
  font-size: 0.9375rem;
  color: ${tokens.inkSoft};
  margin: 0 0 0.625rem;
`

const FooterLink = styled(Link)`
  font-weight: 700;
  color: ${tokens.teal};
  text-decoration: none;
  transition: color 150ms;
  &:hover { color: ${tokens.tealDk}; text-decoration: underline; }
`

const SupportLink = styled(Link)`
  display: inline-block;
  font-size: 0.8125rem;
  color: ${tokens.inkXsoft};
  text-decoration: none;
  transition: color 150ms;
  &:hover { color: ${tokens.inkSoft}; }
`

// ─── Component ─────────────────────────────────────────────────────────────────
export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [emailError, setEmailError] = useState('')
  const [emailSuccessful, setEmailSuccessful] = useState(false)

  const { mutate: register, isPending } = useRegister()
  const { mutate: checkEmail, isPending: isCheckingEmail } = useCheckEmailExists()

  const {
    register: registerField,
    handleSubmit,
    formState: { errors },
    watch,
    trigger,
  } = useForm({
    resolver: zodResolver(registerSchema),
    mode: 'onBlur',
  })

  const email = watch('email')
  const displayName = watch('displayName')
  const password = watch('password')
  const confirmPassword = watch('confirmPassword')
  const acceptTerms = watch('acceptTerms')

  const handleEmailBlur = async () => {
    if (!email) { setEmailError(''); setEmailSuccessful(false); return }
    const result = await trigger('email')
    if (!result) { setEmailError(''); setEmailSuccessful(false); return }

    checkEmail({ email }, {
      onSuccess: (exists) => {
        if (exists) {
          setEmailError('This email is already registered. Please sign in instead.')
          setEmailSuccessful(false)
        } else {
          setEmailError('')
          setEmailSuccessful(true)
        }
      },
    })
  }

  const onSubmit = (data) => {
    if (emailError) return
    register({ email: data.email, displayName: data.displayName, password: data.password })
  }

  const isFormValid =
    email && displayName && password && confirmPassword && acceptTerms &&
    !emailError && !errors.email && !errors.displayName &&
    !errors.password && !errors.confirmPassword && !errors.acceptTerms

  // Derive input state strings for styling
  const emailState = errors.email || emailError ? 'error' : emailSuccessful ? 'success' : undefined

  return (
    <Page suppressHydrationWarning>
      <Bubble1 />
      <Bubble2 />
      <Bubble3 />

      <Wrap>
        <Header>
          <LogoWrapper>
            <LogoImg>
              <Image
                src="/1000019752.png"
                alt="HonestNeed — Get Your Needs Filled"
                fill
                style={{ objectFit: 'contain' }}
                priority
              />
            </LogoImg>
          </LogoWrapper>
          <Title>Create your account</Title>
          <Subtitle>Join the community and start making a difference</Subtitle>
        </Header>

       
          <form onSubmit={handleSubmit(onSubmit)}>

            {/* ── Identity Section ───────────────────────────────────────── */}
            <SectionLabel $delay="0.05s">
              <SectionDot />
              <SectionTitle>Your identity</SectionTitle>
              <SectionLine />
            </SectionLabel>

            <FormBlock>
              {/* Email */}
              <FieldGroup>
                <Label htmlFor="email">Email address</Label>
                <InputBox>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    disabled={isPending}
                    data-state={emailState}
                    aria-invalid={errors.email || emailError ? 'true' : 'false'}
                    aria-describedby={errors.email || emailError ? 'email-error' : undefined}
                    {...registerField('email', { onBlur: handleEmailBlur })}
                  />
                </InputBox>
                {errors.email && (
                  <HelpText $variant="error" id="email-error">
                    <AlertCircle size={14} style={{ flexShrink: 0 }} />
                    {errors.email.message}
                  </HelpText>
                )}
                {emailError && !errors.email && (
                  <HelpText $variant="error" id="email-error">
                    <AlertCircle size={14} style={{ flexShrink: 0 }} />
                    {emailError}
                  </HelpText>
                )}
                {isCheckingEmail && !errors.email && !emailError && (
                  <HelpText $variant="info">
                    <Loader size={13} className="spin" style={{ animation: 'spin 1s linear infinite' }} />
                    Checking availability…
                  </HelpText>
                )}
                {emailSuccessful && !errors.email && !emailError && (
                  <HelpText $variant="success">
                    <CheckCircle2 size={14} style={{ flexShrink: 0 }} />
                    Email available
                  </HelpText>
                )}
              </FieldGroup>

              {/* Display Name */}
              <FieldGroup>
                <Label htmlFor="displayName">Display name</Label>
                <InputBox>
                  <Input
                    id="displayName"
                    type="text"
                    placeholder="How should we call you?"
                    disabled={isPending}
                    data-state={errors.displayName ? 'error' : undefined}
                    aria-invalid={errors.displayName ? 'true' : 'false'}
                    aria-describedby={errors.displayName ? 'displayName-error' : undefined}
                    {...registerField('displayName')}
                  />
                </InputBox>
                {errors.displayName && (
                  <HelpText $variant="error" id="displayName-error">
                    <AlertCircle size={14} style={{ flexShrink: 0 }} />
                    {errors.displayName.message}
                  </HelpText>
                )}
              </FieldGroup>
            </FormBlock>

            {/* ── Security Section ───────────────────────────────────────── */}
            <SectionLabel $delay="0.1s">
              <SectionDot />
              <SectionTitle>Security</SectionTitle>
              <SectionLine />
            </SectionLabel>

            <FormBlock>
              {/* Password */}
              <FieldGroup>
                <Label htmlFor="password">Password</Label>
                <InputBox>
                  <PasswordInput
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Create a strong password"
                    disabled={isPending}
                    data-state={errors.password ? 'error' : undefined}
                    aria-invalid={errors.password ? 'true' : 'false'}
                    aria-describedby={errors.password ? 'password-error' : undefined}
                    {...registerField('password')}
                  />
                  <EyeBtn
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    disabled={isPending}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </EyeBtn>
                </InputBox>
                {errors.password && (
                  <HelpText $variant="error" id="password-error">
                    <AlertCircle size={14} style={{ flexShrink: 0 }} />
                    {errors.password.message}
                  </HelpText>
                )}
                {password && <PasswordStrengthMeter password={password} />}
              </FieldGroup>

              {/* Confirm Password */}
              <FieldGroup>
                <Label htmlFor="confirmPassword">Confirm password</Label>
                <InputBox>
                  <PasswordInput
                    id="confirmPassword"
                    type={showConfirm ? 'text' : 'password'}
                    placeholder="Repeat your password"
                    disabled={isPending}
                    data-state={errors.confirmPassword ? 'error' : undefined}
                    aria-invalid={errors.confirmPassword ? 'true' : 'false'}
                    aria-describedby={errors.confirmPassword ? 'confirmPassword-error' : undefined}
                    {...registerField('confirmPassword')}
                  />
                  <EyeBtn
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    aria-label={showConfirm ? 'Hide confirm password' : 'Show confirm password'}
                    disabled={isPending}
                  >
                    {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                  </EyeBtn>
                </InputBox>
                {errors.confirmPassword && (
                  <HelpText $variant="error" id="confirmPassword-error">
                    <AlertCircle size={14} style={{ flexShrink: 0 }} />
                    {errors.confirmPassword.message}
                  </HelpText>
                )}
              </FieldGroup>
            </FormBlock>

            {/* ── Terms ─────────────────────────────────────────────────── */}
            <SectionLabel $delay="0.15s">
              <SectionDot />
              <SectionTitle>Agreement</SectionTitle>
              <SectionLine />
            </SectionLabel>

            <FormBlock style={{ marginBottom: '0' }}>
              <TermsRow>
                <input
                  type="checkbox"
                  {...registerField('acceptTerms')}
                  disabled={isPending}
                  aria-invalid={errors.acceptTerms ? 'true' : 'false'}
                  aria-describedby={errors.acceptTerms ? 'terms-error' : undefined}
                />
                <TermsText>
                  I agree to the{' '}
                  <Link href="/terms">Terms of Service</Link> and{' '}
                  <Link href="/privacy">Privacy Policy</Link>
                </TermsText>
              </TermsRow>
              {errors.acceptTerms && (
                <HelpText $variant="error" id="terms-error">
                  <AlertCircle size={14} style={{ flexShrink: 0 }} />
                  {errors.acceptTerms.message}
                </HelpText>
              )}
            </FormBlock>

            {/* ── Submit ────────────────────────────────────────────────── */}
            <SubmitBtn
              type="submit"
              disabled={isPending || !isFormValid}
              style={{ marginTop: '1.5rem' }}
            >
              {isPending ? (
                <>
                  <Loader size={18} className="spin" />
                  Creating account…
                </>
              ) : (
                <>
                  Create Account
                  <ArrowIcon size={18} />
                </>
              )}
            </SubmitBtn>

            <SecurityBadge>
              <Shield size={14} />
              Your data is encrypted and never sold
            </SecurityBadge>
          </form>
      

        <Footer>
          <FooterText>
            Already have an account?{' '}
            <FooterLink href="/login">Sign in here</FooterLink>
          </FooterText>
          <SupportLink href="/contact">Questions? Contact our support team</SupportLink>
        </Footer>
      </Wrap>
    </Page>
  )
}