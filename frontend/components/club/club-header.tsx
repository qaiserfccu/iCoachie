"use client"

import { Search, Menu, Wifi, WifiOff } from "lucide-react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/contexts/AuthContext"
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
import { GlobalNotifications } from "@/components/GlobalNotifications"
import { useSocket } from "@/contexts/SocketContext"

export function ClubHeader() {
  const { logout } = useAuth()
  const router = useRouter()
  const { isConnected } = useSocket()
  const handleLogout = async () => { try { await logout(); router.push('/login') } catch (_) { router.push('/login') } }

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
                placeholder="Search members, coaches, sessions..."
                className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 p-0 h-auto"
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

            <GlobalNotifications />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="glass-subtle rounded-xl flex items-center gap-3 px-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="" />
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-teal-500 text-white text-sm">
                      CA
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden md:block text-left">
                    <p className="text-sm font-medium">Club Admin</p>
                    <p className="text-xs text-muted-foreground">Administrator</p>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="glass-card border-white/20">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Club Profile</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuItem>Billing</DropdownMenuItem>
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
