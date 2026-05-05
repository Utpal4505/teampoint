'use client'

import OverviewTab from '@/components/projects/detail/tabs/overview'
import { useProjectDetailContext } from '@/components/projects/detail/project-detail-context'

export default function OverviewPage() {
  const { project, tasks, documents, onTabChange } = useProjectDetailContext()
  return (
    <OverviewTab
      project={project}
      tasks={tasks}
      documents={documents}
      onTabChange={onTabChange}
    />
  )
}