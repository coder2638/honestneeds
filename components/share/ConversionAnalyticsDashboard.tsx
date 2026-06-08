/**
 * Conversion Analytics Dashboard
 * Displays conversion metrics for supporters and campaigns
 * Shows: clicks, conversions, conversion rate, revenue
 */

'use client';

import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useParams } from 'next/navigation';
import {
  useSupporterConversionAnalytics,
  useCampaignConversionAnalytics,
} from '@/api/hooks/useConversionTracking';

// ===== STYLED COMPONENTS =====

const DashboardContainer = styled.div`
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.div`
  margin-bottom: 32px;

  h1 {
    font-size: 28px;
    font-weight: bold;
    color: #1a1a1a;
    margin-bottom: 8px;
  }

  p {
    font-size: 14px;
    color: #666;
  }
`;

const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 16px;
  margin-bottom: 32px;
`;

const MetricCard = styled.div`
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

  .metric-label {
    font-size: 12px;
    text-transform: uppercase;
    color: #999;
    letter-spacing: 0.5px;
    margin-bottom: 8px;
    font-weight: 600;
  }

  .metric-value {
    font-size: 32px;
    font-weight: bold;
    color: #1a1a1a;
    margin-bottom: 4px;
  }

  .metric-change {
    font-size: 13px;
    color: #666;
    display: flex;
    align-items: center;
    gap: 4px;

    &.positive {
      color: #27ae60;
    }

    &.negative {
      color: #e74c3c;
    }
  }
`;

const ChartSection = styled.div`
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 24px;
  margin-bottom: 32px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

  h2 {
    font-size: 16px;
    font-weight: 600;
    color: #1a1a1a;
    margin-bottom: 20px;
  }
`;

