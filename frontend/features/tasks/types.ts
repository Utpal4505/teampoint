import React from 'react'

export type Priority = 'URGENT' | 'HIGH' | 'MEDIUM' | 'LOW'
export type Status = 'TODO' | 'IN_PROGRESS' | 'DONE' | 'CANCELLED'
export type TaskType = 'PERSONAL' | 'PROJECT'
export type ViewMode = 'kanban' | 'list'

// API response type
export interface AssignedTask {
  id: number
  title: string
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