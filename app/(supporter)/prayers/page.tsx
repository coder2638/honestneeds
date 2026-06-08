'use client'

import styled from 'styled-components'
import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { usePrayerHistory } from '@/api/hooks/usePrayers'
import { Heart, Trash2, AlertCircle } from 'lucide-react'
import { toast } from 'react-toastify'

const PageContainer = styled.div`
  min-height: 100vh;
  background-color: #f8fafc;
  padding: 2rem 1rem;
`

const ContentWrapper = styled.div`
  max-width: 1000px;
  margin: 0 auto;
`

const PageHeader = styled.div`
  margin-bottom: 2.5rem;
`

const PageTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 0.5rem 0;
  display: flex;
  align-items: center;
  gap: 0.75rem;

  @media (max-width: 640px) {
    font-size: 1.5rem;
  }
`

const PageDescription = styled.p`
  color: #64748b;
  margin: 0;
  font-size: 1rem;
`

const FilterContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  align-items: center;

  @media (max-width: 640px) {
    flex-direction: column;
    gap: 0.75rem;
  }
`

const FilterSelect = styled.select`
  padding: 0.625rem 1rem;
  border-radius: 6px;
  border: 1px solid #e2e8f0;
  background-color: white;
  color: #0f172a;
  font-weight: 500;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: #cbd5e1;
  }

  &:focus {
    outline: none;
    border-color: #6366f1;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
  }

  @media (max-width: 640px) {
    width: 100%;
  }
`

const PrayerCard = styled.div`
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 1rem;
  transition: all 0.2s ease;

  &:hover {
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    border-color: #cbd5e1;
  }

  @media (max-width: 640px) {
    padding: 1rem;
  }
`

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: start;
  margin-bottom: 1rem;
  gap: 1rem;

  @media (max-width: 640px) {
    flex-direction: column;
  }
`

const CardTitle = styled.div`
  flex: 1;
`

const CampaignName = styled.a`
  display: inline-block;
  font-size: 0.9rem;
  color: #6366f1;
  text-decoration: none;
  font-weight: 600;
  margin-bottom: 0.25rem;

  &:hover {
    text-decoration: underline;
  }
`

const PrayerType = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  color: #64748b;
  margin-bottom: 0.5rem;

  .emoji {
    font-size: 1.1rem;
  }
`

const Timestamp = styled.span`
  font-size: 0.8rem;
  color: #94a3b8;
`

const StatusBadge = styled.span<{ status: string }>`
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
  white-space: nowrap;

  ${(props) => {
    switch (props.status) {
      case 'Approved':
      case 'approved':
        return `background-color: #d1fae5; color: #065f46;`
      case 'Pending':
      case 'pending':
        return `background-color: #fef3c7; color: #92400e;`
      case 'Rejected':
      case 'rejected':
        return `background-color: #fee2e2; color: #991b1b;`
      case 'Flagged':
      case 'flagged':
        return `background-color: #fecaca; color: #dc2626;`
      default:
        return `background-color: #f0f0f0; color: #4b5563;`
    }
  }};
`

const CardContent = styled.div`
  margin-bottom: 1rem;
`

const PrayerContent = styled.p`
  color: #374151;
  font-size: 0.95rem;
  line-height: 1.5;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  word-break: break-word;
`

const CardFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #f1f5f9;

  @media (max-width: 640px) {
    flex-direction: column;
    gap: 0.75rem;
  }
`

const MetaInfo = styled.div`
  font-size: 0.8rem;
  color: #64748b;
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
`

const ActionButton = styled.button`
  padding: 0.5rem 1rem;
  border-radius: 6px;
  border: 1px solid #e2e8f0;
  background-color: #f8fafc;
  color: #dc2626;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    background-color: #fee2e2;
    border-color: #fecaca;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  @media (max-width: 640px) {
    width: 100%;
    justify-content: center;
  }
`

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem 1rem;
`

const EmptyIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
  opacity: 0.6;
`

const EmptyTitle = styled.h2`
  color: #0f172a;
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
`

const EmptyDescription = styled.p`
  color: #64748b;
  font-size: 1rem;
  margin: 0 0 1.5rem 0;
`

