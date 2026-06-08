'use client'

import React, { useState } from 'react'
import styled from 'styled-components'
import { AlertCircle, X } from 'lucide-react'
import Button from '@/components/ui/Button'

interface AgeVerificationModalProps {
  isOpen: boolean
  onConfirm: () => void
  onDecline: () => void
}

const Overlay = styled.div<{ isOpen: boolean }>`
  display: ${(props) => (props.isOpen ? 'flex' : 'none')};
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
  align-items: center;
  justify-content: center;
  z-index: 1001;
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
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3);
  animation: slideUp 0.3s ease;
  display: flex;
  flex-direction: column;

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
  border-bottom: 1px solid #e5e7eb;
  background: linear-gradient(135deg, #fef3c7 0%, #fcd34d 100%);
  border-radius: 16px 16px 0 0;
`

const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.75rem;

  svg {
    width: 1.75rem;
    height: 1.75rem;
    color: #d97706;
  }
`

const CloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6b7280;
  transition: color 0.2s ease;

  &:hover {
    color: #1f2937;
  }

  svg {
    width: 1.5rem;
    height: 1.5rem;
  }
`

const Body = styled.div`
  padding: 2rem 1.5rem;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`

const WarningBox = styled.div`
  background: #fee2e2;
  border: 1.5px solid #fca5a5;
  border-radius: 8px;
  padding: 1rem;
  display: flex;
  gap: 0.75rem;

  svg {
    width: 1.25rem;
    height: 1.25rem;
    color: #dc2626;
    flex-shrink: 0;
    margin-top: 0.125rem;
  }
`

const WarningText = styled.div`
  font-size: 0.95rem;
  color: #7f1d1d;
  line-height: 1.6;

  strong {
    color: #b91c1c;
    font-weight: 700;
  }
`

const ContentBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`

const ContentTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
`

const ContentText = styled.p`
  font-size: 0.95rem;
  color: #4b5563;
  margin: 0;
  line-height: 1.6;
`

const CheckboxContainer = styled.label`
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  cursor: pointer;
  margin: 1rem 0 0 0;

  input {
    width: 1.25rem;
    height: 1.25rem;
    margin-top: 0.2rem;
    cursor: pointer;
    accent-color: #3b82f6;
  }
`

const CheckboxLabel = styled.label`
  font-size: 0.95rem;
  color: #1f2937;
  line-height: 1.5;

  strong {
    color: #0f172a;
    font-weight: 600;
  }
`

const Footer = styled.div`
  padding: 1.5rem;
  border-top: 1px solid #e5e7eb;
  display: flex;
  gap: 1rem;
  justify-content: flex-end;

  @media (max-width: 480px) {
    flex-direction: column;
  }
`

const ActionButton = styled(Button)`
  flex: 1;

  @media (min-width: 481px) {
    flex: none;
    min-width: 120px;
  }
`

/**
 * AgeVerificationModal Component
 * Modal for verifying user is 18+ before entering sweepstakes
 */
export const AgeVerificationModal: React.FC<AgeVerificationModalProps> = ({
  isOpen,
  onConfirm,
  onDecline,
}) => {
  const [isAgreed, setIsAgreed] = useState(false)

  const handleConfirm = () => {
    if (isAgreed) {
      onConfirm()
      setIsAgreed(false)
    }
  }

  return (
    <Overlay isOpen={isOpen} onClick={onDecline}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <Header>
          <Title>
            <AlertCircle />
            Age Verification Required
          </Title>
          <CloseButton onClick={onDecline}>
            <X />
          </CloseButton>
        </Header>

        <Body>
          <WarningBox>
            <AlertCircle />
            <WarningText>
              <strong>ATTENTION:</strong> You must be 18 years or older to participate in this sweepstakes.
            </WarningText>
          </WarningBox>

          <ContentBlock>
            <ContentTitle>🎰 About This Sweepstakes</ContentTitle>
            <ContentText>
              HonestNeed conducts periodic sweepstakes drawings where participants can win cash prizes.
              Participants earn entries by creating campaigns, making donations, and sharing campaigns.
            </ContentText>
          </ContentBlock>

          <ContentBlock>
            <ContentTitle>⚡ Eligibility Requirements</ContentTitle>
            <ContentText>
              To participate, you must:
              <ul style={{ margin: '0.5rem 0 0 1.5rem', paddingLeft: 0 }}>
                <li>Be 18 years of age or older</li>
                <li>Not reside in Florida, New York, or Texas</li>
                <li>Comply with all applicable laws and HonestNeed terms</li>
              </ul>
            </ContentText>
          </ContentBlock>

          <ContentBlock>
            <ContentTitle>⚠️ Important Notice</ContentTitle>
            <ContentText>
              Winners are subject to identity verification. Making false statements about age or
              location may result in disqualification and forfeiture of all prizes. Sweepstakes is
              void where prohibited by law.
            </ContentText>
          </ContentBlock>

          <CheckboxContainer>
            <input
              type="checkbox"
              checked={isAgreed}
              onChange={(e) => setIsAgreed(e.target.checked)}
              id="age-confirmation"
            />
            <CheckboxLabel htmlFor="age-confirmation">
              I confirm that I am <strong>18 years or older</strong> and meet all eligibility requirements.
            </CheckboxLabel>
          </CheckboxContainer>
        </Body>

        <Footer>
          <ActionButton
            variant="secondary"
            onClick={onDecline}
          >
            I Decline
          </ActionButton>
          <ActionButton
            onClick={handleConfirm}
            disabled={!isAgreed}
          >
            I Confirm & Enter
          </ActionButton>
        </Footer>
      </ModalContent>
    </Overlay>
  )
}
