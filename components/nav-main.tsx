"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: React.ReactNode
  }[]
}) {
  const pathname = usePathname()

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2 pt-4">
        <SidebarMenu>
          {items.map((item) => {
            // Exact match untuk dashboard utama, startsWith untuk sub-pages
            const isActive = pathname === item.url || 
              (item.url !== '/dashboard/admin' && pathname?.startsWith(item.url + '/'))
            return (
              <SidebarMenuItem key={item.title} className="mb-2">
                <SidebarMenuButton 
                  asChild 
                  tooltip={item.title} 
                  isActive={isActive}
                  className={`h-[50px] px-4 text-[15px] font-bold tracking-wide transition-all rounded-xl ${isActive ? '!bg-primary !text-primary-foreground shadow-[0_4px_15px_rgba(var(--primary),0.25)]' : 'text-neutral-400 hover:text-white hover:bg-white/5'}`}
                >
                  <Link href={item.url} className="flex items-center gap-3">
                    <div className={`[&>svg]:w-[22px] [&>svg]:h-[22px] ${isActive ? 'text-primary-foreground' : 'text-neutral-500 group-hover:text-white'}`}>{item.icon}</div>
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
