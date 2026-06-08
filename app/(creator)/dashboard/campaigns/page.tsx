'use client'

import React, { useState, useMemo } from 'react'
import styled from 'styled-components'
import { useRouter } from 'next/navigation'
import {
  Plus,
  Search,
  Filter,
  MoreVertical,
  Edit2,
  Trash2,
  Play,
  Pause,
  CheckCircle,
  AlertCircle,
  Loader,
} from 'lucide-react'
import { useCampaigns, useDeleteCampaign, usePublishCampaign, usePauseCampaign } from '@/api/hooks/useCampaigns'
import { useAuthStore } from '@/store/authStore'

// Styled Components
const PageWrapper = styled.div`
  background: #F7F5F1;
  min-height: 100vh;
  width: 100%;
`

const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 32px 24px;
`

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
  gap: 16px;
  flex-wrap: wrap;
`

const PageTitle = styled.h1`
  font-size: 32px;
  font-weight: 700;
  color: #111827;
  margin: 0;
`

const CreateButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s ease;

  &:hover {
    background: #2563eb;
  }
`

const ControlsBar = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`

const SearchInput = styled.input`
  flex: 1;
  min-width: 250px;
  padding: 12px 16px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
  transition: border-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`

const FilterButton = styled.button<{ active?: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border: 1px solid ${(props) => (props.active ? '#3b82f6' : '#d1d5db')};
  background: ${(props) => (props.active ? '#eff6ff' : 'white')};
  color: ${(props) => (props.active ? '#3b82f6' : '#6b7280')};
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  text-transform: uppercase;
  letter-spacing: 0.5px;

  &:hover {
    border-color: #3b82f6;
    background: #eff6ff;
  }
`

const StatsBar = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
`

const StatCard = styled.div`
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 16px;
  text-align: center;
`

const StatValue = styled.div`
  font-size: 28px;
  font-weight: 700;
  color: #3b82f6;
  margin-bottom: 4px;
`

const StatLabel = styled.div`
  font-size: 12px;
  color: #6b7280;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`

const CampaignGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 24px;
  margin-bottom: 24px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`

const CampaignCard = styled.div`
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.2s ease;

  &:hover {
    border-color: #3b82f6;
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.1);
  }
