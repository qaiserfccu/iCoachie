"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Globe, Mail, Bell, Shield, CreditCard, Save, Loader2, CheckCircle } from "lucide-react"
import { toast } from "sonner"
import { adminService, type SettingsResponse } from "@/lib/services/adminService"

interface SettingsState {
  // General
  platform_name: string
  support_email: string
  default_timezone: string
  default_currency: string
  platform_description: string
  date_format: string
  
  // Features
  enable_registrations: boolean
  enable_club_registrations: boolean
  enable_freelancer_mode: boolean
  enable_online_payments: boolean
  enable_chat_system: boolean
  maintenance_mode: boolean
  
  // Email
  smtp_host: string
  smtp_port: string
  smtp_username: string
  smtp_password: string
  smtp_from_email: string
  smtp_from_name: string
  
  // Notifications
  notify_new_user: boolean
  notify_new_club: boolean
  notify_payment_received: boolean
  notify_refund_requests: boolean
  notify_support_tickets: boolean
  
  // Security
  session_timeout: string
  max_login_attempts: string
  require_2fa_admin: boolean
  force_password_change: boolean
  ip_whitelisting: boolean
  
  // Payments
  payment_provider: string
  stripe_publishable_key: string
  stripe_secret_key: string
  platform_fee_percentage: string
}

