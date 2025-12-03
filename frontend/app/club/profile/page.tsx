"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import {
  Building2,
  Users,
  Calendar,
  MapPin,
  Mail,
  Phone,
  Clock,
  Star,
  Trophy,
  Award,
  Edit,
  Share2,
  Loader2,
  AlertCircle,
  UserCog,
  DollarSign,
} from "lucide-react"
import { clubAdminService, type ClubInfo, type ClubDashboardStats, type ClubCoach } from "@/lib/services"

export default function ClubProfilePage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [clubInfo, setClubInfo] = useState<ClubInfo | null>(null)
  const [stats, setStats] = useState<ClubDashboardStats | null>(null)
  const [coaches, setCoaches] = useState<ClubCoach[]>([])

  useEffect(() => {
    loadProfileData()
  }, [])

  async function loadProfileData() {
    try {
      setLoading(true)
      setError(null)
      
      const [infoData, statsData, coachesData] = await Promise.all([
        clubAdminService.getMyClub(),
        clubAdminService.getDashboardStats(),
        clubAdminService.getCoaches({ pageSize: 5 })
      ])
      
      setClubInfo(infoData)
      setStats(statsData)
      setCoaches(coachesData.data)
    } catch (err) {
      console.error('Error loading profile data:', err)
      setError('Failed to load club profile. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const getInitials = (name: string): string => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  }

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <AlertCircle className="w-12 h-12 text-red-500" />
        <p className="text-muted-foreground">{error}</p>
        <Button onClick={loadProfileData}>Try Again</Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card className="glass-card border-white/20 overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-blue-500 to-teal-500" />
        <CardContent className="relative pt-0 pb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 -mt-12">
            <Avatar className="h-24 w-24 border-4 border-background shadow-xl">
              <AvatarImage src={clubInfo?.logoUrl || undefined} />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-teal-500 text-white text-2xl font-bold">
                {getInitials(clubInfo?.name || 'MC')}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-foreground">{clubInfo?.name}</h1>
              <div className="flex flex-wrap items-center gap-4 mt-2 text-muted-foreground">
                {clubInfo?.location && (
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">{clubInfo.location}</span>
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">Since {formatDate(clubInfo?.createdAt || '')}</span>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="glass-subtle border-white/20 bg-transparent">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
              <Button className="bg-gradient-to-r from-blue-500 to-teal-500 text-white">
                <Edit className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
            </div>
          </div>
          
          {clubInfo?.description && (
            <p className="mt-4 text-muted-foreground">{clubInfo.description}</p>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Stats */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="glass-card border-white/20 p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                  <Users className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{clubInfo?.studentCount || 0}</p>
                  <p className="text-xs text-muted-foreground">Members</p>
                </div>
              </div>
            </Card>

            <Card className="glass-card border-white/20 p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
                  <UserCog className="w-5 h-5 text-green-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{clubInfo?.coachCount || 0}</p>
                  <p className="text-xs text-muted-foreground">Coaches</p>
                </div>
              </div>
            </Card>

            <Card className="glass-card border-white/20 p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-yellow-500/20 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-yellow-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats?.sessionsToday || 0}</p>
                  <p className="text-xs text-muted-foreground">Sessions Today</p>
                </div>
              </div>
            </Card>

            <Card className="glass-card border-white/20 p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-purple-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{formatCurrency(stats?.monthlyRevenue || 0)}</p>
                  <p className="text-xs text-muted-foreground">This Month</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Coaching Staff */}
          <Card className="glass-card border-white/20">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-semibold">Coaching Staff</CardTitle>
              <Button variant="ghost" size="sm" className="text-blue-500">
                View All
              </Button>
            </CardHeader>
            <CardContent>
              {coaches.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">No coaches found</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {coaches.map((coach) => (
                    <div key={coach.id} className="flex items-center gap-3 p-3 rounded-xl glass-subtle">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-teal-500 text-white">
                          {getInitials(coach.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="font-medium">{coach.name}</p>
                        <p className="text-sm text-muted-foreground">{coach.specialty || 'General'} Coach</p>
                      </div>
                      <div className="flex items-center gap-1 text-yellow-500">
                        <Star className="w-4 h-4 fill-current" />
                        <span className="text-sm font-medium">{coach.rating.toFixed(1)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Club Rating */}
          <Card className="glass-card border-white/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold">Club Rating</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-center">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-yellow-500 mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="w-6 h-6 fill-current" />
                    ))}
                  </div>
                  <p className="text-3xl font-bold">4.8</p>
                  <p className="text-sm text-muted-foreground">Based on 125 reviews</p>
                </div>
              </div>
              
              <div className="space-y-2">
                {[
                  { label: '5 stars', percent: 78 },
                  { label: '4 stars', percent: 15 },
                  { label: '3 stars', percent: 5 },
                  { label: '2 stars', percent: 2 },
                  { label: '1 star', percent: 0 },
                ].map((rating) => (
                  <div key={rating.label} className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground w-12">{rating.label}</span>
                    <Progress value={rating.percent} className="h-2 flex-1" />
                    <span className="text-xs text-muted-foreground w-8">{rating.percent}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Achievements */}
          <Card className="glass-card border-white/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-500" />
                Achievements
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3 p-3 rounded-xl glass-subtle">
                <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center">
                  <Award className="w-5 h-5 text-yellow-500" />
                </div>
                <div>
                  <p className="text-sm font-medium">Top Club 2024</p>
                  <p className="text-xs text-muted-foreground">Regional Excellence Award</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 rounded-xl glass-subtle">
                <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                  <Users className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-sm font-medium">100+ Members</p>
                  <p className="text-xs text-muted-foreground">Growing community</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 rounded-xl glass-subtle">
                <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                  <Star className="w-5 h-5 text-green-500" />
                </div>
                <div>
                  <p className="text-sm font-medium">5-Star Rating</p>
                  <p className="text-xs text-muted-foreground">Customer satisfaction</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Info */}
          <Card className="glass-card border-white/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold">Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {clubInfo?.admin?.email && (
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <span>{clubInfo.admin.email}</span>
                </div>
              )}
              <div className="flex items-center gap-3 text-sm">
                <Phone className="w-4 h-4 text-muted-foreground" />
                <span>+1 234 567 8900</span>
              </div>
              {clubInfo?.location && (
                <div className="flex items-center gap-3 text-sm">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span>{clubInfo.location}</span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
