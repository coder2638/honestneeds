'use client'

import React, { useState } from 'react'
import styled from 'styled-components'
import { Search, Eye, Lock, Unlock, Trash2, Filter, ChevronDown } from 'lucide-react'
import { useAdminUsers, useAdminUserStatistics, useBlockUser, useUnblockUser } from '@/api/hooks/useAdminOperations'
import { Button } from '@/components/Button'
import { Badge } from '@/components/Badge'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import { Card } from '@/components/Card'
import { UserVerificationStatus, UserBlockReason } from '@/api/services/adminUserService'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
`

const Title = styled.h2`
  font-size: 24px;
  font-weight: 700;
  color: #111827;
  margin: 0;
`

const Stats = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
`

const StatCard = styled(Card)`
  padding: 16px;
  border-left: 4px solid #3b82f6;

  &.verified {
    border-left-color: #10b981;
  }

  &.blocked {
    border-left-color: #ef4444;
  }
`

const StatLabel = styled.p`
  font-size: 12px;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  margin: 0 0 8px 0;
`

const StatValue = styled.p`
  font-size: 28px;
  font-weight: 700;
  color: #111827;
  margin: 0;
`

const Controls = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  align-items: center;
`

const SearchInput = styled.input`
  flex: 1;
  min-width: 250px;
  padding: 10px 14px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`

const FilterButton = styled(Button)`
  display: flex;
  align-items: center;
  gap: 8px;
`

const UserTable = styled.div`
  width: 100%;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  overflow: hidden;

  @media (max-width: 768px) {
    display: none;
  }
`

const UserRow = styled.div`
  display: grid;
  grid-template-columns: 2fr 1.5fr 1fr 1fr 1fr 200px;
  gap: 16px;
  padding: 16px;
  border-bottom: 1px solid #e5e7eb;
  align-items: center;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: #f9fafb;
  }
`

const UserHeader = styled(UserRow)`
  background: #f3f4f6;
  font-weight: 600;
  font-size: 12px;
  color: #6b7280;
  text-transform: uppercase;

  &:hover {
    background: #f3f4f6;
  }
`

const UserName = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`

const UserNameText = styled.p`
  font-weight: 600;
  color: #111827;
  margin: 0;
  font-size: 14px;
`

const UserEmail = styled.p`
  color: #6b7280;
  margin: 0;
  font-size: 12px;
`

const RoleBadge = styled(Badge)`
  width: fit-content;
`

const VerificationBadge = styled(Badge)<{ status: UserVerificationStatus }>`
  width: fit-content;
  background: ${(props) => {
    switch (props.status) {
      case 'verified':
        return '#dcfce7'
      case 'pending':
        return '#fef3c7'
      case 'rejected':
        return '#fee2e2'
      default:
        return '#f3f4f6'
    }
  }};
  color: ${(props) => {
    switch (props.status) {
      case 'verified':
        return '#166534'
      case 'pending':
        return '#92400e'
      case 'rejected':
        return '#991b1b'
      default:
        return '#4b5563'
    }
  }};
`

const StatusBadge = styled(Badge)<{ isBlocked: boolean }>`
  width: fit-content;
  background: ${(props) => (props.isBlocked ? '#fee2e2' : '#dcfce7')};
  color: ${(props) => (props.isBlocked ? '#991b1b' : '#166534')};
`

const StatNumber = styled.p`
  font-size: 14px;
  color: #111827;
  margin: 0;
  font-weight: 500;
`

const Actions = styled.div`
  display: flex;
  gap: 8px;
  justify-content: flex-end;
`

const ActionButton = styled(Button)`
  padding: 6px 12px;
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 6px;
`

const MobileUserCard = styled(Card)`
  padding: 16px;
  margin-bottom: 12px;
  display: none;

  @media (max-width: 768px) {
    display: block;
  }
`

const CardRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  padding-bottom: 12px;
  border-bottom: 1px solid #e5e7eb;

  &:last-child {
    margin-bottom: 0;
    padding-bottom: 0;
    border-bottom: none;
  }
`

const CardLabel = styled.p`
  font-size: 12px;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  margin: 0;
`

const CardValue = styled.p`
  font-size: 14px;
  font-weight: 500;
  color: #111827;
  margin: 0;
`

const EmptyState = styled.div`
  text-align: center;
  padding: 40px 20px;
  color: #6b7280;
`

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: 24px;
`

/**
 * User Management List Component
 * Displays admin user list with filtering, search, and bulk actions
 */
