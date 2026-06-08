'use client'

import React from 'react'
import styled from 'styled-components'
import { PrayerRequestConfig } from '@/components/campaign/PrayerRequestConfig'
import { useUpdatePrayerSettings } from '@/api/hooks/usePrayers'
import { CampaignPrayerConfig } from '@/utils/prayerValidationSchemas'
import { SPACING } from '@/styles/tokens'

const Container = styled.div`
  padding: ${SPACING[6]} 0;
`

interface PrayerSettingsTabProps {
  campaignId: string
  initialConfig?: Partial<CampaignPrayerConfig>
}

/**
 * PrayerSettingsTab Component
 * Tab for campaign settings pages to configure prayer support
 * Integrates with the campaign settings interface
 */
const PrayerSettingsTab: React.FC<PrayerSettingsTabProps> = ({
  campaignId,
  initialConfig,
}) => {
  const { mutate: updateSettings, isPending } = useUpdatePrayerSettings()

  const handleSaveConfig = (config: CampaignPrayerConfig) => {
    updateSettings({
      campaignId,
      settings: config,
    })
  }

  return (
    <Container>
      <PrayerRequestConfig
        initialConfig={initialConfig}
        onSave={handleSaveConfig}
        isLoading={isPending}
      />
    </Container>
  )
}

export { PrayerSettingsTab };
export default PrayerSettingsTab;
