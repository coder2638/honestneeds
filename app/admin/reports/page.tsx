'use client'

import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { Calendar, Download, Filter, RefreshCw } from 'lucide-react'
import {
  TimeSeriesChart,
  TrendIndicatorRow,
  CohortRetentionTable,
  PeriodComparisonChart,
  ChannelROIChart,
  ForecastingChart,
  SeasonalHeatmap,
} from '@/components/analytics'
import { useMetricsFilters } from '@/hooks/useMetricsFilters'
import { formatDate, fillMissingDates, groupByPeriod, aggregateMetrics } from '@/utils/dateFilters'
import { useAuthStore } from '@/store/authStore'

// This would come from your admin metrics API
import axios from 'axios'

const PageContainer = styled.div`
  padding: 24px;
  max-width: 1400px;
  margin: 0 auto;
`

const PageHeader = styled.div`
  margin-bottom: 32px;
`

const PageTitle = styled.h1`
  font-size: 32px;
  font-weight: 700;
  color: #111827;
  margin: 0 0 8px 0;
`

const PageSubtitle = styled.p`
  font-size: 15px;
  color: #6b7280;
  margin: 0;
`

const ControlBar = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
  margin-top: 16px;
  flex-wrap: wrap;
`

const DateRangeButton = styled.button<{ active?: boolean }>`
  padding: 8px 16px;
  border: 1px solid ${(props) => (props.active ? '#3b82f6' : '#d1d5db')};
  background: ${(props) => (props.active ? '#eff6ff' : 'white')};
  color: ${(props) => (props.active ? '#3b82f6' : '#6b7280')};
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  text-transform: uppercase;
  letter-spacing: 0.5px;

  &:hover {
    border-color: #3b82f6;
    background: #eff6ff;
  }
`

const ActionButton = styled.button`
  padding: 8px 16px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: background 0.2s ease;

  &:hover {
    background: #2563eb;
  }
`

const ChartGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;
  margin-bottom: 24px;

  @media (min-width: 1200px) {
    grid-template-columns: repeat(2, 1fr);
  }
`

const FullWidthChart = styled.div`
  grid-column: 1 / -1;
`

const LoadingMessage = styled.div`
  text-align: center;
  padding: 48px 24px;
  color: #6b7280;
  font-size: 16px;
`

const ErrorMessage = styled.div`
  background: #fee2e2;
  border: 1px solid #fecaca;
  border-radius: 8px;
  padding: 16px;
  color: #dc2626;
  margin-bottom: 24px;
`

/**
 * Admin Reports Page
 * Comprehensive analytics dashboard showing:
 * - Time series trends across the platform
 * - Cohort retention analysis
 * - Period comparisons (WoW, MoM, YoY)
 * - Channel ROI performance
 * - Forecast predictions
 * - Activity heatmaps
 */
