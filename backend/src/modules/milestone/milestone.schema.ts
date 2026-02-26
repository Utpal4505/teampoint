import z from 'zod'
import { GoalStatus } from '../../generated/prisma/enums.ts'
import { idParam } from '../documentLinks/documentLinks.schema.ts'

export const MilestoneStatusSchema = z.enum(GoalStatus)


export const CreateMilestoneSchema = z.object({
  projectId: idParam,
  title: z.string().trim().min(1).max(255),
  description: z.string().trim().max(2000).optional(),
  dueDate: z.coerce.date().optional(),
})

export const CreateMilestoneResponseSchema = z.object({
  id: idParam,
  projectId: idParam,

  title: z.string(),
  description: z.string().nullable(),
  dueDate: z.date().nullable(),
  status: MilestoneStatusSchema,

  createdBy: idParam,
  createdAt: z.date(),
  updatedAt: z.date(),
})


export const MilestoneListItemSchema = z.object({
  id: idParam,
  title: z.string(),
  status: MilestoneStatusSchema,
  dueDate: z.date().nullable(),
  createdAt: z.date(),
})

export const ListMilestonesResponseSchema = z.object({
  data: z.array(MilestoneListItemSchema),
})

export const GetMilestoneResponseSchema = z.object({
  id: idParam,
  projectId: idParam,

  title: z.string(),
  description: z.string().nullable(),

  status: MilestoneStatusSchema,
  dueDate: z.date().nullable(),

  createdBy: idParam,

  achievedAt: z.date().nullable(),

  createdAt: z.date(),
  updatedAt: z.date(),
})

export const UpdateMilestoneSchema = z.object({
  milestoneId: idParam,

  title: z.string().trim().min(1).max(255).optional(),
  description: z.string().trim().max(2000).nullable().optional(),
  status: MilestoneStatusSchema.optional(),
  dueDate: z.coerce.date().nullable().optional(),
})

export const UpdateMilestoneResponseSchema = z.object({
  id: idParam,

  title: z.string(),
  description: z.string().nullable(),
  status: MilestoneStatusSchema,
  dueDate: z.date().nullable(),

  updatedAt: z.date(),
})


export const CompleteMilestoneSchema = z.object({
  milestoneId: idParam,
})

export const CompleteMilestoneResponseSchema = z.object({
  id: idParam,
  status: z.literal('ACHIEVED'),
  achievedAt: z.date(),
})

export const DeleteMilestoneSchema = z.object({
  milestoneId: idParam,
})

export const DeleteMilestoneResponseSchema = z.object({
  id: idParam,
  deletedAt: z.date(),
})