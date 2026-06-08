/**
 * BrowserNotificationsService
 * Manages browser native notifications (Web Notification API)
 * Handles permission requests, notification sending, and event handling
 * 
 * Features:
 * - Request notification permission
 * - Send native notifications with title, body, icon
 * - Handle notification click events
 * - Browser compatibility checks
 * - Deduplicate notifications
 */

'use client';

export type NotificationPermission = 'granted' | 'denied' | 'default';

export interface BrowserNotificationOptions {
  icon?: string;
  badge?: string;
  tag?: string; // Used for deduplication
  requireInteraction?: boolean;
  silent?: boolean;
  body?: string;
  actions?: Array<{
    action: string;
    title: string;
  }>;
  data?: Record<string, any>;
}

class BrowserNotificationsService {
  private activeNotifications: Map<string, Notification> = new Map();

  /**
   * Check if browser supports notifications
   */
  isSupported(): boolean {
    if (typeof window === 'undefined') {
      return false;
    }

    return 'Notification' in window;
  }

  /**
   * Get current notification permission status
   */
  getPermissionStatus(): NotificationPermission {
    if (!this.isSupported()) {
      return 'denied';
    }

    return (window.Notification.permission || 'default') as NotificationPermission;
  }

  /**
   * Request notification permission from user
   * Returns: 'granted' | 'denied' | 'default'
   */
  async requestPermission(): Promise<NotificationPermission> {
    if (!this.isSupported()) {
      console.warn('🚫 Browser notifications not supported');
      return 'denied';
    }

    try {
      const permission = await (window.Notification as any).requestPermission?.();
      console.log('✅ Notification permission:', permission);
      return (permission || window.Notification.permission) as NotificationPermission;
    } catch (error) {
      console.error('❌ Error requesting notification permission:', error);
      return 'denied';
    }
  }

  /**
   * Send a browser notification
   * Only works if permission is 'granted'
   */
  async sendNotification(
    title: string,
    options: BrowserNotificationOptions = {}
  ): Promise<Notification | null> {
    // Check support and permission
    if (!this.isSupported()) {
      console.warn('🚫 Browser notifications not supported');
      return null;
    }

    if (window.Notification.permission !== 'granted') {
      console.warn('⚠️ Notification permission not granted');
      return null;
    }

    try {
      // Set default options
      const notifyOptions: NotificationOptions = {
        icon: options.icon || '/logo-icon.png',
        badge: options.badge || '/badge-icon.png',
        tag: options.tag || `notification-${Date.now()}`,
        requireInteraction: options.requireInteraction || false,
        silent: options.silent || false,
        body: options.body,
        actions: options.actions,
        data: options.data || {},
      };

      // Create notification
      const notification = new window.Notification(title, notifyOptions);

      // Track notification by tag for deduplication
      if (notifyOptions.tag) {
        this.activeNotifications.set(notifyOptions.tag, notification);
      }

      // Auto-remove from tracking when closed
      notification.addEventListener('close', () => {
        if (notifyOptions.tag) {
          this.activeNotifications.delete(notifyOptions.tag);
        }
      });

      console.log('🔔 Notification sent:', title);
      return notification;
    } catch (error) {
      console.error('❌ Error sending notification:', error);
      return null;
    }
  }

  /**
   * Send notification and handle click
   */
  async sendNotificationWithClick(
    title: string,
    options: BrowserNotificationOptions,
    onClickCallback?: (notification: Notification) => void
  ): Promise<Notification | null> {
    const notification = await this.sendNotification(title, options);

    if (notification && onClickCallback) {
      notification.addEventListener('click', () => {
        onClickCallback(notification);
        notification.close();
      });
    }

    return notification;
  }

  /**
   * Close a notification by tag
   */
  closeNotification(tag: string): void {
    const notification = this.activeNotifications.get(tag);
    if (notification) {
      notification.close();
      this.activeNotifications.delete(tag);
    }
  }

