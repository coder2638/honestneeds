'use client'

import styled from 'styled-components'
import { useState } from 'react'
import { X } from 'lucide-react'
import BoostCheckout from './BoostCheckout'

interface BoostModalProps {
  campaignId: string
  campaignTitle: string
  isOpen: boolean
  onClose: () => void
  onSuccess?: (boostId: string) => void
}

// Styled Components
const Overlay = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: ${(props) => (props.$isOpen ? 1 : 0)};
  visibility: ${(props) => (props.$isOpen ? 'visible' : 'hidden')};
  transition: opacity 200ms ease;
  z-index: 50;
`

const Modal = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) scale(${(props) => (props.$isOpen ? 1 : 0.95)});
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  opacity: ${(props) => (props.$isOpen ? 1 : 0)};
  visibility: ${(props) => (props.$isOpen ? 'visible' : 'hidden')};
  transition: all 200ms ease;
  z-index: 51;
  max-height: 90vh;
  overflow-y: auto;
  max-width: 90vw;
  width: 100%;

  @media (min-width: 640px) {
    max-width: 42rem;
  }
`

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
  position: sticky;
  top: 0;
  background-color: white;
  z-index: 10;
`

const Title = styled.h2`
  font-size: 1.25rem;
  font-weight: 700;
  color: #111827;
`

const CloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  color: #6b7280;
  transition: color 200ms ease;

  &:hover {
    color: #111827;
  }
`

const Content = styled.div`
  padding: 0;
`

/**
 * BoostModal Component
 * Modal wrapper around BoostCheckout component
 * Integrated with Next.js frontend
 */
export const BoostModal: React.FC<BoostModalProps> = ({
  campaignId,
  campaignTitle,
  isOpen,
  onClose,
  onSuccess,
}) => {
  return (
    <>
      <Overlay $isOpen={isOpen} onClick={onClose} />
      <Modal $isOpen={isOpen}>
        <Header>
          <Title>Boost Campaign</Title>
          <CloseButton onClick={onClose}>
            <X size={24} />
          </CloseButton>
        </Header>
        <Content>
          <BoostCheckout
            campaignId={campaignId}
            campaignTitle={campaignTitle}
            onCancel={onClose}
            onSuccess={(boostId) => {
              onSuccess?.(boostId)
              onClose()
            }}
          />
        </Content>
      </Modal>
    </>
  )
}

export default BoostModal
