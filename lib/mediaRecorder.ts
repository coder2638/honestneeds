/**
 * Media Recording Utilities
 * Handles audio and video recording using MediaRecorder API
 * No external dependencies required (native browser API)
 */

export interface RecordingState {
  isRecording: boolean
  isPaused: boolean
  duration: number
  blob?: Blob
  audioUrl?: string
  videoUrl?: string
}

export interface AudioRecorderOptions {
  mimeType?: string
  audioBitsPerSecond?: number
  onProgress?: (duration: number) => void
  onError?: (error: Error) => void
}

export interface VideoRecorderOptions {
  mimeType?: string
  videoBitsPerSecond?: number
  onProgress?: (duration: number) => void
  onError?: (error: Error) => void
}

/**
 * Audio Recorder Class
 * Handles audio recording with pause/resume support
 */
export class AudioRecorder {
  private mediaRecorder: MediaRecorder | null = null
  private audioChunks: Blob[] = []
  private stream: MediaStream | null = null
  private startTime: number = 0
  private pausedTime: number = 0
  private timerInterval: number | null = null
  private isPaused: boolean = false
  private duration: number = 0
  private onProgressCallback?: (duration: number) => void
  private onErrorCallback?: (error: Error) => void

  constructor(options: AudioRecorderOptions = {}) {
    this.onProgressCallback = options.onProgress
    this.onErrorCallback = options.onError
  }

  /**
   * Request microphone permission and start recording
   */
  async start(): Promise<void> {
    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error('Your browser does not support audio recording')
      }

      // Request microphone access
      this.stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      })

      // Create audio context
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      const source = audioContext.createMediaStreamSource(this.stream)

      // Create analyser for visualization (optional)
      const analyser = audioContext.createAnalyser()
      source.connect(analyser)

      // Create recorder
      const mimeType = this.getSupportedAudioMimeType()
      this.mediaRecorder = new MediaRecorder(this.stream, {
        mimeType,
      })

      this.audioChunks = []
      this.startTime = Date.now()
      this.pausedTime = 0
      this.duration = 0

      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.audioChunks.push(event.data)
        }
      }

      this.mediaRecorder.onerror = (event) => {
        const error = new Error(`Recording error: ${event.error}`)
        this.onErrorCallback?.(error)
      }

      this.mediaRecorder.start()
      this.startTimer()
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error))
      this.onErrorCallback?.(err)
      throw err
    }
  }

  /**
   * Pause recording
   */
  pause(): void {
    if (this.mediaRecorder?.state === 'recording') {
      this.mediaRecorder.pause()
      this.isPaused = true
      if (this.timerInterval !== null) {
        clearInterval(this.timerInterval)
      }
    }
  }

  /**
   * Resume recording
   */
  resume(): void {
    if (this.mediaRecorder?.state === 'paused') {
      this.mediaRecorder.resume()
      this.isPaused = false
      this.startTimer()
    }
  }

  /**
   * Stop recording and return blob
   */
  async stop(): Promise<Blob> {
    return new Promise((resolve, reject) => {
      if (!this.mediaRecorder) {
        reject(new Error('No recording in progress'))
        return
      }

      this.mediaRecorder.onstop = () => {
        if (this.timerInterval !== null) {
          clearInterval(this.timerInterval)
        }

        // Cleanup stream
        this.stream?.getTracks().forEach((track) => track.stop())

        const audioBlob = new Blob(this.audioChunks, { type: this.mediaRecorder!.mimeType })
        resolve(audioBlob)
      }

      this.mediaRecorder.stop()
    })
  }

  /**
   * Cancel recording
   */
  cancel(): void {
    if (this.mediaRecorder) {
      this.mediaRecorder.stop()
    }
    if (this.timerInterval !== null) {
      clearInterval(this.timerInterval)
    }
    this.stream?.getTracks().forEach((track) => track.stop())
    this.audioChunks = []
    this.duration = 0
  }

  /**
   * Get current duration in seconds
   */
  getDuration(): number {
    if (this.mediaRecorder?.state === 'recording' || this.isPaused) {
      return this.duration
    }
    return 0
  }

  /**
   * Get recording state
   */
  getState(): 'inactive' | 'recording' | 'paused' {
    return (this.mediaRecorder?.state as any) || 'inactive'
  }

  /**
   * Start duration timer
   */
  private startTimer(): void {
    if (this.timerInterval !== null) {
      clearInterval(this.timerInterval)
    }

    this.timerInterval = window.setInterval(() => {
      if (this.mediaRecorder?.state === 'recording') {
        this.duration = Math.floor((Date.now() - this.startTime + this.pausedTime) / 1000)
        this.onProgressCallback?.(this.duration)
      }
    }, 100)
  }

  /**
   * Get supported audio MIME type
   */
  private getSupportedAudioMimeType(): string {
    const types = [
      'audio/webm;codecs=opus',
      'audio/mpeg',
      'audio/mp4',
      'audio/wav',
      'audio/ogg',
    ]

    for (const type of types) {
      if (MediaRecorder.isTypeSupported(type)) {
        return type
      }
    }

    return 'audio/webm'
  }
}

/**
 * Video Recorder Class
 * Handles video recording with pause/resume support
 */
export class VideoRecorder {
  private mediaRecorder: MediaRecorder | null = null
  private videoChunks: Blob[] = []
  private stream: MediaStream | null = null
  private startTime: number = 0
  private pausedTime: number = 0
  private timerInterval: number | null = null
  private isPaused: boolean = false
  private duration: number = 0
  private onProgressCallback?: (duration: number) => void
  private onErrorCallback?: (error: Error) => void

