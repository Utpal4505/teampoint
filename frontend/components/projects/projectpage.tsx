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
import { FolderKanban, Lightbulb, Plus } from 'lucide-react'

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
  const sampleProject = projects.find(
    project =>
      project.name.toLowerCase().includes('your first product') ||
      project.description.toLowerCase().includes('sample project'),
  )
  const showStarterHints = Boolean(sampleProject && projects.length <= 1)

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
        {showStarterHints && sampleProject && (
          <div className="mb-6 grid gap-3 lg:grid-cols-2">
            <button
              type="button"
              onClick={() => handleProjectClick(sampleProject)}
              className="flex items-start gap-3 rounded-xl border border-border bg-card px-4 py-3 text-left
                transition-all duration-150 hover:border-border/80 hover:bg-accent/40"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Lightbulb size={16} />
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-semibold text-foreground">
                  Start with the sample project
                </span>
                <span className="mt-1 block text-xs leading-relaxed text-muted-foreground">
                  It has sample tasks, members, discussions, and a document so you can
                  see how TeamPoint works before adding real work.
                </span>
              </span>
            </button>

            <button
              type="button"
              onClick={() => setModalOpen(true)}
              className="flex items-start gap-3 rounded-xl border border-border bg-card px-4 py-3 text-left
                transition-all duration-150 hover:border-border/80 hover:bg-accent/40"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
                <FolderKanban size={16} />
              </span>
              <span className="min-w-0">
                <span className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  Create your first real project
                  <Plus size={13} className="text-muted-foreground" />
                </span>
                <span className="mt-1 block text-xs leading-relaxed text-muted-foreground">
                  Use New Project when you are ready. You can add teammates now or
                  keep it solo and invite people later.
                </span>
              </span>
            </button>
          </div>
        )}

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
