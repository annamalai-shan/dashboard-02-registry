import { Suspense } from "react"
import { IconCalendar, IconPlus } from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import { AppSidebar } from "@/components/dashboard-02/app-sidebar"
import { ChartRevenue } from "@/components/dashboard-02/chart-revenue"
import {
  DataTable,
  DataTableSkeleton,
} from "@/components/dashboard-02/data-table"
import { RecentActivity } from "@/components/dashboard-02/recent-activity"
import { SiteHeader } from "@/components/dashboard-02/site-header"
import { StatCards } from "@/components/dashboard-02/stat-cards"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"

import data from "./data.json"

export default function Page() {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 64)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <div className="flex flex-col gap-2 px-4 sm:flex-row sm:items-center sm:justify-between lg:px-6">
                <div>
                  <h2 className="text-2xl font-semibold tracking-tight">
                    Overview
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Welcome back — here&apos;s what&apos;s happening across your
                    platform.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <IconCalendar className="size-4" />
                    Last 30 days
                  </Button>
                  <Button size="sm">
                    <IconPlus className="size-4" />
                    New report
                  </Button>
                </div>
              </div>
              <StatCards />
              <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 @3xl/main:grid-cols-5">
                <div className="@3xl/main:col-span-3">
                  <ChartRevenue />
                </div>
                <div className="@3xl/main:col-span-2">
                  <RecentActivity />
                </div>
              </div>
              <Suspense fallback={<DataTableSkeleton />}>
                <DataTable data={data.tableData} />
              </Suspense>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
