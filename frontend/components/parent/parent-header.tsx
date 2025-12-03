"use client"

import { Bell, Search, Menu } from "lucide-react"
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

export function ParentHeader() {
  const { logout } = useAuth()
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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="glass-subtle rounded-xl relative">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-pink-500 rounded-full text-xs text-white flex items-center justify-center">
                  3
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 glass-card border-white/20">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="flex flex-col items-start gap-1 py-3">
                <span className="font-medium">Session Reminder</span>
                <span className="text-xs text-muted-foreground">Emma&apos;s swimming class starts in 1 hour</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex flex-col items-start gap-1 py-3">
                <span className="font-medium">Progress Update</span>
                <span className="text-xs text-muted-foreground">Jake earned a new badge in basketball!</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex flex-col items-start gap-1 py-3">
                <span className="font-medium">Payment Due</span>
                <span className="text-xs text-muted-foreground">Monthly subscription due in 3 days</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

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
