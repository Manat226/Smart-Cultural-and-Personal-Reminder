import { useState, useCallback } from 'react';
import { Notification } from '../components/NotificationBar/NotificationBar';

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = useCallback((
    type: Notification['type'],
    message: string,
    duration?: number
  ) => {
    const notification: Notification = {
      id: crypto.randomUUID(),
      type,
      message,
      duration
    };

    setNotifications(prev => [...prev, notification]);
    return notification.id;
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  // Convenience methods
  const showSuccess = useCallback((message: string, duration?: number) => {
    return addNotification('success', message, duration);
  }, [addNotification]);

  const showError = useCallback((message: string, duration?: number) => {
    return addNotification('error', message, duration);
  }, [addNotification]);

  const showReminder = useCallback((message: string, duration?: number) => {
    return addNotification('reminder', message, duration);
  }, [addNotification]);

  const showInfo = useCallback((message: string, duration?: number) => {
    return addNotification('info', message, duration);
  }, [addNotification]);

  return {
    notifications,
    addNotification,
    removeNotification,
    clearAllNotifications,
    showSuccess,
    showError,
    showReminder,
    showInfo
  };
};