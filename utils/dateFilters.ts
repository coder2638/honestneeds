/**
 * Date Filter Utilities for Analytics
 * Provides utilities for generating date ranges, grouping data, and filtering metrics
 */

export type DateRangeType = 'today' | '7d' | '30d' | '90d' | 'ytd' | 'custom'

export interface DateRange {
  startDate: Date
  endDate: Date
  label: string
  type: DateRangeType
}

/**
 * Generate date ranges for common analytics windows
 */
export const getDateRange = (type: DateRangeType, customStart?: Date, customEnd?: Date): DateRange => {
  const endDate = new Date()
  endDate.setHours(23, 59, 59, 999)

  let startDate = new Date()
  let label = ''

  switch (type) {
    case 'today': {
      startDate = new Date(endDate)
      startDate.setHours(0, 0, 0, 0)
      label = 'Today'
      break
    }

    case '7d': {
      startDate = new Date(endDate)
      startDate.setDate(startDate.getDate() - 7)
      startDate.setHours(0, 0, 0, 0)
      label = 'Last 7 Days'
      break
    }

    case '30d': {
      startDate = new Date(endDate)
      startDate.setDate(startDate.getDate() - 30)
      startDate.setHours(0, 0, 0, 0)
      label = 'Last 30 Days'
      break
    }

    case '90d': {
      startDate = new Date(endDate)
      startDate.setDate(startDate.getDate() - 90)
      startDate.setHours(0, 0, 0, 0)
      label = 'Last 90 Days'
      break
    }

    case 'ytd': {
      startDate = new Date(endDate.getFullYear(), 0, 1)
      startDate.setHours(0, 0, 0, 0)
      label = 'Year to Date'
      break
    }

    case 'custom': {
      if (!customStart || !customEnd) {
        const yesterday = new Date(endDate)
        yesterday.setDate(yesterday.getDate() - 1)
        return { startDate: yesterday, endDate, label: 'Custom', type: 'custom' }
      }
      startDate = new Date(customStart)
      startDate.setHours(0, 0, 0, 0)
      const end = new Date(customEnd)
      end.setHours(23, 59, 59, 999)
      label = `${formatDate(startDate)} - ${formatDate(end)}`
      return { startDate, endDate: end, label, type: 'custom' }
    }

    default: {
      label = 'Last 30 Days'
      startDate = new Date(endDate)
      startDate.setDate(startDate.getDate() - 30)
      startDate.setHours(0, 0, 0, 0)
    }
  }

  return {
    startDate,
    endDate,
    label,
    type,
  }
}

/**
 * Format date to string for display
 */
export const formatDate = (date: Date, format: 'short' | 'long' = 'short'): string => {
  if (format === 'short') {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' })
  }
  return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
}

/**
 * Format date to ISO string (for API calls)
 */
export const formatDateISO = (date: Date): string => {
  return date.toISOString().split('T')[0]
}

/**
 * Group data points by time period
 */
export const groupByPeriod = (
  data: any[],
  dateKey: string,
  period: 'day' | 'week' | 'month' | 'hour'
): Map<string, any[]> => {
  const grouped = new Map<string, any[]>()

  data.forEach((item) => {
    const date = new Date(item[dateKey])
    let key = ''

    switch (period) {
      case 'day':
        key = formatDateISO(date)
        break
      case 'week': {
        const weekStart = new Date(date)
        weekStart.setDate(date.getDate() - date.getDay())
        key = `Week of ${formatDateISO(weekStart)}`
        break
      }
      case 'month':
        key = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
        break
      case 'hour':
        key = date.toISOString().split(':')[0]
        break
    }

    if (!grouped.has(key)) {
      grouped.set(key, [])
    }
    grouped.get(key)!.push(item)
  })

  return grouped
}

/**
 * Aggregate metrics across grouped data
 */
export const aggregateMetrics = (
  groupedData: Map<string, any[]>,
  metricsKeys: string[],
  aggregationType: 'sum' | 'avg' | 'max' | 'min' = 'sum'
): any[] => {
  const result: any[] = []

  groupedData.forEach((items, key) => {
    const aggregated: any = { period: key }

    metricsKeys.forEach((metricKey) => {
      const values = items
        .map((item) => Number(item[metricKey]) || 0)
        .filter((val) => !isNaN(val))

      if (values.length === 0) {
        aggregated[metricKey] = 0
        return
      }

      switch (aggregationType) {
        case 'sum':
          aggregated[metricKey] = values.reduce((a, b) => a + b, 0)
          break
        case 'avg':
          aggregated[metricKey] = values.reduce((a, b) => a + b, 0) / values.length
          break
        case 'max':
          aggregated[metricKey] = Math.max(...values)
          break
        case 'min':
          aggregated[metricKey] = Math.min(...values)
          break
      }
    })

    result.push(aggregated)
  })

  return result
}

