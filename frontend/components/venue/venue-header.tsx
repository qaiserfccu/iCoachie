"use client"

import { Bell, Search, Menu, Building } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export function VenueHeader() {
  return (
    <header className="sticky top-0 z-30 glass border-b border-white/20">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-4 lg:hidden">
          <Button variant="ghost" size="icon" className="glass-subtle">
            <Menu className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Building className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold">Venue</span>
          </div>
        </div>
        <div className="hidden lg:flex items-center gap-4 flex-1 max-w-md">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search..." className="pl-10 glass-subtle border-white/20" />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="relative glass-subtle">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-violet-500 rounded-full" />
          </Button>
          <Avatar className="h-9 w-9 border-2 border-violet-500/50">
            <AvatarFallback className="bg-gradient-to-br from-violet-500 to-purple-600 text-white text-sm">VN</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  )
}
