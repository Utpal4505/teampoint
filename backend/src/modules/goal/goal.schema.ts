import z from 'zod'
import { GoalStatus } from '../../generated/prisma/enums.ts'

export const idParam = z.number().int().positive().transform(Number)

export const GoalStatusSchema = z.enum(GoalStatus)

export const CreateGoalSchema = z.object({
  projectId: idParam,
  title: z.string().trim().min(1).max(255),
  description: z.string().trim().max(2000).optional(),
  targetDate: z.coerce.date().optional(),
})

export const CreateGoalResponseSchema = z.object({
  id: idParam,
  projectId: idParam,

  title: z.string(),
  description: z.string().nullable(),
  targetDate: z.date().nullable(),
  status: GoalStatusSchema,

  createdBy: idParam,
  createdAt: z.date(),
  updatedAt: z.date(),
})


export const GoalListItemSchema = z.object({
  id: idParam,
  title: z.string(),
  status: GoalStatusSchema,
  targetDate: z.date().nullable(),
  createdAt: z.date(),
})

export const ListGoalsResponseSchema = z.object({
  data: z.array(GoalListItemSchema),
})


export const GetGoalResponseSchema = z.object({
  id: idParam,
  projectId: idParam,

  title: z.string(),
  description: z.string().nullable(),

  status: GoalStatusSchema,
  targetDate: z.date().nullable(),

  createdBy: idParam,

  achievedAt: z.date().nullable(),

  createdAt: z.date(),
  updatedAt: z.date(),
})


export const UpdateGoalSchema = z.object({
  goalId: idParam,

  title: z.string().trim().min(1).max(255).optional(),
  description: z.string().trim().max(2000).nullable().optional(),
  status: GoalStatusSchema.optional(),
  targetDate: z.coerce.date().nullable().optional(),
})

export const UpdateGoalResponseSchema = z.object({
  id: idParam,

  title: z.string(),
  description: z.string().nullable(),
  status: GoalStatusSchema,
  targetDate: z.date().nullable(),

  updatedAt: z.date(),
})


export const CompleteGoalSchema = z.object({
  goalId: idParam,
})

export const CompleteGoalResponseSchema = z.object({
  id: idParam,
  status: z.literal('ACHIEVED'),
  achievedAt: z.date(),
})


export const DeleteGoalSchema = z.object({
  goalId: idParam,
})

export const DeleteGoalResponseSchema = z.object({
  id: idParam,
  deletedAt: z.date(),
})
