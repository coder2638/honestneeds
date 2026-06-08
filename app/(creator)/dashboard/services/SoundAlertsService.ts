/**
 * SoundAlertsService
 * Manages notification sound alerts
 * Handles audio playback, volume control, and sound selection
 * 
 * Features:
 * - Multiple sound types (bell, chime, ding, notify)
 * - Volume control (0-100)
 * - Play/stop sound
 * - Mute specific event types
 * - Browser audio context management
 */

'use client';

export type SoundType = 'bell' | 'chime' | 'ding' | 'notify';

interface SoundAlertOptions {
  volume?: number; // 0-100
  soundType?: SoundType;
  muted?: boolean;
}

interface AudioContextState {
  context: AudioContext | null;
  isInitialized: boolean;
}

class SoundAlertsService {
  private audioContextState: AudioContextState = {
    context: null,
    isInitialized: false,
  };

  private currentAudio: HTMLAudioElement | null = null;
  private volume: number = 80; // Default 80%
  private soundType: SoundType = 'bell';
  private isMuted: boolean = false;
  private mutedEvents: Set<string> = new Set();

  // Sound file URLs (would be hosted in public folder)
  private soundUrls: Record<SoundType, string> = {
    bell: '/sounds/notification-bell.mp3',
    chime: '/sounds/notification-chime.mp3',
    ding: '/sounds/notification-ding.mp3',
    notify: '/sounds/notification-notify.mp3',
  };

  constructor() {
    this.initializeAudioContext();
  }

  /**
   * Initialize Web Audio API context
   * Required for advanced audio manipulation
   */
  private initializeAudioContext(): void {
    if (typeof window === 'undefined' || this.audioContextState.isInitialized) {
      return;
    }

    try {
      // Create audio context (supports legacy APIs)
      const AudioContext = (window as any).AudioContext || (window as any).webkitAudioContext;

      if (AudioContext) {
        this.audioContextState.context = new AudioContext();
        this.audioContextState.isInitialized = true;
        console.log('✅ Audio context initialized');

        // Resume audio context if suspended (required for autoplay)
        if (this.audioContextState.context.state === 'suspended') {
          document.addEventListener('click', () => {
            this.audioContextState.context?.resume();
          });
        }
      }
    } catch (error) {
      console.warn('⚠️ Failed to initialize audio context:', error);
    }
  }

  /**
   * Check if browser supports audio playback
   */
  isSupported(): boolean {
    if (typeof window === 'undefined') {
      return false;
    }

    return 'Audio' in window || 'HTMLMediaElement' in window;
  }

  /**
   * Set master volume (0-100)
   */
  setVolume(volume: number): void {
    this.volume = Math.max(0, Math.min(100, volume));
    console.log(`🔊 Volume set to ${this.volume}%`);
  }

  /**
   * Get current volume
   */
  getVolume(): number {
    return this.volume;
  }

  /**
   * Set sound type
   */
  setSoundType(soundType: SoundType): void {
    if (Object.keys(this.soundUrls).includes(soundType)) {
      this.soundType = soundType;
      console.log(`🎵 Sound type set to "${soundType}"`);
    } else {
      console.warn(`❌ Unknown sound type: ${soundType}`);
    }
  }

  /**
   * Get current sound type
   */
  getSoundType(): SoundType {
    return this.soundType;
  }

  /**
   * Mute/unmute all sounds
   */
  setMuted(muted: boolean): void {
    this.isMuted = muted;
    console.log(`🔇 Sound ${muted ? 'muted' : 'unmuted'}`);
  }

  /**
   * Get mute status
   */
  isSoundMuted(): boolean {
    return this.isMuted;
  }

  /**
   * Mute specific event type
   */
  muteEventType(eventType: string): void {
    this.mutedEvents.add(eventType);
    console.log(`🔇 Event type "${eventType}" muted`);
  }

  /**
   * Unmute specific event type
   */
  unmuteEventType(eventType: string): void {
    this.mutedEvents.delete(eventType);
    console.log(`🔊 Event type "${eventType}" unmuted`);
  }

  /**
   * Check if event type is muted
   */
  isEventTypeMuted(eventType: string): boolean {
    return this.mutedEvents.has(eventType);
  }

  /**
   * Toggle mute status for event type
   */
  toggleEventTypeMute(eventType: string): void {
    if (this.isEventTypeMuted(eventType)) {
      this.unmuteEventType(eventType);
    } else {
      this.muteEventType(eventType);
    }
  }

