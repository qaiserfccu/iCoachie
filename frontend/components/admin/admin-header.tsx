"use client"

import { useState } from "react"
import { Bell, Search, Menu, Moon, Sun } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { NotificationDrawer, useNotificationDrawer } from "@/components/ui/notification-drawer"
import { mockUsers, getUnreadNotificationCount } from "@/lib/services/mockDataService"

export function AdminHeader() {
  const [isDark, setIsDark] = useState(false)
  const notificationDrawer = useNotificationDrawer()
  
  // Get user data from centralized mock service
  const user = mockUsers.admin
  const unreadCount = getUnreadNotificationCount()

  return (
    <>
      <header className="sticky top-0 z-30 glass border-b border-white/20">
        <div className="flex items-center justify-between h-16 px-4 lg:px-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="lg:hidden">
              <Menu className="h-5 w-5" />
            </Button>
            <div className="hidden md:flex items-center gap-2 glass-input rounded-xl px-4 py-2 w-80">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users, clubs, coaches..."
                className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 p-0 h-auto"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="glass-subtle rounded-xl" onClick={() => setIsDark(!isDark)}>
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>

            <Button 
              variant="ghost" 
              size="icon" 
              className="glass-subtle rounded-xl relative"
              onClick={notificationDrawer.open}
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-destructive rounded-full text-xs text-white flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="glass-subtle rounded-xl flex items-center gap-3 px-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="" />
                    <AvatarFallback className="bg-gradient-to-br from-red-500 to-orange-500 text-white text-sm">
                      {user.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden md:block text-left">
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="glass-card border-white/20">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Profile Settings</DropdownMenuItem>
                <DropdownMenuItem>Activity Log</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive">Log out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>
      
      <NotificationDrawer 
        isOpen={notificationDrawer.isOpen} 
        onClose={notificationDrawer.close} 
      />
    </>
  )
}
