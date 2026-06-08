/**
 * Analytics Charts Component
 * 
 * Displays time-series data for donations, shares, and engagement
 * Uses Recharts for responsive, interactive visualizations
 */

import React, { useState } from 'react';
import styled from 'styled-components';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts';

// ============================================================================
// STYLED COMPONENTS
// ============================================================================

const ChartsContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin: 2rem 0;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const ChartWrapper = styled.div`
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
`;

const ChartTitle = styled.h3`
  margin: 0 0 1rem 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  .icon {
    font-size: 1.25rem;
  }
`;

const ChartControls = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
`;

const ToggleButton = styled.button<{ $active: boolean }>`
  padding: 0.5rem 1rem;
  border: 2px solid ${(p) => (p.$active ? '#3b82f6' : '#d1d5db')};
  background: ${(p) => (p.$active ? '#3b82f6' : 'white')};
  color: ${(p) => (p.$active ? 'white' : '#6b7280')};
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: #3b82f6;
  }
`;

const EmptyState = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 300px;
  color: #9ca3af;
  text-align: center;
  flex-direction: column;
  gap: 1rem;

  .icon {
    font-size: 2.5rem;
    opacity: 0.5;
  }

  p {
    margin: 0;
  }
`;

const LoadingState = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 300px;
  color: #9ca3af;
`;

const Spinner = styled.div`
  border: 3px solid #e5e7eb;
  border-top: 3px solid #3b82f6;
  border-radius: 50%;
  width: 40px;
  height: 40px;
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

