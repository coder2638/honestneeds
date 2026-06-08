'use client'

import React from 'react'
import styled from 'styled-components'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts'

interface PeriodComparisonData {
  period: string
  [key: string]: string | number
}

interface PeriodComparisonChartProps {
  data: PeriodComparisonData[]
  title?: string
  periods: {
    key: string
    label: string
    color: string
  }[]
  height?: number
  loading?: boolean
  bestIndicator?: boolean
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
`

const LoadingMessage = styled.div`
  text-align: center;
  color: #6b7280;
  font-size: 14px;
`

const ComparisonTable = styled.div`
  margin-top: 20px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  overflow: hidden;
`

const TableRow = styled.div<{ isHeader?: boolean }>`
  display: grid;
  grid-template-columns: 120px repeat(auto-fit, minmax(120px, 1fr));
  border-bottom: 1px solid #e5e7eb;
  background: ${(props) => (props.isHeader ? '#f9fafb' : 'white')};

  &:last-child {
    border-bottom: none;
  }
`

const TableCell = styled.div<{ isHeader?: boolean; align?: string }>`
  padding: 12px;
  font-size: 13px;
  font-weight: ${(props) => (props.isHeader ? 600 : 400)};
  color: ${(props) => (props.isHeader ? '#374151' : '#6b7280')};
  text-align: ${(props) => props.align || 'left'};
  border-right: 1px solid #e5e7eb;
  text-transform: ${(props) => (props.isHeader ? 'uppercase' : 'none')};
  letter-spacing: ${(props) => (props.isHeader ? '0.5px' : 'normal')};
  white-space: nowrap;

  &:last-child {
    border-right: none;
  }
`

const BestValueBadge = styled.span`
  background: #dcfce7;
  color: #15803d;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 600;
  margin-left: 4px;
`

const ChangeIndicator = styled.span<{ positive: boolean }>`
  color: ${(props) => (props.positive ? '#16a34a' : '#dc2626')};
  font-weight: 600;
  margin-left: 4px;
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
 * PeriodComparisonChart Component
 * Compares metrics across different time periods (WoW, MoM, YoY)
 * 
 * @example
 * <PeriodComparisonChart
 *   data={monthlyComparison}
 *   title="Monthly Performance Comparison"
 *   periods={[
 *     { key: 'thisMonth', label: 'This Month', color: '#3b82f6' },
 *     { key: 'lastMonth', label: 'Last Month', color: '#9ca3af' }
 *   ]}
 *   bestIndicator
 * />
 */
export const PeriodComparisonChart: React.FC<PeriodComparisonChartProps> = ({
  data,
  title = 'Period Comparison',
  periods,
  height = 400,
  loading = false,
  bestIndicator = true,
}) => {
  if (loading || !data || data.length === 0) {
    return (
      <Container>
        {title && <Title>{title}</Title>}
        <ChartContainer>
          <LoadingMessage>
            {loading ? 'Loading comparison data...' : 'No data available'}
          </LoadingMessage>
        </ChartContainer>
      </Container>
    )
  }

  const customTooltipComponent = (props: any) => {
    const { active, payload } = props
    if (active && payload && payload.length) {
      return (
        <CustomTooltip>
          <p style={{ margin: '0 0 8px 0', fontWeight: 600 }}>
            {payload[0]?.payload.period}
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

  // Find best value for each period for highlighting
  const bestValues = periods.reduce(
    (acc, period) => ({
      ...acc,
      [period.key]: Math.max(...data.map((d) => Number(d[period.key]) || 0)),
    }),
    {} as Record<string, number>
  )

  return (
    <Container>
      {title && (
        <>
          <Title>{title}</Title>
          <Subtitle>Compare key metrics across different time periods</Subtitle>
        </>
      )}

      <ChartContainer>
        <ResponsiveContainer width="100%" height={height}>
          <BarChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="period" angle={-45} textAnchor="end" height={100} />
            <YAxis />
            <Tooltip content={customTooltipComponent} />
            <Legend />
            {periods.map((period) => (
              <Bar
                key={period.key}
                dataKey={period.key}
                fill={period.color}
                name={period.label}
                radius={[8, 8, 0, 0]}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>

      {/* Detailed Comparison Table */}
      <ComparisonTable>
        <TableRow isHeader>
          <TableCell isHeader>Period</TableCell>
          {periods.map((period) => (
            <TableCell key={period.key} isHeader align="right">
              {period.label}
            </TableCell>
          ))}
        </TableRow>

        {data.map((row, idx) => (
          <TableRow key={idx}>
            <TableCell>{row.period}</TableCell>
            {periods.map((period) => {
              const value = Number(row[period.key]) || 0
              const isBest = bestIndicator && value === bestValues[period.key]
              const previousPeriod = idx > 0 ? Number(data[idx - 1][period.key]) || 0 : value
              const percentChange = previousPeriod !== 0 ? ((value - previousPeriod) / previousPeriod) * 100 : 0

              return (
                <TableCell key={`${idx}-${period.key}`} align="right">
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                    <span>{value.toFixed(0)}</span>
                    {isBest && <BestValueBadge>BEST</BestValueBadge>}
                    {idx > 0 && (
                      <ChangeIndicator positive={percentChange > 0}>
                        {percentChange > 0 ? '+' : ''}
                        {percentChange.toFixed(1)}%
                      </ChangeIndicator>
                    )}
                  </div>
                </TableCell>
              )
            })}
          </TableRow>
        ))}
      </ComparisonTable>
    </Container>
  )
}

export default PeriodComparisonChart
