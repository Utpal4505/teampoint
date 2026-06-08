import { Project } from '@/features/projects/types'
import ProjectListRow from './projectlistrow'

interface ProjectsListViewProps {
  projects: Project[]
  onProjectClick: (project: Project) => void
}

const GRID = '2fr 120px 200px 110px 130px 44px'

export default function ProjectsListView({
  projects,
  onProjectClick,
}: ProjectsListViewProps) {
  return (
    <div className="rounded-xl border border-border overflow-hidden">
      {/* Header */}
      <div
        className="grid border-b border-border bg-muted/30 px-5 py-2.5
          text-[10px] font-bold uppercase tracking-widest text-muted-foreground"
        style={{ gridTemplateColumns: GRID }}
      >
        <span>Project</span>
        <span>Status</span>
        <span>Progress</span>
        <span>Created</span>
        <span>Members</span>
        <span />
      </div>

      {projects.map((project, i) => (
        <ProjectListRow
          key={project.id}
          project={project}
          onClick={onProjectClick}
          last={i === projects.length - 1}
        />
      ))}
    </div>
  )
}
