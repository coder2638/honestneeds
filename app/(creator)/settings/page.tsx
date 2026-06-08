'use client'

import React, { useState, useCallback } from 'react'
import styled from 'styled-components'
import { AlertCircle, CheckCircle2, Loader } from 'lucide-react'
import { PaymentMethodManager } from '@/components/campaign/PaymentMethodManager'
import { AddPaymentMethodModal } from '@/components/campaign/AddPaymentMethodModal'
import { PaymentMethod } from '@/components/campaign/AddPaymentMethodForm'
import {
  usePaymentMethods,
  useAddPaymentMethod,
  useUpdatePaymentMethod,
  useDeletePaymentMethod,
  useSetPrimaryPaymentMethod,
} from '@/api/hooks/usePaymentMethods'
import { useRouter } from 'next/navigation'

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
  width: 100%;
  box-sizing: border-box;
  overflow-x: hidden;

  @media (max-width: 640px) {
    padding: 1.5rem 0.75rem;
  }

  @media (max-width: 480px) {
    padding: 1rem 0.5rem;
  }
`

const Header = styled.div`
  margin-bottom: 2rem;

  @media (max-width: 480px) {
    margin-bottom: 1.5rem;
  }
`

const CardHeaderLayout = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  gap: 1rem;
  flex-wrap: wrap;
  width: 100%;
  box-sizing: border-box;

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: stretch;
    margin-bottom: 1rem;
  }
`

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 0.5rem;
  word-break: break-word;
  overflow-wrap: break-word;

  @media (max-width: 640px) {
    font-size: 1.5rem;
  }

  @media (max-width: 480px) {
    font-size: 1.25rem;
  }
`

const Subtitle = styled.p`
  font-size: 1rem;
  color: #64748b;
  word-break: break-word;
  overflow-wrap: break-word;

  @media (max-width: 640px) {
    font-size: 0.9rem;
  }

  @media (max-width: 480px) {
    font-size: 0.85rem;
  }
`

const Card = styled.div`
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
  box-sizing: border-box;
  width: 100%;
  overflow-x: hidden;

  @media (max-width: 640px) {
    padding: 1.5rem;
    border-radius: 8px;
  }

  @media (max-width: 480px) {
    padding: 1rem;
    border-radius: 6px;
  }
`

const SectionHeader = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: #0f172a;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  word-break: break-word;
  overflow-wrap: break-word;

  svg {
    width: 1.5rem;
    height: 1.5rem;
    flex-shrink: 0;
  }

  @media (max-width: 640px) {
    font-size: 1.1rem;
    margin-bottom: 1rem;
  }

  @media (max-width: 480px) {
    font-size: 1rem;
    margin-bottom: 0.75rem;
  }
`

const AlertBox = styled.div<{ type: 'error' | 'success' | 'info' }>`
  padding: 1rem;
  border-radius: 8px;
  display: flex;
  gap: 1rem;
  align-items: flex-start;
  margin-bottom: 1.5rem;
  box-sizing: border-box;
  width: 100%;
  overflow-x: hidden;

  @media (max-width: 480px) {
    padding: 0.75rem;
    gap: 0.75rem;
  }

  ${(props) => {
    switch (props.type) {
      case 'error':
        return `
          background: #fee2e2;
          border: 1px solid #fca5a5;
          color: #7f1d1d;
        `
      case 'success':
        return `
          background: #dcfce7;
          border: 1px solid #86efac;
          color: #166534;
        `
      case 'info':
        return `
          background: #dbeafe;
          border: 1px solid #93c5fd;
          color: #0c4a6e;
        `
    }
  }}

  svg {
    width: 1.25rem;
    height: 1.25rem;
    flex-shrink: 0;
    margin-top: 0.125rem;
  }
`

const AlertText = styled.div`
  font-size: 0.875rem;
  line-height: 1.5;
  word-break: break-word;
  overflow-wrap: break-word;

  @media (max-width: 480px) {
    font-size: 0.8rem;
  }
`

