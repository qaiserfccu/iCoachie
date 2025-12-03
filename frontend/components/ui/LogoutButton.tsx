"use client"

import React from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/contexts/AuthContext"
import { LogOut } from "lucide-react"
import { cn } from "@/lib/utils"

export default function LogoutButton({ collapsed = false }: { collapsed?: boolean }) {
  const { logout } = useAuth()
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await logout()
      router.push('/login')
    } catch (err) {
      // ignore for now, could add toast
      router.push('/login')
    }
  }

  return (
    <button
      onClick={handleLogout}
      className={cn(
        "w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors",
        collapsed && "justify-center px-2",
      )}
    >
      <LogOut className="w-5 h-5 flex-shrink-0" />
      {!collapsed && <span>Log out</span>}
    </button>
  )
}
