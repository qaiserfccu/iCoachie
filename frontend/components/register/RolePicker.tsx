"use client"

import React, { useRef, useEffect, useState } from "react"
import { User, Shield, Building2, Users, UserCog, Briefcase, Baby, ClipboardList, Calendar, DollarSign, Wrench, CheckCircle, Thermometer, Droplets, Star, TrendingUp, Clipboard, AlertTriangle, ChevronLeft, ChevronRight } from "lucide-react"
import { mockUsers } from "@/lib/services/mockDataService"

export interface RoleOption {
  code: string
  label: string
  description?: string
  icon?: any
  sampleUserKey?: string
}

// All 22 roles mapped to a sample mockUsers key where available
export const ROLE_OPTIONS: RoleOption[] = [
  { code: "SUPER_ADMIN", label: "System Admin", description: "Platform-wide admin", icon: Shield, sampleUserKey: "admin" },
  { code: "SYSTEM_SUPPORT", label: "System Support", description: "Platform Support", icon: ClipboardList, sampleUserKey: "admin" },
  { code: "CLUB_ADMIN", label: "Club Admin", description: "Manage clubs and billing", icon: Building2, sampleUserKey: "clubAdmin" },
  { code: "CLUB_MANAGER", label: "Club Manager", description: "Operations manager", icon: Building2, sampleUserKey: "clubAdmin" },
  { code: "HEAD_COACH", label: "Head Coach", description: "Lead coach", icon: Users, sampleUserKey: "coach" },
  { code: "COACH", label: "Coach", description: "Manage sessions", icon: UserCog, sampleUserKey: "coach" },
  { code: "FREELANCER", label: "Freelancer", description: "Independent coach", icon: Briefcase, sampleUserKey: "freelancer" },
  { code: "PARENT", label: "Parent", description: "Parent & guardian", icon: Baby, sampleUserKey: "parent" },
  { code: "STUDENT", label: "Student", description: "Athlete account", icon: User, sampleUserKey: "student" },
  { code: "ACCOUNTANT", label: "Accountant", description: "Financial staff", icon: DollarSign, sampleUserKey: "accountant" },
  { code: "FRONT_DESK", label: "Front Desk", description: "Check-ins and enquiries", icon: Clipboard, sampleUserKey: "frontDesk" },
  { code: "BOOKINGS_COORDINATOR", label: "Bookings Coordinator", description: "Manage bookings", icon: Calendar, sampleUserKey: "bookingsCoordinator" },
  { code: "FACILITY_MANAGER", label: "Facility Manager", description: "Manage venues & grounds", icon: Building2, sampleUserKey: "clubAdmin" },
  { code: "VENUE_MANAGER", label: "Venue Manager", description: "Manage specific venue", icon: Building2, sampleUserKey: "clubAdmin" },
  { code: "GROUND_MANAGER", label: "Ground Manager", description: "Manage fields", icon: Droplets, sampleUserKey: "groundskeeper" },
  { code: "GROUNDSKEEPER", label: "Groundskeeper", description: "Maintain grounds", icon: Droplets, sampleUserKey: "groundskeeper" },
  { code: "MAINTENANCE_TECH", label: "Maintenance Tech", description: "Handle repairs", icon: Wrench, sampleUserKey: "maintenance" },
  { code: "EQUIPMENT_MANAGER", label: "Equipment Manager", description: "Manage sports gear", icon: ClipboardList, sampleUserKey: "clubAdmin" },
  { code: "SECURITY_STAFF", label: "Security", description: "Facility security staff", icon: Shield, sampleUserKey: "security" },
  { code: "CLEANING_STAFF", label: "Cleaning staff", description: "Cleaning & housekeeping", icon: CheckCircle, sampleUserKey: "clubAdmin" },
  { code: "CONTENT_MANAGER", label: "Content Manager", description: "Manage content", icon: ClipboardList, sampleUserKey: "contentManager" },
  { code: "MEDICAL_STAFF", label: "Medical Staff", description: "Health & medical support", icon: Thermometer, sampleUserKey: "medical" },
]

