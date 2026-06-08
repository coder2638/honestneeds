import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { paymentMethodService } from '../services/paymentMethodService'
import { PaymentMethod } from '@/components/campaign/AddPaymentMethodForm'
import { useCallback } from 'react'

interface PaymentMethodResponse {
  success: boolean
  data: PaymentMethod
  error?: string
}

interface PaymentMethodsListResponse {
  success: boolean
  data: PaymentMethod[]
  error?: string
}

const PAYMENT_METHODS_QUERY_KEYS = {
  all: ['paymentMethods'] as const,
  list: () => [...PAYMENT_METHODS_QUERY_KEYS.all, 'list'] as const,
  detail: (id: string) => [
    ...PAYMENT_METHODS_QUERY_KEYS.all,
    'detail',
    id,
  ] as const,
  primary: () => [...PAYMENT_METHODS_QUERY_KEYS.all, 'primary'] as const,
}

/**
 * usePaymentMethods Hook
 * Fetch all payment methods for the current creator
 */
export const usePaymentMethods = () => {
  return useQuery({
    queryKey: PAYMENT_METHODS_QUERY_KEYS.list(),
    queryFn: async (): Promise<PaymentMethod[]> => {
      const response = await paymentMethodService.getPaymentMethods()
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch payment methods')
      }
      return response.data
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
  })
}

/**
 * useAddPaymentMethod Hook
 * Create a new payment method
 */
export const useAddPaymentMethod = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (method: PaymentMethod): Promise<PaymentMethod> => {
      const response = await paymentMethodService.addPaymentMethod(method)
      if (!response.success) {
        throw new Error(response.error || 'Failed to add payment method')
      }
      return response.data
    },
    onSuccess: () => {
      // Invalidate the list query to refetch
      queryClient.invalidateQueries({
        queryKey: PAYMENT_METHODS_QUERY_KEYS.list(),
      })
    },
  })
}

/**
 * useUpdatePaymentMethod Hook
 * Update an existing payment method
 */
export const useUpdatePaymentMethod = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (
      data: Partial<PaymentMethod> & { id: string }
    ): Promise<PaymentMethod> => {
      const { id, ...method } = data
      const response = await paymentMethodService.updatePaymentMethod(
        id,
        method as PaymentMethod
      )
      if (!response.success) {
        throw new Error(response.error || 'Failed to update payment method')
      }
      return response.data
    },
    onSuccess: (data) => {
      // Invalidate both list and detail queries
      queryClient.invalidateQueries({
        queryKey: PAYMENT_METHODS_QUERY_KEYS.list(),
      })
      if (data && data.id) {
        queryClient.invalidateQueries({
          queryKey: PAYMENT_METHODS_QUERY_KEYS.detail(data.id),
        })
      }
    },
  })
}

/**
 * useDeletePaymentMethod Hook
 * Delete a payment method
 */
export const useDeletePaymentMethod = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      const response = await paymentMethodService.deletePaymentMethod(id)
      if (!response.success) {
        throw new Error(response.error || 'Failed to delete payment method')
      }
    },
    onSuccess: () => {
      // Invalidate the list query to refetch
      queryClient.invalidateQueries({
        queryKey: PAYMENT_METHODS_QUERY_KEYS.list(),
      })
    },
  })
}

/**
 * useSetPrimaryPaymentMethod Hook
 * Set a payment method as primary
 */
export const useSetPrimaryPaymentMethod = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string): Promise<PaymentMethod> => {
      const response = await paymentMethodService.setPrimaryPaymentMethod(id)
      if (!response.success) {
        throw new Error(
          response.error || 'Failed to set primary payment method'
        )
      }
      return response.data
    },
    onSuccess: () => {
      // Invalidate both list and primary queries
      queryClient.invalidateQueries({
        queryKey: PAYMENT_METHODS_QUERY_KEYS.list(),
      })
      queryClient.invalidateQueries({
        queryKey: PAYMENT_METHODS_QUERY_KEYS.primary(),
      })
    },
  })
}

/**
 * usePrimaryPaymentMethod Hook
 * Fetch the primary payment method for the current creator
 */
export const usePrimaryPaymentMethod = () => {
  return useQuery({
    queryKey: PAYMENT_METHODS_QUERY_KEYS.primary(),
    queryFn: async (): Promise<PaymentMethod | null> => {
      const response = await paymentMethodService.getPrimaryPaymentMethod()
      if (!response.success) {
        return null // No primary method set is not an error
      }
      return response.data
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
  })
}
