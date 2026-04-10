import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { RoleGuard } from "@/components/role-guard"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleGuard requiredRole="ADMIN">
      <SidebarProvider
        style={
          {
            "--sidebar-width": "calc(var(--spacing) * 72)",
            "--header-height": "calc(var(--spacing) * 12)",
          } as React.CSSProperties
        }
      >
        <AppSidebar variant="inset" />
        <SidebarInset>
          <SiteHeader />
          <div className="flex flex-1 flex-col overflow-y-auto w-full">
            {children}
          </div>
        </SidebarInset>
      </SidebarProvider>
    </RoleGuard>
  )
}
