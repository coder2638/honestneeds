'use client'

import React from 'react'
import styled from 'styled-components'
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart } from 'recharts'

interface TimeSeriesDataPoint {
  date: string
  displayDate?: string
  [key: string]: any
}

interface TimeSeriesChartProps {
  data: TimeSeriesDataPoint[]
  title?: string
  metrics: {
    key: string
    label: string
    color: string
    type?: 'line' | 'area' | 'bar'
  }[]
  height?: number
  showLegend?: boolean
  showGrid?: boolean
  loading?: boolean
  onDateClick?: (date: string) => void
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
  margin-bottom: 16px;
  margin-top: 0;
`

const ChartContainer = styled.div`
  width: 100%;
  height: ${(props: { height?: number }) => props.height || 400}px;
  display: flex;
  justify-content: center;
  align-items: center;
`

const LoadingMessage = styled.div`
  text-align: center;
  color: #6b7280;
  font-size: 14px;
`

const CustomTooltip = styled.div`
  background: white;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  padding: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  font-size: 13px;
  color: #374151;
`

/**
 * TimeSeriesChart Component
 * Displays line, area, or bar charts for time-series data
 * 
 * @example
 * <TimeSeriesChart
 *   data={shareTimeSeries}
 *   title="Daily Shares Over Time"
 *   metrics={[
 *     { key: 'shares', label: 'Shares', color: '#3b82f6', type: 'line' },
 *     { key: 'avgReward', label: 'Avg Reward', color: '#10b981', type: 'area' }
 *   ]}
 *   height={400}
 * />
 */
export const TimeSeriesChart: React.FC<TimeSeriesChartProps> = ({
  data,
  title = 'Time Series Data',
  metrics,
  height = 400,
  showLegend = true,
  showGrid = true,
  loading = false,
  onDateClick,
}) => {
  if (loading || !data || data.length === 0) {
    return (
      <Container>
        {title && <Title>{title}</Title>}
        <ChartContainer height={height}>
          <LoadingMessage>
            {loading ? 'Loading data...' : 'No data available'}
          </LoadingMessage>
        </ChartContainer>
      </Container>
    )
  }

  // Determine if we need a ComposedChart (mixed types) or single chart type
  const hasMultipleTypes = metrics.some(m => m.type) && new Set(metrics.map(m => m.type)).size > 1
  const firstType = metrics[0]?.type || 'line'

  const customTooltipComponent = (props: any) => {
    const { active, payload } = props
    if (active && payload && payload.length) {
      return (
        <CustomTooltip>
          <p style={{ margin: '0 0 8px 0', fontWeight: 600 }}>
            {payload[0]?.payload.displayDate || payload[0]?.payload.date}
          </p>
          {payload.map((item: any, index: number) => (
            <p key={index} style={{ margin: '4px 0', color: item.color }}>
              {item.name}: {typeof item.value === 'number' ? item.value.toFixed(2) : item.value}
            </p>
          ))}
        </CustomTooltip>
      )
    }
    return null
  }

  const renderChart = () => {
    const commonProps = {
      data,
      margin: { top: 5, right: 30, left: 0, bottom: 5 },
    }

    if (hasMultipleTypes) {
      // ComposedChart for mixed metrics
      return (
        <ResponsiveContainer width="100%" height={height}>
          <ComposedChart {...commonProps}>
            {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />}
            <XAxis dataKey="displayDate" dataKey2="date" angle={-45} textAnchor="end" height={100} />
            <YAxis />
            <Tooltip content={customTooltipComponent} />
            {showLegend && <Legend />}
            {metrics.map((metric) => {
              switch (metric.type) {
                case 'bar':
                  return <Bar key={metric.key} dataKey={metric.key} fill={metric.color} name={metric.label} />
                case 'area':
                  return (
                    <Area
                      key={metric.key}
                      type="monotone"
                      dataKey={metric.key}
                      fill={metric.color}
                      stroke={metric.color}
                      fillOpacity={0.3}
                      name={metric.label}
                    />
                  )
                case 'line':
                default:
                  return (
                    <Line
                      key={metric.key}
                      type="monotone"
                      dataKey={metric.key}
                      stroke={metric.color}
                      strokeWidth={2}
                      dot={{ fill: metric.color, r: 4 }}
                      activeDot={{ r: 6 }}
                      name={metric.label}
                    />
                  )
              }
            })}
          </ComposedChart>
        </ResponsiveContainer>
      )
    } else if (firstType === 'bar') {
      // BarChart for bar metrics
      return (
        <ResponsiveContainer width="100%" height={height}>
          <BarChart {...commonProps}>
            {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />}
            <XAxis dataKey="displayDate" angle={-45} textAnchor="end" height={100} />
            <YAxis />
            <Tooltip content={customTooltipComponent} />
            {showLegend && <Legend />}
            {metrics.map((metric) => (
              <Bar key={metric.key} dataKey={metric.key} fill={metric.color} name={metric.label} />
            ))}
          </BarChart>
        </ResponsiveContainer>
      )
    } else if (firstType === 'area') {
      // AreaChart for area metrics
      return (
        <ResponsiveContainer width="100%" height={height}>
          <AreaChart {...commonProps}>
            {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />}
            <XAxis dataKey="displayDate" angle={-45} textAnchor="end" height={100} />
            <YAxis />
            <Tooltip content={customTooltipComponent} />
            {showLegend && <Legend />}
            {metrics.map((metric) => (
              <Area
                key={metric.key}
                type="monotone"
                dataKey={metric.key}
                fill={metric.color}
                stroke={metric.color}
                fillOpacity={0.3}
                name={metric.label}
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      )
    } else {
      // LineChart for line metrics
      return (
        <ResponsiveContainer width="100%" height={height}>
          <LineChart {...commonProps}>
            {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />}
            <XAxis dataKey="displayDate" angle={-45} textAnchor="end" height={100} />
            <YAxis />
            <Tooltip content={customTooltipComponent} />
            {showLegend && <Legend />}
            {metrics.map((metric) => (
              <Line
                key={metric.key}
                type="monotone"
                dataKey={metric.key}
                stroke={metric.color}
                strokeWidth={2}
                dot={{ fill: metric.color, r: 4 }}
                activeDot={{ r: 6 }}
                name={metric.label}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      )
    }
  }

  return (
    <Container>
      {title && <Title>{title}</Title>}
      <ChartContainer height={height}>{renderChart()}</ChartContainer>
    </Container>
  )
}

export default TimeSeriesChart
