/**
 * Wallet Settings
 * Manage payment methods and notification preferences
 */

'use client'

import React, { useState } from 'react'
import styled from 'styled-components'
import { Plus, Trash2, CheckCircle, Clock, AlertCircle, Bell, Lock } from 'lucide-react'
// Wallet hooks temporarily commented out - to be implemented
// import {
//   usePaymentMethods,
//   useAddPaymentMethod,
//   useDeletePaymentMethod,
//   useNotificationPreferences,
//   useUpdateNotificationPreferences
// } from '@/api/hooks/useWallet'
import { Button } from '@/components/Button'
import { LoadingSpinner } from '@/components/LoadingSpinner'

const Container = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`

const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`

const SectionTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: #0f172a;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.75rem;

  svg {
    width: 1.25rem;
    height: 1.25rem;
    color: #667eea;
  }
`

const PaymentMethodsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`

const PaymentMethodCard = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  background: white;
  transition: all 0.2s;

  &:hover {
    border-color: #cbd5e1;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  }
`

const MethodInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1.25rem;
  flex: 1;
`

const MethodIcon = styled.div<{ type: string }>`
  width: 3rem;
  height: 3rem;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  color: white;
  font-size: 0.75rem;
  text-align: center;

  ${(props) => {
    switch (props.type) {
      case 'stripe':
        return 'background: #625acc;'
      case 'bank':
        return 'background: #0284c7;'
      case 'paypal':
        return 'background: #005ea6;'
      case 'mobile_money':
        return 'background: #16a34a;'
      default:
        return 'background: #64748b;'
    }
  }}
`

const MethodDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`

const MethodName = styled.span`
  font-weight: 600;
  color: #0f172a;
`

const MethodMasked = styled.span`
  font-size: 0.875rem;
  color: #64748b;
`

const MethodStatus = styled.span<{ status: string }>`
  font-size: 0.75rem;
  font-weight: 500;
  color: ${(props) => {
    switch (props.status) {
      case 'verified':
        return '#16a34a'
      case 'pending':
        return '#ca8a04'
      case 'failed':
        return '#dc2626'
      default:
        return '#64748b'
    }
  }};
  display: flex;
  align-items: center;
  gap: 0.25rem;
  margin-top: 0.25rem;
`

const MethodActions = styled.div`
  display: flex;
  gap: 0.75rem;
  align-items: center;
`

const DeleteButton = styled.button`
  padding: 0.5rem;
  background: #fee2e2;
  color: #dc2626;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;

  &:hover {
    background: #fecaca;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  svg {
    width: 1rem;
    height: 1rem;
  }
`

const AddMethodButton = styled(Button)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  align-self: flex-start;
`

const EmptyState = styled.div`
  text-align: center;
  padding: 2rem;
  background: #f8fafc;
  border-radius: 12px;
  border: 1px dashed #cbd5e1;
`

const EmptyIcon = styled.div`
  width: 3rem;
  height: 3rem;
  background: #e2e8f0;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;

  svg {
    width: 1.5rem;
    height: 1.5rem;
    color: #94a3b8;
  }
`

const EmptyText = styled.p`
  color: #64748b;
  margin: 0;
`

const NotificationPreferences = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`

const PreferenceItem = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: #f8fafc;
  border-radius: 12px;
  border: 1px solid #e2e8f0;

  &:hover {
    border-color: #cbd5e1;
  }
`

const CheckboxInput = styled.input`
  width: 1.25rem;
  height: 1.25rem;
  cursor: pointer;
  accent-color: #667eea;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`

const PreferenceLabel = styled.label`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  cursor: pointer;
  flex: 1;
`

const PreferenceName = styled.span`
  font-weight: 500;
  color: #0f172a;
`

const PreferenceDescription = styled.span`
  font-size: 0.875rem;
  color: #64748b;
`

const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
`

const StatusBadge = styled.span<{ status: string }>`
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
  background: ${(props) => {
    switch (props.status) {
      case 'verified':
        return '#dcfce7'
      case 'pending':
        return '#fef3c7'
      case 'failed':
        return '#fee2e2'
      default:
        return '#f1f5f9'
    }
  }};
  color: ${(props) => {
    switch (props.status) {
      case 'verified':
        return '#16a34a'
      case 'pending':
        return '#b45309'
      case 'failed':
        return '#991b1b'
      default:
        return '#64748b'
    }
  }};
`

const InformationBox = styled.div`
  padding: 1rem;
  background: #dbeafe;
  border-left: 4px solid #0284c7;
  border-radius: 8px;
  display: flex;
  gap: 0.75rem;
  font-size: 0.875rem;
  color: #0c4a6e;

  svg {
    width: 1.25rem;
    height: 1.25rem;
    flex-shrink: 0;
    margin-top: 0.125rem;
  }
`

const getPaymentMethodLabel = (type: string): string => {
  const labels: { [key: string]: string } = {
    stripe: 'Stripe Connect',
    bank: 'Bank Account',
    paypal: 'PayPal',
    mobile_money: 'Mobile Money'
  }
  return labels[type] || type
}

const getPaymentMethodIcon = (type: string): string => {
  const icons: { [key: string]: string } = {
    stripe: 'STRIPE',
    bank: 'BANK',
    paypal: 'PP',
    mobile_money: 'MM'
  }
  return icons[type] || '?'
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'verified':
      return <CheckCircle size={14} />
    case 'pending':
      return <Clock size={14} />
    case 'failed':
      return <AlertCircle size={14} />
    default:
      return null
  }
}

/**
 * Wallet Settings Component
 */
export const WalletSettings: React.FC = () => {
  const [showAddMethod, setShowAddMethod] = useState(false)

  const { data: methods, isLoading: methodsLoading } = usePaymentMethods()
  const { mutate: deleteMethod, isPending: isDeleting } = useDeletePaymentMethod()
  const { data: preferences, isLoading: preferencesLoading } = useNotificationPreferences()
  const { mutate: updatePreferences, isPending: isUpdatingPreferences } = useUpdateNotificationPreferences()

  const handleDeleteMethod = (methodId: string) => {
    if (window.confirm('Are you sure you want to delete this payment method?')) {
      deleteMethod(methodId)
    }
  }

  const handlePreferenceChange = (key: string, value: boolean) => {
    updatePreferences({
      [key]: value
    })
  }

  return (
    <Container>
      {/* Payment Methods Section */}
      <Section>
        <SectionTitle>
          <Lock />
          Payment Methods
        </SectionTitle>

        <InformationBox>
          <AlertCircle size={16} />
          <span>You can manage up to 5 payment methods. Use at least one verified method to request payouts.</span>
        </InformationBox>

        {methodsLoading ? (
          <LoadingContainer>
            <LoadingSpinner />
          </LoadingContainer>
        ) : methods && methods.length > 0 ? (
          <>
            <PaymentMethodsList>
              {methods.map((method) => (
                <PaymentMethodCard key={method.id}>
                  <MethodInfo>
                    <MethodIcon type={method.payment_type}>{getPaymentMethodIcon(method.payment_type)}</MethodIcon>
                    <MethodDetails>
                      <MethodName>{getPaymentMethodLabel(method.payment_type)}</MethodName>
                      {method.last_four && <MethodMasked>•••• {method.last_four}</MethodMasked>}
                      <MethodStatus status={method.verification_status}>
                        {getStatusIcon(method.verification_status)}
                        {method.verification_status.charAt(0).toUpperCase() + method.verification_status.slice(1)}
                      </MethodStatus>
                    </MethodDetails>
                  </MethodInfo>
                  <MethodActions>
                    {method.is_default && <StatusBadge status="verified">Default</StatusBadge>}
                    <DeleteButton
                      onClick={() => handleDeleteMethod(method.id)}
                      disabled={isDeleting || method.is_default}
                      title={method.is_default ? 'Cannot delete default payment method' : 'Delete payment method'}
                    >
                      <Trash2 />
                    </DeleteButton>
                  </MethodActions>
                </PaymentMethodCard>
              ))}
            </PaymentMethodsList>

            {methods.length < 5 && (
              <AddMethodButton onClick={() => setShowAddMethod(true)}>
                <Plus size={18} />
                Add Payment Method
              </AddMethodButton>
            )}
          </>
        ) : (
          <>
            <EmptyState>
              <EmptyIcon>
                <Lock />
              </EmptyIcon>
              <EmptyText>No payment methods added yet</EmptyText>
              <p style={{ color: '#94a3b8', marginTop: '0.5rem' }}>
                Add a payment method to start requesting payouts
              </p>
            </EmptyState>
            <AddMethodButton onClick={() => setShowAddMethod(true)}>
              <Plus size={18} />
              Add First Payment Method
            </AddMethodButton>
          </>
        )}
      </Section>

      {/* Notification Preferences Section */}
      <Section>
        <SectionTitle>
          <Bell />
          Notification Preferences
        </SectionTitle>

        <InformationBox>
          <AlertCircle size={16} />
          <span>Choose how you want to be notified about your wallet activity and payouts.</span>
        </InformationBox>

        {preferencesLoading ? (
          <LoadingContainer>
            <LoadingSpinner />
          </LoadingContainer>
        ) : (
          <NotificationPreferences>
            <PreferenceItem>
              <CheckboxInput
                type="checkbox"
                id="payout_notification"
                checked={preferences?.payout_notifications || false}
                onChange={(e) => handlePreferenceChange('payout_notifications', e.target.checked)}
                disabled={isUpdatingPreferences}
              />
              <PreferenceLabel htmlFor="payout_notification">
                <PreferenceName>Payout Notifications</PreferenceName>
                <PreferenceDescription>Get notified when your payout is processed and when it arrives</PreferenceDescription>
              </PreferenceLabel>
            </PreferenceItem>

            <PreferenceItem>
              <CheckboxInput
                type="checkbox"
                id="earning_notification"
                checked={preferences?.earning_notifications || false}
                onChange={(e) => handlePreferenceChange('earning_notifications', e.target.checked)}
                disabled={isUpdatingPreferences}
              />
              <PreferenceLabel htmlFor="earning_notification">
                <PreferenceName>Earning Notifications</PreferenceName>
                <PreferenceDescription>Get notified when you receive earnings from campaigns</PreferenceDescription>
              </PreferenceLabel>
            </PreferenceItem>

            <PreferenceItem>
              <CheckboxInput
                type="checkbox"
                id="withdrawal_notification"
                checked={preferences?.withdrawal_notifications || false}
                onChange={(e) => handlePreferenceChange('withdrawal_notifications', e.target.checked)}
                disabled={isUpdatingPreferences}
              />
              <PreferenceLabel htmlFor="withdrawal_notification">
                <PreferenceName>Withdrawal Notifications</PreferenceName>
                <PreferenceDescription>Get notified about withdrawal requests and status updates</PreferenceDescription>
              </PreferenceLabel>
            </PreferenceItem>

            <PreferenceItem>
              <CheckboxInput
                type="checkbox"
                id="weekly_summary"
                checked={preferences?.weekly_summary || false}
                onChange={(e) => handlePreferenceChange('weekly_summary', e.target.checked)}
                disabled={isUpdatingPreferences}
              />
              <PreferenceLabel htmlFor="weekly_summary">
                <PreferenceName>Weekly Summary</PreferenceName>
                <PreferenceDescription>Receive a weekly summary of your earnings and activity</PreferenceDescription>
              </PreferenceLabel>
            </PreferenceItem>

            <PreferenceItem>
              <CheckboxInput
                type="checkbox"
                id="security_alert"
                checked={preferences?.security_alerts !== false}
                onChange={(e) => handlePreferenceChange('security_alerts', e.target.checked)}
                disabled={isUpdatingPreferences}
              />
              <PreferenceLabel htmlFor="security_alert">
                <PreferenceName>Security Alerts</PreferenceName>
                <PreferenceDescription>Get notified of unusual account activity and login attempts</PreferenceDescription>
              </PreferenceLabel>
            </PreferenceItem>
          </NotificationPreferences>
        )}
      </Section>
    </Container>
  )
}

export default WalletSettings
