export interface NotificationOptions {
  title: string;
  message: string;
  icon?: string;
  sound?: boolean;
  tag?: string;
  requireInteraction?: boolean;
}

export class NotificationManager {
  private static instance: NotificationManager;
  private permission: NotificationPermission = 'default';
  private scheduledNotifications: Map<string, number> = new Map();

  private constructor() {
    this.checkPermission();
  }

  static getInstance(): NotificationManager {
    if (!NotificationManager.instance) {
      NotificationManager.instance = new NotificationManager();
    }
    return NotificationManager.instance;
  }

  private async checkPermission(): Promise<void> {
    if ('Notification' in window) {
      this.permission = Notification.permission;
    }
  }

  async requestPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      console.warn('This browser does not support notifications');
      return false;
    }

    if (this.permission === 'granted') {
      return true;
    }

    const permission = await Notification.requestPermission();
    this.permission = permission;
    return permission === 'granted';
  }

  async showNotification(options: NotificationOptions): Promise<void> {
    const hasPermission = await this.requestPermission();
    if (!hasPermission) {
      console.warn('Notification permission denied');
      return;
    }

    const notification = new Notification(options.title, {
      body: options.message,
      icon: options.icon || '/icon-192.png',
      tag: options.tag,
      requireInteraction: options.requireInteraction || false,
      silent: !options.sound
    });

    // Play sound if requested
    if (options.sound) {
      this.playNotificationSound();
    }

    // Auto-close after 5 seconds unless requireInteraction is true
    if (!options.requireInteraction) {
      setTimeout(() => {
        notification.close();
      }, 5000);
    }

    notification.onclick = () => {
      window.focus();
      notification.close();
    };
  }

  private playNotificationSound(): void {
    try {
      // Create a simple notification sound using Web Audio API
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1);
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime + 0.2);

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
    } catch (error) {
      console.warn('Could not play notification sound:', error);
    }
  }

  scheduleNotification(id: string, date: Date, options: NotificationOptions): void {
    // Clear existing notification if any
    this.cancelScheduledNotification(id);

    const now = new Date().getTime();
    const targetTime = date.getTime();
    const delay = targetTime - now;

    if (delay <= 0) {
      // If the time has already passed, show immediately
      this.showNotification(options);
      return;
    }

    const timeoutId = window.setTimeout(() => {
      this.showNotification(options);
      this.scheduledNotifications.delete(id);
    }, delay);

    this.scheduledNotifications.set(id, timeoutId);
  }

  cancelScheduledNotification(id: string): void {
    const timeoutId = this.scheduledNotifications.get(id);
    if (timeoutId) {
      clearTimeout(timeoutId);
      this.scheduledNotifications.delete(id);
    }
  }

  getScheduledNotifications(): string[] {
    return Array.from(this.scheduledNotifications.keys());
  }

  // Schedule multiple reminders for a task/event
  scheduleReminders(taskId: string, taskTitle: string, dueDate: Date, reminders: Array<{time: string, enabled: boolean, customMessage?: string}>): void {
    reminders.forEach((reminder, index) => {
      if (!reminder.enabled) return;

      let reminderDate = new Date(dueDate);
      
      switch (reminder.time) {
        case '1hour':
          reminderDate.setHours(reminderDate.getHours() - 1);
          break;
        case '1day':
          reminderDate.setDate(reminderDate.getDate() - 1);
          break;
        case '1week':
          reminderDate.setDate(reminderDate.getDate() - 7);
          break;
      }

      const notificationId = `${taskId}-${index}`;
      const message = reminder.customMessage || `Reminder: ${taskTitle}`;
      
      this.scheduleNotification(notificationId, reminderDate, {
        title: 'Cultural Reminder',
        message,
        sound: true,
        requireInteraction: true,
        tag: notificationId
      });
    });
  }
}

export const notificationManager = NotificationManager.getInstance();