const ChannelBreakdown = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;

  .channel-card {
    background: #f5f5f5;
    border-radius: 8px;
    padding: 16px;

    .channel-name {
      font-size: 14px;
      font-weight: 600;
      color: #1a1a1a;
      margin-bottom: 12px;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .channel-stat {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
      font-size: 13px;

      .stat-label {
        color: #666;
      }

      .stat-value {
        font-weight: 600;
        color: #1a1a1a;
      }
    }

    .channel-bar {
      background: #ddd;
      height: 4px;
      border-radius: 2px;
      overflow: hidden;

      .bar-fill {
        background: #007bff;
        height: 100%;
        border-radius: 2px;
      }
    }
  }
`;

const LoadingSpinner = styled.div`
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #007bff;
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 48px 24px;
  color: #999;

  h3 {
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 8px;
    color: #666;
  }

  p {
    font-size: 14px;
    margin-bottom: 24px;
  }
`;

// ===== COMPONENTS =====

/**
 * Supporter Conversion Analytics
 * Shows all conversion metrics for a supporter across all campaigns
 */
export function SupporterConversionAnalytics() {
  const { data, isLoading, isError } = useSupporterConversionAnalytics();

  console.log('🔍 [SupporterConversionAnalytics] Hook Response:', {
    data,
    isLoading,
    isError,
    hasData: !!data,
    dataType: typeof data,
    dataKeys: data ? Object.keys(data) : 'no data',
  });

  if (isLoading) {
    return (
      <DashboardContainer>
        <Header>
          <h1>Conversion Analytics</h1>
          <p>Track clicks, conversions, and earnings from your shares</p>
        </Header>
        <div style={{ textAlign: 'center', padding: '48px' }}>
          <LoadingSpinner /> Loading analytics...
        </div>
      </DashboardContainer>
    );
  }

  if (isError) {
    return (
      <DashboardContainer>
        <Header>
          <h1>Conversion Analytics</h1>
          <p>Track clicks, conversions, and earnings from your shares</p>
        </Header>
        <EmptyState>
          <h3>Unable to Load Analytics</h3>
          <p>There was an error loading your conversion analytics. Please try again later.</p>
        </EmptyState>
      </DashboardContainer>
    );
  }

  // Handle multiple possible data structures from API response
  // The response might be: { data: {...} } or { success: true, data: {...} } or just {...}
  let analyticsData = null;
  
  if (data?.data && typeof data.data === 'object' && !Array.isArray(data.data)) {
    analyticsData = data.data;
    console.log('📊 [SupporterConversionAnalytics] Using nested data.data structure:', analyticsData);
  } else if (data && data.total_clicks !== undefined) {
    analyticsData = data;
    console.log('📊 [SupporterConversionAnalytics] Using data directly (has total_clicks):', analyticsData);
  } else if (data && data.totalReferrals !== undefined) {
    analyticsData = data;
    console.log('📊 [SupporterConversionAnalytics] Using data directly (has totalReferrals):', analyticsData);
  } else if (data) {
    console.warn('⚠️ [SupporterConversionAnalytics] Data exists but structure unclear:', data);
    analyticsData = data;
  }
  
  if (!analyticsData) {
    console.log('❌ [SupporterConversionAnalytics] No analytics data found');
    return (
      <DashboardContainer>
        <Header>
          <h1>Conversion Analytics</h1>
          <p>Track clicks, conversions, and earnings from your shares</p>
        </Header>
        <EmptyState>
          <h3>No Data Available</h3>
          <p>Start sharing campaigns to see conversion analytics</p>
        </EmptyState>
      </DashboardContainer>
    );
  }

  const analytics = analyticsData;
  
  // Map data fields - handle both primary and fallback endpoint responses
  const totalShares = analytics.total_shares || 0;
  const totalClicks = analytics.total_clicks || analytics.totalReferrals || 0;
  const totalConversions = analytics.total_conversions || analytics.totalConversions || 0;
  const conversionRate = (analytics.conversion_rate || analytics.conversionRate || 0).toFixed(1);
  const totalRevenue = analytics.total_revenue || analytics.totalRewardEarned || 0;
  const totalRevenueFormatted = (totalRevenue / 100).toFixed(2);
  const sharesByChannel = analytics.shares_by_channel || analytics.sharesByChannel || analytics.by_channel || {};

  // Show empty state only if no shares at all
  const hasNoShares = totalShares === 0;

  if (hasNoShares) {
    return (
      <DashboardContainer>
        <Header>
          <h1>Conversion Analytics</h1>
          <p>Track clicks, conversions, and earnings from your shares</p>
        </Header>
        <EmptyState>
          <h3>No Data Available</h3>
          <p>Start sharing campaigns to see conversion analytics</p>
        </EmptyState>
      </DashboardContainer>
    );
  }

  return (
    <DashboardContainer>
      <Header>
        <h1>Conversion Analytics</h1>
        <p>Track clicks, conversions, and earnings from your shares</p>
      </Header>

      {/* Key Metrics */}
      <MetricsGrid>
        <MetricCard>
          <div className="metric-label">Total Clicks</div>
          <div className="metric-value">{totalClicks.toLocaleString()}</div>
          <div className="metric-change">
            Visitors from your shares
          </div>
        </MetricCard>

        <MetricCard>
          <div className="metric-label">Total Conversions</div>
          <div className="metric-value">{totalConversions.toLocaleString()}</div>
          <div className="metric-change positive">
            {conversionRate}% conversion rate
          </div>
        </MetricCard>

        <MetricCard>
          <div className="metric-label">Total Earnings</div>
          <div className="metric-value">${totalRevenueFormatted}</div>
          <div className="metric-change">
            From your referrals
          </div>
        </MetricCard>

        <MetricCard>
          <div className="metric-label">Conversion Rate</div>
          <div className="metric-value">{conversionRate}%</div>
          <div className="metric-change">
            Of visitors converted
          </div>
        </MetricCard>
      </MetricsGrid>

      {/* Performance by Channel */}
      {Object.keys(sharesByChannel).length > 0 && (
        <ChartSection>
          <h2>Performance by Channel</h2>
          <ChannelBreakdown>
            {Object.entries(sharesByChannel).map(([channel, data]: [string, any], idx: number) => {
              // Handle both: { share_count: 1 } and { total_clicks: 0, share_count: 1 }
              const shareCount = typeof data === 'object' ? (data?.share_count || 0) : data;
              const clicks = typeof data === 'object' ? (data?.total_clicks || 0) : 0;
              const conversions = typeof data === 'object' ? (data?.total_conversions || 0) : 0;
              const value = typeof data === 'object' ? (data?.total_value || 0) : 0;

              return (
                <div className="channel-card" key={idx}>
                  <div className="channel-name">📱 {channel.charAt(0).toUpperCase() + channel.slice(1)}</div>
                  <div className="channel-stat">
                    <span className="stat-label">Shares:</span>
                    <span className="stat-value">{shareCount}</span>
                  </div>
                  {clicks > 0 && (
                    <div className="channel-stat">
                      <span className="stat-label">Clicks:</span>
                      <span className="stat-value">{clicks}</span>
                    </div>
                  )}
                  {conversions > 0 && (
                    <div className="channel-stat">
                      <span className="stat-label">Conversions:</span>
                      <span className="stat-value">{conversions}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </ChannelBreakdown>
        </ChartSection>
      )}
    </DashboardContainer>
  );
}

/**
 * Campaign Conversion Analytics
 * Shows conversion metrics for a specific campaign
 */
export function CampaignConversionAnalytics({ campaignId }: { campaignId: string }) {
  const { data, isLoading, isError } = useCampaignConversionAnalytics(
    campaignId,
    !!campaignId
  );

  if (!campaignId) {
    return <EmptyState><h3>No Campaign ID</h3></EmptyState>;
  }

  if (isLoading) {
    return (
      <ChartSection>
        <div style={{ textAlign: 'center', padding: '48px' }}>
          <LoadingSpinner /> Loading analytics...
        </div>
      </ChartSection>
    );
  }

  if (isError || !data?.data) {
    return (
      <ChartSection>
        <h2>Conversion Analytics</h2>
        <EmptyState>
          <h3>No Data Available</h3>
          <p>No conversions yet for this campaign</p>
        </EmptyState>
      </ChartSection>
    );
  }

  const analytics = data.data;

  return (
    <ChartSection>
      <h2>Conversion Analytics</h2>
      <MetricsGrid>
        <MetricCard>
          <div className="metric-label">Total Shares</div>
          <div className="metric-value">{analytics.total_shares?.toLocaleString() || 0}</div>
        </MetricCard>

        <MetricCard>
          <div className="metric-label">Total Clicks</div>
          <div className="metric-value">{analytics.total_clicks?.toLocaleString() || 0}</div>
        </MetricCard>

        <MetricCard>
          <div className="metric-label">Total Conversions</div>
          <div className="metric-value">{analytics.total_conversions?.toLocaleString() || 0}</div>
          <div className="metric-change positive">
            {analytics.conversion_rate?.toFixed(1)}% rate
          </div>
        </MetricCard>

        <MetricCard>
          <div className="metric-label">Total Revenue</div>
          <div className="metric-value">
            ${((analytics.total_conversion_value || 0) / 100).toFixed(2)}
          </div>
        </MetricCard>
      </MetricsGrid>
    </ChartSection>
  );
}

export default SupporterConversionAnalytics;
