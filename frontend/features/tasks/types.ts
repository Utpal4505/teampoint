import React from 'react'
import { TaskStatus } from '../projects/detail/types'

export type Priority = 'URGENT' | 'HIGH' | 'MEDIUM' | 'LOW'
export type Status = 'TODO' | 'IN_PROGRESS' | 'DONE' | 'CANCELLED'
export type TaskType = 'PERSONAL' | 'PROJECT'
export type ViewMode = 'kanban' | 'list'

// API response type
export interface AssignedTask {
  id: number
  title: string
  description?: string
  taskType: TaskType
  status: Status
  priority: Priority
  dueDate: string | null
  project: {
    id: number
    name: string
  } | null
  assignedTo: {
    id: number
    name: string
    avatarUrl?: string
  } | null
}

export interface Task extends AssignedTask {
  project: {
    id: number
    name: string
  } | null
  description: string
  type: TaskType
  assignee: string
  avatarUrl?: string
}

export interface Filters {
  status: Status[]
  priority: Priority[]
  type: TaskType[]
}

export interface CreateTaskDTO {
  id: number
  title: string
  status: Status
  taskType: TaskType
  createdAt: string
  creator: {
    fullName: string
  }
}

export interface GetTaskDTO {
  id: number
  title: string
  description?: string
  taskType: TaskType
  projectId?: number
  status: TaskStatus
  priority: Priority
  createdBy: number
  assignee: {
    id: number
    fullName: string
    avatarUrl: string | null
  }
  createdAt: Date
  dueDate?: Date
}

export interface UpdateTaskDTO {
  id: number
  title: string
  description: string | null
  priority: Priority
  assignedTo: number
  dueDate: string | null
  updatedAt: string
}

export interface ChangeTaskStatusDTO {
  id: number
  status: Status
  updatedAt: string
}

export interface CancelTaskDTO {
  id: number
  status: Status
  cancelledBy: number
  cancelledAt: string
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

export interface createTaskInput {
  taskType: TaskType
  projectId?: number | null
  title: string
  description?: string
  assignedTo: number
  priority: Priority
  dueDate?: Date
}
