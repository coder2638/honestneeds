/**
 * Prayer Notification Preferences Component
 * Allows users to customize notification channels and types
 */

'use client'

import React, { useState } from 'react'
import styled from 'styled-components'
import { Save, AlertCircle } from 'lucide-react'
import usePrayerNotifications from '../../api/hooks/usePrayerNotifications'
import { COLORS, SPACING, TYPOGRAPHY } from '@/styles/tokens'

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

const Section = styled.div`
  background: ${COLORS.SURFACE};
  border-radius: 0.75rem;
  padding: ${SPACING[6]};
  margin-bottom: ${SPACING[5]};
  border: 1px solid ${COLORS.BORDER};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
`;

const SectionTitle = styled.h3`
  margin: 0 0 ${SPACING[5]} 0;
  font-size: ${TYPOGRAPHY.SIZE_LG};
  font-weight: 600;
  color: ${COLORS.TEXT};
  display: flex;
  align-items: center;
  gap: ${SPACING[2]};
`;

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${SPACING[3]} 0;
  border-bottom: 1px solid ${COLORS.BORDER};

  &:last-child {
    border-bottom: none;
  }
`;

const Label = styled.label`
  display: flex;
  align-items: center;
  cursor: pointer;
  gap: ${SPACING[3]};
  flex: 1;
  margin: 0;

  input {
    cursor: pointer;
  }
`;

const LabelText = styled.div`
  flex: 1;
`;

const LabelTitle = styled.div`
  font-weight: 500;
  color: ${COLORS.TEXT};
  margin-bottom: ${SPACING[1]};
`;

const LabelDescription = styled.div`
  font-size: 0.8125rem;
  color: ${COLORS.MUTED_TEXT};
`;

const ChannelGroup = styled.div`
  margin-top: ${SPACING[4]};
  padding: ${SPACING[4]};
  background: ${COLORS.BG};
  border-radius: 0.5rem;
`;

const ChannelLabel = styled.label`
  display: flex;
  align-items: center;
  gap: ${SPACING[2]};
  margin-bottom: ${SPACING[3]};
  cursor: pointer;

  &:last-child {
    margin-bottom: 0;
  }

  input {
    cursor: pointer;
  }
`;

const TimeInput = styled.input`
  padding: ${SPACING[2]} ${SPACING[3]};
  border: 1px solid ${COLORS.BORDER};
  border-radius: 0.375rem;
  font-size: ${TYPOGRAPHY.SIZE_SM};

  &:focus {
    outline: none;
    border-color: ${COLORS.PRIMARY};
  }
`;

const FrequencyInput = styled.input`
  padding: ${SPACING[2]} ${SPACING[3]};
  border: 1px solid ${COLORS.BORDER};
  border-radius: 0.375rem;
  font-size: ${TYPOGRAPHY.SIZE_SM};
  width: 80px;

  &:focus {
    outline: none;
    border-color: ${COLORS.PRIMARY};
  }
`;

const SaveButton = styled.button`
  background: ${COLORS.PRIMARY};
  color: white;
  border: none;
  padding: ${SPACING[3]} ${SPACING[6]};
  border-radius: 0.5rem;
  cursor: pointer;
  font-size: ${TYPOGRAPHY.SIZE_SM};
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: ${SPACING[2]};
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(99, 102, 241, 0.4);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const Alert = styled.div`
  padding: ${SPACING[3]} ${SPACING[4]};
  background: ${COLORS.INFO_BG};
  border-left: 4px solid ${COLORS.INFO};
  border-radius: 0.25rem;
  display: flex;
  align-items: center;
  gap: ${SPACING[3]};
  margin-bottom: ${SPACING[4]};
  color: ${COLORS.INFO};
  font-size: ${TYPOGRAPHY.SIZE_SM};

  svg {
    width: 18px;
    height: 18px;
    flex-shrink: 0;
  }
`;

