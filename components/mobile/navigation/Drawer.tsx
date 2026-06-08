/**
 * Drawer Navigation Component
 * Slide-out navigation menu common in mobile apps
 */

'use client'

import React, { useEffect } from 'react'
import styled from 'styled-components'
import { ANIMATION_DURATIONS, Z_INDEX } from '@/lib/mobile/constants'

export interface DrawerProps {
  isOpen: boolean
  onClose: () => void
  position?: 'left' | 'right'
  width?: number | string
  children?: React.ReactNode
  overlay?: boolean
}

const DrawerOverlay = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  opacity: ${(props) => (props.$isOpen ? 1 : 0)};
  visibility: ${(props) => (props.$isOpen ? 'visible' : 'hidden')};
  transition: all ${ANIMATION_DURATIONS.normal}ms ease-out;
  z-index: ${Z_INDEX.modal - 1};
`

const DrawerContent = styled.div<{ $isOpen: boolean; $position: string; $width: number | string }>`
  position: fixed;
  top: 0;
  ${(props) => (props.$position === 'left' ? 'left: 0;' : 'right: 0;')}
  bottom: 0;
  width: ${(props) => (typeof props.$width === 'number' ? `${props.$width}px` : props.$width)};
  max-width: 90vw;
  background: white;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  z-index: ${Z_INDEX.modal};
  transform: translateX(${(props) => {
    if (props.$position === 'left') {
      return props.$isOpen ? '0' : '-100%'
    }
    return props.$isOpen ? '0' : '100%'
  }});
  transition: transform ${ANIMATION_DURATIONS.normal}ms ease-out;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  
  padding-top: env(safe-area-inset-top);
  padding-left: env(safe-area-inset-left);
  padding-right: env(safe-area-inset-right);
  padding-bottom: env(safe-area-inset-bottom);
`

/**
 * Drawer Navigation Component
 */
export const Drawer: React.FC<DrawerProps> = ({
  isOpen,
  onClose,
  position = 'left',
  width = 280,
  children,
  overlay = true,
}) => {
  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    window.addEventListener('keydown', handleEscape)
    return () => {
      window.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, onClose])

  return (
    <>
      {overlay && <DrawerOverlay $isOpen={isOpen} onClick={onClose} />}
      <DrawerContent $isOpen={isOpen} $position={position} $width={width} role="navigation" aria-hidden={!isOpen}>
        {children}
      </DrawerContent>
    </>
  )
}

export default Drawer
