/**
 * Campaign Payouts Detail Layout
 */

import React from 'react'

export const metadata = {
  title: 'Campaign Payouts | Creator Dashboard',
  description: 'Manage withdrawal requests from sharers on this campaign'
}

export default function CampaignPayoutsLayout({
  children
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
