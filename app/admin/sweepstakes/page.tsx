'use client'

import { useState, useEffect } from 'react'
import styled from 'styled-components'
import Link from 'next/link'
import { toast } from 'react-toastify'
import {
  Plus,
  Settings,
  Users,
  CheckCircle2,
  AlertCircle,
  X,
  Calendar,
  DollarSign,
  TrendingUp,
  Copy,
  Check,
  ChevronDown,
  Filter,
  Search,
  Loader,
} from 'lucide-react'
import {
  useCreateSweepstakes,
  useSelectWinner,
  useClaimsForSweepstakes,
  useApproveClaim,
  useRejectClaim,
  useAllSweepstakes,
} from '@/api/hooks/useSimpleSweepstakes'
import Button from '@/components/ui/Button'

// ============ STYLED COMPONENTS ============

const PageContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 2rem 1rem;
  
  @media (max-width: 640px) {
    padding: 1rem 0.5rem;
  }
`

const Content = styled.div`
  max-width: 1400px;
  margin: 0 auto;
`

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 0.75rem;
  }
`

const HeaderContent = styled.div`
  h1 {
    font-size: 2rem;
    font-weight: 700;
    color: #111827;
    margin: 0 0 0.5rem 0;
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  p {
    color: #6b7280;
    font-size: 1rem;
    margin: 0;
  }
  
  @media (max-width: 640px) {
    h1 {
      font-size: 1.5rem;
      gap: 0.5rem;
    }
    
    p {
      font-size: 0.9rem;
    }
  }
`

const HeaderActions = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;

  @media (max-width: 480px) {
    flex-direction: column;
    width: 100%;

    button {
      width: 100%;
    }
  }
`

const TabsContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 2rem;
  border-bottom: 2px solid #e5e7eb;
  overflow-x: auto;
`

const Tab = styled.button<{ active: boolean }>`
  padding: 0.75rem 1.5rem;
  background: none;
  border: none;
  font-size: 1rem;
  font-weight: 600;
  color: ${(props) => (props.active ? '#667eea' : '#6b7280')};
  border-bottom: 3px solid ${(props) => (props.active ? '#667eea' : 'transparent')};
  cursor: pointer;
  margin-bottom: -2px;
  transition: all 200ms;
  white-space: nowrap;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    color: #667eea;
  }
  
  @media (max-width: 640px) {
    padding: 0.5rem 1rem;
    font-size: 0.9rem;
  }
`

const Card = styled.div`
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin-bottom: 1.5rem;
  
  @media (max-width: 640px) {
    border-radius: 0.75rem;
    padding: 1rem;
    margin-bottom: 1rem;
  }
`

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.75rem;
  }
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }
`

const StatCard = styled.div`
  background: white;
  border-radius: 0.75rem;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  border-left: 4px solid #667eea;

  .stat-icon {
    font-size: 1.75rem;
    margin-bottom: 0.75rem;
  }

  .stat-label {
    font-size: 0.875rem;
    color: #6b7280;
    margin-bottom: 0.5rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    font-weight: 600;
  }

  .stat-value {
    font-size: 1.75rem;
    font-weight: 700;
    color: #111827;
  }

  &.prize {
    border-left-color: #f59e0b;
  }

  &.winners {
    border-left-color: #10b981;
  }

  &.pending {
    border-left-color: #f97316;
  }

  &.active {
    border-left-color: #3b82f6;
  }
  
  @media (max-width: 640px) {
    padding: 1rem;
    
    .stat-icon {
      font-size: 1.5rem;
      margin-bottom: 0.5rem;
    }
    
    .stat-label {
      font-size: 0.75rem;
      margin-bottom: 0.25rem;
    }
    
    .stat-value {
      font-size: 1.5rem;
    }
  }
