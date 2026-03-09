export interface AssignedTask {
  id: number
  title: string
  status: string
  priority: string
  dueDate: string | null
  project: {
    id: number
    name: string
  } | null
  assignedTo: {
    id: number
    name: string
  } | null
}

export type Priority = 'URGENT' | 'HIGH' | 'MEDIUM' | 'LOW'
export type Status = 'TODO' | 'IN_PROGRESS' | 'DONE' | 'CANCELLED'
export type TaskType = 'PERSONAL' | 'PROJECT'
export type ViewMode = 'kanban' | 'list'

export interface Task {
  id: number
  title: string
  priority: Priority
  status: Status
  dueDate: string | null
  project: string | null
  assignee: string
  type: TaskType
  description: string
}

export interface Filters {
  status: Status[]
  priority: Priority[]
  type: TaskType[]
}

export interface PriorityConfigEntry {
  label: string
  color: string
  bg: string
  dot: string
  Icon: React.ElementType
}

export interface StatusConfigEntry {
  label: string
  color: string
  bg: string
  Icon: React.ElementType
}

export interface ColumnStyle {
  label: string
  accent: string
  border: string
  glow: string
}

export interface PriorityOption {
  value: Priority
  label: string
  Icon: React.ElementType
  color: string
  activeBg: string
}
