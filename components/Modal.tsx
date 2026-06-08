'use client'

import React, { useEffect } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import styled from 'styled-components'
import { COLORS, BORDER_RADIUS, SHADOWS, SPACING, TRANSITIONS } from '@/styles/tokens'

const Overlay = styled(Dialog.Overlay)`
  position: fixed;
  inset: 0;
  background-color: ${COLORS.OVERLAY};
  animation: fadeIn ${TRANSITIONS.BASE};
  z-index: 99;

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`

const Content = styled(Dialog.Content)`
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  background-color: ${COLORS.SURFACE};
  border-radius: ${BORDER_RADIUS.LG};
  box-shadow: ${SHADOWS.XL};
  animation: slideIn ${TRANSITIONS.BASE};
  z-index: 100;
  max-height: 85vh;
  overflow-y: auto;
  max-width: min(90vw, 600px);
  width: 100%;

  @media (max-width: 640px) {
    max-width: min(95vw, 100%);
    max-height: 90vh;
  }

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translate(-50%, -48%);
    }
    to {
      opacity: 1;
      transform: translate(-50%, -50%);
    }
  }

  &:focus {
    outline: none;
  }
`

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${SPACING[6]};
  border-bottom: 1px solid ${COLORS.BORDER};
`

const Title = styled(Dialog.Title)`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${COLORS.TEXT};
  margin: 0;
`

const CloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: ${COLORS.MUTED_TEXT};
  font-size: 24px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: ${BORDER_RADIUS.MD};
  transition: all ${TRANSITIONS.BASE};

  &:hover {
    background-color: ${COLORS.DISABLED};
    color: ${COLORS.TEXT};
  }

  &:focus-visible {
    outline: 2px solid ${COLORS.PRIMARY};
    outline-offset: 2px;
  }
`

const Body = styled.div`
  padding: ${SPACING[6]};
`

const Footer = styled.div`
  display: flex;
  gap: ${SPACING[3]};
  justify-content: flex-end;
  padding: ${SPACING[6]};
  border-top: 1px solid ${COLORS.BORDER};
`

export interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  footer?: React.ReactNode
  className?: string
}

export const Modal = React.forwardRef<HTMLDivElement, ModalProps>(
  ({ isOpen, onClose, title, children, footer, className }, ref) => {
    // Handle escape key
    useEffect(() => {
      const handleEscape = (event: KeyboardEvent) => {
        if (event.key === 'Escape' && isOpen) {
          onClose()
        }
      }

      if (isOpen) {
        document.addEventListener('keydown', handleEscape)
        document.body.style.overflow = 'hidden'
      }

      return () => {
        document.removeEventListener('keydown', handleEscape)
        document.body.style.overflow = 'unset'
      }
    }, [isOpen, onClose])

    return (
      <Dialog.Root open={isOpen} onOpenChange={onClose}>
        <Dialog.Portal>
          <Overlay onClick={onClose} />
          <Content ref={ref} className={className}>
            {title && (
              <Header>
                <Title>{title}</Title>
                <Dialog.Close asChild>
                  <CloseButton aria-label="Close modal">×</CloseButton>
                </Dialog.Close>
              </Header>
            )}
            <Body>{children}</Body>
            {footer && <Footer>{footer}</Footer>}
          </Content>
        </Dialog.Portal>
      </Dialog.Root>
    )
  }
)

Modal.displayName = 'Modal'
