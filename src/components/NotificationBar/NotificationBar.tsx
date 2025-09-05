import React, { useState, useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info, Bell } from 'lucide-react';

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'reminder' | 'info';
  message: string;
  duration?: number; // in milliseconds, default 5000
}

interface NotificationBarProps {
  notifications: Notification[];
  onRemove: (id: string) => void;
}

const NotificationBar: React.FC<NotificationBarProps> = ({ notifications, onRemove }) => {
  const [visibleNotifications, setVisibleNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    // Add new notifications with slide-in animation
    notifications.forEach(notification => {
      if (!visibleNotifications.find(n => n.id === notification.id)) {
        setVisibleNotifications(prev => [...prev, notification]);
        
        // Auto-remove after duration
        const duration = notification.duration || 5000;
        setTimeout(() => {
          handleRemove(notification.id);
        }, duration);
      }
    });
  }, [notifications]);

  const handleRemove = (id: string) => {
    setVisibleNotifications(prev => prev.filter(n => n.id !== id));
    // Small delay before calling onRemove to allow animation
    setTimeout(() => onRemove(id), 300);
  };

  const getNotificationStyles = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return {
          bg: 'bg-green-500',
          icon: CheckCircle,
          iconColor: 'text-green-100'
        };
      case 'error':
        return {
          bg: 'bg-red-500',
          icon: AlertCircle,
          iconColor: 'text-red-100'
        };
      case 'reminder':
        return {
          bg: 'bg-blue-500',
          icon: Bell,
          iconColor: 'text-blue-100'
        };
      case 'info':
        return {
          bg: 'bg-indigo-500',
          icon: Info,
          iconColor: 'text-indigo-100'
        };
      default:
        return {
          bg: 'bg-gray-500',
          icon: Info,
          iconColor: 'text-gray-100'
        };
    }
  };

  if (visibleNotifications.length === 0) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 space-y-2 p-4">
      {visibleNotifications.map((notification, index) => {
        const styles = getNotificationStyles(notification.type);
        const Icon = styles.icon;
        
        return (
          <div
            key={notification.id}
            className={`${styles.bg} text-white px-4 py-3 rounded-lg shadow-lg transform transition-all duration-300 ease-out animate-slide-down`}
            style={{
              animationDelay: `${index * 100}ms`,
              marginTop: index > 0 ? '8px' : '0'
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Icon size={20} className={styles.iconColor} />
                <span className="font-medium text-sm sm:text-base">
                  {notification.message}
                </span>
              </div>
              
              <button
                onClick={() => handleRemove(notification.id)}
                className="ml-4 p-1 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors flex-shrink-0"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        );
      })}
      
      <style jsx>{`
        @keyframes slide-down {
          from {
            transform: translateY(-100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        
        .animate-slide-down {
          animation: slide-down 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default NotificationBar;