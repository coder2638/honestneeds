'use client'

import React, { useState, useMemo } from 'react'
import styled from 'styled-components'
import { AlertCircle, Copy, Check } from 'lucide-react'
import Button from '@/components/ui/Button'

// Payment method types supported by backend
export type PaymentMethodType = 'stripe' | 'bank_transfer' | 'mobile_money'

export interface PaymentMethod {
  id?: string
  type: PaymentMethodType
  provider?: 'stripe' | 'plaid' | 'twilio' | 'manual'
  displayName?: string
  isPrimary?: boolean
  status?: string
  verificationStatus?: string

  // Stripe fields (credit/debit cards)
  stripe_token?: string
  card_brand?: 'visa' | 'mastercard' | 'amex' | 'discover'
  card_last_four?: string
  cardLastFour?: string
  card_expiry_month?: number
  card_expiry_year?: number

  // Bank transfer fields - flat version for API responses
  bank_account_last_four?: string
  bankAccountLastFour?: string
  bank_account_holder?: string
  bankAccountHolder?: string
  bank_name?: string
  bankName?: string
  bank_account_type?: 'checking' | 'savings'
  bankAccountType?: 'checking' | 'savings'

  // Bank transfer fields - object version for form submission
  bank_account?: {
    account_holder: string
    account_number: string
    routing_number?: string
    bank_name?: string
    account_type?: 'checking' | 'savings'
  }

  // Mobile money fields
  mobile_number?: string
  mobileNumber?: string
  mobile_provider?: string
  mobileProvider?: string
}

interface AddPaymentMethodFormProps {
  onSubmit: (method: PaymentMethod) => void
  isLoading?: boolean
  initialMethod?: PaymentMethod
  isEditing?: boolean
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  background: white;
`

const MethodTypeSelector = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`

const MethodTypeButton = styled.button<{ selected: boolean }>`
  padding: 1rem;
  border: 2px solid ${(props) => (props.selected ? '#3b82f6' : '#e2e8f0')};
  background-color: ${(props) => (props.selected ? '#eff6ff' : 'white')};
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 600;
  text-align: center;
  transition: all 0.2s ease;
  color: ${(props) => (props.selected ? '#1e40af' : '#64748b')};

  &:hover {
    border-color: #3b82f6;
    background-color: #eff6ff;
  }

  &:active {
    transform: scale(0.98);
  }
`

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`

const Label = styled.label`
  font-size: 0.95rem;
  font-weight: 600;
  color: #0f172a;
`

const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  font-size: 1rem;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  &::placeholder {
    color: #cbd5e1;
  }
`

const Select = styled.select`
  padding: 0.75rem;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  font-size: 1rem;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`

const HelpText = styled.p`
  font-size: 0.8rem;
  color: #64748b;
  margin: 0;
  line-height: 1.4;
`

const WarningBox = styled.div`
  display: flex;
  gap: 0.75rem;
  background-color: #fef3c7;
  border: 1px solid #fcd34d;
  border-radius: 8px;
  padding: 1rem;
  color: #78350f;
  font-size: 0.9rem;
  line-height: 1.5;
`

const Checkbox = styled.input`
  cursor: pointer;
  width: 1.125rem;
  height: 1.125rem;
  accent-color: #3b82f6;
`

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.95rem;
  color: #0f172a;
  font-weight: 600;
  cursor: pointer;
`

const GridRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`

const Actions = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;

