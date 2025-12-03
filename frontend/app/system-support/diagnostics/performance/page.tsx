"use client"
import { Activity } from "lucide-react"

export default function Page() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Performance</h1>
        <p className="text-muted-foreground">Monitor system performance</p>
      </div>
      <div className="glass-card rounded-2xl p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-xl flex items-center justify-center">
            <Activity className="w-6 h-6 text-purple-500" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">Performance</h2>
            <p className="text-sm text-muted-foreground">Manage performance</p>
          </div>
        </div>
        <p className="text-muted-foreground">This page is under development. Content will be available soon.</p>
      </div>
    </div>
  )
}
