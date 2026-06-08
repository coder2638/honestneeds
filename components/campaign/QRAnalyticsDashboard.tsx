'use client'

import React from 'react'
import styled from 'styled-components'
import { TrendingUp, BarChart3, MapPin } from 'lucide-react'
import { useQRAnalytics, useQRStoreImpressions } from '@/api/hooks/useQRAnalytics'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import { Card } from '@/components/Card'

interface QRAnalyticsDashboardProps {
  campaignId: string
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  width: 100%;
`

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;

  svg {
    width: 1.5rem;
    height: 1.5rem;
    color: #7c3aed;
  }
`

const Title = styled.h3`
  font-size: 1.125rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
`

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
`

const StatCard = styled(Card)`
  background: linear-gradient(135deg, #7c3aed 0%, #a855f7 100%);
  color: white;
  padding: 1.5rem;
  text-align: center;
`

const StatValue = styled.div`
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
`

const StatLabel = styled.div`
  font-size: 0.875rem;
  opacity: 0.9;
`

const LocationTable = styled.div`
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  overflow: hidden;
`

const LocationRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 100px 100px;
  gap: 1rem;
  padding: 1rem;
  border-bottom: 1px solid #e5e7eb;
  align-items: center;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: #f9fafb;
  }
`

const LocationHeader = styled(LocationRow)`
  background: #f3f4f6;
  padding: 0.75rem 1rem;
  font-weight: 600;
  font-size: 0.875rem;
  color: #4b5563;

  &:hover {
    background: #f3f4f6;
  }
`

const LocationName = styled.div`
  font-weight: 600;
  color: #1f2937;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  svg {
    width: 1rem;
    height: 1rem;
    color: #7c3aed;
  }
`

const ScanBadge = styled.div`
  background: #ddd6fe;
  color: #6d28d9;
  padding: 0.5rem;
  border-radius: 4px;
  text-align: center;
  font-weight: 600;
  font-size: 0.875rem;
`

const EmptyState = styled.div`
  text-align: center;
  padding: 2rem;
  color: #64748b;

  svg {
    width: 2rem;
    height: 2rem;
    opacity: 0.5;
    margin-bottom: 0.75rem;
  }
`

/**
 * QRAnalyticsDashboard Component
 * Displays QR code scan analytics and in-store impression tracking
 */
export const QRAnalyticsDashboard: React.FC<QRAnalyticsDashboardProps> = ({ campaignId }) => {
  const { data: analytics, isLoading: analyticsLoading } = useQRAnalytics(campaignId)
  const { data: storeImpressions, isLoading: impressionsLoading } = useQRStoreImpressions(campaignId)

  const isLoading = analyticsLoading || impressionsLoading

  if (isLoading) {
    return <LoadingSpinner />
  }

  return (
    <Container>
      <Header>
        <BarChart3 />
        <Title>QR Code Analytics</Title>
      </Header>

      {/* Stats Cards */}
      {analytics && (
        <StatsGrid>
          <StatCard>
            <StatValue>{analytics.totalScans}</StatValue>
            <StatLabel>Total Scans</StatLabel>
          </StatCard>
          <StatCard style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)' }}>
            <StatValue>{analytics.scansThisWeek}</StatValue>
            <StatLabel>Scans This Week</StatLabel>
          </StatCard>
          <StatCard style={{ background: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)' }}>
            <StatValue>{analytics.scansThisMonth}</StatValue>
            <StatLabel>Scans This Month</StatLabel>
          </StatCard>
          {analytics.topLocation && (
            <StatCard style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)' }}>
              <StatValue>{analytics.topLocation.scans}</StatValue>
              <StatLabel>Top Location: {analytics.topLocation.name}</StatLabel>
            </StatCard>
          )}
        </StatsGrid>
      )}

      {/* Store Location Impressions */}
      {storeImpressions && storeImpressions.length > 0 ? (
        <>
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: '600', color: '#1f2937', margin: '1rem 0 0.75rem 0' }}>
              📍 By Location
            </h4>
            <LocationTable>
              <LocationHeader>
                <LocationName>Location</LocationName>
                <div>Scans</div>
                <div>Conversion</div>
              </LocationHeader>
              {storeImpressions.map((impression) => (
                <LocationRow key={impression.id}>
                  <LocationName>
                    <MapPin />
                    Store Location {impression.storeLocationId}
                  </LocationName>
                  <ScanBadge>{impression.scans}</ScanBadge>
                  <div style={{ textAlign: 'center', fontSize: '0.875rem', color: '#4b5563' }}>
                    {(impression.conversionRate * 100).toFixed(1)}%
                  </div>
                </LocationRow>
              ))}
            </LocationTable>
          </div>
        </>
      ) : (
        <Card>
          <EmptyState>
            <MapPin />
            <p>No location data yet. Share your flyer in stores to see impressions here.</p>
          </EmptyState>
        </Card>
      )}

      {/* Last Scanned */}
      {analytics?.lastScannedAt && (
        <Card style={{ padding: '1rem', background: '#f0fdf4', borderColor: '#86efac' }}>
          <p style={{ margin: 0, fontSize: '0.875rem', color: '#166534' }}>
            <strong>Last Scan:</strong> {new Date(analytics.lastScannedAt).toLocaleString()}
          </p>
        </Card>
      )}
    </Container>
  )
}
