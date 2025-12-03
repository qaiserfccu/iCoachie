"use client"

import { Search, Menu, Crown, Wifi, WifiOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { GlobalNotifications } from "@/components/GlobalNotifications"
import { useSocket } from "@/contexts/SocketContext"

export function HeadCoachHeader() {
  const { isConnected } = useSocket()

  return (
    <header className="sticky top-0 z-30 glass border-b border-white/20">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-4 lg:hidden">
          <Button variant="ghost" size="icon" className="glass-subtle">
            <Menu className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
              <Crown className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold">Head Coach</span>
          </div>
        </div>
        <div className="hidden lg:flex items-center gap-4 flex-1 max-w-md">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search..." className="pl-10 glass-subtle border-white/20" />
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
          
          <Avatar className="h-9 w-9 border-2 border-orange-500/50">
            <AvatarFallback className="bg-gradient-to-br from-orange-500 to-red-500 text-white text-sm">HC</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  )
}
