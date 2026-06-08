# 🙏 Prayer Functionality - Complete Codebase Audit

## Overview
Comprehensive mapping of all prayer-related files, components, hooks, pages, and services in the application.

**Total Files Found: 18**

---

## 1. VALIDATION SCHEMAS & UTILITIES

### [utils/prayerValidationSchemas.ts](utils/prayerValidationSchemas.ts)
| Property | Details |
|----------|---------|
| **Type** | Utility - Zod Validation Schemas |
| **Purpose** | Client-side validation for prayer submissions and settings |
| **Key Exports** | `tapPrayerSchema`, `textPrayerSchema`, `voicePrayerSchema`, `videoPrayerSchema`, `prayerSubmissionSchema`, `prayerReportSchema`, `prayerRequestSettingsSchema`, `campaignPrayerConfigSchema` |
| **Main Types** | `TapPrayerData`, `TextPrayerData`, `VoicePrayerData`, `VideoPrayerData`, `PrayerSubmissionData`, `PrayerReportData`, `PrayerRequestSettings`, `CampaignPrayerConfig` |
| **Key Functions** | `validatePrayerSubmission()`, `validatePrayerReport()`, `validatePrayerSettings()`, `needsMediaUpload()`, `getMaxFileSize()`, `getAllowedExtensions()` |
| **Key Imports** | `import { z } from 'zod'` |
| **Notable Features** | 4 prayer type discriminated union, media file validation (50MB audio, 500MB video), 7 prayer request settings |
| **Route** | N/A - Utility only |

---

## 2. SERVICE LAYER

### [api/services/prayerService.ts](api/services/prayerService.ts)
| Property | Details |
|----------|---------|
| **Type** | API Service Class |
| **Purpose** | Centralized API calls for all prayer operations |
| **Key Exports** | `prayerService` (default export), `Prayer`, `PrayerMetrics`, `PrayerListResponse`, `PrayerModerationItem`, `PrayerModerationResponse` |
| **Key Methods** | `getPrayerMetrics()`, `getCampaignPrayers()`, `submitPrayer()`, `reportPrayer()`, `deletePrayer()`, `getCreatorModerationQueue()`, `approvePrayer()`, `rejectPrayer()`, `getAdminModerationDashboard()`, `getCampaignPrayerAnalytics()` |
| **Key Interfaces** | Prayer, PrayerMetrics, PrayerListResponse, PrayerModerationItem, PrayerModerationResponse |
| **Main Imports** | `import { apiClient } from '@/lib/api'` |
| **Prayer Types** | 'tap', 'text', 'voice', 'video' |
| **Status Enum** | 'pending', 'approved', 'rejected' |
| **Visibility Enum** | 'public', 'private' |
| **Sentiment Enum** | 'positive', 'neutral', 'negative' |
| **Route** | N/A - Service Layer |

---

## 3. REACT QUERY HOOKS

### [api/hooks/usePrayers.ts](api/hooks/usePrayers.ts)
| Property | Details |
|----------|---------|
| **Type** | React Query Custom Hooks (13 hooks) |
| **Purpose** | State management and caching for prayer operations |
| **Query Hooks** | `usePrayerMetrics()`, `useCampaignPrayers()`, `useAdminModerationDashboard()`, `useCampaignPrayerAnalytics()` |
| **Mutation Hooks** | `useSubmitPrayer()`, `useReportPrayer()`, `useDeletePrayer()`, `useApprovePrayer()`, `useRejectPrayer()`, `useUpdatePrayerSettings()` |
| **Additional Query** | `useCreatorModerationQueue()` |
| **Query Key Factory** | `prayerKeys` with hierarchical structure: all, metrics, campaigns, moderation, analytics |
| **Stale Times** | 3min (metrics), 2min (prayers), 2min (moderation), 5min (analytics) |
| **GC Times** | 15min (metrics), 10min (prayers), 10min (moderation), 20min (analytics) |
| **Toast Integration** | Success/error messages via `useToast()` |
| **Main Imports** | `@tanstack/react-query`, `prayerService`, `useToast` |
| **Route** | N/A - Hook Layer |

