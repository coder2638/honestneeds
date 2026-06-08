'use client'

import React, { useState } from 'react'
import styled from 'styled-components'
import { Download, RefreshCw, BarChart3 } from 'lucide-react'
import { useComplianceReport, useExportPrayers } from '@/api/hooks/useAdminPrayers'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import { Button } from '@/components/Button'
import { Card } from '@/components/Card'

/**
 * Admin Prayer Compliance Report
 * Compliance metrics, export, and audit trails
 */

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
`

const Title = styled.h2`
  font-size: 24px;
  font-weight: 700;
  color: #111827;
  margin: 0;
`

const Controls = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`

const DateRangeSelect = styled.select`
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 13px;
  background: white;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: #3b82f6;
  }
`

const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
`

const MetricCard = styled(Card)`
  padding: 16px;
  background: white;
  border: 1px solid #e5e7eb;
`

const MetricLabel = styled.div`
  font-size: 12px;
  color: #6b7280;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`

const MetricValue = styled.div`
  font-size: 24px;
  font-weight: 700;
  color: #111827;
  margin-top: 8px;
`

const MetricChange = styled.div<{ positive?: boolean }>`
  font-size: 12px;
  color: ${(props) => (props.positive ? '#059669' : '#dc2626')};
  margin-top: 4px;
`

const SectionTitle = styled.h3`
  font-size: 16px;
  font-weight: 700;
  color: #111827;
  margin: 16px 0 12px 0;
`

const ReportCard = styled(Card)`
  padding: 20px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
`

const ReportContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`

const StatusGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 12px;
`

const StatusItem = styled.div`
  padding: 12px;
  background: #f9fafb;
  border-radius: 6px;
  text-align: center;
`

const StatusCount = styled.div`
  font-size: 18px;
  font-weight: 700;
  color: #111827;
`

const StatusLabel = styled.div`
  font-size: 12px;
  color: #6b7280;
  margin-top: 4px;
`

const BreakdownTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;

  th {
    padding: 12px;
    text-align: left;
    background: #f9fafb;
    border-bottom: 2px solid #e5e7eb;
    font-weight: 600;
    color: #374151;
  }

  td {
    padding: 12px;
    border-bottom: 1px solid #e5e7eb;
    color: #6b7280;
  }

  tr:hover {
    background: #fafbfc;
  }
`

const ExportSection = styled.div`
  padding: 16px;
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  border-radius: 6px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
`

const ExportText = styled.div`
  color: #166534;

  strong {
    display: block;
    font-size: 14px;
  }

  p {
    margin: 4px 0 0 0;
    font-size: 12px;
  }
`

const ExportButtons = styled.div`
  display: flex;
  gap: 8px;
`

const ComplianceAlert = styled.div<{ severity: 'info' | 'warning' | 'critical' }>`
  padding: 12px;
  border-radius: 6px;
  border-left: 4px solid
    ${(props) =>
      props.severity === 'critical'
        ? '#ef4444'
        : props.severity === 'warning'
        ? '#f59e0b'
        : '#3b82f6'};
  background: ${(props) =>
    props.severity === 'critical'
      ? '#fef2f2'
      : props.severity === 'warning'
      ? '#fffbeb'
      : '#eff6ff'};
  color: ${(props) =>
    props.severity === 'critical'
      ? '#7f1d1d'
      : props.severity === 'warning'
      ? '#78350f'
      : '#0c4a6e'};
  font-size: 13px;
  margin-bottom: 12px;
`

const EmptyState = styled.div`
  padding: 40px;
  text-align: center;
  color: #9ca3af;
