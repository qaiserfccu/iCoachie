"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Settings,
  Building2,
  Bell,
  Shield,
  Mail,
  Loader2,
  AlertCircle,
  Check,
  Upload,
  Phone,
  MapPin,
  Globe,
} from "lucide-react"
import { clubAdminService, type ClubInfo } from "@/lib/services"

export default function SettingsPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [clubInfo, setClubInfo] = useState<ClubInfo | null>(null)
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    description: '',
    email: '',
    phone: '',
    website: '',
  })
  
  // Notification settings
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    sessionReminders: true,
    paymentAlerts: true,
    memberUpdates: true,
    coachUpdates: true,
    weeklyReport: true,
  })

  useEffect(() => {
    loadClubInfo()
  }, [])

  async function loadClubInfo() {
    try {
      setLoading(true)
      setError(null)
      
      const info = await clubAdminService.getMyClub()
      setClubInfo(info)
      setFormData({
        name: info.name || '',
        location: info.location || '',
        description: info.description || '',
        email: info.admin?.email || '',
        phone: '',
        website: '',
      })
    } catch (err) {
      console.error('Error loading club info:', err)
      setError('Failed to load club settings. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  async function handleSave() {
    try {
      setSaving(true)
      setError(null)
      setSuccess(null)
      
      await clubAdminService.updateClub({
        name: formData.name,
        location: formData.location || null,
        description: formData.description || null,
      })
      
      setSuccess('Settings saved successfully!')
      setTimeout(() => setSuccess(null), 3000)
    } catch (err) {
      console.error('Error saving settings:', err)
      setError('Failed to save settings. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleNotificationChange = (field: string, value: boolean) => {
    setNotifications(prev => ({ ...prev, [field]: value }))
  }

  const getInitials = (name: string): string => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    )
  }

  if (error && !clubInfo) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <AlertCircle className="w-12 h-12 text-red-500" />
        <p className="text-muted-foreground">{error}</p>
        <Button onClick={loadClubInfo}>Try Again</Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground">Manage your club settings and preferences</p>
        </div>
        <Button 
          onClick={handleSave} 
          disabled={saving}
          className="bg-gradient-to-r from-blue-500 to-teal-500 text-white"
        >
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Check className="w-4 h-4 mr-2" />
              Save Changes
            </>
          )}
        </Button>
      </div>

      {/* Success/Error Messages */}
      {success && (
        <div className="bg-green-500/20 border border-green-500/50 text-green-500 rounded-xl p-4 flex items-center gap-2">
          <Check className="w-5 h-5" />
          {success}
        </div>
      )}
      {error && clubInfo && (
        <div className="bg-red-500/20 border border-red-500/50 text-red-500 rounded-xl p-4 flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          {error}
        </div>
      )}

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="glass-subtle border border-white/20">
          <TabsTrigger value="general" className="data-[state=active]:bg-white/20">
            <Building2 className="w-4 h-4 mr-2" />
            General
          </TabsTrigger>
          <TabsTrigger value="notifications" className="data-[state=active]:bg-white/20">
            <Bell className="w-4 h-4 mr-2" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="security" className="data-[state=active]:bg-white/20">
            <Shield className="w-4 h-4 mr-2" />
            Security
          </TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general" className="space-y-6">
          <Card className="glass-card border-white/20">
            <CardHeader>
              <CardTitle className="text-lg">Club Profile</CardTitle>
              <CardDescription>Update your club&apos;s basic information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Club Logo */}
              <div className="flex items-center gap-6">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={clubInfo?.logoUrl || undefined} />
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-teal-500 text-white text-2xl font-bold">
                    {getInitials(formData.name || 'MC')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <Button variant="outline" className="glass-subtle border-white/20 bg-transparent">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Logo
                  </Button>
                  <p className="text-xs text-muted-foreground mt-2">Recommended: 200x200px, PNG or JPG</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Club Name</Label>
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-muted-foreground" />
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="glass-input border-white/20"
                      placeholder="Enter club name"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      className="glass-input border-white/20"
                      placeholder="Enter club location"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Contact Email</Label>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="glass-input border-white/20"
                      placeholder="club@example.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Contact Phone</Label>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="glass-input border-white/20"
                      placeholder="+1 234 567 8900"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-muted-foreground" />
                    <Input
                      id="website"
                      value={formData.website}
                      onChange={(e) => handleInputChange('website', e.target.value)}
                      className="glass-input border-white/20"
                      placeholder="https://yourclub.com"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className="glass-input border-white/20 min-h-[100px]"
                  placeholder="Tell us about your club..."
                />
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card border-white/20">
            <CardHeader>
              <CardTitle className="text-lg">Club Statistics</CardTitle>
              <CardDescription>Overview of your club&apos;s current status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl glass-subtle text-center">
                  <p className="text-2xl font-bold text-blue-500">{clubInfo?.studentCount || 0}</p>
                  <p className="text-sm text-muted-foreground">Members</p>
                </div>
                <div className="p-4 rounded-xl glass-subtle text-center">
                  <p className="text-2xl font-bold text-green-500">{clubInfo?.coachCount || 0}</p>
                  <p className="text-sm text-muted-foreground">Coaches</p>
                </div>
                <div className="p-4 rounded-xl glass-subtle text-center">
                  <p className="text-2xl font-bold text-yellow-500">{clubInfo?.facilityCount || 0}</p>
                  <p className="text-sm text-muted-foreground">Facilities</p>
                </div>
                <div className="p-4 rounded-xl glass-subtle text-center">
                  <p className="text-2xl font-bold text-purple-500">{clubInfo?.userCount || 0}</p>
                  <p className="text-sm text-muted-foreground">Users</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications" className="space-y-6">
          <Card className="glass-card border-white/20">
            <CardHeader>
              <CardTitle className="text-lg">Email Notifications</CardTitle>
              <CardDescription>Configure how you receive email notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Email Notifications</p>
                  <p className="text-sm text-muted-foreground">Receive email notifications for important updates</p>
                </div>
                <Switch
                  checked={notifications.emailNotifications}
                  onCheckedChange={(checked) => handleNotificationChange('emailNotifications', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Session Reminders</p>
                  <p className="text-sm text-muted-foreground">Get reminded about upcoming sessions</p>
                </div>
                <Switch
                  checked={notifications.sessionReminders}
                  onCheckedChange={(checked) => handleNotificationChange('sessionReminders', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Payment Alerts</p>
                  <p className="text-sm text-muted-foreground">Notifications about payments and invoices</p>
                </div>
                <Switch
                  checked={notifications.paymentAlerts}
                  onCheckedChange={(checked) => handleNotificationChange('paymentAlerts', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Member Updates</p>
                  <p className="text-sm text-muted-foreground">Alerts when members join or leave</p>
                </div>
                <Switch
                  checked={notifications.memberUpdates}
                  onCheckedChange={(checked) => handleNotificationChange('memberUpdates', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Coach Updates</p>
                  <p className="text-sm text-muted-foreground">Notifications about coach availability</p>
                </div>
                <Switch
                  checked={notifications.coachUpdates}
                  onCheckedChange={(checked) => handleNotificationChange('coachUpdates', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Weekly Report</p>
                  <p className="text-sm text-muted-foreground">Receive weekly summary of club activity</p>
                </div>
                <Switch
                  checked={notifications.weeklyReport}
                  onCheckedChange={(checked) => handleNotificationChange('weeklyReport', checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security" className="space-y-6">
          <Card className="glass-card border-white/20">
            <CardHeader>
              <CardTitle className="text-lg">Security Settings</CardTitle>
              <CardDescription>Manage your club&apos;s security preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-4 rounded-xl glass-subtle">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="font-medium">Two-Factor Authentication</p>
                    <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                  </div>
                  <Button variant="outline" className="glass-subtle border-white/20 bg-transparent">
                    Enable
                  </Button>
                </div>
              </div>

              <div className="p-4 rounded-xl glass-subtle">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="font-medium">Session Management</p>
                    <p className="text-sm text-muted-foreground">View and manage active sessions</p>
                  </div>
                  <Button variant="outline" className="glass-subtle border-white/20 bg-transparent">
                    Manage
                  </Button>
                </div>
              </div>

              <div className="p-4 rounded-xl glass-subtle">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="font-medium">Change Password</p>
                    <p className="text-sm text-muted-foreground">Update your account password</p>
                  </div>
                  <Button variant="outline" className="glass-subtle border-white/20 bg-transparent">
                    Change
                  </Button>
                </div>
              </div>

              <div className="p-4 rounded-xl glass-subtle border border-red-500/20">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="font-medium text-red-500">Danger Zone</p>
                    <p className="text-sm text-muted-foreground">Permanently delete your club account</p>
                  </div>
                  <Button variant="destructive">
                    Delete Club
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
