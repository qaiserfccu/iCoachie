"use client"

import { useState } from "react"
import { Search, Menu, Moon, Sun, Wifi, WifiOff } from "lucide-react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/contexts/AuthContext"
import { useSocket } from "@/contexts/SocketContext"
import { GlobalNotifications } from "@/components/GlobalNotifications"
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

export function AdminHeader() {
  const { user: authUser, logout } = useAuth()
  const { isConnected } = useSocket()
  const router = useRouter()
  const handleLogout = async () => { try { await logout(); router.push('/login') } catch (_) { router.push('/login') } }
  const [isDark, setIsDark] = useState(false)
  
  // Use authenticated user or fallback to default
  const displayName = authUser?.firstName && authUser?.lastName 
    ? `${authUser.firstName} ${authUser.lastName}` 
    : authUser?.email?.split('@')[0] || 'Admin'
  const userInitials = displayName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'SA'
  const userEmail = authUser?.email || 'admin@icoachie.com'

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
            {/* Connection status indicator */}
            <div className="hidden sm:flex items-center gap-1.5 px-2 py-1 rounded-lg glass-subtle">
              {isConnected ? (
                <>
                  <Wifi className="h-4 w-4 text-green-500" />
                  <span className="text-xs text-green-500">Live</span>
                </>
              ) : (
                <>
                  <WifiOff className="h-4 w-4 text-yellow-500" />
                  <span className="text-xs text-yellow-500">Offline</span>
                </>
              )}
            </div>
            
            <Button variant="ghost" size="icon" className="glass-subtle rounded-xl" onClick={() => setIsDark(!isDark)}>
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>

            <div className="glass-subtle rounded-xl">
              <GlobalNotifications />
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="glass-subtle rounded-xl flex items-center gap-3 px-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="" />
                    <AvatarFallback className="bg-gradient-to-br from-red-500 to-orange-500 text-white text-sm">
                      {userInitials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden md:block text-left">
                    <p className="text-sm font-medium">{displayName}</p>
                    <p className="text-xs text-muted-foreground">{userEmail}</p>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="glass-card border-white/20">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Profile Settings</DropdownMenuItem>
                <DropdownMenuItem>Activity Log</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive" onClick={handleLogout}>Log out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>
    </>
  )
}
