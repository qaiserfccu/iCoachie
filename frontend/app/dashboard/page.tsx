import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar"
import { StatsCards } from "@/components/dashboard/stats-cards"
import { ScheduleWidget } from "@/components/dashboard/schedule-widget"
import { AttendanceWidget } from "@/components/dashboard/attendance-widget"
import { ProgressWidget } from "@/components/dashboard/progress-widget"
import { RecentActivityWidget } from "@/components/dashboard/recent-activity-widget"
import { QuickActionsWidget } from "@/components/dashboard/quick-actions-widget"
import { ProtectedRoute } from "@/lib/components/ProtectedRoute"

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen gradient-mesh relative overflow-hidden">
        <div className="orb orb-blue w-96 h-96 -top-48 -left-48 fixed opacity-40" />
        <div className="orb orb-teal w-80 h-80 top-1/4 -right-40 fixed opacity-40" style={{ animationDelay: "2s" }} />
        <div className="orb orb-yellow w-64 h-64 bottom-20 left-1/4 fixed opacity-30" style={{ animationDelay: "4s" }} />
        <div className="orb orb-green w-72 h-72 -bottom-36 right-1/3 fixed opacity-30" style={{ animationDelay: "6s" }} />

        <div className="relative z-10">
          <DashboardSidebar />
          <div className="lg:pl-64">
            <DashboardHeader />
            <main className="p-4 lg:p-6 space-y-6">
              <div>
                <h1 className="text-2xl font-bold text-foreground">Welcome back, Coach!</h1>
                <p className="text-muted-foreground">Here's what's happening with your coaching today.</p>
              </div>

              <StatsCards />

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                  <ScheduleWidget />
                  <AttendanceWidget />
                </div>
                <div className="space-y-6">
                  <QuickActionsWidget />
                  <ProgressWidget />
                  <RecentActivityWidget />
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
