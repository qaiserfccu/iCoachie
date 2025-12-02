import type React from "react"
import { HeadCoachSidebar } from "@/components/head-coach/head-coach-sidebar"
import { HeadCoachHeader } from "@/components/head-coach/head-coach-header"

export default function HeadCoachLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen gradient-mesh relative overflow-hidden">
      <div className="orb orb-blue w-96 h-96 -top-48 -left-48 fixed opacity-40" />
      <div className="orb orb-teal w-80 h-80 top-1/4 -right-40 fixed opacity-40" style={{ animationDelay: "2s" }} />
      <div className="orb orb-yellow w-64 h-64 bottom-20 left-1/4 fixed opacity-30" style={{ animationDelay: "4s" }} />
      <div className="orb orb-green w-72 h-72 -bottom-36 right-1/3 fixed opacity-30" style={{ animationDelay: "6s" }} />

      <div className="relative z-10">
        <HeadCoachSidebar />
        <div className="lg:pl-72">
          <HeadCoachHeader />
          <main className="p-4 lg:p-6">{children}</main>
        </div>
      </div>
    </div>
  )
}
