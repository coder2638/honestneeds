'use client'

import React, { useState, useEffect, useCallback } from 'react'
import styled from 'styled-components'
import { X, Undo2 } from 'lucide-react'

export interface SmartConfirmationAction {
  id: string
  action: 'pause' | 'resume' | 'delete' | 'complete'
  campaignId: string
  campaignTitle: string
  timestamp: Date
  undoHandler: () => void
  riskLevel: 'low' | 'medium' | 'high'
}

interface SmartConfirmationProps {
  action: SmartConfirmationAction | null
  onUndo: (actionId: string) => void
  onDismiss: (actionId: string) => void
  undoTimeout?: number // milliseconds
}

const ToastContainer = styled.div<{ isVisible: boolean; riskLevel: string }>`
  position: fixed;
  bottom: 20px;
  right: 20px;
  max-width: 400px;
  background: white;
  border-left: 4px solid
    ${(props) => {
      switch (props.riskLevel) {
        case 'high':
          return '#ef4444'
        case 'medium':
          return '#f59e0b'
        default:
          return '#3b82f6'
      }
    }};
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  padding: 16px;
  display: ${(props) => (props.isVisible ? 'flex' : 'none')};
  gap: 12px;
  align-items: center;
  z-index: 50;
  animation: slideIn 0.3s ease-out;

  @keyframes slideIn {
    from {
      transform: translateX(400px);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }

  @media (max-width: 640px) {
    bottom: 10px;
    right: 10px;
    left: 10px;
    max-width: none;
  }
`

const ToastContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
`

const ToastTitle = styled.p`
  font-size: 13px;
  font-weight: 600;
  color: #111827;
  margin: 0;
`

const ToastMessage = styled.p`
  font-size: 12px;
  color: #6b7280;
  margin: 0;
`

const ToastActions = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`

const UndoButton = styled.button`
  padding: 6px 12px;
  border-radius: 4px;
  border: none;
  background: #3b82f6;
  color: white;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 4px;
  white-space: nowrap;

  &:hover {
    background: #2563eb;
  }

  &:active {
    transform: scale(0.95);
  }

  svg {
    width: 12px;
    height: 12px;
  }
`

const DismissButton = styled.button`
  padding: 4px;
  border: none;
  background: transparent;
  color: #9ca3af;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    color: #6b7280;
  }

  svg {
    width: 14px;
    height: 14px;
  }
`

const ProgressBar = styled.div<{ timeLeft: number; totalTime: number }>`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: #e5e7eb;
  border-radius: 0 0 8px 8px;
  overflow: hidden;

  &::after {
    content: '';
    display: block;
    height: 100%;
    background: #3b82f6;
    width: ${(props) => ((props.timeLeft / props.totalTime) * 100)}%;
    transition: width 0.1s linear;
  }
`

/**
 * SmartConfirmation Component
 * Shows confirmation for low-risk actions with undo capability
 * Shows full modal for high-risk actions (delete)
 *
 * Action Risk Levels:
 * - Low: pause, resume (easy to undo)
 * - Medium: complete (harder to undo)
 * - High: delete (cannot be undone)
 */
export const SmartConfirmation: React.FC<SmartConfirmationProps> = ({
  action,
  onUndo,
  onDismiss,
  undoTimeout = 5000,
}) => {
  const [timeLeft, setTimeLeft] = useState(undoTimeout)
  const [showToast, setShowToast] = useState(!!action)

  useEffect(() => {
    if (!action) {
      setShowToast(false)
      return
    }

    setShowToast(true)
    setTimeLeft(undoTimeout)

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 100) {
          clearInterval(interval)
          setShowToast(false)
          return 0
        }
        return prev - 100
      })
    }, 100)

    return () => clearInterval(interval)
  }, [action, undoTimeout])

  if (!action) return null

  const getActionText = (): { title: string; message: string } => {
    switch (action.action) {
      case 'pause':
        return {
          title: `Campaign paused`,
          message: `"${action.campaignTitle}" has been paused`,
        }
      case 'resume':
        return {
          title: `Campaign resumed`,
          message: `"${action.campaignTitle}" is now live`,
        }
      case 'complete':
        return {
          title: `Campaign completed`,
          message: `"${action.campaignTitle}" has been archived`,
        }
      case 'delete':
        return {
          title: `Campaign deleted`,
          message: `"${action.campaignTitle}" has been permanently deleted`,
        }
      default:
        return { title: '', message: '' }
    }
  }

  const { title, message } = getActionText()

  return (
    <ToastContainer
      isVisible={showToast}
      riskLevel={action.riskLevel}
      style={{ position: 'relative' }}
    >
      <ToastContent>
        <ToastTitle>{title}</ToastTitle>
        <ToastMessage>{message}</ToastMessage>
      </ToastContent>

      <ToastActions>
        {action.riskLevel !== 'high' && (
          <UndoButton
            onClick={() => {
              onUndo(action.id)
              setShowToast(false)
            }}
            title="Undo this action"
          >
            <Undo2 />
            Undo
          </UndoButton>
        )}
        <DismissButton
          onClick={() => {
            onDismiss(action.id)
            setShowToast(false)
          }}
          title="Dismiss notification"
        >
          <X />
        </DismissButton>
      </ToastActions>

      {action.riskLevel !== 'high' && (
        <ProgressBar timeLeft={timeLeft} totalTime={undoTimeout} />
      )}
    </ToastContainer>
  )
}

/**
 * Hook for managing undoable actions
 * Automatically handles undo state and cleanup
 */
export function useUndoableAction() {
  const [lastAction, setLastAction] = useState<SmartConfirmationAction | null>(null)
  const [undoStack, setUndoStack] = useState<SmartConfirmationAction[]>([])

  const executeAction = useCallback(
    (
      action: Omit<SmartConfirmationAction, 'timestamp'>,
      undoFn: () => Promise<void>
    ) => {
      const actionWithTime: SmartConfirmationAction = {
        ...action,
        timestamp: new Date(),
        undoHandler: () => undoFn(),
      }

      setLastAction(actionWithTime)
      setUndoStack((prev) => [actionWithTime, ...prev])
    },
    []
  )

  const undo = useCallback((actionId: string) => {
    setUndoStack((prev) => {
      const action = prev.find((a) => a.id === actionId)
      if (action) {
        action.undoHandler()
      }
      return prev.filter((a) => a.id !== actionId)
    })
  }, [])

  const dismiss = useCallback((actionId: string) => {
    setUndoStack((prev) => prev.filter((a) => a.id !== actionId))
  }, [])

  return {
    lastAction,
    undoStack,
    executeAction,
    undo,
    dismiss,
  }
}

export default SmartConfirmation
