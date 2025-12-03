"use client"

import { useState, useEffect } from "react"
import { Bell, Search, Menu, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/contexts/AuthContext"
import { apiClient } from "@/lib/api"
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

/**
 * API Response Types
 * Defines the shape of responses from backend endpoints
 */
interface UnreadCountResponse {
  success: boolean
  data: {
    unreadCount: number
  }
}

/**
 * FreelancerHeader Component
 * 
 * Displays the header for freelancer users with notifications and user menu.
 * All data is fetched from real backend endpoints.
 * 
 * Backend Endpoints Used:
 * - GET /api/users/me - Fetches current user profile (via AuthContext)
 *   See: backend/src/controllers/userController.ts
 * - GET /api/messages/unread-count - Fetches unread message count
 *   See: backend/src/controllers/messageController.ts
 */
export function FreelancerHeader() {
  const notificationDrawer = useNotificationDrawer()
  const { user, logout, isLoading: isAuthLoading } = useAuth()
  const router = useRouter()
  
  // State for unread message count from backend
  const [unreadCount, setUnreadCount] = useState(0)
  const [isLoadingUnread, setIsLoadingUnread] = useState(true)
  
  // Fetch unread message count from backend
  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        setIsLoadingUnread(true)
        // GET /api/messages/unread-count
        const response = await apiClient.get<UnreadCountResponse>('/messages/unread-count')
        if (response.success) {
          setUnreadCount(response.data.unreadCount)
        }
      } catch (error) {
        // Silently handle error - default to 0
        console.error('Failed to fetch unread count:', error)
        setUnreadCount(0)
      } finally {
        setIsLoadingUnread(false)
      }
    }
    
    // Only fetch if user is authenticated
    if (user) {
      fetchUnreadCount()
      
      // Optionally refresh every 60 seconds
      const interval = setInterval(fetchUnreadCount, 60000)
      return () => clearInterval(interval)
    } else {
      setIsLoadingUnread(false)
    }
  }, [user])
  
  // Get display name and initials from authenticated user
  const displayName = user ? `${user.firstName} ${user.lastName}`.trim() || user.email : 'Freelancer'
  const roleLabel = user?.role?.name || 'Freelance Coach'
  const initials = user 
    ? `${user.firstName?.charAt(0) || ''}${user.lastName?.charAt(0) || ''}`.toUpperCase() || user.email?.charAt(0)?.toUpperCase() || 'F'
    : 'F'

  const handleLogout = async () => {
    try {
      await logout()
      router.push('/login')
    } catch (_) {
      router.push('/login')
    }
  }

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
                placeholder="Search bookings, clients..."
                className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 p-0 h-auto"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="icon" 
              className="glass-subtle rounded-xl relative"
              onClick={notificationDrawer.open}
            >
              <Bell className="h-5 w-5" />
              {!isLoadingUnread && unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-500 rounded-full text-xs text-white flex items-center justify-center">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="glass-subtle rounded-xl flex items-center gap-3 px-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.avatar || ""} />
                    <AvatarFallback className="bg-gradient-to-br from-yellow-500 to-orange-500 text-white text-sm">
                      {isAuthLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden md:block text-left">
                    {isAuthLoading ? (
                      <>
                        <p className="text-sm font-medium">Loading...</p>
                        <p className="text-xs text-muted-foreground">Please wait</p>
                      </>
                    ) : (
                      <>
                        <p className="text-sm font-medium">{displayName}</p>
                        <p className="text-xs text-muted-foreground">{roleLabel}</p>
                      </>
                    )}
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="glass-card border-white/20">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push('/freelancer/profile')}>My Profile</DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push('/freelancer/settings')}>Settings</DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push('/freelancer/earnings')}>Earnings</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive" onClick={handleLogout}>Log out</DropdownMenuItem>
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