`

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  label {
    font-weight: 600;
    color: #111827;
    font-size: 0.95rem;
  }

  input,
  select {
    padding: 0.75rem;
    border: 1px solid #d1d5db;
    border-radius: 0.5rem;
    font-size: 1rem;
    transition: all 200ms;

    &:focus {
      outline: none;
      border-color: #667eea;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }

    &:disabled {
      background-color: #f3f4f6;
      color: #9ca3af;
    }
  }
  
  @media (max-width: 640px) {
    label {
      font-size: 0.9rem;
    }
    
    input,
    select {
      padding: 0.65rem;
      font-size: 0.95rem;
    }
  }
`

const HelperText = styled.p`
  font-size: 0.85rem;
  color: #6b7280;
  margin-top: 0.25rem;
`

const MessageBox = styled.div<{ type: 'success' | 'error' | 'info' }>`
  padding: 1rem;
  border-radius: 0.75rem;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;

  ${(props) => {
    switch (props.type) {
      case 'success':
        return `background: #f0fdf4; border: 1px solid #86efac; color: #166534;`;
      case 'error':
        return `background: #fef2f2; border: 1px solid #fecaca; color: #991b1b;`;
      case 'info':
        return `background: #eff6ff; border: 1px solid #93c5fd; color: #0c4a6e;`;
    }
  }}

  svg {
    flex-shrink: 0;
    margin-top: 0.125rem;
  }
  
  @media (max-width: 640px) {
    padding: 0.75rem;
    margin-bottom: 1rem;
    font-size: 0.9rem;
    gap: 0.5rem;
    
    svg {
      width: 20px;
      height: 20px;
    }
  }
`

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  overflow-x: auto;

  thead {
    background: #f9fafb;
    border-bottom: 2px solid #e5e7eb;
  }

  th {
    padding: 1rem;
    text-align: left;
    font-weight: 600;
    color: #6b7280;
    font-size: 0.875rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  td {
    padding: 1rem;
    border-bottom: 1px solid #f3f4f6;
  }

  tbody tr:hover {
    background: #f9fafb;
  }

  tbody tr:last-child td {
    border-bottom: none;
  }
  
  @media (max-width: 768px) {
    font-size: 0.9rem;
    
    th, td {
      padding: 0.75rem 0.5rem;
    }
  }
  
  @media (max-width: 640px) {
    font-size: 0.8rem;
    display: block;
    
    thead {
      display: none;
    }
    
    tbody {
      display: block;
    }
    
    tr {
      display: block;
      border: 1px solid #e5e7eb;
      border-radius: 0.5rem;
      margin-bottom: 1rem;
      background: white;
    }
    
    td {
      display: block;
      padding: 0.5rem;
      border: none;
      border-bottom: 1px solid #f3f4f6;
      text-align: right;
      position: relative;
      padding-left: 40%;
    }
    
    td:last-child {
      border-bottom: none;
    }
    
    td:before {
      content: attr(data-label);
      position: absolute;
      left: 0.5rem;
      font-weight: 600;
      color: #6b7280;
      text-transform: uppercase;
      font-size: 0.75rem;
      letter-spacing: 0.5px;
    }
  }
`

const StatusBadge = styled.span<{ status: string }>`
  display: inline-block;
  padding: 0.375rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 600;

  ${(props) => {
    switch (props.status) {
      case 'active':
        return `background: #dbeafe; color: #0c4a6e;`;
      case 'completed':
        return `background: #d1fae5; color: #065f46;`;
      case 'pending':
        return `background: #fef3c7; color: #92400e;`;
      case 'approved':
        return `background: #dcfce7; color: #166534;`;
      case 'claimed':
        return `background: #dcfce7; color: #166534;`;
      case 'rejected':
        return `background: #fee2e2; color: #991b1b;`;
      case 'expired':
        return `background: #f3f4f6; color: #6b7280;`;
      default:
        return `background: #f3f4f6; color: #6b7280;`;
    }
  }}
