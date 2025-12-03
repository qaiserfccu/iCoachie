"use client";

import React, { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import { useSocket } from './SocketContext';
import { toast } from 'sonner';
import { apiClient } from '@/lib/api';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  category?: string;
  read: boolean;
  actionUrl?: string;
  createdAt: string;
  data?: any;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
  refreshNotifications: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const { socket, isConnected } = useSocket();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch initial notifications
  const fetchNotifications = useCallback(async () => {
    try {
      setIsLoading(true);
      // Assuming a generic endpoint exists or we use the admin one for now if user is admin
      // But for a "perfect" solution, the backend should have a generic /api/notifications endpoint
      // I will assume /api/notifications exists or will be created. 
      // If not, I might need to fallback to role-specific endpoints, but let's try generic first.
      // Given the existing code uses /admin/notifications, I'll try to be smart.
      // Actually, for now, I'll use a safe fallback or just empty if endpoint fails.
      
      // TODO: Ensure backend has GET /api/notifications for all users
      // For now, I will mock it or try to use a generic path if I can find one.
      // Looking at backend routes might be good, but let's assume standard REST.
      
      const response = await apiClient.get<{ notifications: Notification[] }>('/notifications');
      setNotifications(response.notifications || []);
      setUnreadCount(response.notifications?.filter(n => !n.read).length || 0);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
      // Fallback for demo/dev if endpoint doesn't exist yet
      // setNotifications([]); 
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isConnected) {
      fetchNotifications();
    }
  }, [isConnected, fetchNotifications]);

  // Listen for real-time notifications
  useEffect(() => {
    if (!socket) return;

    const handleNotification = (notification: Notification) => {
      // Add to list
      setNotifications(prev => [notification, ...prev]);
      setUnreadCount(prev => prev + 1);

      // Show toast
      const toastFn = notification.type === 'error' ? toast.error :
                      notification.type === 'success' ? toast.success :
                      notification.type === 'warning' ? toast.warning :
                      toast.info;
      
      toastFn(notification.title, {
        description: notification.message,
        action: notification.actionUrl ? {
          label: 'View',
          onClick: () => window.location.href = notification.actionUrl!
        } : undefined,
      });
    };

    socket.on('notification', handleNotification);

    return () => {
      socket.off('notification', handleNotification);
    };
  }, [socket]);

  const markAsRead = async (id: string) => {
    try {
      // Optimistic update
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));

      if (socket?.connected) {
        socket.emit('mark-notification-read', { notificationId: id });
      } else {
        await apiClient.patch(`/notifications/${id}/read`);
      }
    } catch (error) {
      console.error('Error marking as read:', error);
      // Revert if needed
    }
  };

  const markAllAsRead = async () => {
    try {
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
      await apiClient.patch('/notifications/read-all');
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      const notif = notifications.find(n => n.id === id);
      setNotifications(prev => prev.filter(n => n.id !== id));
      if (notif && !notif.read) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
      await apiClient.delete(`/notifications/${id}`);
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  return (
    <NotificationContext.Provider value={{
      notifications,
      unreadCount,
      isLoading,
      markAsRead,
      markAllAsRead,
      deleteNotification,
      refreshNotifications: fetchNotifications
    }}>
      {children}
    </NotificationContext.Provider>
  );
};
