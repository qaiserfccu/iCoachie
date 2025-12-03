"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useAuth } from "@/lib/contexts/AuthContext"
import {
  LayoutDashboard,
  Calendar,
  Users,
  CreditCard,
  Star,
  MessageSquare,
  Settings,
  HelpCircle,
  ChevronLeft,
  ChevronDown,
  Bell,
  BarChart3,
  Briefcase,
  Clock,
  Loader2,
} from "lucide-react"
import LogoutButton from '@/components/ui/LogoutButton'

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/freelancer" },
  {
    icon: Calendar,
    label: "Bookings",
    href: "/freelancer/bookings",
    subItems: [
      { label: "All Bookings", href: "/freelancer/bookings" },
      { label: "Pending", href: "/freelancer/bookings/pending" },
      { label: "Calendar", href: "/freelancer/bookings/calendar" },
    ],
  },
  {
    icon: Users,
    label: "Clients",
    href: "/freelancer/clients",
    subItems: [
      { label: "All Clients", href: "/freelancer/clients" },
      { label: "Reviews", href: "/freelancer/clients/reviews" },
    ],
  },
  {
    icon: Clock,
    label: "Availability",
    href: "/freelancer/availability",
  },
  {
    icon: CreditCard,
    label: "Earnings",
    href: "/freelancer/earnings",
    subItems: [
      { label: "Overview", href: "/freelancer/earnings" },
      { label: "Transactions", href: "/freelancer/earnings/transactions" },
      { label: "Payouts", href: "/freelancer/earnings/payouts" },
    ],
  },
  { icon: Star, label: "Reviews", href: "/freelancer/reviews" },
  { icon: BarChart3, label: "Analytics", href: "/freelancer/analytics" },
  { icon: MessageSquare, label: "Messages", href: "/freelancer/messages" },
  { icon: Bell, label: "Notifications", href: "/freelancer/notifications" },
]

const bottomItems = [
  { icon: Briefcase, label: "My Profile", href: "/freelancer/profile" },
  { icon: Settings, label: "Settings", href: "/freelancer/settings" },
  { icon: HelpCircle, label: "Help", href: "/freelancer/help" },
]

/**
 * FreelancerSidebar Component
 * 
 * Displays the navigation sidebar for freelancer users.
 * User profile data is fetched from the backend via AuthContext.
 * 
 * Backend Endpoints Used:
 * - GET /api/users/me - Fetches current user profile (via AuthContext)
 *   See: backend/src/controllers/userController.ts
 */
export function FreelancerSidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const [openMenus, setOpenMenus] = useState<string[]>([])
  const pathname = usePathname()
  
  // User data from AuthContext (fetched from GET /api/users/me)
  const { user, isLoading } = useAuth()

  const toggleMenu = (label: string) => {
    setOpenMenus((prev) => (prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label]))
  }

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/")
  
  // Get display name from user profile or fallback
  const displayName = user ? `${user.firstName} ${user.lastName}`.trim() || user.email : 'Freelancer'
  const roleLabel = user?.role?.name || 'Freelance Coach'
  
  // Generate initials for avatar fallback
  const initials = user 
    ? `${user.firstName?.charAt(0) || ''}${user.lastName?.charAt(0) || ''}`.toUpperCase() || user.email?.charAt(0)?.toUpperCase() || 'F'
    : 'F'

  return (
    <>
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 h-screen glass-card border-r border-white/20 transition-all duration-300 hidden lg:flex flex-col",
          collapsed ? "w-20" : "w-72",
        )}
      >
        <div className="flex items-center justify-between p-4 border-b border-white/20">
          <Link href="/freelancer" className={cn("flex items-center gap-2", collapsed && "justify-center")}>
            <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
              {isLoading ? (
                <Loader2 className="w-5 h-5 text-white animate-spin" />
              ) : (
                <span className="text-white text-sm font-semibold">{initials}</span>
              )}
            </div>
            {!collapsed && (
              <div>
                {isLoading ? (
                  <>
                    <span className="text-lg font-bold text-foreground">Loading...</span>
                    <span className="block text-xs text-muted-foreground">Please wait</span>
                  </>
                ) : (
                  <>
                    <span className="text-lg font-bold text-foreground">{displayName}</span>
                    <span className="block text-xs text-muted-foreground">{roleLabel}</span>
                  </>
                )}
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
                        ? "bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-600 border border-yellow-500/20"
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
                              ? "text-yellow-600 bg-yellow-500/10"
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
                      ? "bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-600 border border-yellow-500/20"
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
                isActive(item.href) ? "text-yellow-600" : "text-muted-foreground",
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