const EmptyButton = styled.a`
  display: inline-block;
  padding: 0.75rem 1.5rem;
  background-color: #6366f1;
  color: white;
  text-decoration: none;
  border-radius: 6px;
  font-weight: 600;
  transition: all 0.2s ease;

  &:hover {
    background-color: #4f46e5;
  }
`

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;

  @media (max-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
  }
`

const StatCard = styled.div`
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 1rem;
  text-align: center;
`

const StatValue = styled.div`
  font-size: 1.75rem;
  font-weight: 700;
  color: #6366f1;
  margin-bottom: 0.25rem;
`

const StatLabel = styled.div`
  font-size: 0.85rem;
  color: #64748b;
  font-weight: 500;
`

interface Prayer {
  id: string
  campaignId: string
  campaignTitle: string
  prayerType: 'tap' | 'text' | 'voice' | 'video'
  content?: string
  status: 'pending' | 'approved' | 'rejected' | 'flagged'
  submittedAt: string
  anonymous?: boolean
}

export default function SupporterPrayersPage() {
  const router = useRouter()
  const [sortBy, setSortBy] = useState('newest')
  const [filterStatus, setFilterStatus] = useState('all')
  const [selectedCampaignFilter, setSelectedCampaignFilter] = useState('all')

  // Mock data - in production, this would come from the API
  const prayers: Prayer[] = [
    {
      id: '1',
      campaignId: 'camp1',
      campaignTitle: 'Help for Hurricane Relief',
      prayerType: 'text',
      content: 'Sending thoughts and prayers to all those affected by this disaster. May this campaign reach its goal quickly.',
      status: 'approved',
      submittedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      anonymous: false,
    },
    {
      id: '2',
      campaignId: 'camp2',
      campaignTitle: 'Medical Emergency Support',
      prayerType: 'tap',
      content: 'Quick prayer',
      status: 'approved',
      submittedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      anonymous: true,
    },
    {
      id: '3',
      campaignId: 'camp1',
      campaignTitle: 'Help for Hurricane Relief',
      prayerType: 'voice',
      content: '[Voice prayer recorded]',
      status: 'pending',
      submittedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      anonymous: false,
    },
  ]

  // Filter and sort
  const filteredAndSortedPrayers = useMemo(() => {
    let result = [...prayers]

    // Filter by status
    if (filterStatus !== 'all') {
      result = result.filter((p) => p.status === filterStatus)
    }

    // Filter by campaign
    if (selectedCampaignFilter !== 'all') {
      result = result.filter((p) => p.campaignId === selectedCampaignFilter)
    }

    // Sort
    if (sortBy === 'newest') {
      result.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())
    } else if (sortBy === 'oldest') {
      result.sort((a, b) => new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime())
    } else if (sortBy === 'campaign') {
      result.sort((a, b) => a.campaignTitle.localeCompare(b.campaignTitle))
    }

    return result
  }, [prayers, sortBy, filterStatus, selectedCampaignFilter])

  // Calculate stats
  const stats = useMemo(
    () => ({
      total: prayers.length,
      approved: prayers.filter((p) => p.status === 'approved').length,
      pending: prayers.filter((p) => p.status === 'pending').length,
      flagged: prayers.filter((p) => p.status === 'flagged').length,
    }),
    [prayers]
  )

  // Get unique campaigns for filtering
  const uniqueCampaigns = useMemo(
    () => [...new Map(prayers.map((p) => [p.campaignId, { id: p.campaignId, title: p.campaignTitle }])).values()],
    [prayers]
  )

  const prayerTypeEmoji = {
    tap: '👆',
    text: '✍️',
    voice: '🎙️',
    video: '🎥',
  }

  const formatTime = (date: string) => {
    const diff = Date.now() - new Date(date).getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return 'just now'
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    if (days < 7) return `${days}d ago`
    return new Date(date).toLocaleDateString()
  }

  const handleDeletePrayer = (prayerId: string) => {
    if (confirm('Are you sure you want to delete this prayer?')) {
      toast.success('Prayer deleted successfully')
      // In production, call API to delete prayer
    }
  }

  return (
    <ProtectedRoute>
      <PageContainer>
        <ContentWrapper>
          {/* Header */}
          <PageHeader>
            <PageTitle>
              <Heart size={32} /> My Prayers
            </PageTitle>
            <PageDescription>View and manage all the prayers you've submitted to campaigns</PageDescription>
          </PageHeader>

          {/* Stats */}
          <StatsGrid>
            <StatCard>
              <StatValue>{stats.total}</StatValue>
              <StatLabel>Total Prayers</StatLabel>
            </StatCard>
            <StatCard>
              <StatValue>{stats.approved}</StatValue>
              <StatLabel>Approved</StatLabel>
            </StatCard>
            <StatCard>
              <StatValue>{stats.pending}</StatValue>
              <StatLabel>Pending</StatLabel>
            </StatCard>
            <StatCard>
              <StatValue>{stats.flagged}</StatValue>
              <StatLabel>Flagged</StatLabel>
            </StatCard>
          </StatsGrid>

          {/* Filters */}
          <FilterContainer>
            <FilterSelect value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="campaign">By Campaign</option>
            </FilterSelect>

            <FilterSelect value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
              <option value="all">All Status</option>
              <option value="approved">Approved</option>
              <option value="pending">Pending Review</option>
              <option value="flagged">Flagged</option>
              <option value="rejected">Rejected</option>
            </FilterSelect>

            <FilterSelect value={selectedCampaignFilter} onChange={(e) => setSelectedCampaignFilter(e.target.value)}>
              <option value="all">All Campaigns</option>
              {uniqueCampaigns.map((campaign) => (
                <option key={campaign.id} value={campaign.id}>
                  {campaign.title}
                </option>
              ))}
            </FilterSelect>
          </FilterContainer>

          {/* Prayers List */}
          {filteredAndSortedPrayers.length > 0 ? (
            <div>
              {filteredAndSortedPrayers.map((prayer) => (
                <PrayerCard key={prayer.id}>
                  <CardHeader>
                    <CardTitle>
                      <CampaignName href={`/campaigns/${prayer.campaignId}`}>{prayer.campaignTitle}</CampaignName>
                      <PrayerType>
                        <span className="emoji">{prayerTypeEmoji[prayer.prayerType]}</span>
                        <span>{prayer.prayerType.charAt(0).toUpperCase() + prayer.prayerType.slice(1)} Prayer</span>
                      </PrayerType>
                      <Timestamp>{formatTime(prayer.submittedAt)}</Timestamp>
                    </CardTitle>
                    <StatusBadge status={prayer.status}>{prayer.status.charAt(0).toUpperCase() + prayer.status.slice(1)}</StatusBadge>
                  </CardHeader>

                  <CardContent>
                    {prayer.content && prayer.prayerType !== 'tap' && (
                      <PrayerContent>{prayer.content}</PrayerContent>
                    )}
                    {prayer.prayerType === 'tap' && <PrayerContent>Quick prayer submitted</PrayerContent>}
                  </CardContent>

                  <CardFooter>
                    <MetaInfo>
                      {prayer.anonymous && <span>🔒 Anonymous</span>}
                      <span>{new Date(prayer.submittedAt).toLocaleDateString()}</span>
                    </MetaInfo>
                    {prayer.status === 'pending' && (
                      <ActionButton onClick={() => handleDeletePrayer(prayer.id)}>
                        <Trash2 size={16} />
                        Delete
                      </ActionButton>
                    )}
                  </CardFooter>
                </PrayerCard>
              ))}
            </div>
          ) : (
            <EmptyState>
              <EmptyIcon>🙏</EmptyIcon>
              <EmptyTitle>No prayers yet</EmptyTitle>
              <EmptyDescription>You haven't submitted any prayers to campaigns. Start praying for causes you care about!</EmptyDescription>
              <EmptyButton href="/campaigns">Browse Campaigns</EmptyButton>
            </EmptyState>
          )}
        </ContentWrapper>
      </PageContainer>
    </ProtectedRoute>
  )
}
