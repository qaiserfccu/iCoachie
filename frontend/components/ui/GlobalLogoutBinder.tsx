"use client"

import React, { useEffect } from "react"
import { useRouter } from "next/navigation"
import { authService } from "@/lib/auth"

export default function GlobalLogoutBinder() {
  const logout = async () => {
    try {
      await authService.logout()
    } catch (_) {}
  }
  const router = useRouter()

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      const target = e.target as HTMLElement
      if (!target) return
      // Walk up to find button
      const btn = target.closest("button") as HTMLButtonElement | null
      if (!btn) return
      // Find exact text match 'Log out' inside button
      if (btn.innerText && btn.innerText.trim().toLowerCase() === "log out") {
        e.preventDefault()
        ;(async () => {
          try {
            await logout()
          } catch (_) {
            // ignore
          } finally {
            router.push('/login')
          }
        })()
      }
    }

    document.addEventListener("click", handleClick)
    return () => document.removeEventListener("click", handleClick)
  }, [logout, router])

  return null
}
