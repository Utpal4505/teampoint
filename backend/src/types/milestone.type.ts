import type { GoalStatus } from '../generated/prisma/enums.ts'

export type CreateMilestoneInput = {
  projectId: number
  title: string
  description?: string
  dueDate: Date
  status: GoalStatus
}

export type CreateMilestoneDTO = {
  id: number
  projectId: number

  title: string
  description: string | null
  dueDate: Date | null
  status: GoalStatus

  createdBy: number
  createdAt: Date
  updatedAt: Date
}


export type MilestoneListItemDTO = {
  id: number
  title: string
  status: GoalStatus
  dueDate: Date | null
  createdAt: Date
}

export type ListMilestonesDTO = {
  data: MilestoneListItemDTO[]
}

export type GetMilestoneDTO = {
  id: number
  projectId: number

  title: string
  description: string | null

  status: GoalStatus
  dueDate: Date | null

  createdBy: number

  achievedAt: Date | null

  createdAt: Date
  updatedAt: Date
}


export type UpdateMilestoneInput = {
  milestoneId: number

  title?: string
  description?: string | null
  status?: GoalStatus
  dueDate?: Date | null
}

export type UpdateMilestoneDTO = {
  id: number

  title: string
  description: string | null
  status: GoalStatus
  dueDate: Date | null

  updatedAt: Date
}


export type CompleteMilestoneInput = {
  milestoneId: number
}

export type CompleteMilestoneDTO = {
  id: number
  status: 'ACHIEVED'
  achievedAt: Date
}
