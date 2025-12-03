"use client"
import { RefreshCw } from "lucide-react"

export default function Page() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Refunds</h1>
        <p className="text-muted-foreground">Manage refunds</p>
      </div>
      <div className="glass-card rounded-2xl p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 rounded-xl flex items-center justify-center">
            <RefreshCw className="w-6 h-6 text-emerald-500" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">Refunds</h2>
            <p className="text-sm text-muted-foreground">Manage refunds</p>
          </div>
        </div>
        <p className="text-muted-foreground">This page is under development. Content will be available soon.</p>
      </div>
    </div>
  )
}
