'use client'

import React, { useState } from 'react'
import styled from 'styled-components'
import { Button } from '@/components/Button'
import { CampaignPrayerConfig, campaignPrayerConfigSchema } from '@/utils/prayerValidationSchemas'
import { Modal } from '@/components/Modal'
import { COLORS, SPACING, TYPOGRAPHY } from '@/styles/tokens'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${SPACING[6]};
`

const EnableSection = styled.div`
  background-color: #f3e8ff;
  padding: ${SPACING[6]};
  border-radius: 0.5rem;
  border: 1px solid #e9d5ff;
`

const EnableSectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const EnableSectionTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 700;
  color: ${COLORS.TEXT};
  display: flex;
  align-items: center;
  gap: ${SPACING[2]};
  margin: 0;
`

const EnableSectionTitleEmoji = styled.span`
  font-size: 1.5rem;
`

const EnableSectionDescription = styled.p`
  font-size: ${TYPOGRAPHY.SIZE_SM};
  color: ${COLORS.MUTED_TEXT};
  margin-top: ${SPACING[1]};
  margin-bottom: 0;
`

const ToggleLabel = styled.label`
  position: relative;
  display: inline-flex;
  align-items: center;
  cursor: pointer;
`

const ToggleCheckbox = styled.input`
  position: absolute;
  width: 0;
  height: 0;
  opacity: 0;
`

const ToggleSlider = styled.div`
  width: 2.75rem;
  height: 1.5rem;
  background-color: #d1d5db;
  border-radius: 9999px;
  transition: background-color 0.2s ease;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    top: 2px;
    left: 2px;
    width: 1.25rem;
    height: 1.25rem;
    background-color: white;
    border-radius: 50%;
    transition: transform 0.2s ease;
  }

  ${ToggleCheckbox}:checked + & {
    background-color: ${COLORS.PRIMARY};

    &::after {
      transform: translateX(1.25rem);
    }
  }

  ${ToggleCheckbox}:focus + & {
    box-shadow: 0 0 0 3px ${COLORS.PRIMARY_BG};
  }
`

const DisabledStateBox = styled.div`
  background-color: ${COLORS.BG};
  padding: ${SPACING[4]};
  border-radius: 0.5rem;
  text-align: center;
`

const DisabledStateText = styled.p`
  font-size: ${TYPOGRAPHY.SIZE_SM};
  color: ${COLORS.MUTED_TEXT};
  margin: 0;
`

const ConfigSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${SPACING[6]};
`

const SectionHeader = styled.h4`
  font-weight: 600;
  color: ${COLORS.TEXT};
  margin: 0;
  margin-bottom: ${SPACING[1]};
`

const BasicSettingsSection = styled.section`
  display: flex;
  flex-direction: column;
  gap: ${SPACING[4]};
`

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
`

const FormLabel = styled.label`
  display: block;
  font-size: ${TYPOGRAPHY.SIZE_SM};
  font-weight: 500;
  color: ${COLORS.TEXT};
  margin-bottom: ${SPACING[2]};
`

const FormInput = styled.input`
  width: 100%;
  padding: ${SPACING[2]} ${SPACING[3]};
  border: 1px solid ${COLORS.BORDER};
  border-radius: 0.5rem;
  background-color: ${COLORS.SURFACE};
  color: ${COLORS.TEXT};
  font-family: ${TYPOGRAPHY.FONT_BODY};
  font-size: ${TYPOGRAPHY.SIZE_SM};
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${COLORS.PRIMARY};
    box-shadow: 0 0 0 2px ${COLORS.PRIMARY_BG};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`

const FormTextArea = styled.textarea`
  width: 100%;
  padding: ${SPACING[2]} ${SPACING[3]};
  border: 1px solid ${COLORS.BORDER};
  border-radius: 0.5rem;
  background-color: ${COLORS.SURFACE};
  color: ${COLORS.TEXT};
  font-family: ${TYPOGRAPHY.FONT_BODY};
  font-size: ${TYPOGRAPHY.SIZE_SM};
  resize: vertical;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${COLORS.PRIMARY};
    box-shadow: 0 0 0 2px ${COLORS.PRIMARY_BG};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`

const FormHint = styled.p`
  font-size: 0.75rem;
  color: ${COLORS.MUTED_TEXT};
  margin-top: ${SPACING[1]};
  margin-bottom: 0;
`

const CheckboxSection = styled.section`
  display: flex;
  flex-direction: column;
  gap: ${SPACING[3]};
  padding: ${SPACING[4]};
  background-color: ${COLORS.BG};
  border-radius: 0.5rem;
`

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: ${SPACING[3]};
  cursor: pointer;
