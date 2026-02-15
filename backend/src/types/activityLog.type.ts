import type { ActivityAction, ActivityEntityType } from "../generated/prisma/enums.ts"

export type CreateActivityInput = {
  entityType: ActivityEntityType
  entityId: number

  action: ActivityAction
  actorId: number

  workspaceId: number
  projectId?: number | null

  content: string
}