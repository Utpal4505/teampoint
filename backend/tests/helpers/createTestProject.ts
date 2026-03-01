import { getPrisma } from '../utils/db.ts'

export const createTestProject = async (
  userId: number,
  workspaceId: number,
  overrides = {},
) => {
  const prisma = await getPrisma()

  const project = await prisma.project.create({
    data: {
      name: 'Test Project',
      createdBy: userId,
      workspaceId,
      ...overrides,
    },
  })

  await prisma.project_Members.create({
    data: {
      projectId: project.id,
      userId,
      role: 'OWNER',
      permissions: {},
      joinedAt: new Date(),
    },
  })

  return project
}
