'use client'

import React, { useState } from 'react'
import styled from 'styled-components'
import { Copy, Check } from 'lucide-react'
import { PaymentMethod, PaymentMethodType } from './AddPaymentMethodForm'
import Button from '@/components/ui/Button'

interface PaymentMethodManagerProps {
  methods: PaymentMethod[]
  onAdd: () => void
  onEdit: (method: PaymentMethod) => void
  onDelete: (methodId: string) => void
  onSetPrimary: (methodId: string) => void
  isLoading?: boolean
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  width: 100%;
`

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;

  @media (max-width: 640px) {
    flex-direction: column;
    align-items: flex-start;
  }
`

const Title = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
`

const MethodsList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
  width: 100%;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`

const MethodCard = styled.div<{ isPrimary: boolean }>`
  background: white;
  border: 2px solid ${(props) => (props.isPrimary ? '#22c55e' : '#e2e8f0')};
  border-radius: 12px;
  padding: 1.5rem;
  position: relative;
  transition: all 0.2s ease;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    border-color: ${(props) => (props.isPrimary ? '#16a34a' : '#cbd5e1')};
  }
`

const PrimaryBadge = styled.div`
  position: absolute;
  top: -10px;
  right: 1rem;
  background-color: #22c55e;
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  display: flex;
  align-items: center;
  gap: 0.25rem;

  svg {
    width: 0.75rem;
    height: 0.75rem;
  }
`

const MethodHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
`

const MethodIcon = styled.div`
  font-size: 1.75rem;
`

const MethodInfo = styled.div`
  flex: 1;
`

const MethodType = styled.p`
  font-size: 1rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 0.25rem 0;
`

const MethodSubtype = styled.p`
  font-size: 0.8rem;
  color: #64748b;
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.3px;
`

const MethodDetails = styled.div`
  background-color: #f8fafc;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
  word-break: break-all;
`

const DetailLabel = styled.p`
  font-size: 0.75rem;
  color: #64748b;
  margin: 0 0 0.25rem 0;
  text-transform: uppercase;
  letter-spacing: 0.3px;
  font-weight: 600;
`

const DetailValue = styled.p`
  font-size: 0.95rem;
  color: #0f172a;
  margin: 0;
  font-family: 'Courier New', monospace;
  font-weight: 500;
`

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem 1.5rem;
  background-color: #f8fafc;
  border: 2px dashed #cbd5e1;
  border-radius: 12px;
`

const EmptyIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
`

const EmptyText = styled.p`
  color: #64748b;
  font-size: 1rem;
  margin: 0 0 1.5rem 0;
`

const methodEmojis: Record<PaymentMethodType, string> = {
  stripe: '💳',
  bank_transfer: '🏦',
  mobile_money: '📱',
}

const methodLabels: Record<PaymentMethodType, string> = {
  stripe: 'Credit/Debit Card',
  bank_transfer: 'Bank Transfer',
  mobile_money: 'Mobile Money',
}

const getMethodDetails = (method: PaymentMethod): { label: string; value: string } | null => {
  switch (method.type) {
    case 'stripe':
      return { label: 'Card Last 4', value: method.card_last_four ? `****${method.card_last_four}` : 'Card' }
    case 'bank_transfer':
      return { 
        label: 'Account', 
        value: method.bank_account?.account_holder || 'Bank Account' 
      }
    case 'mobile_money':
      return { 
        label: 'Mobile Number', 
        value: method.mobile_number || '••••••••' 
      }
    default:
      return null
  }
}

/**
 * PaymentMethodManager Component
 * Production-ready display and management of payment methods
 */
export const PaymentMethodManager: React.FC<PaymentMethodManagerProps> = ({
  methods,
  onAdd,
  onEdit,
  onDelete,
  onSetPrimary,
  isLoading = false,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null)

  // Ensure methods is always an array
  const methodsList = Array.isArray(methods) ? methods : []

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  if (methodsList.length === 0) {
    return (
      <Container>
        <Header>
          <Title>💳 Payment Methods</Title>
          <Button variant="primary" onClick={onAdd} disabled={isLoading}>
            + Add Payment Method
          </Button>
        </Header>

        <EmptyState>
          <EmptyIcon>💳</EmptyIcon>
          <EmptyText>No payment methods added yet</EmptyText>
          <Button variant="primary" onClick={onAdd}>
            Add Your First Payment Method
          </Button>
        </EmptyState>
      </Container>
    )
  }

  const primaryMethod = methodsList.find((m) => m.isPrimary)

  return (
    <Container>
      <Header>
        <Title>💳 Payment Methods ({methodsList.length})</Title>
        <Button variant="primary" onClick={onAdd} disabled={isLoading}>
          + Add Payment Method
        </Button>
      </Header>

      <MethodsList>
        {methodsList.map((method, index) => {
          const details = getMethodDetails(method)
          const methodId = method.id || `method-${index}`
          const isPrimary = method.isPrimary || methodId === primaryMethod?.id

          return (
            <MethodCard key={methodId} isPrimary={isPrimary}>
              {isPrimary && (
                <PrimaryBadge>
                  <Star size={12} />
                  Primary
                </PrimaryBadge>
              )}

              <MethodHeader>
                <MethodIcon>{methodEmojis[method.type] || '📝'}</MethodIcon>
                <MethodInfo>
                  <MethodType>{methodLabels[method.type] || 'Payment Method'}</MethodType>
                  <MethodSubtype>{method.displayName || methodLabels[method.type] || 'Unknown'}</MethodSubtype>
                </MethodInfo>
              </MethodHeader>

              {details && (
                <MethodDetails>
                  <DetailLabel>{details.label}</DetailLabel>
                  <DetailValue>{details.value}</DetailValue>
                </MethodDetails>
              )}
            </MethodCard>
          )
        })}
      </MethodsList>
    </Container>
  )
}
