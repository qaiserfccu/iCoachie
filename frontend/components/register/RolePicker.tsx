"use client"

import React from "react"
import { User, Shield, Building2, Users, UserCog, Briefcase, Baby, ClipboardList, Calendar, DollarSign, Wrench, CheckCircle, Thermometer, Droplets, Star, TrendingUp, Clipboard, AlertTriangle } from "lucide-react"
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

export function RolePicker({ value, onChange, devOnly = true }: { value?: string; onChange: (code: string) => void; devOnly?: boolean }) {
  const isDev = process.env.NODE_ENV === "development"

  // If dev-only and not in dev, render a minimal compact picker (empty)
  if (devOnly && !isDev) {
    return null
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
      {ROLE_OPTIONS.map((r) => {
        const Icon = r.icon ?? User
        const selected = value === r.code
        return (
          <button
            type="button"
            key={r.code}
            onClick={() => onChange(r.code)}
            className={`flex flex-col items-start gap-1 p-3 rounded-lg text-left transition-all duration-200 ease-out transform hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50
            ${selected ? "bg-primary/6 ring-2 ring-primary/40 shadow-lg scale-105" : "bg-white/6 hover:bg-white/10"}`}
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
  )
}

export default RolePicker
