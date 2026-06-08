'use client'

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react'

/**
 * Dashboard Context for shared state across dashboard components
 * Manages: filters, view preferences, selected campaigns, loading states
 */

interface FilterConfig {
  status?: ('draft' | 'active' | 'paused' | 'completed')[]
  type?: ('fundraising' | 'sharing')[]
  searchQuery?: string
  sortBy?: 'created' | 'updated' | 'raised' | 'name'
  sortOrder?: 'asc' | 'desc'
}

interface DashboardContextType {
  // Filter state
  filters: FilterConfig
  setFilters: (filters: FilterConfig) => void
  updateFilter: (key: keyof FilterConfig, value: any) => void
  resetFilters: () => void

  // View state
  viewMode: 'grid' | 'table'
  setViewMode: (mode: 'grid' | 'table') => void

  // Selection state
  selectedCampaignIds: string[]
  toggleCampaignSelection: (id: string) => void
  selectAllCampaigns: (ids: string[]) => void
  clearSelection: () => void

  // Loading state
  isLoading: boolean
  setIsLoading: (loading: boolean) => void

  // Pagination
  currentPage: number
  pageSize: number
  setCurrentPage: (page: number) => void
}

const defaultFilters: FilterConfig = {
  status: ['draft', 'active', 'paused'],
  type: undefined,
  searchQuery: '',
  sortBy: 'updated',
  sortOrder: 'desc',
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined)

/**
 * Provider component for dashboard state
 */
export function DashboardProvider({ children }: { children: ReactNode }) {
  const [filters, setFilters] = useState<FilterConfig>(defaultFilters)
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid')
  const [selectedCampaignIds, setSelectedCampaignIds] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 12

  const updateFilter = useCallback((key: keyof FilterConfig, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }))
  }, [])

  const resetFilters = useCallback(() => {
    setFilters(defaultFilters)
    setSelectedCampaignIds([])
  }, [])

  const toggleCampaignSelection = useCallback((id: string) => {
    setSelectedCampaignIds((prev) =>
      prev.includes(id) ? prev.filter((cid) => cid !== id) : [...prev, id]
    )
  }, [])

  const selectAllCampaigns = useCallback((ids: string[]) => {
    setSelectedCampaignIds(ids)
  }, [])

  const clearSelection = useCallback(() => {
    setSelectedCampaignIds([])
  }, [])

  const value: DashboardContextType = {
    filters,
    setFilters,
    updateFilter,
    resetFilters,
    viewMode,
    setViewMode,
    selectedCampaignIds,
    toggleCampaignSelection,
    selectAllCampaigns,
    clearSelection,
    isLoading,
    setIsLoading,
    currentPage,
    pageSize,
    setCurrentPage,
  }

  return <DashboardContext.Provider value={value}>{children}</DashboardContext.Provider>
}

/**
 * Hook to use dashboard context
 */
export function useDashboardContext() {
  const context = useContext(DashboardContext)
  if (!context) {
    throw new Error('useDashboardContext must be used within DashboardProvider')
  }
  return context
}
