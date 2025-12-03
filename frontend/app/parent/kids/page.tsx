/**
 * My Kids Page
 * 
 * Backend Integration:
 * - Children data: GET /api/students (backend/src/controllers/studentController.ts)
 * - Evaluation stats: GET /api/evaluations/student/:id/stats (backend/src/controllers/evaluationController.ts)
 */
"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Plus, Calendar, Trophy, Star, MessageSquare, GraduationCap, Loader2, AlertCircle, Users } from "lucide-react"
import { parentService, type ParentChild } from "@/lib/services/parentService"

// Helper function to get initials from name
function getInitials(name: string): string {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export default function KidsPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [children, setChildren] = useState<ParentChild[]>([])

  // Fetch children data from backend
  useEffect(() => {
    const loadChildren = async () => {
      setIsLoading(true)
      setError(null)
      
      try {
        // Backend source: GET /api/students (backend/src/controllers/studentController.ts)
        const response = await parentService.getChildren()
        setChildren(response.data || [])
      } catch (err) {
        console.error('Error loading children:', err)
        setError('Unable to load children data. Please try again later.')
      } finally {
        setIsLoading(false)
      }
    }

    loadChildren()
  }, [])

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">My Kids</h1>
            <p className="text-muted-foreground">Manage your children&apos;s profiles and enrollments</p>
          </div>
        </div>
        <div className="flex items-center justify-center min-h-[300px]">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-pink-500 mb-4" />
            <p className="text-muted-foreground">Loading children...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">My Kids</h1>
            <p className="text-muted-foreground">Manage your children&apos;s profiles and enrollments</p>
          </div>
        </div>
        <div className="flex items-center justify-center min-h-[300px]">
          <div className="text-center">
            <AlertCircle className="w-8 h-8 mx-auto text-red-500 mb-4" />
            <p className="text-red-500">{error}</p>
            <Button 
              className="mt-4" 
              onClick={() => window.location.reload()}
            >
              Retry
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">My Kids</h1>
          <p className="text-muted-foreground">Manage your children&apos;s profiles and enrollments</p>
        </div>
        <Link href="/parent/kids/add">
          <Button className="bg-gradient-to-r from-pink-500 to-rose-500 text-white">
            <Plus className="w-4 h-4 mr-2" />
            Add Child
          </Button>
        </Link>
      </div>

      {children.length === 0 ? (
        <Card className="glass-card border-white/20">
          <CardContent className="p-12 text-center">
            <Users className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="font-semibold text-xl mb-2">No Children Added Yet</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Add your children to start tracking their progress, book sessions, and communicate with coaches.
            </p>
            <Link href="/parent/kids/add">
              <Button className="bg-gradient-to-r from-pink-500 to-rose-500 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Child
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {children.map((child) => (
            <Card key={child.id} className="glass-card border-white/20 hover-lift">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                  {/* Profile Section */}
                  <div className="flex items-start gap-4 lg:w-1/3">
                    <Avatar className="h-20 w-20">
                      <AvatarImage src={child.user?.profile?.avatarUrl} />
                      <AvatarFallback className="bg-gradient-to-br from-pink-500 to-rose-500 text-white text-2xl">
                        {getInitials(child.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-xl">{child.name}</h3>
                      <p className="text-muted-foreground">
                        {child.age ? `${child.age} years old` : 'Age not set'}
                      </p>
                      <Badge className="mt-2 bg-green-500/20 text-green-600">Active</Badge>
                    </div>
                  </div>

                  {/* Info Section */}
                  <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-4 rounded-xl glass-subtle">
                      <p className="text-xs text-muted-foreground mb-1">Sport</p>
                      <p className="font-medium">{child.sport || 'Not set'}</p>
                      <p className="text-xs text-muted-foreground mt-1">{child.level || 'Beginner'}</p>
                    </div>
                    <div className="p-4 rounded-xl glass-subtle">
                      <p className="text-xs text-muted-foreground mb-1">Coach</p>
                      <p className="font-medium">
                        {child.coach?.name || child.coach?.profile?.displayName || 'Not assigned'}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Since {new Date(child.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                      </p>
                    </div>
                    <div className="p-4 rounded-xl glass-subtle">
                      <p className="text-xs text-muted-foreground mb-1">Sessions</p>
                      <p className="font-medium">{child.attendanceCount || 0} attended</p>
                      <p className="text-xs text-pink-500 mt-1">{child.enrollmentCount || 0} enrolled</p>
                    </div>
                    <div className="p-4 rounded-xl glass-subtle">
                      <p className="text-xs text-muted-foreground mb-1">Evaluations</p>
                      <div className="flex items-center gap-1">
                        <Trophy className="w-4 h-4 text-yellow-500" />
                        <span className="font-medium">{child.evaluationCount || 0} Total</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Progress Section */}
                <div className="mt-6 pt-6 border-t border-white/20">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium">Overall Progress</span>
                    <span className="text-sm font-bold text-pink-500">
                      {Math.min((child.attendanceCount || 0) * 5, 100)}%
                    </span>
                  </div>
                  <Progress value={Math.min((child.attendanceCount || 0) * 5, 100)} className="h-3" />

                  <div className="mt-4">
                    <p className="text-xs text-muted-foreground mb-2">Skills & Level</p>
                    <div className="flex flex-wrap gap-2">
                      {child.sport && (
                        <Badge variant="outline" className="border-pink-500/50 text-pink-500">
                          {child.sport}
                        </Badge>
                      )}
                      {child.level && (
                        <Badge variant="outline" className="border-blue-500/50 text-blue-500">
                          {child.level}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap items-center gap-3 mt-6 pt-6 border-t border-white/20">
                  <Link href="/parent/bookings/new">
                    <Button size="sm" className="bg-gradient-to-r from-pink-500 to-rose-500 text-white">
                      <Calendar className="w-4 h-4 mr-1" />
                      Book Session
                    </Button>
                  </Link>
                  <Link href="/parent/progress">
                    <Button size="sm" variant="outline" className="glass-subtle border-white/20 bg-transparent">
                      <GraduationCap className="w-4 h-4 mr-1" />
                      View Progress
                    </Button>
                  </Link>
                  <Link href="/parent/messages">
                    <Button size="sm" variant="outline" className="glass-subtle border-white/20 bg-transparent">
                      <MessageSquare className="w-4 h-4 mr-1" />
                      Message Coach
                    </Button>
                  </Link>
                  <Link href="/parent/achievements">
                    <Button size="sm" variant="outline" className="glass-subtle border-white/20 bg-transparent">
                      <Star className="w-4 h-4 mr-1" />
                      Achievements
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
