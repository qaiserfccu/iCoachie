"use client"

import { Bell, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export function MaintenanceHeader() {
  return (
    <header className="sticky top-0 z-30 glass border-b border-white/20">
      <div className="flex items-center justify-between h-16 px-4 lg:px-6">
        <div className="flex items-center gap-4 flex-1">
          <div className="relative max-w-md flex-1 hidden sm:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search work orders, inventory..."
              className="w-full pl-10 pr-4 py-2 rounded-xl glass-subtle border border-white/20 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50"
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-amber-500 rounded-full" />
          </Button>
          <div className="flex items-center gap-3 pl-2 border-l border-white/20">
            <Avatar className="h-9 w-9">
              <AvatarFallback className="bg-gradient-to-br from-amber-500 to-orange-500 text-white text-sm">
                MT
              </AvatarFallback>
            </Avatar>
            <div className="hidden md:block">
              <p className="text-sm font-medium">Maintenance Tech</p>
              <p className="text-xs text-muted-foreground">Facilities Team</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
