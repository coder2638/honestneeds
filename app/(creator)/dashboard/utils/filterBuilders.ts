'use client'

/**
 * Dashboard Filter Builders & Query Utilities
 * Functions for building and parsing filter queries
 */

export interface FilterConfig {
  status: string[]
  type: string[]
  dateRange: {
    start: Date | null
    end: Date | null
  }
  searchQuery: string
  sortBy: 'created' | 'updated' | 'raised' | 'progress'
  sortOrder: 'asc' | 'desc'
}

/**
 * Build API query parameters from filter configuration
 */
export function buildQueryFromFilters(filters: Partial<FilterConfig>): Record<string, any> {
  const query: Record<string, any> = {}

  if (filters.status && filters.status.length > 0) {
    query.status = filters.status.join(',')
  }

  if (filters.type && filters.type.length > 0) {
    query.type = filters.type.join(',')
  }

  if (filters.dateRange?.start) {
    query.startDate = filters.dateRange.start.toISOString()
  }

  if (filters.dateRange?.end) {
    query.endDate = filters.dateRange.end.toISOString()
  }

  if (filters.searchQuery) {
    query.search = filters.searchQuery
  }

  if (filters.sortBy) {
    query.sortBy = filters.sortBy
  }

  if (filters.sortOrder) {
    query.sortOrder = filters.sortOrder
  }

  return query
}

/**
 * Parse advanced search syntax
 * Examples: "status:active goal:>1000", "type:fundraising raised:500-1000"
 */
export function parseAdvancedSearchSyntax(query: string): Partial<FilterConfig> {
  const filters: Partial<FilterConfig> = {
    status: [],
    type: [],
    searchQuery: query,
  }

  if (!query) return filters

  // Match patterns like "key:value"
  const Pattern = /(\w+):([\w\-\$\.><=]+)/g
  let match

  while ((match = Pattern.exec(query)) !== null) {
    const [, key, value] = match

    switch (key.toLowerCase()) {
      case 'status':
        if (filters.status && !filters.status.includes(value)) {
          filters.status.push(value)
        }
        break

      case 'type':
        if (filters.type && !filters.type.includes(value)) {
          filters.type.push(value)
        }
        break

      case 'goal':
        // Handle comparative values like >1000, <500, 100-500
        // This would need additional filter config extension
        break

      case 'raised':
        // Similar to goal, handle ranges and comparatives
        break
    }
  }

  // Remove the advanced syntax from search query
  const cleanQuery = query.replace(Pattern, '').trim()
  filters.searchQuery = cleanQuery

  return filters
}

/**
 * Validate date range
 */
export function validateDateRange(
  start: Date | null,
  end: Date | null
): {
  valid: boolean
  error?: string
} {
  if (!start || !end) {
    return { valid: true } // Both null is valid
  }

  if (start > end) {
    return {
      valid: false,
      error: 'Start date must be before end date',
    }
  }

  const maxRange = 365 // Max 1 year
  const daysDiff = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)

  if (daysDiff > maxRange) {
    return {
      valid: false,
      error: `Date range cannot exceed ${maxRange} days`,
    }
  }

  return { valid: true }
}

/**
 * Normalize and simplify filter set
 */
export function simplifyFilterSet(filters: Partial<FilterConfig>): Partial<FilterConfig> {
  return {
    ...(filters.status && filters.status.length > 0 && { status: [...new Set(filters.status)] }),
    ...(filters.type && filters.type.length > 0 && { type: [...new Set(filters.type)] }),
    ...(filters.dateRange && {
      dateRange: {
        start: filters.dateRange.start,
        end: filters.dateRange.end,
      },
    }),
    ...(filters.searchQuery && filters.searchQuery.trim() && { searchQuery: filters.searchQuery.trim() }),
    ...(filters.sortBy && { sortBy: filters.sortBy }),
    ...(filters.sortOrder && { sortOrder: filters.sortOrder }),
  }
}

/**
 * Check if filters are empty (no active filters)
 */
export function isEmptyFilter(filters: Partial<FilterConfig>): boolean {
  return (
    (!filters.status || filters.status.length === 0) &&
    (!filters.type || filters.type.length === 0) &&
    (!filters.dateRange?.start && !filters.dateRange?.end) &&
    (!filters.searchQuery || filters.searchQuery.trim() === '')
  )
}

