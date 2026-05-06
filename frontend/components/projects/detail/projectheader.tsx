'use client'

import { ProjectDetail } from '@/features/projects/detail/types'
import StatusBadge from './statusbadge'

interface ProjectHeaderProps {
  project: ProjectDetail
  activeTabLabel?: string
}

export default function ProjectHeader({ project, activeTabLabel }: ProjectHeaderProps) {


  return (
    <>
    <div className="px-6 py-5 flex flex-col gap-4">
      {activeTabLabel === 'Overview' ? (
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="font-display text-[22px] font-bold text-foreground leading-tight">
              {project.name}
            </h1>
            <StatusBadge status={project.status} projectId={project.id} />
          </div>
          {project.description && (
            <p className="mt-1 text-[13px] text-muted-foreground max-w-xl leading-relaxed">
              {project.description}
            </p>
          )}
        </div>
      ) : (
        <h1 className="font-display text-[22px] font-bold text-foreground leading-tight">
          {activeTabLabel || project.name}
        </h1>
      )}

    </div>
    </>
  )
}