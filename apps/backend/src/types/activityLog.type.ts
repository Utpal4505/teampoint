import type { ActivityAction, ActivityEntityType } from "../generated/prisma/index.js"

export type CreateActivityInput = {
  entityType: ActivityEntityType
  entityId: number

  action: ActivityAction
  actorId: number

  workspaceId: number
  projectId?: number | null

  content: string
}