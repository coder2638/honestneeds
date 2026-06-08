'use client'

import React from 'react'
import styled from 'styled-components'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts'
import { TrendingUp, TrendingDown } from 'lucide-react'

interface ChannelData {
  channel: string
  spend: number
  revenue: number
  roi: number
  impressions: number
  clicks: number
  conversions: number
}

interface ChannelROIChartProps {
  data: ChannelData[]
  title?: string
  height?: number
  loading?: boolean
  currencySymbol?: string
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
  margin-bottom: 20px;
`

const LoadingMessage = styled.div`
  text-align: center;
  color: #6b7280;
  font-size: 14px;
`

const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-top: 20px;
`

const MetricCard = styled.div`
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 16px;
`

const MetricChannelName = styled.p`
  font-size: 12px;
  color: #6b7280;
  font-weight: 600;
  margin: 0 0 8px 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`

const MetricValue = styled.p`
  font-size: 24px;
  font-weight: 700;
  color: #111827;
  margin: 0 0 4px 0;
`

const MetricLabel = styled.p`
  font-size: 12px;
  color: #6b7280;
  margin: 0;
`

const DetailedTable = styled.div`
  margin-top: 20px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  overflow: hidden;
`

const TableRow = styled.div<{ isHeader?: boolean }>`
  display: grid;
  grid-template-columns: 100px 100px 80px 90px 90px 90px 80px;
  border-bottom: 1px solid #e5e7eb;
  background: ${(props) => (props.isHeader ? '#f9fafb' : 'white')};

  &:last-child {
    border-bottom: none;
  }
`

const TableCell = styled.div<{ isHeader?: boolean }>`
  padding: 12px;
  font-size: 12px;
  font-weight: ${(props) => (props.isHeader ? 600 : 400)};
  color: ${(props) => (props.isHeader ? '#374151' : '#6b7280')};
  border-right: 1px solid #e5e7eb;
  text-transform: ${(props) => (props.isHeader ? 'uppercase' : 'none')};
  letter-spacing: ${(props) => (props.isHeader ? '0.5px' : 'normal')};

  &:last-child {
    border-right: none;
  }
`

const ROIValue = styled.span<{ positive: boolean }>`
  color: ${(props) => (props.positive ? '#16a34a' : '#dc2626')};
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 4px;
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

const getROIColor = (roi: number): string => {
  if (roi >= 300) return '#15803d'
  if (roi >= 200) return '#0369a1'
  if (roi >= 100) return '#92400e'
  return '#991b1b'
}

const getMetricsForChannel = (channel: ChannelData, currencySymbol: string) => [
  {
    label: 'Spend',
    value: `${currencySymbol}${channel.spend.toFixed(0)}`,
  },
  {
    label: 'Revenue',
    value: `${currencySymbol}${channel.revenue.toFixed(0)}`,
  },
  {
    label: 'ROI',
    value: `${channel.roi.toFixed(0)}%`,
    highlight: true,
  },
]

/**
 * ChannelROIChart Component
 * Displays ROI metrics across different marketing channels
 * 
 * @example
 * <ChannelROIChart
 *   data={channelMetrics}
 *   title="Channel Performance & ROI Analysis"
 *   currencySymbol="$"
 * />
 */
export const ChannelROIChart: React.FC<ChannelROIChartProps> = ({
  data,
  title = 'Channel ROI Analysis',
  height = 400,
  loading = false,
  currencySymbol = '$',
}) => {
  if (loading || !data || data.length === 0) {
    return (
      <Container>
        {title && <Title>{title}</Title>}
        <ChartContainer>
          <LoadingMessage>
            {loading ? 'Loading channel data...' : 'No data available'}
          </LoadingMessage>
        </ChartContainer>
      </Container>
    )
  }

  // Sort by ROI descending
  const sortedData = [...data].sort((a, b) => b.roi - a.roi)
  const maxROI = Math.max(...sortedData.map((d) => d.roi))

  const customTooltipComponent = (props: any) => {
    const { active, payload } = props
    if (active && payload && payload.length) {
      const channel = payload[0]?.payload
      return (
        <CustomTooltip>
          <p style={{ margin: '0 0 8px 0', fontWeight: 600 }}>
            {channel.channel}
          </p>
          <p style={{ margin: '4px 0' }}>Spend: {currencySymbol}{channel.spend.toFixed(0)}</p>
          <p style={{ margin: '4px 0' }}>Revenue: {currencySymbol}{channel.revenue.toFixed(0)}</p>
          <p style={{ margin: '4px 0', fontWeight: 600, color: '#16a34a' }}>ROI: {channel.roi.toFixed(0)}%</p>
          <p style={{ margin: '4px 0 0 0', fontSize: '11px' }}>Conversions: {channel.conversions}</p>
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
          <Subtitle>Compare spending efficiency and returns across channels</Subtitle>
        </>
      )}

      <ChartContainer>
        <ResponsiveContainer width="100%" height={height}>
          <BarChart data={sortedData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="channel" angle={-45} textAnchor="end" height={100} />
            <YAxis yAxisId="left" label={{ value: 'ROI (%)', angle: -90, position: 'insideLeft' }} />
            <YAxis yAxisId="right" orientation="right" label={{ value: 'Spend ($)', angle: 90, position: 'insideRight' }} />
            <Tooltip content={customTooltipComponent} />
            <Legend />
            <Bar yAxisId="left" dataKey="roi" fill="#8b5cf6" name="ROI %" radius={[8, 8, 0, 0]}>
              {sortedData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getROIColor(entry.roi)} />
              ))}
            </Bar>
            <Bar yAxisId="right" dataKey="spend" fill="#d1d5db" name="Spend ($)" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>

      {/* Top Channel Metrics */}
      <MetricsGrid>
        {sortedData.slice(0, 3).map((channel, idx) => (
          <MetricCard key={idx}>
            <MetricChannelName>{channel.channel}</MetricChannelName>
            {getMetricsForChannel(channel, currencySymbol).map((metric, mIdx) => (
              <div key={mIdx}>
                <MetricValue style={{ color: metric.highlight ? getROIColor(channel.roi) : '#111827' }}>
                  {metric.value}
                </MetricValue>
                <MetricLabel>{metric.label}</MetricLabel>
              </div>
            ))}
          </MetricCard>
        ))}
      </MetricsGrid>

      {/* Detailed Performance Table */}
      <DetailedTable>
        <TableRow isHeader>
          <TableCell isHeader>Channel</TableCell>
          <TableCell isHeader>Spend</TableCell>
          <TableCell isHeader>Revenue</TableCell>
          <TableCell isHeader>ROI</TableCell>
          <TableCell isHeader>Impressions</TableCell>
          <TableCell isHeader>Clicks</TableCell>
          <TableCell isHeader>Conversions</TableCell>
        </TableRow>

        {sortedData.map((channel, idx) => (
          <TableRow key={idx}>
            <TableCell>{channel.channel}</TableCell>
            <TableCell>{currencySymbol}{channel.spend.toFixed(0)}</TableCell>
            <TableCell>{currencySymbol}{channel.revenue.toFixed(0)}</TableCell>
            <TableCell>
              <ROIValue positive={channel.roi > 0}>
                {channel.roi > 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                {channel.roi.toFixed(0)}%
              </ROIValue>
            </TableCell>
            <TableCell>{channel.impressions.toLocaleString()}</TableCell>
            <TableCell>{channel.clicks.toLocaleString()}</TableCell>
            <TableCell>{channel.conversions.toLocaleString()}</TableCell>
          </TableRow>
        ))}
      </DetailedTable>
    </Container>
  )
}

export default ChannelROIChart
