'use client'

import React, { useMemo } from 'react'
import styled from 'styled-components'
import { useCampaigns } from '@/api/hooks/useCampaigns'
import { useAuthStore } from '@/store/authStore'
import { useRouter } from 'next/navigation'
import { DollarSign, ChevronLeft } from 'lucide-react'

const PageWrapper = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 2rem;
`

const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
`

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2rem;

  h1 {
    font-size: 2rem;
    font-weight: 700;
    color: #1a1a1a;
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .breadcrumb {
    display: flex;
    gap: 8px;
    align-items: center;
    color: #666;
    font-size: 0.9rem;
    margin-bottom: 12px;

    button {
      background: none;
      border: none;
      color: #0066cc;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 4px;

      &:hover {
        text-decoration: underline;
      }
    }
  }
`

const CampaignSelector = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  margin-bottom: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 600;
    color: #333;
  }

  select {
    width: 100%;
    padding: 0.75rem;
    border: 2px solid #e0e0e0;
    border-radius: 8px;
    font-size: 1rem;
    cursor: pointer;

    &:hover {
      border-color: #0066cc;
    }

    &:focus {
      outline: none;
      border-color: #0066cc;
      box-shadow: 0 0 0 3px rgba(0, 102, 204, 0.1);
    }
  }
`

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`

const StatCard = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border-left: 4px solid ${props => props.color || '#0066cc'};

  .label {
    font-size: 0.9rem;
    color: #666;
    font-weight: 500;
    margin-bottom: 0.5rem;
  }

  .value {
    font-size: 1.8rem;
    font-weight: 700;
    color: #1a1a1a;
  }

  .subtext {
    font-size: 0.8rem;
    color: #999;
    margin-top: 0.5rem;
  }
`

const FilterBar = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  align-items: center;
  flex-wrap: wrap;

  button {
    padding: 0.5rem 1rem;
    border: 2px solid ${props => props.active ? '#0066cc' : '#e0e0e0'};
    background: ${props => props.active ? '#0066cc' : 'white'};
    color: ${props => props.active ? 'white' : '#333'};
    border-radius: 8px;
    cursor: pointer;
    font-weight: 500;
    transition: all 0.2s;

    &:hover {
      border-color: #0066cc;
    }
  }
`

const RequestsTable = styled.div`
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
`

const TableHeader = styled.div`
  display: grid;
  grid-template-columns: 2fr 1.5fr 1.5fr 1fr 1fr auto;
  gap: 1rem;
  padding: 1.5rem;
  background: #f9f9f9;
  font-weight: 600;
  color: #333;
  border-bottom: 2px solid #e0e0e0;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`

const TableRow = styled.div`
  display: grid;
  grid-template-columns: 2fr 1.5fr 1.5fr 1fr 1fr auto;
  gap: 1rem;
  padding: 1.5rem;
  border-bottom: 1px solid #f0f0f0;
  align-items: center;

  &:hover {
    background: #fafafa;
  }
`

const SharerInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;

  img {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    object-fit: cover;
    background: #e0e0e0;
  }

  .details {
    h4 {
      margin: 0;
      font-size: 0.95rem;
      color: #1a1a1a;
    }

    p {
      margin: 4px 0 0 0;
      font-size: 0.85rem;
      color: #666;
    }
  }
`

const PaymentDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;

  .type {
    font-size: 0.9rem;
    font-weight: 600;
    color: #0066cc;
  }

  .details {
    font-size: 0.85rem;
    color: #666;
  }
`

const AmountColumn = styled.div`
  text-align: right;

  .amount {
    font-size: 1rem;
    font-weight: 700;
    color: #1a1a1a;
  }

  .with-fee {
    font-size: 0.8rem;
    color: #999;
    margin-top: 2px;
  }
`

const StatusBadge = styled.span`
  display: inline-block;
  padding: 0.4rem 0.8rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  
  &.pending {
    background: #fff3cd;
    color: #856404;
  }

  &.processing {
    background: #d1ecf1;
    color: #0c5460;
  }

  &.completed {
    background: #d4edda;
    color: #155724;
  }

  &.failed {
    background: #f8d7da;
    color: #721c24;
  }
`

const ActionButtons = styled.div`
  display: flex;
  gap: 0.5rem;

  button {
    padding: 0.4rem 0.8rem;
    border: none;
    background: #0066cc;
    color: white;
    border-radius: 6px;
    cursor: pointer;
    font-size: 0.8rem;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 4px;
    transition: all 0.2s;

    &:hover:not(:disabled) {
      background: #0052a3;
      transform: translateY(-1px);
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }
`

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: #666;

  svg {
    width: 64px;
    height: 64px;
    margin-bottom: 1rem;
    opacity: 0.5;
  }

  h3 {
    font-size: 1.3rem;
    margin-bottom: 0.5rem;
    color: #333;
  }

  p {
    font-size: 0.95rem;
  }
`

/**
 * Creator Sharers Payouts - Campaign Selector
 * Select which campaign's payouts to view
 */
export default function SharersPayoutsPage() {
  const router = useRouter()
  
  // Select user directly without creating new objects on each render
  // This prevents Zustand from triggering infinite re-renders
  const user = useAuthStore((state) => state.user)
  
  // Memoize the filter object to prevent infinite re-renders
  const campaignFilter = useMemo(() => {
    if (!user?.id) return {}
    return { userId: user.id }
  }, [user?.id])
  
  const { data: campaignsData, isLoading: campaignsLoading } = useCampaigns(1, 100, campaignFilter)
  
  // Filter to show only user's campaigns (memoized to prevent infinite loops)
  const userCampaigns = useMemo(() => {
    if (!campaignsData?.campaigns || !user?.id) return []
    return campaignsData.campaigns.filter((c: any) => c.creator_id === user.id)
  }, [campaignsData?.campaigns, user?.id])
  
  // Handle campaign selection - navigate to campaign-specific page
  const handleCampaignChange = (campaignId: string) => {
    if (campaignId) {
      router.push(`/creator/sharers-payouts/${campaignId}`)
    }
  }

  return (
    <PageWrapper>
      <Container>
        <Header>
          <div>
            <div className="breadcrumb">
              <button onClick={() => router.back()}>
                <ChevronLeft size={16} /> Back
              </button>
            </div>
            <h1>
              <DollarSign size={32} />
              Sharers Payouts
            </h1>
          </div>
        </Header>

        <CampaignSelector>
          <label htmlFor="campaign-select">Select a Campaign to Manage Payouts</label>
          <select
            id="campaign-select"
            onChange={(e) => handleCampaignChange(e.target.value)}
            disabled={campaignsLoading}
            defaultValue=""
          >
            <option value="">
              {campaignsLoading ? 'Loading campaigns...' : 'Choose a campaign...'}
            </option>
            {userCampaigns?.map((campaign: any) => (
              <option key={campaign._id} value={campaign._id}>
                {campaign.title}
              </option>
            ))}
          </select>
          {userCampaigns?.length === 0 && !campaignsLoading && (
            <p style={{ marginTop: '1rem', color: '#999', fontSize: '0.9rem' }}>
              You haven't created any campaigns yet. Create one to manage sharers' payouts.
            </p>
          )}
        </CampaignSelector>

        {userCampaigns?.length === 0 && !campaignsLoading && (
          <EmptyState>
            <DollarSign />
            <h3>No Campaigns Yet</h3>
            <p>Create a campaign to start receiving shares and managing payouts.</p>
          </EmptyState>
        )}
      </Container>
    </PageWrapper>
  )
}
