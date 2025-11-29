"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Globe, Mail, Bell, Shield, CreditCard, Save } from "lucide-react"

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">System Settings</h1>
          <p className="text-muted-foreground">Configure platform-wide settings</p>
        </div>
        <Button className="gradient-primary text-white">
          <Save className="w-4 h-4 mr-2" />
          Save Changes
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
                  <Input id="platform-name" defaultValue="iCoachie" className="glass-input" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="support-email">Support Email</Label>
                  <Input id="support-email" defaultValue="support@icoachie.com" className="glass-input" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">Default Timezone</Label>
                  <Select defaultValue="utc">
                    <SelectTrigger className="glass-input">
                      <SelectValue placeholder="Select timezone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="utc">UTC</SelectItem>
                      <SelectItem value="est">Eastern Time</SelectItem>
                      <SelectItem value="pst">Pacific Time</SelectItem>
                      <SelectItem value="gmt">GMT</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currency">Default Currency</Label>
                  <Select defaultValue="usd">
                    <SelectTrigger className="glass-input">
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="usd">USD ($)</SelectItem>
                      <SelectItem value="eur">EUR</SelectItem>
                      <SelectItem value="gbp">GBP</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Platform Description</Label>
                <Textarea
                  id="description"
                  defaultValue="The all-in-one platform for sports clubs, coaches, and families."
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
                { label: "New User Registrations", description: "Allow new users to sign up", enabled: true },
                { label: "Club Registrations", description: "Allow new clubs to register", enabled: true },
                { label: "Freelancer Mode", description: "Enable freelancer coach registrations", enabled: true },
                { label: "Online Payments", description: "Process payments through the platform", enabled: true },
                { label: "Chat System", description: "Enable in-app messaging", enabled: true },
                { label: "Maintenance Mode", description: "Show maintenance page to users", enabled: false },
              ].map((feature) => (
                <div key={feature.label} className="flex items-center justify-between p-4 rounded-xl glass-subtle">
                  <div>
                    <p className="font-medium">{feature.label}</p>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                  <Switch defaultChecked={feature.enabled} />
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
                  <Input id="smtp-host" defaultValue="smtp.sendgrid.net" className="glass-input" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtp-port">SMTP Port</Label>
                  <Input id="smtp-port" defaultValue="587" className="glass-input" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtp-user">SMTP Username</Label>
                  <Input id="smtp-user" defaultValue="apikey" className="glass-input" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtp-pass">SMTP Password</Label>
                  <Input id="smtp-pass" type="password" defaultValue="********" className="glass-input" />
                </div>
              </div>
              <Button variant="outline" className="glass-subtle border-white/20 bg-transparent">
                Test Email Configuration
              </Button>
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
                { label: "New User Registration", description: "Notify admins when a new user registers" },
                { label: "New Club Registration", description: "Notify admins when a new club registers" },
                { label: "Payment Received", description: "Notify on successful payments" },
                { label: "Refund Requests", description: "Notify admins on refund requests" },
                { label: "Support Tickets", description: "Notify on new support tickets" },
              ].map((notification) => (
                <div key={notification.label} className="flex items-center justify-between p-4 rounded-xl glass-subtle">
                  <div>
                    <p className="font-medium">{notification.label}</p>
                    <p className="text-sm text-muted-foreground">{notification.description}</p>
                  </div>
                  <Switch defaultChecked />
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
                  <Input id="session-timeout" type="number" defaultValue="30" className="glass-input" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="max-attempts">Max Login Attempts</Label>
                  <Input id="max-attempts" type="number" defaultValue="5" className="glass-input" />
                </div>
              </div>
              {[
                { label: "Two-Factor Authentication", description: "Require 2FA for admin accounts", enabled: true },
                {
                  label: "Force Password Change",
                  description: "Require password change every 90 days",
                  enabled: false,
                },
                { label: "IP Whitelisting", description: "Restrict admin access to specific IPs", enabled: false },
              ].map((setting) => (
                <div key={setting.label} className="flex items-center justify-between p-4 rounded-xl glass-subtle">
                  <div>
                    <p className="font-medium">{setting.label}</p>
                    <p className="text-sm text-muted-foreground">{setting.description}</p>
                  </div>
                  <Switch defaultChecked={setting.enabled} />
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
                <Select defaultValue="stripe">
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
                  <Input id="stripe-key" defaultValue="pk_live_..." className="glass-input" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stripe-secret">Stripe Secret Key</Label>
                  <Input id="stripe-secret" type="password" defaultValue="sk_live_..." className="glass-input" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="platform-fee">Platform Fee (%)</Label>
                <Input id="platform-fee" type="number" defaultValue="5" className="glass-input w-32" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