`

const ActionButtons = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;

  button {
    padding: 0.5rem 0.75rem;
    font-size: 0.875rem;
    min-height: 36px;
  }
  
  @media (max-width: 640px) {
    flex-direction: column;
    gap: 0.5rem;
    
    button {
      padding: 0.75rem 0.5rem;
      font-size: 0.8rem;
      width: 100%;
      min-height: 40px;
    }
  }
`

const Modal = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
`

const ModalContent = styled.div`
  background: white;
  border-radius: 1rem;
  padding: 2rem;
  max-width: 600px;
  width: 100%;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  position: relative;
  max-height: 90vh;
  overflow-y: auto;
  
  @media (max-width: 640px) {
    border-radius: 0.75rem;
    padding: 1.5rem 1rem;
    max-width: calc(100% - 1rem);
  }
`

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  cursor: pointer;
  color: #6b7280;
  padding: 0.5rem;

  &:hover {
    color: #111827;
  }
`

const ModalTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: #111827;
  margin: 0 0 1.5rem 0;
  
  @media (max-width: 640px) {
    font-size: 1.25rem;
    margin: 0 0 1rem 0;
  }
`

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
  justify-content: flex-end;

  @media (max-width: 480px) {
    flex-direction: column-reverse;

    button {
      width: 100%;
    }
  }
`

const PaymentDetailsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
  padding: 1.5rem;
  background: #f9fafb;
  border-radius: 0.75rem;
  border: 1px solid #e5e7eb;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
    gap: 1rem;
    padding: 1rem;
    margin-bottom: 1rem;
  }
`

const DetailField = styled.div`
  display: flex;
  flex-direction: column;

  label {
    font-size: 0.875rem;
    font-weight: 600;
    color: #6b7280;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 0.5rem;
  }

  p {
    font-size: 1rem;
    color: #111827;
    margin: 0;
    word-break: break-all;
    font-family: 'Monaco', 'Courier New', monospace;
    background: white;
    padding: 0.75rem;
    border-radius: 0.5rem;
    border: 1px solid #e5e7eb;
  }
  
  @media (max-width: 600px) {
    label {
      font-size: 0.75rem;
      margin-bottom: 0.25rem;
    }
    
    p {
      font-size: 0.9rem;
      padding: 0.5rem;
    }
  }
`

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem 1rem;
  color: #6b7280;

  svg {
    width: 3rem;
    height: 3rem;
    opacity: 0.3;
    margin-bottom: 1rem;
  }

  h3 {
    font-size: 1.1rem;
    font-weight: 600;
    color: #111827;
    margin: 0 0 0.5rem 0;
  }

  p {
    margin: 0;
  }
`

const LoadingSpinner = styled.div`
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 3px solid rgba(102, 126, 234, 0.2);
  border-radius: 50%;
  border-top-color: #667eea;
  animation: spin 0.8s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`

