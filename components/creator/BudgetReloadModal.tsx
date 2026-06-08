'use client'

import { useState } from 'react'
import styled from 'styled-components'
import { X } from 'lucide-react'
import { useRequestBudgetReload } from '@/api/hooks/useCampaigns'
import { useToast } from '@/hooks/useToast'

interface BudgetReloadModalProps {
  isOpen: boolean
  onClose: () => void
  campaignId: string
  campaignTitle: string
  currentBudget: number // in dollars
  usedBudget: number // in dollars
}

const Overlay = styled.div<{ $isOpen: boolean }>`
  display: ${(props) => (props.$isOpen ? 'flex' : 'none')};
  align-items: center;
  justify-content: center;
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  animation: fadeIn 0.2s ease-in-out;

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
  border-radius: 12px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  max-width: 500px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  animation: slideUp 0.3s ease-out;

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

  @media (max-width: 640px) {
    width: 95%;
  }
`

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
  border-bottom: 1px solid #e5e7eb;

  h2 {
    margin: 0;
    font-size: 18px;
    font-weight: 600;
    color: #1f2937;
  }
`

const CloseButton = styled.button`
  background: none;
  border: none;
  padding: 8px;
  cursor: pointer;
  color: #6b7280;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  transition: all 0.2s;

  &:hover {
    background-color: #f3f4f6;
    color: #1f2937;
  }
`

const ModalBody = styled.div`
  padding: 24px;

  p {
    margin: 0 0 16px 0;
    color: #6b7280;
    font-size: 14px;
    line-height: 1.6;
  }
`

const BudgetInfo = styled.div`
  background-color: #f9fafb;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 24px;
  border: 1px solid #e5e7eb;
`

const BudgetRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;

  &:last-child {
    margin-bottom: 0;
    padding-top: 12px;
    border-top: 1px solid #e5e7eb;
  }

  label {
    font-size: 14px;
    color: #6b7280;
    font-weight: 500;
  }

  .value {
    font-size: 16px;
    color: #1f2937;
    font-weight: 600;
  }
`

const FormGroup = styled.div`
  margin-bottom: 20px;

  label {
    display: block;
    margin-bottom: 8px;
    font-size: 14px;
    font-weight: 600;
    color: #1f2937;
  }
`

const InputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;

  input {
    width: 100%;
    padding: 10px 12px;
    padding-left: 28px;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    font-size: 14px;
    font-family: inherit;
    transition: all 0.2s;

    &:focus {
      outline: none;
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }

    &:disabled {
      background-color: #f3f4f6;
      color: #9ca3af;
      cursor: not-allowed;
    }
  }

  .currency {
    position: absolute;
    left: 12px;
    color: #6b7280;
    font-weight: 600;
    pointer-events: none;
  }
`

const ValidationHint = styled.div<{ $type: 'error' | 'info' }>`
  margin-top: 6px;
  font-size: 13px;
  color: ${(props) => (props.$type === 'error' ? '#dc2626' : '#0891b2')};

  &:before {
    content: '${(props) => (props.$type === 'error' ? '⚠ ' : 'ℹ ')}';
    margin-right: 4px;
  }
`

const ModalFooter = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  padding: 20px;
  border-top: 1px solid #e5e7eb;
  background-color: #f9fafb;
`

const Button = styled.button<{ $variant: 'primary' | 'outline' }>`
  padding: 10px 16px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  border: none;
  transition: all 0.2s;
  font-family: inherit;

  ${(props) =>
    props.$variant === 'primary'
      ? `
    background-color: #3b82f6;
    color: white;

    &:hover:not(:disabled) {
      background-color: #2563eb;
    }

    &:active:not(:disabled) {
      background-color: #1d4ed8;
    }

    &:disabled {
      background-color: #9ca3af;
      cursor: not-allowed;
    }
  `
      : `
    background-color: white;
    color: #374151;
    border: 1px solid #d1d5db;

    &:hover {
      background-color: #f3f4f6;
    }

    &:active {
      background-color: #e5e7eb;
    }
  `}
`

const LoadingSpinner = styled.div`
  display: inline-block;
  width: 14px;
  height: 14px;
  margin-right: 8px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`

export function BudgetReloadModal({
  isOpen,
  onClose,
  campaignId,
  campaignTitle,
  currentBudget,
  usedBudget,
}: BudgetReloadModalProps) {
  const [reloadAmount, setReloadAmount] = useState<string>('')

  const { showToast } = useToast()
  const mutation = useRequestBudgetReload()

  const remainingBudget = currentBudget - usedBudget
  const parsedAmount = parseFloat(reloadAmount) || 0
  const isValidAmount = parsedAmount >= 10 && parsedAmount <= 1000000
  const isLoading = mutation.isPending

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isValidAmount) {
      showToast({
        type: 'error',
        message: 'Budget reload amount must be between $10 and $1,000,000',
      })
      return
    }

    try {
      await mutation.mutateAsync({
        campaignId,
        amount: parsedAmount,
      })

      showToast({
        type: 'success',
        message: `Budget reload request submitted for $${parsedAmount.toFixed(2)}`,
      })

      setReloadAmount('')
      onClose()
    } catch (error) {
      showToast({
        type: 'error',
        message:
          error instanceof Error ? error.message : 'Failed to request budget reload',
      })
    }
  }

  const handleClose = () => {
    if (!isLoading) {
      setReloadAmount('')
      onClose()
    }
  }

  return (
    <Overlay $isOpen={isOpen} onClick={handleClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <h2>Request Budget Reload</h2>
          <CloseButton onClick={handleClose} disabled={isLoading}>
            <X size={20} />
          </CloseButton>
        </ModalHeader>

        <ModalBody>
          <p>
            <strong>{campaignTitle}</strong>
          </p>

          <BudgetInfo>
            <BudgetRow>
              <label>Current Budget:</label>
              <span className="value">${currentBudget.toFixed(2)}</span>
            </BudgetRow>
            <BudgetRow>
              <label>Used Budget:</label>
              <span className="value">${usedBudget.toFixed(2)}</span>
            </BudgetRow>
            <BudgetRow>
              <label>Remaining Budget:</label>
              <span className="value">${remainingBudget.toFixed(2)}</span>
            </BudgetRow>
          </BudgetInfo>

          <form onSubmit={handleSubmit}>
            <FormGroup>
              <label htmlFor="reload-amount">Reload Amount</label>
              <InputWrapper>
                <span className="currency">$</span>
                <input
                  id="reload-amount"
                  type="number"
                  step="0.01"
                  min="10"
                  max="1000000"
                  value={reloadAmount}
                  onChange={(e) => setReloadAmount(e.target.value)}
                  placeholder="0.00"
                  disabled={isLoading}
                  autoFocus
                />
              </InputWrapper>
              {reloadAmount && !isValidAmount && (
                <ValidationHint $type="error">
                  Amount must be between $10 and $1,000,000
                </ValidationHint>
              )}
              {reloadAmount && isValidAmount && (
                <ValidationHint $type="info">
                  New total budget: ${(currentBudget + parsedAmount).toFixed(2)}
                </ValidationHint>
              )}
            </FormGroup>

            <ModalFooter>
              <Button $variant="outline" onClick={handleClose} disabled={isLoading}>
                Cancel
              </Button>
              <Button
                $variant="primary"
                type="submit"
                disabled={!isValidAmount || isLoading}
              >
                {isLoading && <LoadingSpinner />}
                {isLoading ? 'Submitting...' : 'Request Reload'}
              </Button>
            </ModalFooter>
          </form>
        </ModalBody>
      </ModalContent>
    </Overlay>
  )
}
