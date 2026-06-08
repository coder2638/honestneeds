'use client'

import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { Calendar, Download, TrendingUp, Target, Users, DollarSign } from 'lucide-react'
import {
  TimeSeriesChart,
  TrendIndicatorRow,
  ForecastingChart,
  OptimizationPanel,
  ActivityPredictionCard,
  SeasonalHeatmap,
  ChannelROIChart,
} from '@/components/analytics'
import { useMetricsFilters } from '@/hooks/useMetricsFilters'
import { fillMissingDates } from '@/utils/dateFilters'
import { useAuthStore } from '@/store/authStore'

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

const NoDataMessage = styled.div`
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  border-radius: 8px;
  padding: 24px;
  color: #1e40af;
  text-align: center;
  margin-bottom: 24px;
`

/**
 * Creator Analytics Page
 * Advanced analytics for campaign creators showing:
 * - Share and donation trends
 * - Forecast for next period
 * - Audience insights and activity predictions
 * - Channel performance analysis
 * - Optimization recommendations
 */
export default function CreatorAnalyticsPage() {
  const router = useRouter()
  const { user } = useAuthStore()
  const { state, setDateRange } = useMetricsFilters('30d')

  // Check if user is authenticated
  useEffect(() => {
    if (!user) {
      router.push('/auth/login')
    }
  }, [user, router])

  // Fetch creator metrics
  const { data: metricsData, isLoading, error } = useQuery({
    queryKey: ['creator-analytics', user?.id, state.dateRange],
    queryFn: async () => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null
      const response = await axios.get('/api/metrics/creator/dashboard', {
        params: {
          startDate: state.dateRange.startDate.toISOString(),
          endDate: state.dateRange.endDate.toISOString(),
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      return response.data.data
    },
    enabled: !!user,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  // Process data for visualizations
  const processedData = React.useMemo(() => {
    if (!metricsData) return null

    return {
      timeSeries: fillMissingDates(metricsData.timeSeries || [], 'date', 'day'),
      forecast: metricsData.forecastData || [],
      channelMetrics: metricsData.channelMetrics || [],
      activityPredictions: metricsData.activityPredictions || [],
      optimizationRecommendations: metricsData.recommendations || [],
      heatmapData: metricsData.hourlyActivity || [],
      trends: metricsData.trends || {},
      campaigns: metricsData.campaigns || [],
    }
  }, [metricsData])

  const handleCampaignClick = (campaignId: string) => {
    router.push(`/campaigns/${campaignId}`)
  }

  if (!user) {
    return null
  }

  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>Campaign Analytics</PageTitle>
        <PageSubtitle>Performance insights and optimization recommendations for your campaigns</PageSubtitle>

        <ControlBar>
          <Calendar size={16} />
          <DateRangeButton
            $active={state.dateRangeType === '7d'}
            onClick={() => setDateRange('7d')}
          >
            7 Days
          </DateRangeButton>
          <DateRangeButton
            $active={state.dateRangeType === '30d'}
            onClick={() => setDateRange('30d')}
          >
            30 Days
          </DateRangeButton>
          <DateRangeButton
            $active={state.dateRangeType === '90d'}
            onClick={() => setDateRange('90d')}
          >
            90 Days
          </DateRangeButton>

          <div style={{ marginLeft: 'auto' }}>
            <ActionButton>
              <Download size={14} />
              Export Report
            </ActionButton>
          </div>
        </ControlBar>
      </PageHeader>

      {error && <ErrorMessage>Failed to load analytics. Please try again.</ErrorMessage>}

      {isLoading ? (
        <LoadingMessage>Loading your analytics...</LoadingMessage>
      ) : !metricsData || !processedData.campaigns || processedData.campaigns.length === 0 ? (
        <NoDataMessage>
          <TrendingUp size={32} style={{ margin: '0 auto 12px' }} />
          <h3>No campaigns yet</h3>
          <p>Create your first campaign to start tracking performance metrics and insights.</p>
          <ActionButton
            style={{
              marginTop: '16px',
              background: '#0ea5e9',
            }}
            onClick={() => router.push('/campaigns/create')}
          >
            Create First Campaign
          </ActionButton>
        </NoDataMessage>
      ) : processedData ? (
        <>
          {/* Trend Indicators */}
          {processedData.trends && Object.keys(processedData.trends).length > 0 && (
            <div style={{ marginBottom: '24px' }}>
              <TrendIndicatorRow
                title="Campaign Performance"
                indicators={[
                  {
                    value: processedData.trends.totalShares || 0,
                    label: 'Total Shares',
                    unit: 'shares',
                    direction: 'up',
                    percentChange: processedData.trends.shareGrowth || 0,
                  },
                  {
                    value: `$${(processedData.trends.totalDonations || 0).toFixed(0)}`,
                    label: 'Total Raised',
                    unit: 'USD',
                    direction: 'up',
                    percentChange: processedData.trends.donationGrowth || 0,
                  },
                  {
                    value: processedData.trends.activeCampaigns || 0,
                    label: 'Active Campaigns',
                    direction: 'neutral',
                  },
                  {
                    value: processedData.trends.averageEngagement || 0,
                    label: 'Engagement Rate',
                    unit: '%',
                    direction: 'up',
                  },
                ]}
              />
            </div>
          )}

          {/* Charts Grid */}
          <ChartGrid>
            {/* Time Series - Shares & Donations */}
            {processedData.timeSeries && processedData.timeSeries.length > 0 && (
              <FullWidthChart>
                <TimeSeriesChart
                  data={processedData.timeSeries}
                  title="Campaign Performance Over Time"
                  metrics={[
                    { key: 'shares', label: 'Shares', color: '#3b82f6', type: 'area' },
                    { key: 'donations', label: 'Donations', color: '#10b981', type: 'line' },
                  ]}
                  height={400}
                />
              </FullWidthChart>
            )}

            {/* Channel Performance */}
            {processedData.channelMetrics && processedData.channelMetrics.length > 0 && (
              <FullWidthChart>
                <ChannelROIChart
                  data={processedData.channelMetrics}
                  title="Channel Performance"
                  currencySymbol="$"
                />
              </FullWidthChart>
            )}

            {/* Forecast */}
            {processedData.forecast && processedData.forecast.length > 0 && (
              <ForecastingChart
                data={processedData.forecast}
                title="Next 14 Days Forecast"
                actualLabel="Recorded Shares"
                forecastLabel="Predicted Shares"
                confidence={90}
              />
            )}

            {/* Activity Heatmap */}
            {processedData.heatmapData && processedData.heatmapData.length > 0 && (
              <SeasonalHeatmap
                data={processedData.heatmapData}
                title="Best Performance Times"
                valueKey="engagement"
                xAxisKey="hour"
                yAxisKey="dayOfWeek"
              />
            )}

            {/* Optimization Recommendations */}
            {processedData.optimizationRecommendations &&
              processedData.optimizationRecommendations.length > 0 && (
                <FullWidthChart>
                  <OptimizationPanel
                    recommendations={processedData.optimizationRecommendations}
                    title="Optimization Recommendations"
                  />
                </FullWidthChart>
              )}

            {/* User Activity Predictions */}
            {processedData.activityPredictions && processedData.activityPredictions.length > 0 && (
              <FullWidthChart>
                <ActivityPredictionCard
                  predictions={processedData.activityPredictions}
                  title="Supporter Activity Predictions"
                  onUserClick={(userId) => {
                    // Could navigate to supporter profile or open modal
                    console.log('View user:', userId)
                  }}
                  currencySymbol="$"
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
