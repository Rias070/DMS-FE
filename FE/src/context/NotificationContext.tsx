import React, { createContext, useContext, useState, ReactNode } from 'react';
import Notification from '../components/common/Notification';

interface NotificationData {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
}

interface NotificationContextType {
  showNotification: (message: string, type: 'success' | 'error' | 'info' | 'warning', duration?: number) => void;
  hideNotification: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

// Export the context for use in hooks
export { NotificationContext };

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [notifications, setNotifications] = useState<NotificationData[]>([]);

  const showNotification = (message: string, type: 'success' | 'error' | 'info' | 'warning', duration = 5000) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newNotification: NotificationData = {
      id,
      message,
      type,
      duration
    };

    setNotifications(prev => [...prev, newNotification]);
  };

  const hideNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  return (
    <NotificationContext.Provider value={{ showNotification, hideNotification }}>
      {children}
      {/* Render all notifications */}
      {notifications.map(notification => (
        <Notification
          key={notification.id}
          message={notification.message}
          type={notification.type}
          duration={notification.duration}
          onClose={() => hideNotification(notification.id)}
        />
      ))}
    </NotificationContext.Provider>
  );
};
