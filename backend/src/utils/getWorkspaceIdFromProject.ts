import { prisma } from '../config/db.config.ts'
import type { Prisma } from '../generated/prisma/client.ts'

export const getWorkspaceIdFromProject = async (
  projectId: number | null,
  userId: number,
  tx?: Prisma.TransactionClient,
): Promise<number> => {
  const db = tx ?? prisma

  if (!projectId) {
    const workspace = await db.workspace.findFirst({
      where: { createdBy: userId },
      select: { id: true },
    })
    if (!workspace) throw new Error('No workspace found for user')
    return workspace.id
  }

  const project = await db.project.findUnique({
    where: { id: projectId },
    select: { workspaceId: true },
  })
  if (!project) throw new Error('Project not found')
  return project.workspaceId
}
