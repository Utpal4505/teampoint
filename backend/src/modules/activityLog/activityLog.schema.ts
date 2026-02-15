import { z } from 'zod'
import { ActivityAction, ActivityEntityType } from '../../generated/prisma/enums.ts'

export const createActivitySchema = z.object({
  entityType: z.enum(ActivityEntityType),
  entityId: z.number().int().positive(),

  action: z.enum(ActivityAction),
  actorId: z.number().int().positive(),

  workspaceId: z.number().int().positive(),
  projectId: z.number().int().positive().nullable().optional(),

  content: z.string().trim().min(3).max(500),
})
