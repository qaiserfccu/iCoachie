"use client"

import { Search, Menu, Wifi, WifiOff } from "lucide-react"
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

export function ParentHeader() {
  const { logout } = useAuth()
  const { isConnected } = useSocket()
  const router = useRouter()
  const handleLogout = async () => {
    try { await logout(); router.push('/login') } catch (_) { router.push('/login') }
  }
  return (
    <header className="sticky top-0 z-30 glass border-b border-white/20">
      <div className="flex items-center justify-between h-16 px-4 lg:px-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="lg:hidden">
            <Menu className="h-5 w-5" />
          </Button>
          <div className="hidden md:flex items-center gap-2 glass-input rounded-xl px-4 py-2 w-80">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search kids, sessions..."
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

          <div className="glass-subtle rounded-xl">
            <GlobalNotifications />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="glass-subtle rounded-xl flex items-center gap-3 px-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/mom-profile.jpg" />
                  <AvatarFallback className="bg-gradient-to-br from-pink-500 to-rose-500 text-white text-sm">
                    ST
                  </AvatarFallback>
                </Avatar>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium">Sarah Thompson</p>
                  <p className="text-xs text-muted-foreground">Parent</p>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="glass-card border-white/20">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>My Kids</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Payments</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive" onClick={handleLogout}>Log out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
