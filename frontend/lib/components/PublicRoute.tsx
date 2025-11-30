import { useAuth } from '@/lib/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect, ReactNode } from 'react'
import { LoadingSpinner } from '@/lib/contexts/LoadingContext'

interface PublicRouteProps {
  children: ReactNode
  redirectTo?: string
}

export function PublicRoute({ children, redirectTo }: PublicRouteProps) {
  const { isAuthenticated, user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && isAuthenticated && user) {
      // Redirect authenticated users to their appropriate dashboard
      const roleRoutes = {
        admin: '/admin',
        coach: '/coach',
        student: '/dashboard'
      }
      const targetRoute = redirectTo || roleRoutes[user.role] || '/dashboard'
      router.push(targetRoute)
    }
  }, [isAuthenticated, user, isLoading, router, redirectTo])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  if (isAuthenticated) {
    return null // Will redirect
  }

  return <>{children}</>
}