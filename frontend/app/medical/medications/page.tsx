"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Pill, Plus, Clock, AlertTriangle, CheckCircle, ArrowRight } from "lucide-react"

const medications = [
  { id: 1, student: "Jordan Lee", medication: "Albuterol Inhaler", dosage: "2 puffs as needed", condition: "Asthma", stored: true, lastAdministered: "Jan 12", status: "current" },
  { id: 2, student: "Sam Wilson", medication: "Insulin", dosage: "Per schedule", condition: "Type 1 Diabetes", stored: true, lastAdministered: "Today", status: "current" },
  { id: 3, student: "Casey Rivera", medication: "EpiPen", dosage: "Emergency only", condition: "Severe Allergy", stored: true, lastAdministered: "N/A", status: "current" },
  { id: 4, student: "Taylor Morgan", medication: "Ibuprofen", dosage: "As prescribed", condition: "Pain Management", stored: false, lastAdministered: "Jan 10", status: "expired" },
  { id: 5, student: "Alex Thompson", medication: "Antihistamine", dosage: "1 tablet daily", condition: "Allergies", stored: true, lastAdministered: "Today", status: "current" },
]

const administrationLog = [
  { time: "9:00 AM", student: "Sam Wilson", medication: "Insulin", administeredBy: "Medical Staff" },
  { time: "10:30 AM", student: "Jordan Lee", medication: "Albuterol Inhaler", administeredBy: "Self" },
  { time: "12:00 PM", student: "Sam Wilson", medication: "Insulin", administeredBy: "Medical Staff" },
  { time: "2:00 PM", student: "Alex Thompson", medication: "Antihistamine", administeredBy: "Medical Staff" },
]

export default function MedicationsPage() {
  const storedCount = medications.filter(m => m.stored).length

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Medications</h1>
          <p className="text-muted-foreground">Track student medications and administration</p>
        </div>
        <Button className="bg-gradient-to-r from-pink-500 to-rose-500 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Add Medication
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="glass-card border-white/20">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Tracked</p>
              <p className="text-2xl font-bold">{medications.length}</p>
            </div>
            <Pill className="w-8 h-8 text-pink-500" />
          </CardContent>
        </Card>
        <Card className="glass-card border-white/20">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Stored On-Site</p>
              <p className="text-2xl font-bold text-green-500">{storedCount}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500" />
          </CardContent>
        </Card>
        <Card className="glass-card border-white/20">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Administered Today</p>
              <p className="text-2xl font-bold text-blue-500">{administrationLog.length}</p>
            </div>
            <Clock className="w-8 h-8 text-blue-500" />
          </CardContent>
        </Card>
        <Card className="glass-card border-white/20">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Needs Attention</p>
              <p className="text-2xl font-bold text-orange-500">{medications.filter(m => m.status === "expired").length}</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-orange-500" />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="glass-card border-white/20 lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-semibold">Medication Records</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {medications.map((med) => (
              <div key={med.id} className="flex items-center justify-between p-4 rounded-xl glass-subtle hover:bg-white/20 transition-colors">
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-gradient-to-br from-pink-500 to-rose-500 text-white">
                      {med.student.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{med.student}</p>
                    <p className="text-sm font-medium text-pink-500">{med.medication}</p>
                    <p className="text-xs text-muted-foreground">{med.dosage} • {med.condition}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {med.stored && <Badge className="bg-green-500/20 text-green-500">Stored</Badge>}
                  <Badge className={med.status === "current" ? "bg-blue-500/20 text-blue-500" : "bg-orange-500/20 text-orange-500"}>
                    {med.status}
                  </Badge>
                  <Button size="sm" variant="ghost" className="text-pink-500">
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="glass-card border-white/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-semibold">Today&apos;s Administration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {administrationLog.map((log, idx) => (
              <div key={idx} className="p-3 rounded-xl glass-subtle">
                <div className="flex items-center justify-between mb-1">
                  <p className="font-medium text-sm">{log.student}</p>
                  <span className="text-xs text-muted-foreground">{log.time}</span>
                </div>
                <p className="text-sm text-pink-500">{log.medication}</p>
                <p className="text-xs text-muted-foreground">By: {log.administeredBy}</p>
              </div>
            ))}
            <Button variant="outline" className="w-full glass-subtle border-white/20">
              Log Administration
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
