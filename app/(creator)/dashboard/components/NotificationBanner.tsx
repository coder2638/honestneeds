'use client';

import styled, { keyframes, css } from 'styled-components';
import { X, AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react';
import { useEffect, useState } from 'react';

/**
 * Notification Banner Component
 * Displays real-time notifications in a stack with auto-dismiss
 */

export interface NotificationData {
  id: string;
  title: string;
  description?: string;
  severity?: 'success' | 'error' | 'warning' | 'info' | 'danger';
  duration?: number; // ms, default 6000
  onDismiss?: (id: string) => void;
  action?: {
    label: string;
    onClick: () => void;
  };
}

// Animations
const slideInLeft = keyframes`
  from {
    opacity: 0;
    transform: translateX(-100px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const slideOutLeft = keyframes`
  from {
    opacity: 1;
    transform: translateX(0);
  }
  to {
    opacity: 0;
    transform: translateX(-100px);
  }
`;

const Container = styled.div`
  position: fixed;
  top: 80px;
  left: 20px;
  right: auto;
  bottom: auto;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-width: 400px;
  pointer-events: none;

  @media (max-width: 768px) {
    left: 10px;
    right: 10px;
    max-width: none;
    top: 70px;
  }
`;

const ToastContainer = styled.div<{ severity?: string; isExiting?: boolean }>`
  display: flex;
  gap: 12px;
  padding: 16px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border-left: 4px solid
    ${(props) => {
      switch (props.severity) {
        case 'success':
          return '#10b981';
        case 'error':
        case 'danger':
          return '#ef4444';
        case 'warning':
          return '#f59e0b';
        case 'info':
          return '#3b82f6';
        default:
          return '#6b7280';
      }
    }};
  pointer-events: auto;
  animation: ${(props) =>
    props.isExiting
      ? css`
          ${slideOutLeft} 300ms ease-out forwards
        `
      : css`
          ${slideInLeft} 300ms ease-out
        `};
  align-items: flex-start;

  &:hover {
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
  }
`;

const IconContainer = styled.div<{ severity?: string }>`
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${(props) => {
    switch (props.severity) {
      case 'success':
        return '#10b981';
      case 'error':
      case 'danger':
        return '#ef4444';
      case 'warning':
        return '#f59e0b';
      case 'info':
        return '#3b82f6';
      default:
        return '#6b7280';
    }
  }};
  margin-top: 2px;
`;

const ContentContainer = styled.div`
  flex: 1;
  min-width: 0;
`;

const Title = styled.div`
  font-weight: 600;
  font-size: 14px;
  color: #1f2937;
  margin-bottom: 4px;
`;

const Description = styled.div`
  font-size: 13px;
  color: #6b7280;
  line-height: 1.4;
  margin-bottom: 8px;
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  color: #3b82f6;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  padding: 0;

  &:hover {
    text-decoration: underline;
  }
`;

const CloseButton = styled.button`
  flex-shrink: 0;
  background: none;
  border: none;
  cursor: pointer;
  color: #9ca3af;
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;

  &:hover {
    background: #f3f4f6;
    color: #4b5563;
  }
`;

const ProgressBar = styled.div<{ duration?: number }>`
  position: absolute;
  bottom: 0;
  left: 0;
  height: 3px;
  background: #e5e7eb;
  border-radius: 0 0 8px 0;
  animation: ${keyframes`
    from {
      width: 100%;
    }
    to {
      width: 0%;
    }
  `} ${(props) => props.duration || 6000}ms linear;
`;

function NotificationToast({
  notification,
  onDismiss,
}: {
  notification: NotificationData;
  onDismiss: (id: string) => void;
}) {
  const [isExiting, setIsExiting] = useState(false);

  const getSeverityIcon = (severity?: string) => {
    switch (severity) {
      case 'success':
        return <CheckCircle size={20} />;
      case 'error':
      case 'danger':
        return <AlertCircle size={20} />;
      case 'warning':
        return <AlertTriangle size={20} />;
      case 'info':
        return <Info size={20} />;
      default:
        return <Info size={20} />;
    }
  };

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      onDismiss(notification.id);
      notification.onDismiss?.(notification.id);
    }, 300);
  };

  // Auto dismiss
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(() => {
        onDismiss(notification.id);
        notification.onDismiss?.(notification.id);
      }, 300);
    }, notification.duration || 6000);
    return () => clearTimeout(timer);
  }, [notification, onDismiss]);

  return (
    <ToastContainer severity={notification.severity} isExiting={isExiting}>
      <IconContainer severity={notification.severity}>
        {getSeverityIcon(notification.severity)}
      </IconContainer>

      <ContentContainer>
        <Title>{notification.title}</Title>
        {notification.description && <Description>{notification.description}</Description>}
        {notification.action && (
          <ActionButton onClick={notification.action.onClick}>
            {notification.action.label}
          </ActionButton>
        )}
      </ContentContainer>

      <CloseButton onClick={handleClose} aria-label="Close notification">
        <X size={18} />
      </CloseButton>

      <ProgressBar duration={notification.duration || 6000} />
    </ToastContainer>
  );
}

interface NotificationStackProps {
  notifications: NotificationData[];
  onDismiss?: (id: string) => void;
  maxVisible?: number;
}

export function NotificationStack({
  notifications,
  onDismiss,
  maxVisible = 5,
}: NotificationStackProps) {
  const visibleNotifications = notifications.slice(0, maxVisible);

  const handleDismiss = (id: string) => {
    onDismiss?.(id);
  };

  return (
    <Container>
      {visibleNotifications.map((notification) => (
        <NotificationToast
          key={notification.id}
          notification={notification}
          onDismiss={handleDismiss}
        />
      ))}
    </Container>
  );
}
