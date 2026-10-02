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

  // Delete in order: most dependent -> least dependent
  await prisma.meetingActionItem.deleteMany()
  await prisma.meetingParticipant.deleteMany()
  await prisma.meeting.deleteMany()
  
  await prisma.message.deleteMany()
  await prisma.discussion.deleteMany()
  
  await prisma.documentLink.deleteMany()
  await prisma.document.deleteMany()
  
  await prisma.tasks.deleteMany()
  await prisma.goal.deleteMany()
  await prisma.milestone.deleteMany()
  
  await prisma.activityLog.deleteMany()
  await prisma.bugReport.deleteMany()
  await prisma.feedback.deleteMany()
  
  await prisma.integrationToken.deleteMany()
  await prisma.integration.deleteMany()
  
  await prisma.invite_Member.deleteMany()
  await prisma.workspaceLeaveRequest.deleteMany()
  
  await prisma.project_Members.deleteMany()
  await prisma.project.deleteMany()
  
  await prisma.workspace_Members.deleteMany()
  await prisma.workspace.deleteMany()
  
  await prisma.refreshToken.deleteMany()
  await prisma.authProvider.deleteMany()
  
  // Upload before User because User.avatarUploadId references Upload
  await prisma.user.updateMany({ data: { avatarUploadId: null } })
  await prisma.upload.deleteMany()
  await prisma.user.deleteMany()
}

export const disconnectDB = async () => {
  const prisma = await getPrismaInstance()
  await prisma.$disconnect()
  prismaInstance = null
}
