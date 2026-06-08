'use client'

import { formatDistanceToNow } from 'date-fns'
import styles from './PayoutHistory.module.css'

/**
 * PayoutHistory - Phase 4
 * Display list of creator's payouts with status
 */
interface Payout {
  id: string
  amount_cents: number
  status: 'requested' | 'approved' | 'completed' | 'failed'
  payment_method: string
  requested_at: string
  approved_at?: string
  completed_at?: string
  failed_reason?: string
}

interface PayoutHistoryProps {
  payouts: Payout[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
  summary: {
    total_requested_cents: number
    total_approved_cents: number
    total_completed_cents: number
    total_failed_cents: number
    total_all_cents: number
  }
}

export default function PayoutHistory({
  payouts,
  pagination,
  summary,
}: PayoutHistoryProps) {
  const getStatusColor = (
    status: 'requested' | 'approved' | 'completed' | 'failed'
  ) => {
    switch (status) {
      case 'requested':
        return 'warning'
      case 'approved':
        return 'info'
      case 'completed':
        return 'success'
      case 'failed':
        return 'error'
      default:
        return 'default'
    }
  }

  const getStatusIcon = (
    status: 'requested' | 'approved' | 'completed' | 'failed'
  ) => {
    switch (status) {
      case 'requested':
        return '⏳'
      case 'approved':
        return '✓'
      case 'completed':
        return '✓✓'
      case 'failed':
        return '✕'
      default:
        return '○'
    }
  }

  const getStatusLabel = (
    status: 'requested' | 'approved' | 'completed' | 'failed'
  ) => {
    switch (status) {
      case 'requested':
        return 'Pending Review'
      case 'approved':
        return 'Approved'
      case 'completed':
        return 'Completed'
      case 'failed':
        return 'Rejected'
      default:
        return status
    }
  }

  const getPaymentMethodLabel = (method: string) => {
    const labels: { [key: string]: string } = {
      bank_transfer: '🏦 Bank Transfer',
      paypal: '🔵 PayPal',
      stripe: '⚡ Stripe',
      venmo: '📱 Venmo',
    }
    return labels[method] || method
  }

  if (payouts.length === 0) {
    return (
      <div className={styles.empty}>
        <p>No payout requests yet</p>
        <p className={styles.hint}>
          Once you have verified donations, you can request a payout!
        </p>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      {/* Summary Stats */}
      <div className={styles.stats}>
        <div className={styles.statCard}>
          <span className={styles.label}>Total Completed</span>
          <span className={styles.amount}>
            ${(summary.total_completed_cents / 100).toFixed(2)}
          </span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.label}>Pending Review</span>
          <span className={styles.amount}>
            ${((summary.total_requested_cents + summary.total_approved_cents) / 100).toFixed(2)}
          </span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.label}>Total All Time</span>
          <span className={styles.amount}>
            ${(summary.total_all_cents / 100).toFixed(2)}
          </span>
        </div>
      </div>

      {/* Payouts Table */}
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Requested</th>
              <th>Amount</th>
              <th>Method</th>
              <th>Status</th>
              <th>Updated</th>
            </tr>
          </thead>
          <tbody>
            {payouts.map((payout) => {
              const requestedDate = new Date(payout.requested_at)
              const statusColor = getStatusColor(payout.status)
              const statusTime =
                payout.completed_at ||
                payout.approved_at ||
                payout.requested_at

              return (
                <tr key={payout.id} className={styles[`row-${statusColor}`]}>
                  <td className={styles.date}>
                    {requestedDate.toLocaleDateString()} at{' '}
                    {requestedDate.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </td>
                  <td className={styles.amount}>
                    ${(payout.amount_cents / 100).toFixed(2)}
                  </td>
                  <td>{getPaymentMethodLabel(payout.payment_method)}</td>
                  <td>
                    <span className={`${styles.status} ${styles[`status-${statusColor}`]}`}>
                      {getStatusIcon(payout.status)}{' '}
                      {getStatusLabel(payout.status)}
                    </span>
                  </td>
                  <td className={styles.updated}>
                    {formatDistanceToNow(new Date(statusTime), {
                      addSuffix: true,
                    })}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className={styles.pagination}>
          <p>
            Showing {payouts.length} of {pagination.total} payouts (Page{' '}
            {pagination.page} of {pagination.pages})
          </p>
        </div>
      )}

      {/* Failed Payouts Note */}
      {summary.total_failed_cents > 0 && (
        <div className={styles.note}>
          <p>
            💡
            {' '}
            ${(summary.total_failed_cents / 100).toFixed(2)} in payouts were
            rejected. Contact support if you have questions.
          </p>
        </div>
      )}
    </div>
  )
}
