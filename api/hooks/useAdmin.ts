'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  adminService,
  type AdminOverviewStats,
  type ActivityFeedItem,
  type AdminAlert,
  type CampaignModerationList,
  type TransactionList,
  type AdminSettings,
} from '@/api/services/adminService'

/**
 * Admin Hooks
 * - useAdminOverview: Admin dashboard stats
 * - useActivityFeed: Recent activity feed
 * - useAdminAlerts: Admin alerts
 * - useCampaignsForModeration: Campaign moderation queue
 * - useTransactionsForVerification: Transaction verification table
 * - useAdminSettings: Admin settings
 * - And mutations for flag, suspend, verify, reject, etc.
 */

// Query key factory
const adminKeys = {
  all: ['admin'],
  overview: () => [...adminKeys.all, 'overview'],
  activityFeed: () => [...adminKeys.all, 'activity-feed'],
  alerts: () => [...adminKeys.all, 'alerts'],
  campaigns: () => [...adminKeys.all, 'campaigns'],
  campaignsModeration: (page: number, limit: number, status?: string, sortBy?: string) => [
    ...adminKeys.campaigns(),
    'moderation',
    { page, limit, status, sortBy },
  ],
  transactions: () => [...adminKeys.all, 'transactions'],
  transactionsVerification: (page: number, limit: number, status?: string, sortBy?: string) => [
    ...adminKeys.transactions(),
    'verification',
    { page, limit, status, sortBy },
  ],
  transactionDetail: (id: string) => [...adminKeys.transactions(), 'detail', id],
  settings: () => [...adminKeys.all, 'settings'],
}

// ============================================
// USE ADMIN OVERVIEW
// ============================================
export function useAdminOverview() {
  return useQuery({
    queryKey: adminKeys.overview(),
    queryFn: () => adminService.getAdminOverview(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
    refetchInterval: 10 * 60 * 1000, // Refetch every 10 minutes
  })
}

// ============================================
// USE ACTIVITY FEED
// ============================================
export function useActivityFeed(limit: number = 10) {
  return useQuery({
    queryKey: adminKeys.activityFeed(),
    queryFn: () => adminService.getActivityFeed(limit),
    staleTime: 3 * 60 * 1000, // 3 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  })
}

// ============================================
// USE ADMIN ALERTS
// ============================================
export function useAdminAlerts() {
  return useQuery({
    queryKey: adminKeys.alerts(),
    queryFn: () => adminService.getAlerts(),
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  })
}

// ============================================
// USE CAMPAIGNS FOR MODERATION
// ============================================
export function useCampaignsForModeration(
  page: number = 1,
  limit: number = 25,
  status?: string,
  sortBy?: string
) {
  return useQuery({
    queryKey: adminKeys.campaignsModeration(page, limit, status, sortBy),
    queryFn: () => adminService.getCampaignsForModeration(page, limit, { status, sortBy }),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
  })
}

// ============================================
// USE FLAG CAMPAIGN
// ============================================
export function useFlagCampaign() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      campaignId,
      reason,
      notes,
    }: {
      campaignId: string
      reason: string
      notes?: string
    }) => adminService.flagCampaign(campaignId, reason, notes),
    onSuccess: () => {
      // Invalidate moderation queue
      queryClient.invalidateQueries({ queryKey: adminKeys.campaigns() })
      queryClient.invalidateQueries({ queryKey: adminKeys.alerts() })
    },
  })
}

// ============================================
// USE UNFLAG CAMPAIGN
// ============================================
export function useUnflagCampaign() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (campaignId: string) => adminService.unflagCampaign(campaignId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.campaigns() })
      queryClient.invalidateQueries({ queryKey: adminKeys.alerts() })
    },
  })
}

// ============================================
// USE SUSPEND CAMPAIGN
// ============================================
export function useSuspendCampaign() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      campaignId,
      reason,
      duration,
      notifyCreator,
    }: {
      campaignId: string
      reason: string
      duration: '7days' | '30days' | 'permanent'
      notifyCreator?: boolean
    }) => adminService.suspendCampaign(campaignId, reason, duration, notifyCreator),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.campaigns() })
      queryClient.invalidateQueries({ queryKey: adminKeys.overview() })
    },
  })
}

// ============================================
// USE UNSUSPEND CAMPAIGN
// ============================================
export function useUnsuspendCampaign() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (campaignId: string) => adminService.unsuspendCampaign(campaignId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.campaigns() })
      queryClient.invalidateQueries({ queryKey: adminKeys.overview() })
    },
  })
}

// ============================================
// USE APPROVE CAMPAIGN
// ============================================
export function useApproveCampaign() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (campaignId: string) => adminService.approveCampaign(campaignId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.campaigns() })
      queryClient.invalidateQueries({ queryKey: adminKeys.overview() })
    },
  })
}

// ============================================
// USE TRANSACTIONS FOR VERIFICATION
// ============================================
export function useTransactionsForVerification(
  page: number = 1,
  limit: number = 25,
  status?: string,
  sortBy?: string
) {
  return useQuery({
    queryKey: adminKeys.transactionsVerification(page, limit, status, sortBy),
    queryFn: () =>
      adminService.getTransactionsForVerification(page, limit, { status, sortBy }),
    staleTime: 3 * 60 * 1000, // 3 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
  })
}

// ============================================
// USE TRANSACTION DETAIL
// ============================================
export function useTransactionDetail(transactionId: string | undefined) {
  return useQuery({
    queryKey: adminKeys.transactionDetail(transactionId || ''),
    queryFn: () => adminService.getTransactionDetail(transactionId!),
    enabled: !!transactionId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
  })
}

// ============================================
// USE VERIFY TRANSACTION
// ============================================
export function useVerifyTransaction() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (transactionId: string) => adminService.verifyTransaction(transactionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.transactions() })
      queryClient.invalidateQueries({ queryKey: adminKeys.overview() })
    },
  })
}

// ============================================
// USE BULK VERIFY TRANSACTIONS
// ============================================
export function useBulkVerifyTransactions() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (transactionIds: string[]) =>
      adminService.bulkVerifyTransactions(transactionIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.transactions() })
      queryClient.invalidateQueries({ queryKey: adminKeys.overview() })
    },
  })
}

// ============================================
// USE REJECT TRANSACTION
// ============================================
export function useRejectTransaction() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      transactionId,
      reason,
    }: {
      transactionId: string
      reason: string
    }) => adminService.rejectTransaction(transactionId, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.transactions() })
      queryClient.invalidateQueries({ queryKey: adminKeys.overview() })
    },
  })
}

// ============================================
// USE BULK REJECT TRANSACTIONS
// ============================================
export function useBulkRejectTransactions() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      transactionIds,
      reason,
    }: {
      transactionIds: string[]
      reason: string
    }) => adminService.bulkRejectTransactions(transactionIds, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.transactions() })
      queryClient.invalidateQueries({ queryKey: adminKeys.overview() })
    },
  })
}

// ============================================
// USE ADMIN SETTINGS
// ============================================
export function useAdminSettings() {
  return useQuery({
    queryKey: adminKeys.settings(),
    queryFn: () => adminService.getAdminSettings(),
    staleTime: 60 * 60 * 1000, // 1 hour
    gcTime: 24 * 60 * 60 * 1000, // 24 hours
  })
}

// ============================================
// USE UPDATE ADMIN SETTINGS
// ============================================
export function useUpdateAdminSettings() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (settings: Parameters<typeof adminService.updateAdminSettings>[0]) =>
      adminService.updateAdminSettings(settings),
    onSuccess: (result) => {
      queryClient.setQueryData(adminKeys.settings(), result)
    },
  })
}
