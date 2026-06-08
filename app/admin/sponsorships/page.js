'use client'

import React, { useState, useEffect, useCallback } from 'react'
import styled from 'styled-components'
import { COLORS, SPACING, BORDER_RADIUS, TYPOGRAPHY, SHADOWS, TRANSITIONS, MEDIA_QUERIES } from '@/styles/tokens'
import apiClient from '@/lib/api'
import { toast } from 'react-toastify'
import AdminTaskList from '@/components/sponsorships/AdminTaskList'
import SponsorLogo from '@/components/sponsorships/SponsorLogo'
import {
  DollarSign, Users, ShieldCheck, Clock, X, Eye, CheckCircle2,
  Pause, Play, ChevronDown,
} from 'lucide-react'

/* ═══ Page ═══ */

const PageWrapper = styled.div`
  padding: ${SPACING[2]} 0;
`

const PageTitle = styled.h1`
  font-size: ${TYPOGRAPHY.SIZE_2XL};
  font-weight: ${TYPOGRAPHY.WEIGHT_BOLD};
  color: ${COLORS.TEXT};
  margin: 0 0 ${SPACING[6]} 0;
`

/* ═══ Stats Bar ═══ */

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: ${SPACING[4]};
  margin-bottom: ${SPACING[6]};
  ${MEDIA_QUERIES.DOWN_MD} { grid-template-columns: repeat(2, 1fr); }
  ${MEDIA_QUERIES.DOWN_SM} { grid-template-columns: 1fr; }
`

const StatCard = styled.div`
  background: ${COLORS.SURFACE};
  border: 1px solid ${COLORS.BORDER};
  border-radius: ${BORDER_RADIUS.LG};
  padding: ${SPACING[4]} ${SPACING[5]};
  display: flex;
  align-items: center;
  gap: ${SPACING[3]};
`

const StatIconWrap = styled.div`
  width: 44px;
  height: 44px;
  border-radius: ${BORDER_RADIUS.MD};
  background: ${(p) => p.$bg || COLORS.PRIMARY_BG};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${(p) => p.$color || COLORS.PRIMARY};
  flex-shrink: 0;
`

const StatInfo = styled.div``

const StatValue = styled.div`
  font-size: ${TYPOGRAPHY.SIZE_XL};
  font-weight: ${TYPOGRAPHY.WEIGHT_BOLD};
  color: ${COLORS.TEXT};
`

const StatLabel = styled.div`
  font-size: ${TYPOGRAPHY.SIZE_XS};
  color: ${COLORS.MUTED_TEXT};
`

/* ═══ Filters ═══ */

const FiltersRow = styled.div`
  display: flex;
  gap: ${SPACING[3]};
  margin-bottom: ${SPACING[4]};
  flex-wrap: wrap;
`

const FilterSelect = styled.select`
  padding: ${SPACING[2]} ${SPACING[3]};
  border: 1px solid ${COLORS.BORDER};
  border-radius: ${BORDER_RADIUS.MD};
  font-size: ${TYPOGRAPHY.SIZE_SM};
  background: ${COLORS.SURFACE};
  color: ${COLORS.TEXT};
  cursor: pointer;
`

/* ═══ Table ═══ */

const TableWrapper = styled.div`
  background: ${COLORS.SURFACE};
  border: 1px solid ${COLORS.BORDER};
  border-radius: ${BORDER_RADIUS.XL};
  overflow: hidden;
  box-shadow: ${SHADOWS.SM};
`

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`

const Th = styled.th`
  text-align: left;
  padding: ${SPACING[3]} ${SPACING[4]};
  font-size: ${TYPOGRAPHY.SIZE_XS};
  font-weight: ${TYPOGRAPHY.WEIGHT_SEMIBOLD};
  color: ${COLORS.MUTED_TEXT};
  text-transform: uppercase;
  letter-spacing: ${TYPOGRAPHY.LETTER_SPACING_WIDE};
  border-bottom: 1px solid ${COLORS.BORDER};
  background: ${COLORS.BG};
  white-space: nowrap;
`

