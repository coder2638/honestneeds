'use client'

import styled from 'styled-components'
import { useState } from 'react'
import { ShareModal } from './ShareModal'

const ShareButtonContainer = styled.button`
  padding: 0.75rem 1.5rem;
  background-color: #6366f1;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    background-color: #4f46e5;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    background-color: #cbd5e1;
    cursor: not-allowed;
    transform: none;
  }

  &:focus-visible {
    outline: 2px solid #fff;
    outline-offset: 2px;
  }

  @media (max-width: 640px) {
    padding: 0.625rem 1.25rem;
    font-size: 0.95rem;
  }
`

const ShareIcon = styled.svg`
  width: 1.25rem;
  height: 1.25rem;
`

interface ShareButtonProps {
  campaignId: string
  campaignTitle: string
  disabled?: boolean
}

export function ShareButton({
  campaignId,
  campaignTitle,
  disabled = false,
}: ShareButtonProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <ShareButtonContainer onClick={() => setIsOpen(true)} disabled={disabled}>
        <ShareIcon
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="18" cy="5" r="3"></circle>
          <circle cx="6" cy="12" r="3"></circle>
          <circle cx="18" cy="19" r="3"></circle>
          <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
          <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
        </ShareIcon>
        Share
      </ShareButtonContainer>

      <ShareModal
        campaignId={campaignId}
        campaignTitle={campaignTitle}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </>
  )
}
