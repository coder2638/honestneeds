'use client'

import React, { useMemo } from 'react'
import styled from 'styled-components'

interface HeatmapData {
  day: string
  hour?: number
  [key: string]: any
}

interface SeasonalHeatmapProps {
  data: HeatmapData[]
  title?: string
  valueKey?: string
  xAxisKey?: string
  yAxisKey?: string
  loading?: boolean
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

const HeatmapContainer = styled.div`
  display: flex;
  gap: 20px;
  overflow-x: auto;
  padding: 16px 0;
`

const HeatmapGridContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

const HeatmapRow = styled.div`
  display: flex;
  gap: 4px;
  align-items: center;
`

const YAxisLabel = styled.div`
  width: 60px;
  text-align: right;
  font-size: 12px;
  font-weight: 500;
  color: #6b7280;
  white-space: nowrap;
`

const Cell = styled.div<{ intensity: number }>`
  width: 40px;
  height: 40px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  background-color: ${(props) => {
    const intensity = Math.max(0, Math.min(1, props.intensity))
    const hue = 120 - intensity * 120 // Green to Red
    const lightness = 100 - intensity * 40 // Light to Dark
    return `hsl(${hue}, 90%, ${lightness}%)`
  }};
  color: ${(props) => (props.intensity > 0.6 ? 'white' : '#374151')};

  &:hover {
    transform: scale(1.1);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
    z-index: 10;
  }
`

const XAxisContainer = styled.div`
  display: flex;
  gap: 4px;
  margin-left: 60px;
  padding-top: 8px;
`

const XAxisLabel = styled.div`
  width: 40px;
  text-align: center;
  font-size: 11px;
  font-weight: 500;
  color: #6b7280;
  white-space: nowrap;
`

const Legend = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px solid #e5e7eb;
  flex-wrap: wrap;
`

const LegendLabel = styled.div`
  font-size: 12px;
  color: #6b7280;
  font-weight: 500;
`

const LegendGradient = styled.div`
  display: flex;
  gap: 2px;
  height: 20px;
  border-radius: 4px;
  overflow: hidden;
`

const LegendCell = styled.div<{ intensity: number }>`
  flex: 1;
  background-color: ${(props) => {
    const intensity = Math.max(0, Math.min(1, props.intensity))
    const hue = 120 - intensity * 120
    const lightness = 100 - intensity * 40
    return `hsl(${hue}, 90%, ${lightness}%)`
  }};
`

const LoadingMessage = styled.div`
  text-align: center;
  color: #6b7280;
  font-size: 14px;
  padding: 32px;
`

const Tooltip = styled.div`
  background: #111827;
  color: white;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 12px;
  position: absolute;
  z-index: 1000;
  pointer-events: none;
  white-space: nowrap;
`

/**
 * SeasonalHeatmap Component
 * Displays intensity patterns across days/hours in a heatmap format
 * Useful for identifying peak performance times
 * 
 * @example
 * <SeasonalHeatmap
 *   data={dayOfWeekData}
 *   title="Share Activity by Day and Hour"
 *   valueKey="shares"
 *   xAxisKey="hour"
 *   yAxisKey="day"
 * />
 */
export const SeasonalHeatmap: React.FC<SeasonalHeatmapProps> = ({
  data,
  title = 'Activity Heatmap',
  valueKey = 'value',
  xAxisKey = 'hour',
  yAxisKey = 'day',
  loading = false,
}) => {
  const { heatmapMatrix, yLabels, xLabels, maxValue, minValue } = useMemo(() => {
    if (!data || data.length === 0) {
      return { heatmapMatrix: [], yLabels: [], xLabels: [], maxValue: 0, minValue: 0 }
    }

    // Group data by Y and X axis
    const grouped = new Map<string, Map<string, number>>()
    let max = 0
    let min = Infinity

    data.forEach((row) => {
      const yVal = String(row[yAxisKey])
      const xVal = String(row[xAxisKey])
      const cellValue = Number(row[valueKey]) || 0

      if (!grouped.has(yVal)) {
        grouped.set(yVal, new Map())
      }
      grouped.get(yVal)!.set(xVal, cellValue)

      max = Math.max(max, cellValue)
      min = Math.min(min, cellValue)
    })

    const yLabels = Array.from(grouped.keys()).sort()
    const xLabels = Array.from(
      new Set(data.map((row) => String(row[xAxisKey])))
    ).sort((a, b) => {
      const aNum = parseInt(a)
      const bNum = parseInt(b)
      return isNaN(aNum) || isNaN(bNum) ? a.localeCompare(b) : aNum - bNum
    })

    const matrix = yLabels.map((yLabel) => {
      const row = grouped.get(yLabel) || new Map()
      return xLabels.map((xLabel) => row.get(xLabel) || 0)
    })

    return {
      heatmapMatrix: matrix,
      yLabels,
      xLabels,
      maxValue: max,
      minValue: min === Infinity ? 0 : min,
    }
  }, [data, valueKey, xAxisKey, yAxisKey])

  if (loading || !data || data.length === 0) {
    return (
      <Container>
        {title && <Title>{title}</Title>}
        <LoadingMessage>
          {loading ? 'Loading heatmap data...' : 'No data available'}
        </LoadingMessage>
      </Container>
    )
  }

  const normalize = (value: number) => {
    if (maxValue === minValue) return 0.5
    return (value - minValue) / (maxValue - minValue)
  }

  return (
    <Container>
      {title && <Title>{title}</Title>}

      <HeatmapContainer>
        <HeatmapGridContainer>
          {heatmapMatrix.map((row, yIdx) => (
            <HeatmapRow key={yIdx}>
              <YAxisLabel>{yLabels[yIdx]}</YAxisLabel>
              {row.map((value, xIdx) => (
                <Cell key={`${yIdx}-${xIdx}`} intensity={normalize(value)} title={`${value}`}>
                  {value > 0 && value <= 999 ? value : ''}
                </Cell>
              ))}
            </HeatmapRow>
          ))}

          <HeatmapRow>
            <YAxisLabel />
            <XAxisContainer>
              {xLabels.map((label) => (
                <XAxisLabel key={label}>{label}</XAxisLabel>
              ))}
            </XAxisContainer>
          </HeatmapRow>
        </HeatmapGridContainer>
      </HeatmapContainer>

      <Legend>
        <LegendLabel>Intensity Scale:</LegendLabel>
        <LegendGradient>
          <LegendCell intensity={0} />
          <LegendCell intensity={0.25} />
          <LegendCell intensity={0.5} />
          <LegendCell intensity={0.75} />
          <LegendCell intensity={1} />
        </LegendGradient>
        <LegendLabel>Low {minValue}</LegendLabel>
        <LegendLabel>High {maxValue}</LegendLabel>
      </Legend>
    </Container>
  )
}

export default SeasonalHeatmap