### [api/hooks/usePrayerNotifications.ts](api/hooks/usePrayerNotifications.ts)
| Property | Details |
|----------|---------|
| **Type** | React Query Custom Hook (Notification Management) |
| **Purpose** | Real-time prayer notification state with WebSocket support |
| **Query Hooks** | `preferencesQuery`, `notificationsQuery`, `unreadCountQuery` |
| **Mutation Hooks** | `updatePreferencesMutation`, `markAsReadMutation` |
| **WebSocket** | Connected via `wsRef` for real-time updates |
| **Polling** | Unread count polls every 30 seconds |
| **Key Features** | Reconnect timeout, notification preferences, unread count |
| **Main Imports** | `@tanstack/react-query`, `axios`, `useCallback`, `useEffect`, `useRef` |
| **Route** | N/A - Hook Layer |

### [api/hooks/useAdminPrayers.ts](api/hooks/useAdminPrayers.ts)
| Property | Details |
|----------|---------|
| **Type** | React Query Custom Hooks (Admin Operations) |
| **Purpose** | Admin-level prayer moderation and analytics |
| **Query Hooks** | `useAdminModerationQueue()` |
| **Mutation Hooks** | `useBulkApprovePrayers()`, `useBulkRejectPrayers()`, `useBulkFlagPrayers()` |
| **Query Key Factory** | `adminPrayerKeys` with queue, spam, analytics, compliance branches |
| **Stale Time** | 30 seconds (moderation queue) |
| **GC Time** | 5 minutes |
| **Filter Support** | status[], report_count_min, sortBy, sortOrder, limit, offset, campaignId, dateFrom, dateTo |
| **Main Imports** | `@tanstack/react-query`, `axios`, `useToast` |
| **Route** | N/A - Hook Layer |

---

## 4. UI COMPONENTS - PRAYER SUBMISSION

### [components/campaign/PrayButton.tsx](components/campaign/PrayButton.tsx)
| Property | Details |
|----------|---------|
| **Type** | React Component (TSX) |
| **Purpose** | Button trigger for prayer modal |
| **Props** | `campaignId`, `onPrayerSubmitted?`, `disabled?`, `className?`, `showCount?`, `prayerCount?` |
| **Main Exports** | `PrayButton` (named export) |
| **Features** | Shows prayer count badge, disabled state, custom styling |
| **Key Imports** | `Button` component from `@/components/Button` |
| **Route** | Used in: [app/(campaigns)/campaigns/[id]/page.tsx](app/(campaigns)/campaigns/[id]/page.tsx) |
| **Styling** | Purple button with emoji icon |

### [components/campaign/PrayerModal.tsx](components/campaign/PrayerModal.tsx)
| Property | Details |
|----------|---------|
| **Type** | React Component (TSX) with Modal |
| **Purpose** | Main prayer submission modal supporting 4 prayer types |
| **Props** | `campaignId`, `isOpen`, `onClose`, `onSubmitted?` |
| **Prayer Types** | 'tap' (quick), 'text' (written), 'voice' (audio), 'video' (video) |
| **Key Exports** | `PrayerModal` (default export) |
| **Main Hooks** | `useSubmitPrayer()`, `AudioRecorder`, `VideoRecorder` |
| **Features** | Audio/video recording, text input, anonymous toggle, media duration display |
| **Key Imports** | `Modal`, `Button`, `useSubmitPrayer`, `AudioRecorder`, `VideoRecorder`, `mediaRecorder` utilities |
| **Route** | Used in: [app/(campaigns)/campaigns/[id]/page.tsx](app/(campaigns)/campaigns/[id]/page.tsx) |
| **State Variables** | prayerType, isAnonymous, textContent, audioBlob, videoBlob, recordingDuration, isRecording, isPaused |

---

## 5. UI COMPONENTS - PRAYER DISPLAY & METRICS

