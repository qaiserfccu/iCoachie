"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, Filter, UserPlus, Star, Calendar, Users, MoreVertical, Mail, Phone, Loader2, AlertCircle } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { clubAdminService, type ClubCoach } from "@/lib/services"

export default function CoachesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [coaches, setCoaches] = useState<ClubCoach[]>([])

  useEffect(() => {
    loadCoaches()
  }, [])

  async function loadCoaches() {
    try {
      setLoading(true)
      setError(null)
      
      const response = await clubAdminService.getCoaches({ pageSize: 50 })
      setCoaches(response.data)
    } catch (err) {
      console.error('Error loading coaches:', err)
      setError('Failed to load coaches. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const filteredCoaches = coaches.filter(coach => {
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    return coach.name.toLowerCase().includes(query) || 
           coach.email.toLowerCase().includes(query) ||
           (coach.specialty?.toLowerCase().includes(query) ?? false)
  })

  const getInitials = (name: string): string => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
import coachService, { Coach } from "@/lib/services/coachService"

export default function CoachesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [coaches, setCoaches] = useState<Coach[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchCoaches() {
      try {
        setLoading(true)
        setError(null)
        const coachesData = await coachService.getCoaches()
        setCoaches(coachesData)
      } catch (err) {
        console.error('Failed to fetch coaches:', err)
        setError('Failed to load coaches. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    fetchCoaches()
  }, [])

  // Filter coaches based on search query
  const filteredCoaches = coaches.filter(coach =>
    coach.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (coach.specialty && coach.specialty.some(s => s.toLowerCase().includes(searchQuery.toLowerCase())))
  )

  // Get initials from name
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-muted-foreground">Loading coaches...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <AlertCircle className="w-12 h-12 text-red-500" />
        <p className="text-muted-foreground">{error}</p>
        <Button onClick={loadCoaches}>Try Again</Button>
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-4" />
          <p className="text-red-500 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Coaches</h1>
          <p className="text-muted-foreground">Manage your club&apos;s coaching staff</p>
        </div>
        <Link href="/club/coaches/add">
          <Button className="bg-gradient-to-r from-blue-500 to-teal-500 text-white">
            <UserPlus className="w-4 h-4 mr-2" />
            Add Coach
          </Button>
        </Link>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 flex items-center gap-2 glass-input rounded-xl px-4 py-2">
          <Search className="w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Search coaches..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border-0 bg-transparent focus-visible:ring-0 p-0 h-auto" 
          />
        </div>
        <Button variant="outline" className="glass-subtle border-white/20 bg-transparent">
          <Filter className="w-4 h-4 mr-2" />
          Filters
        </Button>
      </div>

      {/* Coaches Grid */}
      {filteredCoaches.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          {searchQuery ? 'No coaches found matching your search.' : 'No coaches found. Add your first coach!'}
          <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p className="text-lg font-medium">No coaches found</p>
          <p className="text-sm mt-1">
            {searchQuery ? 'Try adjusting your search query' : 'Add your first coach to get started'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCoaches.map((coach) => (
            <Card key={coach.id} className="glass-card border-white/20 hover-lift">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-14 w-14">
                      <AvatarImage src={`/.jpg?height=56&width=56&query=${coach.name} coach`} />
                      <AvatarImage src={coach.avatar || `/.jpg?height=56&width=56&query=${coach.name} coach`} />
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-teal-500 text-white text-lg font-bold">
                        {getInitials(coach.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-lg">{coach.name}</h3>
                      <p className="text-sm text-muted-foreground">{coach.specialty || 'General'} Coach</p>
                      <p className="text-sm text-muted-foreground">
                        {coach.specialty && coach.specialty.length > 0 ? coach.specialty.join(', ') : 'General'} Coach
                      </p>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="glass-card border-white/20">
                      <DropdownMenuItem>View Profile</DropdownMenuItem>
                      <DropdownMenuItem>Edit Details</DropdownMenuItem>
                      <DropdownMenuItem>View Schedule</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">Remove Coach</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="flex items-center gap-2 mb-4">
                  <Badge
                    className={
                      coach.status === "Active" ? "bg-green-500/20 text-green-600" : "bg-yellow-500/20 text-yellow-600"
                    }
                  >
                    {coach.status}
                  </Badge>
                  <div className="flex items-center gap-1 text-yellow-500">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="text-sm font-medium">{coach.rating.toFixed(1)}</span>
                    {coach.status || 'Active'}
                  </Badge>
                  <div className="flex items-center gap-1 text-yellow-500">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="text-sm font-medium">{coach.rating?.toFixed(1) || 'N/A'}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <span>{coach.studentCount} students</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span>{coach.sessionCount} sessions/week</span>
                    <span>{coach.students || 0} students</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span>{coach.sessions || 0} sessions/week</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/20 space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="w-4 h-4" />
                    <span className="truncate">{coach.email}</span>
                  </div>
                  {coach.phone && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Phone className="w-4 h-4" />
                      <span>{coach.phone}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
