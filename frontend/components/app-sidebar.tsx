'use client'

import * as React from 'react'
import { NavMain } from '@/components/nav-main'
import { NavUser } from '@/components/nav-user'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '@/components/ui/sidebar'
import { CheckSquareIcon, LayoutDashboardIcon, MessageSquareIcon } from 'lucide-react'
import { useUserStore } from '@/store/user.store'
import { useListUserWorkspaces } from '@/features/workspace/hooks'
import { useParams } from 'next/navigation'
import { WorkspaceSwitcher } from './workspace-switcher'
import { NavProjects } from './nav-projects'
import { useListAllWorkspaceProjects } from '@/features/projects/hooks'
import Link from 'next/link'

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const user = useUserStore(state => state.user)
  const { data: workspaces } = useListUserWorkspaces()
  const params = useParams()
  const activeWorkspaceId = params.workspaceId as string

  const workspacesData =
    workspaces?.map(ws => ({
      name: ws.name,
      workspaceId: String(ws.id),
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

  const { data: projectsData = [] } = useListAllWorkspaceProjects(
    Number(activeWorkspaceId),
  )

  const projects = projectsData.map(p => ({
    name: p.name,
    url: `/workspace/${activeWorkspaceId}/projects/${p.id}`,
  }))

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
        <SidebarGroup>
          <SidebarGroupLabel>Support</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <a href={`/workspace/${activeWorkspaceId}/feedback`}>
                  <MessageSquareIcon />
                  <span>Feedback</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
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