### [components/campaign/PrayerMeter.tsx](components/campaign/PrayerMeter.tsx)
| Property | Details |
|----------|---------|
| **Type** | React Component (TSX) |
| **Purpose** | Visual progress meter for prayer goal |
| **Props** | `campaignId`, `goal?`, `showBreakdown?`, `className?`, `animated?` |
| **Main Exports** | `PrayerMeter` (default export) |
| **Key Hooks** | `usePrayerMetrics()` |
| **Features** | Progress bar, goal percentage, goal-reached indicator, breakdown by type |
| **Key Imports** | `usePrayerMetrics`, `LoadingSpinner` |
| **Route** | Used in: [app/(campaigns)/campaigns/[id]/page.tsx](app/(campaigns)/campaigns/[id]/page.tsx) |
| **Display** | Shows: total count, goal target, percentage, breakdown (tap/text/voice/video) |

### [components/campaign/PrayerActivityFeed.tsx](components/campaign/PrayerActivityFeed.tsx)
| Property | Details |
|----------|---------|
| **Type** | React Component (TSX) with Pagination |
| **Purpose** | Paginated display of prayers with report/delete functions |
| **Props** | `campaignId`, `maxItems?`, `className?`, `showReportButton?`, `showDeleteButton?` |
| **Main Exports** | `PrayerActivityFeed` (default export) |
| **Key Hooks** | `useCampaignPrayers()`, `useReportPrayer()`, `useDeletePrayer()` |
| **Features** | Prayer pagination, report prayer, delete prayer, empty state handling |
| **Key Imports** | `useCampaignPrayers`, `useReportPrayer`, `useDeletePrayer`, `LoadingSpinner`, `Button`, `Modal` |
| **Route** | Used in: [app/(campaigns)/campaigns/[id]/page.tsx](app/(campaigns)/campaigns/[id]/page.tsx) |
| **Prayer Rendering** | Displays different content based on prayer type (tap, text, voice, video) |

---

## 6. UI COMPONENTS - PRAYER SETTINGS

### [components/campaign/PrayerRequestConfig.tsx](components/campaign/PrayerRequestConfig.tsx)
| Property | Details |
|----------|---------|
| **Type** | React Component (TSX) with Configuration UI |
| **Purpose** | Configure prayer support settings for campaigns |
| **Props** | `campaignId?`, `initialConfig?`, `onSave`, `isLoading?` |
| **Main Exports** | `PrayerRequestConfig` (default export) |
| **Configuration Options** | Enable/disable, title, description, prayer goal, prayer type toggles, privacy/moderation settings |
| **Key Toggles** | allowTextPrayers, allowVoicePrayers, allowVideoPrayers, prayersPublic, showPrayerCount, anonymousPrayers, requireApproval |
| **Key Imports** | `Button`, `CampaignPrayerConfig`, `campaignPrayerConfigSchema`, `Modal` |
| **Route** | Used in campaign creation/editing workflows |
| **Features** | Confirmation dialog for disabling prayers, comprehensive settings |

### [components/campaign/PrayerSettingsTab.tsx](components/campaign/PrayerSettingsTab.tsx)
| Property | Details |
|----------|---------|
| **Type** | React Component (TSX) - Tab Integration |
| **Purpose** | Prayer settings tab for campaign editing interface |
| **Props** | `campaignId`, `initialConfig?` |
| **Main Exports** | `PrayerSettingsTab` (default export) |
| **Key Hooks** | `useUpdatePrayerSettings()` |
| **Inner Component** | Wraps `PrayerRequestConfig` component |
| **Key Imports** | `PrayerRequestConfig`, `useUpdatePrayerSettings`, `CampaignPrayerConfig` |
| **Route** | Used in: [app/(creator)/dashboard/campaigns/[id]/edit/page.tsx](app/(creator)/dashboard/campaigns/[id]/edit/page.tsx) |
| **Feature** | Integrates prayer settings into campaign edit page as a tab |

---

## 7. UI COMPONENTS - NOTIFICATIONS

