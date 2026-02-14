import { prisma } from '../../config/db.config.ts'
import { ROLE_PERMISSIONS } from './workspace.permissions.ts'

type CreateWorkspaceInput = {
  name: string
  description?: string
  ownerId: number
}

export const createWorkspaceService = async (input: CreateWorkspaceInput) => {
  const { name, description, ownerId } = input

  const workspace = await prisma.$transaction(async tx => {
    const ws = await tx.workspace.create({
      data: {
        name,
        description: description ?? null,
        createdBy: ownerId,
        status: 'ACTIVE',
      },
      select: {
        id: true,
        name: true,
        status: true,
        createdAt: true,
      },
    })

    await tx.workspace_Members.create({
      data: {
        userId: ownerId,
        role: 'OWNER',
        workspaceId: ws.id,
        joinedAt: new Date(),
        permissions: ROLE_PERMISSIONS.OWNER,
      },
    })

    return ws
  })

  return workspace
}
