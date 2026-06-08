'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  adminUserService,
  AdminUserListItem,
  AdminUserProfile,
  UserVerificationStatus,
  UserBlockReason,
  UserReport,
} from '@/api/services/adminUserService'
import {
  adminContentService,
  AdminCategory,
  PlatformContent,
  PlatformSettings,
} from '@/api/services/adminContentService'

/**
 * Query key factory for admin operations
 */
const ADMIN_QUERY_KEYS = {
  // Users
  users: () => ['admin', 'users'],
  usersList: (page: number, limit: number, filters?: any) => [
    ...ADMIN_QUERY_KEYS.users(),
    'list',
    { page, limit, ...filters },
  ],
  userProfile: (userId: string) => [...ADMIN_QUERY_KEYS.users(), 'profile', userId],
  userStats: () => [...ADMIN_QUERY_KEYS.users(), 'statistics'],
  reports: () => ['admin', 'reports'],
  reportsList: (page: number, limit: number) => [...ADMIN_QUERY_KEYS.reports(), 'list', { page, limit }],
  userReports: (userId: string) => [...ADMIN_QUERY_KEYS.reports(), 'user', userId],

  // Content
  categories: () => ['admin', 'categories'],
  content: (type: string) => ['admin', 'content', type],
  contentHistory: (type: string) => [...ADMIN_QUERY_KEYS.content(type), 'history'],
  settings: () => ['admin', 'settings'],
  settingsChangelog: () => [...ADMIN_QUERY_KEYS.settings(), 'changelog'],
}

/**
 * Fetch users with pagination and filters
 */
export function useAdminUsers(page: number = 1, limit: number = 20, filters?: any) {
  return useQuery({
    queryKey: ADMIN_QUERY_KEYS.usersList(page, limit, filters),
    queryFn: () => adminUserService.getUsers(page, limit, filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
  })
}

/**
 * Fetch single user profile
 */
export function useAdminUserProfile(userId: string) {
  return useQuery({
    queryKey: ADMIN_QUERY_KEYS.userProfile(userId),
    queryFn: () => adminUserService.getUserProfile(userId),
    enabled: !!userId,
    staleTime: 3 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  })
}

/**
 * Fetch user statistics
 */
export function useAdminUserStatistics() {
  return useQuery({
    queryKey: ADMIN_QUERY_KEYS.userStats(),
    queryFn: () => adminUserService.getUserStatistics(),
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  })
}

/**
 * Verify user mutation
 */
export function useVerifyUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ userId, notes }: { userId: string; notes?: string }) =>
      adminUserService.verifyUser(userId, notes),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ADMIN_QUERY_KEYS.users() })
      queryClient.invalidateQueries({ queryKey: ADMIN_QUERY_KEYS.userProfile(data.id) })
      queryClient.invalidateQueries({ queryKey: ADMIN_QUERY_KEYS.userStats() })
    },
  })
}

/**
 * Reject verification mutation
 */
export function useRejectVerification() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ userId, reason }: { userId: string; reason: string }) =>
      adminUserService.rejectVerification(userId, reason),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ADMIN_QUERY_KEYS.users() })
      queryClient.invalidateQueries({ queryKey: ADMIN_QUERY_KEYS.userProfile(data.id) })
    },
  })
}

/**
 * Block user mutation
 */
export function useBlockUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      userId,
      reason,
      explanation,
    }: {
      userId: string
      reason: UserBlockReason
      explanation?: string
    }) => adminUserService.blockUser(userId, reason, explanation),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ADMIN_QUERY_KEYS.users() })
      queryClient.invalidateQueries({ queryKey: ADMIN_QUERY_KEYS.userProfile(data.id) })
    },
  })
}

/**
 * Unblock user mutation
 */
export function useUnblockUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (userId: string) => adminUserService.unblockUser(userId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ADMIN_QUERY_KEYS.users() })
      queryClient.invalidateQueries({ queryKey: ADMIN_QUERY_KEYS.userProfile(data.id) })
    },
  })
}

/**
 * Fetch user reports
 */
export function useUserReports(userId: string) {
  return useQuery({
    queryKey: ADMIN_QUERY_KEYS.userReports(userId),
    queryFn: () => adminUserService.getUserReports(userId),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
  })
}

/**
 * Fetch pending reports
 */
export function usePendingReports(page: number = 1, limit: number = 20) {
  return useQuery({
    queryKey: ADMIN_QUERY_KEYS.reportsList(page, limit),
    queryFn: () => adminUserService.getPendingReports(page, limit),
    staleTime: 3 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  })
}

/**
 * Resolve report mutation
 */
