import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { GeographicScope } from '@/utils/validationSchemas'

export interface CampaignFilters {
  searchQuery: string
  needTypes: string[]
  location?: string
  locationRadius?: number // miles
  geographicScope?: GeographicScope | 'all'
  minGoal?: number // in cents
  maxGoal?: number // in cents
  status: 'all' | 'active' | 'completed' | 'paused'
  sortBy: 'trending' | 'newest' | 'goalAsc' | 'goalDesc' | 'raised'
  page: number
  limit: number
  userId?: string // for filtering campaigns by creator
}

export interface FilterStore {
  filters: CampaignFilters
  setSearchQuery: (query: string) => void
  setNeedTypes: (types: string[]) => void
  setLocation: (location: string, radius: number) => void
  setGeographicScope: (scope: GeographicScope | 'all' | undefined) => void
  setGoalRange: (min: number, max: number) => void
  setStatus: (status: 'all' | 'active' | 'completed' | 'paused') => void
  setSortBy: (sort: CampaignFilters['sortBy']) => void
  setPage: (page: number) => void
  resetFilters: () => void
  getQueryParams: () => Record<string, string | number>
}

const defaultFilters: CampaignFilters = {
  searchQuery: '',
  needTypes: [],
  status: 'all',
  sortBy: 'trending',
  page: 1,
  limit: 12,
}

export const useFilterStore = create<FilterStore>()(
  persist(
    (set, get) => ({
      filters: defaultFilters,

      setSearchQuery: (query: string) =>
        set((state) => ({
          filters: { ...state.filters, searchQuery: query, page: 1 },
        })),

      setNeedTypes: (types: string[]) =>
        set((state) => ({
          filters: { ...state.filters, needTypes: types, page: 1 },
        })),

      setLocation: (location: string, radius: number) =>
        set((state) => ({
          filters: { ...state.filters, location, locationRadius: radius, page: 1 },
        })),

      setGeographicScope: (scope) =>
        set((state) => ({
          filters: { ...state.filters, geographicScope: scope, page: 1 },
        })),

      setGoalRange: (min: number, max: number) =>
        set((state) => ({
          filters: { ...state.filters, minGoal: min, maxGoal: max, page: 1 },
        })),

      setStatus: (status: 'all' | 'active' | 'completed' | 'paused') =>
        set((state) => ({
          filters: { ...state.filters, status, page: 1 },
        })),

      setSortBy: (sort: CampaignFilters['sortBy']) =>
        set((state) => ({
          filters: { ...state.filters, sortBy: sort, page: 1 },
        })),

      setPage: (page: number) =>
        set((state) => ({
          filters: { ...state.filters, page },
        })),

      resetFilters: () =>
        set({
          filters: defaultFilters,
        }),

      getQueryParams: () => {
        const { filters } = get()
        const params: Record<string, string | number> = {
          page: filters.page,
          limit: filters.limit,
          sort: filters.sortBy,
          status: filters.status,
        }

        if (filters.searchQuery) params.search = filters.searchQuery
        if (filters.needTypes.length > 0) params.needTypes = filters.needTypes.join(',')
        if (filters.location) params.location = filters.location
        if (filters.locationRadius) params.radius = filters.locationRadius
        if (filters.geographicScope && filters.geographicScope !== 'all') params.scope = filters.geographicScope
        if (filters.minGoal !== undefined) params.minGoal = filters.minGoal
        if (filters.maxGoal !== undefined) params.maxGoal = filters.maxGoal

        return params
      },
    }),
    {
      name: 'campaign-filters',
    }
  )
)
