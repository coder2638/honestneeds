'use client'

import { useEffect, useCallback, useMemo, useState, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useParams } from 'next/navigation'
import { toast } from 'react-toastify'
import styled from 'styled-components'
import { useDonationWizardStore } from '@/store/donationWizardStore'
import { StepIndicator, WizardActions } from './DonationWizardSteps'
import { DonationStep1Amount, type Step1AmountRef } from './DonationStep1Amount'
import { DonationStep2PaymentMethod } from './DonationStep2PaymentMethod'
import { DonationStep3Confirmation } from './DonationStep3Confirmation'
import { DonationSuccessModal } from './DonationSuccessModal'
import { useCreateDonation } from '@/api/hooks/useDonations'
import { useCampaign } from '@/api/hooks/useCampaigns'
import type { DonationPaymentMethod, DonationConfirmationFormData } from '@/utils/validationSchemas'

interface DonationWizardProps {
  campaignId: string
}

const Container = styled.div`
  width: 100%;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem 1rem;

  @media (max-width: 640px) {
    padding: 1rem;
  }
`

const Content = styled.div`
  max-width: 700px;
  margin: 0 auto;
  background-color: white;
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);

  @media (max-width: 640px) {
    border-radius: 0.75rem;
    padding: 1.5rem;
  }
`

const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  color: #64748b;
  font-size: 1rem;
`

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  text-align: center;
`

const ErrorTitle = styled.h2`
  color: #ef4444;
  margin-bottom: 0.5rem;
`

const ErrorMessage = styled.p`
  color: #64748b;
  margin-bottom: 1.5rem;
`

const ReturnButton = styled.button`
  padding: 0.75rem 1.5rem;
  background-color: #6366f1;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: #4f46e5;
  }
`

export interface DonationWizardContentProps {
  campaignId: string
  campaignTitle: string
  creatorName: string
  paymentMethods: Array<{ type: string; [key: string]: any }>
  onDonationSuccess: (transactionId: string, amount: number) => void
}

/**
 * DonationWizardContent Component
 * Orchestrates the 3-step donation wizard flow
 */
