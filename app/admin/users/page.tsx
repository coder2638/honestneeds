'use client'

import React, { useState } from 'react'
import styled from 'styled-components'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { UserManagementList } from '@/components/admin/UserManagementList'
import { Card } from '@/components/Card'
import { useAdminUserProfile } from '@/api/hooks/useAdminOperations'
import { Modal } from '@/components/Modal'
import { Badge } from '@/components/Badge'
import { Button } from '@/components/Button'
import { X } from 'lucide-react'

/**
 * Admin Users Management Page
 * View and manage platform users
 */

const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 24px;
  background: #f8fafc;
  min-height: 100vh;
`

const PageHeader = styled.div`
  margin-bottom: 32px;

  h1 {
    font-size: 32px;
    font-weight: 700;
    color: #0f172a;
    margin: 0 0 8px 0;
  }

  p {
    color: #64748b;
    margin: 0;
  }
`

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`

const InfoCard = styled(Card)`
  padding: 16px;
  background: #f0f9ff;
  border-left: 4px solid #0ea5e9;

  p {
    margin: 0;
    color: #0c4a6e;
    font-size: 14px;
    line-height: 1.6;
  }
`

const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`

const UserHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e5e7eb;
`

const UserInfo = styled.div`
  flex: 1;
`

const UserName = styled.h3`
  font-size: 18px;
  font-weight: 700;
  color: #111827;
  margin: 0 0 4px 0;
`

const UserEmail = styled.p`
  font-size: 14px;
  color: #6b7280;
  margin: 0;
`

const UserStats = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e5e7eb;
`

const StatBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`

const StatLabel = styled.p`
  font-size: 12px;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  margin: 0;
`

const StatValue = styled.p`
  font-size: 20px;
  font-weight: 700;
  color: #111827;
  margin: 0;
`

const BadgeContainer = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e5e7eb;
`

const ReportsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`

const ReportItem = styled.div`
  padding: 12px;
  background: #f9fafb;
  border-radius: 6px;
  border-left: 3px solid #f59e0b;
`

const ReportReason = styled.p`
  font-size: 14px;
  font-weight: 600;
  color: #111827;
  margin: 0 0 4px 0;
`

const ReportDescription = styled.p`
  font-size: 12px;
  color: #6b7280;
  margin: 0;
`

const ModalActions = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #e5e7eb;
`

export default function AdminUsersPage() {
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)
  const { data: userProfile, isLoading: isLoadingProfile } = useAdminUserProfile(selectedUserId || '')

  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <Container>
        <PageHeader>
          <h1>👥 User Management</h1>
          <p>View, verify, and manage platform users</p>
        </PageHeader>

        <InfoCard>
          <p>
            💡 Use this panel to verify new users, view user activity, resolve reports, and block problematic accounts. All actions are logged for compliance.
          </p>
        </InfoCard>

        <ContentGrid>
          <div>
            <UserManagementList onUserSelect={setSelectedUserId} />
          </div>
        </ContentGrid>

        {/* User Detail Modal */}
        <Modal
          isOpen={!!selectedUserId}
          onClose={() => setSelectedUserId(null)}
          title="User Profile"
        >
          {isLoadingProfile ? (
            <div style={{ textAlign: 'center', padding: '40px' }}>Loading user profile...</div>
          ) : userProfile ? (
            <ModalContent>
              <UserHeader>
                <UserInfo>
                  <UserName>{userProfile.name}</UserName>
                  <UserEmail>{userProfile.email}</UserEmail>
                </UserInfo>
              </UserHeader>

              {/* Badges */}
              <BadgeContainer>
                <Badge>{userProfile.role}</Badge>
                <Badge variant={userProfile.verificationStatus === 'verified' ? 'success' : 'info'}>
                  {userProfile.verificationStatus}
                </Badge>
                {userProfile.isBlocked && (
                  <Badge variant="error">
                    🚫 Blocked • {userProfile.blockReason}
                  </Badge>
                )}
              </BadgeContainer>

              {/* Stats */}
              <UserStats>
                <StatBox>
                  <StatLabel>Campaigns</StatLabel>
                  <StatValue>{userProfile.totalCampaigns}</StatValue>
                </StatBox>
                <StatBox>
                  <StatLabel>Donations</StatLabel>
                  <StatValue>{userProfile.totalDonations}</StatValue>
                </StatBox>
                <StatBox>
                  <StatLabel>Donated</StatLabel>
                  <StatValue>${(userProfile.totalDonated / 100).toFixed(2)}</StatValue>
                </StatBox>
                <StatBox>
                  <StatLabel>Shares</StatLabel>
                  <StatValue>{userProfile.totalShares}</StatValue>
                </StatBox>
              </UserStats>

              {/* Reports */}
              {userProfile.reportCount > 0 && (
                <>
                  <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: 600 }}>
                    📋 Reports ({userProfile.reportCount})
                  </h4>
                  <ReportsList>
                    {userProfile.reports.map((report) => (
                      <ReportItem key={report.id}>
                        <ReportReason>{report.reason}</ReportReason>
                        <ReportDescription>{report.description}</ReportDescription>
                        <ReportDescription>Status: {report.status}</ReportDescription>
                      </ReportItem>
                    ))}
                  </ReportsList>
                </>
              )}

              {/* Account Info */}
              <div style={{ fontSize: '12px', color: '#6b7280', paddingTop: '16px', borderTop: '1px solid #e5e7eb' }}>
                <p style={{ margin: '0 0 4px 0' }}>
                  Created: {new Date(userProfile.createdAt).toLocaleString()}
                </p>
                {userProfile.lastLoginAt && (
                  <p style={{ margin: '0' }}>
                    Last login: {new Date(userProfile.lastLoginAt).toLocaleString()}
                  </p>
                )}
              </div>

              <ModalActions>
                <Button variant="outline" onClick={() => setSelectedUserId(null)}>
                  Close
                </Button>
              </ModalActions>
            </ModalContent>
          ) : null}
        </Modal>
      </Container>
    </ProtectedRoute>
  )
}
