"use client"

import { useState } from "react"
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
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

const clubs = [
  {
    id: 1,
    name: "Champions FC",
    logo: "CF",
    location: "New York, NY",
    members: 450,
    coaches: 12,
    rating: 4.8,
    status: "Verified",
    revenue: "$12,400",
    plan: "Premium",
  },
  {
    id: 2,
    name: "Elite Sports Academy",
    logo: "ES",
    location: "Los Angeles, CA",
    members: 380,
    coaches: 10,
    rating: 4.7,
    status: "Verified",
    revenue: "$10,800",
    plan: "Premium",
  },
  {
    id: 3,
    name: "Victory Athletics",
    logo: "VA",
    location: "Chicago, IL",
    members: 320,
    coaches: 8,
    rating: 4.5,
    status: "Verified",
    revenue: "$9,200",
    plan: "Standard",
  },
  {
    id: 4,
    name: "Rising Stars Club",
    logo: "RS",
    location: "Houston, TX",
    members: 0,
    coaches: 0,
    rating: 0,
    status: "Pending",
    revenue: "$0",
    plan: "Free Trial",
  },
  {
    id: 5,
    name: "Premier Training Center",
    logo: "PT",
    location: "Miami, FL",
    members: 290,
    coaches: 7,
    rating: 4.6,
    status: "Verified",
    revenue: "$8,500",
    plan: "Standard",
  },
]

export default function ClubsPage() {
  const [searchQuery, setSearchQuery] = useState("")

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
          <Button className="gradient-primary text-white">
            <Building2 className="w-4 h-4 mr-2" />
            Add Club
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Clubs", value: "284", change: "+12" },
          { label: "Verified", value: "256", change: "+8" },
          { label: "Pending", value: "18", change: "+4" },
          { label: "Total Revenue", value: "$128K", change: "+15%" },
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
        ))}
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
                    <DropdownMenuItem>Edit Club</DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">Suspend Club</DropdownMenuItem>
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
    </div>
  )
}
