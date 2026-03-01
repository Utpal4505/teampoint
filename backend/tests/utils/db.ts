let prismaInstance: any

const getPrismaInstance = async () => {
  if (!prismaInstance) {
    const { prisma } = await import('../../src/config/db.config.ts')
    prismaInstance = prisma
  }
  return prismaInstance
}

export const getPrisma = async () => {
  return getPrismaInstance()
}

export const clearDatabase = async () => {
  const prisma = await getPrismaInstance()
  await prisma.meeting.deleteMany()
  await prisma.tasks.deleteMany()
  await prisma.project_Members.deleteMany()
  await prisma.project.deleteMany()
  await prisma.workspace.deleteMany()
  await prisma.user.deleteMany()
}

export const disconnectDB = async () => {
  const prisma = await getPrismaInstance()
  await prisma.$disconnect()
}
