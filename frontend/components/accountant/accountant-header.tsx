"use client"

import { Bell, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function AccountantHeader() {
  return (
    <header className="sticky top-0 z-30 glass border-b border-white/20">
      <div className="flex items-center justify-between px-4 py-3 lg:px-6">
        <div className="flex items-center gap-4">
          <div className="lg:hidden">
            <span className="text-lg font-bold">Accountant</span>
          </div>
          <div className="hidden sm:block relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search invoices, payments..."
              className="w-64 lg:w-80 pl-9 glass-subtle border-white/20 bg-transparent"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full text-[10px] flex items-center justify-center text-white font-medium">
              3
            </span>
          </Button>

          <div className="flex items-center gap-3 pl-3 border-l border-white/20">
            <Avatar className="h-9 w-9">
              <AvatarImage src="" />
              <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-green-600 text-white">AC</AvatarFallback>
            </Avatar>
            <div className="hidden sm:block">
              <p className="text-sm font-medium">Finance Team</p>
              <p className="text-xs text-muted-foreground">Accountant</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
