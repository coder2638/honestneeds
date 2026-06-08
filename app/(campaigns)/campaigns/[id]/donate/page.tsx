'use client'

import { useParams } from 'next/navigation'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { DonationWizard } from '@/components/donation/DonationWizard'

/**
 * Donation Page
 * Protected route for authenticated users to donate to campaigns
 * Path: /campaigns/[id]/donate
 */
export default function DonatePage() {
  const params = useParams()
  const campaignId = params.id as string

  if (!campaignId) {
    return <div>Campaign not found</div>
  }

  return (
    <ProtectedRoute>
      <DonationWizard campaignId={campaignId} />
    </ProtectedRoute>
  )
}
