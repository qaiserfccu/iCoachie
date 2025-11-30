"use client"

import { useAuth } from '@/lib/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect, ReactNode } from 'react'
import { LoadingSpinner } from '@/lib/contexts/LoadingContext'

interface ProtectedRouteProps {
  children: ReactNode
  requiredRole?: 'admin' | 'coach' | 'student'
  redirectTo?: string
}

export function ProtectedRoute({
  children,
  requiredRole,
  redirectTo = '/login'
}: ProtectedRouteProps) {
  const { isAuthenticated, user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push(redirectTo)
        return
      }

      if (requiredRole && user?.role !== requiredRole) {
        // Redirect to appropriate dashboard based on role
        const roleRoutes = {
          admin: '/admin',
          coach: '/coach',
          student: '/dashboard'
        }
        router.push(roleRoutes[user.role] || '/dashboard')
        return
      }
    }
  }, [isAuthenticated, user, requiredRole, isLoading, router, redirectTo])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  if (!isAuthenticated) {
    return null // Will redirect
  }

  if (requiredRole && user?.role !== requiredRole) {
    return null // Will redirect
  }

  return <>{children}</>
}