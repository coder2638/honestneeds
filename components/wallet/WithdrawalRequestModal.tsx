/**
 * Withdrawal Request Modal
 * Allows users to initiate withdrawal requests
 */

'use client'

import React, { useState, useMemo, useEffect } from 'react'
import styled from 'styled-components'
import { X, AlertCircle, Loader, DollarSign } from 'lucide-react'
import { useRequestWithdrawal } from '@/api/hooks/useWallet'
import { usePaymentMethods } from '@/api/hooks/usePaymentMethods'
import { Modal } from '@/components/Modal'
import { Button } from '@/components/Button'
import { FormField } from '@/components/FormField'

const ModalContent = styled.div`
  padding: 2rem;
  max-width: 500px;
`

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`

const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
`

const CloseButton = styled.button`
  background: none;
  border: none;
  color: #64748b;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    color: #0f172a;
  }

  svg {
    width: 1.5rem;
    height: 1.5rem;
  }
`

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`

const AmountInput = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }

  &::placeholder {
    color: #cbd5e1;
  }
`

const AmountInputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`

const CurrencySymbol = styled.span`
  position: absolute;
  left: 1rem;
  color: #64748b;
  font-weight: 600;
  font-size: 1.125rem;
  pointer-events: none;
`

const AmountInputField = styled(AmountInput)`
  padding-left: 2.5rem;
`

const InfoBox = styled.div<{ type: 'info' | 'warning' | 'success' }>`
  display: flex;
  gap: 0.75rem;
  padding: 1rem;
  border-radius: 8px;
  font-size: 0.875rem;
  border-left: 4px solid;

  ${(props) => {
    switch (props.type) {
      case 'info':
        return `
          background: #dbeafe;
          border-color: #0284c7;
          color: #0c4a6e;
        `
      case 'warning':
        return `
          background: #fef3c7;
          border-color: #ca8a04;
          color: #713f12;
        `
      case 'success':
        return `
          background: #dcfce7;
          border-color: #16a34a;
          color: #166534;
        `
    }
  }}

  svg {
    width: 1.25rem;
    height: 1.25rem;
    flex-shrink: 0;
  }

  strong {
    display: block;
    margin-bottom: 0.25rem;
  }
`

const PaymentMethodSelect = styled.select`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  background-color: white;
  cursor: pointer;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }

  option {
    padding: 0.5rem;
  }
`

const FeeBreakdown = styled.div`
  background: #f8fafc;
  border-radius: 8px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  font-size: 0.875rem;
`

const FeeRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  &.total {
    font-weight: 700;
    color: #0f172a;
    border-top: 1px solid #e2e8f0;
    padding-top: 0.75rem;
    margin-top: 0.75rem;
  }

  .label {
    color: #64748b;
  }

  .value {
    color: #0f172a;
    font-weight: 600;
  }
`

const LimitInfo = styled.div`
  background: #f0f9ff;
  border: 1px solid #bae6fd;
  border-radius: 8px;
  padding: 1rem;
  font-size: 0.875rem;
  color: #0c4a6e;

  strong {
    display: block;
    margin-bottom: 0.5rem;
  }

  ul {
    margin: 0;
    padding-left: 1.25rem;
  }

  li {
    margin-bottom: 0.25rem;
  }
`

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
`

const CampaignSelect = styled.select`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  background-color: white;
  cursor: pointer;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }

  option {
    padding: 0.5rem;
  }
