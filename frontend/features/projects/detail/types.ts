// ── Project Detail ─────────────────────────────────────────
export type ProjectStatus = 'ACTIVE' | 'ON_HOLD' | 'COMPLETED' | 'DELETED'
export type ProjectRole = 'OWNER' | 'ADMIN' | 'MEMBER'

export interface ProjectMember {
  role: ProjectRole
  joinedAt: string
  user: {
    id: number
    fullName: string
    avatarUrl: string | null
  }
}

export interface ProjectDetail {
  id: number
  workspaceId: number
  name: string
  description: string | null
  status: ProjectStatus
  createdBy: number
  projectMembers: ProjectMember[]
  createdAt: string
}

// ── Project Tasks ──────────────────────────────────────────
export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE' | 'CANCELLED'
export type TaskPriority = 'URGENT' | 'HIGH' | 'MEDIUM' | 'LOW'
export type TaskType = 'PERSONAL' | 'PROJECT'

export interface ProjectTask {
  id: number
  title: string
  status: TaskStatus
  priority: TaskPriority
  dueDate: string | null
  assignedTo: {
    id: number
    name: string
    avatarUrl?: string
  } | null
}

// ── Documents ─────────────────────────────────────────────
export interface ProjectDocument {
  id: number
  title: string
  description: string | null
  fileKey: string
  fileType: string
  uploadedBy: number
  isArchived: boolean
  createdAt: string
  updatedAt: string
}

// ── Overview Stats ────────────────────────────────────────
export interface ProjectStats {
  totalTasks: number
  todoTasks: number
  inProgressTasks: number
  doneTasks: number
  totalMembers: number
  totalDocuments: number
}
