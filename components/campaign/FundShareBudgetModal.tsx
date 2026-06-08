'use client'

import React, { useState, useMemo } from 'react'
import styled from 'styled-components'
import { X } from 'lucide-react'
import Button from '@/components/ui/Button'

interface FundShareBudgetModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: { amount: number; message?: string }) => Promise<void>
  creatorName: string
  campaignTitle: string
  remainingNeeded: number // in cents
}

const Overlay = styled.div<{ isOpen: boolean }>`
  display: ${(props) => (props.isOpen ? 'flex' : 'none')};
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.2s ease;

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`

const ModalContent = styled.div`
  background: white;
  border-radius: 16px;
  max-width: 500px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: slideUp 0.3s ease;

  @keyframes slideUp {
    from {
      transform: translateY(20px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
`

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #e2e8f0;
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
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #64748b;
  transition: color 0.2s ease;

  &:hover {
    color: #0f172a;
  }

  svg {
    width: 1.5rem;
    height: 1.5rem;
  }
`

const Body = styled.div`
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`

const CampaignInfo = styled.div`
  background-color: #eff6ff;
  border: 1px solid #bfdbfe;
  border-radius: 8px;
  padding: 1rem;
`

const CampaignName = styled.p`
  color: #1e40af;
  font-weight: 600;
  margin: 0 0 0.25rem 0;
  font-size: 0.95rem;
`

const CampaignDetail = styled.p`
  color: #3b82f6;
  font-size: 0.875rem;
  margin: 0;
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

const QuickAmountButtons = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.75rem;
`

const QuickAmountButton = styled.button<{ selected: boolean }>`
  padding: 0.75rem;
  border: 2px solid ${(props) => (props.selected ? '#ec4899' : '#e2e8f0')};
  background-color: ${(props) => (props.selected ? '#fdf2f8' : 'white')};
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 600;
  color: ${(props) => (props.selected ? '#ec4899' : '#64748b')};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: #ec4899;
    background-color: #fdf2f8;
  }

  &:active {
    transform: scale(0.95);
  }
`

const InputContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: flex-end;
`

const Input = styled.input`
  flex: 1;
  padding: 0.75rem;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  font-size: 1rem;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: #ec4899;
    box-shadow: 0 0 0 3px rgba(236, 72, 153, 0.1);
  }

  &::placeholder {
    color: #cbd5e1;
  }
`

const CurrencySymbol = styled.span`
  font-size: 1.25rem;
  font-weight: 600;
  color: #0f172a;
`

const MessageBox = styled.div`
  background-color: #f3f4f6;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 1rem;
`

const MessageLabel = styled.label`
  font-size: 0.9rem;
  font-weight: 600;
  color: #0f172a;
  display: block;
  margin-bottom: 0.5rem;
`

const MessageInput = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  font-size: 0.9rem;
  font-family: inherit;
  resize: vertical;
  min-height: 80px;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: #ec4899;
    box-shadow: 0 0 0 3px rgba(236, 72, 153, 0.1);
  }

  &::placeholder {
    color: #cbd5e1;
  }
`

const InfoBox = styled.div`
  background-color: #fef3c7;
  border: 1px solid #fcd34d;
  border-radius: 8px;
  padding: 1rem;
  font-size: 0.875rem;
  color: #78350f;
  line-height: 1.5;
`

const FooterActions = styled.div`
  display: flex;
  gap: 1rem;
  padding: 1.5rem;
  border-top: 1px solid #e2e8f0;
  background-color: #f8fafc;
  border-radius: 0 0 16px 16px;

  button {
    flex: 1;
  }

  button:first-child {
    flex: 0;
  }
`

const formatCurrency = (cents: number): string => {
  return `$${(cents / 100).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
}

const quickAmounts = [500, 1000, 2500] // in cents

/**
 * FundShareBudgetModal Component
 * Production-ready modal for supporting another creator's share budget
 * Part of crowdfunded virality feature
 */
