'use client'

import { useState } from 'react'
import { SidebarInset } from '@/components/ui/sidebar'
import { Project, ViewMode } from '@/features/projects/types'
import ProjectsToolbar, { StatusFilter } from './projectstoolbar'
import { MOCK_PROJECTS } from '@/features/projects/constants'
import ProjectsHeader from './projectsheader'
import ProjectsEmpty from './projectsempty'
import ProjectsGrid from './projectsgrid'
import ProjectsListView from './projectslistview'
import {
  CreateProjectModal,
  CreateProjectPayload,
  ProjectMemberPayload,
} from '@/components/projects/create-project'
import { useRouter } from 'next/navigation'

interface ProjectsPageProps {
  workspaceId: string
}

export default function ProjectsPage({ workspaceId }: ProjectsPageProps) {
  const [view, setView] = useState<ViewMode>('card')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('ALL')
  const [statusOpen, setStatusOpen] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)

  const router = useRouter()

  const filtered = MOCK_PROJECTS.filter(
    p => statusFilter === 'ALL' || p.status === statusFilter,
  )

  function handleProjectClick(project: Project) {
    router.push(`/workspace/${workspaceId}/projects/${project.id}`)
  }

  function handleStatusChange(v: StatusFilter) {
    setStatusFilter(v)
    setStatusOpen(false)
  }

  async function handleCreateProject(
    project: CreateProjectPayload,
    members: ProjectMemberPayload[],
  ) {
    // TODO: wire API
    console.log('Create project:', project, members)
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
        onSubmit={handleCreateProject}
      />
    </SidebarInset>
  )
}
