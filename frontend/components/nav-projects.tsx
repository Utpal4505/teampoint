'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'

import {
  MoreHorizontalIcon,
  SettingsIcon,
  Trash2Icon,
  PlusIcon,
  FolderKanban,
  ArrowRight,
} from 'lucide-react'

import {
  CreateProjectModal,
  CreateProjectPayload,
  ProjectMemberPayload,
} from '@/components/projects/create-project'

const MAX_VISIBLE = 3

export function NavProjects({
  projects,
  workspaceId,
}: {
  projects: { name: string; url: string }[]
  workspaceId: string
}) {
  const { isMobile } = useSidebar()
  const router = useRouter()
  const [modalOpen, setModalOpen] = useState(false)

  const visibleProjects = projects.slice(0, MAX_VISIBLE)
  const hasMore = projects.length > MAX_VISIBLE

  async function handleCreateProject(
    project: CreateProjectPayload,
    members: ProjectMemberPayload[],
  ) {
    console.log('Create project payload:', project, members)
  }

  return (
    <>
      <SidebarGroup className="group-data-[collapsible=icon]:hidden">
        <div className="flex items-center justify-between mb-2">
          <SidebarGroupLabel>Projects</SidebarGroupLabel>
          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center justify-center h-6 w-6 rounded-md
              text-muted-foreground transition-all duration-150
              hover:text-foreground hover:bg-sidebar-accent
              focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            <PlusIcon size={14} />
          </button>
        </div>

        <SidebarMenu>
          {visibleProjects.map(project => (
            <SidebarMenuItem key={project.name}>
              <SidebarMenuButton asChild>
                <a href={project.url}>
                  <FolderKanban />
                  <span>{project.name}</span>
                </a>
              </SidebarMenuButton>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuAction showOnHover>
                    <MoreHorizontalIcon />
                  </SidebarMenuAction>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  className="w-48 rounded-lg"
                  side={isMobile ? 'bottom' : 'right'}
                  align={isMobile ? 'end' : 'start'}
                >
                  <DropdownMenuItem>
                    <FolderKanban />
                    <span>Open Project</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <SettingsIcon />
                    <span>Project Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="group flex items-center cursor-pointer rounded-md outline-none
                      transition-all duration-200
                      hover:bg-destructive/10 hover:text-destructive
                      focus:bg-destructive/10 focus:text-destructive"
                  >
                    <Trash2Icon className="h-4 w-4 transition-transform duration-200 group-hover:scale-110 group-hover:rotate-3" />
                    <span className="text-sm font-medium">Delete Project</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          ))}

          {hasMore && (
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={() => router.push(`/workspace/${workspaceId}/projects`)}
                className="text-muted-foreground hover:text-foreground group"
              >
                <ArrowRight
                  size={14}
                  className="transition-transform duration-150 group-hover:translate-x-0.5"
                />
                <span>View All Projects</span>
                <span
                  className="ml-auto text-[10px] font-medium tabular-nums
                  rounded-full bg-muted px-1.5 py-0.5 text-muted-foreground"
                >
                  {projects.length}
                </span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}
        </SidebarMenu>
      </SidebarGroup>

      <CreateProjectModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        workspaceId={workspaceId}
        onSubmit={handleCreateProject}
      />
    </>
  )
}
