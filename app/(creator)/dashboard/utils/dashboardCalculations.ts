'use client'

/**
 * Dashboard Calculation Utilities
 * Functions for computing dashboard metrics, scores, and trends
 */

/**
 * Campaign Health Score Calculation
 * Returns a 0-100 health score based on multiple factors
 */
export function calculateHealthScore(campaign: {
  raised: number
  goal: number
  donor_count?: number
  status: string
  created_at: string
  updated_at: string
}): {
  score: number
  level: 'excellent' | 'good' | 'fair' | 'poor'
  color: string
} {
  let score = 0

  // 1. Progress toward goal (30%)
  const goalProgress = campaign.goal > 0 ? (campaign.raised / campaign.goal) * 100 : 0
  const progressScore = Math.min(goalProgress / 100, 1) * 30
  score += progressScore

  // 2. Engagement (donor count) (20%)
  // Assume good average is 50+ donors
  const engagementScore = Math.min((campaign.donor_count || 0) / 50, 1) * 20
  score += engagementScore

  // 3. Activity recency (20%)
  // Recent activity gets higher score
  const daysSinceUpdate = (Date.now() - new Date(campaign.updated_at).getTime()) / (1000 * 60 * 60 * 24)
  const activityScore = Math.max(0, 1 - daysSinceUpdate / 30) * 20
  score += activityScore

  // 4. Campaign age & status (15%)
  const daysOld = (Date.now() - new Date(campaign.created_at).getTime()) / (1000 * 60 * 60 * 24)
  let ageScore = 0
  if (campaign.status === 'active' && daysOld <= 90) ageScore = 15 // Recent active campaigns score high
  else if (campaign.status === 'completed') ageScore = 15 // Completed campaigns score high
  else if (campaign.status === 'draft') ageScore = 0
  else ageScore = 7.5 // Paused campaigns get half
  score += ageScore

  // 5. Conversion efficiency (15%)
  // Average donation per donor
  const avgDonation = campaign.donor_count && campaign.donor_count > 0 ? campaign.raised / campaign.donor_count : 0
  // Assume good average donation is $50
  const conversionScore = Math.min(avgDonation / 50, 1) * 15
  score += conversionScore

  // Determine level
  const roundedScore = Math.round(score)
  let level: 'excellent' | 'good' | 'fair' | 'poor'
  let color: string

  if (roundedScore >= 80) {
    level = 'excellent'
    color = '#10b981' // Green
  } else if (roundedScore >= 60) {
    level = 'good'
    color = '#3b82f6' // Blue
  } else if (roundedScore >= 40) {
    level = 'fair'
    color = '#f59e0b' // Amber
  } else {
    level = 'poor'
    color = '#ef4444' // Red
  }

  return {
    score: roundedScore,
    level,
    color,
  }
}

/**
 * Calculate trend percentage between two periods
 */
export function calculateTrendPercentage(
  current: number,
  previous: number
): {
  direction: 'up' | 'down' | 'neutral'
  percentage: number
  change: number
} {
  if (previous === 0) {
    return {
      direction: current > 0 ? 'up' : 'neutral',
      percentage: current > 0 ? 100 : 0,
      change: current,
    }
  }

  const change = current - previous
  const percentage = Math.abs((change / previous) * 100)

  return {
    direction: change > 0 ? 'up' : change < 0 ? 'down' : 'neutral',
    percentage: Math.round(percentage),
    change,
  }
}

/**
 * Estimate campaign completion date based on current trajectory
 */
export function estimateCompletionDate(campaign: {
  raised: number
  goal: number
  created_at: string
  updated_at: string
}): Date | null {
  if (campaign.raised >= campaign.goal) {
    return new Date(campaign.updated_at)
  }

  const daysActive = (new Date(campaign.updated_at).getTime() - new Date(campaign.created_at).getTime()) / (1000 * 60 * 60 * 24)
  const avgPerDay = campaign.raised / Math.max(daysActive, 1)

  if (avgPerDay === 0) return null

  const remainingAmount = campaign.goal - campaign.raised
  const daysNeeded = remainingAmount / avgPerDay

  const completionDate = new Date()
  completionDate.setDate(completionDate.getDate() + daysNeeded)

  return completionDate
}

