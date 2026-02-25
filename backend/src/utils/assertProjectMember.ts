import { prisma } from '../config/db.config.ts'
import type { Prisma } from '../generated/prisma/client.ts'
import type { WorkspaceRole } from '../generated/prisma/enums.ts'
import { ApiError } from './apiError.ts'

export const assertProjectMember = async (
  projectId: number,
  userId: number,
  tx?: Prisma.TransactionClient,
): Promise<{
  id: number
  role: WorkspaceRole
}> => {
  const db = tx ?? prisma
  const member = await db.project_Members.findFirst({
    where: {
      projectId,
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
    throw new ApiError(403, 'Not a project member')
  }

  if (member.status !== 'ACTIVE') {
    throw new ApiError(403, 'Inactive project member')
  }

  return member
}
