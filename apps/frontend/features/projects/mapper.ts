import type { Project, ListAllWorkspaceProjectDTO } from './types'

export function mapProjects(dto: ListAllWorkspaceProjectDTO): Project[] {
  return dto.map(project => ({
    id: String(project.id),
    name: project.name,
    description: project.description ?? '',
    status: project.status,

    totalTasks: project.totalTasks,
    doneTasks: project.doneTasks,
    members: project.members.map(member => ({
      id: String(member.id),
      name: member.name,
      avatarUrl: member.avatarUrl ?? '',
    })),

    createdAt: project.createdAt,
  }))
}