export default function AdminReportsPage() {
  const router = useRouter()
  const { user } = useAuthStore()
  const { state, setDateRange, applyFilters } = useMetricsFilters('30d')

  // Check if user is admin
  useEffect(() => {
    if (!user || user.role !== 'admin') {
      router.push('/dashboard')
    }
  }, [user, router])

  // Fetch admin metrics
  const { data: metricsData, isLoading, error, refetch } = useQuery({
    queryKey: ['admin-metrics', state.dateRange],
    queryFn: async () => {
      const response = await axios.get('/api/admin/metrics', {
        params: {
          startDate: state.dateRange.startDate.toISOString(),
          endDate: state.dateRange.endDate.toISOString(),
        },
      })
      return response.data
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  // Process data for visualizations
  const processedData = React.useMemo(() => {
    if (!metricsData) return null

    return {
      timeSeries: fillMissingDates(metricsData.timeSeries || [], 'date', 'day'),
      cohorts: metricsData.cohortAnalysis || [],
      periodComparison: metricsData.periodComparison || [],
      channelROI: metricsData.channelMetrics || [],
      forecast: metricsData.forecastData || [],
      heatmapData: metricsData.hourlyActivity || [],
      trends: metricsData.trends || {},
    }
  }, [metricsData])

  if (!user || user.role !== 'admin') {
    return null
  }

  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>Analytics Dashboard</PageTitle>
        <PageSubtitle>Comprehensive platform performance metrics and insights</PageSubtitle>

        <ControlBar>
          <Calendar size={16} />
          <DateRangeButton
            active={state.dateRangeType === '7d'}
            onClick={() => setDateRange('7d')}
          >
            7 Days
          </DateRangeButton>
          <DateRangeButton
            active={state.dateRangeType === '30d'}
            onClick={() => setDateRange('30d')}
          >
            30 Days
          </DateRangeButton>
          <DateRangeButton
            active={state.dateRangeType === '90d'}
            onClick={() => setDateRange('90d')}
          >
            90 Days
          </DateRangeButton>
          <DateRangeButton
            active={state.dateRangeType === 'ytd'}
            onClick={() => setDateRange('ytd')}
          >
            YTD
          </DateRangeButton>

          <div style={{ marginLeft: 'auto', display: 'flex', gap: '12px' }}>
            <ActionButton onClick={() => refetch()}>
              <RefreshCw size={14} />
              Refresh
            </ActionButton>
            <ActionButton>
              <Download size={14} />
              Export
            </ActionButton>
          </div>
        </ControlBar>
      </PageHeader>

      {error && <ErrorMessage>Failed to load metrics. Please try again.</ErrorMessage>}

      {isLoading ? (
        <LoadingMessage>Loading analytics data...</LoadingMessage>
      ) : processedData ? (
        <>
          {/* Trend Indicators */}
          {processedData.trends && Object.keys(processedData.trends).length > 0 && (
            <div style={{ marginBottom: '24px' }}>
              <TrendIndicatorRow
                title="Key Metrics"
                indicators={[
                  {
                    value: processedData.trends.totalCampaigns || 0,
                    label: 'Total Campaigns',
                    direction: 'up',
                    percentChange: processedData.trends.campaignGrowth || 0,
                  },
                  {
                    value: processedData.trends.totalShares || 0,
                    label: 'Total Shares',
                    direction: 'up',
                    percentChange: processedData.trends.shareGrowth || 0,
                  },
                  {
                    value: `$${(processedData.trends.totalDonations || 0).toFixed(0)}`,
                    label: 'Total Donations',
                    direction: 'up',
                    percentChange: processedData.trends.donationGrowth || 0,
                  },
                  {
                    value: processedData.trends.activeUsers || 0,
                    label: 'Active Users',
                    direction: 'up',
                    percentChange: processedData.trends.userGrowth || 0,
                  },
                ]}
              />
            </div>
          )}

          {/* Charts Grid */}
          <ChartGrid>
            {/* Time Series Chart */}
            {processedData.timeSeries && processedData.timeSeries.length > 0 && (
              <FullWidthChart>
                <TimeSeriesChart
                  data={processedData.timeSeries}
                  title="Daily Donations & Shares"
                  metrics={[
                    { key: 'donations', label: 'Donations', color: '#3b82f6', type: 'area' },
                    { key: 'shares', label: 'Shares', color: '#10b981', type: 'line' },
                  ]}
                  height={400}
                />
              </FullWidthChart>
            )}

            {/* Period Comparison */}
            {processedData.periodComparison && processedData.periodComparison.length > 0 && (
              <PeriodComparisonChart
                data={processedData.periodComparison}
                title="Period Comparison"
                periods={[
                  { key: 'thisMonth', label: 'This Month', color: '#3b82f6' },
                  { key: 'lastMonth', label: 'Last Month', color: '#d1d5db' },
                ]}
                bestIndicator
              />
            )}

            {/* Channel ROI */}
            {processedData.channelROI && processedData.channelROI.length > 0 && (
              <FullWidthChart>
                <ChannelROIChart
                  data={processedData.channelROI}
                  title="Channel Performance & ROI"
                  currencySymbol="$"
                />
              </FullWidthChart>
            )}

            {/* Cohort Analysis */}
            {processedData.cohorts && processedData.cohorts.length > 0 && (
              <FullWidthChart>
                <CohortRetentionTable
                  data={processedData.cohorts}
                  title="Cohort Retention Analysis"
                />
              </FullWidthChart>
            )}

            {/* Forecast */}
            {processedData.forecast && processedData.forecast.length > 0 && (
              <FullWidthChart>
                <ForecastingChart
                  data={processedData.forecast}
                  title="14-Day Forecast"
                  confidence={95}
                />
              </FullWidthChart>
            )}

            {/* Activity Heatmap */}
            {processedData.heatmapData && processedData.heatmapData.length > 0 && (
              <FullWidthChart>
                <SeasonalHeatmap
                  data={processedData.heatmapData}
                  title="Activity Heatmap (Day & Hour)"
                  valueKey="count"
                  xAxisKey="hour"
                  yAxisKey="day"
                />
              </FullWidthChart>
            )}
          </ChartGrid>
        </>
      ) : (
        <LoadingMessage>No data available for selected period</LoadingMessage>
      )}
    </PageContainer>
  )
}