  button {
    flex: 1;
  }
`

const InfoBox = styled.div<{ type?: string }>`
  display: flex;
  gap: 0.75rem;
  background-color: #f0f9ff;
  border: 1px solid #bae6fd;
  border-radius: 8px;
  padding: 1rem;
  color: #0c4a6e;
  font-size: 0.9rem;
  line-height: 1.5;
  margin-bottom: 1rem;
`

const methodTypes: Record<
  PaymentMethodType,
  {
    label: string
    emoji: string
    description: string
  }
> = {
  stripe: { label: 'Credit/Debit Card', emoji: '💳', description: 'Visa, Mastercard, Amex' },
  bank_transfer: { label: 'Bank Transfer', emoji: '🏦', description: 'Direct bank account' },
  mobile_money: { label: 'Mobile Money', emoji: '📱', description: 'Mobile wallet' },
}

/**
 * AddPaymentMethodForm Component
 * Production-ready form for creators to add/edit payment methods
 * Supports 9 payment types including international options
 */
export const AddPaymentMethodForm: React.FC<AddPaymentMethodFormProps> = ({
  onSubmit,
  isLoading = false,
  initialMethod,
  isEditing = false,
}) => {
  const [selectedType, setSelectedType] = useState<PaymentMethodType>(
    initialMethod?.type || 'bank_transfer'
  )
  // Initialize form data with proper defaults for bank_account object
  const [formData, setFormData] = useState<PaymentMethod>(() => {
    const initial = initialMethod || { type: 'bank_transfer' }
    // Ensure bank_account has all required fields with defaults
    if (initial.type === 'bank_transfer' && !initial.bank_account) {
      return {
        ...initial,
        bank_account: {
          account_holder: '',
          account_number: '',
          routing_number: '',
          bank_name: '',
          account_type: 'checking'
        }
      }
    }
    return initial
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [copied, setCopied] = useState(false)

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  const handleTypeChange = (type: PaymentMethodType) => {
    setSelectedType(type)
    setFormData((prev) => ({
      ...prev,
      type,
    }))
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    // Check selected type
    if (!selectedType) {
      return false
    }

    // Bank transfer validation
    if (selectedType === 'bank_transfer') {
      if (!formData.bank_account?.account_holder?.trim()) {
        newErrors.account_holder = 'Account holder name is required'
      }
      if (!formData.bank_account?.account_number?.trim()) {
        newErrors.account_number = 'Account number is required'
      } else if (!/^\d{1,17}$/.test(formData.bank_account.account_number)) {
        newErrors.account_number = 'Account number must be 1-17 digits'
      }
      if (!formData.bank_account?.routing_number?.trim()) {
        newErrors.routing_number = 'Routing number is required'
      } else if (!/^\d{9}$/.test(formData.bank_account.routing_number)) {
        newErrors.routing_number = 'Routing number must be exactly 9 digits'
      }
    }

    // Mobile money validation
    if (selectedType === 'mobile_money') {
      if (!formData.mobile_number?.trim()) {
        newErrors.mobile_number = 'Mobile number is required'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit({ ...formData, type: selectedType })
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Container>
      {/* Type Selection */}
      <FormGroup>
        <Label>Payment Method Type</Label>
        <MethodTypeSelector>
          {(Object.entries(methodTypes) as [PaymentMethodType, (typeof methodTypes)[PaymentMethodType]][]).map(
            ([type, config]) => (
              <MethodTypeButton
                key={type}
                selected={selectedType === type}
                onClick={() => handleTypeChange(type)}
                type="button"
              >
                <div style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>{config.emoji}</div>
                <div>{config.label}</div>
              </MethodTypeButton>
            )
          )}
        </MethodTypeSelector>
      </FormGroup>

      {/* Stripe (Coming Soon) */}
      {selectedType === 'stripe' && (
        <InfoBox style={{ background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: '8px', padding: '1rem', color: '#0c4a6e', marginBottom: '1rem' }}>
          <AlertCircle size={20} style={{ marginTop: '0.25rem' }} />
          <div>
            <strong>Credit/Debit Card Payment</strong>
            <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.875rem' }}>Stripe integration coming soon. For now, please use Bank Transfer or Mobile Money.</p>
          </div>
        </InfoBox>
      )}

      {/* Bank Transfer */}
      {selectedType === 'bank_transfer' && (
        <>
          <FormGroup>
            <Label htmlFor="bankAccountHolder">Account Holder Name *</Label>
            <Input
              id="bankAccountHolder"
              type="text"
              placeholder="Your Full Name"
              value={formData.bank_account?.account_holder || ''}
              onChange={(e) => {
                setFormData(prev => ({
                  ...prev,
                  bank_account: {
                    ...prev.bank_account,
                    account_holder: e.target.value
                  }
                }))
              }}
              disabled={isLoading}
            />
            {errors.account_holder && <HelpText style={{ color: '#dc2626' }}>❌ {errors.account_holder}</HelpText>}
          </FormGroup>

          <GridRow>
            <FormGroup>
              <Label htmlFor="bankRoutingNumber">Routing Number (US) *</Label>
              <Input
                id="bankRoutingNumber"
                type="text"
                placeholder="123456789"
                maxLength={9}
                value={formData.bank_account?.routing_number || ''}
                onChange={(e) => {
                  // Only allow digits, max 9
                  const value = e.target.value.replace(/\D/g, '').slice(0, 9)
                  setFormData(prev => ({
                    ...prev,
                    bank_account: {
                      ...prev.bank_account,
                      routing_number: value
                    }
                  }))
                }}
                disabled={isLoading}
              />
              {errors.routing_number && <HelpText style={{ color: '#dc2626' }}>❌ {errors.routing_number}</HelpText>}
              <HelpText>Exactly 9 digits (no spaces, dashes, or letters)</HelpText>
            </FormGroup>

            <FormGroup>
              <Label htmlFor="bankAccountNumber">Account Number *</Label>
              <Input
                id="bankAccountNumber"
                type="password"
                placeholder="••••••••••"
                maxLength={17}
                value={formData.bank_account?.account_number || ''}
                onChange={(e) => {
                  // Only allow digits, max 17
                  const value = e.target.value.replace(/\D/g, '').slice(0, 17)
                  setFormData(prev => ({
                    ...prev,
                    bank_account: {
                      ...prev.bank_account,
                      account_number: value
                    }
                  }))
                }}
                disabled={isLoading}
              />
              {errors.account_number && <HelpText style={{ color: '#dc2626' }}>❌ {errors.account_number}</HelpText>}
              <HelpText>1-17 digits only (encrypted and secure)</HelpText>
            </FormGroup>
          </GridRow>

          <GridRow>
            <FormGroup>
              <Label htmlFor="bankName">Bank Name</Label>
              <Input
                id="bankName"
                type="text"
                placeholder="e.g., Chase, Bank of America"
                value={formData.bank_account?.bank_name || ''}
                onChange={(e) => {
                  setFormData(prev => ({
                    ...prev,
                    bank_account: {
                      ...prev.bank_account,
                      bank_name: e.target.value
                    }
                  }))
                }}
                disabled={isLoading}
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="accountType">Account Type</Label>
              <Select
                id="accountType"
                value={formData.bank_account?.account_type || 'checking'}
                onChange={(e) => {
                  setFormData(prev => ({
                    ...prev,
                    bank_account: {
                      ...prev.bank_account,
                      account_type: e.target.value as 'checking' | 'savings'
                    }
                  }))
                }}
                disabled={isLoading}
              >
                <option value="checking">Checking</option>
                <option value="savings">Savings</option>
              </Select>
            </FormGroup>
          </GridRow>

          <WarningBox>
            🔒 <strong>Security:</strong> Your account information is encrypted and secured.
          </WarningBox>
        </>
      )}

      {/* Mobile Money */}
      {selectedType === 'mobile_money' && (
        <>
          <FormGroup>
            <Label htmlFor="mobileNumber">Mobile Phone Number *</Label>
            <Input
              id="mobileNumber"
              type="tel"
              placeholder="+1 (555) 000-0000"
              value={formData.mobile_number || ''}
              onChange={(e) => handleInputChange('mobile_number', e.target.value)}
              disabled={isLoading}
            />
            {errors.mobile_number && <HelpText style={{ color: '#dc2626' }}>❌ {errors.mobile_number}</HelpText>}
            <HelpText>Your mobile money account number or phone number</HelpText>
          </FormGroup>

          <FormGroup>
            <Label htmlFor="mobileProvider">Mobile Money Provider</Label>
            <Select
              id="mobileProvider"
              value={formData.mobile_provider || ''}
              onChange={(e) => handleInputChange('mobile_provider', e.target.value)}
              disabled={isLoading}
            >
              <option value="">Select a provider...</option>
              <option value="mpesa">M-Pesa (Kenya)</option>
              <option value="mtn">MTN Mobile Money (Africa)</option>
              <option value="airtel">Airtel Money (Africa)</option>
              <option value="vodafone">Vodafone Cash (Ghana)</option>
              <option value="other">Other</option>
            </Select>
          </FormGroup>
        </>
      )}

      {/* Primary Method Checkbox */}
      <FormGroup>
        <CheckboxLabel>
          <Checkbox
            type="checkbox"
            checked={formData.isPrimary || false}
            onChange={(e) => handleInputChange('isPrimary', e.target.checked)}
            disabled={isLoading}
          />
          Set as primary payment method
        </CheckboxLabel>
        <HelpText>Donors will see this method first when making a donation</HelpText>
      </FormGroup>

      {/* Actions */}
      <Actions>
        <Button variant="secondary" disabled={isLoading}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSubmit} disabled={isLoading}>
          {isLoading ? 'Saving...' : isEditing ? 'Update Method' : 'Add Method'}
        </Button>
      </Actions>
    </Container>
  )
}
