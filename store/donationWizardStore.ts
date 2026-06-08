import { create } from 'zustand'
import type { DonationPaymentMethod, DonationConfirmationFormData } from '@/utils/validationSchemas'

/**
 * Donation Wizard Store
 * Manages donation wizard state, form data, and draft persistence
 */

export interface DonationWizardFormData {
  campaignId: string | null
  amount: number | null
  paymentMethod: Partial<DonationPaymentMethod> | null
  screenshotProof: File | null
  screenshotProofPreview: string | null
  agreePaymentSent: boolean
}

export interface DonationWizardState {
  // State
  currentStep: number
  formData: DonationWizardFormData
  errors: Record<string, string>
  isSubmitting: boolean
  draftSaved: boolean

  // Actions
  setCurrentStep: (step: number) => void
  updateFormData: (data: Partial<DonationWizardFormData>) => void
  setAmount: (amount: number) => void
  setPaymentMethod: (method: Partial<DonationPaymentMethod>) => void
  setScreenshotProof: (file: File | null, preview: string | null) => void
  setAgreePaymentSent: (agree: boolean) => void
  setErrors: (errors: Record<string, string>) => void
  setIsSubmitting: (submitting: boolean) => void
  setCampaignId: (id: string) => void
  resetWizard: () => void

  // Getters
  getFormData: () => DonationWizardFormData
}

const initialFormData: DonationWizardFormData = {
  campaignId: null,
  amount: null,
  paymentMethod: null,
  screenshotProof: null,
  screenshotProofPreview: null,
  agreePaymentSent: false,
}

export const useDonationWizardStore = create<DonationWizardState>()(  
  (set, get) => ({
      // Initial state
      currentStep: 1,
      formData: initialFormData,
      errors: {},
      isSubmitting: false,
      draftSaved: false,

      // Actions
      setCurrentStep: (step) => set({ currentStep: step }),

      updateFormData: (data) =>
        set((state) => ({
          formData: {
            ...state.formData,
            ...data,
          },
          draftSaved: false,
        })),

      setAmount: (amount) =>
        set((state) => ({
          formData: {
            ...state.formData,
            amount,
          },
          draftSaved: false,
        })),

      setPaymentMethod: (method) =>
        set((state) => ({
          formData: {
            ...state.formData,
            paymentMethod: method,
          },
          draftSaved: false,
        })),

      setScreenshotProof: (file, preview) =>
        set((state) => ({
          formData: {
            ...state.formData,
            screenshotProof: file,
            screenshotProofPreview: preview,
          },
          draftSaved: false,
        })),

      setAgreePaymentSent: (agree) =>
        set((state) => ({
          formData: {
            ...state.formData,
            agreePaymentSent: agree,
          },
          draftSaved: false,
        })),

      setErrors: (errors) => set({ errors }),

      setIsSubmitting: (submitting) => set({ isSubmitting: submitting }),

      setCampaignId: (id) =>
        set((state) => ({
          formData: {
            ...state.formData,
            campaignId: id,
          },
        })),

      resetWizard: () => {
        set({
          currentStep: 1,
          formData: initialFormData,
          errors: {},
          isSubmitting: false,
          draftSaved: false,
        })
      },

      // Getters
      getFormData: () => get().formData,
    })
  )
