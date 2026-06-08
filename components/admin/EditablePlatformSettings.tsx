'use client'

import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { Save, RotateCcw, AlertCircle, Check } from 'lucide-react'
import {
  usePlatformSettings,
  useUpdatePlatformSettings,
  useSetMaintenanceMode,
  useValidateSettings,
} from '@/api/hooks/useAdminOperations'
import { Button } from '@/components/Button'
import { Card } from '@/components/Card'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import { PlatformSettings } from '@/api/services/adminContentService'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
`

const Title = styled.h2`
  font-size: 24px;
  font-weight: 700;
  color: #111827;
  margin: 0;
`

const LastUpdated = styled.p`
  font-size: 12px;
  color: #6b7280;
  margin: 0;
`

const FormSection = styled(Card)`
  padding: 24px;
  border: 2px solid #e5e7eb;
`

const SectionTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: #111827;
  margin: 0 0 20px 0;
  display: flex;
  align-items: center;
  gap: 8px;
`

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 24px;

  &:last-of-type {
    margin-bottom: 0;
  }
`

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

const Label = styled.label`
  font-size: 14px;
  font-weight: 600;
  color: #111827;
`

const Description = styled.p`
  font-size: 12px;
  color: #6b7280;
  margin: 0;
`

const Input = styled.input`
  padding: 10px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  &:disabled {
    background: #f3f4f6;
    cursor: not-allowed;
  }
`

const Select = styled.select`
  padding: 10px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  background: white;

  &:focus {
    outline: none;
    border-color: #3b82f6;
  }

  &:disabled {
    background: #f3f4f6;
    cursor: not-allowed;
  }
`

const Checkbox = styled.input`
  width: 20px;
  height: 20px;
  cursor: pointer;
`

const CheckboxGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`

const Alert = styled.div<{ type: 'info' | 'warning' | 'error' | 'success' }>`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 14px;
  border-radius: 6px;
  margin-bottom: 20px;
  font-size: 14px;

  background: ${(props) => {
    switch (props.type) {
      case 'info':
        return '#eff6ff'
      case 'warning':
        return '#fefce8'
      case 'error':
        return '#fee2e2'
      case 'success':
        return '#f0fdf4'
      default:
        return '#f9fafb'
    }
  }};

  color: ${(props) => {
    switch (props.type) {
      case 'info':
        return '#0c4a6e'
      case 'warning':
        return '#78350f'
      case 'error':
        return '#991b1b'
      case 'success':
        return '#166534'
      default:
        return '#4b5563'
    }
  }};

  border-left: 4px solid ${(props) => {
    switch (props.type) {
      case 'info':
        return '#0ea5e9'
      case 'warning':
        return '#f59e0b'
      case 'error':
        return '#ef4444'
      case 'success':
        return '#10b981'
      default:
        return '#6b7280'
    }
  }};
`

const AlertIcon = styled.div`
  flex-shrink: 0;
  margin-top: 2px;
`

const FormFooter = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid #e5e7eb;
`

const ActionButton = styled(Button)`
  display: flex;
  align-items: center;
  gap: 8px;
`

const MaintenanceSection = styled(FormSection)`
  background: #fefce8;
  border-color: #fecf56;
