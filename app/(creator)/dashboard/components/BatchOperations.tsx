'use client'

import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { Pause, Check, Trash2, ChevronDown, X } from 'lucide-react'

interface BatchOperationsProps {
  selectedCount: number
  onPause: (ids: string[]) => void
  onComplete: (ids: string[]) => void
  onDelete: (ids: string[]) => void
  onClearSelection: () => void
  selectedIds: string[]
  isLoading?: boolean
}

const BarContainer = styled.div<{ isVisible: boolean }>`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #1f2937;
  color: white;
  padding: 16px 24px;
  display: ${(props) => (props.isVisible ? 'flex' : 'none')};
  gap: 20px;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 -4px 16px rgba(0, 0, 0, 0.2);
  z-index: 40;
  animation: slideUp 0.3s ease-out;

  @keyframes slideUp {
    from {
      transform: translateY(100px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }

  @media (max-width: 768px) {
    padding: 12px 16px;
    gap: 12px;
    flex-direction: column;
    padding-bottom: calc(16px + env(safe-area-inset-bottom));
  }
`

const LeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;

  @media (max-width: 768px) {
    width: 100%;
    justify-content: space-between;
  }
`

const SelectionInfo = styled.div`
  font-size: 14px;
  font-weight: 500;
  white-space: nowrap;

  @media (max-width: 768px) {
    font-size: 13px;
  }
`

const ActionsSection = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;

  @media (max-width: 768px) {
    width: 100%;
    flex-wrap: wrap;
    gap: 8px;
  }
`

const BatchButton = styled.button<{ variant?: 'primary' | 'danger' }>`
  padding: 8px 16px;
  border-radius: 6px;
  border: none;
  background: ${(props) => (props.variant === 'danger' ? '#ef4444' : '#3b82f6')};
  color: white;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 6px;
  white-space: nowrap;

  &:hover:not(:disabled) {
    background: ${(props) => (props.variant === 'danger' ? '#dc2626' : '#2563eb')};
  }

  &:active:not(:disabled) {
    transform: scale(0.95);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  svg {
    width: 14px;
    height: 14px;
  }

  @media (max-width: 768px) {
    padding: 6px 12px;
    font-size: 12px;
    flex: 1;
  }
`

const CloseButton = styled.button`
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 4px;
  }

  svg {
    width: 20px;
    height: 20px;
  }

  @media (max-width: 768px) {
    padding: 4px;
  }
`

const Divider = styled.div`
  width: 1px;
  height: 24px;
  background: rgba(255, 255, 255, 0.2);

  @media (max-width: 768px) {
    display: none;
  }
`

const ConfirmationModal = styled.div<{ isOpen: boolean }>`
  display: ${(props) => (props.isOpen ? 'flex' : 'none')};
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  align-items: center;
  justify-content: center;
  z-index: 50;
`

const ConfirmationContent = styled.div`
  background: white;
  border-radius: 12px;
  padding: 24px;
  max-width: 400px;
  width: 90%;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
`

const ConfirmationTitle = styled.h3`
  font-size: 18px;
  font-weight: 700;
  color: #111827;
  margin: 0 0 12px 0;
`

const ConfirmationText = styled.p`
  font-size: 14px;
  color: #6b7280;
  margin: 0 0 24px 0;
  line-height: 1.5;
`

const ConfirmationButtons = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
`

const ConfirmButton = styled.button<{ variant?: 'primary' | 'danger' }>`
  padding: 8px 16px;
  border-radius: 6px;
  border: 1px solid ${(props) => (props.variant === 'danger' ? '#ef4444' : '#d1d5db')};
  background: ${(props) => (props.variant === 'danger' ? '#ef4444' : 'white')};
  color: ${(props) => (props.variant === 'danger' ? 'white' : '#374151')};
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${(props) => (props.variant === 'danger' ? '#dc2626' : '#f3f4f6')};
  }

  &:active {
    transform: scale(0.95);
  }
`

export const BatchOperations: React.FC<BatchOperationsProps> = ({
  selectedCount,
  onPause,
  onComplete,
  onDelete,
  onClearSelection,
  selectedIds,
  isLoading = false,
}) => {
  const [confirmAction, setConfirmAction] = useState<'pause' | 'complete' | 'delete' | null>(null)

  const handleConfirm = () => {
    if (!confirmAction) return

    switch (confirmAction) {
      case 'pause':
        onPause(selectedIds)
        break
      case 'complete':
        onComplete(selectedIds)
        break
      case 'delete':
        onDelete(selectedIds)
        break
    }

    setConfirmAction(null)
  }

  const getConfirmationText = (): { title: string; message: string } => {
    switch (confirmAction) {
      case 'pause':
        return {
          title: `Pause ${selectedCount} Campaign${selectedCount !== 1 ? 's' : ''}?`,
          message: `These campaigns will be paused. Supporters will no longer be able to donate. You can resume them anytime.`,
        }
      case 'complete':
        return {
          title: `Complete ${selectedCount} Campaign${selectedCount !== 1 ? 's' : ''}?`,
          message: `Completed campaigns are archived. You can view their history but cannot accept new donations.`,
        }
      case 'delete':
        return {
          title: `Delete ${selectedCount} Campaign${selectedCount !== 1 ? 's' : ''}?`,
          message: `This action cannot be undone. All campaign data will be permanently deleted.`,
        }
      default:
        return { title: '', message: '' }
    }
  }

  const { title, message } = getConfirmationText()

  return (
    <>
      <BarContainer isVisible={selectedCount > 0}>
        <LeftSection>
          <SelectionInfo>{selectedCount} campaign(s) selected</SelectionInfo>
        </LeftSection>

        <ActionsSection>
          <BatchButton
            onClick={() => setConfirmAction('pause')}
            disabled={isLoading}
            title="Pause selected campaigns"
          >
            <Pause size={14} />
            Pause All
          </BatchButton>

          <BatchButton
            onClick={() => setConfirmAction('complete')}
            disabled={isLoading}
            title="Complete selected campaigns"
          >
            <Check size={14} />
            Complete
          </BatchButton>

          <BatchButton
            variant="danger"
            onClick={() => setConfirmAction('delete')}
            disabled={isLoading}
            title="Delete selected campaigns permanently"
          >
            <Trash2 size={14} />
            Delete
          </BatchButton>
        </ActionsSection>

        <Divider />

        <CloseButton
          onClick={onClearSelection}
          title="Clear selection"
          disabled={isLoading}
        >
          <X />
        </CloseButton>
      </BarContainer>

      <ConfirmationModal isOpen={!!confirmAction}>
        <ConfirmationContent>
          <ConfirmationTitle>{title}</ConfirmationTitle>
          <ConfirmationText>{message}</ConfirmationText>
          <ConfirmationButtons>
            <ConfirmButton onClick={() => setConfirmAction(null)} disabled={isLoading}>
              Cancel
            </ConfirmButton>
            <ConfirmButton
              variant="danger"
              onClick={handleConfirm}
              disabled={isLoading}
            >
              {isLoading ? 'Processing...' : 'Confirm'}
            </ConfirmButton>
          </ConfirmationButtons>
        </ConfirmationContent>
      </ConfirmationModal>
    </>
  )
}

export default BatchOperations