`

const CampaignBalanceBox = styled.div`
  background: #f0fdf4;
  border: 2px solid #86efac;
  border-radius: 8px;
  padding: 1rem;
  margin-top: 0.75rem;
  font-size: 0.875rem;

  .label {
    color: #64748b;
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .amount {
    font-size: 1.5rem;
    font-weight: 700;
    color: #16a34a;
    margin-top: 0.25rem;
  }

  .details {
    margin-top: 0.75rem;
    padding-top: 0.75rem;
    border-top: 1px solid #86efac;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.5rem;
    font-size: 0.75rem;
    color: #64748b;

    div {
      display: flex;
      justify-content: space-between;
    }

    .value {
      font-weight: 600;
      color: #0f172a;
    }
  }
`

export interface WithdrawalRequestModalProps {
  availableBalance: number // in cents
  onClose: () => void
  onSuccess: () => void
}

/**
 * Withdrawal Request Modal Component
 */
export const WithdrawalRequestModal: React.FC<WithdrawalRequestModalProps> = ({
  availableBalance,
  onClose,
  onSuccess
}) => {
  const [amount, setAmount] = useState('')
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('')
  const [notes, setNotes] = useState('')
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const [selectedCampaignId, setSelectedCampaignId] = useState('')

  // Fetch campaigns with per-campaign balance
  const [campaigns, setCampaigns] = useState<any[]>([])
  const [campaignsLoading, setCampaignsLoading] = useState(false)
  const [campaignsError, setCampaignsError] = useState<string | null>(null)

  const { data: paymentMethods = [], isLoading: methodsLoading, error: methodsError } = usePaymentMethods()
  const { mutate: requestWithdrawal, isPending: isRequesting, error } = useRequestWithdrawal()

  // Fetch campaigns on mount
  useEffect(() => {
    const fetchCampaigns = async () => {
      setCampaignsLoading(true)
      try {
        const response = await fetch('/api/wallet/earning-campaigns', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
          }
        })
        if (!response.ok) throw new Error('Failed to fetch campaigns')
        const data = await response.json()
        console.log('✅ Campaigns loaded:', data.campaigns?.length)
        setCampaigns(data.campaigns || [])
      } catch (err) {
        console.error('❌ Error fetching campaigns:', err)
        setCampaignsError('Failed to load campaigns')
      } finally {
        setCampaignsLoading(false)
      }
    }
    fetchCampaigns()
  }, [])

  const amountCents = Math.round(parseFloat(amount || '0') * 100)
  const minimumWithdrawal = 500 // $5

  // Get selected campaign data
  const selectedCampaign = campaigns.find(c => c.id === selectedCampaignId || c._id === selectedCampaignId)
  const campaignAvailableCents = selectedCampaign?.available_cents || 0

  // Debug logging
  console.log('WithdrawalModal Debug:', {
    amountCents,
    selectedPaymentMethod,
    agreedToTerms,
    selectedCampaignId,
    campaignAvailable: campaignAvailableCents,
    totalCampaigns: campaigns.length,
    campaignsLoading
  })

  // Calculate fees based on payment method
  const feePercentage = useMemo(() => {
    // Ensure paymentMethods is always an array
    const methods = Array.isArray(paymentMethods) ? paymentMethods : []
    const method = methods.find((m) => m.id === selectedPaymentMethod)
    if (!method) return 0.02 // Default 2%

    switch (method.type) {
      case 'paypal':
        return 0.029 // 2.9%
      case 'bank':
        return 0.01 // 1%
      case 'wise':
        return 0.01 // 1%
      case 'venmo':
      case 'cashapp':
        return 0.02 // 2%
      case 'crypto':
        return 0.015 // 1.5%
      default:
        return 0.02
    }
  }, [selectedPaymentMethod, paymentMethods])

  const feeCents = Math.round(amountCents * feePercentage)
  const netPayoutCents = amountCents - feeCents

  const isValidAmount = amountCents >= minimumWithdrawal && amountCents <= campaignAvailableCents
  const canSubmit = isValidAmount && selectedPaymentMethod && selectedCampaignId && agreedToTerms && !isRequesting

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!canSubmit) return

    requestWithdrawal(
      {
        amount_cents: amountCents,
        payment_method_id: selectedPaymentMethod,
        campaign_id: selectedCampaignId,
        notes: notes || undefined
      },
      {
        onSuccess: () => {
          onSuccess()
        }
      }
    )
  }

  const formatCurrency = (cents: number) => {
    return (cents / 100).toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    })
  }

  const formatProcessingTime = (methodType?: string) => {
    switch (methodType) {
      case 'paypal':
        return '1-2 business days'
      case 'bank':
        return '3-5 business days'
      case 'wise':
        return '1-2 business days'
      case 'venmo':
      case 'cashapp':
        return 'instant'
      case 'crypto':
        return '10-30 minutes'
      default:
        return 'varies'
    }
  }

  const selectedMethod = Array.isArray(paymentMethods) ? paymentMethods.find((m) => m.id === selectedPaymentMethod) : undefined

  return (
    <Modal isOpen={true} onClose={onClose}>
      <ModalContent>
        <Header>
          <Title>Request Payout</Title>
          <CloseButton onClick={onClose}>
            <X />
          </CloseButton>
        </Header>

        {error && (
          <InfoBox type="warning">
            <AlertCircle />
            <div>
              <strong>Request Failed</strong>
              {typeof error === 'string' ? error : 'Please try again'}
            </div>
          </InfoBox>
        )}

        <InfoBox type="info">
          <DollarSign />
          <div>
            <strong>Campaign Balance</strong>
            {!selectedCampaignId ? (
              <span style={{ color: '#64748b' }}>Select a campaign to see balance</span>
            ) : (
              <span>${(campaignAvailableCents / 100).toFixed(2)}</span>
            )}
          </div>
        </InfoBox>

        <Form onSubmit={handleSubmit}>
          {/* Amount Input */}
          <FormField label="Withdrawal Amount" required>
            <AmountInputWrapper>
              <CurrencySymbol>$</CurrencySymbol>
              <AmountInputField
                type="number"
                step="0.01"
                min="5"
                max={selectedCampaignId ? (campaignAvailableCents / 100).toFixed(2) : undefined}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                disabled={isRequesting || !selectedCampaignId}
              />
            </AmountInputWrapper>
            {!selectedCampaignId && (
              <div style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: '#ca8a04' }}>
                Select a campaign first
              </div>
            )}
            {selectedCampaignId && amountCents > 0 && (
              <div style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: '#64748b' }}>
                {amountCents < minimumWithdrawal && (
                  <span>Minimum withdrawal is {formatCurrency(minimumWithdrawal)}</span>
                )}
                {amountCents > campaignAvailableCents && (
                  <span style={{ color: '#ca8a04' }}>
                    Amount exceeds available balance in this campaign by {formatCurrency(amountCents - campaignAvailableCents)}
                  </span>
                )}
              </div>
            )}
          </FormField>

          {/* Payment Method Select */}
          <FormField label="Pay To" required>
            {methodsLoading && (
              <div style={{ padding: '0.75rem 1rem', color: '#64748b', fontSize: '0.875rem' }}>
                Loading payment methods...
              </div>
            )}
            {!methodsLoading && (!paymentMethods || paymentMethods.length === 0) && (
              <InfoBox type="warning">
                <AlertCircle />
                <div>
                  <strong>No Payment Methods</strong>
                  Add a payment method first to request a withdrawal.
                </div>
              </InfoBox>
            )}
            {!methodsLoading && paymentMethods && paymentMethods.length > 0 && (
              <>
                <PaymentMethodSelect
                  value={selectedPaymentMethod}
                  onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                  disabled={isRequesting}
                >
                  <option value="">Select a payment method...</option>
                  {Array.isArray(paymentMethods) ? paymentMethods.map((method) => (
                    <option key={method.id} value={method.id}>
                      {method.displayName} ({method.type})
                    </option>
                  )) : null}
                </PaymentMethodSelect>

                {selectedPaymentMethod && selectedMethod && (
                  <div style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: '#64748b' }}>
                    Processing time: {formatProcessingTime(selectedMethod.type)}
                  </div>
                )}
              </>
            )}
          </FormField>

          {/* Campaign Selection (Required) */}
          <FormField label="Select Campaign" required>
            {campaignsLoading && (
              <div style={{ padding: '0.75rem 1rem', color: '#64748b', fontSize: '0.875rem' }}>
                <Loader size={16} style={{ animation: 'spin 1s linear infinite', marginRight: '0.5rem' }} />
                Loading campaigns...
              </div>
            )}
            {!campaignsLoading && campaignsError && (
              <InfoBox type="warning">
                <AlertCircle />
                <div>{campaignsError}</div>
              </InfoBox>
            )}
            {!campaignsLoading && (!campaigns || campaigns.length === 0) && (
              <InfoBox type="info">
                <AlertCircle />
                <div>No campaigns found with available balance to withdraw from.</div>
              </InfoBox>
            )}
            {!campaignsLoading && campaigns && campaigns.length > 0 && (
              <>
                <CampaignSelect
                  value={selectedCampaignId}
                  onChange={(e) => setSelectedCampaignId(e.target.value)}
                  disabled={isRequesting}
                >
                  <option value="">Select a campaign...</option>
                  {campaigns
                    .filter(c => c.available_cents > 0)
                    .map((campaign) => (
                      <option key={campaign.id || campaign._id} value={campaign.id || campaign._id}>
                        {campaign.title} - ${(campaign.available_cents / 100).toFixed(2)} available
                      </option>
                    ))}
                </CampaignSelect>

                {selectedCampaign && (
                  <CampaignBalanceBox>
                    <div className="label">Campaign Balance</div>
                    <div className="amount">${(selectedCampaign.available_cents / 100).toFixed(2)}</div>
                    <div className="details">
                      <div>
                        <span>Earned:</span>
                        <span className="value">${(selectedCampaign.earned_cents / 100).toFixed(2)}</span>
                      </div>
                      <div>
                        <span>Withdrawn:</span>
                        <span className="value">${(selectedCampaign.withdrawn_cents / 100).toFixed(2)}</span>
                      </div>
                      {selectedCampaign.reserved_cents > 0 && (
                        <div>
                          <span>Reserved:</span>
                          <span className="value">${(selectedCampaign.reserved_cents / 100).toFixed(2)}</span>
                        </div>
                      )}
                    </div>
                  </CampaignBalanceBox>
                )}
              </>
            )}
          </FormField>

          {/* Fee Breakdown */}
          {amountCents > 0 && isValidAmount && (
            <FeeBreakdown>
              <FeeRow>
                <span className="label">Withdrawal Amount:</span>
                <span className="value">{formatCurrency(amountCents)}</span>
              </FeeRow>
              <FeeRow>
                <span className="label">Processing Fee ({(feePercentage * 100).toFixed(1)}%):</span>
                <span className="value">-{formatCurrency(feeCents)}</span>
              </FeeRow>
              <FeeRow className="total">
                <span>You will receive:</span>
                <span>{formatCurrency(netPayoutCents)}</span>
              </FeeRow>
            </FeeBreakdown>
          )}

          {/* Notes Input */}
          <FormField label="Notes (Optional)">
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any notes about this withdrawal..."
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                border: '2px solid #e2e8f0',
                borderRadius: '8px',
                fontFamily: 'inherit',
                fontSize: '0.875rem',
                minHeight: '80px',
                resize: 'vertical'
              }}
              disabled={isRequesting}
            />
          </FormField>

          {/* Terms Agreement */}
          <label
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.75rem',
              cursor: 'pointer',
              fontSize: '0.875rem',
              color: '#64748b'
            }}
          >
            <input
              type="checkbox"
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
              disabled={isRequesting}
              style={{ marginTop: '0.25rem', cursor: 'pointer' }}
            />
            <span>
              I agree that this withdrawal will be processed according to the payout schedule and payment terms. Funds
              may take 1-5 business days to arrive depending on the payment method.
            </span>
          </label>

          {/* Limits Info */}
          <LimitInfo>
            <strong>Withdrawal Limits</strong>
            <ul>
              <li>Daily maximum: $500</li>
              <li>Monthly maximum: $5,000</li>
              <li>Minimum withdrawal: $5</li>
            </ul>
          </LimitInfo>

          {/* Action Buttons */}
          <ButtonGroup>
            <Button variant="secondary" onClick={onClose} disabled={isRequesting} style={{ flex: 1 }}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!canSubmit}
              style={{ flex: 1 }}
              title={(() => {
                if (!selectedCampaignId) return 'Select a campaign to withdraw from'
                if (!amountCents) return `Enter an amount between $5 and $${(campaignAvailableCents / 100).toFixed(2)}`
                if (!isValidAmount) return `Amount must be between $5 and $${(campaignAvailableCents / 100).toFixed(2)}`
                if (!selectedPaymentMethod) return 'Select a payment method'
                if (!agreedToTerms) return 'Check the agreement to proceed'
                return 'Ready to request payout'
              })()}
            >
              {isRequesting ? (
                <>
                  <Loader size={16} style={{ animation: 'spin 1s linear infinite' }} />
                  Processing...
                </>
              ) : (
                <>
                  <DollarSign size={16} />
                  Request {formatCurrency(amountCents)}
                </>
              )}
            </Button>
          </ButtonGroup>
        </Form>
      </ModalContent>
    </Modal>
  )
}

export default WithdrawalRequestModal