export default function AdminSweepstakesPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'create' | 'claims'>('overview')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showSelectWinnerModal, setShowSelectWinnerModal] = useState(false)
  const [showRejectModal, setShowRejectModal] = useState(false)

  const [createForm, setCreateForm] = useState({
    month: new Date().toISOString().slice(0, 7),
    prizeAmount: '500',
  })

  const [selectedSweepstakesId, setSelectedSweepstakesId] = useState<string | null>(null)
  const [selectedClaimId, setSelectedClaimId] = useState<string | null>(null)
  const [selectedClaimForDetails, setSelectedClaimForDetails] = useState<any>(null)
  const [rejectReason, setRejectReason] = useState('')
  const [selectionMethod, setSelectionMethod] = useState<'random' | 'manual'>('random')
  const [selectedUserId, setSelectedUserId] = useState('')

  const createSweepstakes = useCreateSweepstakes()
  const selectWinner = useSelectWinner(selectedSweepstakesId || '')
  const claimsForSweepstakes = useClaimsForSweepstakes(selectedSweepstakesId || '')
  const approveClaim = useApproveClaim(selectedSweepstakesId || '')
  const rejectClaimMutation = useRejectClaim(selectedSweepstakesId || '')
  const { data: allSweepstakesResponse, isLoading: isLoadingSweepstakes } = useAllSweepstakes()

  const sweepstakesList = allSweepstakesResponse?.data || []

  const handleCreateSweepstakes = (e: React.FormEvent) => {
    e.preventDefault()

    if (!createForm.month || !createForm.prizeAmount) {
      toast.error('❌ Please fill in all fields')
      return
    }

    const prizeInCents = Math.round(parseFloat(createForm.prizeAmount) * 100)
    if (isNaN(prizeInCents) || prizeInCents <= 0) {
      toast.error('❌ Please enter a valid prize amount')
      return
    }

    createSweepstakes.mutate(
      { month: createForm.month, prizeAmount: prizeInCents },
      {
        onSuccess: () => {
          setCreateForm({
            month: new Date().toISOString().slice(0, 7),
            prizeAmount: '500',
          })
          setShowCreateModal(false)
        },
      }
    )
  }

  const handleSelectWinner = (sweepstakesId: string) => {
    setSelectedSweepstakesId(sweepstakesId)
    setShowSelectWinnerModal(true)
  }

  const handleConfirmSelectWinner = () => {
    if (selectionMethod === 'random') {
      selectWinner.mutate({ randomSelection: true }, {
        onSuccess: () => {
          setShowSelectWinnerModal(false)
          setSelectedUserId('')
          setSelectionMethod('random')
        },
      })
    } else if (selectionMethod === 'manual' && selectedUserId) {
      selectWinner.mutate({ winnerId: selectedUserId }, {
        onSuccess: () => {
          setShowSelectWinnerModal(false)
          setSelectedUserId('')
          setSelectionMethod('random')
        },
      })
    } else {
      toast.error('❌ Please select a method and provide required information')
    }
  }

  const handleApproveClaim = (claimId: string) => {
    if (!selectedSweepstakesId) return
    approveClaim.mutate({ claimId })
  }

  const handleRejectClaim = (claimId: string) => {
    setSelectedClaimId(claimId)
    setShowRejectModal(true)
  }

  const handleConfirmReject = () => {
    if (!selectedClaimId || !rejectReason.trim()) {
      toast.error('❌ Please provide a rejection reason')
      return
    }

    if (!selectedSweepstakesId) return

    rejectClaimMutation.mutate(
      {
        claimId: selectedClaimId,
        rejectionReason: rejectReason,
      },
      {
        onSuccess: () => {
          setShowRejectModal(false)
          setSelectedClaimId(null)
          setRejectReason('')
        },
      }
    )
  }

  return (
    <PageContainer>
      <Content>
        {/* Header */}
        <Header>
          <HeaderContent>
            <h1>
              <span>🎰</span>
              Sweepstakes Management
            </h1>
            <p>Create and manage monthly sweepstakes drawings</p>
          </HeaderContent>
          <HeaderActions>
            <Button
              variant="primary"
              onClick={() => setShowCreateModal(true)}
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <Plus size={20} />
              Create Drawing
            </Button>
          </HeaderActions>
        </Header>

        {/* Stats Grid */}
        {activeTab === 'overview' && (
          <StatsGrid>
            <StatCard>
              <div className="stat-icon">🎁</div>
              <div className="stat-label">Current Prize</div>
              <div className="stat-value">
                ${sweepstakesList[0]?.prizeAmountDollars || '0.00'}
              </div>
            </StatCard>
            <StatCard className="winners">
              <div className="stat-icon">🏆</div>
              <div className="stat-label">Winners This Year</div>
              <div className="stat-value">
                {sweepstakesList.filter(s => s.winnerId).length}
              </div>
            </StatCard>
            <StatCard className="pending">
              <div className="stat-icon">⏳</div>
              <div className="stat-label">Pending Claims</div>
              <div className="stat-value">—</div>
            </StatCard>
            <StatCard className="active">
              <div className="stat-icon">👥</div>
              <div className="stat-label">Total Sweepstakes</div>
              <div className="stat-value">{sweepstakesList.length}</div>
            </StatCard>
          </StatsGrid>
        )}

        {/* Tabs */}
        <TabsContainer>
          <Tab active={activeTab === 'overview'} onClick={() => setActiveTab('overview')}>
            <TrendingUp size={18} />
            Overview
          </Tab>
          <Tab active={activeTab === 'create'} onClick={() => setActiveTab('create')}>
            <Plus size={18} />
            Create Drawing
          </Tab>
          <Tab active={activeTab === 'claims'} onClick={() => setActiveTab('claims')}>
            <Users size={18} />
            Prize Claims
          </Tab>
        </TabsContainer>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <Card>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '1.5rem', color: '#111827' }}>
              Recent Drawings
            </h2>

            {isLoadingSweepstakes ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
                <LoadingSpinner style={{ marginRight: '0.5rem' }} />
                Loading sweepstakes...
              </div>
            ) : sweepstakesList.length === 0 ? (
              <EmptyState>
                <AlertCircle size={48} />
                <h3>No Sweepstakes Found</h3>
                <p>Create your first sweepstakes by clicking the "Create Drawing" button.</p>
              </EmptyState>
            ) : (
              <Table>
                <thead>
                  <tr>
                    <th>Month</th>
                    <th>Prize</th>
                    <th>Status</th>
                    <th>Winner</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {sweepstakesList.map((sweepstakes) => (
                    <tr key={sweepstakes.id}>
                      <td style={{ fontWeight: 600 }}>{sweepstakes.month}</td>
                      <td>${sweepstakes.prizeAmountDollars || '0.00'}</td>
                      <td>
                        <StatusBadge status={sweepstakes.status}>
                          {sweepstakes.status.charAt(0).toUpperCase() + sweepstakes.status.slice(1)}
                        </StatusBadge>
                      </td>
                      <td>{sweepstakes.winnerId ? '✅ Selected' : '—'}</td>
                      <td>
                        <ActionButtons>
                          {sweepstakes.status === 'active' && !sweepstakes.winnerId && (
                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={() => handleSelectWinner(sweepstakes.id)}
                            >
                              Select Winner
                            </Button>
                          )}
                          {sweepstakes.status === 'completed' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedSweepstakesId(sweepstakes.id)
                                setActiveTab('claims')
                              }}
                            >
                              View Claims
                            </Button>
                          )}
                        </ActionButtons>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </Card>
        )}

        {/* Create Tab */}
        {activeTab === 'create' && (
          <Card>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '1.5rem', color: '#111827' }}>
              Create New Drawing
            </h2>

            <MessageBox type="info">
              <AlertCircle size={20} />
              <div>
                <strong>Monthly Drawing</strong>
                <p style={{ marginTop: '0.25rem', fontSize: '0.9rem' }}>
                  All eligible users (18+, valid state, active account) will automatically be entered. Select
                  winner after entry period ends.
                </p>
              </div>
            </MessageBox>

            <Form onSubmit={handleCreateSweepstakes}>
              <FormGrid>
                <FormGroup>
                  <label htmlFor="month">Month (YYYY-MM) *</label>
                  <input
                    id="month"
                    type="month"
                    value={createForm.month}
                    onChange={(e) => setCreateForm({ ...createForm, month: e.target.value })}
                    disabled={createSweepstakes.isPending}
                    required
                  />
                </FormGroup>

                <FormGroup>
                  <label htmlFor="prizeAmount">Prize Amount ($) *</label>
                  <input
                    id="prizeAmount"
                    type="number"
                    placeholder="500.00"
                    value={createForm.prizeAmount}
                    onChange={(e) => setCreateForm({ ...createForm, prizeAmount: e.target.value })}
                    step="0.01"
                    min="0"
                    disabled={createSweepstakes.isPending}
                    required
                  />
                  <HelperText>Enter amount in dollars (will be stored in cents)</HelperText>
                </FormGroup>
              </FormGrid>

              <Button
                variant="primary"
                type="submit"
                disabled={createSweepstakes.isPending}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
              >
                {createSweepstakes.isPending ? (
                  <>
                    <LoadingSpinner />
                    Creating...
                  </>
                ) : (
                  <>
                    <Plus size={20} />
                    Create Sweepstakes
                  </>
                )}
              </Button>
            </Form>
          </Card>
        )}

        {/* Claims Tab */}
        {activeTab === 'claims' && (
          <Card>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '1.5rem', color: '#111827' }}>
              Prize Claims
            </h2>

            {selectedSweepstakesId ? (
              <>
                <MessageBox type="info">
                  <AlertCircle size={20} />
                  <div>
                    <strong>Review Claims</strong>
                    <p style={{ marginTop: '0.25rem', fontSize: '0.9rem' }}>
                      Verify payment information and approve valid claims. Rejected claims expire automatically.
                    </p>
                  </div>
                </MessageBox>

                {claimsForSweepstakes.isLoading ? (
                  <div style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
                    <LoadingSpinner style={{ marginRight: '0.5rem' }} />
                    Loading claims...
                  </div>
                ) : !claimsForSweepstakes.data?.data || claimsForSweepstakes.data.data.length === 0 ? (
                  <EmptyState>
                    <AlertCircle size={48} />
                    <h3>No Claims</h3>
                    <p>No prize claims have been submitted for this sweepstakes yet.</p>
                  </EmptyState>
                ) : (
                  <Table>
                    <thead>
                      <tr>
                        <th>Winner Email</th>
                        <th>Prize Amount</th>
                        <th>Status</th>
                        <th>Claimed</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(claimsForSweepstakes.data?.data?.claims || []).map((claim: any) => (
                        <tr key={claim.id}>
                          <td>{claim.winnerEmail || claim.winnerId}</td>
                          <td>${claim.prizeAmount || '0.00'}</td>
                          <td>
                            <StatusBadge status={claim.status}>
                              {claim.status.charAt(0).toUpperCase() + claim.status.slice(1)}
                            </StatusBadge>
                          </td>
                          <td>{claim.claimedAt ? new Date(claim.claimedAt).toLocaleDateString() : '—'}</td>
                          <td>
                            <ActionButtons>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setSelectedClaimForDetails(claim)}
                              >
                                👁️ View Details
                              </Button>
                              {claim.status === 'pending' && (
                                <>
                                  <Button
                                    variant="secondary"
                                    size="sm"
                                    onClick={() => handleApproveClaim(claim.id)}
                                    disabled={approveClaim.isPending}
                                  >
                                    ✅ Approve
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleRejectClaim(claim.id)}
                                  >
                                    ❌ Reject
                                  </Button>
                                </>
                              )}
                            </ActionButtons>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                )}
              </>
            ) : (
              <EmptyState>
                <AlertCircle size={48} />
                <h3>No Sweepstakes Selected</h3>
                <p>Select a completed drawing from Overview tab to view its claims.</p>
              </EmptyState>
            )}
          </Card>
        )}
      </Content>

      {/* Create Modal */}
      {showCreateModal && (
        <Modal onClick={() => setShowCreateModal(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <CloseButton onClick={() => setShowCreateModal(false)}>
              <X size={24} />
            </CloseButton>

            <ModalTitle>Create New Sweepstakes</ModalTitle>

            <Form onSubmit={handleCreateSweepstakes}>
              <FormGroup>
                <label htmlFor="modal-month">Month (YYYY-MM) *</label>
                <input
                  id="modal-month"
                  type="month"
                  value={createForm.month}
                  onChange={(e) => setCreateForm({ ...createForm, month: e.target.value })}
                  disabled={createSweepstakes.isPending}
                  required
                />
              </FormGroup>

              <FormGroup>
                <label htmlFor="modal-prize">Prize Amount ($) *</label>
                <input
                  id="modal-prize"
                  type="number"
                  placeholder="500.00"
                  value={createForm.prizeAmount}
                  onChange={(e) => setCreateForm({ ...createForm, prizeAmount: e.target.value })}
                  step="0.01"
                  min="0"
                  disabled={createSweepstakes.isPending}
                  required
                />
              </FormGroup>

              <ButtonGroup>
                <Button
                  variant="outline"
                  onClick={() => setShowCreateModal(false)}
                  disabled={createSweepstakes.isPending}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  type="submit"
                  disabled={createSweepstakes.isPending}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                  {createSweepstakes.isPending ? (
                    <>
                      <LoadingSpinner />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Plus size={20} />
                      Create
                    </>
                  )}
                </Button>
              </ButtonGroup>
            </Form>
          </ModalContent>
        </Modal>
      )}

      {/* Select Winner Modal */}
      {showSelectWinnerModal && (
        <Modal onClick={() => setShowSelectWinnerModal(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <CloseButton onClick={() => setShowSelectWinnerModal(false)}>
              <X size={24} />
            </CloseButton>

            <ModalTitle>🏆 Select Winner</ModalTitle>

            <MessageBox type="info">
              <AlertCircle size={20} />
              <p style={{ margin: 0 }}>
                Choose random selection for fair drawing or manually select a specific eligible user.
              </p>
            </MessageBox>

            <div style={{ marginBottom: '1.5rem' }}>
              <FormGroup>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="selection"
                    value="random"
                    checked={selectionMethod === 'random'}
                    onChange={(e) => setSelectionMethod(e.target.value as 'random' | 'manual')}
                  />
                  <span style={{ fontWeight: 500 }}>🎲 Random Selection</span>
                </label>
              </FormGroup>

              <FormGroup style={{ marginTop: '1rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="selection"
                    value="manual"
                    checked={selectionMethod === 'manual'}
                    onChange={(e) => setSelectionMethod(e.target.value as 'random' | 'manual')}
                  />
                  <span style={{ fontWeight: 500 }}>👤 Manual Selection</span>
                </label>
              </FormGroup>
            </div>

            {selectionMethod === 'manual' && (
              <FormGroup style={{ marginBottom: '1.5rem' }}>
                <label htmlFor="userId">Select User (ID) *</label>
                <input
                  id="userId"
                  type="text"
                  placeholder="Enter user ID"
                  value={selectedUserId}
                  onChange={(e) => setSelectedUserId(e.target.value)}
                  disabled={selectWinner.isPending}
                />
              </FormGroup>
            )}

            <ButtonGroup>
              <Button
                variant="outline"
                onClick={() => setShowSelectWinnerModal(false)}
                disabled={selectWinner.isPending}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleConfirmSelectWinner}
                disabled={selectWinner.isPending}
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              >
                {selectWinner.isPending ? (
                  <>
                    <LoadingSpinner />
                    Selecting...
                  </>
                ) : (
                  <>
                    <Check size={20} />
                    Select Winner
                  </>
                )}
              </Button>
            </ButtonGroup>
          </ModalContent>
        </Modal>
      )}

      {/* Reject Modal */}
      {showRejectModal && (
        <Modal onClick={() => setShowRejectModal(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <CloseButton onClick={() => setShowRejectModal(false)}>
              <X size={24} />
            </CloseButton>

            <ModalTitle>❌ Reject Claim</ModalTitle>

            <FormGroup>
              <label htmlFor="rejectReason">Rejection Reason *</label>
              <textarea
                id="rejectReason"
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Enter reason for rejection..."
                disabled={rejectClaimMutation.isPending}
                style={{
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.5rem',
                  fontSize: '1rem',
                  fontFamily: 'inherit',
                  resize: 'vertical',
                  minHeight: '100px',
                  transition: 'all 200ms',
                }}
              />
            </FormGroup>

            <ButtonGroup>
              <Button
                variant="outline"
                onClick={() => {
                  setShowRejectModal(false)
                  setSelectedClaimId(null)
                  setRejectReason('')
                }}
                disabled={rejectClaimMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleConfirmReject}
                disabled={rejectClaimMutation.isPending}
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              >
                {rejectClaimMutation.isPending ? (
                  <>
                    <LoadingSpinner />
                    Rejecting...
                  </>
                ) : (
                  <>
                    <AlertCircle size={20} />
                    Reject Claim
                  </>
                )}
              </Button>
            </ButtonGroup>
          </ModalContent>
        </Modal>
      )}

      {selectedClaimForDetails && (
        <Modal onClick={() => setSelectedClaimForDetails(null)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <CloseButton onClick={() => setSelectedClaimForDetails(null)}>
              <X size={24} />
            </CloseButton>

            <ModalTitle>🏆 Prize Claim Details</ModalTitle>

            <MessageBox type="info">
              <AlertCircle size={20} />
              <div>
                <strong>Payment Information</strong>
                <p style={{ marginTop: '0.25rem', fontSize: '0.9rem' }}>
                  Use the details below to manually process payment outside the platform.
                </p>
              </div>
            </MessageBox>

            <PaymentDetailsGrid>
              <DetailField>
                <label>Winner Name</label>
                <p>{selectedClaimForDetails.winnerName || selectedClaimForDetails.winnerEmail}</p>
              </DetailField>

              <DetailField>
                <label>Winner Email</label>
                <p>{selectedClaimForDetails.winnerEmail}</p>
              </DetailField>

              <DetailField>
                <label>Prize Amount</label>
                <p>${selectedClaimForDetails.prizeAmount || '0.00'}</p>
              </DetailField>

              <DetailField>
                <label>Status</label>
                <p>
                  <StatusBadge status={selectedClaimForDetails.status}>
                    {selectedClaimForDetails.status.charAt(0).toUpperCase() + selectedClaimForDetails.status.slice(1)}
                  </StatusBadge>
                </p>
              </DetailField>

              <DetailField style={{ gridColumn: '1 / -1' }}>
                <label>Payment Method</label>
                <p>{selectedClaimForDetails.paymentMethod || 'N/A'}</p>
              </DetailField>

              {selectedClaimForDetails.paymentDetails && (
                <>
                  <DetailField>
                    <label>Account Name</label>
                    <p>{selectedClaimForDetails.paymentDetails.accountName || 'N/A'}</p>
                  </DetailField>

                  <DetailField>
                    <label>Bank Name</label>
                    <p>{selectedClaimForDetails.paymentDetails.bankName || 'N/A'}</p>
                  </DetailField>

                  <DetailField>
                    <label>Account Number (Last 4)</label>
                    <p>{selectedClaimForDetails.paymentDetails.accountNumber || 'N/A'}</p>
                  </DetailField>

                  <DetailField>
                    <label>Routing Number</label>
                    <p>{selectedClaimForDetails.paymentDetails.routingNumber || 'N/A'}</p>
                  </DetailField>
                </>
              )}

              <DetailField style={{ gridColumn: '1 / -1' }}>
                <label>Claimed On</label>
                <p>
                  {selectedClaimForDetails.claimedAt
                    ? new Date(selectedClaimForDetails.claimedAt).toLocaleString()
                    : 'N/A'}
                </p>
              </DetailField>
            </PaymentDetailsGrid>

            <MessageBox type="success">
              <CheckCircle2 size={20} />
              <div>
                <strong>Processing Payment</strong>
                <p style={{ marginTop: '0.25rem', fontSize: '0.9rem' }}>
                  Use the account details above to process the payment manually. Once paid, approve the claim.
                </p>
              </div>
            </MessageBox>

            <ButtonGroup>
              <Button variant="outline" onClick={() => setSelectedClaimForDetails(null)}>
                Close
              </Button>
            </ButtonGroup>
          </ModalContent>
        </Modal>
      )}
    </PageContainer>
  )
}
