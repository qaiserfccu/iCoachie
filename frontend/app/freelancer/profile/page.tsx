"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star, MapPin, Edit, Camera, Save, Plus } from "lucide-react"
import { useState, useEffect } from "react"
import { freelancerProfileService, FreelancerProfile, Service } from "@/lib/services/freelancerProfileService"
import { useLoading } from "@/lib/contexts/LoadingContext"
import { useError } from "@/lib/contexts/ErrorContext"

export default function ProfilePage() {
  const [profile, setProfile] = useState<FreelancerProfile | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editedProfile, setEditedProfile] = useState<Partial<FreelancerProfile>>({})
  const { setLoading } = useLoading()
  const { setError } = useError()

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true)
        const profileData = await freelancerProfileService.getProfile()
        setProfile(profileData)
        setEditedProfile(profileData)
      } catch (error) {
        console.error('Error loading profile:', error)
        setError('Failed to load profile data')
      } finally {
        setLoading(false)
      }
    }

    loadProfile()
  }, [setLoading, setError])

  const handleSaveProfile = async () => {
    try {
      setLoading(true)
      const updatedProfile = await freelancerProfileService.updateProfile(editedProfile)
      setProfile(updatedProfile)
      setIsEditing(false)
    } catch (error) {
      console.error('Error updating profile:', error)
      setError('Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  const handleAddService = async () => {
    // TODO: Implement add service functionality
    console.log('Add service clicked')
  }

  const handleEditService = (service: Service) => {
    // TODO: Implement edit service functionality
    console.log('Edit service:', service)
  }

  const handleAddCertification = async () => {
    // TODO: Implement add certification functionality
    console.log('Add certification clicked')
  }

  if (!profile) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">My Profile</h1>
            <p className="text-muted-foreground">Manage your public profile and settings</p>
          </div>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500 mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading profile data...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">My Profile</h1>
          <p className="text-muted-foreground">Manage your public profile and settings</p>
        </div>
        <div className="flex items-center gap-3">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={() => setIsEditing(false)} className="glass-subtle border-white/20 bg-transparent">
                Cancel
              </Button>
              <Button onClick={handleSaveProfile} className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)} className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
              <Edit className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <Card className="glass-card border-white/20">
          <CardContent className="p-6 text-center">
            <div className="relative inline-block mb-4">
              <Avatar className="h-32 w-32">
                <AvatarImage src={profile.avatarUrl} />
                <AvatarFallback className="bg-gradient-to-br from-yellow-500 to-orange-500 text-white text-4xl">
                  {profile.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <button className="absolute bottom-0 right-0 w-10 h-10 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 flex items-center justify-center text-white shadow-lg">
                <Camera className="w-5 h-5" />
              </button>
            </div>
            <h2 className="text-xl font-bold">{profile.name}</h2>
            <p className="text-muted-foreground">Swimming Coach</p>
            <div className="flex items-center justify-center gap-1 mt-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`w-4 h-4 ${i < Math.floor(profile.rating) ? 'fill-yellow-500 text-yellow-500' : 'text-gray-300'}`} />
              ))}
              <span className="text-sm ml-1">{profile.rating} ({profile.totalReviews} reviews)</span>
            </div>
            <div className="flex items-center justify-center gap-2 mt-3 text-sm text-muted-foreground">
              <MapPin className="w-4 h-4" />
              <span>{profile.location}</span>
            </div>
            <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-white/20">
              <div>
                <p className="text-2xl font-bold">{profile.stats.activeClients}</p>
                <p className="text-xs text-muted-foreground">Clients</p>
              </div>
              <div>
                <p className="text-2xl font-bold">{profile.stats.completedSessions}</p>
                <p className="text-xs text-muted-foreground">Sessions</p>
              </div>
              <div>
                <p className="text-2xl font-bold">{profile.experience}yr</p>
                <p className="text-xs text-muted-foreground">Experience</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Details */}
        <Card className="glass-card border-white/20 lg:col-span-2">
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>Update your personal and professional details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={isEditing ? editedProfile.name || '' : profile.name}
                  onChange={(e) => setEditedProfile(prev => ({ ...prev, name: e.target.value }))}
                  disabled={!isEditing}
                  className="glass-input"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  value={profile.email}
                  disabled
                  className="glass-input"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={isEditing ? editedProfile.phone || '' : profile.phone || ''}
                  onChange={(e) => setEditedProfile(prev => ({ ...prev, phone: e.target.value }))}
                  disabled={!isEditing}
                  className="glass-input"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={isEditing ? editedProfile.location || '' : profile.location || ''}
                  onChange={(e) => setEditedProfile(prev => ({ ...prev, location: e.target.value }))}
                  disabled={!isEditing}
                  className="glass-input"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={isEditing ? editedProfile.bio || '' : profile.bio || ''}
                onChange={(e) => setEditedProfile(prev => ({ ...prev, bio: e.target.value }))}
                disabled={!isEditing}
                className="glass-input min-h-[120px]"
              />
            </div>
            <div className="space-y-2">
              <Label>Specialties</Label>
              <div className="flex flex-wrap gap-2">
                {(isEditing ? editedProfile.specialties : profile.specialties)?.map((specialty) => (
                  <Badge key={specialty} variant="outline" className="border-yellow-500/50 text-yellow-600">
                    {specialty}
                  </Badge>
                ))}
                {isEditing && (
                  <Button size="sm" variant="outline" className="glass-subtle border-white/20 bg-transparent">
                    <Plus className="w-3 h-3 mr-1" />
                    Add
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Services */}
        <Card className="glass-card border-white/20 lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Services & Pricing</CardTitle>
              <CardDescription>Manage your offered services</CardDescription>
            </div>
            <Button size="sm" onClick={handleAddService} className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
              <Plus className="w-4 h-4 mr-1" />
              Add Service
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {profile.services.map((service) => (
                <div key={service.id} className="flex items-center justify-between p-4 rounded-xl glass-subtle">
                  <div>
                    <p className="font-medium">{service.name}</p>
                    <p className="text-sm text-muted-foreground">{service.duration}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-green-500">${service.price}</span>
                    <Button size="sm" variant="ghost" onClick={() => handleEditService(service)} className="glass-subtle">
                      <Edit className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Certifications */}
        <Card className="glass-card border-white/20">
          <CardHeader>
            <CardTitle>Certifications</CardTitle>
            <CardDescription>Your professional credentials</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {profile.certifications.map((cert) => (
                <div key={cert} className="flex items-center gap-3 p-3 rounded-xl glass-subtle">
                  <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center">
                    <Star className="w-4 h-4 text-green-500" />
                  </div>
                  <span className="text-sm">{cert}</span>
                </div>
              ))}
              <Button variant="outline" size="sm" onClick={handleAddCertification} className="w-full glass-subtle border-white/20 bg-transparent">
                <Plus className="w-4 h-4 mr-1" />
                Add Certification
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