/**
 * Filter data by date range
 */
export const filterByDateRange = (data: any[], dateKey: string, range: DateRange): any[] => {
  return data.filter((item) => {
    const itemDate = new Date(item[dateKey])
    return itemDate >= range.startDate && itemDate <= range.endDate
  })
}

/**
 * Calculate date-over-date comparison
 */
export const calculateDateOverDate = (
  currentData: any[],
  previousData: any[],
  metric: string
): { current: number; previous: number; change: number; percentChange: number } => {
  const currentValue = currentData.reduce((sum, item) => sum + (Number(item[metric]) || 0), 0)
  const previousValue = previousData.reduce((sum, item) => sum + (Number(item[metric]) || 0), 0)

  const change = currentValue - previousValue
  const percentChange = previousValue !== 0 ? (change / previousValue) * 100 : 0

  return {
    current: currentValue,
    previous: previousValue,
    change,
    percentChange,
  }
}

/**
 * Generate time series data with missing date gaps filled
 */
export const fillMissingDates = (
  data: any[],
  dateKey: string,
  period: 'day' | 'week' = 'day'
): any[] => {
  if (data.length === 0) return []

  const sorted = [...data].sort((a, b) => new Date(a[dateKey]).getTime() - new Date(b[dateKey]).getTime())
  const startDate = new Date(sorted[0][dateKey])
  const endDate = new Date(sorted[sorted.length - 1][dateKey])

  const filled: any[] = []
  const current = new Date(startDate)

  while (current <= endDate) {
    const dateStr = formatDateISO(current)
    const existing = sorted.find((item) => formatDateISO(new Date(item[dateKey])) === dateStr)

    if (existing) {
      filled.push(existing)
    } else {
      // Create a zero-value entry for missing dates
      filled.push({
        [dateKey]: dateStr,
        displayDate: formatDate(current, 'short'),
      })
    }

    if (period === 'day') {
      current.setDate(current.getDate() + 1)
    } else {
      current.setDate(current.getDate() + 7)
    }
  }

  return filled
}

/**
 * Get comparison date range (for YoY, MoM, WoW)
 */
export const getComparisonRange = (
  currentRange: DateRange,
  comparisonType: 'yoy' | 'mom' | 'wow'
): DateRange => {
  const startDate = new Date(currentRange.startDate)
  const endDate = new Date(currentRange.endDate)

  switch (comparisonType) {
    case 'yoy':
      startDate.setFullYear(startDate.getFullYear() - 1)
      endDate.setFullYear(endDate.getFullYear() - 1)
      break
    case 'mom':
      startDate.setMonth(startDate.getMonth() - 1)
      endDate.setMonth(endDate.getMonth() - 1)
      break
    case 'wow':
      startDate.setDate(startDate.getDate() - 7)
      endDate.setDate(endDate.getDate() - 7)
      break
  }

  return {
    startDate,
    endDate,
    label: `${currentRange.label} (${comparisonType.toUpperCase()})`,
    type: 'custom',
  }
}

/**
 * Format large numbers for display
 */
export const formatNumber = (num: number, decimals: number = 0): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(decimals) + 'M'
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(decimals) + 'K'
  }
  return num.toFixed(decimals)
}

/**
 * Calculate moving average
 */
export const calculateMovingAverage = (data: any[], valueKey: string, window: number = 7): any[] => {
  return data.map((item, index) => {
    const start = Math.max(0, index - window + 1)
    const subset = data.slice(start, index + 1)
    const avg = subset.reduce((sum, d) => sum + (Number(d[valueKey]) || 0), 0) / subset.length

    return {
      ...item,
      [`${valueKey}_ma${window}`]: avg,
    }
  })
}

export default {
  getDateRange,
  formatDate,
  formatDateISO,
  groupByPeriod,
  aggregateMetrics,
  filterByDateRange,
  calculateDateOverDate,
  fillMissingDates,
  getComparisonRange,
  formatNumber,
  calculateMovingAverage,
}
