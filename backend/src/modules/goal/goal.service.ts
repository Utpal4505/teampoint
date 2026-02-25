import { prisma } from '../../config/db.config.ts'
import type { Prisma } from '../../generated/prisma/client.ts'
import type {
  CompleteGoalDTO,
  CompleteGoalInput,
  CreateGoalDTO,
  CreateGoalInput,
  DeleteGoalDTO,
  DeleteGoalInput,
  GetGoalDTO,
  ListGoalsDTO,
  UpdateGoalDTO,
  UpdateGoalInput,
} from '../../types/goal.type.ts'
import { ApiError } from '../../utils/apiError.ts'
import { assertProjectMember } from '../../utils/assertProjectMember.ts'
import { ensureExists } from '../../utils/ensureExists.ts'

export const createGoalService = async (
  input: CreateGoalInput,
  userId: number,
): Promise<CreateGoalDTO> => {
  const { projectId, title, description, targetDate } = input

  return prisma.$transaction(async tx => {
    await assertProjectMember(projectId, userId, tx)

    const goal = await tx.goal.create({
      data: {
        projectId,
        title: title.trim(),
        description: description ?? null,
        targetDate: targetDate,
        status: 'NOT_STARTED',
        createdBy: userId,
      },
    })

    return goal
  })
}

export const listGoalsService = async (
  projectId: number,
  userId: number,
): Promise<ListGoalsDTO> => {
  await assertProjectMember(projectId, userId)

  const goals = await prisma.goal.findMany({
    where: {
      projectId,
      deletedAt: null,
    },
    select: {
      id: true,
      title: true,
      status: true,
      targetDate: true,
      createdAt: true,
    },
    orderBy: { createdAt: 'desc' },
  })

  return {
    data: goals,
  }
}

export const getGoalService = async (
  goalId: number,
  userId: number,
): Promise<GetGoalDTO> => {
  const goal = await prisma.goal.findUnique({
    where: { id: goalId },
  })

  ensureExists(goal, 'Goal')

  await assertProjectMember(goal.projectId, userId)

  return goal
}

export const updateGoalService = async (
  input: UpdateGoalInput,
  userId: number,
): Promise<UpdateGoalDTO> => {
  const { goalId, title, description, status, targetDate } = input

  return prisma.$transaction(async tx => {
    const goal = await tx.goal.findUnique({
      where: { id: goalId },
    })

    ensureExists(goal, 'Goal')

    const updateData: Prisma.GoalUpdateInput = {}

    await assertProjectMember(goal.projectId, userId, tx)

    if (title !== undefined) updateData.title = title.trim()
    if (description !== undefined) updateData.description = description
    if (status !== undefined) updateData.status = status
    if (targetDate !== undefined) updateData.targetDate = targetDate

    const updated = await tx.goal.update({
      where: { id: goalId },
      data: updateData,
    })

    return {
      id: updated.id,
      title: updated.title,
      description: updated.description,
      status: updated.status,
      targetDate: updated.targetDate,
      updatedAt: updated.updatedAt,
    }
  })
}

export const completeGoalService = async (
  input: CompleteGoalInput,
  userId: number,
): Promise<CompleteGoalDTO> => {
  const { goalId } = input

  return prisma.$transaction(async tx => {
    const goal = await tx.goal.findUnique({
      where: { id: goalId },
    })

    ensureExists(goal, 'Goal')

    await assertProjectMember(goal.projectId, userId, tx)

    if (goal.status === 'ACHIEVED') {
      throw new ApiError(400, 'Goal already achieved')
    }

    const updated = await tx.goal.update({
      where: { id: goalId },
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

export const deleteGoalService = async (
  input: DeleteGoalInput,
  userId: number,
): Promise<DeleteGoalDTO> => {
  const { goalId } = input

  return prisma.$transaction(async tx => {
    const goal = await tx.goal.findUnique({
      where: { id: goalId },
    })

    ensureExists(goal, 'Goal')

    await assertProjectMember(goal.projectId, userId, tx)

    const deleted = await tx.goal.update({
      where: { id: goalId },
      data: {
        deletedAt: new Date(),
      },
    })

    return {
      id: deleted.id,
      deletedAt: deleted.deletedAt!,
    }
  })
}