/**
 * Calculate days remaining for campaign
 */
export function daysRemaining(createdAt: string, durationDays: number = 30): number {
  const createdDate = new Date(createdAt)
  const endDate = new Date(createdDate.getTime() + durationDays * 24 * 60 * 60 * 1000)
  const now = new Date()
  const remaining = (endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
  return Math.max(0, Math.ceil(remaining))
}

/**
 * Format large numbers with K, M, B suffixes
 */
export function formatCompactNumber(num: number): string {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
  return num.toString()
}

/**
 * Calculate average donation amount
 */
export function calculateAverageDonation(raised: number, donorCount: number): number {
  if (donorCount === 0) return 0
  return raised / donorCount
}

/**
 * Calculate conversion rate (donors / visitors estimate)
 * Assumes average campaign gets 10x more impressions than donors
 */
export function calculateConversionRate(donorCount: number, estimatedVisitors: number = 0): number {
  if (estimatedVisitors === 0) {
    // Estimate: typically 10 visitors per donor
    estimatedVisitors = donorCount * 10
  }
  if (estimatedVisitors === 0) return 0
  return (donorCount / estimatedVisitors) * 100
}

/**
 * Calculate growth rate between two data points
 */
export function calculateGrowthRate(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0
  return ((current - previous) / previous) * 100
}

/**
 * Aggregate stats across multiple campaigns
 */
export function aggregateCampaignStats(campaigns: Array<{
  raised: number
  goal: number
  status: string
  donor_count?: number
}>): {
  totalRaised: number
  totalGoal: number
  overallProgress: number
  activeCampaigns: number
  completedCampaigns: number
  draftCampaigns: number
  pausedCampaigns: number
  totalDonors: number
  averageCampaignProgress: number
} {
  const stats = {
    totalRaised: 0,
    totalGoal: 0,
    overallProgress: 0,
    activeCampaigns: 0,
    completedCampaigns: 0,
    draftCampaigns: 0,
    pausedCampaigns: 0,
    totalDonors: 0,
    averageCampaignProgress: 0,
  }

  campaigns.forEach((campaign) => {
    stats.totalRaised += campaign.raised
    stats.totalGoal += campaign.goal
    stats.totalDonors += campaign.donor_count || 0

    switch (campaign.status) {
      case 'active':
        stats.activeCampaigns++
        break
      case 'completed':
        stats.completedCampaigns++
        break
      case 'draft':
        stats.draftCampaigns++
        break
      case 'paused':
        stats.pausedCampaigns++
        break
    }
  })

  stats.overallProgress = stats.totalGoal > 0 ? (stats.totalRaised / stats.totalGoal) * 100 : 0
  stats.averageCampaignProgress = campaigns.length > 0 
    ? campaigns.reduce((sum, c) => sum + (c.goal > 0 ? (c.raised / c.goal) * 100 : 0), 0) / campaigns.length
    : 0

  return stats
}

/**
 * Generate time series data for charts
 */
export function generateTimeSeriesData(
  data: Array<{ date: string; value: number }>,
  period: '7d' | '30d' | '90d' = '30d'
): Array<{ date: string; value: number; formattedDate: string }> {
  const dayCount = period === '7d' ? 7 : period === '30d' ? 30 : 90
  const today = new Date()
  
  // Create array of dates for the period
  const dates: Date[] = []
  for (let i = dayCount - 1; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    dates.push(date)
  }

  // Map data to dates
  return dates.map((date) => {
    const dateStr = date.toISOString().split('T')[0]
    const dataPoint = data.find((d) => d.date === dateStr)
    return {
      date: dateStr,
      value: dataPoint?.value || 0,
      formattedDate: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    }
  })
}
