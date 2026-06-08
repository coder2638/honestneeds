'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import styled from 'styled-components'
import { use } from 'react'
import { useCampaign, useCampaignAnalytics, usePublishCampaign } from '@/api/hooks/useCampaigns'
import { useCampaignEntries } from '@/api/hooks/useSweepstakes'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { Card } from '@/components/Card'
import { Button } from '@/components/Button'
import { Badge } from '@/components/Badge'
import {
  CampaignMetricsCards,
  ActivityFeed,
  CsvExportButton,
} from '@/components/analytics'
import { FlyerBuilder } from '@/components/campaign/FlyerBuilder'
import { QRAnalyticsDashboard } from '@/components/campaign/QRAnalyticsDashboard'
import { ShareAnalyticsDashboard } from '@/components/campaign/ShareAnalyticsDashboard'
import { ReferralAnalyticsDashboard } from '@/components/campaign/ReferralAnalyticsDashboard'
import { PrayerAnalyticsDashboard } from '@/components/analytics/PrayerAnalyticsDashboard'
import { currencyUtils } from '@/utils/validationSchemas'

// Skeleton Loading Component
const SkeletonLine = styled.div`
  height: 16px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
  border-radius: 4px;
  margin-bottom: 8px;

  @keyframes loading {
    0% {
      background-position: 200% 0;
    }
    100% {
      background-position: -200% 0;
    }
  }
`

const SkeletonStatCard = styled(Card)`
  padding: 20px;
  border: 2px solid #e5e7eb;

  ${SkeletonLine}:first-child {
    width: 60%;
    height: 14px;
    margin-bottom: 12px;
  }

  ${SkeletonLine}:nth-child(2) {
    width: 80%;
    height: 32px;
    margin-bottom: 8px;
  }

  ${SkeletonLine}:last-child {
    width: 70%;
    height: 14px;
  }
`

const SkeletonGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
`

const SkeletonLoadingContainer = styled.div`
  animation: fadeIn 0.3s ease-in;

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`

function SkeletonLoader() {
  return (
    <SkeletonLoadingContainer>
      {/* Header Skeleton */}
      <PageHeader>
        <HeaderContent>
          <SkeletonLine style={{ width: '60%', height: '32px', marginBottom: '16px' }} />
          <SkeletonLine style={{ width: '80%', height: '16px', marginBottom: '8px' }} />
          <SkeletonLine style={{ width: '70%', height: '16px' }} />
        </HeaderContent>
        <Actions>
          <SkeletonLine style={{ width: '120px', height: '40px' }} />
          <SkeletonLine style={{ width: '120px', height: '40px' }} />
        </Actions>
      </PageHeader>

      {/* Info Box Skeleton */}
      <InfoBox>
        <SkeletonLine style={{ width: '90%', height: '14px' }} />
      </InfoBox>

      {/* Stats Grid Skeleton */}
      <Section>
        <SkeletonGrid>
          <SkeletonStatCard>
            <SkeletonLine />
            <SkeletonLine style={{ height: '28px' }} />
            <SkeletonLine />
          </SkeletonStatCard>
          <SkeletonStatCard>
            <SkeletonLine />
            <SkeletonLine style={{ height: '28px' }} />
            <SkeletonLine />
          </SkeletonStatCard>
          <SkeletonStatCard>
            <SkeletonLine />
            <SkeletonLine style={{ height: '28px' }} />
            <SkeletonLine />
          </SkeletonStatCard>
          <SkeletonStatCard>
            <SkeletonLine />
            <SkeletonLine style={{ height: '28px' }} />
            <SkeletonLine />
          </SkeletonStatCard>
        </SkeletonGrid>
      </Section>

      {/* Section Skeleton */}
      <Section>
        <SkeletonLine style={{ width: '40%', height: '22px', marginBottom: '20px' }} />
        <Card style={{ padding: '20px' }}>
          <SkeletonLine />
          <SkeletonLine />
          <SkeletonLine />
          <SkeletonLine style={{ width: '60%' }} />
        </Card>
      </Section>
    </SkeletonLoadingContainer>
  )
}

/**
 * Campaign Analytics Page
 * Creator view: campaign metrics, donations, shares, and sweepstakes entries
 */

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
`

