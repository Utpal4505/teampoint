'use client'

import { useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { SidebarInset } from '@/components/ui/sidebar'
import {
  useProjectDetail,
  useProjectTasks,
  useProjectDocuments,
  useUpdateProjectTaskStatus,
} from '@/features/projects/detail/hooks'
import type { TaskStatus } from '@/features/projects/detail/types'
import EditProjectModal from '@/components/projects/detail/editprojectmodal'
import DeleteConfirmModal from '@/components/projects/detail/deleteconfirmmodal'
import MembersDrawer from '@/components/projects/detail/membersdrawer'
import ProjectContextualSidebar from '@/components/projects/detail/projectContextualSidebar'
import {
  Loader2,
  BarChart2,
  FileText,
  Users,
  CalendarDays,
  ListChecks,
  MessageSquare,
} from 'lucide-react'
import { ProjectDetailContext, TabKey } from './project-detail-context'
import {
  useDiscussionSocketEvents,
  useProjectDiscussions,
} from '@/features/discussions/hooks'

export type ModalState =
  | { type: 'none' }
  | { type: 'edit' }
  | { type: 'delete' }
  | { type: 'members' }

const TABS: { key: TabKey; label: string; Icon: React.ElementType }[] = [
  { key: 'overview', label: 'Overview', Icon: BarChart2 },
  { key: 'tasks', label: 'Tasks', Icon: ListChecks },
  { key: 'documents', label: 'Documents', Icon: FileText },
  { key: 'members', label: 'Members', Icon: Users },
  { key: 'meetings', label: 'Meetings', Icon: CalendarDays },
  { key: 'discussions', label: 'Discussions', Icon: MessageSquare },
]

interface ProjectLayoutShellProps {
  workspaceId: number
  projectId: number
  children: React.ReactNode
}

export default function ProjectLayoutShell({
  workspaceId,
  projectId,
  children,
}: ProjectLayoutShellProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [modal, setModal] = useState<ModalState>({ type: 'none' })

  const { data: project, isLoading: projectLoading } = useProjectDetail(projectId)
  const { data: tasks = [], isLoading: tasksLoading } = useProjectTasks(projectId)
  const { data: documents = [] } = useProjectDocuments(projectId)
  const { data: discussions = [] } = useProjectDiscussions(projectId)
  const { mutate: updateTaskStatus } = useUpdateProjectTaskStatus(projectId)
  useDiscussionSocketEvents(projectId)

  const base = `/workspace/${workspaceId}/projects/${projectId}`

  const activeTab = (TABS.find(
    t => pathname.endsWith(`/${t.key}`) || pathname.includes(`/${t.key}/`),
  )?.key ??
    'overview') as TabKey
  const activeTabLabel = TABS.find(t => t.key === activeTab)?.label ?? 'Overview'

  function onTabChange(tab: TabKey) {
    router.push(`${base}/${tab}`)
  }

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

  const sidebarMembers = (project.projectMembers ?? []).map(m => {
    return {
      id: m.user.id.toString(),
      name: m.user.fullName,
      avatarUrl: m.user.avatarUrl ?? undefined,
    }
  })
  const sidebarDiscussions = discussions.slice(0, 8).map(discussion => ({
    id: discussion.id.toString(),
    name: discussion.title,
    href: `${base}/discussions/${discussion.id}`,
    count: discussion.messageCount,
    unread: discussion.status === 'OPEN' && discussion.updatedAt !== discussion.createdAt,
  }))

  return (
    <ProjectDetailContext.Provider
      value={{
        workspaceId,
        projectId,
        project,
        tasks,
        documents,
        isLoading: tasksLoading,
        onTabChange,
        onStatusChange: (taskId, status) =>
          updateTaskStatus({ taskId, status: status as TaskStatus }),
      }}
    >
      <SidebarInset className="flex flex-row p-0 overflow-hidden h-svh">
        {/* ── Contextual Sidebar ── */}
        <ProjectContextualSidebar
          workspaceId={workspaceId}
          projectId={projectId}
          projectName={project.name}
          members={sidebarMembers}
          channels={sidebarDiscussions}
          userRole={'MEMBER'}
          totalTasks={tasks.length}
          doneTasks={tasks.filter(t => t.status === 'DONE').length}
          onRename={() => setModal({ type: 'edit' })}
          onManageMembers={() => setModal({ type: 'members' })}
          onInviteMembers={() => setModal({ type: 'members' })}
          onDelete={() => setModal({ type: 'delete' })}
          onLeave={() => setModal({ type: 'delete' })}
        />

        {/* ── Main Content ── */}
        <div className="flex flex-1 flex-col min-w-0 overflow-hidden">
          {/* ── Sticky Header ── */}
          <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur-sm">
            {/* Breadcrumb: Projects / Project Name / Tab */}
            <div className="flex h-11 items-center gap-1.5 px-6">
              <span
                className="text-xs text-muted-foreground cursor-pointer hover:text-foreground transition-colors"
                onClick={() => router.push(`/workspace/${workspaceId}/projects`)}
              >
                Projects
              </span>
              <span className="text-xs text-muted-foreground/40">/</span>
              <span
                className="text-xs text-muted-foreground cursor-pointer hover:text-foreground transition-colors truncate max-w-40"
                onClick={() => router.push(`${base}/overview`)}
              >
                {project.name}
              </span>
              <span className="text-xs text-muted-foreground/40">/</span>
              <span className="text-xs text-foreground font-medium">
                {activeTabLabel}
              </span>
            </div>

            {/* Route-based Tabs */}
            {/* <div className="flex items-center gap-0.5 px-4 border-t border-border/40 bg-background/60">
              {TABS.map(({ key, label, Icon }) => {
                const isActive = activeTab === key
                return (
                  <Link
                    key={key}
                    href={`${base}/${key}`}
                    className={`
                      relative flex items-center gap-2 px-3.5 py-3 text-xs font-medium
                      transition-all duration-200 rounded-t-lg group
                      ${isActive ? 'text-foreground' : 'text-muted-foreground hover:text-foreground/80'}
                    `}
                  >
                    <Icon
                      size={13}
                      className={`shrink-0 transition-colors duration-200 ${
                        isActive
                          ? 'text-primary'
                          : 'text-muted-foreground/60 group-hover:text-muted-foreground'
                      }`}
                    />
                    <span className="tracking-wide">{label}</span>

                    {isActive && (
                      <span
                        className="absolute bottom-0 left-2 right-2 h-0.5 rounded-full"
                        style={{
                          background:
                            'linear-gradient(90deg, oklch(0.55 0.18 262), oklch(0.65 0.16 262))',
                          boxShadow: '0 0 6px oklch(0.6 0.16 262 / 0.6)',
                        }}
                      />
                    )}
                    {!isActive && (
                      <span className="absolute inset-0 rounded-t-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-accent/40" />
                    )}
                  </Link>
                )
              })}
            </div> */}
          </header>

          {/* ── Tab content ── */}
          <div className="flex-1 overflow-auto">{children}</div>
        </div>

        <EditProjectModal
          open={modal.type === 'edit'}
          onClose={() => setModal({ type: 'none' })}
          project={project}
        />
        <DeleteConfirmModal
          open={modal.type === 'delete'}
          onClose={() => setModal({ type: 'none' })}
          projectId={project.id}
          projectName={project.name}
          workspaceId={workspaceId}
        />
        <MembersDrawer
          open={modal.type === 'members'}
          onClose={() => setModal({ type: 'none' })}
          members={project.projectMembers}
        />
      </SidebarInset>
    </ProjectDetailContext.Provider>
  )
}