const defaultSettings: SettingsState = {
  platform_name: 'iCoachie',
  support_email: 'support@icoachie.com',
  default_timezone: 'UTC',
  default_currency: 'USD',
  platform_description: 'The all-in-one platform for sports clubs, coaches, and families.',
  date_format: 'MM/DD/YYYY',
  enable_registrations: true,
  enable_club_registrations: true,
  enable_freelancer_mode: true,
  enable_online_payments: true,
  enable_chat_system: true,
  maintenance_mode: false,
  smtp_host: '',
  smtp_port: '587',
  smtp_username: '',
  smtp_password: '',
  smtp_from_email: '',
  smtp_from_name: 'iCoachie',
  notify_new_user: true,
  notify_new_club: true,
  notify_payment_received: true,
  notify_refund_requests: true,
  notify_support_tickets: true,
  session_timeout: '30',
  max_login_attempts: '5',
  require_2fa_admin: true,
  force_password_change: false,
  ip_whitelisting: false,
  payment_provider: 'stripe',
  stripe_publishable_key: '',
  stripe_secret_key: '',
  platform_fee_percentage: '5',
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<SettingsState>(defaultSettings)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [testingEmail, setTestingEmail] = useState(false)
  const [testEmail, setTestEmail] = useState('')

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      const response = await adminService.getSettings()
      const loaded = { ...defaultSettings }
      
      // Flatten settings from response
      for (const category of Object.keys(response.settings || {})) {
        const categorySettings = response.settings[category]
        for (const key of Object.keys(categorySettings)) {
          const value = categorySettings[key]
          if (key in loaded) {
            if (typeof loaded[key as keyof SettingsState] === 'boolean') {
              (loaded as Record<string, unknown>)[key] = value === 'true'
            } else {
              (loaded as Record<string, unknown>)[key] = value
            }
          }
        }
      }
      
      setSettings(loaded)
    } catch (error) {
      console.error('Error loading settings:', error)
      toast.error('Failed to load settings')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      // Convert settings to the expected format
      const settingsToSave: Record<string, Record<string, string>> = {
        general: {
          platform_name: settings.platform_name,
          support_email: settings.support_email,
          default_timezone: settings.default_timezone,
          default_currency: settings.default_currency,
          platform_description: settings.platform_description,
          date_format: settings.date_format,
        },
        features: {
          enable_registrations: String(settings.enable_registrations),
          enable_club_registrations: String(settings.enable_club_registrations),
          enable_freelancer_mode: String(settings.enable_freelancer_mode),
          enable_online_payments: String(settings.enable_online_payments),
          enable_chat_system: String(settings.enable_chat_system),
          maintenance_mode: String(settings.maintenance_mode),
        },
        email: {
          smtp_host: settings.smtp_host,
          smtp_port: settings.smtp_port,
          smtp_username: settings.smtp_username,
          smtp_password: settings.smtp_password,
          smtp_from_email: settings.smtp_from_email,
          smtp_from_name: settings.smtp_from_name,
        },
        notifications: {
          notify_new_user: String(settings.notify_new_user),
          notify_new_club: String(settings.notify_new_club),
          notify_payment_received: String(settings.notify_payment_received),
          notify_refund_requests: String(settings.notify_refund_requests),
          notify_support_tickets: String(settings.notify_support_tickets),
        },
        security: {
          session_timeout: settings.session_timeout,
          max_login_attempts: settings.max_login_attempts,
          require_2fa_admin: String(settings.require_2fa_admin),
          force_password_change: String(settings.force_password_change),
          ip_whitelisting: String(settings.ip_whitelisting),
        },
        payments: {
          payment_provider: settings.payment_provider,
          stripe_publishable_key: settings.stripe_publishable_key,
          stripe_secret_key: settings.stripe_secret_key,
          platform_fee_percentage: settings.platform_fee_percentage,
        },
      }
      
      await adminService.updateSettings(settingsToSave)
      toast.success('Settings saved successfully')
    } catch (error) {
      console.error('Error saving settings:', error)
      toast.error('Failed to save settings')
    } finally {
      setIsSaving(false)
    }
  }

  const handleTestEmail = async () => {
    if (!testEmail) {
      toast.error('Please enter a test email address')
      return
    }
    
    setTestingEmail(true)
    try {
      const result = await adminService.testEmailConfiguration(testEmail)
      toast.success(result.message)
    } catch (error) {
      console.error('Error testing email:', error)
      toast.error('Failed to send test email')
    } finally {
      setTestingEmail(false)
    }
  }

  const updateSetting = (key: keyof SettingsState, value: string | boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading settings...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">System Settings</h1>
          <p className="text-muted-foreground">Configure platform-wide settings</p>
        </div>
        <Button className="gradient-primary text-white" onClick={handleSave} disabled={isSaving}>
          {isSaving ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </>
          )}
        </Button>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="glass-card border-white/20 p-1">
          <TabsTrigger value="general" className="data-[state=active]:bg-primary data-[state=active]:text-white">
            <Globe className="w-4 h-4 mr-2" />
            General
          </TabsTrigger>
          <TabsTrigger value="email" className="data-[state=active]:bg-primary data-[state=active]:text-white">
            <Mail className="w-4 h-4 mr-2" />
            Email
          </TabsTrigger>
          <TabsTrigger value="notifications" className="data-[state=active]:bg-primary data-[state=active]:text-white">
            <Bell className="w-4 h-4 mr-2" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="security" className="data-[state=active]:bg-primary data-[state=active]:text-white">
            <Shield className="w-4 h-4 mr-2" />
            Security
          </TabsTrigger>
          <TabsTrigger value="payments" className="data-[state=active]:bg-primary data-[state=active]:text-white">
            <CreditCard className="w-4 h-4 mr-2" />
            Payments
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <Card className="glass-card border-white/20">
            <CardHeader>
              <CardTitle>Platform Information</CardTitle>
              <CardDescription>Basic platform settings and branding</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="platform-name">Platform Name</Label>
                  <Input 
                    id="platform-name" 
                    value={settings.platform_name}
                    onChange={(e) => updateSetting('platform_name', e.target.value)}
                    className="glass-input" 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="support-email">Support Email</Label>
                  <Input 
                    id="support-email" 
                    value={settings.support_email}
                    onChange={(e) => updateSetting('support_email', e.target.value)}
                    className="glass-input" 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">Default Timezone</Label>
                  <Select value={settings.default_timezone} onValueChange={(v) => updateSetting('default_timezone', v)}>
                    <SelectTrigger className="glass-input">
                      <SelectValue placeholder="Select timezone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="UTC">UTC</SelectItem>
                      <SelectItem value="EST">Eastern Time</SelectItem>
                      <SelectItem value="PST">Pacific Time</SelectItem>
                      <SelectItem value="GMT">GMT</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currency">Default Currency</Label>
                  <Select value={settings.default_currency} onValueChange={(v) => updateSetting('default_currency', v)}>
                    <SelectTrigger className="glass-input">
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD ($)</SelectItem>
                      <SelectItem value="EUR">EUR (€)</SelectItem>
                      <SelectItem value="GBP">GBP (£)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Platform Description</Label>
                <Textarea
                  id="description"
                  value={settings.platform_description}
                  onChange={(e) => updateSetting('platform_description', e.target.value)}
                  className="glass-input min-h-[100px]"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card border-white/20">
            <CardHeader>
              <CardTitle>Feature Toggles</CardTitle>
              <CardDescription>Enable or disable platform features</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {[
                { key: 'enable_registrations', label: "New User Registrations", description: "Allow new users to sign up" },
                { key: 'enable_club_registrations', label: "Club Registrations", description: "Allow new clubs to register" },
                { key: 'enable_freelancer_mode', label: "Freelancer Mode", description: "Enable freelancer coach registrations" },
                { key: 'enable_online_payments', label: "Online Payments", description: "Process payments through the platform" },
                { key: 'enable_chat_system', label: "Chat System", description: "Enable in-app messaging" },
                { key: 'maintenance_mode', label: "Maintenance Mode", description: "Show maintenance page to users" },
              ].map((feature) => (
                <div key={feature.key} className="flex items-center justify-between p-4 rounded-xl glass-subtle">
                  <div>
                    <p className="font-medium">{feature.label}</p>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                  <Switch 
                    checked={settings[feature.key as keyof SettingsState] as boolean}
                    onCheckedChange={(checked) => updateSetting(feature.key as keyof SettingsState, checked)}
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="email" className="space-y-6">
          <Card className="glass-card border-white/20">
            <CardHeader>
              <CardTitle>Email Configuration</CardTitle>
              <CardDescription>SMTP settings for sending emails</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="smtp-host">SMTP Host</Label>
                  <Input 
                    id="smtp-host" 
                    value={settings.smtp_host}
                    onChange={(e) => updateSetting('smtp_host', e.target.value)}
                    placeholder="smtp.example.com"
                    className="glass-input" 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtp-port">SMTP Port</Label>
                  <Input 
                    id="smtp-port" 
                    value={settings.smtp_port}
                    onChange={(e) => updateSetting('smtp_port', e.target.value)}
                    className="glass-input" 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtp-user">SMTP Username</Label>
                  <Input 
                    id="smtp-user" 
                    value={settings.smtp_username}
                    onChange={(e) => updateSetting('smtp_username', e.target.value)}
                    className="glass-input" 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtp-pass">SMTP Password</Label>
                  <Input 
                    id="smtp-pass" 
                    type="password" 
                    value={settings.smtp_password}
                    onChange={(e) => updateSetting('smtp_password', e.target.value)}
                    className="glass-input" 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtp-from-email">From Email</Label>
                  <Input 
                    id="smtp-from-email" 
                    value={settings.smtp_from_email}
                    onChange={(e) => updateSetting('smtp_from_email', e.target.value)}
                    placeholder="noreply@example.com"
                    className="glass-input" 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtp-from-name">From Name</Label>
                  <Input 
                    id="smtp-from-name" 
                    value={settings.smtp_from_name}
                    onChange={(e) => updateSetting('smtp_from_name', e.target.value)}
                    className="glass-input" 
                  />
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Input 
                  placeholder="Enter test email address"
                  value={testEmail}
                  onChange={(e) => setTestEmail(e.target.value)}
                  className="glass-input max-w-xs"
                />
                <Button 
                  variant="outline" 
                  className="glass-subtle border-white/20 bg-transparent"
                  onClick={handleTestEmail}
                  disabled={testingEmail}
                >
                  {testingEmail ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Testing...
                    </>
                  ) : (
                    'Test Email Configuration'
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card className="glass-card border-white/20">
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>Configure system notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {[
                { key: 'notify_new_user', label: "New User Registration", description: "Notify admins when a new user registers" },
                { key: 'notify_new_club', label: "New Club Registration", description: "Notify admins when a new club registers" },
                { key: 'notify_payment_received', label: "Payment Received", description: "Notify on successful payments" },
                { key: 'notify_refund_requests', label: "Refund Requests", description: "Notify admins on refund requests" },
                { key: 'notify_support_tickets', label: "Support Tickets", description: "Notify on new support tickets" },
              ].map((notification) => (
                <div key={notification.key} className="flex items-center justify-between p-4 rounded-xl glass-subtle">
                  <div>
                    <p className="font-medium">{notification.label}</p>
                    <p className="text-sm text-muted-foreground">{notification.description}</p>
                  </div>
                  <Switch 
                    checked={settings[notification.key as keyof SettingsState] as boolean}
                    onCheckedChange={(checked) => updateSetting(notification.key as keyof SettingsState, checked)}
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card className="glass-card border-white/20">
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Configure platform security options</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="session-timeout">Session Timeout (minutes)</Label>
                  <Input 
                    id="session-timeout" 
                    type="number" 
                    value={settings.session_timeout}
                    onChange={(e) => updateSetting('session_timeout', e.target.value)}
                    className="glass-input" 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="max-attempts">Max Login Attempts</Label>
                  <Input 
                    id="max-attempts" 
                    type="number" 
                    value={settings.max_login_attempts}
                    onChange={(e) => updateSetting('max_login_attempts', e.target.value)}
                    className="glass-input" 
                  />
                </div>
              </div>
              {[
                { key: 'require_2fa_admin', label: "Two-Factor Authentication", description: "Require 2FA for admin accounts" },
                { key: 'force_password_change', label: "Force Password Change", description: "Require password change every 90 days" },
                { key: 'ip_whitelisting', label: "IP Whitelisting", description: "Restrict admin access to specific IPs" },
              ].map((setting) => (
                <div key={setting.key} className="flex items-center justify-between p-4 rounded-xl glass-subtle">
                  <div>
                    <p className="font-medium">{setting.label}</p>
                    <p className="text-sm text-muted-foreground">{setting.description}</p>
                  </div>
                  <Switch 
                    checked={settings[setting.key as keyof SettingsState] as boolean}
                    onCheckedChange={(checked) => updateSetting(setting.key as keyof SettingsState, checked)}
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments" className="space-y-6">
          <Card className="glass-card border-white/20">
            <CardHeader>
              <CardTitle>Payment Gateway</CardTitle>
              <CardDescription>Configure payment processing settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="payment-provider">Payment Provider</Label>
                <Select value={settings.payment_provider} onValueChange={(v) => updateSetting('payment_provider', v)}>
                  <SelectTrigger className="glass-input">
                    <SelectValue placeholder="Select provider" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="stripe">Stripe</SelectItem>
                    <SelectItem value="paypal">PayPal</SelectItem>
                    <SelectItem value="square">Square</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="stripe-key">Stripe Publishable Key</Label>
                  <Input 
                    id="stripe-key" 
                    value={settings.stripe_publishable_key}
                    onChange={(e) => updateSetting('stripe_publishable_key', e.target.value)}
                    placeholder="pk_live_..."
                    className="glass-input" 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stripe-secret">Stripe Secret Key</Label>
                  <Input 
                    id="stripe-secret" 
                    type="password" 
                    value={settings.stripe_secret_key}
                    onChange={(e) => updateSetting('stripe_secret_key', e.target.value)}
                    placeholder="sk_live_..."
                    className="glass-input" 
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="platform-fee">Platform Fee (%)</Label>
                <Input 
                  id="platform-fee" 
                  type="number" 
                  value={settings.platform_fee_percentage}
                  onChange={(e) => updateSetting('platform_fee_percentage', e.target.value)}
                  className="glass-input w-32" 
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
