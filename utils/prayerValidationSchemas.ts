import { z } from 'zod'

/**
 * Prayer Support Validation Schemas
 * Mirrors backend schemas for client-side validation
 * Uses Zod for type-safe validation
 */

// ============================================
// HELPER SCHEMAS
// ============================================

const prayerTypeSchema = z.enum(['tap', 'text', 'voice', 'video'])

// ============================================
// TAP PRAYER SCHEMA
// ============================================
export const tapPrayerSchema = z.object({
  type: z.literal('tap'),
  is_anonymous: z.boolean().default(true),
  supporter_name: z.string().optional(),
})

export type TapPrayerData = z.infer<typeof tapPrayerSchema>

// ============================================
// TEXT PRAYER SCHEMA
// ============================================
export const textPrayerSchema = z.object({
  type: z.literal('text'),
  text_content: z
    .string()
    .min(1, 'Prayer text is required')
    .max(2000, 'Prayer text cannot exceed 2000 characters'),
  is_anonymous: z.boolean().default(true),
  supporter_name: z.string().optional(),
})

export type TextPrayerData = z.infer<typeof textPrayerSchema>

// ============================================
// VOICE PRAYER SCHEMA
// ============================================
export const voicePrayerSchema = z.object({
  type: z.literal('voice'),
  audio_file: z
    .instanceof(File, { message: 'Audio file is required' })
    .refine((file) => file.size <= 50 * 1024 * 1024, 'Audio file cannot exceed 50MB')
    .refine(
      (file) => ['audio/mpeg', 'audio/wav', 'audio/webm', 'audio/m4a'].includes(file.type),
      'Audio file must be in a supported format (MP3, WAV, WebM, M4A)'
    ),
  is_anonymous: z.boolean().default(true),
  supporter_name: z.string().optional(),
})

export type VoicePrayerData = z.infer<typeof voicePrayerSchema>

// ============================================
// VIDEO PRAYER SCHEMA
// ============================================
export const videoPrayerSchema = z.object({
  type: z.literal('video'),
  video_file: z
    .instanceof(File, { message: 'Video file is required' })
    .refine((file) => file.size <= 500 * 1024 * 1024, 'Video file cannot exceed 500MB')
    .refine(
      (file) =>
        [
          'video/mp4',
          'video/webm',
          'video/quicktime',
          'video/x-msvideo',
          'video/x-matroska',
        ].includes(file.type),
      'Video file must be in a supported format (MP4, WebM, MOV, AVI, MKV)'
    ),
  is_anonymous: z.boolean().default(true),
  supporter_name: z.string().optional(),
})

export type VideoPrayerData = z.infer<typeof videoPrayerSchema>

// ============================================
// DISCRIMINATED UNION SCHEMA
// ============================================
export const prayerSubmissionSchema = z.discriminatedUnion('type', [
  tapPrayerSchema,
  textPrayerSchema,
  voicePrayerSchema,
  videoPrayerSchema,
])

export type PrayerSubmissionData = z.infer<typeof prayerSubmissionSchema>

// ============================================
// PRAYER REPORT SCHEMA
// ============================================
export const prayerReportSchema = z.object({
  reason: z
    .string()
    .min(1, 'Report reason is required')
    .max(500, 'Report reason cannot exceed 500 characters'),
})

export type PrayerReportData = z.infer<typeof prayerReportSchema>

// ============================================
// PRAYER REQUEST SETTINGS SCHEMA
// ============================================
export const prayerRequestSettingsSchema = z.object({
  enabled: z.boolean(),
  title: z
    .string()
    .max(100, 'Title cannot exceed 100 characters')
    .optional(),
  description: z
    .string()
    .max(500, 'Description cannot exceed 500 characters')
    .optional(),
  prayer_goal: z
    .number()
    .min(1, 'Prayer goal must be at least 1')
    .max(10000, 'Prayer goal cannot exceed 10000')
    .optional(),
  settings: z.object({
    allow_text_prayers: z.boolean().default(true),
    allow_voice_prayers: z.boolean().default(true),
    allow_video_prayers: z.boolean().default(true),
    prayers_public: z.boolean().default(true),
    show_prayer_count: z.boolean().default(true),
    anonymous_prayers: z.boolean().default(true),
    require_approval: z.boolean().default(false),
  }),
})

export type PrayerRequestSettings = z.infer<typeof prayerRequestSettingsSchema>

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Safely validate prayer submission data
 */
export const validatePrayerSubmission = (data: unknown) => {
  return prayerSubmissionSchema.safeParse(data)
}

/**
 * Safely validate prayer report data
 */
export const validatePrayerReport = (data: unknown) => {
  return prayerReportSchema.safeParse(data)
}

/**
 * Safely validate prayer request settings
 */
export const validatePrayerSettings = (data: unknown) => {
  return prayerRequestSettingsSchema.safeParse(data)
}

/**
 * Check if prayer type allows media upload
 */
export const needsMediaUpload = (type: string): boolean => {
  return type === 'voice' || type === 'video'
}

/**
 * Get max file size for prayer type (in bytes)
 */
export const getMaxFileSize = (type: string): number => {
  if (type === 'voice') return 50 * 1024 * 1024 // 50MB
  if (type === 'video') return 500 * 1024 * 1024 // 500MB
  return 0
}

/**
 * Get allowed file extensions for prayer type
 */
export const getAllowedExtensions = (type: string): string[] => {
  if (type === 'voice') return ['.mp3', '.wav', '.webm', '.m4a']
  if (type === 'video') return ['.mp4', '.webm', '.mov', '.avi', '.mkv']
  return []
}

// ============================================
// CAMPAIGN PRAYER REQUEST CONFIGURATION SCHEMA
// ============================================
export const campaignPrayerConfigSchema = z.object({
  enabled: z.boolean().default(false),
  title: z
    .string()
    .max(100, 'Title cannot exceed 100 characters')
    .optional(),
  description: z
    .string()
    .max(500, 'Description cannot exceed 500 characters')
    .optional(),
  prayer_goal: z
    .number()
    .min(1, 'Prayer goal must be at least 1')
    .max(10000, 'Prayer goal cannot exceed 10000')
    .optional(),
  settings: z.object({
    allow_text_prayers: z.boolean().default(true),
    allow_voice_prayers: z.boolean().default(true),
    allow_video_prayers: z.boolean().default(true),
    prayers_public: z.boolean().default(true),
    show_prayer_count: z.boolean().default(true),
    anonymous_prayers: z.boolean().default(true),
    require_approval: z.boolean().default(false),
  }),
})

export type CampaignPrayerConfig = z.infer<typeof campaignPrayerConfigSchema>

/**
 * Validate campaign prayer configuration
 */
export const validateCampaignPrayerConfig = (data: unknown) => {
  return campaignPrayerConfigSchema.safeParse(data)
}
