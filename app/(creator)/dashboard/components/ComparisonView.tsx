'use client'

import React, { useState, useMemo } from 'react'
import styled from 'styled-components'
import { Download, ChevronUp, ChevronDown } from 'lucide-react'

interface CampaignMetrics {
  id: string
  title: string
  raised: number
  goal: number
  donors: number
  status: string
  created_at: string
}

interface ComparisonViewProps {
  campaigns: CampaignMetrics[]
  onSelectCampaign?: (id: string) => void
  selectedIds?: string[]
}

type SortField = 'title' | 'raised' | 'goal' | 'progress' | 'donors'
type SortOrder = 'asc' | 'desc'

const ComparisonContainer = styled.div`
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow-x: auto;
`

const ComparisonHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 12px;
    align-items: flex-start;
  }
`

const Title = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: #111827;
  margin: 0;
`

const Controls = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;

  @media (max-width: 768px) {
    width: 100%;
    flex-wrap: wrap;
  }
`

const Button = styled.button`
  padding: 8px 16px;
  border-radius: 8px;
  border: 1px solid #d1d5db;
  background: white;
  color: #374151;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 6px;

  &:hover {
    background: #f3f4f6;
    border-color: #9ca3af;
  }

  &:active {
    transform: scale(0.98);
  }
`

const TableWrapper = styled.div`
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;

  &::-webkit-scrollbar {
    height: 6px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f5f9;
    border-radius: 10px;
  }

  &::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 10px;

    &:hover {
      background: #94a3b8;
    }
  }
`

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  min-width: 800px;

  thead {
    background: #f9fafb;
    border-bottom: 2px solid #e5e7eb;
  }

  th {
    padding: 12px;
    text-align: left;
    font-size: 12px;
    font-weight: 600;
    color: #6b7280;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    cursor: pointer;
    user-select: none;

    &:hover {
      background: #f3f4f6;
    }
  }

  td {
    padding: 12px;
    border-bottom: 1px solid #e5e7eb;
    font-size: 14px;
  }

  tbody tr {
    transition: all 0.2s ease;

    &:hover {
      background: #f9fafb;
    }

    &:last-child td {
      border-bottom: none;
    }
  }
`

const CampaignName = styled.div`
  font-weight: 600;
  color: #111827;
  max-width: 200px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  @media (max-width: 640px) {
    max-width: 150px;
  }
`

const StatusBadge = styled.span<{ status: string }>`
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  background: ${(props) => {
    switch (props.status) {
      case 'active':
        return '#dcfce7'
      case 'completed':
        return '#dbeafe'
      case 'paused':
        return '#fef3c7'
      case 'draft':
        return '#f3f4f6'
      default:
        return '#e5e7eb'
    }
  }};
  color: ${(props) => {
    switch (props.status) {
      case 'active':
        return '#166534'
      case 'completed':
        return '#1e40af'
      case 'paused':
        return '#92400e'
      case 'draft':
        return '#4b5563'
      default:
        return '#6b7280'
    }
  }};
`

const ProgressBar = styled.div`
  width: 100%;
  height: 6px;
  background: #e5e7eb;
  border-radius: 3px;
  overflow: hidden;
  margin-top: 4px;
`

const ProgressFill = styled.div<{ percentage: number }>`
  height: 100%;
  width: ${(props) => props.percentage}%;
  background: ${(props) => {
    if (props.percentage >= 100) return '#10b981'
    if (props.percentage >= 75) return '#3b82f6'
    if (props.percentage >= 50) return '#f59e0b'
    return '#ef4444'
  }};
  transition: width 0.3s ease;
`

const MetricValue = styled.div`
  font-weight: 600;
  color: #111827;
`

const MetricSubtext = styled.div`
  font-size: 12px;
  color: #9ca3af;
`

const SortIndicator = styled.span`
  display: inline-flex;
  margin-left: 6px;
  opacity: 0.5;
`

