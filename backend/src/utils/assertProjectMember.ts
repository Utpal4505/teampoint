import { prisma } from '../config/db.config.js'
import type { Prisma } from '../generated/prisma/client.js'
import type { WorkspaceRole } from '../generated/prisma/index.js'
import { ApiError } from './apiError.js'

export const assertProjectMember = async (
  projectId: number,
  userId: number,
  tx?: Prisma.TransactionClient,
): Promise<{
  id: number
  role: WorkspaceRole
  status: string
  permissions: Prisma.JsonValue | null
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
      permissions: true,
    },
  })

  if (!member) {
    const workspaceMember = await db.workspace_Members.findFirst({
      where: {
        workspace: {
          projects: {
            some: { id: projectId }
          }
        },
        userId,
        role: { in: ['OWNER', 'ADMIN'] },
        status: 'ACTIVE'
      },
      select: {
        id: true,
        role: true,
        status: true,
      }
    })

    if (!workspaceMember) {
      throw new ApiError(403, 'Not a project member')
    }

    return {
      id: workspaceMember.id,
      role: workspaceMember.role,
      status: 'ACTIVE',
      permissions: null
    }
  }

  if (member.status !== 'ACTIVE') {
    throw new ApiError(403, 'Inactive project member')
  }

  return member
}
