import type z from 'zod'
import type { Priority, TaskStatus, TaskType } from '../generated/prisma/enums.ts'
import type {
  changeTaskStatusSchema,
  createTaskSchema,
  updateTaskSchema,
} from '../modules/tasks/task.schema.ts'

export type CreateTaskInput = z.infer<typeof createTaskSchema>

export type CreateTaskDTO = {
  id: number
  status: TaskStatus
  taskType: TaskType
  createdAt: Date
}

export type ListTaskDTO = {
  id: number
  title: string
  description?: string | null
  status: TaskStatus
  priority: Priority
  taskType?: TaskType
  assignedTo: {
    id: number
    name: string
    avatarUrl: string | null
  } | null
  dueDate: Date | null
}[]

export type GetTaskDTO = {
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

export type UpdateTaskInput = z.infer<typeof updateTaskSchema>

export type UpdateTaskDTO = {
  id: number
  title: string
  description?: string | null
  priority: Priority
  assignedTo?: number | null
  dueDate?: Date | null
  updatedAt: Date
}

export type ChangeTaskStatusInput = z.infer<typeof changeTaskStatusSchema>

export type ChangeTaskStatusDTO = {
  id: number
  status: TaskStatus
  updatedAt: Date
}

export type CancelTaskDTO = {
  id: number
  status: 'CANCELLED'
  cancelledBy: number
  cancelledAt: Date
}
