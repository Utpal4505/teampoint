import { prisma } from '../config/db.config.ts'

export const getWorkspaceIdFromProject = async (
  projectId: number | null,
  userId: number,
): Promise<number> => {
  if (!projectId) {
    const workspace = await prisma.workspace.findFirst({
      where: { createdBy: userId },
      select: { id: true },
    })
    if (!workspace) throw new Error('No workspace found for user')
    return workspace.id
  }

  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: { workspaceId: true },
  })
  if (!project) throw new Error('Project not found')
  return project.workspaceId
}
