import { getPrisma } from '../utils/db.ts'

export const createTestUser = async (overrides = {}) => {
  const prisma = await getPrisma()

  return prisma.user.create({
    data: {
      email: `test_${Date.now()}@test.com`,
      fullName: 'Test User',
      status: 'ACTIVE',
      is_new: false,
      ...overrides,
    },
  })
}