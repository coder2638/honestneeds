'use client';

import styled from 'styled-components';
import { X } from 'lucide-react';
import { useState } from 'react';
import { useNotificationPreferences } from '../context/NotificationPreferencesContext';

/**
 * Notification Preferences Modal Component
 * Allows users to customize notification settings
 */

const Overlay = styled.div<{ isOpen?: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: ${(props) => (props.isOpen ? 'flex' : 'none')};
  align-items: center;
  justify-content: center;
  z-index: 10000;
  opacity: ${(props) => (props.isOpen ? 1 : 0)};
  transition: opacity 200ms;
`;

const Modal = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  max-width: 500px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  animation: slideUp 300ms ease-out;

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

  @media (max-width: 768px) {
    width: 95%;
    max-height: 90vh;
  }
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px;
  border-bottom: 1px solid #e5e7eb;
`;

const Title = styled.h2`
  font-size: 20px;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: #6b7280;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;

  &:hover {
    background: #f3f4f6;
    color: #1f2937;
  }
`;

const Content = styled.div`
  padding: 24px;
  flex: 1;
`;

const Section = styled.div`
  margin-bottom: 32px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const SectionTitle = styled.h3`
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin: 0 0 16px 0;
`;

const ToggleGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const ToggleItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0;
`;

const ToggleLabel = styled.label`
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
  cursor: pointer;
`;

const ToggleLabelText = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: #1f2937;
`;

const ToggleLabelDesc = styled.span`
  font-size: 12px;
  color: #9ca3af;
`;

const Toggle = styled.input`
  width: 44px;
  height: 24px;
  cursor: pointer;
  accent-color: #3b82f6;
`;

const SelectField = styled.select`
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  color: #1f2937;
  background-color: white;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const SliderContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const SliderInput = styled.input`
  flex: 1;
  height: 6px;
  border-radius: 3px;
  background: #e5e7eb;
  outline: none;
  -webkit-appearance: none;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #3b82f6;
    cursor: pointer;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }

  &::-moz-range-thumb {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #3b82f6;
    cursor: pointer;
    border: none;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }
`;

const VolumeValue = styled.span`
  font-size: 14px;
  color: #1f2937;
  font-weight: 500;
  min-width: 40px;
`;

const Footer = styled.div`
  display: flex;
  gap: 12px;
  padding: 16px 24px;
  border-top: 1px solid #e5e7eb;
  background: #f9fafb;
`;

const Button = styled.button<{ $variant?: 'primary' | 'secondary' }>`
  flex: 1;
  padding: 10px 16px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 200ms;

  ${(props) =>
    props.$variant === 'primary'
      ? `
    background: #3b82f6;
    color: white;

    &:hover {
      background: #2563eb;
    }

    &:active {
      background: #1d4ed8;
    }
  `
      : `
    background: #e5e7eb;
    color: #1f2937;

    &:hover {
      background: #d1d5db;
    }

    &:active {
      background: #bfdbfe;
    }
  `}
`;

interface NotificationPreferencesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NotificationPreferencesModal({
  isOpen,
  onClose,
}: NotificationPreferencesModalProps) {
  const { preferences, updatePreference, toggleEventType, updateSoundSettings, resetToDefaults } =
    useNotificationPreferences();
  const [isSaving, setIsSaving] = useState(false);

  const handleToggle = async (key: 'soundEnabled' | 'browserNotificationsEnabled') => {
    try {
      setIsSaving(true);
      await updatePreference(key, !preferences[key]);
    } catch (err) {
      console.error('Failed to update preference:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleNotificationTypeToggle = async (eventType: keyof typeof preferences.notificationTypes) => {
    try {
      setIsSaving(true);
      await toggleEventType(eventType);
    } catch (err) {
      console.error('Failed to toggle event type:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSoundTypeChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    try {
      setIsSaving(true);
      await updateSoundSettings({
        ...preferences.soundSettings,
        soundType: e.target.value as 'bell' | 'chime' | 'ding' | 'notify',
      });
    } catch (err) {
      console.error('Failed to update sound type:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleVolumeChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setIsSaving(true);
      const volumePercent = parseInt(e.target.value);
      const volume = volumePercent / 100; // Convert 0-100 to 0-1
      await updateSoundSettings({
        ...preferences.soundSettings,
        volume,
      });
    } catch (err) {
      console.error('Failed to update volume:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = async () => {
    try {
      setIsSaving(true);
      await resetToDefaults();
      onClose();
    } catch (err) {
      console.error('Failed to reset preferences:', err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Overlay isOpen={isOpen} onClick={onClose}>
      <Modal onClick={(e) => e.stopPropagation()}>
        <Header>
          <Title>Notification Preferences</Title>
          <CloseButton onClick={onClose} aria-label="Close modal">
            <X size={20} />
          </CloseButton>
        </Header>

        <Content>
          {/* Master Toggles */}
          <Section>
            <SectionTitle>General</SectionTitle>
            <ToggleGroup>
              <ToggleItem>
                <ToggleLabel>
                  <ToggleLabelText>Sound Alerts</ToggleLabelText>
                  <ToggleLabelDesc>Play sound for new notifications</ToggleLabelDesc>
                </ToggleLabel>
                <Toggle
                  type="checkbox"
                  checked={preferences.soundEnabled}
                  onChange={() => handleToggle('soundEnabled')}
                  disabled={isSaving}
                />
              </ToggleItem>

              <ToggleItem>
                <ToggleLabel>
                  <ToggleLabelText>Browser Notifications</ToggleLabelText>
                  <ToggleLabelDesc>Show desktop notifications</ToggleLabelDesc>
                </ToggleLabel>
                <Toggle
                  type="checkbox"
                  checked={preferences.browserNotificationsEnabled}
                  onChange={() => handleToggle('browserNotificationsEnabled')}
                  disabled={isSaving}
                />
              </ToggleItem>
            </ToggleGroup>
          </Section>

          {/* Sound Settings */}
          {preferences.soundEnabled && (
            <Section>
              <SectionTitle>Sound Settings</SectionTitle>

              <div style={{ marginBottom: '16px' }}>
                <ToggleLabelText>Sound Type</ToggleLabelText>
                <SelectField
                  value={preferences.soundSettings.soundType}
                  onChange={handleSoundTypeChange}
                  disabled={isSaving}
                >
                  <option value="bell">Bell</option>
                  <option value="chime">Chime</option>
                  <option value="ding">Ding</option>
                  <option value="notify">Notify</option>
                </SelectField>
              </div>

              <div>
                <ToggleLabelText style={{ display: 'block', marginBottom: '8px' }}>
                  Volume
                </ToggleLabelText>
                <SliderContainer>
                  <SliderInput
                    type="range"
                    min="0"
                    max="100"
                    value={Math.round(preferences.soundSettings.volume * 100)}
                    onChange={handleVolumeChange}
                    disabled={isSaving}
                  />
                  <VolumeValue>{Math.round(preferences.soundSettings.volume * 100)}%</VolumeValue>
                </SliderContainer>
              </div>
            </Section>
          )}

          {/* Notification Types */}
          <Section>
            <SectionTitle>Notification Types</SectionTitle>
            <ToggleGroup>
              <ToggleItem>
                <ToggleLabel>
                  <ToggleLabelText>Campaign Activated</ToggleLabelText>
                  <ToggleLabelDesc>When your campaign goes live</ToggleLabelDesc>
                </ToggleLabel>
                <Toggle
                  type="checkbox"
                  checked={preferences.notificationTypes.campaignActivated}
                  onChange={() => handleNotificationTypeToggle('campaignActivated')}
                  disabled={isSaving}
                />
              </ToggleItem>

              <ToggleItem>
                <ToggleLabel>
                  <ToggleLabelText>Donation Received</ToggleLabelText>
                  <ToggleLabelDesc>When you get a donation</ToggleLabelDesc>
                </ToggleLabel>
                <Toggle
                  type="checkbox"
                  checked={preferences.notificationTypes.donationReceived}
                  onChange={() => handleNotificationTypeToggle('donationReceived')}
                  disabled={isSaving}
                />
              </ToggleItem>

              <ToggleItem>
                <ToggleLabel>
                  <ToggleLabelText>Goal Reached</ToggleLabelText>
                  <ToggleLabelDesc>When campaign reaches its goal</ToggleLabelDesc>
                </ToggleLabel>
                <Toggle
                  type="checkbox"
                  checked={preferences.notificationTypes.goalReached}
                  onChange={() => handleNotificationTypeToggle('goalReached')}
                  disabled={isSaving}
                />
              </ToggleItem>

              <ToggleItem>
                <ToggleLabel>
                  <ToggleLabelText>Campaign Paused</ToggleLabelText>
                  <ToggleLabelDesc>When campaign is paused</ToggleLabelDesc>
                </ToggleLabel>
                <Toggle
                  type="checkbox"
                  checked={preferences.notificationTypes.campaignPaused}
                  onChange={() => handleNotificationTypeToggle('campaignPaused')}
                  disabled={isSaving}
                />
              </ToggleItem>

              <ToggleItem>
                <ToggleLabel>
                  <ToggleLabelText>Campaign Completed</ToggleLabelText>
                  <ToggleLabelDesc>When campaign is completed</ToggleLabelDesc>
                </ToggleLabel>
                <Toggle
                  type="checkbox"
                  checked={preferences.notificationTypes.campaignCompleted}
                  onChange={() => handleNotificationTypeToggle('campaignCompleted')}
                  disabled={isSaving}
                />
              </ToggleItem>

              <ToggleItem>
                <ToggleLabel>
                  <ToggleLabelText>Comment Received</ToggleLabelText>
                  <ToggleLabelDesc>When someone comments on your campaign</ToggleLabelDesc>
                </ToggleLabel>
                <Toggle
                  type="checkbox"
                  checked={preferences.notificationTypes.commentReceived}
                  onChange={() => handleNotificationTypeToggle('commentReceived')}
                  disabled={isSaving}
                />
              </ToggleItem>

              <ToggleItem>
                <ToggleLabel>
                  <ToggleLabelText>Milestone Achieved</ToggleLabelText>
                  <ToggleLabelDesc>When a campaign milestone is reached</ToggleLabelDesc>
                </ToggleLabel>
                <Toggle
                  type="checkbox"
                  checked={preferences.notificationTypes.milestoneAchieved}
                  onChange={() => handleNotificationTypeToggle('milestoneAchieved')}
                  disabled={isSaving}
                />
              </ToggleItem>
            </ToggleGroup>
          </Section>
        </Content>

        <Footer>
          <Button onClick={handleReset} disabled={isSaving}>
            Reset to Defaults
          </Button>
          <Button $variant="secondary" onClick={onClose} disabled={isSaving}>
            Close
          </Button>
        </Footer>
      </Modal>
    </Overlay>
  );
}