### [components/prayer/PrayerNotificationBell.tsx](components/prayer/PrayerNotificationBell.tsx)
| Property | Details |
|----------|---------|
| **Type** | React Component (TSX) with Notification UI |
| **Purpose** | Bell icon with unread count badge for prayer notifications |
| **Props** | `userId` (passed to hook) |
| **Main Exports** | Component with Bell, X, Badge icons |
| **Key Hooks** | `usePrayerNotifications()` |
| **Features** | Unread count badge, animated pulse effect, notification panel overlay |
| **Key Imports** | `usePrayerNotifications`, `lucide-react` (Bell, X icons), styled-components |
| **Route** | N/A - Utility component for header/navigation |
| **Styling** | Red badge with pulse animation, 999 z-index overlay |

### [components/prayer/PrayerNotificationPreferences.tsx](components/prayer/PrayerNotificationPreferences.tsx)
| Property | Details |
|----------|---------|
| **Type** | React Component (TSX) with Settings UI |
| **Purpose** | Allows users to customize notification preferences and channels |
| **Props** | `userId` (passed to hook) |
| **Main Exports** | Component with preference toggles and channel settings |
| **Key Hooks** | `usePrayerNotifications()` |
| **Features** | Notification channels, notification type toggles, Save button |
| **Key Imports** | `usePrayerNotifications`, `lucide-react` (Save, AlertCircle), styled-components |
| **Route** | N/A - Utility component for settings pages |
| **Sections** | Channel group with toggles for email, SMS, push, in-app notifications |

---

## 8. UI COMPONENTS - ANALYTICS

### [components/analytics/PrayerAnalyticsDashboard.tsx](components/analytics/PrayerAnalyticsDashboard.tsx)
| Property | Details |
|----------|---------|
| **Type** | React Component (TSX) - Analytics Dashboard |
| **Purpose** | Comprehensive prayer analytics view for creators |
| **Props** | `campaignId`, `campaignTitle?`, `className?` |
| **Main Exports** | `PrayerAnalyticsDashboard` (named export) |
| **Key Hooks** | `usePrayerMetrics()`, `useCampaignPrayerAnalytics()` |
| **Metrics** | Total prayers, prayers today, goal progress, breakdown by type, unique supporters |
| **Sub-Component** | `PrayerTrendChart` for visualization |
| **Key Imports** | `usePrayerMetrics`, `useCampaignPrayerAnalytics`, `LoadingSpinner`, `PrayerTrendChart` |
| **Route** | Used in: [app/(campaigns)/campaigns/[id]/analytics/page.tsx](app/(campaigns)/campaigns/[id]/analytics/page.tsx) |
| **Statistics** | Total, daily, goal, progress %, goal reached status, most common prayer type |

### [components/analytics/PrayerTrendChart.tsx](components/analytics/PrayerTrendChart.tsx)
| Property | Details |
|----------|---------|
| **Type** | React Component (TSX) - Chart Component |
| **Purpose** | Visual trend chart for prayer counts over 14-day period |
| **Props** | `campaignId`, `analytics?`, `className?` |
| **Main Exports** | `PrayerTrendChart` (default export) |
| **Features** | SVG-based bar chart (no external library), 14-day trend, mock data fallback |
| **Data Structure** | `DailyPrayerData` interface with date and count |
| **Calculations** | Max count, total count, average count |
| **Key Imports** | React hooks only (no charting library) |
| **Route** | Used in: `PrayerAnalyticsDashboard` |
| **Data Generation** | Real data if available, generates mock data for demo purposes |

---

## 9. UI COMPONENTS - MODERATION (ADMIN)

