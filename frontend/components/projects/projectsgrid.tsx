import ProjectCard from './projectcard'
import type { Project } from '@/features/projects/types'

interface ProjectsGridProps {
  projects: Project[]
  onProjectClick: (project: Project) => void
}

export default function ProjectsGrid({ projects, onProjectClick }: ProjectsGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 align-content gap-6">
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