export function RolePicker({ value, onChange, devOnly = true, carousel = true, disableWheelOnClick = false, navigationOnly = false, centerOnSelect = true, theme = "green" }: { value?: string; onChange: (code: string) => void; devOnly?: boolean; carousel?: boolean; disableWheelOnClick?: boolean; navigationOnly?: boolean; centerOnSelect?: boolean; theme?: "green" | "blue" }) {
  const isDev = process.env.NODE_ENV === "development"
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [isAuto, setIsAuto] = useState(true)
  const [wheelDisabled, setWheelDisabled] = useState(false)
  const [localValue, setLocalValue] = useState<string | undefined>(value)
  const themeStyles = {
    green: {
      base: "glass-card bg-gradient-to-br from-emerald-400/30 via-emerald-500/20 to-emerald-600/30 border border-blue-400/40 backdrop-blur-2xl shadow-lg shadow-blue-500/10",
      idle: "hover:border-blue-400/60 hover:bg-emerald-400/30",
      selected: "scale-105 ring-2 ring-blue-400 shadow-xl shadow-blue-500/20 border-2 border-blue-400/80 bg-gradient-to-br from-emerald-400/50 via-emerald-500/30 to-emerald-600/50 backdrop-blur-3xl",
      icon: "text-blue-300",
    },
    blue: {
      base: "glass-card bg-gradient-to-br from-sky-400/30 via-sky-500/20 to-sky-600/30 border border-emerald-400/40 backdrop-blur-2xl shadow-lg shadow-emerald-500/10",
      idle: "hover:border-emerald-400/60 hover:bg-sky-400/30",
      selected: "scale-105 ring-2 ring-emerald-400 shadow-xl shadow-emerald-500/20 border-2 border-emerald-400/80 bg-gradient-to-br from-sky-400/50 via-sky-500/30 to-sky-600/50 backdrop-blur-3xl",
      icon: "text-emerald-300",
    },
  } as const

  const baseBgClass = themeStyles[theme].base
  const idleClass = themeStyles[theme].idle
  const selectedClass = themeStyles[theme].selected
  const selectedIconColor = themeStyles[theme].icon

  // If dev-only and not in dev, render a minimal compact picker (empty)
  if (devOnly && !isDev) {
    return null
  }

  useEffect(() => {
    // Always auto-fill value with first role if not set
    if (!value && ROLE_OPTIONS.length > 0) {
      onChange(ROLE_OPTIONS[0].code)
    }
    setLocalValue(value || ROLE_OPTIONS[0]?.code)
  }, [value, onChange])

  // Keep local mirror of value for navigation and centering
  useEffect(() => {
    setLocalValue(value)
  }, [value])

  // If navigationOnly is enabled, default to disabling wheel
  useEffect(() => {
    if (navigationOnly) {
      setWheelDisabled(true)
      setIsAuto(false)
    }
  }, [navigationOnly])

  useEffect(() => {
    if (!carousel || !containerRef.current || !isDev) return
    const el = containerRef.current
    let rafId: number
    let lastTime = performance.now()
    const speed = 0.06 // pixels per ms

    function tick(now: number) {
      const dt = now - lastTime
      lastTime = now
      if (isAuto) {
        el.scrollLeft += dt * speed
        // Loop
        if (el.scrollLeft >= el.scrollWidth - el.clientWidth - 1) {
          el.scrollLeft = 0
        }
      }
      rafId = requestAnimationFrame(tick)
    }

    rafId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafId)
  }, [carousel, isAuto, isDev])

  // Center selected card when value changes
  useEffect(() => {
    if (!centerOnSelect || !containerRef.current) return
    const parent = containerRef.current
    const activeKey = localValue || ROLE_OPTIONS[0]?.code
    const targetEl = activeKey
      ? (parent.querySelector(`[data-role="${activeKey}"]`) as HTMLElement | null)
      : (parent.querySelector("button[data-role]") as HTMLElement | null)
    if (!targetEl) return

    // Use scrollIntoView for perfect centering
    targetEl.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" })

    setIsAuto(false)
    if (disableWheelOnClick || navigationOnly) setWheelDisabled(true)
  }, [localValue, centerOnSelect, disableWheelOnClick, navigationOnly])

  // Manual scroll helper
  function scrollBy(delta: number) {
    const el = containerRef.current
    if (!el) return
    el.scrollBy({ left: delta, behavior: "smooth" })
    // pause auto while user scrolls
    setIsAuto(false)
    if (!navigationOnly) {
      setTimeout(() => setIsAuto(true), 2000)
    }
  }

  // Navigate by delta (index) using data-role buttons
  function navigateBy(delta: number) {
    const parent = containerRef.current
    if (!parent) return
    const items = Array.from(parent.querySelectorAll("button[data-role]")) as HTMLElement[]
    if (!items.length) return
    const currentIndex = items.findIndex((it) => it.dataset.role === localValue)
    let nextIndex = 0
    if (currentIndex === -1) {
      nextIndex = delta > 0 ? 0 : items.length - 1
    } else {
      nextIndex = (currentIndex + delta + items.length) % items.length
    }
    const next = items[nextIndex]
    if (!next) return
    const roleCode = next.dataset.role
    if (roleCode) {
      setLocalValue(roleCode)
      onChange(roleCode)
    }
  }

  // Wheel handler to optionally prevent default wheel scrolling when wheelDisabled
  useEffect(() => {
    if (!carousel || !containerRef.current) return
    const el = containerRef.current
    function onWheel(e: WheelEvent) {
      if (wheelDisabled) {
        // Prevent all wheel-driven scrolls (mouse wheel and trackpad)
        e.preventDefault()
        e.stopPropagation()
      }
    }
    // Must set passive: false to allow preventDefault
    el.addEventListener("wheel", onWheel as EventListener, { passive: false })
    return () => {
      el.removeEventListener("wheel", onWheel as EventListener)
    }
  }, [carousel, wheelDisabled])

  return (
    <div className="relative">
      {carousel ? (
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigateBy(-1)}
            aria-label="Previous roles"
            className="p-2 rounded-lg bg-white/6 hover:bg-white/10 text-muted-foreground focus:outline-none"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div
            ref={containerRef}
            className={`w-full ${navigationOnly ? "overflow-hidden" : "overflow-x-auto"} flex gap-3 py-2 scroll-smooth snap-x snap-mandatory no-scrollbar px-1`}
            style={{ direction: "ltr" }}
          >
            {ROLE_OPTIONS.map((r) => {
              const Icon = r.icon ?? User
              const selected = (localValue || value) === r.code
              return (
                <button
                  type="button"
                  key={r.code}
                  onClick={() => {
                    setLocalValue(r.code)
                    onChange(r.code)
                    setIsAuto(false)
                    if (disableWheelOnClick) setWheelDisabled(true)
                  }}
                  aria-pressed={selected}
                  data-role={r.code}
                  aria-label={`Select role ${r.label}`}
                  className={`snap-center flex-shrink-0 w-60 flex flex-col items-start gap-1 p-4 rounded-xl transition-transform transform ease-out duration-200 focus:outline-none ${
                    selected
                      ? `${selectedClass} glass-card bg-gradient-to-br from-transparent via-${theme}-400/60 to-${theme}-600/60 border-2 border-${theme === "green" ? "blue" : "emerald"}-400/80 backdrop-blur-3xl`
                      : `bg-white ${idleClass} ${baseBgClass}`
                  }`}
                >
                  <Icon className={`w-6 h-6 mb-1 ${selected ? selectedIconColor : "text-muted-foreground"}`} />
                  <div className="text-sm font-semibold text-foreground">{r.label}</div>
                  <div className="text-xs text-muted-foreground">{r.description}</div>
                </button>
              )
            })}
          </div>
          <button
            type="button"
            onClick={() => navigateBy(1)}
            aria-label="Next roles"
            className="p-2 rounded-lg bg-white/6 hover:bg-white/10 text-muted-foreground focus:outline-none"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {ROLE_OPTIONS.map((r) => {
            const Icon = r.icon ?? User
            const selected = value === r.code
            return (
                <button
                type="button"
                key={r.code}
                onClick={() => onChange(r.code)}
                className={`flex flex-col items-start gap-1 p-3 rounded-lg text-left transition-all duration-200 ease-out transform hover:scale-105 focus:outline-none ${
                  selected ? `${baseBgClass} ${selectedClass}` : `${baseBgClass} ${idleClass}`
                }`}
                aria-pressed={selected}
                aria-label={`Select role ${r.label}`}
              >
                <Icon className={`w-6 h-6 mb-1 ${selected ? selectedIconColor : "text-muted-foreground"}`} />
                <div className="text-sm font-semibold text-foreground">{r.label}</div>
                <div className="text-xs text-muted-foreground">{r.description}</div>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default RolePicker