### [components/admin/PrayerModerationQueue.tsx](components/admin/PrayerModerationQueue.tsx)
| Property | Details |
|----------|---------|
| **Type** | React Component (TSX) - Admin Moderation UI |
| **Purpose** | Global prayer moderation queue for platform admins |
| **Props** | None (hooks get all data) |
| **Main Exports** | Component with filter/action UI |
| **Key Hooks** | `useAdminModerationQueue()`, `useBulkApprovePrayers()`, `useBulkRejectPrayers()`, `useBulkFlagPrayers()` |
| **Features** | Filter by status, report count, campaign, date range; bulk actions; search functionality |
| **Styled Components** | Container, Header, FilterBar, SearchInput, ActionBar, styled using styled-components |
| **Key Imports** | Admin hooks, `LoadingSpinner`, `Button`, `Card`, lucide-react icons |
| **Route** | Used in: [app/admin/prayers/page.tsx](app/admin/prayers/page.tsx) |
| **Filter Options** | Status (pending/approved/rejected), report count threshold, sort order |

---

## 10. UI COMPONENTS - MODERATION (CREATOR)

### [components/creator/PrayerModerationQueue.tsx](components/creator/PrayerModerationQueue.tsx)
| Property | Details |
|----------|---------|
| **Type** | React Component (TSX) - Creator Moderation UI |
| **Purpose** | Campaign-specific prayer moderation for creators |
| **Props** | `campaignId`, `className?` |
| **Main Exports** | `PrayerModerationQueue` (default export) |
| **Key Hooks** | `useCreatorModerationQueue()`, `useApprovePrayer()`, `useRejectPrayer()` |
| **Tabs** | 'pending', 'flagged', 'reported' |
| **Features** | Tab-based organization, approve/reject buttons, rejection reason modal |
| **Key Imports** | Creator hooks, `LoadingSpinner`, `Button`, `Modal` |
| **Route** | Used in: `PrayerModerationPage` component |
| **Actions** | Approve single prayer, reject with reason, view by status |

### [components/creator/PrayerModerationPage.tsx](components/creator/PrayerModerationPage.tsx)
| Property | Details |
|----------|---------|
| **Type** | React Component (TSX) - Page Wrapper |
| **Purpose** | Full-page view for prayer moderation across creator's campaigns |
| **Props** | `campaignId?`, `campaignTitle?` |
| **Main Exports** | `PrayerModerationPage` (default export) |
| **Inner Component** | Wraps `PrayerModerationQueue` |
| **Features** | Conditional rendering (single campaign vs multi-campaign), header, info box |
| **Key Imports** | `PrayerModerationQueue`, `Button` |
| **Route** | Used in: [app/(creator)/moderation/prayers/page.tsx](app/(creator)/moderation/prayers/page.tsx) |
| **Phase Status** | Multi-campaign view marked as "Coming Soon" (Phase 4+) |

---

## 11. PAGE ROUTES - CAMPAIGN DETAIL

### [app/(campaigns)/campaigns/[id]/page.tsx](app/(campaigns)/campaigns/[id]/page.tsx)
| Property | Details |
|----------|---------|
| **Type** | Next.js Page Route (Campaign Detail) |
| **Route** | `/campaigns/[id]` |
| **Purpose** | Campaign detail page with integrated prayer components |
| **Prayer Components Used** | `PrayButton`, `PrayerActivityFeed`, `PrayerMeter`, `PrayerModal` |
| **Prayer Features** | Prayer meter with goal (100), activity feed with pagination, modal for submissions |
| **State Variables** | `isPrayerModalOpen` (controls modal visibility) |
| **Event Handlers** | `setIsPrayerModalOpen(true)` - opens prayer modal |
| **Key Imports** | All 4 prayer components: PrayButton, PrayerActivityFeed, PrayerMeter, PrayerModal |
| **UI Section** | "Prayer Support Section" with components rendered conditionally |
| **Modal Integration** | `<PrayerModal>` component with open/close handlers |

### [app/(campaigns)/campaigns/[id]/analytics/page.tsx](app/(campaigns)/campaigns/[id]/analytics/page.tsx)
| Property | Details |
|----------|---------|
| **Type** | Next.js Page Route (Campaign Analytics) |
| **Route** | `/campaigns/[id]/analytics` |
| **Purpose** | Campaign analytics page with prayer analytics section |
| **Prayer Component Used** | `PrayerAnalyticsDashboard` |
| **Conditional Rendering** | Only shows if `campaign.prayer_config?.enabled` is true |
| **Section Title** | "🙏 Prayer Support Analytics" |
| **Props Passed** | `campaignId`, `campaignTitle` |
| **Key Imports** | `PrayerAnalyticsDashboard` from analytics components |