const PageHeader = styled.div`
  margin-bottom: 32px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 20px;
  flex-wrap: wrap;

  @media (max-width: 640px) {
    flex-direction: column;
    gap: 16px;
  }
`

const HeaderContent = styled.div`
  flex: 1;
  min-width: 300px;
`

const PageTitle = styled.h1`
  font-size: clamp(18px, 5vw, 32px);
  font-weight: 700;
  color: #111827;
  margin: 0 0 8px 0;
  word-break: break-word;
  overflow-wrap: break-word;
  hyphens: auto;

  @media (max-width: 640px) {
    font-size: 18px;
  }
`

const PageSubtitle = styled.p`
  font-size: 16px;
  color: #6b7280;
  margin: 0;
`

const Actions = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;

  @media (max-width: 640px) {
    width: 100%;
    flex-direction: column;

    button {
      width: 100%;
    }
  }
`

const Section = styled.div`
  margin-bottom: 32px;
`

const SectionTitle = styled.h2`
  font-size: 22px;
  font-weight: 600;
  color: #111827;
  margin: 0 0 20px 0;
`

const SectionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
`

const StatCard = styled(Card)`
  padding: 20px;
  border: 2px solid #e5e7eb;
  transition: all 0.2s;

  &:hover {
    border-color: #d1d5db;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  }
`

const StatLabel = styled.p`
  font-size: 13px;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  margin: 0 0 8px 0;
  letter-spacing: 0.5px;
`

const StatValue = styled.p`
  font-size: 32px;
  font-weight: 700;
  color: #111827;
  margin: 0;
  line-height: 1;
`

const InfoBox = styled(Card)`
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  padding: 16px;
  margin-bottom: 24px;
`

const InfoText = styled.p`
  font-size: 14px;
  color: #166534;
  margin: 0;
  line-height: 1.6;
`

const BackButton = styled(Button)`
  align-self: flex-start;
`

const SuccessBox = styled(Card)`
  background: #ecfdf5;
  border: 1px solid #86efac;
  padding: 12px 16px;
  margin-bottom: 16px;
  border-radius: 8px;
`

const SuccessText = styled.p`
  font-size: 14px;
  color: #166534;
  margin: 0;
  line-height: 1.5;
`

const ErrorBox = styled(Card)`
  background: #fef2f2;
  border: 1px solid #fca5a5;
  padding: 12px 16px;
  margin-bottom: 16px;
  border-radius: 8px;
`

const ErrorText = styled.p`
  font-size: 14px;
  color: #991b1b;
  margin: 0;
  line-height: 1.5;
`

const QRFlyer = styled(Card)`
  padding: 24px;
  overflow: hidden;

  @media (max-width: 768px) {
    padding: 20px;
  }

  @media (max-width: 640px) {
    padding: 16px;
  }
`

const QRFlyerGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
    gap: 12px;
  }
`

const QRFlyerContent = styled.div`
  min-width: 0;

  h3 {
    margin: 0 0 16px 0;
    font-size: clamp(16px, 5vw, 18px);
    font-weight: 600;

    @media (max-width: 640px) {
      font-size: 16px;
      margin: 0 0 12px 0;
    }
  }

  p {
    margin: 0 0 16px 0;
    font-size: clamp(13px, 4vw, 14px);
    color: #6b7280;
    line-height: 1.5;

    @media (max-width: 640px) {
      font-size: 13px;
      margin: 0 0 12px 0;
    }
  }
`

const DraftBadgeBox = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 12px;
  margin-top: 12px;
`

interface CampaignAnalyticsPageProps {
  params: Promise<{
    id: string
  }>
}

