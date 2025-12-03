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
import { Search, Menu, Plus, User, Settings, LogOut, Wifi, WifiOff } from "lucide-react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/contexts/AuthContext"
import { mockUsers } from "@/lib/services/mockDataService"
import { GlobalNotifications } from "@/components/GlobalNotifications"
import { useSocket } from "@/contexts/SocketContext"

export function DashboardHeader() {
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const { isConnected } = useSocket()
  
  // Get user data from centralized mock service
  const user = mockUsers.coach

  const { logout } = useAuth()
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await logout()
      router.push('/login')
    } catch (err) {
      router.push('/login')
    }
  }

  return (
    <>
      <header className="sticky top-0 z-30 bg-card/95 backdrop-blur-sm border-b border-border">
        <div className="flex items-center justify-between px-4 lg:px-6 h-16">
          <div className="flex items-center gap-4">
            <button
              aria-label="Toggle menu"
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
            <div className="hidden sm:flex items-center gap-1.5 px-2 py-1 rounded-full bg-white/5 border border-white/10">
              {isConnected ? (
                <>
                  <Wifi className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="text-[10px] font-medium text-emerald-500/90">Live</span>
                </>
              ) : (
                <>
                  <WifiOff className="w-3.5 h-3.5 text-amber-500" />
                  <span className="text-[10px] font-medium text-amber-500/90">Offline</span>
                </>
              )}
            </div>

            <Button className="hidden sm:flex bg-primary text-primary-foreground hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-2" />
              New Session
            </Button>

            <GlobalNotifications />

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
                <DropdownMenuItem className="text-destructive" onClick={handleLogout}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>
    </>
  )
}
