'use client'

import { useState, useCallback } from 'react'
import { getDateRange, filterByDateRange, DateRange, DateRangeType } from '@/utils/dateFilters'

export interface MetricsFilterState {
  dateRange: DateRange
  dateRangeType: DateRangeType
  customStartDate?: Date
  customEndDate?: Date
  filters: Record<string, any>
}

export interface UseMetricsFiltersReturn {
  state: MetricsFilterState
  setDateRange: (type: DateRangeType, customStart?: Date, customEnd?: Date) => void
  setFilter: (key: string, value: any) => void
  clearFilter: (key: string) => void
  clearAllFilters: () => void
  applyFilters: (data: any[], dateKey: string) => any[]
}

const defaultFilters: MetricsFilterState = {
  dateRange: getDateRange('30d'),
  dateRangeType: '30d',
  filters: {},
}

/**
 * useMetricsFilters Hook
 * Manages date ranges and metric filters for analytics pages
 * 
 * @example
 * const {
 *   state,
 *   setDateRange,
 *   setFilter,
 *   applyFilters
 * } = useMetricsFilters()
 * 
 * // Change date range
 * setDateRange('7d')
 * 
 * // Apply custom date range
 * setDateRange('custom', startDate, endDate)
 * 
 * // Filter by specific metrics
 * setFilter('campaign', 'campaign-123')
 * 
 * // Apply all filters to data
 * const filtered = applyFilters(rawData, 'createdAt')
 */
export const useMetricsFilters = (initialRange: DateRangeType = '30d'): UseMetricsFiltersReturn => {
  const [state, setState] = useState<MetricsFilterState>({
    dateRange: getDateRange(initialRange),
    dateRangeType: initialRange,
    filters: {},
  })

  /**
   * Update date range
   */
  const setDateRange = useCallback(
    (type: DateRangeType, customStart?: Date, customEnd?: Date) => {
      const newDateRange = getDateRange(type, customStart, customEnd)

      setState((prev) => ({
        ...prev,
        dateRange: newDateRange,
        dateRangeType: type,
        customStartDate: customStart,
        customEndDate: customEnd,
      }))
    },
    []
  )

  /**
   * Set or update a single filter
   */
  const setFilter = useCallback((key: string, value: any) => {
    setState((prev) => ({
      ...prev,
      filters: {
        ...prev.filters,
        [key]: value,
      },
    }))
  }, [])

  /**
   * Clear a single filter
   */
  const clearFilter = useCallback((key: string) => {
    setState((prev) => {
      const newFilters = { ...prev.filters }
      delete newFilters[key]
      return {
        ...prev,
        filters: newFilters,
      }
    })
  }, [])

  /**
   * Clear all filters (but keep date range)
   */
  const clearAllFilters = useCallback(() => {
    setState((prev) => ({
      ...prev,
      filters: {},
    }))
  }, [])

  /**
   * Apply all filters to a dataset
   */
  const applyFilters = useCallback(
    (data: any[], dateKey: string = 'createdAt'): any[] => {
      // Apply date range filter
      let filtered = filterByDateRange(data, dateKey, state.dateRange)

      // Apply other filters
      Object.entries(state.filters).forEach(([key, value]) => {
        if (value === undefined || value === null || value === '') return

        if (Array.isArray(value)) {
          // Multi-select filter - include if item matches any value
          filtered = filtered.filter((item) => value.includes(item[key]))
        } else if (typeof value === 'object') {
          // Range filter - include if item is within range
          if (value.min !== undefined) {
            filtered = filtered.filter((item) => (Number(item[key]) || 0) >= value.min)
          }
          if (value.max !== undefined) {
            filtered = filtered.filter((item) => (Number(item[key]) || 0) <= value.max)
          }
        } else if (typeof value === 'string') {
          // String filter - case-insensitive includes
          const lowerValue = value.toLowerCase()
          filtered = filtered.filter((item) =>
            String(item[key] || '')
              .toLowerCase()
              .includes(lowerValue)
          )
        } else {
          // Exact match for booleans and numbers
          filtered = filtered.filter((item) => item[key] === value)
        }
      })

      return filtered
    },
    [state.dateRange, state.filters]
  )

  return {
    state,
    setDateRange,
    setFilter,
    clearFilter,
    clearAllFilters,
    applyFilters,
  }
}

export default useMetricsFilters
