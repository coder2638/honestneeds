/**
 * Campaign Analytics Dashboard
 * 
 * Unified analytics dashboard combining:
 * - Real-time metrics display
 * - Donation & share trends
 * - AI-generated recommendations
 * - Export functionality
 */

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useCombinedAnalytics, useExportAnalytics, useMainAnalytics } from '@/api/hooks/useCampaignAnalytics';
import AnalyticsCharts from './AnalyticsCharts';
import AIRecommendations from './AIRecommendations';
import AnalyticsExportModal from './AnalyticsExportModal';

// ============================================================================
// STYLED COMPONENTS
// ============================================================================

const DashboardContainer = styled.div`
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const DashboardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 3rem;
  flex-wrap: wrap;
  gap: 1rem;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const HeaderInfo = styled.div`
  flex: 1;
`;

const PageTitle = styled.h1`
  margin: 0 0 0.5rem 0;
  font-size: 2rem;
  font-weight: 700;
  color: #1f2937;

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const PageSubtitle = styled.p`
  margin: 0;
  color: #6b7280;
  font-size: 0.9375rem;
`;

const HeaderControls = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;

  @media (max-width: 768px) {
    width: 100%;
    flex-wrap: wrap;
  }
`;

const RefreshButton = styled.button`
  background: white;
  border: 2px solid #3b82f6;
  color: #3b82f6;
  padding: 0.625rem 1.25rem;
  border-radius: 6px;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    background: #eff6ff;
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .icon {
    font-size: 1rem;
    animation: ${(p) => (p.disabled ? 'spin 1s linear infinite' : 'none')};
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const ExportButton = styled.button`
  background: #3b82f6;
  border: none;
  color: white;
  padding: 0.625rem 1.25rem;
  border-radius: 6px;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    background: #2563eb;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    background: #d1d5db;
    cursor: not-allowed;
  }
`;

const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const MetricCard = styled.div`
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 1.5rem;
  transition: all 0.2s ease;

  &:hover {
    border-color: #3b82f6;
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.1);
  }
`;

const MetricLabel = styled.p`
  margin: 0 0 0.5rem 0;
  font-size: 0.875rem;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-weight: 600;
`;

const MetricValue = styled.p`
  margin: 0;
  font-size: 2rem;
  font-weight: 700;
  color: #1f2937;

  @media (max-width: 640px) {
    font-size: 1.5rem;
  }
`;

const MetricChange = styled.p<{ $positive?: boolean }>`
  margin: 0.5rem 0 0 0;
  font-size: 0.875rem;
  color: ${(p) => (p.$positive ? '#10b981' : '#ef4444')};
  font-weight: 600;
`;

const SectionTitle = styled.h2`
  margin: 3rem 0 2rem 0;
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
  padding-bottom: 1rem;
  border-bottom: 2px solid #f3f4f6;
`;

const TabControls = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
`;

const TabButton = styled.button<{ $active: boolean }>`
  padding: 0.75rem 1.5rem;
  border: 2px solid ${(p) => (p.$active ? '#3b82f6' : '#e5e7eb')};
  background: ${(p) => (p.$active ? '#3b82f6' : 'white')};
  color: ${(p) => (p.$active ? 'white' : '#6b7280')};
  border-radius: 6px;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: #3b82f6;
    color: ${(p) => (p.$active ? 'white' : '#3b82f6')};
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  color: #9ca3af;
`;

const Spinner = styled.div`
  border: 4px solid #e5e7eb;
  border-top: 4px solid #3b82f6;
  border-radius: 50%;
  width: 48px;
  height: 48px;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const ErrorContainer = styled.div`
  background: #fee2e2;
  border-left: 4px solid #ef4444;
  padding: 1.5rem;
  border-radius: 8px;
  margin-top: 2rem;
  color: #991b1b;
`;

const ErrorTitle = styled.h3`
  margin: 0 0 0.5rem 0;
  font-weight: 600;
`;

const ErrorMessage = styled.p`
  margin: 0;
  font-size: 0.9375rem;
`;

// ============================================================================
// PROPS & TYPES
// ============================================================================

export interface CampaignAnalyticsDashboardProps {
  campaignId: string;
  campaignName?: string;
  initialPeriod?: 'daily' | 'weekly' | 'monthly';
  onNavigate?: (route: string) => void;
}

// ============================================================================
// COMPONENT
// ============================================================================

export const CampaignAnalyticsDashboard: React.FC<CampaignAnalyticsDashboardProps> = ({
  campaignId,
  campaignName = 'Campaign',
  initialPeriod = 'daily',
  onNavigate,
}) => {
  const [period, setPeriod] = useState<'daily' | 'weekly' | 'monthly'>(initialPeriod);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'charts' | 'insights'>('overview');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Fetch main analytics data (financial metrics, donations, shares)
  const mainAnalytics = useMainAnalytics(campaignId);

  // Fetch time-series analytics for charts
  const { timeSeries, trends, predictions, cohorts, isLoading, isError, error } =
    useCombinedAnalytics(campaignId, period, 30);

  const exportFn = useExportAnalytics(campaignId);

  // DEBUG: Log analytics data
  React.useEffect(() => {
    if (mainAnalytics.data) {
      console.log('📊 [CampaignAnalyticsDashboard] Main Analytics Data:', {
        campaignId,
        financial: mainAnalytics.data.financial,
        donations: mainAnalytics.data.donations,
        shares: mainAnalytics.data.shares,
        totalRaised: mainAnalytics.data.financial?.totalRaised,
        goalAmount: mainAnalytics.data.financial?.goalAmount,
        totalDonations: mainAnalytics.data.donations?.totalDonations,
      });
    }
    if (timeSeries.data) {
      console.log('🔍 [CampaignAnalyticsDashboard] Time-Series Data Received:', {
        campaignId,
        timeSeries: timeSeries.data,
      });
    }
    if (predictions.data) {
      console.log('🔍 [CampaignAnalyticsDashboard] Predictions Data:', {
        estimatedFinalValue: predictions.data.estimatedFinalValue,
        budgetDepletionDays: predictions.data.budgetDepletionDays,
      });
    }
  }, [mainAnalytics.data, timeSeries.data, predictions.data, campaignId]);

  // Extract metrics from main analytics (source of truth for KPI cards)
  const totalDonationAmount = mainAnalytics.data?.financial?.totalRaised || 0;
  const totalDonationCount = mainAnalytics.data?.donations?.totalDonations || 0;
  const totalSharesCount = mainAnalytics.data?.shares?.totalShares || 0;
  const goalAmount = mainAnalytics.data?.financial?.goalAmount || 0;
  const goalProgress = mainAnalytics.data?.financial?.goalProgress || 0;
  const uniqueDonors = mainAnalytics.data?.donations?.uniqueDonors || 0;
  const averageDonation = mainAnalytics.data?.donations?.averageDonation || 0;

  // Calculate metrics from time-series data (for charts/trends)
  const timeSeriesDonations =
    timeSeries.data?.donations?.reduce((sum, d) => sum + (d.value || 0), 0) || 0;
  const timeSeriesShares =
    timeSeries.data?.shares?.reduce((sum, s) => sum + (s.count || 0), 0) || 0;
  const totalEngagement = timeSeries.data?.engagement?.length || 0;

  // DEBUG: Log calculated metrics
  React.useEffect(() => {
    console.log('📊 [CampaignAnalyticsDashboard] KPI Metrics:', {
      totalDonationAmount,
      totalDonationCount,
      totalSharesCount,
      goalAmount,
      goalProgress,
      uniqueDonors,
      averageDonation,
      displayedRaised: `$${(totalDonationAmount / 100).toFixed(2)}`,
      displayedGoal: `$${(goalAmount / 100).toFixed(2)}`,
    });
  }, [totalDonationAmount, totalDonationCount, totalSharesCount, goalAmount]);

  const donationTrend = trends.data?.campaign?.percentageChange || 0;
  const shareTrend = trends.data?.campaign?.percentageChange || 0;

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await Promise.all([timeSeries.refetch(), trends.refetch(), predictions.refetch()]);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleExport = async (
    format: 'csv' | 'json' | 'pdf',
    startDate?: string,
    endDate?: string,
    metrics?: string[]
  ) => {
    try {
      await exportFn();
    } catch (error) {
      console.error('Export failed:', error);
      throw error;
    }
  };

  if ((isLoading || mainAnalytics.isLoading) && !mainAnalytics.data) {
    return (
      <DashboardContainer>
        <LoadingContainer>
          <Spinner />
          <p>Loading campaign analytics...</p>
        </LoadingContainer>
      </DashboardContainer>
    );
  }

  return (
    <DashboardContainer>
      {/* Header */}
      <DashboardHeader>
        <HeaderInfo>
          <PageTitle>📊 Campaign Analytics</PageTitle>
          <PageSubtitle>{campaignName}</PageSubtitle>
        </HeaderInfo>
        <HeaderControls>
          <RefreshButton onClick={handleRefresh} disabled={isRefreshing} title="Refresh data">
            <span className="icon">🔄</span>
            {isRefreshing ? 'Refreshing...' : 'Refresh'}
          </RefreshButton>
          <ExportButton onClick={() => setIsExportModalOpen(true)} title="Export analytics">
            <span>⬇️</span>
            Export
          </ExportButton>
        </HeaderControls>
      </DashboardHeader>

      {/* Error State */}
      {isError && (
        <ErrorContainer>
          <ErrorTitle>⚠️ Failed to Load Analytics</ErrorTitle>
          <ErrorMessage>
            {error?.message || 'Unable to fetch analytics data. Please try again.'}
          </ErrorMessage>
        </ErrorContainer>
      )}

      {/* Key Metrics Cards */}
      <MetricsGrid>
        <MetricCard>
          <MetricLabel>💰 Total Raised</MetricLabel>
          <MetricValue>${(totalDonationAmount / 100).toFixed(2)}</MetricValue>
          <MetricChange $positive={goalProgress > 0}>
            {goalProgress > 0 ? '↑' : '→'} {goalProgress.toFixed(1)}% of $
            {(goalAmount / 100).toFixed(2)}
          </MetricChange>
        </MetricCard>

        <MetricCard>
          <MetricLabel>❤️ Total Donations</MetricLabel>
          <MetricValue>{totalDonationCount}</MetricValue>
          <MetricChange $positive={uniqueDonors > 0}>
            Avg: ${(averageDonation / 100).toFixed(2)}
          </MetricChange>
        </MetricCard>

        <MetricCard>
          <MetricLabel>📢 Total Shares</MetricLabel>
          <MetricValue>{totalSharesCount}</MetricValue>
          <MetricChange $positive={totalSharesCount > 0}>
            {mainAnalytics.data?.shares?.sharesByChannel
              ? Object.keys(mainAnalytics.data.shares.sharesByChannel).length
              : 0}{' '}
            channels
          </MetricChange>
        </MetricCard>

        <MetricCard>
          <MetricLabel>👥 Unique Supporters</MetricLabel>
          <MetricValue>{uniqueDonors}</MetricValue>
          <MetricChange $positive={uniqueDonors > 0}>
            From {uniqueDonors} donors
          </MetricChange>
        </MetricCard>
      </MetricsGrid>

      {/* Tab Navigation */}
      <TabControls>
        <TabButton $active={activeTab === 'overview'} onClick={() => setActiveTab('overview')}>
          📊 Overview
        </TabButton>
        <TabButton $active={activeTab === 'charts'} onClick={() => setActiveTab('charts')}>
          📈 Detailed Trends
        </TabButton>
        <TabButton $active={activeTab === 'insights'} onClick={() => setActiveTab('insights')}>
          💡 AI Insights
        </TabButton>
      </TabControls>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <>
          <SectionTitle>Quick Summary</SectionTitle>
          <MetricsGrid>
            <MetricCard>
              <MetricLabel>📅 Last 7 Days</MetricLabel>
              <MetricValue>
                {timeSeries.data?.donations?.slice(-7).length || 0} donations
              </MetricValue>
            </MetricCard>

            <MetricCard>
              <MetricLabel>🔄 Conversion Rate</MetricLabel>
              <MetricValue>
                {trends.data?.campaign
                  ? ((trends.data.campaign.percentageChange + 100) / 2).toFixed(1)
                  : '-'}
                %
              </MetricValue>
            </MetricCard>

            <MetricCard>
              <MetricLabel>⏱️ Avg. Response Time</MetricLabel>
              <MetricValue>
                {cohorts.data?.avgRetention?.toFixed(1) || '-'}
                {cohorts.data?.avgRetention ? '%' : ''}
              </MetricValue>
            </MetricCard>

            <MetricCard>
              <MetricLabel>📌 Budget Remaining</MetricLabel>
              <MetricValue>
                {predictions.data?.budgetDepletionDays
                  ? `${predictions.data.budgetDepletionDays} days`
                  : 'Unlimited'}
              </MetricValue>
            </MetricCard>
          </MetricsGrid>
        </>
      )}

      {/* Charts Tab */}
      {activeTab === 'charts' && (
        <>
          <SectionTitle>Performance Trends</SectionTitle>
          <AnalyticsCharts
            donations={timeSeries.data?.donations || []}
            shares={timeSeries.data?.shares || []}
            engagement={timeSeries.data?.engagement || []}
            isLoading={timeSeries.isLoading}
            period={period}
            onPeriodChange={setPeriod}
          />
        </>
      )}

      {/* Insights Tab */}
      {activeTab === 'insights' && (
        <>
          <SectionTitle>AI-Powered Recommendations</SectionTitle>
          <AIRecommendations
            successProbability={predictions.data?.successProbability || 0}
            recommendations={predictions.data?.recommendations || []}
            budgetDepletionDays={predictions.data?.budgetDepletionDays || undefined}
            estimatedFinalValue={predictions.data?.estimatedFinalValue || 0}
            isLoading={predictions.isLoading}
            onAction={(action) => {
              console.log('Action triggered:', action);
              // Could navigate to specific action (e.g., boost campaign, adjust reward, etc.)
            }}
          />
        </>
      )}

      {/* Export Modal */}
      <AnalyticsExportModal
        isOpen={isExportModalOpen}
        campaignId={campaignId}
        campaignName={campaignName}
        onClose={() => setIsExportModalOpen(false)}
        onExport={handleExport}
      />
    </DashboardContainer>
  );
};

export default CampaignAnalyticsDashboard;