  /**
   * Play notification sound
   * Optional: specify event type to check mute status
   */
  playSound(options: SoundAlertOptions = {}, eventType?: string): Promise<void> {
    return new Promise((resolve) => {
      // Check if sound is disabled
      if (this.isMuted) {
        console.log('🔇 Sound is muted');
        resolve();
        return;
      }

      // Check if event type is muted
      if (eventType && this.isEventTypeMuted(eventType)) {
        console.log(`🔇 Event type "${eventType}" is muted`);
        resolve();
        return;
      }

      // Support check
      if (!this.isSupported()) {
        console.warn('🚫 Audio not supported');
        resolve();
        return;
      }

      try {
        const soundType = options.soundType || this.soundType;
        const volume = (options.volume ?? this.volume) / 100; // Convert to 0-1
        const soundUrl = this.soundUrls[soundType];

        // Stop any currently playing audio
        this.stopSound();

        // Create and play audio element
        const audio = new Audio(soundUrl);
        audio.volume = Math.max(0, Math.min(1, volume));

        audio.addEventListener('ended', () => {
          resolve();
        });

        audio.addEventListener('error', (error) => {
          console.error('❌ Error playing sound:', error);
          resolve();
        });

        audio.play().catch((error) => {
          console.error('❌ Failed to play sound:', error);
          resolve();
        });

        this.currentAudio = audio;
      } catch (error) {
        console.error('❌ Error in playSound:', error);
        resolve();
      }
    });
  }

  /**
   * Stop currently playing sound
   */
  stopSound(): void {
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
      this.currentAudio = null;
    }
  }

  /**
   * Play campaign update sound
   */
  async playCampaignUpdateSound(
    status: 'activated' | 'paused' | 'completed' | 'failed'
  ): Promise<void> {
    const soundMap: Record<string, SoundType> = {
      activated: 'chime',
      completed: 'ding',
      paused: 'bell',
      failed: 'notify',
    };

    const soundType = soundMap[status] || this.soundType;
    return this.playSound({ soundType }, `campaign_${status}`);
  }

  /**
   * Play donation sound
   */
  async playDonationSound(): Promise<void> {
    return this.playSound({ soundType: 'chime' }, 'donation_received');
  }

  /**
   * Play goal reached sound
   */
  async playGoalReachedSound(): Promise<void> {
    return this.playSound({ soundType: 'ding' }, 'goal_reached');
  }

  /**
   * Play milestone sound
   */
  async playMilestoneSound(): Promise<void> {
    return this.playSound({ soundType: 'chime' }, 'milestone_achieved');
  }

  /**
   * Play comment sound
   */
  async playCommentSound(): Promise<void> {
    return this.playSound({ soundType: 'bell' }, 'comment_received');
  }

  /**
   * Play share sound
   */
  async playShareSound(): Promise<void> {
    return this.playSound({ soundType: 'bell' }, 'share_recorded');
  }

  /**
   * Play test sound (for testing)
   */
  async playTestSound(): Promise<void> {
    return this.playSound();
  }

  /**
   * Load and cache sound files (performance optimization)
   */
  async preloadSounds(): Promise<void> {
    try {
      const soundPaths = Object.values(this.soundUrls);

      await Promise.all(
        soundPaths.map((soundPath) => {
          return new Promise<void>((resolve, reject) => {
            const audio = new Audio(soundPath);
            audio.addEventListener('canplay', () => resolve());
            audio.addEventListener('error', reject);
            audio.preload = 'auto';
          });
        })
      );

      console.log('✅ Sounds preloaded');
    } catch (error) {
      console.warn('⚠️ Failed to preload sounds:', error);
    }
  }

  /**
   * Get audio context state (for diagnostics)
   */
  getAudioContextState(): AudioContextState {
    return this.audioContextState;
  }

  /**
   * Initialize sound service with options
   * Call this on app startup
   */
  initialize(options: SoundAlertOptions = {}): void {
    if (options.volume !== undefined) {
      this.setVolume(options.volume);
    }

    if (options.soundType) {
      this.setSoundType(options.soundType);
    }

    if (options.muted !== undefined) {
      this.setMuted(options.muted);
    }

    // Preload sounds in background
    this.preloadSounds().catch((error) => {
      console.warn('Sound preload failed:', error);
    });

    console.log('✅ Sound alerts service initialized');
  }

  /**
   * Get all available sound types
   */
  getAvailableSoundTypes(): SoundType[] {
    return Object.keys(this.soundUrls) as SoundType[];
  }

  /**
   * Get all muted event types
   */
  getMutedEventTypes(): string[] {
    return Array.from(this.mutedEvents);
  }

  /**
   * Reset to defaults
   */
  reset(): void {
    this.volume = 80;
    this.soundType = 'bell';
    this.isMuted = false;
    this.mutedEvents.clear();
    this.stopSound();
    console.log('✅ Sound alerts reset to defaults');
  }
}

// Export singleton instance
export const soundAlertsService = new SoundAlertsService();

export default SoundAlertsService;
