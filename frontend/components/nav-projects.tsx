'use client'

import { useState } from 'react'

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
} from 'lucide-react'

import {
  CreateProjectModal,
  CreateProjectPayload,
  ProjectMemberPayload,
} from '@/components/projects/create-project'
export function NavProjects({
  projects,
  workspaceId,
}: {
  projects: { name: string; url: string }[]
  workspaceId: string
}) {
  const { isMobile } = useSidebar()
  const [modalOpen, setModalOpen] = useState(false)

  async function handleCreateProject(
    project: CreateProjectPayload,
    members: ProjectMemberPayload[],
  ) {
    // TODO: wire API
    // const { projectId } = await createProject(project)
    // await Promise.all(members.map(m => addProjectMember(projectId, m)))
    // await invalidateProjects()
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
          {projects.map(project => (
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

          <SidebarMenuItem>
            <SidebarMenuButton className="text-muted-foreground">
              View All
            </SidebarMenuButton>
          </SidebarMenuItem>
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