function DonationWizardContent({
  campaignId,
  campaignTitle,
  creatorName,
  paymentMethods,
  onDonationSuccess,
}: DonationWizardContentProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [referralCode, setReferralCode] = useState<string | null>(null)
  const step1FormRef = useRef<Step1AmountRef>(null)

  const {
    currentStep,
    formData,
    errors,
    isSubmitting,
    setCurrentStep,
    setAmount,
    setPaymentMethod,
    setErrors,
    setIsSubmitting,
    updateFormData,
    setCampaignId,
  } = useDonationWizardStore()

  const { mutateAsync: createDonation } = useCreateDonation()

  // ✅ Extract referral code from URL params or session storage
  useEffect(() => {
    const refFromUrl = searchParams.get('ref')
    if (refFromUrl) {
      setReferralCode(refFromUrl)
      // Store in session storage for persistence across wizard steps
      sessionStorage.setItem(`referral_code_${campaignId}`, refFromUrl)
      console.log('🔗 DonationWizard: Referral code found in URL', { ref: refFromUrl })
    } else {
      // Try to get from session storage (in case user navigated back)
      const refFromStorage = sessionStorage.getItem(`referral_code_${campaignId}`)
      if (refFromStorage) {
        setReferralCode(refFromStorage)
        console.log('🔗 DonationWizard: Referral code found in session storage', { ref: refFromStorage })
      }
    }
  }, [campaignId, searchParams])

  // Initialize campaign ID
  useEffect(() => {
    setCampaignId(campaignId)
  }, [campaignId, setCampaignId])

  // Validate step 1
  const validateStep1 = useCallback(() => {
    const stepErrors: Record<string, string> = {}
    if (!formData.amount || formData.amount < 1 || formData.amount > 10000) {
      stepErrors.amount = 'Please enter a valid donation amount'
    }
    setErrors(stepErrors)
    return Object.keys(stepErrors).length === 0
  }, [formData.amount, setErrors])

  // Validate step 2
  const validateStep2 = useCallback(() => {
    const stepErrors: Record<string, string> = {}
    if (!formData.paymentMethod) {
      stepErrors.paymentMethod = 'Please select a payment method'
    }
    setErrors(stepErrors)
    return Object.keys(stepErrors).length === 0
  }, [formData.paymentMethod, setErrors])

  // Validate step 3
  const validateStep3 = useCallback(() => {
    const stepErrors: Record<string, string> = {}
    if (!formData.agreePaymentSent) {
      stepErrors.agreement = 'You must confirm that you have sent payment'
    }
    setErrors(stepErrors)
    return Object.keys(stepErrors).length === 0
  }, [formData.agreePaymentSent, setErrors])

  const validateStep = useCallback(() => {
    switch (currentStep) {
      case 1:
        return validateStep1()
      case 2:
        return validateStep2()
      case 3:
        return validateStep3()
      default:
        return false
    }
  }, [currentStep, validateStep1, validateStep2, validateStep3])

  const handleNext = useCallback(() => {
    // For step 1, trigger form submission instead of directly validating
    if (currentStep === 1) {
      step1FormRef.current?.submitForm()
      return
    }
    
    // For other steps, validate normally
    if (validateStep()) {
      setCurrentStep(currentStep + 1)
    }
  }, [validateStep, setCurrentStep, currentStep])

  const handleBack = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    } else {
      router.back()
    }
  }, [currentStep, setCurrentStep, router])

  const handleStep1Next = useCallback(
    (amount: number) => {
      setAmount(amount)
      // After form submission, directly advance (don't call handleNext which would try to submit again)
      setCurrentStep(currentStep + 1)
    },
    [setAmount, setCurrentStep, currentStep]
  )

  const handleStep2Next = useCallback(
    (method: DonationPaymentMethod) => {
      setPaymentMethod(method)
      // Auto-proceed when method selected (can click "Confirm" in next step)
      setCurrentStep(currentStep + 1)
    },
    [setPaymentMethod, setCurrentStep, currentStep]
  )

  const handleStep3Submit = useCallback(
    async (data: DonationConfirmationFormData) => {
      setIsSubmitting(true)
      try {
        // Extract payment method type from the payment method object
        const paymentMethodType = typeof formData.paymentMethod === 'string' 
          ? formData.paymentMethod 
          : (formData.paymentMethod as any)?.type

        // ✅ Include referral code if available (for share conversion)
        const donationPayload: any = {
          campaignId,
          amount: formData.amount || 0, // Send as dollars (backend expects dollars)
          paymentMethod: paymentMethodType,
          screenshotProof: data.screenshotProof,
        }

        if (referralCode) {
          donationPayload.referralCode = referralCode
          console.log('🔗 DonationWizard: Submitting donation with referral code', { 
            referralCode,
            amount: formData.amount
          })
        }

        const result = await createDonation(donationPayload)

        // ✅ Toast notification is handled by useCreateDonation hook
        // If share reward exists, show additional info (hook handles base success)
        if (result.share_reward) {
          toast.info(
            `🎉 You also earned $${result.share_reward.amount_dollars} from your share (pending 30-day verification)`,
            { autoClose: 6000, toastId: 'donation-share-reward' }
          )
        }
        onDonationSuccess(result.transactionId, formData.amount || 0)
      } catch (error: any) {
        const errorMessage = error?.response?.data?.message || error?.message || 'Failed to submit donation'
        toast.error(errorMessage)
        setIsSubmitting(false)
      }
    },
    [campaignId, formData, createDonation, onDonationSuccess, setIsSubmitting, referralCode]
  )

  // Calculate canContinue - allow progression, validation happens on form submit
  const canContinue = useMemo(() => {
    // Always allow Next button (form validation happens on submission)
    if (currentStep < 3) {
      return true
    }
    // Step 3 (final confirmation) requires agreement checkbox
    return !!formData.agreePaymentSent
  }, [currentStep, formData.agreePaymentSent])

  return (
    <>
      <StepIndicator currentStep={currentStep} totalSteps={3} />

      {currentStep === 1 && (
        <DonationStep1Amount ref={step1FormRef} initialAmount={formData.amount || 25} onNext={handleStep1Next} isLoading={isSubmitting} />
      )}

      {currentStep === 2 && formData.amount && (
        <DonationStep2PaymentMethod
          paymentMethods={paymentMethods}
          creatorName={creatorName}
          amount={formData.amount}
          onNext={handleStep2Next}
          isLoading={isSubmitting}
        />
      )}

      {currentStep === 3 && formData.amount && formData.paymentMethod && (
        <DonationStep3Confirmation
          amount={formData.amount}
          paymentMethod={formData.paymentMethod as DonationPaymentMethod}
          campaignTitle={campaignTitle}
          onSubmit={handleStep3Submit}
          isLoading={isSubmitting}
        />
      )}

      {currentStep < 3 && (
        <WizardActions
          currentStep={currentStep}
          totalSteps={3}
          canGoBack={true}
          canContinue={canContinue}
          onBack={handleBack}
          onNext={handleNext}
          isSubmitting={isSubmitting}
        />
      )}
    </>
  )
}