export const FundShareBudgetModal: React.FC<FundShareBudgetModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  creatorName,
  campaignTitle,
  remainingNeeded,
}) => {
  const [amount, setAmount] = useState('')
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const amountInCents = useMemo(() => {
    try {
      return Math.round(parseFloat(amount) * 100) || 0
    } catch {
      return 0
    }
  }, [amount])

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (/^\d*\.?\d*$/.test(value) || value === '') {
      setAmount(value)
      setError('')
    }
  }

  const handleQuickAmount = (cents: number) => {
    setAmount((cents / 100).toFixed(2))
    setError('')
  }

  const handleSubmit = async () => {
    if (!amount || amountInCents === 0) {
      setError('Please enter an amount')
      return
    }

    if (amountInCents < 100) {
      // Minimum $1
      setError('Minimum funding amount is $1')
      return
    }

    if (amountInCents > remainingNeeded) {
      setError(`Maximum amount is ${formatCurrency(remainingNeeded)}`)
      return
    }

    try {
      setIsSubmitting(true)
      await onSubmit({
        amount: amountInCents,
        message: message || undefined,
      })
      setAmount('')
      setMessage('')
      onClose()
    } catch (err: any) {
      setError(err.message || 'Failed to fund budget. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Overlay isOpen={isOpen} onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <Header>
          <Title>❤️ Support This Creator</Title>
          <CloseButton onClick={onClose}>
            <X />
          </CloseButton>
        </Header>

        <Body>
          <CampaignInfo>
            <CampaignName>📢 {campaignTitle}</CampaignName>
            <CampaignDetail>by {creatorName}</CampaignDetail>
            <CampaignDetail style={{ marginTop: '0.5rem' }}>
              📊 Needs: {formatCurrency(remainingNeeded)}
            </CampaignDetail>
          </CampaignInfo>

          {/* Quick Amount Selection */}
          <FormGroup>
            <Label>Quick Select Amount</Label>
            <QuickAmountButtons>
              {quickAmounts.map((quick) => (
                <QuickAmountButton
                  key={quick}
                  selected={amountInCents === quick}
                  onClick={() => handleQuickAmount(quick)}
                  type="button"
                >
                  {formatCurrency(quick)}
                </QuickAmountButton>
              ))}
            </QuickAmountButtons>
          </FormGroup>

          {/* Custom Amount */}
          <FormGroup>
            <Label htmlFor="fundAmount">Custom Amount</Label>
            <InputContainer>
              <CurrencySymbol>$</CurrencySymbol>
              <Input
                id="fundAmount"
                type="text"
                placeholder="0.00"
                value={amount}
                onChange={handleAmountChange}
                disabled={isSubmitting}
                autoFocus
              />
            </InputContainer>
            <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
              Min: $1 | Max: {formatCurrency(remainingNeeded)}
            </span>
          </FormGroup>

          {/* Optional Message */}
          <MessageBox>
            <MessageLabel htmlFor="fundMessage">
              📝 Message (Optional)
            </MessageLabel>
            <MessageInput
              id="fundMessage"
              placeholder="Tell the creator why you're supporting their campaign..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              disabled={isSubmitting}
              maxLength={500}
            />
            <span style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.5rem', display: 'block' }}>
              {message.length}/500
            </span>
          </MessageBox>

          {/* Info */}
          <InfoBox>
            💡 <strong>How it works:</strong> Your contribution goes toward this creator's share
            budget, helping them incentivize supporters to share and amplify their campaign.
          </InfoBox>

          {/* Error */}
          {error && (
            <div
              style={{
                backgroundColor: '#fee2e2',
                color: '#991b1b',
                padding: '0.75rem',
                borderRadius: '6px',
                fontSize: '0.875rem',
              }}
            >
              ❌ {error}
            </div>
          )}
        </Body>

        <FooterActions>
          <Button variant="secondary" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={isSubmitting || amountInCents === 0}
          >
            {isSubmitting ? 'Processing...' : `Send ${formatCurrency(amountInCents)}`}
          </Button>
        </FooterActions>
      </ModalContent>
    </Overlay>
  )
}
