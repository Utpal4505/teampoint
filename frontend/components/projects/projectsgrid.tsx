import ProjectCard from './projectcard'
import type { Project } from '@/features/projects/types'

interface ProjectsGridProps {
  projects: Project[]
  onProjectClick: (project: Project) => void
}

export default function ProjectsGrid({ projects, onProjectClick }: ProjectsGridProps) {
  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {projects.map(project => (
        <ProjectCard
          key={project.id}
          project={project}
          onClick={onProjectClick}
        />
      ))}
    </div>
  )
}