`

/**
 * Editable Platform Settings Component
 * Manage platform fees, sweepstakes pool, and other configurable settings
 */
export const EditablePlatformSettings: React.FC = () => {
  const { data: settings, isLoading } = usePlatformSettings()
  const updateSettings = useUpdatePlatformSettings()
  const setMaintenanceMode = useSetMaintenanceMode()
  const validateSettings = useValidateSettings()

  const [formData, setFormData] = useState<Partial<PlatformSettings>>({})
  const [isDirty, setIsDirty] = useState(false)
  const [validationErrors, setValidationErrors] = useState<string[]>([])
  const [successMessage, setSuccessMessage] = useState('')

  useEffect(() => {
    if (settings) {
      setFormData(settings)
      setIsDirty(false)
      setValidationErrors([])
    }
  }, [settings])

  const handleInputChange = (field: keyof PlatformSettings, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setIsDirty(true)
    setSuccessMessage('')
  }

  const handleValidate = async () => {
    const result = await validateSettings.mutateAsync(formData)
    if (!result.valid && result.errors) {
      setValidationErrors(result.errors)
    } else {
      setValidationErrors([])
      setSuccessMessage('✅ Settings are valid!')
    }
  }

  const handleSave = async () => {
    const result = await validateSettings.mutateAsync(formData)
    if (!result.valid && result.errors) {
      setValidationErrors(result.errors)
      return
    }

    updateSettings.mutate(formData, {
      onSuccess: () => {
        setIsDirty(false)
        setValidationErrors([])
        setSuccessMessage('✅ Settings updated successfully!')
        setTimeout(() => setSuccessMessage(''), 3000)
      },
      onError: () => {
        setValidationErrors(['Failed to save settings. Please try again.'])
      },
    })
  }

  const handleReset = () => {
    if (settings) {
      setFormData(settings)
      setIsDirty(false)
      setValidationErrors([])
      setSuccessMessage('')
    }
  }

  if (isLoading) return <LoadingSpinner />

  return (
    <Container>
      <Header>
        <div>
          <Title>⚙️ Platform Settings</Title>
          {settings && <LastUpdated>Last updated: {new Date(settings.updatedAt).toLocaleString()}</LastUpdated>}
        </div>
      </Header>

      {/* Alerts */}
      {validationErrors.length > 0 && (
        <Alert type="error">
          <AlertIcon>
            <AlertCircle size={18} />
          </AlertIcon>
          <div>
            {validationErrors.map((error, idx) => (
              <div key={idx}>{error}</div>
            ))}
          </div>
        </Alert>
      )}

      {successMessage && (
        <Alert type="success">
          <AlertIcon>
            <Check size={18} />
          </AlertIcon>
          {successMessage}
        </Alert>
      )}

      {/* Financial Settings */}
      <FormSection>
        <SectionTitle>💰 Financial Settings</SectionTitle>

        <FormGrid>
          <FormGroup>
            <Label>Platform Fee Percentage</Label>
            <Description>Percentage taken from each donation (0-50%)</Description>
            <Input
              type="number"
              min="0"
              max="50"
              step="0.1"
              value={formData.platformFeePercentage || 0}
              onChange={(e) => handleInputChange('platformFeePercentage', parseFloat(e.target.value))}
              disabled={updateSettings.isPending}
            />
          </FormGroup>

          <FormGroup>
            <Label>Minimum Donation Amount</Label>
            <Description>In USD cents (minimum $0.01)</Description>
            <Input
              type="number"
              min="1"
              value={formData.minDonationAmount || 1}
              onChange={(e) => handleInputChange('minDonationAmount', parseInt(e.target.value))}
              disabled={updateSettings.isPending}
            />
          </FormGroup>

          <FormGroup>
            <Label>Maximum Donation Amount</Label>
            <Description>In USD cents (maximum $10,000)</Description>
            <Input
              type="number"
              max="1000000"
              value={formData.maxDonationAmount || 1000000}
              onChange={(e) => handleInputChange('maxDonationAmount', parseInt(e.target.value))}
              disabled={updateSettings.isPending}
            />
          </FormGroup>

          <FormGroup>
            <Label>Payout Threshold</Label>
            <Description>Minimum amount to request payout (in cents)</Description>
            <Input
              type="number"
              min="100"
              value={formData.payoutThreshold || 10000}
              onChange={(e) => handleInputChange('payoutThreshold', parseInt(e.target.value))}
              disabled={updateSettings.isPending}
            />
          </FormGroup>
        </FormGrid>
      </FormSection>

      {/* Campaign Settings */}
      <FormSection>
        <SectionTitle>🎯 Campaign Settings</SectionTitle>

        <FormGrid>
          <FormGroup>
            <Label>Minimum Campaign Goal</Label>
            <Description>In USD cents (minimum $1)</Description>
            <Input
              type="number"
              min="100"
              value={formData.minCampaignGoal || 10000}
              onChange={(e) => handleInputChange('minCampaignGoal', parseInt(e.target.value))}
              disabled={updateSettings.isPending}
            />
          </FormGroup>

          <FormGroup>
            <Label>Maximum Campaign Goal</Label>
            <Description>In USD cents (maximum $9,999,999)</Description>
            <Input
              type="number"
              max="999999900"
              value={formData.maxCampaignGoal || 999999900}
              onChange={(e) => handleInputChange('maxCampaignGoal', parseInt(e.target.value))}
              disabled={updateSettings.isPending}
            />
          </FormGroup>

          <FormGroup>
            <Label>Minimum Campaign Duration</Label>
            <Description>In days (minimum 7)</Description>
            <Input
              type="number"
              min="7"
              max="365"
              value={formData.campaignDurationMin || 7}
              onChange={(e) => handleInputChange('campaignDurationMin', parseInt(e.target.value))}
              disabled={updateSettings.isPending}
            />
          </FormGroup>

          <FormGroup>
            <Label>Maximum Campaign Duration</Label>
            <Description>In days (maximum 365)</Description>
            <Input
              type="number"
              min="7"
              max="365"
              value={formData.campaignDurationMax || 90}
              onChange={(e) => handleInputChange('campaignDurationMax', parseInt(e.target.value))}
              disabled={updateSettings.isPending}
            />
          </FormGroup>
        </FormGrid>
      </FormSection>

      {/* Sweepstakes Settings */}
      <FormSection>
        <SectionTitle>🎰 Sweepstakes Settings</SectionTitle>

        <FormGrid>
          <FormGroup>
            <Label>Sweepstakes Pool Amount</Label>
            <Description>Total prize pool in USD cents</Description>
            <Input
              type="number"
              min="0"
              value={formData.sweepstakesPoolAmount || 50000}
              onChange={(e) => handleInputChange('sweepstakesPoolAmount', parseInt(e.target.value))}
              disabled={updateSettings.isPending}
            />
          </FormGroup>

          <FormGroup>
            <Label>Drawing Schedule</Label>
            <Description>Cron expression or description (e.g., "Every 2 months")</Description>
            <Input
              type="text"
              value={formData.sweepstakesDrawingSchedule || 'Every 2 months'}
              onChange={(e) => handleInputChange('sweepstakesDrawingSchedule', e.target.value)}
              disabled={updateSettings.isPending}
            />
          </FormGroup>
        </FormGrid>
      </FormSection>

      {/* Maintenance Mode */}
      <MaintenanceSection>
        <SectionTitle>🚨 Maintenance Mode</SectionTitle>

        <FormGrid>
          <FormGroup>
            <CheckboxGroup>
              <Checkbox
                type="checkbox"
                id="maintenance"
                checked={formData.maintenanceMode || false}
                onChange={(e) => handleInputChange('maintenanceMode', e.target.checked)}
                disabled={updateSettings.isPending}
              />
              <Label htmlFor="maintenance">Enable Maintenance Mode</Label>
            </CheckboxGroup>
            <Description>Displays maintenance message to all users except admins</Description>
          </FormGroup>
        </FormGrid>

        {formData.maintenanceMode && (
          <FormGrid>
            <FormGroup>
              <Label>Maintenance Message</Label>
              <Input
                type="text"
                placeholder="e.g., We are upgrading our platform. Back in 2 hours."
                value={formData.maintenanceMessage || ''}
                onChange={(e) => handleInputChange('maintenanceMessage', e.target.value)}
                disabled={updateSettings.isPending}
              />
            </FormGroup>
          </FormGrid>
        )}
      </MaintenanceSection>

      {/* Action Buttons */}
      <FormFooter>
        <ActionButton
          variant="outline"
          onClick={handleReset}
          disabled={!isDirty || updateSettings.isPending}
        >
          <RotateCcw size={16} />
          Reset Changes
        </ActionButton>

        <ActionButton
          variant="secondary"
          onClick={handleValidate}
          disabled={updateSettings.isPending}
        >
          Validate Settings
        </ActionButton>

        <ActionButton
          variant="primary"
          onClick={handleSave}
          disabled={!isDirty || updateSettings.isPending}
        >
          <Save size={16} />
          {updateSettings.isPending ? 'Saving...' : 'Save Changes'}
        </ActionButton>
      </FormFooter>
    </Container>
  )
}