`

const CardImage = styled.div`
  width: 100%;
  height: 200px;
  background: linear-gradient(135deg, #e5e7eb 0%, #f3f4f6 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 48px;
  color: #d1d5db;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`

const CardContent = styled.div`
  padding: 16px;
`

const CardTitle = styled.h3`
  font-size: 16px;
  font-weight: 700;
  color: #111827;
  margin: 0 0 8px 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`

const CardDescription = styled.p`
  font-size: 13px;
  color: #6b7280;
  margin: 0 0 12px 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`

const CardMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  flex-wrap: wrap;
  gap: 8px;
`

const StatusBadge = styled.span<{ status: string }>`
  display: inline-block;
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  background-color: ${(props) => {
    switch (props.status) {
      case 'draft':
        return '#f3f4f6'
      case 'active':
        return '#dcfce7'
      case 'paused':
        return '#fef3c7'
      case 'completed':
        return '#dbeafe'
      case 'rejected':
        return '#fee2e2'
      default:
        return '#f3f4f6'
    }
  }};
  color: ${(props) => {
    switch (props.status) {
      case 'draft':
        return '#6b7280'
      case 'active':
        return '#16a34a'
      case 'paused':
        return '#d97706'
      case 'completed':
        return '#0369a1'
      case 'rejected':
        return '#dc2626'
      default:
        return '#6b7280'
    }
  }};
`

const CardType = styled.span`
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 600;
  background: #eff6ff;
  color: #0369a1;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`

const CardMetrics = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 12px;
  padding: 12px;
  background: #f9fafb;
  border-radius: 6px;
  font-size: 12px;
`

const Metric = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`

const MetricLabel = styled.span`
  color: #6b7280;
  font-weight: 500;
`

const MetricValue = styled.span`
  color: #111827;
  font-weight: 700;
`

const CardActions = styled.div`
  display: flex;
  gap: 8px;
  padding-top: 12px;
  border-top: 1px solid #e5e7eb;
`

const ActionButton = styled.button<{ variant?: 'primary' | 'secondary' | 'danger' }>`
  flex: 1;
  padding: 8px 12px;
  border: 1px solid ${(props) => {
    switch (props.variant) {
      case 'danger':
        return '#fca5a5'
      default:
        return '#d1d5db'
    }
  }};
  background: ${(props) => {
    switch (props.variant) {
      case 'primary':
        return '#3b82f6'
      case 'danger':
        return '#fee2e2'
      default:
        return 'white'
    }
  }};
  color: ${(props) => {
    switch (props.variant) {
      case 'primary':
        return 'white'
      case 'danger':
        return '#dc2626'
      default:
        return '#374151'
    }
  }};
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  transition: all 0.2s ease;

  &:hover {
    opacity: 0.8;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`

const DropdownMenu = styled.div<{ open?: boolean }>`
  position: relative;
  display: inline-block;

  ${(props) =>
    props.open &&
    `
    [data-dropdown-content] {
      display: block;
    }
  `}
`

const DropdownContent = styled.div`
  display: none;
  position: absolute;
  right: 0;
  top: 100%;
  z-index: 1000;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  min-width: 160px;
  margin-top: 4px;
`

const DropdownItem = styled.button<{ isDanger?: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 10px 16px;
  border: none;
  background: transparent;
  color: ${(props) => (props.isDanger ? '#dc2626' : '#374151')};
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  text-align: left;

  &:hover {
    background: ${(props) => (props.isDanger ? '#fee2e2' : '#f3f4f6')};
  }

  &:first-child {
    border-radius: 8px 8px 0 0;
  }

  &:last-child {
    border-radius: 0 0 8px 8px;
  }
`

const EmptyState = styled.div`
  text-align: center;
  padding: 64px 24px;
  background: white;
  border: 1px dashed #e5e7eb;
  border-radius: 12px;
`

const EmptyIcon = styled.div`
  font-size: 64px;
  margin-bottom: 16px;
`

const EmptyTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: #111827;
  margin: 0 0 8px 0;
`

const EmptyMessage = styled.p`
  font-size: 14px;
  color: #6b7280;
  margin: 0 0 24px 0;
`

const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 64px 24px;
  gap: 12px;
  color: #6b7280;
`

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  margin-top: 32px;
`

const PaginationButton = styled.button<{ active?: boolean; disabled?: boolean }>`
  padding: 8px 12px;
  border: 1px solid ${(props) => (props.active ? '#3b82f6' : '#d1d5db')};
  background: ${(props) => (props.active ? '#3b82f6' : 'white')};
  color: ${(props) => (props.active ? 'white' : '#374151')};
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
  cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};
  opacity: ${(props) => (props.disabled ? 0.5 : 1)};

  &:hover:not(:disabled) {
    border-color: #3b82f6;
    background: #eff6ff;
    color: #3b82f6;
  }
`

// Main Component
type StatusFilterType = 'all' | 'draft' | 'active' | 'paused' | 'completed' | 'rejected'

export default function CreatorCampaignsPage() {
  const router = useRouter()
  const { user } = useAuthStore()
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilterType>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const [showFilterDropdown, setShowFilterDropdown] = useState(false)

  // Fetch campaigns for current user
  const { data: campaignsData, isLoading, error, refetch } = useCampaigns(
    currentPage,
    12,
    { userId: user?.id }
  )

  // Mutations
  const deleteMutation = useDeleteCampaign()
  const publishMutation = usePublishCampaign()
  const pauseMutation = usePauseCampaign()

  // Filter campaigns
  const filteredCampaigns = useMemo(() => {
    if (!campaignsData?.campaigns) return []

    return campaignsData.campaigns.filter((campaign) => {
      const matchesSearch =
        campaign.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        campaign.description.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesStatus = statusFilter === 'all' || campaign.status === statusFilter

      return matchesSearch && matchesStatus
    })
  }, [campaignsData?.campaigns, searchQuery, statusFilter])

  // Calculate stats
  const stats = useMemo(() => {
    if (!campaignsData?.campaigns) return { total: 0, active: 0, draft: 0, completed: 0 }

    return {
      total: campaignsData.campaigns.length,
      active: campaignsData.campaigns.filter((c) => c.status === 'active').length,
      draft: campaignsData.campaigns.filter((c) => c.status === 'draft').length,
      completed: campaignsData.campaigns.filter((c) => c.status === 'completed').length,
    }
  }, [campaignsData?.campaigns])

  // Action handlers
  const handleEdit = (campaignId: string) => {
    router.push(`/dashboard/campaigns/${campaignId}/edit`)
  }

  const handleDelete = async (campaignId: string) => {
    if (window.confirm('Are you sure you want to delete this campaign?')) {
      try {
        await deleteMutation.mutateAsync(campaignId)
        refetch()
      } catch (err) {
        console.error('Delete failed:', err)
      }
    }
  }

  const handleActivate = async (campaignId: string) => {
    try {
      await publishMutation.mutateAsync(campaignId)
      refetch()
    } catch (err) {
      console.error('Activation failed:', err)
    }
  }

  const handlePause = async (campaignId: string) => {
    try {
      await pauseMutation.mutateAsync(campaignId)
      refetch()
    } catch (err) {
      console.error('Pause failed:', err)
    }
  }

  const handleViewAnalytics = (campaignId: string) => {
    router.push(`/campaigns/${campaignId}/analytics`)
  }

  // Render action buttons based on status
  const getActionButtons = (campaign: any) => {
    return null
  }

  if (isLoading) {
    return (
      <PageWrapper>
        <PageContainer>
          <LoadingContainer>
            <Loader size={24} className="animate-spin" />
            Loading your campaigns...
          </LoadingContainer>
        </PageContainer>
      </PageWrapper>
    )
  }

  if (error) {
    return (
      <PageWrapper>
        <PageContainer>
          <EmptyState>
            <AlertCircle size={48} style={{ color: '#dc2626', marginBottom: '16px' }} />
            <EmptyTitle>Failed to Load Campaigns</EmptyTitle>
            <EmptyMessage>Please refresh and try again</EmptyMessage>
            <CreateButton onClick={() => refetch()}>Try Again</CreateButton>
          </EmptyState>
        </PageContainer>
      </PageWrapper>
    )
  }

  return (
    <PageWrapper>
      <PageContainer>
        {/* Header */}
        <Header>
          <PageTitle>My Campaigns</PageTitle>
          <CreateButton onClick={() => router.push('/campaigns/new')}>
            <Plus size={18} />
            Create Campaign
          </CreateButton>
        </Header>

      {/* Stats */}
      <StatsBar>
        <StatCard>
          <StatValue>{stats.total}</StatValue>
          <StatLabel>Total Campaigns</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{stats.active}</StatValue>
          <StatLabel>Active</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{stats.draft}</StatValue>
          <StatLabel>Drafts</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{stats.completed}</StatValue>
          <StatLabel>Completed</StatLabel>
        </StatCard>
      </StatsBar>

      {/* Controls */}
      <ControlsBar>
        <SearchInput
          type="text"
          placeholder="Search campaigns by title or description..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value)
            setCurrentPage(1)
          }}
        />
      </ControlsBar>

      {/* Status Filter Dropdown */}
      <ControlsBar>
        <DropdownMenu open={showFilterDropdown}>
          <FilterButton
            onClick={() => setShowFilterDropdown(!showFilterDropdown)}
            style={{ width: '160px' }}
          >
            <Filter size={14} />
            {statusFilter === 'all' ? 'All' : statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)}
          </FilterButton>
          <DropdownContent data-dropdown-content>
            <DropdownItem
              onClick={() => {
                setStatusFilter('all')
                setCurrentPage(1)
                setShowFilterDropdown(false)
              }}
            >
              All
            </DropdownItem>
            <DropdownItem
              onClick={() => {
                setStatusFilter('draft')
                setCurrentPage(1)
                setShowFilterDropdown(false)
              }}
            >
              Draft
            </DropdownItem>
            <DropdownItem
              onClick={() => {
                setStatusFilter('active')
                setCurrentPage(1)
                setShowFilterDropdown(false)
              }}
            >
              Active
            </DropdownItem>
            <DropdownItem
              onClick={() => {
                setStatusFilter('paused')
                setCurrentPage(1)
                setShowFilterDropdown(false)
              }}
            >
              Paused
            </DropdownItem>
            <DropdownItem
              onClick={() => {
                setStatusFilter('completed')
                setCurrentPage(1)
                setShowFilterDropdown(false)
              }}
            >
              Completed
            </DropdownItem>
            <DropdownItem
              onClick={() => {
                setStatusFilter('rejected')
                setCurrentPage(1)
                setShowFilterDropdown(false)
              }}
            >
              Rejected
            </DropdownItem>
          </DropdownContent>
        </DropdownMenu>
      </ControlsBar>

      {/* Campaigns Grid */}
      {filteredCampaigns.length === 0 ? (
        <EmptyState>
          <EmptyIcon>📋</EmptyIcon>
          <EmptyTitle>No campaigns found</EmptyTitle>
          <EmptyMessage>
            {searchQuery || statusFilter !== 'all'
              ? 'Try adjusting your filters or search'
              : 'Create your first campaign to get started'}
          </EmptyMessage>
          <CreateButton onClick={() => router.push('/campaigns/new')}>
            <Plus size={18} />
            Create Campaign
          </CreateButton>
        </EmptyState>
      ) : (
        <>
          <CampaignGrid>
            {filteredCampaigns.map((campaign) => (
              <CampaignCard key={campaign._id}>
                <CardImage>
                  {campaign.image_url ? (
                    <img src={campaign.image_url} alt={campaign.title} />
                  ) : (
                    '🎯'
                  )}
                </CardImage>

                <CardContent>
                  <CardMeta>
                    <StatusBadge status={campaign.status}>{campaign.status}</StatusBadge>
                    <CardType>{campaign.campaign_type === 'fundraising' ? '🎁 Fundraising' : '📱 Sharing'}</CardType>
                  </CardMeta>

                  <CardTitle>{campaign.title}</CardTitle>
                  <CardDescription>{campaign.description}</CardDescription>

                  {campaign.campaign_type === 'fundraising' && campaign.goals?.[0] && (
                    <CardMetrics>
                      <Metric>
                        <MetricLabel>Goal</MetricLabel>
                        <MetricValue>
                          ${((campaign.goals[0].target_amount || 0) / 100).toLocaleString()}
                        </MetricValue>
                      </Metric>
                      <Metric>
                        <MetricLabel>Raised</MetricLabel>
                        <MetricValue>
                          ${((campaign.goals[0].current_amount || 0) / 100).toLocaleString()}
                        </MetricValue>
                      </Metric>
                      <Metric>
                        <MetricLabel>Progress</MetricLabel>
                        <MetricValue>
                          {campaign.goals[0].target_amount > 0
                            ? Math.round((campaign.goals[0].current_amount / campaign.goals[0].target_amount) * 100)
                            : 0}
                          %
                        </MetricValue>
                      </Metric>
                    </CardMetrics>
                  )}

                  <CardActions>{getActionButtons(campaign)}</CardActions>
                </CardContent>
              </CampaignCard>
            ))}
          </CampaignGrid>

          {/* Pagination */}
          {campaignsData && campaignsData.pagination && campaignsData.pagination.totalPages > 1 && (
            <PaginationContainer>
              <PaginationButton
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                ← Previous
              </PaginationButton>
              <span style={{ color: '#6b7280', fontSize: '14px' }}>
                Page {currentPage} of {campaignsData.pagination.totalPages}
              </span>
              <PaginationButton
                disabled={currentPage === campaignsData.pagination.totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                Next →
              </PaginationButton>
            </PaginationContainer>
          )}
        </>
      )}
      </PageContainer>
    </PageWrapper>
  )
}
