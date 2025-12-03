"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Users,
  UserCog,
  Calendar,
  CreditCard,
  BarChart3,
  MessageSquare,
  Settings,
  HelpCircle,
  ChevronLeft,
  ChevronDown,
  GraduationCap,
  UserCheck,
  Building2,
  Bell,
} from "lucide-react"
import LogoutButton from '@/components/ui/LogoutButton'
import { clubAdminService, type ClubInfo } from "@/lib/services"

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/club" },
  {
    icon: UserCog,
    label: "Coaches",
    href: "/club/coaches",
    subItems: [
      { label: "All Coaches", href: "/club/coaches" },
      { label: "Add Coach", href: "/club/coaches/add" },
      { label: "Schedules", href: "/club/coaches/schedules" },
    ],
  },
  {
    icon: Users,
    label: "Members",
    href: "/club/members",
    subItems: [
      { label: "All Members", href: "/club/members" },
      { label: "Add Member", href: "/club/members/add" },
      { label: "Groups", href: "/club/members/groups" },
    ],
  },
  {
    icon: Calendar,
    label: "Sessions",
    href: "/club/sessions",
    subItems: [
      { label: "All Sessions", href: "/club/sessions" },
      { label: "Create Session", href: "/club/sessions/create" },
      { label: "Calendar View", href: "/club/sessions/calendar" },
    ],
  },
  {
    icon: UserCheck,
    label: "Attendance",
    href: "/club/attendance",
  },
  {
    icon: GraduationCap,
    label: "Progress",
    href: "/club/progress",
    subItems: [
      { label: "Overview", href: "/club/progress" },
      { label: "Evaluations", href: "/club/progress/evaluations" },
      { label: "Reports", href: "/club/progress/reports" },
    ],
  },
  {
    icon: CreditCard,
    label: "Payments",
    href: "/club/payments",
    subItems: [
      { label: "Transactions", href: "/club/payments" },
      { label: "Memberships", href: "/club/payments/memberships" },
      { label: "Invoices", href: "/club/payments/invoices" },
    ],
  },
  { icon: BarChart3, label: "Analytics", href: "/club/analytics" },
  { icon: MessageSquare, label: "Messages", href: "/club/messages" },
  { icon: Bell, label: "Announcements", href: "/club/announcements" },
]

const bottomItems = [
  { icon: Building2, label: "Club Profile", href: "/club/profile" },
  { icon: Settings, label: "Settings", href: "/club/settings" },
  { icon: HelpCircle, label: "Help", href: "/club/help" },
]

export function ClubSidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const [openMenus, setOpenMenus] = useState<string[]>([])
  const [clubInfo, setClubInfo] = useState<ClubInfo | null>(null)
  const pathname = usePathname()

  useEffect(() => {
    async function loadClubInfo() {
      try {
        const info = await clubAdminService.getMyClub()
        setClubInfo(info)
      } catch (error) {
        console.error('Error loading club info:', error)
      }
    }
    loadClubInfo()
  }, [])

  const toggleMenu = (label: string) => {
    setOpenMenus((prev) => (prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label]))
  }

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/")

  return (
    <>
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 h-screen glass-card border-r border-white/20 transition-all duration-300 hidden lg:flex flex-col",
          collapsed ? "w-20" : "w-72",
        )}
      >
        <div className="flex items-center justify-between p-4 border-b border-white/20">
          <Link href="/club" className={cn("flex items-center gap-2", collapsed && "justify-center")}>
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-teal-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            {!collapsed && (
              <div>
                <span className="text-lg font-bold text-foreground">{clubInfo?.name || 'My Club'}</span>
                <span className="block text-xs text-muted-foreground">Club Admin</span>
              </div>
            )}
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

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {menuItems.map((item) => (
            <div key={item.label}>
              {item.subItems ? (
                <>
                  <button
                    onClick={() => toggleMenu(item.label)}
                    className={cn(
                      "w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
                      isActive(item.href)
                        ? "bg-gradient-to-r from-blue-500/20 to-teal-500/20 text-blue-500 border border-blue-500/20"
                        : "text-muted-foreground hover:bg-white/20 hover:text-foreground",
                      collapsed && "justify-center px-2",
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className="w-5 h-5 flex-shrink-0" />
                      {!collapsed && <span>{item.label}</span>}
                    </div>
                    {!collapsed && (
                      <ChevronDown
                        className={cn("w-4 h-4 transition-transform", openMenus.includes(item.label) && "rotate-180")}
                      />
                    )}
                  </button>
                  {!collapsed && openMenus.includes(item.label) && (
                    <div className="ml-4 mt-1 space-y-1 border-l-2 border-white/20 pl-4">
                      {item.subItems.map((sub) => (
                        <Link
                          key={sub.href}
                          href={sub.href}
                          className={cn(
                            "block px-3 py-2 rounded-lg text-sm transition-colors",
                            pathname === sub.href
                              ? "text-blue-500 bg-blue-500/10"
                              : "text-muted-foreground hover:text-foreground hover:bg-white/10",
                          )}
                        >
                          {sub.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
                    isActive(item.href)
                      ? "bg-gradient-to-r from-blue-500/20 to-teal-500/20 text-blue-500 border border-blue-500/20"
                      : "text-muted-foreground hover:bg-white/20 hover:text-foreground",
                    collapsed && "justify-center px-2",
                  )}
                >
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  {!collapsed && <span>{item.label}</span>}
                </Link>
              )}
            </div>
          ))}
        </nav>

        <div className="p-3 border-t border-white/20 space-y-1">
          {bottomItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-muted-foreground hover:bg-white/20 hover:text-foreground transition-colors",
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
                isActive(item.href) ? "text-blue-500" : "text-muted-foreground",
              )}
            >
              <item.icon className="w-5 h-5" />
              <span className="truncate max-w-[60px]">{item.label.split(" ")[0]}</span>
            </Link>
          ))}
        </div>
      </nav>
    </>
  )
}
