"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Siren, FileText, Phone, MapPin, AlertTriangle, Users, Shield, Clock } from "lucide-react"

const emergencyContacts = [
  { id: 1, name: "Police Department", number: "911", type: "Emergency" },
  { id: 2, name: "Fire Department", number: "911", type: "Emergency" },
  { id: 3, name: "Ambulance", number: "911", type: "Emergency" },
  { id: 4, name: "Security Manager", number: "+1 555-100-0016", type: "Internal" },
  { id: 5, name: "Facility Manager", number: "+1 555-100-0011", type: "Internal" },
  { id: 6, name: "Building Maintenance", number: "+1 555-100-0014", type: "Internal" },
]

const protocols = [
  { id: 1, title: "Fire Evacuation", description: "Procedures for building evacuation in case of fire", status: "active", lastUpdated: "Jan 10, 2024", priority: "critical" },
  { id: 2, title: "Medical Emergency", description: "Response procedures for medical emergencies", status: "active", lastUpdated: "Jan 8, 2024", priority: "critical" },
  { id: 3, title: "Lockdown Procedure", description: "Building lockdown in case of security threat", status: "active", lastUpdated: "Jan 5, 2024", priority: "high" },
  { id: 4, title: "Severe Weather", description: "Shelter-in-place procedures for severe weather", status: "active", lastUpdated: "Dec 20, 2023", priority: "medium" },
  { id: 5, title: "Power Outage", description: "Procedures during extended power outages", status: "active", lastUpdated: "Dec 15, 2023", priority: "medium" },
]

const assemblyPoints = [
  { id: 1, name: "Assembly Point A", location: "Main Parking Lot - North", capacity: 200 },
  { id: 2, name: "Assembly Point B", location: "Soccer Field - East Side", capacity: 300 },
  { id: 3, name: "Assembly Point C", location: "Back Entrance - South", capacity: 150 },
]

export default function EmergencyProtocolsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Emergency Protocols</h1>
          <p className="text-muted-foreground">Emergency procedures and response guidelines</p>
        </div>
        <Button variant="destructive">
          <Siren className="w-4 h-4 mr-2" />Activate Emergency
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="glass-card border-white/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-green-500/20">
                <Shield className="w-6 h-6 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <p className="text-xl font-bold text-green-500">All Clear</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card border-white/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-blue-500/20">
                <FileText className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active Protocols</p>
                <p className="text-2xl font-bold">5</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card border-white/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-purple-500/20">
                <MapPin className="w-6 h-6 text-purple-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Assembly Points</p>
                <p className="text-2xl font-bold">3</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card border-white/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-orange-500/20">
                <Clock className="w-6 h-6 text-orange-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Last Drill</p>
                <p className="text-xl font-bold">14 days ago</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="glass-card border-white/20 lg:col-span-2">
          <CardHeader>
            <CardTitle>Emergency Protocols</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {protocols.map((protocol) => (
              <div key={protocol.id} className="p-4 rounded-xl glass-subtle flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-lg ${
                    protocol.priority === 'critical' ? 'bg-red-500/20' :
                    protocol.priority === 'high' ? 'bg-orange-500/20' : 'bg-yellow-500/20'
                  }`}>
                    <AlertTriangle className={`w-5 h-5 ${
                      protocol.priority === 'critical' ? 'text-red-500' :
                      protocol.priority === 'high' ? 'text-orange-500' : 'text-yellow-500'
                    }`} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{protocol.title}</span>
                      <Badge variant={protocol.status === 'active' ? 'default' : 'secondary'}>
                        {protocol.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{protocol.description}</p>
                    <p className="text-xs text-muted-foreground mt-1">Updated: {protocol.lastUpdated}</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">View Details</Button>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="glass-card border-white/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="w-5 h-5" />
                Emergency Contacts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {emergencyContacts.map((contact) => (
                <div key={contact.id} className="flex items-center justify-between p-3 rounded-lg glass-subtle">
                  <div>
                    <p className="font-medium text-sm">{contact.name}</p>
                    <p className="text-xs text-muted-foreground">{contact.type}</p>
                  </div>
                  <a href={`tel:${contact.number}`} className="text-primary font-medium text-sm">{contact.number}</a>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="glass-card border-white/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Assembly Points
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {assemblyPoints.map((point) => (
                <div key={point.id} className="p-3 rounded-lg glass-subtle">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-sm">{point.name}</span>
                    <Badge variant="outline">{point.capacity} capacity</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{point.location}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