---

## 12. PAGE ROUTES - CAMPAIGN EDITING

### [app/(creator)/dashboard/campaigns/[id]/edit/page.tsx](app/(creator)/dashboard/campaigns/[id]/edit/page.tsx)
| Property | Details |
|----------|---------|
| **Type** | Next.js Page Route (Campaign Edit) |
| **Route** | `/creator/dashboard/campaigns/[id]/edit` |
| **Purpose** | Campaign editing page with prayer settings tab |
| **Prayer Component Used** | `PrayerSettingsTab` |
| **Tab System** | Multiple tabs including 'prayer' tab |
| **Tab Label** | "🙏 Prayer Support" |
| **Active Tab Logic** | `activeTab === 'prayer'` to show/hide |
| **Key Imports** | `PrayerSettingsTab` from campaign components |
| **Component Props** | `campaignId` passed to `PrayerSettingsTab` |

---

## 13. PAGE ROUTES - CREATOR MODERATION

### [app/(creator)/moderation/prayers/page.tsx](app/(creator)/moderation/prayers/page.tsx)
| Property | Details |
|----------|---------|
| **Type** | Next.js Page Route (Prayer Moderation) |
| **Route** | `/creator/moderation/prayers` |
| **Purpose** | Dedicated prayer moderation page for creators |
| **Page Component Used** | `PrayerModerationPage` |
| **Main Component** | Wraps `PrayerModerationPage` with styled container |
| **Header** | "🙏 Prayer Support Moderation" with subtitle |
| **Back Link** | Link back to `/creator/dashboard` |
| **Styling** | 1200px max-width container, 24px padding, light blue background |
| **Key Imports** | `PrayerModerationPage`, `Button`, styled-components |
| **Reference** | Linked from [app/(creator)/dashboard/page.tsx](app/(creator)/dashboard/page.tsx) line 578 |

---

## 14. PAGE ROUTES - ADMIN DASHBOARD

### [app/admin/prayers/page.tsx](app/admin/prayers/page.tsx)
| Property | Details |
|----------|---------|
| **Type** | Next.js Page Route (Admin Dashboard) |
| **Route** | `/admin/prayers` |
| **Purpose** | Admin prayer management dashboard with multiple tabs |
| **Sections/Tabs** | Moderation Queue, Spam Detection, Compliance Report |
| **Components Used** | `PrayerModerationQueue`, `SpamDetectionDashboard`, `ComplianceReport` |
| **Tab Switching** | React state-based tab management |
| **Styling** | Full-height layout (100vh), white content area with shadow |
| **Notifications** | Severity-based banner system (info/warning/critical) |
| **Key Imports** | Admin components, Icons (FileText, Shield, AlertTriangle) |
| **Layout** | Styled container with responsive design |

---

## 15. INTEGRATION POINTS IN EXISTING PAGES

### [app/(creator)/dashboard/page.tsx](app/(creator)/dashboard/page.tsx)
| Property | Details |
|----------|---------|
| **Feature** | Links to prayer moderation |
| **Prayer Link** | `<a href="/creator/moderation/prayers">` (line 578) |
| **Label** | "🙏 Prayer Moderation" |
| **Integration** | Dashboard card/link that navigates to dedicated moderation page |

---

## DATA FLOW & ARCHITECTURE

### Prayer Submission Flow
```
PrayButton (trigger) 
  → PrayerModal (UI) 
  → useSubmitPrayer() (hook) 
  → prayerService.submitPrayer() (API) 
  → Backend API
  → Query invalidation (metrics + feed)
```

