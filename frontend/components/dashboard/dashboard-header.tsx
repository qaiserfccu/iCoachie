"use client"

import { useState } from "react"
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
import { Bell, Search, Menu, Plus, User, Settings, LogOut } from "lucide-react"
import { NotificationDrawer, useNotificationDrawer } from "@/components/ui/notification-drawer"
import { mockUsers, getUnreadNotificationCount } from "@/lib/services/mockDataService"

export function DashboardHeader() {
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const notificationDrawer = useNotificationDrawer()
  
  // Get user data from centralized mock service
  const user = mockUsers.coach
  const unreadCount = getUnreadNotificationCount()

  return (
    <>
      <header className="sticky top-0 z-30 bg-card/95 backdrop-blur-sm border-b border-border">
        <div className="flex items-center justify-between px-4 lg:px-6 h-16">
          <div className="flex items-center gap-4">
            <button
              className="lg:hidden p-2 rounded-lg hover:bg-muted"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search members, sessions..."
                className="pl-9 w-64 lg:w-80 bg-muted/50 border-0 focus-visible:ring-1"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button className="hidden sm:flex bg-primary text-primary-foreground hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-2" />
              New Session
            </Button>

            <button 
              className="relative p-2 rounded-lg hover:bg-muted"
              onClick={notificationDrawer.open}
            >
              <Bell className="w-5 h-5 text-muted-foreground" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full" />
              )}
            </button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-3 p-1.5 rounded-lg hover:bg-muted">
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                    <span className="text-primary-foreground font-semibold text-sm">{user.avatar}</span>
                  </div>
                  <div className="hidden md:block text-left">
                    <p className="text-sm font-medium text-foreground">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.roleLabel}</p>
                  </div>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="w-4 h-4 mr-2" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive">
                  <LogOut className="w-4 h-4 mr-2" />
                  Log out
                </DropdownMenuItem>
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
