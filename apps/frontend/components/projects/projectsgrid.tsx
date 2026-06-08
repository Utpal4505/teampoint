import ProjectCard from './projectcard'
import type { Project } from '@/features/projects/types'

interface ProjectsGridProps {
  projects: Project[]
  onProjectClick: (project: Project) => void
  sampleProjectId?: string
}

export default function ProjectsGrid({
  projects,
  onProjectClick,
  sampleProjectId,
}: ProjectsGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 align-content gap-6">
      {projects.map(project => (
        <ProjectCard
          key={project.id}
          project={project}
          onClick={onProjectClick}
          tourId={project.id === sampleProjectId ? 'sample-project-card' : undefined}
        />
      ))}
    </div>
  )
}