`

interface ComplianceData {
  total: Array<{ count: number }>
  byStatus: Array<{ status: string; count: number }>
  byType: Array<{ type: string; count: number }>
  compliance: {
    approvalRate: number
    flagRate: number
    reportRate: number
    avgResolutionTime: number
  }
  alerts: Array<{
    severity: 'info' | 'warning' | 'critical'
    message: string
  }>
}

export default function ComplianceReport() {
  const [dateRange, setDateRange] = useState<'week' | 'month' | 'year'>('week')
  const { data: complianceData, isLoading } = useComplianceReport(dateRange)
  const { mutate: exportPrayers, isPending: isExporting } = useExportPrayers()

  if (isLoading) {
    return <LoadingSpinner />
  }

  const data: ComplianceData = complianceData || {}
  const total = data.total?.[0]?.count || 0
  const byStatus = data.byStatus || []
  const byType = data.byType || []
  const compliance = data.compliance || {}
  const alerts = data.alerts || []

  const handleExport = (format: 'json' | 'csv') => {
    exportPrayers({ dateRange, format })
  }

  return (
    <Container>
      <Header>
        <Title>📋 Prayer Compliance Report</Title>
        <Controls>
          <DateRangeSelect
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value as any)}
          >
            <option value="week">Last 7 Days</option>
            <option value="month">Last 30 Days</option>
            <option value="year">Last Year</option>
          </DateRangeSelect>
          <Button
            onClick={() => window.location.reload()}
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <RefreshCw size={16} />
            Refresh
          </Button>
        </Controls>
      </Header>

      {/* Compliance Alerts */}
      {alerts.map((alert, idx) => (
        <ComplianceAlert key={idx} severity={alert.severity}>
          {alert.message}
        </ComplianceAlert>
      ))}

      {/* Key Metrics */}
      <MetricsGrid>
        <MetricCard>
          <MetricLabel>Total Prayers</MetricLabel>
          <MetricValue>{total}</MetricValue>
          <MetricChange>
            {Math.round((total / 1000) * 100)}% of annual volume
          </MetricChange>
        </MetricCard>

        <MetricCard>
          <MetricLabel>Approval Rate</MetricLabel>
          <MetricValue>{(compliance.approvalRate || 0).toFixed(1)}%</MetricValue>
          <MetricChange positive={compliance.approvalRate > 85}>
            {compliance.approvalRate > 85 ? '✓ Healthy' : '⚠ Monitor'}
          </MetricChange>
        </MetricCard>

        <MetricCard>
          <MetricLabel>Flag Rate</MetricLabel>
          <MetricValue>{(compliance.flagRate || 0).toFixed(1)}%</MetricValue>
          <MetricChange positive={compliance.flagRate < 5}>
            {compliance.flagRate < 5 ? '✓ Low' : '⚠ High'}
          </MetricChange>
        </MetricCard>

        <MetricCard>
          <MetricLabel>Avg Resolution Time</MetricLabel>
          <MetricValue>
            {Math.round(compliance.avgResolutionTime || 0)}h
          </MetricValue>
          <MetricChange positive={compliance.avgResolutionTime < 24}>
            {compliance.avgResolutionTime < 24 ? '✓ Quick' : '⚠ Slow'}
          </MetricChange>
        </MetricCard>
      </MetricsGrid>

      {/* Status Breakdown */}
      <ReportCard>
        <SectionTitle>Status Breakdown</SectionTitle>
        <StatusGrid>
          {byStatus.map((item: any) => (
            <StatusItem key={item.status}>
              <StatusCount>{item.count}</StatusCount>
              <StatusLabel>{item.status}</StatusLabel>
            </StatusItem>
          ))}
        </StatusGrid>
      </ReportCard>

      {/* Type Breakdown */}
      <ReportCard>
        <SectionTitle>Prayer Type Distribution</SectionTitle>
        <BreakdownTable>
          <thead>
            <tr>
              <th>Prayer Type</th>
              <th>Count</th>
              <th>% of Total</th>
            </tr>
          </thead>
          <tbody>
            {byType.map((item: any) => (
              <tr key={item.type}>
                <td>{item.type}</td>
                <td>{item.count}</td>
                <td>{((item.count / total) * 100).toFixed(1)}%</td>
              </tr>
            ))}
          </tbody>
        </BreakdownTable>
      </ReportCard>

      {/* Export Section */}
      <ExportSection>
        <ExportText>
          <strong>🔒 Export for Compliance</strong>
          <p>Download prayers for compliance, audits, or backups</p>
        </ExportText>
        <ExportButtons>
          <Button
            onClick={() => handleExport('json')}
            disabled={isExporting}
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Download size={16} />
            JSON
          </Button>
          <Button
            onClick={() => handleExport('csv')}
            disabled={isExporting}
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Download size={16} />
            CSV
          </Button>
        </ExportButtons>
      </ExportSection>
    </Container>
  )
}
