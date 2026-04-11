"use client"

import * as React from "react"
import Link from "next/link"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { LayoutDashboardIcon, FilmIcon, UsersIcon, TagIcon, ListIcon, MessageSquareIcon, UserIcon } from "lucide-react"
import { useMe } from "@/lib/hooks/useAuth"

const data = {
  navMain: [
    {
      title: "Beranda Dashboard",
      url: "/dashboard/admin",
      icon: (
        <LayoutDashboardIcon
        />
      ),
    },
    {
      title: "Film & Tayangan",
      url: "/dashboard/admin/films",
      icon: (
        <FilmIcon
        />
      ),
    },
    {
      title: "Genre",
      url: "/dashboard/admin/genres",
      icon: (
        <TagIcon
        />
      ),
    },
    {
      title: "Film Lists",
      url: "/dashboard/admin/film-lists",
      icon: (
        <ListIcon
        />
      ),
    },
    {
      title: "Reviews",
      url: "/dashboard/admin/reviews",
      icon: (
        <MessageSquareIcon
        />
      ),
    },
    {
      title: "Profile",
      url: "/dashboard/admin/profile",
      icon: (
        <UserIcon
        />
      ),
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: userData } = useMe();
  const personalInfo = userData?.data?.personal_info;
  const userName = personalInfo?.display_name || personalInfo?.username || "Admin";
  const userEmail = personalInfo?.email || "admin@watchify.com";
  
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5! justify-center"
            >
              <Link href="/">
                <span className="text-xl font-black tracking-widest text-primary">
                  WATCHIFY
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={{name: userName, email: userEmail, avatar: ""}} />
      </SidebarFooter>
    </Sidebar>
  )
}