const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  gap: 1rem;

  svg {
    width: 1.5rem;
    height: 1.5rem;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  @media (max-width: 480px) {
    padding: 1.5rem;
    flex-direction: column;
    text-align: center;
  }
`

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem 1rem;
  box-sizing: border-box;

  svg {
    width: 3rem;
    height: 3rem;
    color: #cbd5e1;
    margin-bottom: 1rem;
  }

  p {
    color: #64748b;
    margin-bottom: 1.5rem;
    word-break: break-word;
    overflow-wrap: break-word;
  }

  @media (max-width: 480px) {
    padding: 2rem 0.75rem;

    svg {
      width: 2.5rem;
      height: 2.5rem;
    }

    p {
      font-size: 0.9rem;
    }
  }
`

const AddButton = styled.button`
  background: #3b82f6;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s ease;
  white-space: nowrap;

  &:hover:not(:disabled) {
    background: #2563eb;
  }

  &:disabled {
    background: #cbd5e1;
    cursor: not-allowed;
  }

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  @media (min-width: 481px) {
    flex-shrink: 0;
  }

  @media (max-width: 640px) {
    padding: 0.6rem 1rem;
    font-size: 0.9rem;
  }

  @media (max-width: 480px) {
    padding: 0.5rem 0.75rem;
    font-size: 0.8rem;
    width: 100%;
  }
`

/**
 * Creator Settings Page
 * Allows creators to manage payment methods
 */
export default function CreatorSettingsPage() {
  const router = useRouter()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingMethod, setEditingMethod] = useState<PaymentMethod | null>(
    null
  )
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  // Queries and mutations
  const {
    data: paymentMethods = [],
    isLoading: isLoadingMethods,
    error: methodsError,
  } = usePaymentMethods()

  const addPaymentMethod = useAddPaymentMethod()
  const updatePaymentMethod = useUpdatePaymentMethod()
  const setAsPrimary = useSetPrimaryPaymentMethod()
  const deletePaymentMethod = useDeletePaymentMethod()

  // Handle successful add
  const handleAddMethod = useCallback(async (method: PaymentMethod) => {
    try {
      await addPaymentMethod.mutateAsync(method)
      setSuccessMessage('✅ Payment method added successfully!')
      setEditingMethod(null)
      setIsModalOpen(false)
      setTimeout(() => setSuccessMessage(null), 5000)
    } catch (error) {
      const message =
        (error as any)?.message || 'Failed to add payment method'
      setErrorMessage(message)
      setTimeout(() => setErrorMessage(null), 5000)
    }
  }, [addPaymentMethod])

  // Handle successful update
  const handleEditMethod = useCallback(
    async (method: PaymentMethod) => {
      if (!editingMethod?.id) return
      try {
        await updatePaymentMethod.mutateAsync({
          id: editingMethod.id,
          ...method,
        })
        setSuccessMessage('✅ Payment method updated successfully!')
        setEditingMethod(null)
        setIsModalOpen(false)
        setTimeout(() => setSuccessMessage(null), 5000)
      } catch (error) {
        const message =
          (error as any)?.message || 'Failed to update payment method'
        setErrorMessage(message)
        setTimeout(() => setErrorMessage(null), 5000)
      }
    },
    [editingMethod, updatePaymentMethod]
  )

  // Handle set as primary
  const handleSetPrimary = useCallback(
    async (methodId: string) => {
      try {
        await setAsPrimary.mutateAsync(methodId)
        setSuccessMessage('✅ Primary payment method updated!')
        setTimeout(() => setSuccessMessage(null), 5000)
      } catch (error) {
        const message =
          (error as any)?.message || 'Failed to set primary payment method'
        setErrorMessage(message)
        setTimeout(() => setErrorMessage(null), 5000)
      }
    },
    [setAsPrimary]
  )

  // Handle delete
  const handleDeleteMethod = useCallback(
    async (methodId: string) => {
      if (!confirm('Are you sure you want to delete this payment method?')) {
        return
      }
      try {
        await deletePaymentMethod.mutateAsync(methodId)
        setSuccessMessage('✅ Payment method deleted successfully!')
        setTimeout(() => setSuccessMessage(null), 5000)
      } catch (error) {
        const message =
          (error as any)?.message || 'Failed to delete payment method'
        setErrorMessage(message)
        setTimeout(() => setErrorMessage(null), 5000)
      }
    },
    [deletePaymentMethod]
  )

  // Open modal for adding
  const handleOpenAddModal = () => {
    setEditingMethod(null)
    setIsModalOpen(true)
  }

  // Open modal for editing
  const handleOpenEditModal = (method: PaymentMethod) => {
    setEditingMethod(method)
    setIsModalOpen(true)
  }

  return (
    <Container>
      <Header>
        <Title>💳 Payment Methods</Title>
        <Subtitle>
          Manage your payment methods to receive payouts and support
          crowdfunded campaigns.
        </Subtitle>
      </Header>

      {successMessage && (
        <AlertBox type="success">
          <CheckCircle2 />
          <AlertText>{successMessage}</AlertText>
        </AlertBox>
      )}

      {errorMessage && (
        <AlertBox type="error">
          <AlertCircle />
          <AlertText>{errorMessage}</AlertText>
        </AlertBox>
      )}

      {methodsError && (
        <AlertBox type="error">
          <AlertCircle />
          <AlertText>Failed to load payment methods. Please try again.</AlertText>
        </AlertBox>
      )}

      <Card>
        <CardHeaderLayout>
          <SectionHeader>
            {paymentMethods.length > 0 ? '📋' : '💳'} Your Payment Methods
          </SectionHeader>
          <AddButton
            onClick={handleOpenAddModal}
            disabled={isLoadingMethods}
          >
            ➕ Add Method
          </AddButton>
        </CardHeaderLayout>

        {isLoadingMethods ? (
          <LoadingContainer>
            <Loader />
            <span>Loading payment methods...</span>
          </LoadingContainer>
        ) : paymentMethods.length === 0 ? (
          <PaymentMethodManager
            methods={[]}
            onSetPrimary={handleSetPrimary}
            onEdit={handleOpenEditModal}
            onAdd={handleOpenAddModal}
            onDelete={handleDeleteMethod}
            isLoading={isLoadingMethods}
          />
        ) : (
          <PaymentMethodManager
            methods={paymentMethods}
            onSetPrimary={handleSetPrimary}
            onEdit={handleOpenEditModal}
            onAdd={handleOpenAddModal}
            onDelete={handleDeleteMethod}
            isLoading={setAsPrimary.isPending}
          />
        )}
      </Card>

      <Card>
        <SectionHeader>❓ Help & Information</SectionHeader>
        <AlertBox type="info">
          <AlertText>
            <strong>💡 Tip:</strong> Set a primary payment method to receive
            automatic payouts. You can have multiple payment methods and
            switch your primary at any time. All sensitive information is
            encrypted and never shared with third parties.
          </AlertText>
        </AlertBox>
      </Card>

      <AddPaymentMethodModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditingMethod(null)
        }}
        onSubmit={editingMethod ? handleEditMethod : handleAddMethod}
        isLoading={
          editingMethod ? updatePaymentMethod.isPending : addPaymentMethod.isPending
        }
        initialMethod={editingMethod || undefined}
        isEditing={!!editingMethod}
      />
    </Container>
  )
}