  /**
   * Close all active notifications
   */
  closeAllNotifications(): void {
    this.activeNotifications.forEach((notification) => {
      notification.close();
    });
    this.activeNotifications.clear();
  }

  /**
   * Get count of active notifications
   */
  getActiveNotificationCount(): number {
    return this.activeNotifications.size;
  }

  /**
   * Get all active notifications
   */
  getActiveNotifications(): Notification[] {
    return Array.from(this.activeNotifications.values());
  }

  /**
   * Check if a notification with tag exists
   */
  hasNotification(tag: string): boolean {
    return this.activeNotifications.has(tag);
  }

  /**
   * Send campaign-related notification
   */
  async notifyCampaignUpdate(
    campaignName: string,
    status: 'activated' | 'paused' | 'completed' | 'failed'
  ): Promise<Notification | null> {
    const statusMessages: Record<string, { title: string; body: string }> = {
      activated: {
        title: '🚀 Campaign Activated',
        body: `Your campaign "${campaignName}" is now live!`,
      },
      paused: {
        title: '⏸️ Campaign Paused',
        body: `Your campaign "${campaignName}" has been paused.`,
      },
      completed: {
        title: '✅ Campaign Completed',
        body: `Your campaign "${campaignName}" has completed successfully!`,
      },
      failed: {
        title: '❌ Campaign Failed',
        body: `Your campaign "${campaignName}" encountered an error.`,
      },
    };

    const message = statusMessages[status];
    if (!message) {
      return null;
    }

    return this.sendNotification(message.title, {
      body: message.body,
      icon: '/logo-icon.png',
      tag: `campaign-${campaignName}-${status}`,
      requireInteraction: status === 'failed',
    });
  }

  /**
   * Send donation notification
   */
  async notifyDonation(
    donorName: string,
    amount: number,
    campaignName: string
  ): Promise<Notification | null> {
    return this.sendNotification('💰 New Donation Received', {
      body: `${donorName} donated $${(amount / 100).toFixed(2)} to "${campaignName}"`,
      icon: '/logo-icon.png',
      tag: `donation-${Date.now()}`,
      requireInteraction: false,
    });
  }

  /**
   * Send goal reached notification
   */
  async notifyGoalReached(
    campaignName: string,
    amount: number
  ): Promise<Notification | null> {
    return this.sendNotification('🎯 Goal Reached!', {
      body: `Your campaign "${campaignName}" has reached its goal of $${(
        amount / 100
      ).toFixed(2)}!`,
      icon: '/logo-icon.png',
      tag: `goal-${campaignName}`,
      requireInteraction: true,
    });
  }

  /**
   * Send milestone notification
   */
  async notifyMilestone(
    campaignName: string,
    milestone: string
  ): Promise<Notification | null> {
    return this.sendNotification('🚀 Milestone Achieved', {
      body: `Your campaign "${campaignName}" has achieved ${milestone}!`,
      icon: '/logo-icon.png',
      tag: `milestone-${campaignName}-${milestone}`,
    });
  }

  /**
   * Get permission and setup event listeners
   * Call this on app initialization
   */
  async initialize(): Promise<'granted' | 'denied' | 'default'> {
    if (!this.isSupported()) {
      console.warn('🚫 Browser notifications not supported');
      return 'denied';
    }

    const permission = this.getPermissionStatus();

    if (permission === 'default') {
      console.log('ℹ️ Requesting notification permission');
      return this.requestPermission();
    }

    return permission;
  }

  /**
   * Send test notification (for debugging)
   */
  async sendTestNotification(): Promise<Notification | null> {
    return this.sendNotification('Test Notification', {
      body: 'This is a test notification from HonestNeed',
      icon: '/logo-icon.png',
      tag: 'test-notification',
    });
  }
}

// Export singleton instance
export const browserNotificationsService = new BrowserNotificationsService();

export default BrowserNotificationsService;
