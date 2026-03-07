'use client'

import * as React from 'react'

import { NavMain } from '@/components/nav-main'
import { NavProjects } from '@/components/nav-projects'
import { NavUser } from '@/components/nav-user'
import { WorkspaceSwitcher } from '@/components/team-switcher'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar'
import {
  FrameIcon,
  PieChartIcon,
  MapIcon,
  CheckSquareIcon,
  LayoutDashboardIcon,
} from 'lucide-react'
import { useUserStore } from '@/store/user.store'

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const user = useUserStore(state => state.user)

  const data = {
    user: {
      name: user?.fullName || 'John Doe',
      email: user?.email || 'john@example.com',
      avatar: user?.avatarUrl || 'https://galaxypfp.com/wp-content/uploads/2025/10/anime-boy-pfp-aestheticv.webp',
    },
    teams: [
      {
        name: 'Acme Inc',
        id: 1,
      },
      {
        name: 'Acme Corp.',
        id: 2,
      },
      {
        name: 'Evil Corp.',
        id: 3,
      },
    ],

    navMain: [
      {
        title: 'Dashboard',
        url: '/workspace/1/dashboard',
        icon: <LayoutDashboardIcon />,
      },
      {
        title: 'My Tasks',
        url: '/workspace/1/tasks',
        icon: <CheckSquareIcon />,
      },
    ],
    projects: [
      {
        name: 'Design Engineering',
        url: '#',
        icon: <FrameIcon />,
      },
      {
        name: 'Sales & Marketing',
        url: '#',
        icon: <PieChartIcon />,
      },
      {
        name: 'Travel',
        url: '#',
        icon: <MapIcon />,
      },
    ],
  }

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <WorkspaceSwitcher workspaces={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
