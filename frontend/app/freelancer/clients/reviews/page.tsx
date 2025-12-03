"use client"
import { Star } from "lucide-react"

export default function Page() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Client Reviews</h1>
        <p className="text-muted-foreground">View client reviews</p>
      </div>
      <div className="glass-card rounded-2xl p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 rounded-xl flex items-center justify-center">
            <Star className="w-6 h-6 text-yellow-500" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">Client Reviews</h2>
            <p className="text-sm text-muted-foreground">Manage client reviews</p>
          </div>
        </div>
        <p className="text-muted-foreground">This page is under development. Content will be available soon.</p>
      </div>
    </div>
  )
}