export default function CampaignAnalyticsPage({
  params,
}: CampaignAnalyticsPageProps) {
  const { id } = use(params)
  const [publishSuccess, setPublishSuccess] = useState(false)
  const [publishError, setPublishError] = useState<string | null>(null)

  // All hooks MUST be called before any conditional returns
  const { data: campaign, isLoading: campaignLoading, error: campaignError, refetch: refetchCampaign } = useCampaign(id)
  const { data: analytics, isLoading: analyticsLoading, error: analyticsError } = useCampaignAnalytics(id)
  const { data: sweepstakesData, error: sweepstakesError } = useCampaignEntries(id)
  const { mutate: publishCampaign, isPending: isPublishing } = usePublishCampaign()

  // Log component mount and params
  useEffect(() => {
    console.log('📊 [Analytics] Component mounted', {
      campaignId: id,
      timestamp: new Date().toISOString(),
    })
  }, [id])

  // Log campaign data fetch lifecycle
  useEffect(() => {
    if (campaignLoading) {
      console.log('⏳ [Analytics] Campaign data loading...', { campaignId: id })
    } else if (campaign) {
      const goalAmount = campaign.goals?.[0]?.target_amount || 0
      console.log('✅ [Analytics] Campaign data loaded', {
        campaignId: id,
        campaignTitle: campaign.title,
        status: campaign.status,
        goal_amount: goalAmount,
        raised_amount: campaign.total_donation_amount,
      })
    } else if (campaignError) {
      console.error('❌ [Analytics] Campaign data fetch failed', {
        campaignId: id,
        error: campaignError,
        errorMessage: campaignError?.message,
      })
    }
  }, [campaign, campaignLoading, campaignError, id])

  // Log analytics data fetch lifecycle
  useEffect(() => {
    if (analyticsLoading) {
      console.log('⏳ [Analytics] Analytics data loading...', { campaignId: id })
    } else if (analytics) {
      console.log('✅ [Analytics] Analytics data loaded', {
        campaignId: id,
        totalDonations: analytics.totalDonations || 0,
        totalRaised: analytics.totalRaised || 0,
        uniqueDonors: analytics.uniqueDonors || 0,
        totalShares: analytics.totalShares || 0,
        dataPoints: analytics.donationsByDate?.length || 0,
        lastUpdated: analytics.lastUpdated,
      })
    } else if (analyticsError) {
      console.error('❌ [Analytics] Analytics data fetch failed', {
        campaignId: id,
        error: analyticsError,
        errorMessage: analyticsError?.message,
      })
    }
  }, [analytics, analyticsLoading, analyticsError, id])

  // Log sweepstakes data fetch lifecycle
  useEffect(() => {
    if (sweepstakesData) {
      console.log('✅ [Analytics] Sweepstakes data loaded', {
        campaignId: id,
        entries: {
          total: sweepstakesData.entries?.total || 0,
          campaignCreation: sweepstakesData.entries?.campaignCreation || 0,
          donations: sweepstakesData.entries?.donations || 0,
          shares: sweepstakesData.entries?.shares || 0,
        },
        currentDrawing: {
          status: sweepstakesData.currentDrawing?.status,
          targetDate: sweepstakesData.currentDrawing?.targetDate,
        },
      })
    } else if (sweepstakesError) {
      console.warn('⚠️ [Analytics] Sweepstakes data fetch failed (gracefully handled)', {
        campaignId: id,
        error: sweepstakesError?.message,
      })
    }
  }, [sweepstakesData, sweepstakesError, id])

  const isLoading = campaignLoading || analyticsLoading

  // Prepare data for CSV export
  const csvData = analytics?.donationsByDate?.map((day) => ({
    date: day.date,
    type: 'donation' as const,
    description: `${day.count} donations`,
    amount: day.amount / 100,
    status: 'completed',
  })) || []

  // FIX: Use analytics data instead of raw campaign data (analytics has sanitized/calculated values)
  // Backend analytics service already handles goal validation, currency conversion, and calculations
  // Note: Backend returns values in cents, formatCurrency expects cents
  
  // FIX: Use correct data sources revealed by logging
  // - Goal: campaign.goals[0].target_amount (in cents)
  // - Raised: analytics.totalRaised (in cents)
  // - Progress: calculated from raised/goal
  
  const goalAmountCents = campaign?.goals?.[0]?.target_amount ?? 0;
  const raisedAmountCents = analytics?.totalRaised ?? 0;
  const goalProgressPercentage = goalAmountCents > 0 
    ? (raisedAmountCents / goalAmountCents) * 100 
    : 0;
  
  console.log('💡 [Analytics] Corrected data sources:', {
    campaignId: id,
    goalAmountCents,
    raisedAmountCents,
    goalProgressPercentage: goalProgressPercentage.toFixed(2),
    totalDonations: analytics?.totalDonations,
    uniqueDonors: analytics?.uniqueDonors,
    source: 'campaign.goals[0] + analytics.totalRaised',
  })

  // Log rendering state transitions
  useEffect(() => {
    if (isLoading) {
      console.log('🔄 [Analytics] Page rendering: Loading state', {
        campaignId: id,
        campaignLoading,
        analyticsLoading,
      })
    } else {
      console.log('🎨 [Analytics] Page rendering: Ready state', {
        campaignId: id,
        campaignType: campaign?.campaign_type,
        hasCampaign: !!campaign,
        hasAnalytics: !!analytics,
        hasSweepstakes: !!sweepstakesData,
        progressPercentage: goalProgressPercentage.toFixed(2) + '%',
      })
      
      // Log which sections will render based on campaign type
      if (campaign?.campaign_type === 'fundraising') {
        console.log('📊 [Analytics] Fundraising campaign UI sections:', {
          showMetrics: 'Raised, Donations, Donors, Goal Progress',
          showSweepstakes: !!sweepstakesData?.entries,
          showDonationTable: !!analytics?.donationsByDate,
          hiddenSections: ['Share Analytics', 'Referral Tracking', 'Shares by Channel'],
        })
      } else if (campaign?.campaign_type === 'sharing') {
        console.log('📊 [Analytics] Sharing campaign UI sections:', {
          showMetrics: 'Total Shares, Total Raised, Conversion Rate, Active Sharers',
          showSweepstakes: !!sweepstakesData?.entries,
          showShareAnalytics: true,
          showReferralTracking: true,
          showSharesByChannel: !!analytics?.sharesByChannel,
          hiddenSections: ['Recent Donations Table'],
        })
      }
    }
  }, [isLoading, campaignLoading, analyticsLoading, id, campaign, analytics, sweepstakesData, goalProgressPercentage])

  // Handle publish/activate campaign
  const handlePublish = () => {
    try {
      setPublishError(null)
      setPublishSuccess(false)
      publishCampaign(id, {
        onSuccess: () => {
          console.log('✅ [Analytics] Campaign published successfully', { campaignId: id })
          setPublishSuccess(true)
          // Refetch campaign to update status
          refetchCampaign()
          // Hide success message after 5 seconds
          setTimeout(() => setPublishSuccess(false), 5000)
        },
        onError: (error: any) => {
          const errorMessage = error?.response?.data?.message || error?.message || 'Failed to publish campaign'
          console.error('❌ [Analytics] Failed to publish campaign', { campaignId: id, error: errorMessage })
          setPublishError(errorMessage)
        },
      })
    } catch (error: any) {
      setPublishError(error?.message || 'An error occurred')
    }
  }

  // NOW render with conditional logic in JSX only
  return (
    <ProtectedRoute allowedRoles={['creator']}>
      <Container>
        {isLoading && <SkeletonLoader />}

        {campaignError && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '400px' }}>
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <h2 style={{ color: '#EF4444', marginBottom: '1rem' }}>Unable to Load Campaign</h2>
              <p style={{ color: '#6B7280', marginBottom: '1.5rem' }}>
                {campaignError?.message || 'Failed to load campaign data'}
              </p>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                <Button as="link" href="/campaigns" variant="outline">
                  ← Back to Campaigns
                </Button>
                <Button onClick={() => refetchCampaign()} variant="primary">
                  Retry
                </Button>
              </div>
            </div>
          </div>
        )}

        {!isLoading && !campaignError && !campaign && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '400px' }}>
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <p style={{ marginBottom: '1rem', fontSize: '18px' }}>Campaign not found</p>
              <Button as="link" href="/campaigns">← Back to Campaigns</Button>
            </div>
          </div>
        )}

        {!isLoading && !campaignError && campaign && (
          <>
            {/* Page Header */}
            <PageHeader>
              <HeaderContent>
                <PageTitle>📊 {campaign.title} Analytics</PageTitle>
                <PageSubtitle>
                  Track{' '}
                  {campaign.campaign_type === 'fundraising'
                    ? 'donations, supporters, and fundraising progress'
                    : 'shares, conversions, and referral performance'}{' '}
                  for your campaign
                </PageSubtitle>
                {campaign.status === 'draft' && (
                  <DraftBadgeBox>
                    <Badge variant="warning">Draft - Not Published</Badge>
                  </DraftBadgeBox>
                )}
              </HeaderContent>
              <Actions>
                {campaign.status === 'draft' && (
                  <Button
                    onClick={handlePublish}
                    disabled={isPublishing}
                    variant="primary"
                    style={{ whiteSpace: 'nowrap' }}
                  >
                    {isPublishing ? 'Publishing...' : '🚀 Activate Campaign'}
                  </Button>
                )}
                <Button as="link" href={`/campaigns/${id}`} variant="outline">
                  ← Back to Campaign
                </Button>
                <CsvExportButton
                  data={csvData}
                  filename={`${campaign.title}-analytics.csv`}
                  label="Export CSV"
                  variant="primary"
                />
              </Actions>
            </PageHeader>

            {/* Success Message */}
            {publishSuccess && (
              <SuccessBox>
                <SuccessText>
                  ✅ Campaign activated successfully! Your campaign is now live and visible to supporters.
                </SuccessText>
              </SuccessBox>
            )}

            {/* Error Message */}
            {publishError && (
              <ErrorBox>
                <ErrorText>
                  ❌ Failed to activate campaign: {publishError}
                </ErrorText>
              </ErrorBox>
            )}

            {/* Info Box */}
            <InfoBox>
              <InfoText>
                📈 Real-time analytics updated every 5 minutes. Last updated:{' '}
                {analytics?.lastUpdated
                  ? new Date(analytics.lastUpdated).toLocaleTimeString()
                  : 'N/A'}
              </InfoText>
            </InfoBox>

            {/* Key Metrics - Fundraising Only */}
            {campaign.campaign_type === 'fundraising' && (
              <Section>
                <SectionGrid>
                  <StatCard>
                    <StatLabel>💰 Total Raised</StatLabel>
                    <StatValue>{currencyUtils.formatCurrency(raisedAmountCents)}</StatValue>
                    <div style={{ marginTop: '8px', fontSize: '13px', color: '#6b7280' }}>
                      {parseFloat(goalProgressPercentage.toFixed(2))}% of{' '}
                      {currencyUtils.formatCurrency(goalAmountCents)}
                    </div>
                  </StatCard>

                  <StatCard>
                    <StatLabel>❤️ Total Donations</StatLabel>
                    <StatValue>{analytics?.totalDonations ?? 0}</StatValue>
                    <div style={{ marginTop: '8px', fontSize: '13px', color: '#6b7280' }}>
                      Avg:{' '}
                      {(analytics?.totalDonations ?? 0) > 0
                        ? currencyUtils.formatCurrency(analytics?.averageDonation ?? 0)
                        : '$0.00'}
                    </div>
                  </StatCard>

                  <StatCard>
                    <StatLabel>👥 Unique Donors</StatLabel>
                    <StatValue>{analytics?.uniqueDonors ?? 0}</StatValue>
                    <div style={{ marginTop: '8px', fontSize: '13px', color: '#6b7280' }}>
                      Supporting this campaign
                    </div>
                  </StatCard>

                  <StatCard>
                    <StatLabel>🎯 Goal Progress</StatLabel>
                    <StatValue>{parseFloat(goalProgressPercentage.toFixed(2))}%</StatValue>
                    <div style={{ marginTop: '8px', fontSize: '13px', color: '#6b7280' }}>
                      Towards {currencyUtils.formatCurrency(goalAmountCents)}
                    </div>
                  </StatCard>
                </SectionGrid>
              </Section>
            )}

            {/* Campaign Metrics Cards - Fundraising Only */}

            {campaign.campaign_type === 'fundraising' && (
              <Section>
                <SectionTitle>📊 Campaign Performance</SectionTitle>
                <CampaignMetricsCards
                  analytics={analytics}
                  sweepstakesEntries={sweepstakesData?.entries?.total || 0}
                />
              </Section>
            )}

            {/* Share Analytics Dashboard - Moved to top for sharing campaigns */}
            {campaign.campaign_type === 'sharing' && (
              <Section>
                <SectionTitle>💰 Share Analytics Dashboard</SectionTitle>
                <Card style={{ padding: '24px' }}>
                  <ShareAnalyticsDashboard analytics={analytics} campaign={campaign} />
                </Card>
              </Section>
            )}

            {/* QR Code & Flyer Generation */}
            <Section>
              <SectionTitle>📲 QR Code & Flyer</SectionTitle>
              <QRFlyer>
                <QRFlyerGrid>
                  <QRFlyerContent>
                    <h3>Generate Campaign QR Code</h3>
                    <p>
                      Create a QR code and downloadable flyer for physical distribution. Perfect for
                      in-store displays, posters, and print materials.
                    </p>
                    <FlyerBuilder
                      campaignId={id}
                      campaignTitle={campaign.title}
                      campaignDescription={campaign.description}
                      creatorName={campaign.creator_name}
                    />
                  </QRFlyerContent>
                </QRFlyerGrid>
              </QRFlyer>
            </Section>

            {/* Referral Tracking Analytics */}
            {campaign.campaign_type === 'sharing' && (
              <Section>
                <SectionTitle>🔗 Referral Tracking & Conversions</SectionTitle>
                <Card style={{ padding: '24px' }}>
                  <ReferralAnalyticsDashboard campaignId={id} />
                </Card>
              </Section>
            )}

            {/* QR Code Analytics */}
            <Section>
              <SectionTitle>📊 QR Code Scan Analytics</SectionTitle>
              <Card style={{ padding: '24px' }}>
                <QRAnalyticsDashboard campaignId={id} />
              </Card>
            </Section>

            {/* Prayer Support Analytics - Shows if prayer support is enabled */}
            {campaign.prayer_config?.enabled && (
              <Section>
                <SectionTitle>🙏 Prayer Support Analytics</SectionTitle>
                <Card style={{ padding: '24px' }}>
                  <PrayerAnalyticsDashboard campaignId={id} campaignTitle={campaign.title} />
                </Card>
              </Section>
            )}

            {/* Activity Feed - Only for Fundraising Campaigns */}
            {campaign.campaign_type === 'fundraising' && analytics?.donationsByDate && analytics.donationsByDate.length > 0 && (
              <Section>
                <SectionTitle>📈 Recent Donations</SectionTitle>
                <Card style={{ padding: '20px' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                        <th
                          style={{
                            textAlign: 'left',
                            padding: '12px',
                            fontSize: '13px',
                            fontWeight: 600,
                            color: '#6b7280',
                          }}
                        >
                          Date
                        </th>
                        <th
                          style={{
                            textAlign: 'center',
                            padding: '12px',
                            fontSize: '13px',
                            fontWeight: 600,
                            color: '#6b7280',
                          }}
                        >
                          Count
                        </th>
                        <th
                          style={{
                            textAlign: 'right',
                            padding: '12px',
                            fontSize: '13px',
                            fontWeight: 600,
                            color: '#6b7280',
                          }}
                        >
                          Amount
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {(analytics as any)?.donationsByDate
                        ?.slice(0, 10)
                        .map((day: any, index: number) => (
                          <tr key={index} style={{ borderBottom: '1px solid #e5e7eb' }}>
                            <td style={{ padding: '12px' }}>
                              {new Date(day.date).toLocaleDateString()}
                            </td>
                            <td style={{ textAlign: 'center', padding: '12px' }}>
                              {day.count}
                            </td>
                            <td style={{ textAlign: 'right', padding: '12px', fontWeight: 600 }}>
                              {currencyUtils.formatCurrency(day.amount)}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </Card>
              </Section>
            )}
          </>
        )}
      </Container>
    </ProtectedRoute>
  )
}
