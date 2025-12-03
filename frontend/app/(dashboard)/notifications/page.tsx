"use client";

import React from 'react';
import { useNotifications } from '@/contexts/NotificationContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Check, Trash2, Bell, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function NotificationsPage() {
  const { 
    notifications, 
    unreadCount, 
    markAsRead, 
    markAllAsRead, 
    deleteNotification,
    clearAll
  } = useNotifications();

  const unreadNotifications = notifications.filter(n => !n.read);
  const readNotifications = notifications.filter(n => n.read);

  const NotificationItem = ({ notification }: { notification: any }) => (
    <div 
      className={cn(
        "flex items-start gap-4 p-4 rounded-lg border transition-colors",
        !notification.read ? "bg-muted/30 border-primary/20" : "bg-card hover:bg-muted/50"
      )}
    >
      <div className={cn(
        "mt-1 h-2 w-2 rounded-full shrink-0",
        !notification.read ? "bg-primary" : "bg-muted-foreground/30"
      )} />
      
      <div className="flex-1 space-y-1">
        <div className="flex items-center justify-between">
          <h4 className={cn("font-medium leading-none", !notification.read && "text-primary")}>
            {notification.title}
          </h4>
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {new Date(notification.createdAt).toLocaleString()}
          </span>
        </div>
        <p className="text-sm text-muted-foreground">
          {notification.message}
        </p>
        {notification.data && Object.keys(notification.data).length > 0 && (
          <div className="mt-2 text-xs bg-muted p-2 rounded overflow-x-auto">
            <pre>{JSON.stringify(notification.data, null, 2)}</pre>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        {!notification.read && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => markAsRead(notification.id)}
            title="Mark as read"
          >
            <Check className="h-4 w-4" />
          </Button>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="text-destructive hover:text-destructive hover:bg-destructive/10"
          onClick={() => deleteNotification(notification.id)}
          title="Delete"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );

  return (
    <div className="container max-w-4xl py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
          <p className="text-muted-foreground">
            Manage your alerts and updates.
          </p>
        </div>
        <div className="flex gap-2">
          {unreadCount > 0 && (
            <Button variant="outline" onClick={() => markAllAsRead()}>
              <Check className="mr-2 h-4 w-4" />
              Mark all read
            </Button>
          )}
          {notifications.length > 0 && (
            <Button variant="ghost" className="text-destructive hover:text-destructive" onClick={() => clearAll()}>
              <Trash2 className="mr-2 h-4 w-4" />
              Clear all
            </Button>
          )}
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all" className="relative">
            All
            <Badge variant="secondary" className="ml-2 h-5 px-1.5 min-w-[20px]">
              {notifications.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="unread">
            Unread
            {unreadCount > 0 && (
              <Badge variant="destructive" className="ml-2 h-5 px-1.5 min-w-[20px]">
                {unreadCount}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4 mt-4">
          {notifications.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                <Bell className="h-12 w-12 mb-4 opacity-20" />
                <p>No notifications yet</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {notifications.map((notification) => (
                <NotificationItem key={notification.id} notification={notification} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="unread" className="space-y-4 mt-4">
          {unreadNotifications.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                <Check className="h-12 w-12 mb-4 opacity-20" />
                <p>You're all caught up!</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {unreadNotifications.map((notification) => (
                <NotificationItem key={notification.id} notification={notification} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
