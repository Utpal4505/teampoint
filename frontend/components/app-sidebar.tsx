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
import { useListUserWorkspaces } from '@/features/workspace/hooks'
import { useParams } from 'next/navigation'

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const user = useUserStore(state => state.user)

  const { data: workspaces } = useListUserWorkspaces()

  const params = useParams()
  const activeWorkspaceId = params.workspaceId as string

  const workspacesData =
    workspaces?.map(ws => ({
      name: ws.name,
      workspaceId: ws.id,
    })) || []

  const data = {
    user: {
      name: user?.fullName || 'John Doe',
      email: user?.email || 'john@example.com',
      avatar:
        user?.avatarUrl ||
        'https://galaxypfp.com/wp-content/uploads/2025/10/anime-boy-pfp-aestheticv.webp',
    },

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
        <WorkspaceSwitcher workspaces={workspacesData} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} workspaceId={activeWorkspaceId} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
