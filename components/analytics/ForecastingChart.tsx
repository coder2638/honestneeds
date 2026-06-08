'use client'

import React from 'react'
import styled from 'styled-components'
import { LineChart, Line, ComposedChart, Area, AreaChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface ForecastDataPoint {
  date: string
  displayDate?: string
  actual?: number
  forecast: number
  upper: number
  lower: number
  confidence?: number
}

interface ForecastingChartProps {
  data: ForecastDataPoint[]
  title?: string
  actualLabel?: string
  forecastLabel?: string
  height?: number
  confidence?: number
  loading?: boolean
  accuracy?: number
}

const Container = styled.div`
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 24px;
  width: 100%;
  overflow-x: auto;
`

const Title = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: #111827;
  margin-bottom: 8px;
  margin-top: 0;
`

const Subtitle = styled.p`
  font-size: 13px;
  color: #6b7280;
  margin-bottom: 16px;
  margin-top: 0;
`

const ChartContainer = styled.div`
  width: 100%;
  height: 400px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 16px;
`

const LoadingMessage = styled.div`
  text-align: center;
  color: #6b7280;
  font-size: 14px;
`

const MetricsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 16px;
  margin-top: 16px;
`

const MetricCard = styled.div`
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 12px;
  text-align: center;
`

const MetricLabel = styled.p`
  font-size: 12px;
  color: #6b7280;
  font-weight: 500;
  margin: 0 0 6px 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`

const MetricValue = styled.p`
  font-size: 18px;
  font-weight: 600;
  color: #111827;
  margin: 0;
`

const CustomTooltip = styled.div`
  background: white;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  padding: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  font-size: 12px;
  color: #374151;
`

/**
 * ForecastingChart Component
 * Displays time series with forecast predictions and confidence intervals
 * 
 * @example
 * <ForecastingChart
 *   data={forecastData}
 *   title="14-Day Share Forecast"
 *   actualLabel="Actual Shares"
 *   forecastLabel="Predicted Shares"
 *   confidence={95}
 *   accuracy={87}
 * />
 */
export const ForecastingChart: React.FC<ForecastingChartProps> = ({
  data,
  title = 'Forecast',
  actualLabel = 'Actual',
  forecastLabel = 'Forecast',
  height = 400,
  confidence = 95,
  loading = false,
  accuracy,
}) => {
  if (loading || !data || data.length === 0) {
    return (
      <Container>
        {title && <Title>{title}</Title>}
        <ChartContainer>
          <LoadingMessage>
            {loading ? 'Loading forecast data...' : 'No data available'}
          </LoadingMessage>
        </ChartContainer>
      </Container>
    )
  }

  // Separate historical and forecasted data
  const historicalData = data.filter((d) => d.actual !== undefined)
  const forecastedData = data.slice(Math.max(0, historicalData.length - 1))

  const customTooltipComponent = (props: any) => {
    const { active, payload } = props
    if (active && payload && payload.length) {
      const dataPoint = payload[0]?.payload
      return (
        <CustomTooltip>
          <p style={{ margin: '0 0 8px 0', fontWeight: 600 }}>
            {dataPoint.displayDate || dataPoint.date}
          </p>
          {dataPoint.actual !== undefined && (
            <p style={{ margin: '4px 0', color: '#3b82f6' }}>
              {actualLabel}: {dataPoint.actual.toFixed(2)}
            </p>
          )}
          {dataPoint.forecast && (
            <p style={{ margin: '4px 0', color: '#8b5cf6' }}>
              {forecastLabel}: {dataPoint.forecast.toFixed(2)}
            </p>
          )}
          {dataPoint.upper && dataPoint.lower && (
            <p style={{ margin: '4px 0', fontSize: '11px', color: '#6b7280' }}>
              {confidence}% CI: {dataPoint.lower.toFixed(2)} - {dataPoint.upper.toFixed(2)}
            </p>
          )}
        </CustomTooltip>
      )
    }
    return null
  }

  return (
    <Container>
      {title && (
        <>
          <Title>{title}</Title>
          {confidence && (
            <Subtitle>{confidence}% confidence interval with predicted bounds</Subtitle>
          )}
        </>
      )}

      <ChartContainer>
        <ResponsiveContainer width="100%" height={height}>
          <ComposedChart
            data={forecastedData}
            margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="displayDate" angle={-45} textAnchor="end" height={100} />
            <YAxis />
            <Tooltip content={customTooltipComponent} />
            <Legend />

            {/* Confidence Interval Area */}
            <Area
              type="monotone"
              dataKey="upper"
              fill="none"
              stroke="none"
              isAnimationActive={false}
            />
            <Area
              type="monotone"
              dataKey="lower"
              fill="#e9d5ff"
              stroke="none"
              fillOpacity={0.4}
              name={`${confidence}% Confidence Interval`}
              isAnimationActive={false}
            />

            {/* Actual Data Line */}
            <Line
              type="monotone"
              dataKey="actual"
              stroke="#3b82f6"
              strokeWidth={2.5}
              dot={{ fill: '#3b82f6', r: 5 }}
              activeDot={{ r: 7 }}
              name={actualLabel}
              isAnimationActive={false}
            />

            {/* Forecast Line */}
            <Line
              type="monotone"
              dataKey="forecast"
              stroke="#8b5cf6"
              strokeWidth={2.5}
              strokeDasharray="5 5"
              dot={{ fill: '#8b5cf6', r: 5 }}
              activeDot={{ r: 7 }}
              name={forecastLabel}
              isAnimationActive={false}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </ChartContainer>

      {/* Forecast Metrics */}
      <MetricsRow>
        <MetricCard>
          <MetricLabel>Confidence Level</MetricLabel>
          <MetricValue>{confidence}%</MetricValue>
        </MetricCard>
        {accuracy !== undefined && (
          <MetricCard>
            <MetricLabel>Model Accuracy</MetricLabel>
            <MetricValue>{accuracy}%</MetricValue>
          </MetricCard>
        )}
        <MetricCard>
          <MetricLabel>Forecast Period</MetricLabel>
          <MetricValue>{data.length} days</MetricValue>
        </MetricCard>
        {historicalData.length > 0 && (
          <MetricCard>
            <MetricLabel>Historical Data Points</MetricLabel>
            <MetricValue>{historicalData.length}</MetricValue>
          </MetricCard>
        )}
      </MetricsRow>
    </Container>
  )
}

export default ForecastingChart