export function useResolveReport() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      reportId,
      action,
      notes,
    }: {
      reportId: string
      action: 'dismiss' | 'block_user' | 'warn_user'
      notes?: string
    }) => adminUserService.resolveReport(reportId, action, notes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_QUERY_KEYS.reports() })
      queryClient.invalidateQueries({ queryKey: ADMIN_QUERY_KEYS.userStats() })
    },
  })
}

/**
 * Delete user mutation
 */
export function useDeleteUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ userId, anonymize }: { userId: string; anonymize?: boolean }) =>
      adminUserService.deleteUser(userId, anonymize),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_QUERY_KEYS.users() })
      queryClient.invalidateQueries({ queryKey: ADMIN_QUERY_KEYS.userStats() })
    },
  })
}

/**
 * Fetch categories
 */
export function useAdminCategories() {
  return useQuery({
    queryKey: ADMIN_QUERY_KEYS.categories(),
    queryFn: () => adminContentService.getCategories(),
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  })
}

/**
 * Create category mutation
 */
export function useCreateCategory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: any) => adminContentService.createCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_QUERY_KEYS.categories() })
    },
  })
}

/**
 * Update category mutation
 */
export function useUpdateCategory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ categoryId, data }: { categoryId: string; data: Partial<AdminCategory> }) =>
      adminContentService.updateCategory(categoryId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_QUERY_KEYS.categories() })
    },
  })
}

/**
 * Delete category mutation
 */
export function useDeleteCategory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (categoryId: string) => adminContentService.deleteCategory(categoryId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_QUERY_KEYS.categories() })
    },
  })
}

/**
 * Reorder categories mutation
 */
export function useReorderCategories() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (categories: { id: string; order: number }[]) =>
      adminContentService.reorderCategories(categories),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_QUERY_KEYS.categories() })
    },
  })
}

/**
 * Fetch platform content
 */
export function usePlatformContent(type: 'manifesto' | 'about' | 'terms' | 'privacy') {
  return useQuery({
    queryKey: ADMIN_QUERY_KEYS.content(type),
    queryFn: () => adminContentService.getPlatformContent(type),
    staleTime: 15 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
  })
}

/**
 * Update platform content mutation
 */
export function useUpdatePlatformContent() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      type,
      data,
    }: {
      type: 'manifesto' | 'about' | 'terms' | 'privacy'
      data: { title: string; content: string }
    }) => adminContentService.updatePlatformContent(type, data),
    onSuccess: (_data, { type }) => {
      queryClient.invalidateQueries({ queryKey: ADMIN_QUERY_KEYS.content(type) })
      queryClient.invalidateQueries({ queryKey: ADMIN_QUERY_KEYS.contentHistory(type) })
    },
  })
}

/**
 * Fetch content version history
 */
export function useContentVersionHistory(type: 'manifesto' | 'about' | 'terms' | 'privacy') {
  return useQuery({
    queryKey: ADMIN_QUERY_KEYS.contentHistory(type),
    queryFn: () => adminContentService.getContentVersionHistory(type),
    enabled: !!type,
    staleTime: 15 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
  })
}

/**
 * Restore content version mutation
 */
export function useRestoreContentVersion() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ type, version }: { type: string; version: number }) =>
      adminContentService.restoreContentVersion(type, version),
    onSuccess: (_data, { type }) => {
      queryClient.invalidateQueries({ queryKey: ADMIN_QUERY_KEYS.content(type) })
    },
  })
}

/**
 * Fetch platform settings
 */
export function usePlatformSettings() {
  return useQuery({
    queryKey: ADMIN_QUERY_KEYS.settings(),
    queryFn: () => adminContentService.getPlatformSettings(),
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  })
}

/**
 * Update platform settings mutation
 */
export function useUpdatePlatformSettings() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: Partial<PlatformSettings>) => adminContentService.updatePlatformSettings(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_QUERY_KEYS.settings() })
      queryClient.invalidateQueries({ queryKey: ADMIN_QUERY_KEYS.settingsChangelog() })
    },
  })
}

/**
 * Set maintenance mode mutation
 */
export function useSetMaintenanceMode() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ enabled, message }: { enabled: boolean; message?: string }) =>
      adminContentService.setMaintenanceMode(enabled, message),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_QUERY_KEYS.settings() })
    },
  })
}

/**
 * Fetch settings changelog
 */
export function useSettingsChangelog(limit: number = 50) {
  return useQuery({
    queryKey: ADMIN_QUERY_KEYS.settingsChangelog(),
    queryFn: () => adminContentService.getSettingsChangelog(limit),
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  })
}

/**
 * Validate settings mutation
 */
export function useValidateSettings() {
  return useMutation({
    mutationFn: (settings: Partial<PlatformSettings>) => adminContentService.validateSettings(settings),
  })
}

/**
 * Reset settings to defaults mutation
 */
export function useResetSettingsToDefaults() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => adminContentService.loadDefaultSettings(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_QUERY_KEYS.settings() })
    },
  })
}
