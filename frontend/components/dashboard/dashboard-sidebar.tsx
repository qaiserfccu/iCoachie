"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Calendar,
  Users,
  ClipboardList,
  CreditCard,
  BarChart3,
  MessageSquare,
  Settings,
  HelpCircle,
  LogOut,
  ChevronLeft,
  GraduationCap,
  UserCheck,
} from "lucide-react"
import LogoutButton from '@/components/ui/LogoutButton'

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: Calendar, label: "Schedule", href: "/dashboard/schedule" },
  { icon: Users, label: "Members", href: "/dashboard/members" },
  { icon: UserCheck, label: "Attendance", href: "/dashboard/attendance" },
  { icon: GraduationCap, label: "Progress", href: "/dashboard/progress" },
  { icon: ClipboardList, label: "Evaluations", href: "/dashboard/evaluations" },
  { icon: CreditCard, label: "Payments", href: "/dashboard/payments" },
  { icon: BarChart3, label: "Analytics", href: "/dashboard/analytics" },
  { icon: MessageSquare, label: "Messages", href: "/dashboard/messages" },
]

const bottomItems = [
  { icon: Settings, label: "Settings", href: "/dashboard/settings" },
  { icon: HelpCircle, label: "Help & Support", href: "/dashboard/help" },
]

export function DashboardSidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 h-screen glass-card border-r border-white/20 transition-all duration-300 hidden lg:flex flex-col",
          collapsed ? "w-20" : "w-64",
        )}
      >
        <div className="flex items-center justify-between p-4 border-b border-white/20">
          <Link href="/" className={cn("flex items-center gap-2", collapsed && "justify-center")}>
            <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
              <span className="text-white font-bold text-xl">i</span>
            </div>
            {!collapsed && <span className="text-xl font-bold text-foreground">iCoachie</span>}
          </Link>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className={cn(
              "p-2 rounded-lg glass-subtle hover:bg-white/20 text-muted-foreground transition-transform",
              collapsed && "rotate-180",
            )}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
                pathname === item.href
                  ? "gradient-primary text-white shadow-lg shadow-primary/25"
                  : "text-muted-foreground hover:bg-white/20 hover:text-foreground",
                collapsed && "justify-center px-2",
              )}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-white/20 space-y-1">
          {bottomItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:bg-white/20 hover:text-foreground transition-colors",
                collapsed && "justify-center px-2",
              )}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          ))}
          <LogoutButton collapsed={collapsed} />
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 glass border-t border-white/20">
        <div className="flex items-center justify-around py-2">
          {menuItems.slice(0, 5).map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 px-3 py-2 rounded-lg text-xs",
                pathname === item.href ? "text-primary" : "text-muted-foreground",
              )}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          ))}
        </div>
      </nav>
    </>
  )
}
