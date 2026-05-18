import { z } from 'zod'
import { ActivityAction, ActivityEntityType } from '../../generated/prisma/enums.js'

export const createActivitySchema = z.object({
  entityType: z.nativeEnum(ActivityEntityType),
  entityId: z.number().int().positive(),

  action: z.nativeEnum(ActivityAction),
  actorId: z.number().int().positive(),

  workspaceId: z.number().int().positive(),
  projectId: z.number().int().positive().nullable().optional(),

  content: z.string().trim().min(3).max(500),
})
