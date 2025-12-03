"use client"
import { Calendar } from "lucide-react"

export default function Page() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Calendar View</h1>
        <p className="text-muted-foreground">View schedule in calendar format</p>
      </div>
      <div className="glass-card rounded-2xl p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-teal-500/20 to-teal-600/20 rounded-xl flex items-center justify-center">
            <Calendar className="w-6 h-6 text-teal-500" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">Calendar View</h2>
            <p className="text-sm text-muted-foreground">Manage calendar view</p>
          </div>
        </div>
        <p className="text-muted-foreground">This page is under development. Content will be available soon.</p>
      </div>
    </div>
  )
}