const TopPerformer = styled.div<{ highlight?: boolean }>`
  ${(props) =>
    props.highlight &&
    `
    background: linear-gradient(135deg, #fef3c7 0%, #fef08a 100%);
    border-left: 3px solid #fbbf24;
    padding-left: 9px;
  `}
`

const EmptyState = styled.div`
  text-align: center;
  padding: 40px 20px;
  color: #9ca3af;
`

export const ComparisonView: React.FC<ComparisonViewProps> = ({
  campaigns,
  onSelectCampaign,
  selectedIds = [],
}) => {
  const [sortField, setSortField] = useState<SortField>('raised')
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc')

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortOrder('desc')
    }
  }

  const sortedCampaigns = useMemo(() => {
    const sorted = [...campaigns].sort((a, b) => {
      let aVal: number | string = 0
      let bVal: number | string = 0

      switch (sortField) {
        case 'title':
          aVal = a.title
          bVal = b.title
          break
        case 'raised':
          aVal = a.raised
          bVal = b.raised
          break
        case 'goal':
          aVal = a.goal
          bVal = b.goal
          break
        case 'progress':
          aVal = a.goal > 0 ? (a.raised / a.goal) * 100 : 0
          bVal = b.goal > 0 ? (b.raised / b.goal) * 100 : 0
          break
        case 'donors':
          aVal = a.donors
          bVal = b.donors
          break
        default:
          return 0
      }

      if (typeof aVal === 'string') {
        return sortOrder === 'asc'
          ? aVal.localeCompare(bVal as string)
          : (bVal as string).localeCompare(aVal)
      }

      return sortOrder === 'asc' ? (aVal as number) - (bVal as number) : (bVal as number) - (aVal as number)
    })

    return sorted
  }, [campaigns, sortField, sortOrder])

  const topRaiser = sortedCampaigns[0]

  const handleExport = () => {
    const csv = [
      ['Campaign', 'Status', 'Raised', 'Goal', 'Progress', 'Donors'],
      ...sortedCampaigns.map((c) => [
        c.title,
        c.status,
        `$${((c.raised ?? 0) / 100).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        `$${((c.goal ?? 0) / 100).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        `${((c.goal > 0 ? ((c.raised || 0) / c.goal) * 100 : 0)).toFixed(1)}%`,
        c.donors,
      ]),
    ]
      .map((row) => row.map((cell) => `"${cell}"`).join(','))
      .join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'campaigns-comparison.csv'
    a.click()
  }

  if (campaigns.length === 0) {
    return (
      <ComparisonContainer>
        <ComparisonHeader>
          <Title>Campaign Comparison</Title>
        </ComparisonHeader>
        <EmptyState>
          <div style={{ fontSize: '32px', marginBottom: '12px' }}>📊</div>
          <p>No campaigns to compare. Create some campaigns to get started!</p>
        </EmptyState>
      </ComparisonContainer>
    )
  }

  return (
    <ComparisonContainer>
      <ComparisonHeader>
        <Title>Campaign Comparison ({sortedCampaigns.length})</Title>
        <Controls>
          <Button onClick={handleExport}>
            <Download size={16} />
            Export CSV
          </Button>
        </Controls>
      </ComparisonHeader>

      <TableWrapper>
        <Table>
          <thead>
            <tr>
              <th onClick={() => handleSort('title')}>
                Campaign
                <SortIndicator>
                  {sortField === 'title' && (sortOrder === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
                </SortIndicator>
              </th>
              <th>Status</th>
              <th onClick={() => handleSort('raised')}>
                Raised
                <SortIndicator>
                  {sortField === 'raised' && (sortOrder === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
                </SortIndicator>
              </th>
              <th onClick={() => handleSort('goal')}>
                Goal
                <SortIndicator>
                  {sortField === 'goal' && (sortOrder === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
                </SortIndicator>
              </th>
              <th onClick={() => handleSort('progress')}>
                Progress
                <SortIndicator>
                  {sortField === 'progress' && (sortOrder === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
                </SortIndicator>
              </th>
              <th onClick={() => handleSort('donors')}>
                Donors
                <SortIndicator>
                  {sortField === 'donors' && (sortOrder === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
                </SortIndicator>
              </th>
              <th>ROI</th>
            </tr>
          </thead>
          <tbody>
            {sortedCampaigns.map((campaign) => {
              const progress = campaign.goal > 0 ? (campaign.raised / campaign.goal) * 100 : 0
              const roi = ((campaign.raised - campaign.goal) / campaign.goal) * 100
              const isTopPerformer = campaign.id === topRaiser.id

              return (
                <tr
                  key={campaign.id}
                  onClick={() => onSelectCampaign?.(campaign.id)}
                  style={{ cursor: 'pointer' }}
                >
                  <td>
                    <TopPerformer highlight={isTopPerformer}>
                      <CampaignName title={campaign.title}>
                        {isTopPerformer && '⭐ '}{campaign.title}
                      </CampaignName>
                    </TopPerformer>
                  </td>
                  <td>
                    <StatusBadge status={campaign.status}>
                      {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                    </StatusBadge>
                  </td>
                  <td>
                    <MetricValue>${((campaign.raised ?? 0) / 100).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</MetricValue>
                  </td>
                  <td>
                    <MetricValue>${((campaign.goal ?? 0) / 100).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</MetricValue>
                  </td>
                  <td>
                    <MetricValue>{progress.toFixed(1)}%</MetricValue>
                    <ProgressBar>
                      <ProgressFill percentage={Math.min(progress, 100)} />
                    </ProgressBar>
                  </td>
                  <td>
                    <MetricValue>{campaign.donors}</MetricValue>
                  </td>
                  <td>
                    <MetricValue style={{ color: roi >= 0 ? '#10b981' : '#ef4444' }}>
                      {roi >= 0 ? '+' : ''}{roi.toFixed(1)}%
                    </MetricValue>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </Table>
      </TableWrapper>
    </ComparisonContainer>
  )
}

export default ComparisonView
