"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star, MapPin, Edit, Camera, Save, Plus } from "lucide-react"

const services = [
  { name: "Swimming Lesson", duration: "1 hour", price: "$75" },
  { name: "Private Training", duration: "1.5 hours", price: "$100" },
  { name: "Trial Session", duration: "45 min", price: "$50" },
  { name: "Group Class", duration: "1 hour", price: "$40/person" },
]

const certifications = [
  "Certified Swimming Instructor",
  "CPR & First Aid Certified",
  "Lifeguard Certification",
  "Youth Sports Coach Certification",
]

export default function ProfilePage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">My Profile</h1>
          <p className="text-muted-foreground">Manage your public profile and settings</p>
        </div>
        <Button className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
          <Save className="w-4 h-4 mr-2" />
          Save Changes
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <Card className="glass-card border-white/20">
          <CardContent className="p-6 text-center">
            <div className="relative inline-block mb-4">
              <Avatar className="h-32 w-32">
                <AvatarImage src="/professional-coach-profile.png" />
                <AvatarFallback className="bg-gradient-to-br from-yellow-500 to-orange-500 text-white text-4xl">
                  MJ
                </AvatarFallback>
              </Avatar>
              <button className="absolute bottom-0 right-0 w-10 h-10 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 flex items-center justify-center text-white shadow-lg">
                <Camera className="w-5 h-5" />
              </button>
            </div>
            <h2 className="text-xl font-bold">Mike Johnson</h2>
            <p className="text-muted-foreground">Swimming Coach</p>
            <div className="flex items-center justify-center gap-1 mt-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-yellow-500 text-yellow-500" />
              ))}
              <span className="text-sm ml-1">4.9 (32 reviews)</span>
            </div>
            <div className="flex items-center justify-center gap-2 mt-3 text-sm text-muted-foreground">
              <MapPin className="w-4 h-4" />
              <span>New York, NY</span>
            </div>
            <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-white/20">
              <div>
                <p className="text-2xl font-bold">28</p>
                <p className="text-xs text-muted-foreground">Clients</p>
              </div>
              <div>
                <p className="text-2xl font-bold">156</p>
                <p className="text-xs text-muted-foreground">Sessions</p>
              </div>
              <div>
                <p className="text-2xl font-bold">3yr</p>
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
                <Input id="name" defaultValue="Mike Johnson" className="glass-input" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" defaultValue="mike.johnson@email.com" className="glass-input" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" defaultValue="+1 234 567 8903" className="glass-input" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input id="location" defaultValue="New York, NY" className="glass-input" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                defaultValue="Professional swimming coach with over 3 years of experience. Specialized in teaching kids and adults of all skill levels. Passionate about helping people achieve their swimming goals safely and confidently."
                className="glass-input min-h-[120px]"
              />
            </div>
            <div className="space-y-2">
              <Label>Specialties</Label>
              <div className="flex flex-wrap gap-2">
                {["Swimming", "Freestyle", "Backstroke", "Kids Training", "Adult Beginners"].map((specialty) => (
                  <Badge key={specialty} variant="outline" className="border-yellow-500/50 text-yellow-600">
                    {specialty}
                  </Badge>
                ))}
                <Button size="sm" variant="outline" className="glass-subtle border-white/20 bg-transparent">
                  <Plus className="w-3 h-3 mr-1" />
                  Add
                </Button>
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
            <Button size="sm" className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
              <Plus className="w-4 h-4 mr-1" />
              Add Service
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {services.map((service) => (
                <div key={service.name} className="flex items-center justify-between p-4 rounded-xl glass-subtle">
                  <div>
                    <p className="font-medium">{service.name}</p>
                    <p className="text-sm text-muted-foreground">{service.duration}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-green-500">{service.price}</span>
                    <Button size="sm" variant="ghost" className="glass-subtle">
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
              {certifications.map((cert) => (
                <div key={cert} className="flex items-center gap-3 p-3 rounded-xl glass-subtle">
                  <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center">
                    <Star className="w-4 h-4 text-green-500" />
                  </div>
                  <span className="text-sm">{cert}</span>
                </div>
              ))}
              <Button variant="outline" size="sm" className="w-full glass-subtle border-white/20 bg-transparent">
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
