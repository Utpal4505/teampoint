export type ProjectStatus = 'ACTIVE' | 'ONHOLD' | 'COMPLETED' | 'DELETED'
export type ViewMode = 'card' | 'list'

export interface ProjectMember {
  id: string
  name: string
  avatarUrl?: string
}

export interface Project {
  id: string
  name: string
  description: string
  status: ProjectStatus
  totalTasks: number
  doneTasks: number
  members: ProjectMember[]
  createdAt: string
}

export type ListAllWorkspaceProjectDTO = {
  id: number
  name: string
  description: string | null
  status: ProjectStatus
  createdBy: number
  createdAt: string
}[]