const PrayerNotificationPreferences = ({ userId }) => {
  const { preferences, preferencesLoading, updatePreferences, isUpdatingPreferences } =
    usePrayerNotifications(userId);

  const [formState, setFormState] = useState(preferences || {});

  // Update form when preferences load
  React.useEffect(() => {
    if (preferences) {
      setFormState(preferences);
    }
  }, [preferences]);

  const handleToggle = (path, value) => {
    const keys = path.split('.');
    const newState = JSON.parse(JSON.stringify(formState));

    let obj = newState;
    for (let i = 0; i < keys.length - 1; i++) {
      if (!obj[keys[i]]) obj[keys[i]] = {};
      obj = obj[keys[i]];
    }
    obj[keys[keys.length - 1]] = value;

    setFormState(newState);
  };

  const handleSave = () => {
    updatePreferences(formState);
  };

  if (preferencesLoading) {
    return <div style={{ textAlign: 'center', padding: '40px' }}>Loading preferences...</div>;
  }

  return (
    <Container>
      <Alert>
        <AlertCircle />
        <span>Customize how you receive notifications about prayers for your campaigns</span>
      </Alert>

      {/* Global Settings */}
      <Section>
        <SectionTitle>🔔 Global Settings</SectionTitle>

        <Row>
          <Label>
            <input
              type="checkbox"
              checked={formState.notifications_enabled ?? true}
              onChange={(e) => handleToggle('notifications_enabled', e.target.checked)}
            />
            <LabelText>
              <LabelTitle>Enable Notifications</LabelTitle>
              <LabelDescription>Turn notifications on or off completely</LabelDescription>
            </LabelText>
          </Label>
        </Row>
      </Section>

      {/* Delivery Channels */}
      <Section>
        <SectionTitle>📬 Delivery Channels</SectionTitle>

        <Row>
          <Label>
            <input
              type="checkbox"
              checked={formState.channels?.email?.enabled ?? true}
              onChange={(e) =>
                handleToggle('channels.email.enabled', e.target.checked)
              }
            />
            <LabelText>
              <LabelTitle>Email Notifications</LabelTitle>
              <LabelDescription>Receive notifications via email</LabelDescription>
            </LabelText>
          </Label>
        </Row>

        <Row>
          <Label>
            <input
              type="checkbox"
              checked={formState.channels?.in_app?.enabled ?? true}
              onChange={(e) =>
                handleToggle('channels.in_app.enabled', e.target.checked)
              }
            />
            <LabelText>
              <LabelTitle>In-App Notifications</LabelTitle>
              <LabelDescription>See notifications in the app</LabelDescription>
            </LabelText>
          </Label>
        </Row>

        <Row>
          <Label>
            <input
              type="checkbox"
              checked={formState.channels?.push?.enabled ?? false}
              onChange={(e) =>
                handleToggle('channels.push.enabled', e.target.checked)
              }
            />
            <LabelText>
              <LabelTitle>Push Notifications</LabelTitle>
              <LabelDescription>Browser push notifications (requires permission)</LabelDescription>
            </LabelText>
          </Label>
        </Row>
      </Section>

      {/* Prayer Notification Types */}
      <Section>
        <SectionTitle>🙏 Prayer Notifications</SectionTitle>

        <Row>
          <Label>
            <input
              type="checkbox"
              checked={formState.prayer_notifications?.someone_prayed?.enabled ?? true}
              onChange={(e) =>
                handleToggle('prayer_notifications.someone_prayed.enabled', e.target.checked)
              }
            />
            <LabelText>
              <LabelTitle>Someone Prayed</LabelTitle>
              <LabelDescription>Notified when someone taps to pray</LabelDescription>
            </LabelText>
          </Label>
        </Row>

        <Row>
          <Label>
            <input
              type="checkbox"
              checked={formState.prayer_notifications?.new_text_prayer?.enabled ?? true}
              onChange={(e) =>
                handleToggle('prayer_notifications.new_text_prayer.enabled', e.target.checked)
              }
            />
            <LabelText>
              <LabelTitle>Written Prayers</LabelTitle>
              <LabelDescription>New written prayer submitted</LabelDescription>
            </LabelText>
          </Label>
        </Row>

        <Row>
          <Label>
            <input
              type="checkbox"
              checked={formState.prayer_notifications?.new_voice_prayer?.enabled ?? true}
              onChange={(e) =>
                handleToggle('prayer_notifications.new_voice_prayer.enabled', e.target.checked)
              }
            />
            <LabelText>
              <LabelTitle>Voice Prayers</LabelTitle>
              <LabelDescription>New voice prayer submitted</LabelDescription>
            </LabelText>
          </Label>
        </Row>

        <Row>
          <Label>
            <input
              type="checkbox"
              checked={formState.prayer_notifications?.new_video_prayer?.enabled ?? true}
              onChange={(e) =>
                handleToggle('prayer_notifications.new_video_prayer.enabled', e.target.checked)
              }
            />
            <LabelText>
              <LabelTitle>Video Prayers</LabelTitle>
              <LabelDescription>New video prayer submitted</LabelDescription>
            </LabelText>
          </Label>
        </Row>

        <Row>
          <Label>
            <input
              type="checkbox"
              checked={formState.prayer_notifications?.prayer_milestone?.enabled ?? true}
              onChange={(e) =>
                handleToggle('prayer_notifications.prayer_milestone.enabled', e.target.checked)
              }
            />
            <LabelText>
              <LabelTitle>Prayer Milestones</LabelTitle>
              <LabelDescription>Celebrated when reaching 100, 500, 1000+ prayers</LabelDescription>
            </LabelText>
          </Label>
        </Row>
      </Section>

      {/* Do Not Disturb */}
      <Section>
        <SectionTitle>🌙 Do Not Disturb</SectionTitle>

        <Row>
          <Label>
            <input
              type="checkbox"
              checked={formState.do_not_disturb?.enabled ?? false}
              onChange={(e) =>
                handleToggle('do_not_disturb.enabled', e.target.checked)
              }
            />
            <LabelText>
              <LabelTitle>Enable Do Not Disturb</LabelTitle>
              <LabelDescription>Pause notifications during specific hours</LabelDescription>
            </LabelText>
          </Label>
        </Row>

        {formState.do_not_disturb?.enabled && (
          <ChannelGroup>
            <Row style={{ borderBottom: 'none', marginBottom: '12px' }}>
              <div style={{ flex: 1 }}>
                <LabelTitle style={{ marginBottom: '8px' }}>From</LabelTitle>
                <TimeInput
                  type="time"
                  value={formState.do_not_disturb?.start_time || '22:00'}
                  onChange={(e) =>
                    handleToggle('do_not_disturb.start_time', e.target.value)
                  }
                />
              </div>
              <div style={{ flex: 1, marginLeft: '16px' }}>
                <LabelTitle style={{ marginBottom: '8px' }}>To</LabelTitle>
                <TimeInput
                  type="time"
                  value={formState.do_not_disturb?.end_time || '08:00'}
                  onChange={(e) =>
                    handleToggle('do_not_disturb.end_time', e.target.value)
                  }
                />
              </div>
            </Row>
          </ChannelGroup>
        )}
      </Section>

      {/* Frequency Limits */}
      <Section>
        <SectionTitle>⏱️ Frequency Limits</SectionTitle>

        <Row>
          <LabelText>
            <LabelTitle>Max Daily Emails</LabelTitle>
            <LabelDescription>Maximum emails per day (1-100)</LabelDescription>
          </LabelText>
          <FrequencyInput
            type="number"
            min="1"
            max="100"
            value={formState.frequency_limits?.max_daily_emails || 10}
            onChange={(e) =>
              handleToggle('frequency_limits.max_daily_emails', parseInt(e.target.value, 10))
            }
          />
        </Row>

        <Row>
          <LabelText>
            <LabelTitle>Batching Window</LabelTitle>
            <LabelDescription>Group notifications within (1-60 minutes)</LabelDescription>
          </LabelText>
          <FrequencyInput
            type="number"
            min="1"
            max="60"
            value={formState.frequency_limits?.batching_window_minutes || 5}
            onChange={(e) =>
              handleToggle('frequency_limits.batching_window_minutes', parseInt(e.target.value, 10))
            }
          />
        </Row>
      </Section>

      {/* Save Button */}
      <div style={{ marginTop: '20px', marginBottom: '40px' }}>
        <SaveButton onClick={handleSave} disabled={isUpdatingPreferences}>
          <Save width={18} height={18} />
          {isUpdatingPreferences ? 'Saving...' : 'Save Preferences'}
        </SaveButton>
      </div>
    </Container>
  );
};

export { PrayerNotificationPreferences }
