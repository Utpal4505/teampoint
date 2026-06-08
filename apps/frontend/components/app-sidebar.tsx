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
} from '@/components/ui/sidebar'
import { CheckSquareIcon, FolderKanban, MessageSquareIcon, Video, Users } from 'lucide-react'
import { useUserStore } from '@/store/user.store'
import { useListUserWorkspaces } from '@/features/workspace/hooks'
import { useParams } from 'next/navigation'
import { WorkspaceSwitcher } from './workspace-switcher'
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
      title: 'My Tasks',
      url: `/workspace/${activeWorkspaceId}/tasks`,
      icon: <CheckSquareIcon />,
    },
    {
      title: 'Meetings',
      url: `/workspace/${activeWorkspaceId}/meetings`,
      icon: <Video />,
    },
    {
      title: 'Members',
      url: `/workspace/${activeWorkspaceId}/members`,
      icon: <Users />,
    },
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
        {/* Projects - single icon linking to projects page */}
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Projects">
                <Link
                  href={`/workspace/${activeWorkspaceId}/projects`}
                  data-tour="sidebar-projects"
                >
                  <FolderKanban />
                  <span>Projects</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        <NavMain items={navMain} />

        {/* Support */}
        <SidebarGroup>
          <SidebarGroupLabel>Support</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Feedback">
                <Link href={`/feedback`}>
                  <MessageSquareIcon />
                  <span>Feedback</span>
                </Link>
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
    </Sidebar>
  )
}
