"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Eye, EyeOff, Mail, Lock, Users } from "lucide-react"
import { authService, mockUserCredentials, type MockUserCredentials } from "@/lib/services/api/auth"
import type { UserRole } from "@/lib/services/api/types"

// Role display names for dropdown
const roleOptions: { value: UserRole; label: string }[] = [
  { value: 'admin', label: 'Administrator' },
  { value: 'coach', label: 'Coach' },
  { value: 'head-coach', label: 'Head Coach' },
  { value: 'parent', label: 'Parent' },
  { value: 'guardian', label: 'Guardian' },
  { value: 'student', label: 'Student/Athlete' },
  { value: 'accountant', label: 'Accountant' },
  { value: 'front-desk', label: 'Front Desk' },
  { value: 'content-manager', label: 'Content Manager' },
  { value: 'medical', label: 'Medical Staff' },
  { value: 'facility', label: 'Facility Manager' },
  { value: 'system-support', label: 'System Support' },
  { value: 'bookings-coordinator', label: 'Bookings Coordinator' },
  { value: 'maintenance', label: 'Maintenance' },
  { value: 'equipment', label: 'Equipment Manager' },
  { value: 'security', label: 'Security' },
  { value: 'cleaning', label: 'Cleaning Staff' },
  { value: 'venue', label: 'Venue Manager' },
  { value: 'ground', label: 'Ground Staff' },
  { value: 'groundskeeper', label: 'Groundskeeper' },
  { value: 'academy-owner', label: 'Academy Owner' },
  { value: 'club', label: 'Club Admin' },
  { value: 'freelancer', label: 'Freelancer' },
]

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [selectedRole, setSelectedRole] = useState<UserRole | "">("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  // Handle role selection - auto-fill credentials
  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role)
    const credentials = mockUserCredentials[role]
    if (credentials) {
      setEmail(credentials.email)
      setPassword(credentials.password)
      setError("")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const { user } = await authService.login(email, password)
      // Redirect to the appropriate dashboard based on user role
      const dashboardPath = authService.getDashboardPath(user.role)
      router.push(dashboardPath)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex gradient-mesh relative overflow-hidden">
      <div className="orb orb-blue w-80 h-80 top-10 left-10 absolute" />
      <div className="orb orb-teal w-64 h-64 bottom-20 right-20 absolute" style={{ animationDelay: "3s" }} />
      <div className="orb orb-yellow w-48 h-48 top-1/2 left-1/3 absolute" style={{ animationDelay: "5s" }} />

      {/* Left side - Form */}
      <div className="flex-1 flex items-center justify-center p-8 relative z-10">
        <div className="w-full max-w-md space-y-8 glass-card p-8 rounded-3xl">
          <div className="text-center">
            <Link href="/" className="inline-flex items-center gap-2 mb-8">
              <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xl">i</span>
              </div>
              <span className="text-2xl font-bold text-foreground">iCoachie</span>
            </Link>
            <h1 className="text-3xl font-bold text-foreground">Welcome back</h1>
            <p className="text-muted-foreground mt-2">Sign in to continue to your dashboard</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Role selector for testing */}
            <div className="p-4 rounded-xl glass-subtle border border-primary/20 mb-4">
              <Label className="text-foreground flex items-center gap-2 mb-2">
                <Users className="w-4 h-4" />
                Quick Login (Testing)
              </Label>
              <Select value={selectedRole} onValueChange={(value) => handleRoleSelect(value as UserRole)}>
                <SelectTrigger className="h-12 glass-input border-white/30">
                  <SelectValue placeholder="Select a role to auto-fill credentials" />
                </SelectTrigger>
                <SelectContent className="max-h-[300px]">
                  {roleOptions.map((role) => (
                    <SelectItem key={role.value} value={role.value}>
                      {role.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground mt-2">
                Select a role to auto-fill email and password for testing
              </p>
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                {error}
              </div>
            )}

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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-12 glass-input border-white/30 focus:border-primary/50 focus:ring-primary/20"
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
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 h-12 glass-input border-white/30 focus:border-primary/50 focus:ring-primary/20"
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
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Checkbox id="remember" />
                <Label htmlFor="remember" className="text-sm text-muted-foreground cursor-pointer">
                  Remember me
                </Label>
              </div>
              <Link href="/forgot-password" className="text-sm text-primary hover:underline">
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 gradient-primary text-white hover:opacity-90 text-base font-semibold shadow-lg shadow-primary/25"
            >
              {isLoading ? "Signing In..." : "Sign In"}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/30" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 glass-subtle rounded-full text-muted-foreground">Or continue with</span>
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
            Don't have an account?{" "}
            <Link href="/register" className="text-primary font-semibold hover:underline">
              Sign up for free
            </Link>
          </p>
        </div>
      </div>

      <div className="hidden lg:flex flex-1 relative overflow-hidden">
        <div className="absolute inset-0 gradient-primary opacity-90" />
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
        <div className="orb w-48 h-48 bg-white/20 top-20 right-20 absolute" />
        <div className="orb w-32 h-32 bg-accent/30 bottom-32 left-16 absolute" style={{ animationDelay: "2s" }} />
        <div className="relative z-10 flex flex-col items-center justify-center p-12 text-white">
          <div className="max-w-md text-center space-y-6">
            <div className="w-24 h-24 mx-auto glass rounded-3xl flex items-center justify-center">
              <svg className="w-14 h-14" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-balance">Manage your coaching business effortlessly</h2>
            <p className="text-white/80 text-lg">
              Track schedules, monitor progress, handle payments, and grow your community - all in one powerful
              platform.
            </p>
            <div className="flex items-center justify-center gap-6 pt-8">
              <div className="text-center glass-subtle px-6 py-4 rounded-2xl">
                <p className="text-3xl font-bold">50K+</p>
                <p className="text-white/70 text-sm">Active Users</p>
              </div>
              <div className="text-center glass-subtle px-6 py-4 rounded-2xl">
                <p className="text-3xl font-bold">2K+</p>
                <p className="text-white/70 text-sm">Clubs</p>
              </div>
              <div className="text-center glass-subtle px-6 py-4 rounded-2xl">
                <p className="text-3xl font-bold">98%</p>
                <p className="text-white/70 text-sm">Satisfaction</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