`

const CheckboxInput = styled.input`
  width: 1rem;
  height: 1rem;
  border-radius: 0.25rem;
  cursor: pointer;
`

const CheckboxText = styled.span`
  font-size: ${TYPOGRAPHY.SIZE_SM};
  font-weight: 500;
  color: ${COLORS.TEXT};
`

const CheckboxHint = styled.span`
  font-size: 0.75rem;
  color: ${COLORS.MUTED_TEXT};
`

const PrivacySettingsSection = styled(CheckboxSection)`
  gap: ${SPACING[3]};
`

const PrivacyCheckboxLabel = styled(CheckboxLabel)`
  gap: ${SPACING[3]};
`

const PrivacyLabelContent = styled.div`
  flex: 1;
`

const PrivacyLabelTitle = styled.p`
  font-size: ${TYPOGRAPHY.SIZE_SM};
  font-weight: 500;
  color: ${COLORS.TEXT};
  margin: 0;
  margin-bottom: ${SPACING[1]};
`

const PrivacyLabelDescription = styled.p`
  font-size: 0.75rem;
  color: ${COLORS.MUTED_TEXT};
  margin: 0;
`

const ApprovalCheckboxLabel = styled(PrivacyCheckboxLabel)`
  padding-top: ${SPACING[2]};
  border-top: 1px solid ${COLORS.BORDER};
  margin-top: ${SPACING[2]};
`

const InfoBox = styled.div`
  background-color: #eff6ff;
  padding: ${SPACING[3]};
  border-radius: 0.5rem;
  border: 1px solid #bfdbfe;
`

const InfoBoxText = styled.p`
  font-size: ${TYPOGRAPHY.SIZE_SM};
  color: #0c4a6e;
  margin: 0;
`

const SaveButtonSection = styled.div`
  padding-top: ${SPACING[4]};
  border-top: 1px solid ${COLORS.BORDER};
`

const ConfirmModalContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${SPACING[4]};
`

const ConfirmModalText = styled.p`
  font-size: ${TYPOGRAPHY.SIZE_SM};
  color: ${COLORS.MUTED_TEXT};
  margin: 0;
`

const ConfirmModalList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: ${SPACING[2]};
  font-size: ${TYPOGRAPHY.SIZE_SM};
  color: ${COLORS.MUTED_TEXT};
  padding-left: 0;
  margin: 0;
  list-style: none;
`

const ConfirmModalListItem = styled.li`
  display: flex;
  align-items: flex-start;
  gap: ${SPACING[2]};
`

const ConfirmModalListBullet = styled.span`
  color: #dc2626;
`

const ConfirmModalButtons = styled.div`
  display: flex;
  gap: ${SPACING[2]};
  padding-top: ${SPACING[4]};