  constructor(options: VideoRecorderOptions = {}) {
    this.onProgressCallback = options.onProgress
    this.onErrorCallback = options.onError
  }

  /**
   * Request camera and microphone permission and start recording
   */
  async start(videoElement?: HTMLVideoElement): Promise<void> {
    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error('Your browser does not support video recording')
      }

      // Request camera and microphone access
      this.stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user',
        },
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      })

      // Preview in video element if provided
      if (videoElement) {
        videoElement.srcObject = this.stream
      }

      // Create recorder
      const mimeType = this.getSupportedVideoMimeType()
      this.mediaRecorder = new MediaRecorder(this.stream, {
        mimeType,
      })

      this.videoChunks = []
      this.startTime = Date.now()
      this.pausedTime = 0
      this.duration = 0

      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.videoChunks.push(event.data)
        }
      }

      this.mediaRecorder.onerror = (event) => {
        const error = new Error(`Recording error: ${event.error}`)
        this.onErrorCallback?.(error)
      }

      this.mediaRecorder.start()
      this.startTimer()
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error))
      this.onErrorCallback?.(err)
      throw err
    }
  }

  /**
   * Pause recording
   */
  pause(): void {
    if (this.mediaRecorder?.state === 'recording') {
      this.mediaRecorder.pause()
      this.isPaused = true
      if (this.timerInterval !== null) {
        clearInterval(this.timerInterval)
      }
    }
  }

  /**
   * Resume recording
   */
  resume(): void {
    if (this.mediaRecorder?.state === 'paused') {
      this.mediaRecorder.resume()
      this.isPaused = false
      this.startTimer()
    }
  }

  /**
   * Stop recording and return blob
   */
  async stop(videoElement?: HTMLVideoElement): Promise<Blob> {
    return new Promise((resolve, reject) => {
      if (!this.mediaRecorder) {
        reject(new Error('No recording in progress'))
        return
      }

      this.mediaRecorder.onstop = () => {
        if (this.timerInterval !== null) {
          clearInterval(this.timerInterval)
        }

        // Stop preview
        if (videoElement) {
          videoElement.srcObject = null
        }

        // Cleanup stream
        this.stream?.getTracks().forEach((track) => track.stop())

        const videoBlob = new Blob(this.videoChunks, { type: this.mediaRecorder!.mimeType })
        resolve(videoBlob)
      }

      this.mediaRecorder.stop()
    })
  }

  /**
   * Cancel recording
   */
  cancel(): void {
    if (this.mediaRecorder) {
      this.mediaRecorder.stop()
    }
    if (this.timerInterval !== null) {
      clearInterval(this.timerInterval)
    }
    this.stream?.getTracks().forEach((track) => track.stop())
    this.videoChunks = []
    this.duration = 0
  }

  /**
   * Get current duration in seconds
   */
  getDuration(): number {
    if (this.mediaRecorder?.state === 'recording' || this.isPaused) {
      return this.duration
    }
    return 0
  }

  /**
   * Get recording state
   */
  getState(): 'inactive' | 'recording' | 'paused' {
    return (this.mediaRecorder?.state as any) || 'inactive'
  }

  /**
   * Start duration timer
   */
  private startTimer(): void {
    if (this.timerInterval !== null) {
      clearInterval(this.timerInterval)
    }

    this.timerInterval = window.setInterval(() => {
      if (this.mediaRecorder?.state === 'recording') {
        this.duration = Math.floor((Date.now() - this.startTime + this.pausedTime) / 1000)
        this.onProgressCallback?.(this.duration)
      }
    }, 100)
  }

  /**
   * Get supported video MIME type
   */
  private getSupportedVideoMimeType(): string {
    const types = [
      'video/webm;codecs=vp9,opus',
      'video/webm;codecs=vp8,opus',
      'video/webm;codecs=h264,opus',
      'video/mp4',
      'video/webm',
    ]

    for (const type of types) {
      if (MediaRecorder.isTypeSupported(type)) {
        return type
      }
    }

    return 'video/webm'
  }
}

/**
 * Utility function to format duration as MM:SS
 */
export const formatDuration = (seconds: number): string => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

/**
 * Utility function to create audio URL from blob
 */
export const createAudioUrl = (blob: Blob): string => {
  return URL.createObjectURL(blob)
}

/**
 * Utility function to create video URL from blob
 */
export const createVideoUrl = (blob: Blob): string => {
  return URL.createObjectURL(blob)
}

/**
 * Utility function to revoke audio URL
 */
export const revokeAudioUrl = (url: string): void => {
  URL.revokeObjectURL(url)
}

/**
 * Utility function to revoke video URL
 */
export const revokeVideoUrl = (url: string): void => {
  URL.revokeObjectURL(url)
}

/**
 * Check if browser supports audio recording
 */
export const supportsAudioRecording = (): boolean => {
  return !!(navigator.mediaDevices?.getUserMedia && window.MediaRecorder)
}

/**
 * Check if browser supports video recording
 */
export const supportsVideoRecording = (): boolean => {
  return !!(navigator.mediaDevices?.getUserMedia && window.MediaRecorder)
}

/**
 * Get microphone permission status
 */
export const getMicrophonePermission = async (): Promise<boolean> => {
  try {
    const permission = await navigator.permissions.query({ name: 'microphone' as any })
    return permission.state !== 'denied'
  } catch {
    // Fallback for browsers that don't support Permissions API
    return true
  }
}

/**
 * Get camera permission status
 */
export const getCameraPermission = async (): Promise<boolean> => {
  try {
    const permission = await navigator.permissions.query({ name: 'camera' as any })
    return permission.state !== 'denied'
  } catch {
    // Fallback for browsers that don't support Permissions API
    return true
  }
}
