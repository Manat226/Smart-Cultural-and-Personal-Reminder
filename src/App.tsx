import React, { useState, useEffect } from 'react';
import { ViewType } from './types';
import { notificationManager } from './utils/notifications';
import { useNotifications } from './hooks/useNotifications';
import NotificationBar from './components/NotificationBar/NotificationBar';
import Navigation from './components/Navigation';
import TasksList from './components/Tasks/TasksList';
import EventsList from './components/Events/EventsList';
import AvatarGuide from './components/Avatar/AvatarGuide';
import WishesList from './components/Wishes/WishesList';
import AvatarChat from './components/Avatar/AvatarChat';

function App() {
  const [currentView, setCurrentView] = useState<ViewType>('tasks');
  const { notifications, removeNotification, showSuccess, showError, showReminder, showInfo } = useNotifications();

  useEffect(() => {
    // Register service worker for PWA
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
          .then((registration) => {
            console.log('SW registered: ', registration);
          })
          .catch((registrationError) => {
            console.log('SW registration failed: ', registrationError);
          });
      });
    }
    
    // Request notification permission on app load
    notificationManager.requestPermission();
  }, []);

  const renderCurrentView = () => {
    switch (currentView) {
      case 'tasks':
        return <TasksList onNotification={{ showSuccess, showError, showReminder, showInfo }} />;
      case 'events':
        return <EventsList />;
      case 'avatar':
        return (
          <div>
            <AvatarGuide />
            <AvatarChat />
          </div>
        );
      case 'wishes':
        return <WishesList onNotification={{ showSuccess, showError, showReminder, showInfo }} />;
      default:
        return <TasksList onNotification={{ showSuccess, showError, showReminder, showInfo }} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <NotificationBar 
        notifications={notifications} 
        onRemove={removeNotification} 
      />
      <Navigation currentView={currentView} onViewChange={setCurrentView} />
      <main className="pb-6">
        {renderCurrentView()}
      </main>
    </div>
  );
}

export default App;
