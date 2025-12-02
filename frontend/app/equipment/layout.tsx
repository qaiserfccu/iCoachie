import type React from "react"
import { EquipmentSidebar } from "@/components/equipment/equipment-sidebar"
import { EquipmentHeader } from "@/components/equipment/equipment-header"

export default function EquipmentLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen gradient-mesh relative overflow-hidden">
      <div className="orb orb-blue w-96 h-96 -top-48 -left-48 fixed opacity-40" />
      <div className="orb orb-teal w-80 h-80 top-1/4 -right-40 fixed opacity-40" style={{ animationDelay: "2s" }} />
      <div className="relative z-10">
        <EquipmentSidebar />
        <div className="lg:pl-72">
          <EquipmentHeader />
          <main className="p-4 lg:p-6">{children}</main>
        </div>
      </div>
    </div>
  )
}
