'use client'

import TasksTab from '@/components/projects/detail/tabs/taskstab'
import { useProjectDetailContext } from '@/components/projects/detail/project-detail-context'

export default function TasksPage() {
  const { project, tasks, isLoading, onStatusChange, projectId, workspaceId } =
    useProjectDetailContext()

  const updatedTasks = tasks.map(t => ({
    ...t,
    project: { id: projectId, name: project.name },
  }))

  return (
    <TasksTab
      tasks={updatedTasks}
      isLoading={isLoading}
      workspaceId={workspaceId}
      onStatusChange={onStatusChange}
      defaultProjectId={String(projectId)}
    />
  )
}
