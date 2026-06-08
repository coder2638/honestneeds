'use client'

import { useEffect, useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { useUser } from '@/hooks/useUser'
import { usePayoutUpdates } from '@/hooks/useWebSocket'
import PayoutRequestModal from '@/components/payouts/PayoutRequestModal'
import PayoutHistory from '@/components/payouts/PayoutHistory'
import styles from './payouts.module.css'

/**
 * CreatorPayoutsPage - Phase 4
 * Manage payout requests and view history
 */
export default function CreatorPayoutsPage() {
  const { user } = useUser()
  const queryClient = useQueryClient()
  const [showRequestModal, setShowRequestModal] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  // Enable WebSocket updates
  usePayoutUpdates(!!user)

  /**
   * Fetch available balance for payout
   */
  const { data: availableData, isLoading: availableLoading } = useQuery({
    queryKey: ['payouts', 'available'],
    queryFn: async () => {
      const { data } = await axios.get('/api/payouts/available')
      return data
    },
    enabled: !!user,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  /**
   * Fetch payout history
   */
  const {
    data: historyData,
    isLoading: historyLoading,
    error: historyError,
  } = useQuery({
    queryKey: ['payouts', 'history'],
    queryFn: async () => {
      const { data } = await axios.get('/api/payouts/my-payouts?page=1&limit=20')
      return data
    },
    enabled: !!user,
    staleTime: 3 * 60 * 1000, // 3 minutes
  })

  /**
   * Create payout request mutation
   */
  const { mutate: requestPayout, isPending: isRequesting } = useMutation({
    mutationFn: async ({ amount_cents, payment_method, accountDetails }) => {
      const { data } = await axios.post('/api/payouts', {
        amount_cents,
        payment_method,
        accountDetails,
      })
      return data
    },
    onSuccess: () => {
      setShowRequestModal(false)
      setSuccessMessage('Payout request submitted successfully!')
      queryClient.invalidateQueries({ queryKey: ['payouts'] })
      setTimeout(() => setSuccessMessage(''), 5000)
    },
    onError: (error) => {
      alert(`Error: ${error.response?.data?.error || error.message}`)
    },
  })

  if (!user) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Please log in to view payouts</div>
      </div>
    )
  }

  const availableCents = availableData?.data?.available_cents || 0
  const availableDollars = (availableCents / 100).toFixed(2)
  const donationCount = availableData?.data?.count || 0

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <h1>💰 Payout Management</h1>
        <p>Request and track payouts from your verified donations</p>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className={styles.successMessage}>
          <span>✓ {successMessage}</span>
          <button
            onClick={() => setSuccessMessage('')}
            className={styles.closeBtn}
          >
            ✕
          </button>
        </div>
      )}

      {/* Available Balance Card */}
      <div className={styles.availableCard}>
        <div className={styles.cardContent}>
          <div>
            <p className={styles.label}>Available for Payout</p>
            <h2 className={styles.amount}>${availableDollars}</h2>
            <p className={styles.subtext}>
              From {donationCount} verified donation{donationCount !== 1 ? 's' : ''}
            </p>
          </div>

          {availableCents >= 1000 && (
            <button
              onClick={() => setShowRequestModal(true)}
              className={styles.requestBtn}
              disabled={isRequesting}
            >
              {isRequesting ? 'Processing...' : 'Request Payout'}
            </button>
          )}
        </div>

        {availableCents < 1000 && availableCents > 0 && (
          <div className={styles.minAmountWarning}>
            ℹ️ Minimum payout amount is $10.00. You have ${availableDollars} available.
          </div>
        )}

        {availableCents === 0 && (
          <div className={styles.noFundsMessage}>
            No verified donations available for payout yet. Keep promoting your
            campaigns to earn more!
          </div>
        )}
      </div>

      {/* Request Modal */}
      {showRequestModal && (
        <PayoutRequestModal
          available_cents={availableCents}
          onSubmit={requestPayout}
          onClose={() => setShowRequestModal(false)}
          isLoading={isRequesting}
        />
      )}

      {/* Payout History */}
      <div className={styles.historySection}>
        <h2>Payout History</h2>

        {historyLoading && <div className={styles.loading}>Loading payouts...</div>}

        {historyError && (
          <div className={styles.error}>
            Failed to load payout history: {historyError.message}
          </div>
        )}

        {historyData && !historyLoading && (
          <PayoutHistory
            payouts={historyData.data}
            pagination={historyData.pagination}
            summary={historyData.summary}
          />
        )}
      </div>

      {/* Info Section */}
      <div className={styles.infoSection}>
        <h3>How Payouts Work</h3>
        <ul className={styles.infoList}>
          <li>
            <strong>Request:</strong> Submit a payout request for any amount of
            verified donations
          </li>
          <li>
            <strong>Review:</strong> Our team reviews your request (usually within
            1-2 hours)
          </li>
          <li>
            <strong>Approval:</strong> Once approved, we process the transfer to
            your account
          </li>
          <li>
            <strong>Delivery:</strong> Funds appear in 1-3 business days depending
            on your bank
          </li>
          <li>
            <strong>Minimum:</strong> Minimum payout amount is $10.00
          </li>
          <li>
            <strong>Fees:</strong> Payouts are 100% of verified donation amounts
            (no additional fees)
          </li>
        </ul>
      </div>
    </div>
  )
}