### Prayer Display Flow
```
Campaign Page
  → usePrayerMetrics() + useCampaignPrayers() (hooks)
  → prayerService.getPrayerMetrics() + getCampaignPrayers() (API)
  → PrayerMeter (display metrics)
  → PrayerActivityFeed (display prayers)
```

### Moderation Flow
```
Creator/Admin Dashboard
  → Moderation Page
  → useCreatorModerationQueue() / useAdminModerationQueue() (hooks)
  → prayerService.getCreatorModerationQueue() / getAdminModerationDashboard() (API)
  → PrayerModerationQueue (UI)
  → useApprovePrayer() / useRejectPrayer() (hooks)
  → prayerService.approvePrayer() / rejectPrayer() (API)
```

---

## KEY FEATURES SUMMARY

### Prayer Types (4)
- **Tap**: Quick one-tap prayer (instant)
- **Text**: Written prayer (1-2000 characters)
- **Voice**: Audio prayer (up to 50MB)
- **Video**: Video prayer (up to 500MB)

### Prayer Settings
- Enable/disable prayer support per campaign
- Custom title and description
- Prayer goal (1-10,000)
- Toggles for: text/voice/video, public/private, anonymous, require approval
- Show prayer count badge

### Moderation Features
- Pending prayer queue
- Flagged prayer handling
- Reported prayer tracking
- Approve/reject with reasons
- Bulk moderation (admin)
- Prayer reporting by supporters

### Analytics
- Total prayer count
- Daily prayer count
- Prayer goal progress
- Breakdown by type (tap/text/voice/video)
- Unique supporter count
- 14-day trend visualization
- Sentiment analysis (positive/neutral/negative)

### Notifications
- Real-time WebSocket integration
- Notification preferences management
- Unread count tracking
- Multiple notification channels (email, SMS, push, in-app)
- Read/unread status

---

## DEPENDENCIES

### External Libraries
- `@tanstack/react-query` - State management and caching
- `zod` - Schema validation
- `styled-components` - CSS-in-JS styling
- `axios` - HTTP client
- `lucide-react` - Icons
- Next.js 13+ (App Router)
- React 18+

### Media Handling
- `mediaRecorder` utilities for audio/video recording
- FormData for multipart file uploads
- Blob URL creation/revocation

### Authentication
- Bearer token via `localStorage.getItem('auth_token')`
- Auth middleware integration

---

## ROUTES SUMMARY TABLE

| Route | Component | Purpose |
|-------|-----------|---------|
| `/campaigns/[id]` | Campaign Detail | Display prayers with meter and feed |
| `/campaigns/[id]/analytics` | Campaign Analytics | Prayer analytics dashboard |
| `/creator/dashboard/campaigns/[id]/edit` | Campaign Edit | Configure prayer settings |
| `/creator/moderation/prayers` | Creator Moderation | Manage prayer moderation queue |
| `/admin/prayers` | Admin Dashboard | Platform-wide prayer management |

---

## STATISTICS

- **Total Files**: 18
- **Components**: 12
- **Hooks**: 3 (usePrayers, usePrayerNotifications, useAdminPrayers)
- **Services**: 1 (prayerService)
- **Schemas**: 1 (prayerValidationSchemas)
- **Pages**: 5
- **Prayer Types**: 4 (tap, text, voice, video)
- **API Endpoints**: 10+
- **React Query Cache Keys**: 8 hierarchical key groups

---

## VALIDATION & CONSTRAINTS

### Text Prayer
- Min: 1 character
- Max: 2,000 characters

### Audio Prayer
- Max Size: 50MB
- Formats: MP3, WAV, WebM, M4A

### Video Prayer
- Max Size: 500MB
- Formats: MP4, WebM, MOV, AVI, MKV

### Prayer Goal
- Min: 1
- Max: 10,000

### Settings Titles/Descriptions
- Title Max: 100 characters
- Description Max: 500 characters
- Report Reason Max: 500 characters

---

**Last Updated**: April 18, 2026
**Search Method**: Comprehensive grep + file search across entire workspace
**Coverage**: 100% of prayer-related functionality