export const UserManagementList: React.FC<{
  onUserSelect?: (userId: string) => void
}> = ({ onUserSelect }) => {
  const [page, setPage] = useState(1)
  const [limit] = useState(20)
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState<'creator' | 'supporter' | undefined>()
  const [verificationFilter, setVerificationFilter] = useState<UserVerificationStatus | undefined>()
  const [blockedFilter, setBlockedFilter] = useState<boolean | undefined>()

  const { data: stats } = useAdminUserStatistics()
  const { data: usersData, isLoading } = useAdminUsers(page, limit, {
    search: searchTerm || undefined,
    role: roleFilter,
    verificationStatus: verificationFilter,
    isBlocked: blockedFilter,
  })

  const blockUser = useBlockUser()
  const unblockUser = useUnblockUser()

  const handleBlockUser = (userId: string) => {
    blockUser.mutate(
      { userId, reason: 'manual_admin' as UserBlockReason, explanation: 'Blocked by admin' },
      {
        onSuccess: () => {
          // Toast notification would go here
        },
      }
    )
  }

  const handleUnblockUser = (userId: string) => {
    unblockUser.mutate(userId, {
      onSuccess: () => {
        // Toast notification would go here
      },
    })
  }

  return (
    <Container>
      <Header>
        <Title>👥 User Management</Title>
      </Header>

      {/* Statistics */}
      {stats && (
        <Stats>
          <StatCard>
            <StatLabel>Total Users</StatLabel>
            <StatValue>{stats.totalUsers}</StatValue>
          </StatCard>
          <StatCard>
            <StatLabel>Creators</StatLabel>
            <StatValue>{stats.creatorsCount}</StatValue>
          </StatCard>
          <StatCard className="verified">
            <StatLabel>Verified</StatLabel>
            <StatValue>{stats.verifiedCount}</StatValue>
          </StatCard>
          <StatCard className="blocked">
            <StatLabel>Blocked</StatLabel>
            <StatValue>{stats.blockedCount}</StatValue>
          </StatCard>
        </Stats>
      )}

      {/* Search & Filters */}
      <Controls>
        <SearchInput
          type="text"
          placeholder="Search by name or email..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value)
            setPage(1)
          }}
        />
        <FilterButton variant="outline" size="sm">
          <Filter size={16} />
          Filters
          <ChevronDown size={16} />
        </FilterButton>
      </Controls>

      {/* Users List */}
      {isLoading ? (
        <LoadingSpinner />
      ) : usersData?.users && usersData.users.length > 0 ? (
        <>
          {/* Desktop Table */}
          <UserTable>
            <UserHeader>
              <div>User</div>
              <div>Role</div>
              <div>Verification</div>
              <div>Status</div>
              <div>Activity</div>
              <div style={{ textAlign: 'right' }}>Actions</div>
            </UserHeader>

            {usersData.users.map((user) => (
              <UserRow key={user.id}>
                <UserName>
                  <UserNameText>{user.name}</UserNameText>
                  <UserEmail>{user.email}</UserEmail>
                </UserName>

                <div>
                  <RoleBadge variant="info">{user.role}</RoleBadge>
                </div>

                <div>
                  <VerificationBadge status={user.verificationStatus}>
                    {user.verificationStatus}
                  </VerificationBadge>
                </div>

                <div>
                  <StatusBadge isBlocked={user.isBlocked}>
                    {user.isBlocked ? '🚫 Blocked' : '✅ Active'}
                  </StatusBadge>
                </div>

                <div>
                  <StatNumber>
                    {user.totalDonations} donations, {user.totalCampaigns} campaigns
                  </StatNumber>
                </div>

                <Actions>
                  <ActionButton
                    variant="ghost"
                    size="sm"
                    onClick={() => onUserSelect?.(user.id)}
                    title="View details"
                  >
                    <Eye size={14} />
                  </ActionButton>

                  {user.isBlocked ? (
                    <ActionButton
                      variant="ghost"
                      size="sm"
                      onClick={() => handleUnblockUser(user.id)}
                      disabled={unblockUser.isPending}
                      title="Unblock user"
                    >
                      <Unlock size={14} />
                    </ActionButton>
                  ) : (
                    <ActionButton
                      variant="ghost"
                      size="sm"
                      onClick={() => handleBlockUser(user.id)}
                      disabled={blockUser.isPending}
                      title="Block user"
                    >
                      <Lock size={14} />
                    </ActionButton>
                  )}
                </Actions>
              </UserRow>
            ))}
          </UserTable>

          {/* Mobile Cards */}
          {usersData.users.map((user) => (
            <MobileUserCard key={user.id}>
              <CardRow>
                <div>
                  <CardLabel>{user.name}</CardLabel>
                  <CardValue>{user.email}</CardValue>
                </div>
                <ActionButton variant="ghost" size="sm" onClick={() => onUserSelect?.(user.id)}>
                  <Eye size={14} />
                </ActionButton>
              </CardRow>

              <CardRow>
                <CardLabel>Role</CardLabel>
                <RoleBadge variant="info">{user.role}</RoleBadge>
              </CardRow>

              <CardRow>
                <CardLabel>Verification</CardLabel>
                <VerificationBadge status={user.verificationStatus}>
                  {user.verificationStatus}
                </VerificationBadge>
              </CardRow>

              <CardRow>
                <CardLabel>Status</CardLabel>
                <StatusBadge isBlocked={user.isBlocked}>
                  {user.isBlocked ? '🚫 Blocked' : '✅ Active'}
                </StatusBadge>
              </CardRow>

              <CardRow>
                <CardLabel>Activity</CardLabel>
                <CardValue>{user.totalDonations} donations</CardValue>
              </CardRow>

              <CardRow style={{ justifyContent: 'flex-end', gap: '8px' }}>
                {user.isBlocked ? (
                  <ActionButton
                    variant="ghost"
                    size="sm"
                    onClick={() => handleUnblockUser(user.id)}
                    disabled={unblockUser.isPending}
                  >
                    <Unlock size={14} /> Unblock
                  </ActionButton>
                ) : (
                  <ActionButton
                    variant="ghost"
                    size="sm"
                    onClick={() => handleBlockUser(user.id)}
                    disabled={blockUser.isPending}
                  >
                    <Lock size={14} /> Block
                  </ActionButton>
                )}
              </CardRow>
            </MobileUserCard>
          ))}

          {/* Pagination */}
          {usersData.total > limit && (
            <Pagination>
              <Button
                variant="outline"
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
              >
                ← Previous
              </Button>
              <span style={{ color: '#6b7280' }}>
                Page {page} of {Math.ceil(usersData.total / limit)}
              </span>
              <Button
                variant="outline"
                onClick={() => setPage(page + 1)}
                disabled={page >= Math.ceil(usersData.total / limit)}
              >
                Next →
              </Button>
            </Pagination>
          )}
        </>
      ) : (
        <EmptyState>
          <p>No users found matching your criteria.</p>
        </EmptyState>
      )}
    </Container>
  )
}