const Td = styled.td`
  padding: ${SPACING[3]} ${SPACING[4]};
  font-size: ${TYPOGRAPHY.SIZE_SM};
  color: ${COLORS.TEXT};
  border-bottom: 1px solid ${COLORS.BORDER};
  vertical-align: middle;
  white-space: nowrap;
`

const StatusBadge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 2px 10px;
  border-radius: ${BORDER_RADIUS.FULL};
  font-size: ${TYPOGRAPHY.SIZE_XS};
  font-weight: ${TYPOGRAPHY.WEIGHT_SEMIBOLD};
  background: ${(p) => {
    switch (p.$status) {
      case 'active': return COLORS.SUCCESS_BG
      case 'pending_onboarding': return COLORS.WARNING_BG
      case 'pending_payment': return COLORS.INFO_BG
      case 'suspended': return COLORS.ERROR_BG
      default: return COLORS.DISABLED
    }
  }};
  color: ${(p) => {
    switch (p.$status) {
      case 'active': return COLORS.SUCCESS_DARK
      case 'pending_onboarding': return COLORS.WARNING_DARK
      case 'pending_payment': return COLORS.INFO_DARK
      case 'suspended': return COLORS.ERROR_DARK
      default: return COLORS.MUTED_TEXT
    }
  }};
`

const ActionBtn = styled.button`
  background: none;
  border: 1px solid ${COLORS.BORDER};
  border-radius: ${BORDER_RADIUS.SM};
  padding: 4px 10px;
  font-size: ${TYPOGRAPHY.SIZE_XS};
  color: ${COLORS.PRIMARY};
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  transition: all ${TRANSITIONS.FAST};
  &:hover { background: ${COLORS.PRIMARY_BG}; border-color: ${COLORS.PRIMARY_LIGHT}; }
`

const EmptyRow = styled.tr`
  td {
    text-align: center;
    padding: ${SPACING[10]};
    color: ${COLORS.MUTED_TEXT};
  }
`

/* ═══ Drawer ═══ */

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.5);
  z-index: 1000;
  display: flex;
  justify-content: flex-end;
`

const Drawer = styled.div`
  width: 520px;
  max-width: 90vw;
  background: ${COLORS.SURFACE};
  height: 100vh;
  overflow-y: auto;
  padding: ${SPACING[6]};
  box-shadow: ${SHADOWS.XL};
`

const DrawerHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${SPACING[5]};
`

const DrawerTitle = styled.h2`
  font-size: ${TYPOGRAPHY.SIZE_XL};
  font-weight: ${TYPOGRAPHY.WEIGHT_BOLD};
  color: ${COLORS.TEXT};
  margin: 0;
`

const CloseBtn = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: ${COLORS.MUTED};
  &:hover { color: ${COLORS.TEXT}; }
`

const DetailSection = styled.div`
  margin-bottom: ${SPACING[5]};
`

const DetailLabel = styled.div`
  font-size: ${TYPOGRAPHY.SIZE_XS};
  color: ${COLORS.MUTED_TEXT};
  text-transform: uppercase;
  letter-spacing: ${TYPOGRAPHY.LETTER_SPACING_WIDE};
  margin-bottom: ${SPACING[2]};
  font-weight: ${TYPOGRAPHY.WEIGHT_SEMIBOLD};
`

const DetailValue = styled.div`
  font-size: ${TYPOGRAPHY.SIZE_SM};
  color: ${COLORS.TEXT};
  line-height: ${TYPOGRAPHY.LINE_HEIGHT_RELAXED};
  word-break: break-word;
`

const DrawerActions = styled.div`
  display: flex;
  gap: ${SPACING[3]};
  margin-top: ${SPACING[5]};
  flex-wrap: wrap;
`

