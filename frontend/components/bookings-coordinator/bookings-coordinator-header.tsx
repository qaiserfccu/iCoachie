"use client"

import { Search, Wifi, WifiOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { GlobalNotifications } from "@/components/GlobalNotifications"
import { useSocket } from "@/contexts/SocketContext"

export function BookingsCoordinatorHeader() {
  const { isConnected } = useSocket()

  return (
    <header className="sticky top-0 z-30 glass border-b border-white/20">
      <div className="flex items-center justify-between h-16 px-4 lg:px-6">
        <div className="flex items-center gap-4 flex-1">
          <div className="relative max-w-md flex-1 hidden sm:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search bookings, reservations..."
              className="w-full pl-10 pr-4 py-2 rounded-xl glass-subtle border border-white/20 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
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

          <div className="flex items-center gap-3 pl-2 border-l border-white/20">
            <Avatar className="h-9 w-9">
              <AvatarFallback className="bg-gradient-to-br from-cyan-500 to-blue-500 text-white text-sm">
                BC
              </AvatarFallback>
            </Avatar>
            <div className="hidden md:block">
              <p className="text-sm font-medium">Booking Coordinator</p>
              <p className="text-xs text-muted-foreground">Reservations Team</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
