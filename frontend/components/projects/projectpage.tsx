'use client'

import { useState } from 'react'
import { SidebarInset } from '@/components/ui/sidebar'
import { Project, ViewMode } from '@/features/projects/types'
import ProjectsToolbar, { StatusFilter } from './projectstoolbar'
import ProjectsHeader from './projectsheader'
import ProjectsEmpty from './projectsempty'
import ProjectsGrid from './projectsgrid'
import ProjectsListView from './projectslistview'
import { CreateProjectModal } from '@/components/projects/create-project'
import { useRouter } from 'next/navigation'
import { useListAllWorkspaceProjects } from '@/features/projects/hooks'

interface ProjectsPageProps {
  workspaceId: string
}

export default function ProjectsPage({ workspaceId }: ProjectsPageProps) {
  const [view, setView] = useState<ViewMode>('card')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('ALL')
  const [statusOpen, setStatusOpen] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)

  const router = useRouter()
  const { data: projects = [], isLoading } = useListAllWorkspaceProjects(
    Number(workspaceId),
  )

  const filtered = projects.filter(
    p => statusFilter === 'ALL' || p.status === statusFilter,
  )

  if (isLoading) {
    return (
      <SidebarInset>
        <div className="p-6">Loading projects...</div>
      </SidebarInset>
    )
  }

  function handleProjectClick(project: Project) {
    router.push(`/workspace/${workspaceId}/projects/${project.id}`)
  }

  function handleStatusChange(v: StatusFilter) {
    setStatusFilter(v)
    setStatusOpen(false)
  }

  return (
    <SidebarInset>
      <ProjectsHeader />

      <ProjectsToolbar
        view={view}
        onViewChange={setView}
        statusFilter={statusFilter}
        onStatusChange={handleStatusChange}
        statusOpen={statusOpen}
        onStatusToggle={() => setStatusOpen(o => !o)}
        onNewProject={() => setModalOpen(true)}
      />

      <div className="flex-1 overflow-auto p-6">
        {filtered.length === 0 ? (
          <ProjectsEmpty />
        ) : view === 'card' ? (
          <ProjectsGrid projects={filtered} onProjectClick={handleProjectClick} />
        ) : (
          <ProjectsListView projects={filtered} onProjectClick={handleProjectClick} />
        )}
      </div>

      <CreateProjectModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        workspaceId={workspaceId}
      />
    </SidebarInset>
  )
}
