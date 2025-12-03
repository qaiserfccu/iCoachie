"use client"
import { Search, Wifi, WifiOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { GlobalNotifications } from "@/components/GlobalNotifications"
import { useSocket } from "@/contexts/SocketContext"

export function MedicalHeader() {
  const { isConnected } = useSocket()

  return (<header className="sticky top-0 z-30 glass border-b border-white/20"><div className="flex items-center justify-between px-4 py-3 lg:px-6"><div className="flex items-center gap-4"><div className="lg:hidden"><span className="text-lg font-bold">Medical</span></div><div className="hidden sm:block relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" /><Input placeholder="Search records..." className="w-64 lg:w-80 pl-9 glass-subtle border-white/20 bg-transparent" /></div></div><div className="flex items-center gap-3">
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
    <div className="flex items-center gap-3 pl-3 border-l border-white/20"><Avatar className="h-9 w-9"><AvatarImage src="" /><AvatarFallback className="bg-gradient-to-br from-red-500 to-pink-500 text-white">MS</AvatarFallback></Avatar><div className="hidden sm:block"><p className="text-sm font-medium">Medical Team</p><p className="text-xs text-muted-foreground">Staff</p></div></div></div></div></header>)
}
