"use client"
import { MessageSquare } from "lucide-react"

export default function Page() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Message Coach</h1>
        <p className="text-muted-foreground">Send message to your coach</p>
      </div>
      <div className="glass-card rounded-2xl p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-500/20 to-indigo-600/20 rounded-xl flex items-center justify-center">
            <MessageSquare className="w-6 h-6 text-indigo-500" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">Message Coach</h2>
            <p className="text-sm text-muted-foreground">Manage message coach</p>
          </div>
        </div>
        <p className="text-muted-foreground">This page is under development. Content will be available soon.</p>
      </div>
    </div>
  )
}
