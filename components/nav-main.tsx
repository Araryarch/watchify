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
            // Exact match untuk semua menu
            const isActive = pathname === item.url;
            
            return (
              <SidebarMenuItem key={item.title} className="mb-2">
                <SidebarMenuButton 
                  asChild 
                  tooltip={item.title}
                  className={`h-[50px] px-4 text-[15px] font-bold tracking-wide transition-all rounded-xl data-[state=open]:bg-transparent ${isActive ? 'bg-primary text-primary-foreground shadow-[0_4px_15px_rgba(var(--primary),0.25)] hover:bg-primary' : 'text-neutral-400 hover:text-white hover:bg-white/5'}`}
                >
                  <Link href={item.url} className="flex items-center gap-3 w-full">
                    <div className={`[&>svg]:w-[22px] [&>svg]:h-[22px] ${isActive ? 'text-primary-foreground' : 'text-neutral-500'}`}>{item.icon}</div>
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