// ============================================================================
// CUSTOM TOOLTIP
// ============================================================================

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ color: string; name: string; value: number }>;
  label?: string;
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          background: 'white',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          padding: '0.75rem',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        }}
      >
        <p style={{ margin: '0 0 0.5rem 0', fontWeight: 600, color: '#1f2937' }}>
          {label}
        </p>
        {payload.map((entry, index) => (
          <p
            key={index}
            style={{
              margin: '0.25rem 0',
              fontSize: '0.875rem',
              color: entry.color,
            }}
          >
            {entry.name}: {entry.value.toLocaleString()}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// ============================================================================
// PROPS & TYPES
// ============================================================================

export interface TimeSeriesDataPoint {
  date: string;
  donationValue?: number;
  donationCount?: number;
  shareCount?: number;
  engagement?: number;
  views?: number;
}

interface AnalyticsChartsProps {
  donations?: TimeSeriesDataPoint[];
  shares?: TimeSeriesDataPoint[];
  engagement?: TimeSeriesDataPoint[];
  isLoading?: boolean;
  period?: 'daily' | 'weekly' | 'monthly';
  onPeriodChange?: (period: 'daily' | 'weekly' | 'monthly') => void;
}

// ============================================================================
// COMPONENT
// ============================================================================

export const AnalyticsCharts: React.FC<AnalyticsChartsProps> = ({
  donations = [],
  shares = [],
  engagement = [],
  isLoading = false,
  period = 'daily',
  onPeriodChange,
}) => {
  const [visibleMetrics, setVisibleMetrics] = useState<{
    donations: boolean;
    shares: boolean;
    engagement: boolean;
  }>({
    donations: true,
    shares: true,
    engagement: true,
  });

  const toggleMetric = (metric: keyof typeof visibleMetrics) => {
    setVisibleMetrics((prev) => ({
      ...prev,
      [metric]: !prev[metric],
    }));
  };

  // Combine all data by date
  const combinedData = React.useMemo(() => {
    const dataMap = new Map<string, TimeSeriesDataPoint>();

    donations.forEach((d) => {
      const existing = dataMap.get(d.date) || { date: d.date };
      dataMap.set(d.date, {
        ...existing,
        donationValue: d.donationValue,
        donationCount: d.donationCount,
      });
    });

    shares.forEach((s) => {
      const existing = dataMap.get(s.date) || { date: s.date };
      dataMap.set(s.date, {
        ...existing,
        shareCount: s.shareCount,
      });
    });

    engagement.forEach((e) => {
      const existing = dataMap.get(e.date) || { date: e.date };
      dataMap.set(e.date, {
        ...existing,
        engagement: e.engagement,
        views: e.views,
      });
    });

    return Array.from(dataMap.values())
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [donations, shares, engagement]);

  const hasData =
    (donations && donations.length > 0) ||
    (shares && shares.length > 0) ||
    (engagement && engagement.length > 0);

  if (isLoading) {
    return (
      <ChartWrapper>
        <LoadingState>
          <Spinner />
        </LoadingState>
      </ChartWrapper>
    );
  }

  if (!hasData) {
    return (
      <ChartWrapper>
        <EmptyState>
          <div className="icon">📊</div>
          <p>No data available for this period</p>
        </EmptyState>
      </ChartWrapper>
    );
  }

  return (
    <ChartsContainer>
      {/* Combined Trends Chart */}
      <ChartWrapper>
        <ChartTitle>
          <span className="icon">📈</span>
          Campaign Performance Trends
        </ChartTitle>
        <ChartControls>
          {onPeriodChange && (
            <>
              <ToggleButton
                $active={period === 'daily'}
                onClick={() => onPeriodChange('daily')}
              >
                Daily
              </ToggleButton>
              <ToggleButton
                $active={period === 'weekly'}
                onClick={() => onPeriodChange('weekly')}
              >
                Weekly
              </ToggleButton>
              <ToggleButton
                $active={period === 'monthly'}
                onClick={() => onPeriodChange('monthly')}
              >
                Monthly
              </ToggleButton>
            </>
          )}
        </ChartControls>

        <div style={{ height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={combinedData}>
              <defs>
                <linearGradient id="colorDonations" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.1} />
                </linearGradient>
                <linearGradient id="colorShares" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="date" stroke="#9ca3af" style={{ fontSize: '0.75rem' }} />
              <YAxis stroke="#9ca3af" style={{ fontSize: '0.75rem' }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              {visibleMetrics.donations && (
                <Area
                  type="monotone"
                  dataKey="donationValue"
                  stroke="#10b981"
                  fillOpacity={1}
                  fill="url(#colorDonations)"
                  name="Donation Value"
                  connectNulls
                />
              )}
              {visibleMetrics.shares && (
                <Area
                  type="monotone"
                  dataKey="shareCount"
                  stroke="#f59e0b"
                  fillOpacity={1}
                  fill="url(#colorShares)"
                  name="Shares"
                  connectNulls
                />
              )}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </ChartWrapper>

      {/* Metric Comparison Chart */}
      <ChartWrapper>
        <ChartTitle>
          <span className="icon">📊</span>
          Metric Comparison
        </ChartTitle>
        <ChartControls>
          <ToggleButton
            $active={visibleMetrics.donations}
            onClick={() => toggleMetric('donations')}
          >
            Donations ({donations.length})
          </ToggleButton>
          <ToggleButton
            $active={visibleMetrics.shares}
            onClick={() => toggleMetric('shares')}
          >
            Shares ({shares.length})
          </ToggleButton>
          <ToggleButton
            $active={visibleMetrics.engagement}
            onClick={() => toggleMetric('engagement')}
          >
            Engagement ({engagement.length})
          </ToggleButton>
        </ChartControls>

        <div style={{ height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={combinedData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="date" stroke="#9ca3af" style={{ fontSize: '0.75rem' }} />
              <YAxis stroke="#9ca3af" style={{ fontSize: '0.75rem' }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              {visibleMetrics.donations && (
                <Bar dataKey="donationCount" fill="#10b981" name="Donation Count" />
              )}
              {visibleMetrics.shares && (
                <Bar dataKey="shareCount" fill="#f59e0b" name="Share Count" />
              )}
              {visibleMetrics.engagement && (
                <Bar dataKey="views" fill="#3b82f6" name="Views" />
              )}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </ChartWrapper>

      {/* Month-over-Month Growth */}
      {combinedData.length > 30 && (
        <ChartWrapper>
          <ChartTitle>
            <span className="icon">📉</span>
            Growth Rate (14-Day Moving Average)
          </ChartTitle>

          <div style={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={combinedData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="date" stroke="#9ca3af" style={{ fontSize: '0.75rem' }} />
                <YAxis stroke="#9ca3af" style={{ fontSize: '0.75rem' }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                {visibleMetrics.donations && (
                  <Line
                    type="monotone"
                    dataKey="donationValue"
                    stroke="#10b981"
                    dot={false}
                    name="Donation Trend"
                    strokeWidth={2}
                    connectNulls
                  />
                )}
                {visibleMetrics.shares && (
                  <Line
                    type="monotone"
                    dataKey="shareCount"
                    stroke="#f59e0b"
                    dot={false}
                    name="Share Trend"
                    strokeWidth={2}
                    connectNulls
                  />
                )}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </ChartWrapper>
      )}

      {/* Distribution by Source */}
      {visibleMetrics.donations && donations.length > 0 && (
        <ChartWrapper>
          <ChartTitle>
            <span className="icon">💰</span>
            Donation Distribution
          </ChartTitle>

          <div style={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={donations.slice(-14)}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="date" stroke="#9ca3af" style={{ fontSize: '0.75rem' }} />
                <YAxis stroke="#9ca3af" style={{ fontSize: '0.75rem' }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="donationValue" fill="#10b981" name="Donation Value" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartWrapper>
      )}
    </ChartsContainer>
  );
};

export default AnalyticsCharts;