const DrawerBtn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: ${SPACING[1]};
  padding: ${SPACING[2]} ${SPACING[4]};
  border-radius: ${BORDER_RADIUS.MD};
  font-size: ${TYPOGRAPHY.SIZE_SM};
  font-weight: ${TYPOGRAPHY.WEIGHT_MEDIUM};
  cursor: pointer;
  transition: all ${TRANSITIONS.BASE};
  border: 1px solid ${COLORS.BORDER};
  background: ${(p) => (p.$danger ? COLORS.ERROR_BG : p.$success ? COLORS.SUCCESS_BG : COLORS.SURFACE)};
  color: ${(p) => (p.$danger ? COLORS.ERROR_DARK : p.$success ? COLORS.SUCCESS_DARK : COLORS.TEXT)};
  &:hover { box-shadow: ${SHADOWS.SM}; }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
`

const Divider = styled.hr`
  border: none;
  border-top: 1px solid ${COLORS.BORDER};
  margin: ${SPACING[4]} 0;
`

/* ═══ Component ═══ */

export default function AdminSponsorshipsPage() {
  const [sponsorships, setSponsorships] = useState([])
  const [stats, setStats] = useState({})
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('all')
  const [tierFilter, setTierFilter] = useState('all')
  const [selected, setSelected] = useState(null)
  const [actionLoading, setActionLoading] = useState(false)

  const fetchData = useCallback(async () => {
    try {
      const params = {}
      if (statusFilter !== 'all') params.status = statusFilter
      if (tierFilter !== 'all') params.tierGroup = tierFilter

      const res = await apiClient.get('/sponsorships/admin', { params })
      if (res.data?.success) {
        setSponsorships(res.data.data.sponsorships || [])
        setStats(res.data.data.stats || {})
      }
    } catch (err) {
      toast.error('Failed to load sponsorships')
    } finally {
      setLoading(false)
    }
  }, [statusFilter, tierFilter])

  useEffect(() => { fetchData() }, [fetchData])

  const handleVerifyPayment = async (id) => {
    setActionLoading(true)
    try {
      await apiClient.patch(`/sponsorships/${id}/admin-verify`)
      toast.success('Payment verified!')
      fetchData()
      if (selected?._id === id) {
        setSelected((prev) => prev ? { ...prev, paymentVerifiedByAdmin: true } : prev)
      }
    } catch { toast.error('Failed to verify') }
    finally { setActionLoading(false) }
  }

  const handleSuspend = async (id) => {
    setActionLoading(true)
    try {
      const res = await apiClient.patch(`/sponsorships/${id}/suspend`)
      toast.success(res.data?.message || 'Status updated')
      fetchData()
      setSelected(null)
    } catch { toast.error('Failed to update status') }
    finally { setActionLoading(false) }
  }

  const handleCompleteTask = async (sponsorshipId, taskIndex) => {
    setActionLoading(true)
    try {
      await apiClient.patch(`/sponsorships/${sponsorshipId}/complete-task`, { taskIndex })
      toast.success('Task completed!')
      // Update local state
      setSelected((prev) => {
        if (!prev) return prev
        const tasks = [...prev.adminTasks]
        tasks[taskIndex] = { ...tasks[taskIndex], isComplete: true, completedAt: new Date().toISOString() }
        return { ...prev, adminTasks: tasks }
      })
      fetchData()
    } catch { toast.error('Failed to complete task') }
    finally { setActionLoading(false) }
  }

  const incompleteTasks = (s) => (s.adminTasks || []).filter((t) => !t.isComplete).length

  return (
    <PageWrapper>
      <PageTitle>Sponsorship Management</PageTitle>

      {/* ── Stats ── */}
      <StatsGrid>
        <StatCard>
          <StatIconWrap $bg={COLORS.SUCCESS_BG} $color={COLORS.SUCCESS}>
            <Users size={20} />
          </StatIconWrap>
          <StatInfo>
            <StatValue>{stats.totalActive || 0}</StatValue>
            <StatLabel>Active Sponsors</StatLabel>
          </StatInfo>
        </StatCard>
        <StatCard>
          <StatIconWrap $bg={COLORS.PRIMARY_BG} $color={COLORS.PRIMARY}>
            <DollarSign size={20} />
          </StatIconWrap>
          <StatInfo>
            <StatValue>${(stats.totalGrossRevenue || 0).toLocaleString()}</StatValue>
            <StatLabel>Gross Revenue</StatLabel>
          </StatInfo>
        </StatCard>
        <StatCard>
          <StatIconWrap $bg={COLORS.ACCENT_BG} $color={COLORS.ACCENT_DARK}>
            <DollarSign size={20} />
          </StatIconWrap>
          <StatInfo>
            <StatValue>${(stats.totalPlatformFees || 0).toLocaleString()}</StatValue>
            <StatLabel>Platform Fees</StatLabel>
          </StatInfo>
        </StatCard>
        <StatCard>
          <StatIconWrap $bg={COLORS.WARNING_BG} $color={COLORS.WARNING_DARK}>
            <Clock size={20} />
          </StatIconWrap>
          <StatInfo>
            <StatValue>{stats.pendingVerification || 0}</StatValue>
            <StatLabel>Pending Verification</StatLabel>
          </StatInfo>
        </StatCard>
      </StatsGrid>

      {/* ── Filters ── */}
      <FiltersRow>
        <FilterSelect value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="all">All Statuses</option>
          <option value="pending_payment">Pending Payment</option>
          <option value="pending_onboarding">Pending Onboarding</option>
          <option value="active">Active</option>
          <option value="suspended">Suspended</option>
        </FilterSelect>
        <FilterSelect value={tierFilter} onChange={(e) => setTierFilter(e.target.value)}>
          <option value="all">All Tiers</option>
          <option value="individual">Individual (&lt;$5K)</option>
          <option value="organization">Organization ($5K+)</option>
        </FilterSelect>
      </FiltersRow>

      {/* ── Table ── */}
      <TableWrapper>
        <div style={{ overflowX: 'auto' }}>
          <Table>
            <thead>
              <tr>
                <Th>Sponsor</Th>
                <Th>Tier</Th>
                <Th>Gross</Th>
                <Th>Fee</Th>
                <Th>Net</Th>
                <Th>Status</Th>
                <Th>Verified</Th>
                <Th>Tasks</Th>
                <Th>Actions</Th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <EmptyRow><td colSpan={9}>Loading...</td></EmptyRow>
              ) : sponsorships.length === 0 ? (
                <EmptyRow><td colSpan={9}>No sponsorships found</td></EmptyRow>
              ) : (
                sponsorships.map((s) => (
                  <tr key={s._id}>
                    <Td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: SPACING[2] }}>
                        <SponsorLogo logoUrl={s.logoUrl} businessName={s.businessName || s.sponsorName} size="32px" />
                        <div>
                          <div style={{ fontWeight: TYPOGRAPHY.WEIGHT_MEDIUM }}>{s.businessName || s.sponsorName}</div>
                          <div style={{ fontSize: TYPOGRAPHY.SIZE_XS, color: COLORS.MUTED_TEXT }}>{s.email}</div>
                        </div>
                      </div>
                    </Td>
                    <Td><StatusBadge $status="active" style={{ background: `${s.tierName?.includes('Gold') ? COLORS.ACCENT_BG : COLORS.PRIMARY_BG}`, color: COLORS.TEXT }}>{s.tierName}</StatusBadge></Td>
                    <Td>${s.grossAmount?.toLocaleString()}</Td>
                    <Td style={{ color: COLORS.MUTED_TEXT }}>${s.platformFee?.toLocaleString()}</Td>
                    <Td>${s.netAmount?.toLocaleString()}</Td>
                    <Td><StatusBadge $status={s.status}>{s.status?.replace('_', ' ')}</StatusBadge></Td>
                    <Td>
                      {s.paymentVerifiedByAdmin ? (
                        <ShieldCheck size={16} style={{ color: COLORS.SUCCESS }} />
                      ) : (
                        <ActionBtn onClick={() => handleVerifyPayment(s._id)} disabled={actionLoading}>
                          Verify
                        </ActionBtn>
                      )}
                    </Td>
                    <Td>
                      {incompleteTasks(s) > 0 ? (
                        <span style={{ color: COLORS.WARNING_DARK, fontWeight: TYPOGRAPHY.WEIGHT_SEMIBOLD }}>
                          {incompleteTasks(s)} left
                        </span>
                      ) : (
                        <CheckCircle2 size={16} style={{ color: COLORS.SUCCESS }} />
                      )}
                    </Td>
                    <Td>
                      <ActionBtn onClick={() => setSelected(s)}>
                        <Eye size={12} /> Details
                      </ActionBtn>
                    </Td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </div>
      </TableWrapper>

      {/* ── Detail Drawer ── */}
      {selected && (
        <Overlay onClick={() => setSelected(null)}>
          <Drawer onClick={(e) => e.stopPropagation()}>
            <DrawerHeader>
              <DrawerTitle>Sponsor Details</DrawerTitle>
              <CloseBtn onClick={() => setSelected(null)}><X size={20} /></CloseBtn>
            </DrawerHeader>

            <div style={{ display: 'flex', alignItems: 'center', gap: SPACING[3], marginBottom: SPACING[4] }}>
              <SponsorLogo logoUrl={selected.logoUrl} businessName={selected.businessName || selected.sponsorName} size="56px" />
              <div>
                <div style={{ fontWeight: TYPOGRAPHY.WEIGHT_BOLD, fontSize: TYPOGRAPHY.SIZE_LG }}>{selected.businessName || selected.sponsorName}</div>
                <div style={{ color: COLORS.MUTED_TEXT, fontSize: TYPOGRAPHY.SIZE_SM }}>{selected.email}</div>
                <StatusBadge $status={selected.status} style={{ marginTop: 4 }}>{selected.status?.replace('_', ' ')}</StatusBadge>
              </div>
            </div>

            <Divider />

            <DetailSection>
              <DetailLabel>Financial</DetailLabel>
              <DetailValue>
                Gross: ${selected.grossAmount?.toLocaleString()} · Fee: ${selected.platformFee?.toLocaleString()} · Net: ${selected.netAmount?.toLocaleString()}
              </DetailValue>
            </DetailSection>

            <DetailSection>
              <DetailLabel>Tier</DetailLabel>
              <DetailValue>{selected.tierName} ({selected.tierId})</DetailValue>
            </DetailSection>

            {selected.tagline && (
              <DetailSection>
                <DetailLabel>Tagline</DetailLabel>
                <DetailValue>{selected.tagline}</DetailValue>
              </DetailSection>
            )}

            {selected.missionStatement && (
              <DetailSection>
                <DetailLabel>Mission Statement</DetailLabel>
                <DetailValue>{selected.missionStatement}</DetailValue>
              </DetailSection>
            )}

            {selected.websiteUrl && (
              <DetailSection>
                <DetailLabel>Website</DetailLabel>
                <DetailValue><a href={selected.websiteUrl} target="_blank" rel="noopener noreferrer">{selected.websiteUrl}</a></DetailValue>
              </DetailSection>
            )}

            <Divider />

            <DetailLabel>Admin Tasks</DetailLabel>
            <AdminTaskList
              tasks={selected.adminTasks || []}
              onCompleteTask={(idx) => handleCompleteTask(selected._id, idx)}
              loading={actionLoading}
            />

            <DrawerActions>
              {!selected.paymentVerifiedByAdmin && (
                <DrawerBtn $success onClick={() => handleVerifyPayment(selected._id)} disabled={actionLoading}>
                  <ShieldCheck size={14} /> Verify Payment
                </DrawerBtn>
              )}
              {selected.status === 'active' && (
                <DrawerBtn $danger onClick={() => handleSuspend(selected._id)} disabled={actionLoading}>
                  <Pause size={14} /> Suspend
                </DrawerBtn>
              )}
              {selected.status === 'suspended' && (
                <DrawerBtn $success onClick={() => handleSuspend(selected._id)} disabled={actionLoading}>
                  <Play size={14} /> Re-activate
                </DrawerBtn>
              )}
            </DrawerActions>
          </Drawer>
        </Overlay>
      )}
    </PageWrapper>
  )
}
