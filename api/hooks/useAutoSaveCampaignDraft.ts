import { useEffect, useRef, useCallback, useState } from 'react'
import { useWizardStore } from '@/store/wizardStore'
import { toast } from 'react-toastify'

/**
 * useAutoSaveCampaignDraft
 * Auto-saves campaign wizard form data to localStorage every 5 seconds
 * Shows visual feedback when draft is saved
 *
 * Usage:
 * ```ts
 * const { isSaving, lastSavedAt } = useAutoSaveCampaignDraft()
 * ```
 */

interface UseAutoSaveDraftReturn {
  isSaving: boolean
  lastSavedAt: Date | null
  manualSave: () => void
  saveStatus: 'idle' | 'saving' | 'saved' | 'error'
}

// Constants
const AUTO_SAVE_INTERVAL = 5000 // 5 seconds
const DRAFT_STORAGE_KEY = 'campaign-wizard-draft'
const DRAFT_STATUS_KEY = 'campaign-wizard-draft-status'

export const useAutoSaveCampaignDraft = (): UseAutoSaveDraftReturn => {
  const { formData, saveDraft, getDraftExists } = useWizardStore()
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null)
  const lastSaveTimeRef = useRef<Date | null>(null)
  const hasChangesRef = useRef(false)

  // Save status state tracking
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
  const [isSavingState, setIsSavingState] = useState(false)
  const [lastSavedAtState, setLastSavedAtState] = useState<Date | null>(null)

  // Detect if form data has changed
  const hasFormDataChanged = useCallback(() => {
    const currentDraft = localStorage.getItem(DRAFT_STORAGE_KEY)
    if (!currentDraft) {
      return true // No draft exists, so there's a "change"
    }

    try {
      const parsedDraft = JSON.parse(currentDraft)
      // Check if any key field has changed
      return (
        parsedDraft.title !== formData.title ||
        parsedDraft.description !== formData.description ||
        parsedDraft.category !== formData.category ||
        JSON.stringify(parsedDraft.fundraisingData) !== JSON.stringify(formData.fundraisingData) ||
        JSON.stringify(parsedDraft.sharingData) !== JSON.stringify(formData.sharingData)
      )
    } catch (error) {
      console.error('[useAutoSaveCampaignDraft] Failed to parse draft:', error)
      return true
    }
  }, [formData])

  // Manual save function
  const manualSave = useCallback(() => {
    setIsSavingState(true)
    setSaveStatus('saving')

    try {
      saveDraft()
      lastSaveTimeRef.current = new Date()
      setLastSavedAtState(lastSaveTimeRef.current)
      setIsSavingState(false)
      setSaveStatus('saved')

      // Show brief success feedback (disappear after 2 seconds)
      setTimeout(() => {
        setSaveStatus('idle')
      }, 2000)
    } catch (error) {
      console.error('[useAutoSaveCampaignDraft] Manual save failed:', error)
      setSaveStatus('error')
      setIsSavingState(false)

      // Reset error after 3 seconds
      setTimeout(() => {
        setSaveStatus('idle')
      }, 3000)
    }
  }, [saveDraft])

  // Setup auto-save timer
  useEffect(() => {
    // Clear existing timer
    if (autoSaveTimerRef.current) {
      clearInterval(autoSaveTimerRef.current)
    }

    // Setup new auto-save interval
    autoSaveTimerRef.current = setInterval(() => {
      if (hasFormDataChanged()) {
        console.log('[useAutoSaveCampaignDraft] Auto-saving draft...')
        manualSave()
      }
    }, AUTO_SAVE_INTERVAL)

    // Cleanup on unmount
    return () => {
      if (autoSaveTimerRef.current) {
        clearInterval(autoSaveTimerRef.current)
      }
    }
  }, [formData, manualSave, hasFormDataChanged])

  // Also save draft when user leaves the page/tab
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasFormDataChanged()) {
        saveDraft()
        // Some browsers show a confirmation dialog
        e.preventDefault()
        e.returnValue = ''
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [formData, saveDraft, hasFormDataChanged])

  return {
    isSaving: isSavingState,
    lastSavedAt: lastSavedAtState,
    manualSave,
    saveStatus,
  }
}

export default useAutoSaveCampaignDraft
