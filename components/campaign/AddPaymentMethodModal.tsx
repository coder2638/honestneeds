'use client'

import React from 'react'
import styled from 'styled-components'
import { X } from 'lucide-react'
import { AddPaymentMethodForm, PaymentMethod } from './AddPaymentMethodForm'

interface AddPaymentMethodModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (method: PaymentMethod) => Promise<void>
  isLoading?: boolean
  initialMethod?: PaymentMethod
  isEditing?: boolean
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
  max-width: 600px;
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
`

/**
 * AddPaymentMethodModal Component
 * Modal wrapper for payment method form
 */
export const AddPaymentMethodModal: React.FC<AddPaymentMethodModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
  initialMethod,
  isEditing = false,
}) => {
  const handleSubmit = async (method: PaymentMethod) => {
    try {
      await onSubmit(method)
      onClose()
    } catch (error) {
      // Error handling is done in parent component
    }
  }

  return (
    <Overlay isOpen={isOpen} onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <Header>
          <Title>
            {isEditing ? '✏️ Edit Payment Method' : '➕ Add Payment Method'}
          </Title>
          <CloseButton onClick={onClose}>
            <X />
          </CloseButton>
        </Header>

        <Body>
          <AddPaymentMethodForm
            onSubmit={handleSubmit}
            isLoading={isLoading}
            initialMethod={initialMethod}
            isEditing={isEditing}
          />
        </Body>
      </ModalContent>
    </Overlay>
  )
}
