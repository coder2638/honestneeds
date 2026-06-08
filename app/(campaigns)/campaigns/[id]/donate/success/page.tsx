'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useParams } from 'next/navigation'
import styled from 'styled-components'
import { apiClient } from '@/lib/api'
import { CheckCircle, AlertCircle, Loader } from 'lucide-react'

const Container = styled.div`
  width: 100%;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem 1rem;
  display: flex;
  align-items: center;
  justify-content: center;

  @media (max-width: 640px) {
    padding: 1rem;
  }
`

const Content = styled.div`
  max-width: 600px;
  width: 100%;
  background-color: white;
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  text-align: center;

  @media (max-width: 640px) {
    border-radius: 0.75rem;
    padding: 1.5rem;
  }
`

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
`

const LoadingIcon = styled(Loader)`
  width: 3rem;
  height: 3rem;
  color: #6366f1;
  animation: spin 1s linear infinite;

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`

const SuccessContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
`

const SuccessIcon = styled(CheckCircle)`
  width: 4rem;
  height: 4rem;
  color: #10b981;
`

const Title = styled.h1`
  font-size: 1.875rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0;

  @media (max-width: 640px) {
    font-size: 1.5rem;
  }
`

const Subtitle = styled.p`
  font-size: 1rem;
  color: #64748b;
  margin: 0;
  line-height: 1.6;
`

const Details = styled.div`
  background-color: #f8fafc;
  border-radius: 0.5rem;
  padding: 1.5rem;
  text-align: left;
  margin: 1.5rem 0;
`

const DetailRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
  border-bottom: 1px solid #e2e8f0;

  &:last-child {
    border-bottom: none;
  }
`

const DetailLabel = styled.span`
  color: #64748b;
  font-weight: 500;
`

const DetailValue = styled.span`
  color: #0f172a;
  font-weight: 600;
  word-break: break-all;
`

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
`

const ErrorIcon = styled(AlertCircle)`
  width: 4rem;
  height: 4rem;
  color: #ef4444;
`

const ErrorTitle = styled.h1`
  font-size: 1.875rem;
  font-weight: 700;
  color: #ef4444;
  margin: 0;

  @media (max-width: 640px) {
    font-size: 1.5rem;
  }
`

const ErrorSubtitle = styled.p`
  font-size: 1rem;
  color: #64748b;
  margin: 0;
  line-height: 1.6;
`

const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 2rem;
  flex-wrap: wrap;

  @media (max-width: 640px) {
    flex-direction: column;
  }
`

const Button = styled.button<{ variant?: 'primary' | 'secondary' }>`
  padding: 0.75rem 1.5rem;
  background-color: ${(props) => (props.variant === 'secondary' ? '#e2e8f0' : '#6366f1')};
  color: ${(props) => (props.variant === 'secondary' ? '#0f172a' : 'white')};
  border: none;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 1rem;

  &:hover {
    background-color: ${(props) => (props.variant === 'secondary' ? '#cbd5e1' : '#4f46e5')};
  }

  @media (max-width: 640px) {
    width: 100%;
  }
`

interface SessionStatus {
  success: boolean
  session?: {
    id: string
    status: string
    paymentIntentStatus?: string
    amountTotal?: number
    customerEmail?: string
    metadata?: Record<string, string | number | boolean>
  }
  error?: string
}

export default function DonationSuccessPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const params = useParams()
  const campaignId = params.id as string

  const [sessionStatus, setSessionStatus] = useState<SessionStatus | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchSessionStatus = async () => {
      try {
        const sessionId = searchParams.get('session_id')

        if (!sessionId) {
          setError('No session ID found. Unable to verify payment.')
          setIsLoading(false)
          return
        }

        console.log('📝 Fetching Stripe session status', { sessionId })

        // Fetch session status from backend
        const response = await apiClient.get(`/payments/checkout-session/${sessionId}`)

        console.log('✅ Session status retrieved', response.data)
        setSessionStatus(response.data)

        // If payment was successful, optionally update frontend state
        if (response.data.session?.status === 'paid') {
          console.log('💰 Payment successful! Session ID:', sessionId)
          // You could save to local storage or update global state here
          sessionStorage.setItem(`donation_success_${campaignId}`, 'true')
        }
      } catch (err) {
        const error = err as { response?: { data?: { message?: string } }; message?: string }
        const errorMessage = error?.response?.data?.message || error?.message || 'Failed to verify payment status'
        console.error('❌ Error fetching session status:', errorMessage)
        setError(errorMessage)
      } finally {
        setIsLoading(false)
      }
    }

    fetchSessionStatus()
  }, [searchParams, campaignId])

  // Format currency
  const formatCurrency = (cents?: number) => {
    if (!cents) return '$0.00'
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(cents / 100)
  }

  if (isLoading) {
    return (
      <Container>
        <Content>
          <LoadingContainer>
            <LoadingIcon />
            <Subtitle>Verifying your payment...</Subtitle>
          </LoadingContainer>
        </Content>
      </Container>
    )
  }

  if (error || !sessionStatus?.success || sessionStatus.session?.status !== 'paid') {
    return (
      <Container>
        <Content>
          <ErrorContainer>
            <ErrorIcon />
            <ErrorTitle>Payment Verification Failed</ErrorTitle>
            <ErrorSubtitle>{error || 'We could not verify your payment. Please try again or contact support.'}</ErrorSubtitle>

            <ActionButtons>
              <Button onClick={() => router.push(`/campaigns/${campaignId}/donate`)}>Try Again</Button>
              <Button variant="secondary" onClick={() => router.push('/campaigns')}>
                Browse Campaigns
              </Button>
            </ActionButtons>
          </ErrorContainer>
        </Content>
      </Container>
    )
  }

  // Success state
  const session = sessionStatus.session!
  const amountUSD = formatCurrency(session.amountTotal)

  return (
    <Container>
      <Content>
        <SuccessContainer>
          <SuccessIcon />
          <div>
            <Title>💚 Donation Received!</Title>
            <Subtitle>Thank you for your generous support! Your donation has been successfully processed.</Subtitle>
          </div>

          {session && (
            <Details>
              <DetailRow>
                <DetailLabel>Amount Donated</DetailLabel>
                <DetailValue>{amountUSD}</DetailValue>
              </DetailRow>

              {session.customerEmail && (
                <DetailRow>
                  <DetailLabel>Email</DetailLabel>
                  <DetailValue>{session.customerEmail}</DetailValue>
                </DetailRow>
              )}

              {session.metadata?.campaignId && (
                <DetailRow>
                  <DetailLabel>Campaign ID</DetailLabel>
                  <DetailValue>{session.metadata.campaignId}</DetailValue>
                </DetailRow>
              )}

              <DetailRow>
                <DetailLabel>Payment Status</DetailLabel>
                <DetailValue style={{ color: '#10b981' }}>Verified ✓</DetailValue>
              </DetailRow>

              <DetailRow>
                <DetailLabel>Session ID</DetailLabel>
                <DetailValue>{session.id}</DetailValue>
              </DetailRow>
            </Details>
          )}

          <Subtitle style={{ fontSize: '0.95rem', marginTop: '1rem' }}>
            A confirmation email has been sent to {session.customerEmail || 'your email'}. The creator will receive your donation shortly.
          </Subtitle>

          <ActionButtons>
            <Button onClick={() => router.push('/campaigns')}>Browse More Campaigns</Button>
            <Button variant="secondary" onClick={() => router.push(`/campaigns/${campaignId}`)}>
              View Campaign
            </Button>
          </ActionButtons>
        </SuccessContainer>
      </Content>
    </Container>
  )
}
