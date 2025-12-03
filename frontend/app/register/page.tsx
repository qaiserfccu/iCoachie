"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Eye, EyeOff, Mail, Lock, User, Building2, Users, Briefcase, Baby } from "lucide-react"
import RolePicker, { ROLE_OPTIONS } from "@/components/register/RolePicker"
import { getMockUser } from "@/lib/services/mockDataService"
import { authService } from "@/lib/auth"

const userTypes = [
  { id: "CLUB_ADMIN", label: "Club", icon: Building2, description: "Sports club or organization" },
  { id: "COACH", label: "Coach", icon: Users, description: "Professional coach" },
  { id: "FREELANCER", label: "Freelancer", icon: Briefcase, description: "Independent trainer" },
  { id: "PARENT", label: "Parent/Kid", icon: Baby, description: "Parent or young athlete" },
]

// Helper to get dashboard path based on role code
function getDashboardPath(roleCode: string): string {
  const rolePathMap: Record<string, string> = {
    'SUPER_ADMIN': '/admin',
    'SYSTEM_SUPPORT': '/system-support',
    'CLUB_ADMIN': '/club',
    'CLUB_MANAGER': '/club',
    'HEAD_COACH': '/head-coach',
    'COACH': '/coach',
    'FREELANCER': '/freelancer',
    'PARENT': '/parent',
    'FACILITY_MANAGER': '/facility',
    'BOOKINGS_COORDINATOR': '/bookings-coordinator',
    'VENUE_MANAGER': '/venue',
    'GROUND_MANAGER': '/ground',
    'GROUNDSKEEPER': '/groundskeeper',
    'MAINTENANCE_TECH': '/maintenance',
    'EQUIPMENT_MANAGER': '/equipment',
    'SECURITY_STAFF': '/security',
    'CLEANING_STAFF': '/cleaning',
    'ACCOUNTANT': '/accountant',
    'FRONT_DESK': '/front-desk',
    'CONTENT_MANAGER': '/content-manager',
    'MEDICAL_STAFF': '/medical',
    'STUDENT': '/student',
  }
  return rolePathMap[roleCode] || '/dashboard'
}

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [selectedType, setSelectedType] = useState("")
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  })
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    if (!selectedType) {
      setError("Please select an account type")
      setIsLoading(false)
      return
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters")
      setIsLoading(false)
      return
    }

    if (!termsAccepted) {
      setError("You must agree to the Terms of Service and Privacy Policy")
      setIsLoading(false)
      return
    }

    // Split full name into first and last name
    const nameParts = formData.fullName.trim().split(' ')
    const firstName = nameParts[0] || ''
    const lastName = nameParts.slice(1).join(' ') || ''

    try {
      const { user } = await authService.register({
        email: formData.email,
        password: formData.password,
        firstName,
        lastName,
        role: selectedType,
      })
      // Redirect to the appropriate dashboard based on user role
      const dashboardPath = getDashboardPath(user.role.code)
      router.push(dashboardPath)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  // Auto-populate fields when role selected in dev mode
  const isDev = process.env.NODE_ENV === "development"
  function autoPopulateRole(roleCode: string | undefined) {
    if (!isDev || !roleCode) return
    // Find ROLE_OPTIONS match for sampleUserKey
    const option = ROLE_OPTIONS.find((o) => o.code === roleCode)
    const sampleKey = option?.sampleUserKey
    if (!sampleKey) return
    try {
      const sample = getMockUser(sampleKey)
      if (sample) {
        if (isDev) console.log('Auto populate register from', sampleKey, sample.email)
        setFormData({ fullName: sample.name || "", email: sample.email || "", password: "Password123!" })
        setTermsAccepted(true)
      }
    } catch (err) {
      // noop
    }
  }

  return (
    <div className="min-h-screen flex gradient-mesh relative overflow-hidden">
      <div className="orb orb-teal w-80 h-80 top-20 left-20 absolute" />
      <div className="orb orb-green w-64 h-64 bottom-10 right-10 absolute" style={{ animationDelay: "2s" }} />
      <div className="orb orb-yellow w-48 h-48 top-1/3 right-1/4 absolute" style={{ animationDelay: "4s" }} />

      <div className="hidden lg:flex flex-1 relative overflow-hidden">
        <div className="absolute inset-0 gradient-secondary opacity-90" />
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
        <div className="orb w-40 h-40 bg-white/20 top-32 left-20 absolute" />
        <div className="orb w-32 h-32 bg-accent/30 bottom-20 right-16 absolute" style={{ animationDelay: "3s" }} />
        <div className="relative z-10 flex flex-col items-center justify-center p-12 text-white">
          <div className="max-w-md text-center space-y-6">
            <div className="w-24 h-24 mx-auto glass rounded-3xl flex items-center justify-center">
              <svg className="w-14 h-14" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-balance">Join thousands of coaches and clubs</h2>
            <p className="text-white/80 text-lg">
              Start managing your coaching business today with powerful tools designed for growth.
            </p>
            <div className="grid grid-cols-2 gap-4 pt-8">
              <div className="glass rounded-xl p-4">
                <p className="text-2xl font-bold">Free</p>
                <p className="text-white/70 text-sm">14-day trial</p>
              </div>
              <div className="glass rounded-xl p-4">
                <p className="text-2xl font-bold">5 min</p>
                <p className="text-white/70 text-sm">Setup time</p>
              </div>
              <div className="glass rounded-xl p-4">
                <p className="text-2xl font-bold">24/7</p>
                <p className="text-white/70 text-sm">Support</p>
              </div>
              <div className="glass rounded-xl p-4">
                <p className="text-2xl font-bold">100+</p>
                <p className="text-white/70 text-sm">Features</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex-1 flex items-center justify-center p-8 overflow-y-auto relative z-10">
        <div className="w-full max-w-md space-y-6 glass-card p-8 rounded-3xl">
          <div className="text-center">
            <Link href="/" className="inline-flex items-center gap-2 mb-6">
              <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xl">i</span>
              </div>
              <span className="text-2xl font-bold text-foreground">iCoachie</span>
            </Link>
            <h1 className="text-3xl font-bold text-foreground">Create your account</h1>
            <p className="text-muted-foreground mt-2">Start your free 14-day trial today</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm" data-testid="error-message">
                {error}
              </div>
            )}

            {/* User Type Selection */}
            <div className="space-y-3">
              <Label className="text-foreground">I am a</Label>
              <div className="space-y-2">
                {/* In dev mode show the full animated role grid; otherwise fall back to a compact list */}
                {isDev ? (
                  <RolePicker
                    value={selectedType}
                    onChange={(roleCode) => {
                      setSelectedType(roleCode)
                      autoPopulateRole(roleCode)
                    }}
                    carousel={true}
                    navigationOnly={true}
                    disableWheelOnClick={true}
                    centerOnSelect={true}
                    theme="green"
                  />
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    {userTypes.map((type) => (
                      <button
                        key={type.id}
                        type="button"
                        onClick={() => setSelectedType(type.id)}
                        className={`p-4 rounded-xl text-left transition-all hover-lift ${
                          selectedType === type.id
                            ? "glass-card border-2 border-primary/50 shadow-lg shadow-primary/10"
                            : "glass-subtle border border-white/30 hover:border-primary/30"
                        }`}
                      >
                        <type.icon
                          className={`w-6 h-6 mb-2 ${selectedType === type.id ? "text-primary" : "text-muted-foreground"}`}
                        />
                        <p className="font-semibold text-foreground">{type.label}</p>
                        <p className="text-xs text-muted-foreground">{type.description}</p>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-foreground">
                Full name
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="fullName"
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="pl-10 h-12 glass-input border-white/30 focus:border-primary/50"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground">
                Email address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="pl-10 h-12 glass-input border-white/30 focus:border-primary/50"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="pl-10 pr-10 h-12 glass-input border-white/30 focus:border-primary/50"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              <p className="text-xs text-muted-foreground">Must be at least 8 characters</p>
            </div>

            <div className="flex items-start gap-2">
              <Checkbox id="terms" className="mt-1" checked={termsAccepted} onCheckedChange={(c) => setTermsAccepted(Boolean(c))} required />
              <Label htmlFor="terms" className="text-sm text-muted-foreground cursor-pointer leading-relaxed">
                I agree to the{" "}
                <Link href="/terms" className="text-primary hover:underline">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="text-primary hover:underline">
                  Privacy Policy
                </Link>
              </Label>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 gradient-primary text-white hover:opacity-90 text-base font-semibold shadow-lg shadow-primary/25"
            >
              {isLoading ? "Creating Account..." : "Create Account"}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/30" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 glass-subtle rounded-full text-muted-foreground">Or sign up with</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button variant="outline" className="h-12 glass-input border-white/30 hover:bg-white/30 bg-transparent">
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Google
            </Button>
            <Button variant="outline" className="h-12 glass-input border-white/30 hover:bg-white/30 bg-transparent">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701" />
              </svg>
              Apple
            </Button>
          </div>

          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="text-primary font-semibold hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