/**
 * Main DonationWizard Component
 * Wrapper component that handles loading and error states
 * Fetches campaign details including payment directory
 */
export function DonationWizard({ campaignId }: DonationWizardProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [showSuccess, setShowSuccess] = useState(false)
  const [referralCode, setReferralCode] = useState<string | null>(null)
  const [successData, setSuccessData] = useState<{
    transactionId: string
    amount: number
    referralCode?: string | null
  } | null>(null)

  const { data: campaign, isLoading: isCampaignLoading, error: campaignError } = useCampaign(campaignId)

  // Extract referral code from URL params when component mounts
  useEffect(() => {
    const refFromUrl = searchParams.get('ref')
    if (refFromUrl) {
      setReferralCode(refFromUrl)
      console.log('🔗 DonationWizard: Referral code found in URL', { ref: refFromUrl })
    }
  }, [searchParams])

  if (isCampaignLoading) {
    return (
      <Container>
        <Content>
          <LoadingContainer>Loading campaign details...</LoadingContainer>
        </Content>
      </Container>
    )
  }

  if (campaignError || !campaign) {
    return (
      <Container>
        <Content>
          <ErrorContainer>
            <ErrorTitle>Campaign Not Found</ErrorTitle>
            <ErrorMessage>We couldn't find the campaign you're trying to donate to. Please try again.</ErrorMessage>
            <ReturnButton onClick={() => router.push('/campaigns')}>Browse Campaigns</ReturnButton>
          </ErrorContainer>
        </Content>
      </Container>
    )
  }

  // Check if payment methods are available
  const paymentMethods = campaign?.payment_methods || []
  if (!paymentMethods || paymentMethods.length === 0) {
    return (
      <Container>
        <Content>
          <ErrorContainer>
            <ErrorTitle>Payment Methods Unavailable</ErrorTitle>
            <ErrorMessage>
              This campaign does not have payment methods configured. Please contact the creator or try another campaign.
            </ErrorMessage>
            <ReturnButton onClick={() => router.push(`/campaigns/${campaignId}`)}>Return to Campaign</ReturnButton>
          </ErrorContainer>
        </Content>
      </Container>
    )
  }

  // Check if user is campaign creator (prevent self-donation)
  const userIdStr = typeof window !== 'undefined' ? localStorage.getItem('userId') : null
  if (userIdStr === campaign.creator_id) {
    return (
      <Container>
        <Content>
          <ErrorContainer>
            <ErrorTitle>Cannot Donate to Your Own Campaign</ErrorTitle>
            <ErrorMessage>You cannot donate to campaigns you created. Support other campaigns instead!</ErrorMessage>
            <ReturnButton onClick={() => router.push('/campaigns')}>Browse Other Campaigns</ReturnButton>
          </ErrorContainer>
        </Content>
      </Container>
    )
  }

  const handleDonationSuccess = (transactionId: string, amount: number) => {
    setSuccessData({ transactionId, amount, referralCode })
    setShowSuccess(true)
  }

  return (
    <Container>
      <Content>
        {!showSuccess && (
          <DonationWizardContent
            campaignId={campaignId}
            campaignTitle={campaign.title}
            creatorName={campaign.creator_name || 'Creator'}
            paymentMethods={paymentMethods}
            onDonationSuccess={handleDonationSuccess}
          />
        )}
      </Content>

      {showSuccess && successData && (
        <DonationSuccessModal
          isOpen={showSuccess}
          transactionId={successData.transactionId}
          amount={successData.amount}
          campaignId={campaignId}
          campaignTitle={campaign.title}
          referralCode={successData.referralCode}
        />
      )}
    </Container>
  )
}
