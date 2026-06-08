/**
 * Prayer Notification Bell Component
 * Displays notification badge with unread count
 * Clicking opens notification panel
 */

'use client'

import React, { useState } from 'react'
import styled from 'styled-components'
import { Bell, X } from 'lucide-react'
import usePrayerNotifications from '../../api/hooks/usePrayerNotifications'
import { COLORS, SPACING, TYPOGRAPHY } from '@/styles/tokens'

const BellContainer = styled.div`
  position: relative;
  display: inline-block;
`;

const BellButton = styled.button`
  position: relative;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: ${SPACING[2]};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${COLORS.BORDER};
  }

  &:active {
    transform: scale(0.95);
  }

  svg {
    width: 24px;
    height: 24px;
    color: ${COLORS.TEXT};
  }
`;

const Badge = styled.span`
  position: absolute;
  top: -4px;
  right: -4px;
  background-color: ${COLORS.ERROR};
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${TYPOGRAPHY.SIZE_SM};
  font-weight: bold;
  animation: pulse 2s infinite;

  @keyframes pulse {
    0% {
      box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7);
    }
    70% {
      box-shadow: 0 0 0 8px rgba(239, 68, 68, 0);
    }
    100% {
      box-shadow: 0 0 0 0 rgba(239, 68, 68, 0);
    }
  }
`;

const PanelOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: ${COLORS.OVERLAY};
  z-index: 999;
`;

const NotificationPanel = styled.div`
  position: absolute;
  top: 50px;
  right: 0;
  width: 420px;
  max-height: 600px;
  background: ${COLORS.SURFACE};
  border-radius: 0.75rem;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  overflow: hidden;
  display: flex;
  flex-direction: column;

  @media (max-width: 480px) {
    width: 360px;
    max-width: 95vw;
  }
`;

const PanelHeader = styled.div`
  padding: ${SPACING[4]};
  border-bottom: 1px solid ${COLORS.BORDER};
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: ${COLORS.PRIMARY};
  color: white;

  h3 {
    margin: 0;
    font-size: ${TYPOGRAPHY.SIZE_LG};
    font-weight: 600;
  }
`;

const CloseButton = styled.button`
  background: transparent;
  border: none;
  color: white;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    opacity: 0.8;
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

const PanelContent = styled.div`
  overflow-y: auto;
  flex: 1;
  max-height: 500px;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
  }

  &::-webkit-scrollbar-thumb {
    background: #ccc;
    border-radius: 3px;

    &:hover {
      background: #999;
    }
  }
`;

const EmptyState = styled.div`
  padding: ${SPACING[8]} ${SPACING[4]};
  text-align: center;
  color: ${COLORS.MUTED_TEXT};

  p {
    margin: 0;
    font-size: ${TYPOGRAPHY.SIZE_SM};
  }
`;

const NotificationItem = styled.div`
  padding: ${SPACING[3]} ${SPACING[4]};
  border-bottom: 1px solid ${COLORS.BORDER};
  cursor: pointer;
  transition: background-color 0.2s ease;
  background-color: ${(props) => (props.unread ? COLORS.BG : COLORS.SURFACE)};

  &:hover {
    background-color: ${COLORS.BG};
  }

  &:last-child {
    border-bottom: none;
  }
`;

const NotificationIcon = styled.span`
  font-size: 1.25rem;
  margin-right: ${SPACING[3]};
`;

const NotificationTitle = styled.h4`
  margin: 0 0 ${SPACING[1]} 0;
  font-size: ${TYPOGRAPHY.SIZE_SM};
  font-weight: 600;
  color: ${COLORS.TEXT};
`;

const NotificationMessage = styled.p`
  margin: 0;
  font-size: 0.75rem;
  color: ${COLORS.MUTED_TEXT};
  line-height: 1.4;
`;

const NotificationTime = styled.span`
  font-size: 0.6875rem;
  color: ${COLORS.MUTED_TEXT};
  margin-top: ${SPACING[1]};
  display: block;
`;

const PrayerNotificationBell = ({ userId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const {
    notifications,
    unreadCount,
    notificationsLoading,
    markAsRead,
    deleteNotification,
  } = usePrayerNotifications(userId);

  const handleNotificationClick = (notificationId) => {
    markAsRead(notificationId);
  };

  const handleDeleteNotification = (e, notificationId) => {
    e.stopPropagation();
    deleteNotification(notificationId);
  };

  const formatTime = (date) => {
    const now = new Date();
    const notifDate = new Date(date);
    const diffMs = now - notifDate;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return notifDate.toLocaleDateString();
  };

  return (
    <BellContainer>
      <BellButton onClick={() => setIsOpen(!isOpen)} title="Notifications">
        <Bell />
        {unreadCount > 0 && <Badge>{unreadCount > 99 ? '99+' : unreadCount}</Badge>}
      </BellButton>

      {isOpen && (
        <>
          <PanelOverlay onClick={() => setIsOpen(false)} />
          <NotificationPanel>
            <PanelHeader>
              <h3>Notifications</h3>
              <CloseButton onClick={() => setIsOpen(false)}>
                <X />
              </CloseButton>
            </PanelHeader>

            <PanelContent>
              {notificationsLoading ? (
                <EmptyState>
                  <p>Loading notifications...</p>
                </EmptyState>
              ) : notifications.length === 0 ? (
                <EmptyState>
                  <p>✅ No new notifications</p>
                </EmptyState>
              ) : (
                notifications.map((notification) => (
                  <NotificationItem
                    key={notification._id}
                    unread={!notification.read}
                    onClick={() => handleNotificationClick(notification._id)}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <NotificationIcon>{notification.icon_emoji || '🔔'}</NotificationIcon>
                          <NotificationTitle>{notification.title}</NotificationTitle>
                        </div>
                        <NotificationMessage>{notification.message}</NotificationMessage>
                        <NotificationTime>{formatTime(notification.created_at)}</NotificationTime>
                      </div>
                      <button
                        style={{
                          background: 'transparent',
                          border: 'none',
                          cursor: 'pointer',
                          color: '#ccc',
                          padding: '0 8px',
                        }}
                        onClick={(e) => handleDeleteNotification(e, notification._id)}
                      >
                        ×
                      </button>
                    </div>
                  </NotificationItem>
                ))
              )}
            </PanelContent>
          </NotificationPanel>
        </>
      )}
    </BellContainer>
  );
};

export { PrayerNotificationBell }
