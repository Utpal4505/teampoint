import type { Project, ListAllWorkspaceProjectDTO } from './types'

export function mapProjects(dto: ListAllWorkspaceProjectDTO): Project[] {
  return dto.map(project => ({
    id: String(project.id),
    name: project.name,
    description: project.description ?? '',
    status: project.status,

    totalTasks: 0,
    doneTasks: 0,
    members: [],

    createdAt: project.createdAt,
  }))
}