`

interface PrayerRequestConfigProps {
  initialConfig?: Partial<CampaignPrayerConfig>
  onSave: (config: CampaignPrayerConfig) => void
  isLoading?: boolean
}

/**
 * PrayerRequestConfig Component
 * Configure prayer support for a campaign
 * Can be used in campaign creation wizard or campaign settings
 */
const PrayerRequestConfig: React.FC<PrayerRequestConfigProps> = ({
  initialConfig,
  onSave,
  isLoading = false,
}) => {
  const [enabled, setEnabled] = useState(initialConfig?.enabled ?? false)
  const [title, setTitle] = useState(initialConfig?.title ?? 'Prayer Support')
  const [description, setDescription] = useState(
    initialConfig?.description ?? 'Join us in prayer for this campaign'
  )
  const [prayerGoal, setPrayerGoal] = useState(initialConfig?.prayer_goal ?? 100)

  // Prayer type toggles
  const [allowTextPrayers, setAllowTextPrayers] = useState(
    initialConfig?.settings?.allow_text_prayers ?? true
  )
  const [allowVoicePrayers, setAllowVoicePrayers] = useState(
    initialConfig?.settings?.allow_voice_prayers ?? true
  )
  const [allowVideoPrayers, setAllowVideoPrayers] = useState(
    initialConfig?.settings?.allow_video_prayers ?? true
  )

  // Privacy & moderation toggles
  const [prayersPublic, setPrayersPublic] = useState(
    initialConfig?.settings?.prayers_public ?? true
  )
  const [showPrayerCount, setShowPrayerCount] = useState(
    initialConfig?.settings?.show_prayer_count ?? true
  )
  const [anonymousPrayers, setAnonymousPrayers] = useState(
    initialConfig?.settings?.anonymous_prayers ?? true
  )
  const [requireApproval, setRequireApproval] = useState(
    initialConfig?.settings?.require_approval ?? false
  )

  const [showDisableConfirm, setShowDisableConfirm] = useState(false)

  const handleToggleEnabled = (newState: boolean) => {
    if (!newState && enabled) {
      // Show confirmation if disabling
      setShowDisableConfirm(true)
    } else {
      setEnabled(newState)
    }
  }

  const handleConfirmDisable = () => {
    setEnabled(false)
    setShowDisableConfirm(false)
  }

  const handleSave = () => {
    const config: CampaignPrayerConfig = {
      enabled,
      title: enabled ? title : undefined,
      description: enabled ? description : undefined,
      prayer_goal: enabled ? prayerGoal : undefined,
      settings: {
        allow_text_prayers: allowTextPrayers,
        allow_voice_prayers: allowVoicePrayers,
        allow_video_prayers: allowVideoPrayers,
        prayers_public: prayersPublic,
        show_prayer_count: showPrayerCount,
        anonymous_prayers: anonymousPrayers,
        require_approval: requireApproval,
      },
    }

    // Validate
    const validation = campaignPrayerConfigSchema.safeParse(config)
    if (!validation.success) {
      console.error('Validation errors:', validation.error)
      return
    }

    onSave(config)
  }

  return (
    <Container>
      {/* Enable/Disable Section */}
      <EnableSection>
        <EnableSectionHeader>
          <div>
            <EnableSectionTitle>
              <EnableSectionTitleEmoji>🙏</EnableSectionTitleEmoji>
              Prayer Support
            </EnableSectionTitle>
            <EnableSectionDescription>
              Enable supporters to send prayers of encouragement for your campaign
            </EnableSectionDescription>
          </div>

          <ToggleLabel>
            <ToggleCheckbox
              type="checkbox"
              checked={enabled}
              onChange={(e) => handleToggleEnabled(e.target.checked)}
              disabled={isLoading}
            />
            <ToggleSlider />
          </ToggleLabel>
        </EnableSectionHeader>
      </EnableSection>

      {/* Disabled State Message */}
      {!enabled && (
        <DisabledStateBox>
          <DisabledStateText>
            Prayer support is currently disabled. Enable it above to configure.
          </DisabledStateText>
        </DisabledStateBox>
      )}

      {/* Configuration Section (only show if enabled) */}
      {enabled && (
        <ConfigSection>
          {/* Basic Settings */}
          <BasicSettingsSection>
            <SectionHeader>Basic Settings</SectionHeader>

            <FormGroup>
              <FormLabel htmlFor="prayer-title">Prayer Title</FormLabel>
              <FormInput
                id="prayer-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={isLoading}
                maxLength={100}
              />
              <FormHint>{title.length} / 100 characters</FormHint>
            </FormGroup>

            <FormGroup>
              <FormLabel htmlFor="prayer-description">Description</FormLabel>
              <FormTextArea
                id="prayer-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={isLoading}
                rows={3}
                maxLength={500}
              />
              <FormHint>{description.length} / 500 characters</FormHint>
            </FormGroup>

            <FormGroup>
              <FormLabel htmlFor="prayer-goal">Prayer Goal (optional)</FormLabel>
              <FormInput
                id="prayer-goal"
                type="number"
                value={prayerGoal}
                onChange={(e) => setPrayerGoal(Math.max(1, parseInt(e.target.value) || 1))}
                disabled={isLoading}
                min={1}
                max={10000}
              />
              <FormHint>Target number of prayers (1 - 10,000)</FormHint>
            </FormGroup>
          </BasicSettingsSection>

          {/* Prayer Type Settings */}
          <CheckboxSection>
            <SectionHeader>Allowed Prayer Types</SectionHeader>

            <CheckboxLabel>
              <CheckboxInput type="checkbox" checked={true} disabled />
              <div>
                <CheckboxText>👆 Tap Prayer</CheckboxText>
                <CheckboxHint style={{ display: 'inline-block', marginLeft: '0.5rem' }}>
                  (Always enabled)
                </CheckboxHint>
              </div>
            </CheckboxLabel>

            <CheckboxLabel>
              <CheckboxInput
                type="checkbox"
                checked={allowTextPrayers}
                onChange={(e) => setAllowTextPrayers(e.target.checked)}
                disabled={isLoading}
              />
              <CheckboxText>✍️ Text Prayer</CheckboxText>
            </CheckboxLabel>

            <CheckboxLabel>
              <CheckboxInput
                type="checkbox"
                checked={allowVoicePrayers}
                onChange={(e) => setAllowVoicePrayers(e.target.checked)}
                disabled={isLoading}
              />
              <CheckboxText>🎙️ Voice Prayer</CheckboxText>
            </CheckboxLabel>

            <CheckboxLabel>
              <CheckboxInput
                type="checkbox"
                checked={allowVideoPrayers}
                onChange={(e) => setAllowVideoPrayers(e.target.checked)}
                disabled={isLoading}
              />
              <CheckboxText>🎥 Video Prayer</CheckboxText>
            </CheckboxLabel>
          </CheckboxSection>

          {/* Privacy & Moderation Settings */}
          <PrivacySettingsSection>
            <SectionHeader>Privacy & Moderation</SectionHeader>

            <PrivacyCheckboxLabel>
              <CheckboxInput
                type="checkbox"
                checked={prayersPublic}
                onChange={(e) => setPrayersPublic(e.target.checked)}
                disabled={isLoading}
              />
              <PrivacyLabelContent>
                <PrivacyLabelTitle>Display prayers publicly</PrivacyLabelTitle>
                <PrivacyLabelDescription>
                  Show prayers in a public feed on the campaign page
                </PrivacyLabelDescription>
              </PrivacyLabelContent>
            </PrivacyCheckboxLabel>

            <PrivacyCheckboxLabel>
              <CheckboxInput
                type="checkbox"
                checked={showPrayerCount}
                onChange={(e) => setShowPrayerCount(e.target.checked)}
                disabled={isLoading}
              />
              <PrivacyLabelContent>
                <PrivacyLabelTitle>Show prayer count</PrivacyLabelTitle>
                <PrivacyLabelDescription>
                  Display total number of prayers received
                </PrivacyLabelDescription>
              </PrivacyLabelContent>
            </PrivacyCheckboxLabel>

            <PrivacyCheckboxLabel>
              <CheckboxInput
                type="checkbox"
                checked={anonymousPrayers}
                onChange={(e) => setAnonymousPrayers(e.target.checked)}
                disabled={isLoading}
              />
              <PrivacyLabelContent>
                <PrivacyLabelTitle>Allow anonymous prayers</PrivacyLabelTitle>
                <PrivacyLabelDescription>
                  Let supporters remain anonymous if they wish
                </PrivacyLabelDescription>
              </PrivacyLabelContent>
            </PrivacyCheckboxLabel>

            <ApprovalCheckboxLabel>
              <CheckboxInput
                type="checkbox"
                checked={requireApproval}
                onChange={(e) => setRequireApproval(e.target.checked)}
                disabled={isLoading}
              />
              <PrivacyLabelContent>
                <PrivacyLabelTitle>Require approval before publishing</PrivacyLabelTitle>
                <PrivacyLabelDescription>
                  Review and approve prayers before they appear on the feed
                </PrivacyLabelDescription>
              </PrivacyLabelContent>
            </ApprovalCheckboxLabel>
          </PrivacySettingsSection>

          {/* Info Box */}
          <InfoBox>
            <InfoBoxText>
              💡 <strong>Tip:</strong> Enable &quot;Require approval&quot; for more control over
              the prayer feed. All prayers will go to your moderation queue first.
            </InfoBoxText>
          </InfoBox>

          {/* Save Button */}
          <SaveButtonSection>
            <Button
              onClick={handleSave}
              disabled={isLoading}
              variant="primary"
              style={{ width: '100%' }}
            >
              {isLoading ? 'Saving...' : '💾 Save Prayer Configuration'}
            </Button>
          </SaveButtonSection>
        </ConfigSection>
      )}

      {/* Disable Confirmation Modal */}
      <Modal
        isOpen={showDisableConfirm}
        onClose={() => setShowDisableConfirm(false)}
        title="Disable Prayer Support?"
      >
        <ConfirmModalContent>
          <ConfirmModalText>Disabling prayer support will:</ConfirmModalText>
          <ConfirmModalList>
            <ConfirmModalListItem>
              <ConfirmModalListBullet>•</ConfirmModalListBullet>
              <span>Stop accepting new prayers</span>
            </ConfirmModalListItem>
            <ConfirmModalListItem>
              <ConfirmModalListBullet>•</ConfirmModalListBullet>
              <span>Hide the prayer meter from your campaign page</span>
            </ConfirmModalListItem>
            <ConfirmModalListItem>
              <ConfirmModalListBullet>•</ConfirmModalListBullet>
              <span>Keep existing prayers stored (they won&apos;t be deleted)</span>
            </ConfirmModalListItem>
          </ConfirmModalList>

          <ConfirmModalButtons>
            <Button
              onClick={() => setShowDisableConfirm(false)}
              variant="secondary"
              style={{ flex: 1 }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmDisable}
              variant="primary"
              style={{ flex: 1, backgroundColor: '#dc2626' }}
            >
              Disable Prayer Support
            </Button>
          </ConfirmModalButtons>
        </ConfirmModalContent>
      </Modal>
    </Container>
  )
}
export { PrayerRequestConfig }
