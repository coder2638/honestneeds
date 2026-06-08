'use client'

import { useState, useCallback, useMemo } from 'react'

/**
 * Hook for managing campaign filters and building filter queries
 */

export interface FilterConfig {
  status?: ('draft' | 'active' | 'paused' | 'completed')[]
  type?: ('fundraising' | 'sharing')[]
  searchQuery?: string
  sortBy?: 'created' | 'updated' | 'raised' | 'name'
  sortOrder?: 'asc' | 'desc'
  dateRange?: {
    from?: Date
    to?: Date
  }
  progressRange?: {
    min?: number
    max?: number
  }
}

interface SavedView {
  id: string
  name: string
  filters: FilterConfig
  isDefault?: boolean
}

export function useCampaignFilters(initialFilters?: FilterConfig) {
  const [filters, setFilters] = useState<FilterConfig>(
    initialFilters || {
      status: ['draft', 'active', 'paused'],
      sortBy: 'updated',
      sortOrder: 'desc',
      searchQuery: '',
    }
  )

  const [savedViews, setSavedViews] = useState<SavedView[]>([
    {
      id: 'view_all',
      name: 'All Campaigns',
      filters: { status: ['draft', 'active', 'paused', 'completed'] },
      isDefault: true,
    },
    {
      id: 'view_active',
      name: 'Active Only',
      filters: { status: ['active'] },
    },
    {
      id: 'view_drafts',
      name: 'Drafts',
      filters: { status: ['draft'] },
    },
  ])

  /**
   * Update a specific filter
   */
  const updateFilter = useCallback((key: keyof FilterConfig, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }))
  }, [])

  /**
   * Add a status to filter
   */
  const addStatusFilter = useCallback((status: string) => {
    setFilters((prev) => ({
      ...prev,
      status: [...(prev.status || []), status as any],
    }))
  }, [])

  /**
   * Remove a status from filter
   */
  const removeStatusFilter = useCallback((status: string) => {
    setFilters((prev) => ({
      ...prev,
      status: prev.status?.filter((s) => s !== status),
    }))
  }, [])

  /**
   * Toggle status filter
   */
  const toggleStatusFilter = useCallback((status: string) => {
    setFilters((prev) => {
      const currentStatus = prev.status || []
      return {
        ...prev,
        status: currentStatus.includes(status as any)
          ? currentStatus.filter((s) => s !== status)
          : [...currentStatus, status as any],
      }
    })
  }, [])

  /**
   * Reset all filters to defaults
   */
  const resetFilters = useCallback(() => {
    setFilters({
      status: ['draft', 'active', 'paused'],
      sortBy: 'updated',
      sortOrder: 'desc',
      searchQuery: '',
    })
  }, [])

  /**
   * Clear search query
   */
  const clearSearch = useCallback(() => {
    setFilters((prev) => ({
      ...prev,
      searchQuery: '',
    }))
  }, [])

  /**
   * Build query string for API
   */
  const queryString = useMemo(() => {
    const params = new URLSearchParams()

    if (filters.status && filters.status.length > 0) {
      params.append('status', filters.status.join(','))
    }

    if (filters.type) {
      params.append('type', filters.type.join(','))
    }

    if (filters.searchQuery) {
      params.append('search', filters.searchQuery)
    }

    if (filters.sortBy) {
      params.append('sortBy', filters.sortBy)
    }

    if (filters.sortOrder) {
      params.append('sortOrder', filters.sortOrder)
    }

    return params.toString()
  }, [filters])

  /**
   * Save current filters as a view
   */
  const saveAsView = useCallback((name: string) => {
    const id = `view_${Date.now()}`
    const newView: SavedView = {
      id,
      name,
      filters: { ...filters },
    }
    setSavedViews((prev) => [...prev, newView])
    return id
  }, [filters])

  /**
   * Load a saved view
   */
  const loadView = useCallback((viewId: string) => {
    const view = savedViews.find((v) => v.id === viewId)
    if (view) {
      setFilters(view.filters)
    }
  }, [savedViews])

  /**
   * Delete a saved view
   */
  const deleteView = useCallback((viewId: string) => {
    if (viewId.startsWith('view_default')) return // Prevent deleting default views
    setSavedViews((prev) => prev.filter((v) => v.id !== viewId))
  }, [])

  /**
   * Get active filter labels for display
   */
  const activeFilters = useMemo(() => {
    const labels: string[] = []

    if (filters.status && filters.status.length > 0 && filters.status.length < 3) {
      labels.push(`Status: ${filters.status.join(', ')}`)
    }

    if (filters.searchQuery) {
      labels.push(`Search: "${filters.searchQuery}"`)
    }

    if (filters.type && filters.type.length > 0) {
      labels.push(`Type: ${filters.type.join(', ')}`)
    }

    return labels
  }, [filters])

  return {
    filters,
    updateFilter,
    addStatusFilter,
    removeStatusFilter,
    toggleStatusFilter,
    resetFilters,
    clearSearch,
    setFilters,
    queryString,
    activeFilters,
    savedViews,
    saveAsView,
    loadView,
    deleteView,
  }
}
