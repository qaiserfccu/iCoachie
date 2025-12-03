"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Search,
  Filter,
  Building2,
  Users,
  MapPin,
  Star,
  MoreVertical,
  CheckCircle,
  XCircle,
  Eye,
  TrendingUp,
  Loader2,
  AlertTriangle,
  Edit,
  Ban,
  Trash2,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import adminService, { type AdminClub, type ClubStats } from "@/lib/services/adminService"
import { ClubDialog } from "@/components/admin/ClubDialog"
import { toast } from "sonner"

export default function ClubsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [clubs, setClubs] = useState<AdminClub[]>([])
  const [stats, setStats] = useState<ClubStats>({ total: 0, verified: 0, pending: 0, totalRevenue: '$0K' })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedClub, setSelectedClub] = useState<AdminClub | null>(null)

  useEffect(() => {
    fetchClubs()
  }, [searchQuery])

  async function fetchClubs() {
    setIsLoading(true)
    setError(null)
    try {
      const response = await adminService.getClubs({ search: searchQuery || undefined })
      setClubs(response.clubs)
      setStats(response.stats)
    } catch (err) {
      console.error('Error fetching clubs:', err)
      setError('Failed to load clubs. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateClub = () => {
    setSelectedClub(null)
    setDialogOpen(true)
  }

  const handleEditClub = (club: AdminClub) => {
    setSelectedClub(club)
    setDialogOpen(true)
  }

  const handleDeleteClub = async (clubId: number) => {
    if (!confirm('Are you sure you want to delete this club?')) return
    try {
      await adminService.deleteClub(clubId)
      toast.success('Club deleted successfully')
      fetchClubs()
    } catch (error) {
      console.error('Error deleting club:', error)
      toast.error('Failed to delete club')
    }
  }

  const handleSuspendClub = async (clubId: number) => {
    try {
      await adminService.suspendClub(clubId)
      toast.success('Club suspended successfully')
      fetchClubs()
    } catch (error) {
      console.error('Error suspending club:', error)
      toast.error('Failed to suspend club')
    }
  }

  const handleVerifyClub = async (clubId: number) => {
    try {
      await adminService.verifyClub(clubId)
      toast.success('Club verified successfully')
      fetchClubs()
    } catch (error) {
      console.error('Error verifying club:', error)
      toast.error('Failed to verify club')
    }
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertTriangle className="w-8 h-8 mx-auto mb-4 text-destructive" />
          <p className="text-destructive mb-4">{error}</p>
          <Button onClick={() => fetchClubs()}>Retry</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Clubs Management</h1>
          <p className="text-muted-foreground">Manage and monitor all registered clubs</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="glass-subtle border-white/20 bg-transparent">
            Export Data
          </Button>
          <Button className="gradient-primary text-white" onClick={handleCreateClub}>
            <Building2 className="w-4 h-4 mr-2" />
            Add Club
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="glass-card border-white/20">
              <CardContent className="p-4 flex items-center justify-center min-h-[80px]">
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
              </CardContent>
            </Card>
          ))
        ) : (
          [
            { label: "Total Clubs", value: stats.total.toString(), change: "+12" },
            { label: "Verified", value: stats.verified.toString(), change: "+8" },
            { label: "Pending", value: stats.pending.toString(), change: "+4" },
            { label: "Total Revenue", value: stats.totalRevenue, change: "+15%" },
          ].map((stat) => (
            <Card key={stat.label} className="glass-card border-white/20">
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <div className="flex items-end justify-between mt-1">
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <span className="text-green-500 text-sm flex items-center">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    {stat.change}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 flex items-center gap-2 glass-input rounded-xl px-4 py-2">
          <Search className="w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search clubs by name, location..."
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

      {/* Clubs Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : clubs.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          No clubs found
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {clubs.map((club) => (
            <Card key={club.id} className="glass-card border-white/20 hover-lift">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-14 w-14">
                      <AvatarImage src={`/.jpg?height=56&width=56&query=${club.name} logo`} />
                      <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white text-lg font-bold">
                        {club.logo}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-lg">{club.name}</h3>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <MapPin className="w-3 h-3 mr-1" />
                        {club.location}
                      </div>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="glass-card border-white/20">
                      <DropdownMenuItem>
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleEditClub(club)}>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit Club
                      </DropdownMenuItem>
                      {club.status === 'Verified' ? (
                        <DropdownMenuItem className="text-yellow-600" onClick={() => handleSuspendClub(club.id)}>
                          <Ban className="w-4 h-4 mr-2" />
                          Suspend Club
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem className="text-green-600" onClick={() => handleVerifyClub(club.id)}>
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Verify Club
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem className="text-destructive" onClick={() => handleDeleteClub(club.id)}>
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete Club
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <Badge
                    className={
                      club.status === "Verified" ? "bg-green-500/20 text-green-600" : "bg-yellow-500/20 text-yellow-600"
                    }
                  >
                    {club.status === "Verified" ? (
                      <CheckCircle className="w-3 h-3 mr-1" />
                    ) : (
                      <XCircle className="w-3 h-3 mr-1" />
                    )}
                    {club.status}
                  </Badge>
                  <Badge variant="outline" className="border-primary/50 text-primary">
                    {club.plan}
                  </Badge>
                </div>

                <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/20">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
                      <Users className="w-4 h-4" />
                    </div>
                    <p className="font-semibold">{club.members}</p>
                    <p className="text-xs text-muted-foreground">Members</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
                      <Star className="w-4 h-4" />
                    </div>
                    <p className="font-semibold">{club.rating || "N/A"}</p>
                    <p className="text-xs text-muted-foreground">Rating</p>
                  </div>
                  <div className="text-center">
                    <p className="font-semibold text-green-500">{club.revenue}</p>
                    <p className="text-xs text-muted-foreground">Revenue</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <ClubDialog 
        open={dialogOpen} 
        onOpenChange={setDialogOpen} 
        club={selectedClub} 
        onSuccess={fetchClubs} 
      />
    </div>
  )
}