/**
 * Count active filters
 */
export function countActiveFilters(filters: Partial<FilterConfig>): number {
  let count = 0
  if (filters.status?.length) count += filters.status.length
  if (filters.type?.length) count += filters.type.length
  if (filters.dateRange?.start || filters.dateRange?.end) count++
  if (filters.searchQuery?.trim()) count++
  return count
}

/**
 * Encode filters to URL-safe string for sharing/bookmarking
 */
export function encodeFilters(filters: Partial<FilterConfig>): string {
  const cleaned = simplifyFilterSet(filters)
  const encoded = btoa(JSON.stringify(cleaned))
  return encoded
}

/**
 * Decode filters from URL-safe string
 */
export function decodeFilters(encoded: string): Partial<FilterConfig> | null {
  try {
    const decoded = JSON.parse(atob(encoded))
    // Restore dates from ISO strings
    if (decoded.dateRange?.start) {
      decoded.dateRange.start = new Date(decoded.dateRange.start)
    }
    if (decoded.dateRange?.end) {
      decoded.dateRange.end = new Date(decoded.dateRange.end)
    }
    return decoded
  } catch {
    return null
  }
}

/**
 * Get filter description for UI display
 */
export function getFilterDescription(filters: Partial<FilterConfig>): string {
  const parts: string[] = []

  if (filters.searchQuery?.trim()) {
    parts.push(`"${filters.searchQuery}"`)
  }

  if (filters.status?.length) {
    parts.push(filters.status.map((s) => `${s} campaigns`).join(', '))
  }

  if (filters.type?.length) {
    parts.push(filters.type.map((t) => `${t} type`).join(', '))
  }

  if (filters.dateRange?.start || filters.dateRange?.end) {
    const startStr = filters.dateRange?.start?.toLocaleDateString() || 'any time'
    const endStr = filters.dateRange?.end?.toLocaleDateString() || 'today'
    parts.push(`between ${startStr} and ${endStr}`)
  }

  return parts.length > 0 ? parts.join(' • ') : 'No active filters'
}

/**
 * Create a URL with filter params for sharing
 */
export function createFilterShareURL(filters: Partial<FilterConfig>, baseURL: string = ''): string {
  const encoded = encodeFilters(filters)
  const url = new URL(baseURL || window.location.href)
  url.searchParams.set('filters', encoded)
  return url.toString()
}

/**
 * Extract filters from URL params
 */
export function getFiltersFromURL(): Partial<FilterConfig> | null {
  if (typeof window === 'undefined') return null

  const params = new URLSearchParams(window.location.search)
  const encoded = params.get('filters')

  if (!encoded) return null

  return decodeFilters(encoded)
}

/**
 * Build MongoDB/Mongoose query filter object
 * (for backend implementation reference)
 */
export function buildMongooseQuery(filters: Partial<FilterConfig>): Record<string, any> {
  const query: Record<string, any> = {}

  // Status filter
  if (filters.status?.length) {
    query.status = { $in: filters.status }
  }

  // Type filter (campaign_type in database)
  if (filters.type?.length) {
    query.campaign_type = { $in: filters.type }
  }

  // Date range filter
  if (filters.dateRange?.start || filters.dateRange?.end) {
    const dateFilter: Record<string, Date> = {}
    if (filters.dateRange?.start) {
      dateFilter.$gte = filters.dateRange.start
    }
    if (filters.dateRange?.end) {
      dateFilter.$lte = filters.dateRange.end
    }
    query.created_at = dateFilter
  }

  // Text search filter
  if (filters.searchQuery?.trim()) {
    // MongoDB text search
    query.$text = { $search: filters.searchQuery }
  }

  return query
}

/**
 * Build sort options for MongoDB query
 */
export function buildMongooseSort(filters: Partial<FilterConfig>): Record<string, 1 | -1> {
  const direction = filters.sortOrder === 'asc' ? 1 : -1

  switch (filters.sortBy) {
    case 'created':
      return { created_at: direction }
    case 'updated':
      return { updated_at: direction }
    case 'raised':
      return { raised: direction }
    case 'progress':
      return { 'goal': direction } // Sort by progress ratio
    default:
      return { updated_at: -1 } // Default: newest first
  }
}
