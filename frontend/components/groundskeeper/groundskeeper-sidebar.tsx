"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  ClipboardList,
  Leaf,
  Droplets,
  Bug,
  Calendar,
  ChevronLeft,
  HelpCircle,
  Settings,
  Globe,
  Shovel,
} from "lucide-react"
import LogoutButton from '@/components/ui/LogoutButton'

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/groundskeeper" },
  { icon: ClipboardList, label: "Daily Tasks", href: "/groundskeeper/daily-tasks" },
  { icon: Leaf, label: "Turf Management", href: "/groundskeeper/turf" },
  { icon: Droplets, label: "Irrigation", href: "/groundskeeper/irrigation" },
  { icon: Bug, label: "Pest Control", href: "/groundskeeper/pest-control" },
  { icon: Calendar, label: "Seasonal Maintenance", href: "/groundskeeper/seasonal" },
]

const bottomItems = [
  { icon: Settings, label: "Settings", href: "/groundskeeper/settings" },
  { icon: Globe, label: "View Site", href: "/" },
  { icon: HelpCircle, label: "Help", href: "/groundskeeper/help" },
]

export function GroundskeeperSidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()
  const isActive = (href: string) => pathname === href || (href !== "/groundskeeper" && pathname.startsWith(href))

  return (
    <>
      <aside className={cn("fixed left-0 top-0 z-40 h-screen glass-card border-r border-white/20 transition-all duration-300 hidden lg:flex flex-col", collapsed ? "w-20" : "w-72")}>
        <div className="flex items-center justify-between p-4 border-b border-white/20">
          <Link href="/groundskeeper" className={cn("flex items-center gap-2", collapsed && "justify-center")}>
            <div className="w-10 h-10 bg-gradient-to-br from-lime-500 to-green-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
              <Shovel className="w-5 h-5 text-white" />
            </div>
            {!collapsed && (
              <div>
                <span className="text-lg font-bold text-foreground">iCoachie</span>
                <span className="block text-xs text-muted-foreground">Groundskeeper</span>
              </div>
            )}
          </Link>
          <button onClick={() => setCollapsed(!collapsed)} className={cn("p-2 rounded-lg glass-subtle hover:bg-white/20 text-muted-foreground transition-transform", collapsed && "rotate-180")}>
            <ChevronLeft className="w-5 h-5" />
          </button>
        </div>
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {menuItems.map((item) => (
            <Link key={item.href} href={item.href} className={cn("flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all", isActive(item.href) ? "bg-gradient-to-r from-lime-500/20 to-green-500/20 text-lime-400 border border-lime-500/20" : "text-muted-foreground hover:bg-white/20 hover:text-foreground", collapsed && "justify-center px-2")}>
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          ))}
        </nav>
        <div className="p-3 border-t border-white/20 space-y-1">
          {bottomItems.map((item) => (
            <Link key={item.label} href={item.href} className={cn("flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-muted-foreground hover:bg-white/20 hover:text-foreground transition-colors", collapsed && "justify-center px-2")}>
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          ))}
          <LogoutButton collapsed={collapsed} />
        </div>
      </aside>
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 glass border-t border-white/20">
        <div className="flex items-center justify-around py-2">
          {menuItems.slice(0, 5).map((item) => (
            <Link key={item.href} href={item.href} className={cn("flex flex-col items-center gap-1 px-3 py-2 rounded-lg text-xs", isActive(item.href) ? "text-lime-400" : "text-muted-foreground")}>
              <item.icon className="w-5 h-5" />
              <span className="truncate max-w-[60px]">{item.label.split(" ")[0]}</span>
            </Link>
          ))}
        </div>
      </nav>
    </>
  )
}
