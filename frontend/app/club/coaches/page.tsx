"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Search,
  Plus,
  Filter,
  MoreVertical,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Star,
  Shield,
  Loader2,
  AlertCircle,
  UserCheck,
  UserX,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import clubCoachesService, { Coach } from "@/lib/services/clubCoachesService"
import { useToast } from "@/components/ui/use-toast"

export default function CoachesPage() {
  const [coaches, setCoaches] = useState<Coach[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const { toast } = useToast()

  useEffect(() => {
    fetchCoaches()
  }, [])

  async function fetchCoaches() {
    try {
      setLoading(true)
      setError(null)
      const data = await clubCoachesService.getCoaches()
      setCoaches(data)
    } catch (err) {
      console.error('Failed to fetch coaches:', err)
      setError('Failed to load coaches. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  async function handleStatusChange(coachId: string, newStatus: 'active' | 'inactive') {
    try {
      await clubCoachesService.updateCoachStatus(coachId, newStatus)
      setCoaches(coaches.map(coach => 
        coach.id === coachId ? { ...coach, status: newStatus } : coach
      ))
      toast({
        title: "Status Updated",
        description: `Coach status has been updated to ${newStatus}.`,
      })
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to update coach status.",
        variant: "destructive",
      })
    }
  }

  const filteredCoaches = coaches.filter(coach => {
    const matchesSearch = 
      coach.user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      coach.user.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      coach.user.email.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesStatus = statusFilter === "all" || coach.status === statusFilter

    return matchesSearch && matchesStatus
  })

  if (loading) {
    return (
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
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-4" />
          <p className="text-red-500 mb-4">{error}</p>
          <Button onClick={fetchCoaches}>Try Again</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Coaches</h1>
          <p className="text-muted-foreground">Manage your coaching staff</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Add Coach
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Search coaches..." 
            className="pl-9 glass-subtle border-white/20"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            className={`glass-subtle border-white/20 ${statusFilter === 'all' ? 'bg-white/10' : ''}`}
            onClick={() => setStatusFilter('all')}
          >
            All
          </Button>
          <Button 
            variant="outline" 
            className={`glass-subtle border-white/20 ${statusFilter === 'active' ? 'bg-white/10' : ''}`}
            onClick={() => setStatusFilter('active')}
          >
            Active
          </Button>
          <Button 
            variant="outline" 
            className={`glass-subtle border-white/20 ${statusFilter === 'inactive' ? 'bg-white/10' : ''}`}
            onClick={() => setStatusFilter('inactive')}
          >
            Inactive
          </Button>
        </div>
      </div>

      {/* Coaches Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCoaches.map((coach) => (
          <Card key={coach.id} className="glass-card border-white/20 hover-lift group">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <Avatar className="w-12 h-12 border-2 border-white/20">
                    <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${coach.user.email}`} />
                    <AvatarFallback>{coach.user.firstName[0]}{coach.user.lastName[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-lg">{coach.user.firstName} {coach.user.lastName}</h3>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs bg-blue-500/10 text-blue-500 border-blue-500/20">
                        {coach.specialization || 'General Coach'}
                      </Badge>
                      <Badge variant="outline" className={
                        coach.status === 'active' 
                          ? "text-green-500 border-green-500/30 bg-green-500/10" 
                          : "text-gray-500 border-gray-500/30 bg-gray-500/10"
                      }>
                        {coach.status}
                      </Badge>
                    </div>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48 glass-card border-white/20">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>View Profile</DropdownMenuItem>
                    <DropdownMenuItem>Edit Details</DropdownMenuItem>
                    <DropdownMenuItem>Assign Sessions</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    {coach.status === 'active' ? (
                      <DropdownMenuItem 
                        className="text-red-500 focus:text-red-500"
                        onClick={() => handleStatusChange(coach.id, 'inactive')}
                      >
                        <UserX className="w-4 h-4 mr-2" />
                        Deactivate
                      </DropdownMenuItem>
                    ) : (
                      <DropdownMenuItem 
                        className="text-green-500 focus:text-green-500"
                        onClick={() => handleStatusChange(coach.id, 'active')}
                      >
                        <UserCheck className="w-4 h-4 mr-2" />
                        Activate
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="space-y-3 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <span className="truncate">{coach.user.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  <span>{coach.user.phoneNumber || 'No phone number'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span>{coach.rating.toFixed(1)} Rating ({coach.totalSessions} sessions)</span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-white/10 flex justify-between items-center">
                <div className="text-xs text-muted-foreground">
                  Joined {new Date(coach.createdAt).toLocaleDateString()}
                </div>
                <Button variant="ghost" size="sm" className="hover:bg-white/10">
                  View Schedule
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
