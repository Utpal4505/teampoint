import { prisma } from '../../config/db.config.ts'
import type { Prisma } from '../../generated/prisma/client.ts'
import type {
  CompleteMilestoneDTO,
  CompleteMilestoneInput,
  CreateMilestoneDTO,
  CreateMilestoneInput,
  GetMilestoneDTO,
  ListMilestonesDTO,
  UpdateMilestoneDTO,
  UpdateMilestoneInput,
} from '../../types/milestone.type.ts'
import { ApiError } from '../../utils/apiError.ts'
import { assertProjectMember } from '../../utils/assertProjectMember.ts'
import { ensureExists } from '../../utils/ensureExists.ts'

export const createMilestoneService = async (
  input: CreateMilestoneInput,
  userId: number,
): Promise<CreateMilestoneDTO> => {
  const { projectId, title, description, dueDate } = input

  return prisma.$transaction(async tx => {
    await assertProjectMember(projectId, userId, tx)

    const milestone = await tx.milestone.create({
      data: {
        projectId,
        title: title.trim(),
        description: description ?? null,
        dueDate: dueDate ?? null,
        status: 'NOT_STARTED',
        createdBy: userId,
      },
    })

    return milestone
  })
}


export const listMilestonesService = async (
  projectId: number,
  userId: number,
): Promise<ListMilestonesDTO> => {
  await assertProjectMember(projectId, userId)

  const milestones = await prisma.milestone.findMany({
    where: {
      projectId,
    },
    select: {
      id: true,
      title: true,
      status: true,
      dueDate: true,
      createdAt: true,
    },
    orderBy: { createdAt: 'desc' },
  })

  return {
    data: milestones,
  }
}


export const getMilestoneService = async (
  milestoneId: number,
  userId: number,
): Promise<GetMilestoneDTO> => {
  const milestone = await prisma.milestone.findUnique({
    where: { id: milestoneId },
  })

  ensureExists(milestone, 'Milestone')

  await assertProjectMember(milestone.projectId, userId)

  return milestone
}


export const updateMilestoneService = async (
  input: UpdateMilestoneInput,
  userId: number,
): Promise<UpdateMilestoneDTO> => {
  const { milestoneId, title, description, status, dueDate } = input

  return prisma.$transaction(async tx => {
    const milestone = await tx.milestone.findUnique({
      where: { id: milestoneId },
    })

    ensureExists(milestone, 'Milestone')

    await assertProjectMember(milestone.projectId, userId, tx)

    const updateData: Prisma.MilestoneUpdateInput = {}

    if (title !== undefined) updateData.title = title.trim()
    if (description !== undefined) updateData.description = description
    if (status !== undefined) updateData.status = status
    if (dueDate !== undefined) updateData.dueDate = dueDate

    const updated = await tx.milestone.update({
      where: { id: milestoneId },
      data: updateData,
    })

    return {
      id: updated.id,
      title: updated.title,
      description: updated.description,
      status: updated.status,
      dueDate: updated.dueDate,
      updatedAt: updated.updatedAt,
    }
  })
}

export const completeMilestoneService = async (
  input: CompleteMilestoneInput,
  userId: number,
): Promise<CompleteMilestoneDTO> => {
  const { milestoneId } = input

  return prisma.$transaction(async tx => {
    const milestone = await tx.milestone.findUnique({
      where: { id: milestoneId },
    })

    ensureExists(milestone, 'Milestone')

    await assertProjectMember(milestone.projectId, userId, tx)

    if (milestone.status === 'ACHIEVED') {
      throw new ApiError(400, 'Milestone already achieved')
    }

    const updated = await tx.milestone.update({
      where: { id: milestoneId },
      data: {
        status: 'ACHIEVED',
        achievedAt: new Date(),
      },
    })

    return {
      id: updated.id,
      status: 'ACHIEVED',
      achievedAt: updated.achievedAt!,
    }
  })
}