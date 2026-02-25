import type { GoalStatus } from '../generated/prisma/enums.ts'

export type CreateGoalInput = {
  projectId: number
  title: string
  description?: string
  targetDate: Date
}

export type CreateGoalDTO = {
  id: number
  projectId: number

  title: string
  description: string | null
  targetDate: Date | null
  status: GoalStatus

  createdBy: number
  createdAt: Date
  updatedAt: Date
}

export type GoalListItemDTO = {
  id: number
  title: string
  status: GoalStatus
  targetDate: Date | null
  createdAt: Date
}

export type ListGoalsDTO = {
  data: GoalListItemDTO[]
}

export type GetGoalDTO = {
  id: number
  projectId: number

  title: string
  description: string | null

  status: GoalStatus
  targetDate: Date | null

  createdBy: number

  achievedAt: Date | null

  createdAt: Date
  updatedAt: Date
}

export type UpdateGoalInput = {
  goalId: number

  title?: string
  description?: string | null
  status?: GoalStatus
  targetDate?: Date | null
}

export type UpdateGoalDTO = {
  id: number

  title: string
  description: string | null
  status: GoalStatus
  targetDate: Date | null

  updatedAt: Date
}

export type CompleteGoalInput = {
  goalId: number
}

export type CompleteGoalDTO = {
  id: number
  status: 'ACHIEVED'
  achievedAt: Date
}

export type DeleteGoalInput = {
  goalId: number
}

export type DeleteGoalDTO = {
  id: number
  deletedAt: Date
}