'use client'

import { useState } from 'react'
import styles from './PayoutRequestModal.module.css'

/**
 * PayoutRequestModal - Phase 4 (Enhanced)
 * Modal for requesting a payout with account details
 */
interface PayoutRequestModalProps {
  available_cents: number
  onSubmit: (data: {
    amount_cents: number
    payment_method: string
    accountDetails: Record<string, string | null>
  }) => void
  onClose: () => void
  isLoading: boolean
}

export default function PayoutRequestModal({
  available_cents,
  onSubmit,
  onClose,
  isLoading,
}: PayoutRequestModalProps) {
  const [amount_cents, setAmount_cents] = useState(Math.min(10000, available_cents)) // Default to min or available
  const [paymentMethod, setPaymentMethod] = useState('bank_transfer')
  const [error, setError] = useState('')

  // Bank transfer fields
  const [accountHolder, setAccountHolder] = useState('')
  const [bankName, setBankName] = useState('')
  const [accountType, setAccountType] = useState('checking')
  const [accountLast4, setAccountLast4] = useState('')
  const [routingLast4, setRoutingLast4] = useState('')

  // Mobile money fields
  const [mobileNumber, setMobileNumber] = useState('')
  const [mobileProvider, setMobileProvider] = useState('mpesa')
  const [countryCode, setCountryCode] = useState('US')

  // Stripe/PayPal fields
  const [stripePaymentMethodId, setStripePaymentMethodId] = useState('')
  const [paypalEmail, setPaypalEmail] = useState('')

  const availableDollars = (available_cents / 100).toFixed(2)
  const requestedDollars = (amount_cents / 100).toFixed(2)

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newAmount = Math.round(parseFloat(e.target.value) * 100)
    setAmount_cents(newAmount)
    setError('')
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Validate amount
    if (amount_cents < 1000) {
      setError('Minimum payout amount is $10.00')
      return
    }

    if (amount_cents > available_cents) {
      setError(`Amount cannot exceed available balance of $${availableDollars}`)
      return
    }

    // Validate account details based on payment method
    const accountDetails: Record<string, string | null> = {}

    if (paymentMethod === 'bank_transfer') {
      if (!accountHolder.trim()) {
        setError('Account holder name is required')
        return
      }
      if (!bankName.trim()) {
        setError('Bank name is required')
        return
      }
      if (!accountLast4.trim() || accountLast4.length !== 4) {
        setError('Last 4 digits of account number required')
        return
      }
      accountDetails.accountHolder = accountHolder
      accountDetails.bankName = bankName
      accountDetails.accountType = accountType
      accountDetails.last4 = accountLast4
      accountDetails.routingNumberLast4 = routingLast4 || null
    } else if (paymentMethod === 'paypal') {
      if (!paypalEmail.trim()) {
        setError('PayPal email is required')
        return
      }
      accountDetails.paypalEmail = paypalEmail
    } else if (paymentMethod === 'stripe') {
      if (!stripePaymentMethodId.trim()) {
        setError('Stripe payment method ID is required')
        return
      }
      accountDetails.stripePaymentMethodId = stripePaymentMethodId
    }

    onSubmit({
      amount_cents,
      payment_method: paymentMethod,
      accountDetails,
    })
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>Request Payout</h2>
          <button className={styles.closeBtn} onClick={onClose}>
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {/* Amount Input */}
          <div className={styles.formGroup}>
            <label htmlFor="amount">Amount to Request</label>
            <div className={styles.amountInput}>
              <span className={styles.currency}>$</span>
              <input
                id="amount"
                type="number"
                step="0.01"
                min="10"
                max={availableDollars}
                value={(amount_cents / 100).toFixed(2)}
                onChange={handleAmountChange}
                disabled={isLoading}
                className={styles.input}
              />
            </div>
            <p className={styles.hint}>
              Available: ${availableDollars}
            </p>
          </div>

          {/* Payment Method */}
          <div className={styles.formGroup}>
            <label htmlFor="paymentMethod">Payment Method</label>
            <select
              id="paymentMethod"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              disabled={isLoading}
              className={styles.select}
            >
              <option value="bank_transfer">Bank Transfer (ACH)</option>
              <option value="paypal">PayPal</option>
              <option value="stripe">Stripe</option>
            </select>
            <p className={styles.hint}>
              Select how you'd like to receive funds
            </p>
          </div>

          {/* Bank Transfer Fields */}
          {paymentMethod === 'bank_transfer' && (
            <>
              <div className={styles.formGroup}>
                <label htmlFor="accountHolder">Account Holder Name</label>
                <input
                  id="accountHolder"
                  type="text"
                  value={accountHolder}
                  onChange={(e) => setAccountHolder(e.target.value)}
                  disabled={isLoading}
                  className={styles.input}
                  placeholder="Full name on account"
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="bankName">Bank Name</label>
                <input
                  id="bankName"
                  type="text"
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  disabled={isLoading}
                  className={styles.input}
                  placeholder="Your bank's name"
                />
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="accountType">Account Type</label>
                  <select
                    id="accountType"
                    value={accountType}
                    onChange={(e) => setAccountType(e.target.value)}
                    disabled={isLoading}
                    className={styles.select}
                  >
                    <option value="checking">Checking</option>
                    <option value="savings">Savings</option>
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="accountLast4">Last 4 Digits</label>
                  <input
                    id="accountLast4"
                    type="text"
                    value={accountLast4}
                    onChange={(e) => setAccountLast4(e.target.value.slice(0, 4))}
                    disabled={isLoading}
                    className={styles.input}
                    placeholder="0000"
                    maxLength={4}
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="routingLast4">Routing Number Last 4 (Optional)</label>
                <input
                  id="routingLast4"
                  type="text"
                  value={routingLast4}
                  onChange={(e) => setRoutingLast4(e.target.value.slice(0, 4))}
                  disabled={isLoading}
                  className={styles.input}
                  placeholder="0000"
                  maxLength={4}
                />
              </div>
            </>
          )}

          {/* PayPal Fields */}
          {paymentMethod === 'paypal' && (
            <div className={styles.formGroup}>
              <label htmlFor="paypalEmail">PayPal Email</label>
              <input
                id="paypalEmail"
                type="email"
                value={paypalEmail}
                onChange={(e) => setPaypalEmail(e.target.value)}
                disabled={isLoading}
                className={styles.input}
                placeholder="your@email.com"
              />
            </div>
          )}

          {/* Stripe Fields */}
          {paymentMethod === 'stripe' && (
            <div className={styles.formGroup}>
              <label htmlFor="stripePaymentMethodId">Stripe Payment Method ID</label>
              <input
                id="stripePaymentMethodId"
                type="text"
                value={stripePaymentMethodId}
                onChange={(e) => setStripePaymentMethodId(e.target.value)}
                disabled={isLoading}
                className={styles.input}
                placeholder="pm_xxxx"
              />
            </div>
          )}

          {/* Error Message */}
          {error && <div className={styles.error}>{error}</div>}

          {/* Summary */}
          <div className={styles.summary}>
            <div className={styles.summaryRow}>
              <span>Requested Amount:</span>
              <span className={styles.amount}>${requestedDollars}</span>
            </div>
            <div className={styles.summaryRow}>
              <span>Remaining Available:</span>
              <span>${((available_cents - amount_cents) / 100).toFixed(2)}</span>
            </div>
          </div>

          {/* Info */}
          <div className={styles.info}>
            <p>
              <strong>Processing Time:</strong> Your request will be reviewed
              within 1-2 hours. Once approved, funds transfer within 1-3 business
              days.
            </p>
          </div>

          {/* Buttons */}
          <div className={styles.buttons}>
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className={styles.cancelBtn}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className={styles.submitBtn}
            >
              {isLoading ? 'Submitting...' : 'Request Payout'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
