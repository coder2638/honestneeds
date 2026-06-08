import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import boostService from '@/api/services/boostService'
import { CreateBoostSessionInput } from '@/utils/boostValidationSchemas'

/**
 * React Query Hooks for Campaign Boosts
 */

// Query key factory
export const boostQueryKeys = {
  all: ['boosts'] as const,
  tiers: () => [...boostQueryKeys.all, 'tiers'] as const,
  campaigns: () => [...boostQueryKeys.all, 'campaigns'] as const,
  campaign: (campaignId: string) => [...boostQueryKeys.campaigns(), campaignId] as const,
  myBoosts: () => [...boostQueryKeys.all, 'my-boosts'] as const,
  myBoostsList: (page: number, limit: number) => [...boostQueryKeys.myBoosts(), { page, limit }] as const,
  session: (sessionId: string) => [...boostQueryKeys.all, 'session', sessionId] as const,
};

/**
 * Get available boost tiers
 */
export const useGetBoostTiers = () => {
  return useQuery({
    queryKey: boostQueryKeys.tiers(),
    queryFn: async () => {
      const result = await boostService.getBoostTiers();
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data;
    },
    staleTime: 1000 * 60 * 60, // 1 hour
    gcTime: 1000 * 60 * 60 * 24, // 24 hours
  });
};

/**
 * Get boost for a specific campaign
 */
export const useGetCampaignBoost = (campaignId: string | null) => {
  return useQuery({
    queryKey: campaignId ? boostQueryKeys.campaign(campaignId) : ['campaign-boost-disabled'],
    queryFn: async () => {
      if (!campaignId) throw new Error('Campaign ID required');
      const result = await boostService.getCampaignBoost(campaignId);
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data;
    },
    enabled: !!campaignId,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 15, // 15 minutes
  });
};

/**
 * Get all boosts for current user
 */
export const useGetCreatorBoosts = (page: number = 1, limit: number = 10) => {
  return useQuery({
    queryKey: boostQueryKeys.myBoostsList(page, limit),
    queryFn: async () => {
      const result = await boostService.getCreatorBoosts(page, limit);
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 15, // 15 minutes
  });
};

/**
 * Get Stripe session status
 */
export const useGetSessionStatus = (sessionId: string | null) => {
  return useQuery({
    queryKey: sessionId ? boostQueryKeys.session(sessionId) : ['session-status-disabled'],
    queryFn: async () => {
      if (!sessionId) throw new Error('Session ID required');
      const result = await boostService.getSessionStatus(sessionId);
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data;
    },
    enabled: !!sessionId,
    refetchInterval: 3000, // Poll every 3 seconds
    staleTime: 0, // Always consider stale
  });
};

/**
 * Create checkout session mutation
 */
export const useCreateCheckoutSession = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateBoostSessionInput) => {
      const result = await boostService.createCheckoutSession(data);
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data;
    },
    onSuccess: (data) => {
      // Invalidate campaign boost and my boosts
      queryClient.invalidateQueries({ queryKey: boostQueryKeys.campaigns() });
      queryClient.invalidateQueries({ queryKey: boostQueryKeys.myBoosts() });
    },
  });
};

/**
 * Extend boost mutation
 */
export const useExtendBoost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (boostId: string) => {
      const result = await boostService.extendBoost(boostId);
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data;
    },
    onSuccess: () => {
      // Invalidate boosts
      queryClient.invalidateQueries({ queryKey: boostQueryKeys.campaigns() });
      queryClient.invalidateQueries({ queryKey: boostQueryKeys.myBoosts() });
    },
  });
};

/**
 * Cancel boost mutation
 */
export const useCancelBoost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ boostId, reason }: { boostId: string; reason?: string }) => {
      const result = await boostService.cancelBoost(boostId, reason);
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data;
    },
    onSuccess: () => {
      // Invalidate boosts
      queryClient.invalidateQueries({ queryKey: boostQueryKeys.campaigns() });
      queryClient.invalidateQueries({ queryKey: boostQueryKeys.myBoosts() });
    },
  });
};

/**
 * Update boost stats mutation (admin)
 */
export const useUpdateBoostStats = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      boostId,
      views,
      engagement,
      conversions,
    }: {
      boostId: string;
      views: number;
      engagement: number;
      conversions: number;
    }) => {
      const result = await boostService.updateBoostStats(boostId, views, engagement, conversions);
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data;
    },
    onSuccess: () => {
      // Invalidate boosts
      queryClient.invalidateQueries({ queryKey: boostQueryKeys.all });
    },
  });
};
