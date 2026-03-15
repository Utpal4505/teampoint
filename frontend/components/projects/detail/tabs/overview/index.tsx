'use client'

import type {
  ProjectDetail,
  ProjectTask,
  ProjectDocument,
} from '@/features/projects/detail/types'
import { type PriorityKey } from './constants'

import OverviewKpiStrip from './overviewKpiStrip'
import OverviewProgressCard from './overviewProgressCard'
import OverviewPriorityCard from './overviewPriorityCard'
import OverviewProjectInfoCard from './overviewProjectInfoCard'
import OverviewRecentTasks from './overviewRecentTasks'
import OverviewTeamWorkload from './overviewTeamWorkload'
import OverviewAttentionCard from './overviewAttentionCard'
import OverviewResourcesCard from './overviewResourcesCard'
import { TabKey } from '../../projectdetailpage'

interface OverviewTabProps {
  project: ProjectDetail
  tasks: ProjectTask[]
  documents: ProjectDocument[]
  onTabChange: (tab: TabKey) => void
}

export default function OverviewTab({
  project,
  tasks,
  documents,
  onTabChange,
}: OverviewTabProps) {
  // ── Derived counts ─────────────────────────────────────────
  const total = tasks.length
  const done = tasks.filter(t => t.status === 'DONE').length
  const inProgress = tasks.filter(t => t.status === 'IN_PROGRESS').length
  const todo = tasks.filter(t => t.status === 'TODO').length
  const cancelled = tasks.filter(t => t.status === 'CANCELLED').length
  const pct = total > 0 ? Math.round((done / total) * 100) : 0
  const activeTasks = tasks.filter(t => t.status !== 'CANCELLED')

  // ── Date-based filters ─────────────────────────────────────
  const now = new Date()
  const in7 = new Date()
  in7.setDate(in7.getDate() + 7)

  const overdue = tasks.filter(
    t =>
      t.dueDate &&
      new Date(t.dueDate) < now &&
      t.status !== 'DONE' &&
      t.status !== 'CANCELLED',
  )
  const dueSoon = tasks.filter(
    t =>
      t.dueDate &&
      new Date(t.dueDate) >= now &&
      new Date(t.dueDate) <= in7 &&
      t.status !== 'DONE' &&
      t.status !== 'CANCELLED',
  )

  // ── Priority breakdown ─────────────────────────────────────
  const byPriority = (['URGENT', 'HIGH', 'MEDIUM', 'LOW'] as PriorityKey[]).map(p => ({
    key: p,
    count: activeTasks.filter(t => t.priority === p).length,
  }))

  // ── Member workload ────────────────────────────────────────
  const memberWorkload = project.projectMembers
    .map(m => {
      const assigned = tasks.filter(
        t => t.assignedTo?.id === m.user.id && t.status !== 'CANCELLED',
      )
      const doneCount = assigned.filter(t => t.status === 'DONE').length
      return { member: m, total: assigned.length, done: doneCount }
    })
    .sort((a, b) => b.total - a.total)

  // ── Recent tasks (max 6) ───────────────────────────────────
  const recentTasks = activeTasks.slice(0, 6)

  // ── Project info ───────────────────────────────────────────
  const owner = project.projectMembers.find(m => m.role === 'OWNER')
  const createdAt = new Date(project.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })

  return (
    <div className="p-6 flex flex-col gap-4">
      {/* Row 1 — KPI strip */}
      <OverviewKpiStrip
        total={total}
        done={done}
        inProgress={inProgress}
        pct={pct}
        overdueCount={overdue.length}
        dueSoonCount={dueSoon.length}
      />

      {/* Row 2 — Progress / Priority / Info */}
      <div className="grid grid-cols-12 gap-4">
        <OverviewProgressCard
          pct={pct}
          total={total}
          done={done}
          todo={todo}
          inProgress={inProgress}
        />
        <OverviewPriorityCard
          byPriority={byPriority}
          activeTotal={activeTasks.length}
          cancelled={cancelled}
          onTabChange={onTabChange}
        />
        <OverviewProjectInfoCard
          ownerName={owner?.user.fullName ?? null}
          createdAt={createdAt}
          memberCount={project.projectMembers.length}
          documentCount={documents.length}
          description={project.description}
        />
      </div>

      {/* Row 3 — Recent Tasks */}
      <OverviewRecentTasks
        tasks={recentTasks}
        activeTotal={activeTasks.length}
        onTabChange={onTabChange}
      />

      {/* Row 4 — Team Workload + Attention + Resources */}
      <div className="grid grid-cols-12 gap-4">
        <OverviewTeamWorkload workload={memberWorkload} onTabChange={onTabChange} />

        <div className="col-span-5 flex flex-col gap-4">
          <OverviewAttentionCard overdue={overdue} dueSoon={dueSoon} />
          <OverviewResourcesCard
            documentCount={documents.length}
            onTabChange={onTabChange}
          />
        </div>
      </div>
    </div>
  )
}
