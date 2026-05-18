import type { ActivityAction, ActivityEntityType } from "../generated/prisma/enums.js"

export type CreateActivityInput = {
  entityType: ActivityEntityType
  entityId: number

  action: ActivityAction
  actorId: number

  workspaceId: number
  projectId?: number | null

  content: string
}