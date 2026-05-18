import { prisma } from '../config/db.config.js'
import type { Prisma } from '../generated/prisma/client.js'
import type { WorkspaceRole } from '../generated/prisma/enums.js'
import { ApiError } from './apiError.js'

export const assertWorkspaceMember = async (
  workspaceId: number,
  userId: number,
  tx?: Prisma.TransactionClient,
): Promise<{
  id: number
  role: WorkspaceRole
}> => {
  const db = tx ?? prisma
  const member = await db.workspace_Members.findFirst({
    where: {
      workspaceId,
      userId,
      status: 'ACTIVE',
    },
    select: {
      id: true,
      role: true,
      status: true,
    },
  })

  if (!member) {
    throw new ApiError(403, 'Not a workspace member')
  }

  if (member.status !== 'ACTIVE') {
    throw new ApiError(403, 'Inactive workspace member')
  }

  return member
}
