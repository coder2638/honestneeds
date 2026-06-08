'use client'

import React from 'react'
import styled from 'styled-components'
import { Trophy, Medal } from 'lucide-react'
import { useLeaderboard } from '@/api/hooks/useSweepstakes'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import { Badge } from '@/components/Badge'

/**
 * Sweepstakes Leaderboard
 * Display top entries in current drawing (anonymized)
 */

const Container = styled.div`
  background: white;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  overflow: hidden;
`

const Header = styled.div`
  background: linear-gradient(135deg, #f59e0b 0%, #f97316 100%);
  color: white;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 12px;
`

const Title = styled.h3`
  font-size: 18px;
  font-weight: 600;
  margin: 0;
`

const TableContainer = styled.div`
  overflow-x: auto;
`

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;

  thead {
    background-color: #f9fafb;
    border-bottom: 2px solid #e5e7eb;
  }

  th {
    padding: 12px 16px;
    text-align: left;
    font-size: 13px;
    font-weight: 600;
    color: #6b7280;
    text-transform: uppercase;
  }

  td {
    padding: 12px 16px;
    border-bottom: 1px solid #e5e7eb;
    font-size: 14px;

    &:last-child {
      text-align: right;
    }
  }

  tbody tr:hover {
    background-color: #f9fafb;
  }
`

const Rank = styled.div`
  font-weight: 600;
  color: #111827;
  width: 30px;
  text-align: center;
`

const RankBadge = styled(Badge)`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  padding: 0;
`

const Name = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
  color: #111827;
`

const Icon = styled.span`
  font-size: 18px;
`

const EntryCount = styled.div`
  font-weight: 600;
  color: #f59e0b;
  font-size: 16px;
`

const EmptyState = styled.div`
  text-align: center;
  padding: 40px 20px;
  color: #6b7280;
  font-size: 14px;
`

interface SweepstakesLeaderboardProps {
  limit?: number
}

export function SweepstakesLeaderboard({ limit = 10 }: SweepstakesLeaderboardProps) {
  const { data, isLoading } = useLeaderboard(limit)

  if (isLoading) {
    return (
      <Container>
        <Header>
          <Trophy size={24} />
          <Title>Sweepstakes Leaderboard</Title>
        </Header>
        <LoadingSpinner />
      </Container>
    )
  }

  const leaders = data || []

  const getRankIcon = (position: number) => {
    if (position === 1) return '🥇'
    if (position === 2) return '🥈'
    if (position === 3) return '🥉'
    return ''
  }

  return (
    <Container>
      <Header>
        <Trophy size={24} />
        <Title>Current Drawing Leaderboard</Title>
      </Header>

      {leaders.length === 0 ? (
        <EmptyState>
          <p>No entries yet in the current drawing. Share to earn entries!</p>
        </EmptyState>
      ) : (
        <TableContainer>
          <Table>
            <thead>
              <tr>
                <th style={{ width: '60px' }}>Rank</th>
                <th>Participant</th>
                <th style={{ width: '120px', textAlign: 'right' }}>Entries</th>
              </tr>
            </thead>
            <tbody>
              {leaders.map((leader, index) => (
                <tr key={leader.id}>
                  <td>
                    <Rank>
                      {getRankIcon(leader.position)} #{leader.position}
                    </Rank>
                  </td>
                  <td>
                    <Name>
                      <Icon>{['🥇', '🥈', '🥉'][index] || '👤'}</Icon>
                      <span>{leader.partialName}</span>
                    </Name>
                  </td>
                  <td>
                    <EntryCount>{leader.entryCount}</EntryCount>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </TableContainer>
      )}
    </Container>
  )
}
