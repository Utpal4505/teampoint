'use client'

import * as React from 'react'
import { NavMain } from '@/components/nav-main'
import { NavUser } from '@/components/nav-user'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar'
import { CheckSquareIcon, LayoutDashboardIcon } from 'lucide-react'
import { useUserStore } from '@/store/user.store'
import { useListUserWorkspaces } from '@/features/workspace/hooks'
import { useParams } from 'next/navigation'
import { WorkspaceSwitcher } from './workspace-switcher'
import { NavProjects } from './nav-projects'

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const user = useUserStore(state => state.user)
  const { data: workspaces } = useListUserWorkspaces()
  const params = useParams()
  const activeWorkspaceId = params.workspaceId as string

  const workspacesData =
    workspaces?.map(ws => ({
      name: ws.name,
      workspaceId: String(ws.id), // normalise to string throughout
    })) ?? []

  const navMain = [
    {
      title: 'Dashboard',
      url: `/workspace/${activeWorkspaceId}/dashboard`,
      icon: <LayoutDashboardIcon />,
    },
    {
      title: 'My Tasks',
      url: `/workspace/${activeWorkspaceId}/tasks`,
      icon: <CheckSquareIcon />,
    },
  ]

  // TODO: replace with useListProjects(activeWorkspaceId)
  const projects = [
    { name: 'Design Engineering', url: '#' },
    { name: 'Sales & Marketing', url: '#' },
    { name: 'Travel', url: '#' },
  ]

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <WorkspaceSwitcher
          workspaces={workspacesData}
          activeWorkspaceId={activeWorkspaceId}
        />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} />
        <NavProjects projects={projects} workspaceId={activeWorkspaceId} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser
          user={{
            name: user?.fullName ?? 'John Doe',
            email: user?.email ?? 'john@example.com',
            avatar: user?.avatarUrl ?? '',
          }}
        />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
