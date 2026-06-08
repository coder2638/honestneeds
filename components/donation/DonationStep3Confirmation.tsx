'use client'

import { useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import styled from 'styled-components'
import { Upload, X, FileText, AlertCircle } from 'lucide-react'
import { donationConfirmationSchema, type DonationConfirmationFormData, currencyUtils, type DonationPaymentMethod } from '@/utils/validationSchemas'

interface Step3ConfirmationProps {
  amount: number
  paymentMethod: DonationPaymentMethod
  campaignTitle: string
  onSubmit: (data: DonationConfirmationFormData) => void
  isLoading?: boolean
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

const SummaryCard = styled.div`
  background-color: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  padding: 1.5rem;
  margin-bottom: 2rem;
`

const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
  border-bottom: 1px solid #e2e8f0;

  &:last-child {
    border-bottom: none;
  }
`

const SummaryLabel = styled.span`
  color: #64748b;
  font-size: 0.95rem;
`

const SummaryValue = styled.span<{ bold?: boolean }>`
  color: #0f172a;
  font-weight: ${(props) => (props.bold ? 700 : 500)};
  font-size: 0.95rem;
`

const Instructions = styled.div`
  background-color: #ecf0ff;
  border: 1px solid #c7d2fe;
  border-radius: 0.5rem;
  padding: 1rem;
  margin-bottom: 2rem;
  font-size: 0.95rem;
  color: #4f46e5;
  line-height: 1.6;

  strong {
    display: block;
    margin-bottom: 0.5rem;
  }
`

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`

const Label = styled.label`
  display: block;
  font-weight: 600;
  color: #0f172a;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;

  span {
    color: #64748b;
    font-weight: 400;
    margin-left: 0.25rem;
  }
`

const FileInput = styled.input`
  display: none;
`

const FileUploadBox = styled.div<{ isDragging: boolean; hasFile: boolean }>`
  border: 2px dashed ${(props) => (props.isDragging ? '#6366f1' : '#e2e8f0')};
  border-radius: 0.5rem;
  padding: 2rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease;
  background-color: ${(props) => (props.isDragging ? '#ecf0ff' : props.hasFile ? '#f0fdf4' : '#ffffff')};

  &:hover {
    border-color: #6366f1;
  }
`

const UploadIcon = styled(Upload)`
  margin: 0 auto 0.5rem;
  color: #6366f1;
`

const UploadText = styled.p`
  margin: 0;
  color: #0f172a;
  font-weight: 600;
  font-size: 0.95rem;
`

const UploadHint = styled.p`
  margin: 0.25rem 0 0 0;
  color: #64748b;
  font-size: 0.8125rem;
`

const FilePreview = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background-color: #f0fdf4;
  border: 1px solid #dcfce7;
  border-radius: 0.375rem;
  margin-top: 0.75rem;
`

const FileIcon = styled(FileText)`
  color: #10b981;
  flex-shrink: 0;
`

const FileName = styled.span`
  flex: 1;
  color: #0f172a;
  font-weight: 500;
  font-size: 0.875rem;
  word-break: break-all;
`

const RemoveButton = styled.button`
  background: none;
  border: none;
  color: #ef4444;
  cursor: pointer;
  padding: 0.25rem;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: #fee2e2;
    border-radius: 0.25rem;
  }
`

const CheckboxContainer = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
`

const Checkbox = styled.input`
  width: 1.25rem;
  height: 1.25rem;
  margin-top: 0.1875rem;
  cursor: pointer;
  accent-color: #6366f1;
`

const CheckboxLabel = styled.label`
  flex: 1;
  font-size: 0.95rem;
  color: #0f172a;
  cursor: pointer;
  line-height: 1.5;

  strong {
    display: block;
    margin-bottom: 0.25rem;
  }
`

const WarningBox = styled.div`
  display: flex;
  gap: 0.75rem;
  padding: 1rem;
  background-color: #fef3c7;
  border: 1px solid #fcd34d;
  border-radius: 0.5rem;
  margin-bottom: 1.5rem;
  font-size: 0.875rem;
  color: #92400e;
  line-height: 1.5;
`

const WarningIcon = styled(AlertCircle)`
  flex-shrink: 0;
  margin-top: 0.125rem;
`

const SubmitButton = styled.button`
  width: 100%;
  padding: 0.875rem;
  background-color: #6366f1;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 1rem;

  &:hover:not(:disabled) {
    background-color: #4f46e5;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &:focus-visible {
    outline: 2px solid #6366f1;
    outline-offset: 2px;
  }
`

const ErrorMessage = styled.span`
  display: block;
  color: #ef4444;
  font-size: 0.8125rem;
  margin-top: 0.375rem;
  font-weight: 500;
`

const formatPaymentMethodDisplay = (method: DonationPaymentMethod): string => {
  if (!method || !method.type) return 'Payment Method'
  
  switch (method.type) {
    case 'venmo':
      return `Venmo: ${method.username || method.venmo_handle || 'Payment Account'}`
    case 'paypal':
      return `PayPal: ${method.email || 'Payment Account'}`
    case 'cashapp':
      return `Cash App: ${method.cashtag || method.cash_app_handle || 'Payment Account'}`
    case 'bank':
      return `Bank Transfer (Routing: ${method.routingNumber || method.routing_number || '****'})`
    case 'crypto':
      return `${method.cryptoType?.toUpperCase() || method.crypto_type?.toUpperCase() || 'Crypto'} Wallet`
    case 'other':
      return `Other: ${method.details || 'Payment Method'}`
    default:
      return `${method.type}: Payment Method`
  }
}

/**
 * DonationStep3Confirmation Component
 * Third step of donation wizard: confirmation with proof upload
 */
export function DonationStep3Confirmation({
  amount,
  paymentMethod,
  campaignTitle,
  onSubmit,
  isLoading = false,
}: Step3ConfirmationProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const {
    register,
    watch,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<DonationConfirmationFormData>({
    resolver: zodResolver(donationConfirmationSchema),
    mode: 'onChange',
  })

  const screenshotProof = watch('screenshotProof')
  const agreePaymentSent = watch('agreePaymentSent')

  const feeInfo = currencyUtils.calculateFee(amount)

  // formatCurrency expects cents, but calculateFee returns dollars, so multiply by 100
  const formatFeeAmount = (dollars: number) => currencyUtils.formatCurrency(dollars * 100)

  const handleFileSelect = (file: File | null) => {
    if (file && file.size <= 5 * 1024 * 1024) {
      setValue('screenshotProof', file, { shouldValidate: true })
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0])
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      handleFileSelect(e.target.files[0])
    }
  }

  return (
    <Container as="form" onSubmit={handleSubmit(onSubmit)}>
      <Title>Confirm your donation</Title>
      <Subtitle>
        Review your donation details. Please confirm you've sent the payment through your selected method.
      </Subtitle>

      <SummaryCard>
        <SummaryRow>
          <SummaryLabel>Campaign</SummaryLabel>
          <SummaryValue bold>{campaignTitle}</SummaryValue>
        </SummaryRow>
        <SummaryRow>
          <SummaryLabel>Your Donation</SummaryLabel>
          <SummaryValue bold>{formatFeeAmount(feeInfo.gross)}</SummaryValue>
        </SummaryRow>
        <SummaryRow>
          <SummaryLabel>Platform Fee (20%)</SummaryLabel>
          <SummaryValue>{formatFeeAmount(feeInfo.fee)}</SummaryValue>
        </SummaryRow>
        <SummaryRow>
          <SummaryLabel>Creator Receives</SummaryLabel>
          <SummaryValue bold>{formatFeeAmount(feeInfo.net)}</SummaryValue>
        </SummaryRow>
        <SummaryRow>
          <SummaryLabel>Payment Method</SummaryLabel>
          <SummaryValue>{formatPaymentMethodDisplay(paymentMethod)}</SummaryValue>
        </SummaryRow>
      </SummaryCard>

      <Instructions>
        <strong>Next steps:</strong>
        Send {formatFeeAmount(feeInfo.gross)} to the payment method displayed above. Once sent, upload a
        screenshot as proof and confirm below. The creator will review your payment and process it.
      </Instructions>

      <FormGroup>
        <Label>Upload Payment Proof (Optional)</Label>
        <FileUploadBox
          isDragging={isDragging}
          hasFile={!!screenshotProof}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          role="button"
          tabIndex={0}
          onKeyPress={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              fileInputRef.current?.click()
            }
          }}
          aria-label="Upload payment proof screenshot"
        >
          {screenshotProof ? (
            <>
              <FilePreview>
                <FileIcon size={20} />
                <FileName>{screenshotProof.name}</FileName>
                <RemoveButton
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    setValue('screenshotProof', undefined)
                  }}
                  aria-label="Remove file"
                >
                  <X size={20} />
                </RemoveButton>
              </FilePreview>
              <UploadHint>Click to change or upload a different file</UploadHint>
            </>
          ) : (
            <>
              <UploadIcon size={32} aria-hidden="true" />
              <UploadText>Drag and drop your screenshot here</UploadText>
              <UploadHint>or click to browse • Max 5MB • JPEG, PNG, or WebP</UploadHint>
            </>
          )}

          <FileInput
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFileChange}
            disabled={isLoading}
            aria-describedby="file-error"
          />
        </FileUploadBox>
        {errors.screenshotProof && (
          <ErrorMessage id="file-error" role="alert">
            {errors.screenshotProof.message as string}
          </ErrorMessage>
        )}
      </FormGroup>

      <WarningBox>
        <WarningIcon size={18} aria-hidden="true" />
        <span>
          <strong>Important:</strong> Please keep a record of your transaction for your reference. The creator will
          contact you if they need additional information.
        </span>
      </WarningBox>

      <CheckboxContainer>
        <Checkbox
          id="agree-payment-sent"
          type="checkbox"
          disabled={isLoading}
          {...register('agreePaymentSent')}
          aria-describedby={errors.agreePaymentSent ? 'agree-error' : undefined}
        />
        <CheckboxLabel htmlFor="agree-payment-sent">
          <strong>I confirm that I have sent the payment</strong>
          <div style={{ fontSize: '0.875rem', color: '#64748b' }}>
            to the payment method displayed above. I understand that creator will review and process my donation.
          </div>
        </CheckboxLabel>
      </CheckboxContainer>

      {errors.agreePaymentSent && (
        <ErrorMessage id="agree-error" role="alert">
          {errors.agreePaymentSent.message as string}
        </ErrorMessage>
      )}

      <SubmitButton
        type="submit"
        disabled={isLoading || !agreePaymentSent}
        aria-label="Confirm and submit donation"
      >
        {isLoading ? 'Processing...' : 'Confirm Donation'}
      </SubmitButton>
    </Container>
  )
}
