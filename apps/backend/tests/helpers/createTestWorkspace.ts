import { getPrisma } from '../utils/db.ts'

export const createTestWorkspace = async (userId: number, overrides = {}) => {
  const prisma = await getPrisma()

  return prisma.workspace.create({
    data: {
      name: 'Test Workspace',
      createdBy: userId,
      ...overrides,
    },
  })
}