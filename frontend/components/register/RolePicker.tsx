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

export function RolePicker({ value, onChange, devOnly = true, carousel = true }: { value?: string; onChange: (code: string) => void; devOnly?: boolean; carousel?: boolean }) {
  const isDev = process.env.NODE_ENV === "development"
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [isAuto, setIsAuto] = useState(true)

  // If dev-only and not in dev, render a minimal compact picker (empty)
  if (devOnly && !isDev) {
    return null
  }

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

  // Manual scroll helper
  function scrollBy(delta: number) {
    const el = containerRef.current
    if (!el) return
    el.scrollBy({ left: delta, behavior: "smooth" })
    // pause auto while user scrolls
    setIsAuto(false)
    setTimeout(() => setIsAuto(true), 2000)
  }

  return (
    <div className="relative">
      {carousel ? (
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => scrollBy(-180)}
            aria-label="Previous roles"
            className="p-2 rounded-lg bg-white/6 hover:bg-white/10 text-muted-foreground focus:outline-none"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div
            ref={containerRef}
            className="w-full overflow-x-auto flex gap-3 py-2 scroll-smooth snap-x snap-mandatory no-scrollbar px-1"
            style={{ direction: "ltr" }}
          >
            {ROLE_OPTIONS.map((r) => {
              const Icon = r.icon ?? User
              const selected = value === r.code
              return (
                <button
                  type="button"
                  key={r.code}
                  onClick={() => onChange(r.code)}
                  aria-pressed={selected}
                  aria-label={`Select role ${r.label}`}
                  className={`snap-start flex-shrink-0 w-60 flex flex-col items-start gap-1 p-4 rounded-xl transition-transform transform ease-out duration-200 focus:outline-none ${
                    selected
                      ? "scale-105 ring-2 ring-emerald-400/40 shadow-lg"
                      : "hover:scale-105"
                  } bg-emerald-900/8 border border-emerald-300/10 backdrop-blur-md`}
                >
                  <Icon className={`w-6 h-6 mb-1 ${selected ? "text-emerald-500" : "text-muted-foreground"}`} />
                  <div className="text-sm font-semibold text-foreground">{r.label}</div>
                  <div className="text-xs text-muted-foreground">{r.description}</div>
                </button>
              )
            })}
          </div>
          <button
            type="button"
            onClick={() => scrollBy(180)}
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
                  selected ? "bg-primary/6 ring-2 ring-primary/40 shadow-lg scale-105" : "bg-white/6 hover:bg-white/10"
                }`}
                aria-pressed={selected}
                aria-label={`Select role ${r.label}`}
              >
                <Icon className={`w-6 h-6 mb-1 ${selected ? "text-primary" : "text-muted-foreground"}`} />
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
