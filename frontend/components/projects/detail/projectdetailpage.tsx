'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar'
import {
  useProjectDetail,
  useProjectTasks,
  useProjectDocuments,
  useUpdateProjectTaskStatus,
} from '@/features/projects/detail/hooks'
import ProjectHeader from './projectheader'
import ProjectTabs from './projecttabs'
import TasksTab from './tabs/taskstab'
import OverviewTab from './tabs/overviewtab'
import EditProjectModal from './editprojectmodal'
import DeleteConfirmModal from './deleteconfirmmodal'
import MembersDrawer from './membersdrawer'
import { Loader2 } from 'lucide-react'
import type { ProjectStatus } from '@/features/projects/detail/types'

export type TabKey = 'tasks' | 'overview' | 'documents' | 'members'

export type ModalState =
  | { type: 'none' }
  | { type: 'edit' }
  | { type: 'delete' }
  | { type: 'members' }

interface ProjectDetailPageProps {
  workspaceId: number
  projectId: number
}

export default function ProjectDetailPage({ workspaceId, projectId }: ProjectDetailPageProps) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<TabKey>('tasks')
  const [modal, setModal] = useState<ModalState>({ type: 'none' })

  const { data: project, isLoading: projectLoading } = useProjectDetail(projectId)
  const { data: tasks = [], isLoading: tasksLoading } = useProjectTasks(projectId)
  const { data: documents = [] } = useProjectDocuments(projectId)
  const { mutate: updateTaskStatus } = useUpdateProjectTaskStatus(projectId)

  if (projectLoading) {
    return (
      <SidebarInset>
        <div className="flex h-screen items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      </SidebarInset>
    )
  }

  if (!project) {
    return (
      <SidebarInset>
        <div className="flex h-screen items-center justify-center">
          <p className="text-sm text-muted-foreground">Project not found.</p>
        </div>
      </SidebarInset>
    )
  }

  return (
    <SidebarInset>
      {/* Sticky header */}
      <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur-sm">
        <div className="flex h-14 items-center gap-3 px-6">
          <SidebarTrigger className="-ml-1 text-muted-foreground hover:text-foreground transition-colors" />
          <div className="h-4 w-px shrink-0 bg-border" />
          <nav className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span
              className="cursor-pointer hover:text-foreground transition-colors"
              onClick={() => router.push(`/workspace/${workspaceId}/projects`)}
            >
              Projects
            </span>
            <span>/</span>
            <span className="text-foreground font-medium truncate max-w-[200px]">
              {project.name}
            </span>
          </nav>
        </div>

        <ProjectHeader
          project={project}
          tasks={tasks}
          onOpenModal={setModal}
        />
        <ProjectTabs activeTab={activeTab} onTabChange={setActiveTab} />
      </header>

      {/* Tab content */}
      <div className="flex-1 overflow-auto">
        {activeTab === 'tasks' && (
          <TasksTab
            projectId={projectId}
            tasks={tasks}
            isLoading={tasksLoading}
            onStatusChange={(taskId, status) => updateTaskStatus({ taskId, status })}
          />
        )}
        {activeTab === 'overview' && (
          <OverviewTab
            project={project}
            tasks={tasks}
            documents={documents}
            onTabChange={setActiveTab}
          />
        )}
        {activeTab === 'documents' && (
          <div className="flex h-64 items-center justify-center text-sm text-muted-foreground">
            Documents coming soon
          </div>
        )}
        {activeTab === 'members' && (
          <div className="flex h-64 items-center justify-center text-sm text-muted-foreground">
            Members coming soon
          </div>
        )}
      </div>

      {/* ── Modals & Drawers — outside header so z-index works correctly ── */}
      <EditProjectModal
        open={modal.type === 'edit'}
        onClose={() => setModal({ type: 'none' })}
        project={project}
      />

      <DeleteConfirmModal
        open={modal.type === 'delete'}
        onClose={() => setModal({ type: 'none' })}
        projectName={project.name}
      />

      <MembersDrawer
        open={modal.type === 'members'}
        onClose={() => setModal({ type: 'none' })}
        members={project.projectMembers}
      />
    </SidebarInset>
  )
}