import { PrismaClient } from '../../src/generated/prisma/client.ts'

let prismaInstance: PrismaClient | null = null

const getPrismaInstance = async (): Promise<PrismaClient> => {
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

  await prisma.meetingActionItem.deleteMany()
  await prisma.meetingParticipant.deleteMany()
  await prisma.integrationToken.deleteMany()

  await prisma.meeting.deleteMany()
  await prisma.tasks.deleteMany()
  await prisma.integration.deleteMany()
  await prisma.goal.deleteMany()
  await prisma.milestone.deleteMany()
  await prisma.document.deleteMany()

  await prisma.project_Members.deleteMany()
  await prisma.project.deleteMany()
  await prisma.workspace.deleteMany()

  await prisma.user.deleteMany()
}

export const disconnectDB = async () => {
  const prisma = await getPrismaInstance()
  await prisma.$disconnect()
  prismaInstance = null
}
