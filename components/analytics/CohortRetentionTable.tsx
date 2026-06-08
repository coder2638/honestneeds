'use client'

import React, { useMemo } from 'react'
import styled from 'styled-components'

interface CohortData {
  cohort: string
  cohortSize: number
  retention: {
    day: number
    rate: number
    count: number
  }[]
}

interface CohortRetentionTableProps {
  data: CohortData[]
  title?: string
  loading?: boolean
  onCohortClick?: (cohort: string) => void
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

const TableWrapper = styled.div`
  overflow-x: auto;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
`

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
`

const HeaderCell = styled.th`
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  padding: 12px;
  text-align: left;
  font-weight: 600;
  color: #374151;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  white-space: nowrap;

  &:first-child {
    position: sticky;
    left: 0;
    z-index: 10;
    background: #f3f4f6;
  }
`

const BodyCell = styled.td<{ isRetention?: boolean }>`
  border: 1px solid #e5e7eb;
  padding: 12px;
  color: ${(props) => (props.isRetention ? '#374151' : '#6b7280')};
  font-weight: ${(props) => (props.isRetention ? 600 : 400)};
  white-space: nowrap;

  &:first-child {
    position: sticky;
    left: 0;
    background: #f9fafb;
    z-index: 5;
    font-weight: 600;
    cursor: pointer;
    &:hover {
      background: #f3f4f6;
    }
  }
`

const RetentionCell = styled.td<{ rate: number }>`
  border: 1px solid #e5e7eb;
  padding: 12px;
  text-align: center;
  font-weight: 600;
  background-color: ${(props) => {
    if (props.rate >= 80) return '#dcfce7'
    if (props.rate >= 60) return '#dbeafe'
    if (props.rate >= 40) return '#fef3c7'
    return '#fee2e2'
  }};
  color: ${(props) => {
    if (props.rate >= 80) return '#15803d'
    if (props.rate >= 60) return '#0369a1'
    if (props.rate >= 40) return '#92400e'
    return '#991b1b'
  }};
  white-space: nowrap;
`

const LoadingMessage = styled.div`
  text-align: center;
  color: #6b7280;
  font-size: 14px;
  padding: 32px;
`

const Legend = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 16px;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #e5e7eb;
`

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
`

const LegendColor = styled.div<{ color: string }>`
  width: 16px;
  height: 16px;
  border-radius: 4px;
  background-color: ${(props) => props.color};
`

/**
 * CohortRetentionTable Component
 * Displays cohort analysis with retention rates over time
 * 
 * @example
 * <CohortRetentionTable
 *   data={cohortData}
 *   title="User Cohort Retention Analysis"
 *   onCohortClick={(cohort) => console.log(cohort)}
 * />
 */
export const CohortRetentionTable: React.FC<CohortRetentionTableProps> = ({
  data,
  title = 'Cohort Retention Analysis',
  loading = false,
  onCohortClick,
}) => {
  // Get all unique retention days from the data
  const allRetentionDays = useMemo(() => {
    const days = new Set<number>()
    data.forEach((cohort) => {
      cohort.retention.forEach((ret) => {
        days.add(ret.day)
      })
    })
    return Array.from(days).sort((a, b) => a - b)
  }, [data])

  if (loading || !data || data.length === 0) {
    return (
      <Container>
        {title && <Title>{title}</Title>}
        <LoadingMessage>
          {loading ? 'Loading cohort data...' : 'No cohort data available'}
        </LoadingMessage>
      </Container>
    )
  }

  const getRetentionRate = (cohort: CohortData, day: number): number | null => {
    const retention = cohort.retention.find((r) => r.day === day)
    return retention ? retention.rate : null
  }

  const getRetentionCount = (cohort: CohortData, day: number): number | null => {
    const retention = cohort.retention.find((r) => r.day === day)
    return retention ? retention.count : null
  }

  return (
    <Container>
      {title && <Title>{title}</Title>}

      <TableWrapper>
        <Table>
          <thead>
            <tr>
              <HeaderCell>Cohort</HeaderCell>
              <HeaderCell>Size</HeaderCell>
              {allRetentionDays.map((day) => (
                <HeaderCell key={day}>Day {day}</HeaderCell>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((cohort) => (
              <tr key={cohort.cohort}>
                <BodyCell onClick={() => onCohortClick?.(cohort.cohort)}>
                  {cohort.cohort}
                </BodyCell>
                <BodyCell>{cohort.cohortSize.toLocaleString()}</BodyCell>
                {allRetentionDays.map((day) => {
                  const rate = getRetentionRate(cohort, day)
                  const count = getRetentionCount(cohort, day)

                  if (rate === null) {
                    return <BodyCell key={`${cohort.cohort}-${day}`}>-</BodyCell>
                  }

                  return (
                    <RetentionCell key={`${cohort.cohort}-${day}`} rate={rate}>
                      {rate.toFixed(1)}%
                      <br />
                      <span style={{ fontSize: '11px', fontWeight: 400, opacity: 0.8 }}>
                        ({count?.toLocaleString()})
                      </span>
                    </RetentionCell>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </Table>
      </TableWrapper>

      <Legend>
        <LegendItem>
          <LegendColor color="#dcfce7" />
          <span>&ge; 80% retention</span>
        </LegendItem>
        <LegendItem>
          <LegendColor color="#dbeafe" />
          <span>60-79% retention</span>
        </LegendItem>
        <LegendItem>
          <LegendColor color="#fef3c7" />
          <span>40-59% retention</span>
        </LegendItem>
        <LegendItem>
          <LegendColor color="#fee2e2" />
          <span>&lt; 40% retention</span>
        </LegendItem>
      </Legend>
    </Container>
  )
}

export default CohortRetentionTable
