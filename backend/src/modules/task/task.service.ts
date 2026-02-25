import { prisma } from '../../config/db.config.ts'
import type { Prisma } from '../../generated/prisma/client.ts'
import type { TaskStatus, TaskType } from '../../generated/prisma/enums.ts'
import type {
  ChangeTaskStatusDTO,
  ChangeTaskStatusInput,
  CancelTaskDTO,
  CreateTaskDTO,
  CreateTaskInput,
  GetTaskDTO,
  ListTaskDTO,
  UpdateTaskDTO,
  UpdateTaskInput,
} from '../../types/task.type.ts'
import { ApiError } from '../../utils/apiError.ts'
import { ensureExists } from '../../utils/ensureExists.ts'
import { getWorkspaceIdFromProject } from '../../utils/getWorkspaceIdFromProject.ts'
import { assertTaskPermission } from './task.permission.ts'

export const createTaskService = async (
  input: CreateTaskInput,
  userId: number,
): Promise<CreateTaskDTO> => {
  const { taskType, projectId, title, description, assignedTo, priority, dueDate } = input

  if (taskType === 'PROJECT' && !projectId) {
    throw new ApiError(400, 'projectId is required for PROJECT tasks')
  }

  if (taskType === 'PERSONAL' && projectId) {
    throw new ApiError(400, 'projectId must be null for PERSONAL tasks')
  }

  return prisma.$transaction(async tx => {
    await assertTaskPermission(
      tx,
      {
        taskType,
        projectId: projectId ?? null,
        createdBy: userId,
        assignedTo,
      },
      userId,
      'CREATE',
    )

    const assignedUser = await tx.user.findUnique({
      where: { id: assignedTo },
      select: { id: true, fullName: true },
    })

    ensureExists(assignedUser, 'Assigned user')

    if (taskType === 'PROJECT') {
      const membership = await tx.project_Members.findFirst({
        where: {
          projectId: projectId!,
          userId: assignedTo,
        },
        select: { id: true },
      })

      if (!membership) {
        throw new ApiError(400, 'Assigned user must be a project member')
      }
    }

    const task = await tx.tasks.create({
      data: {
        title: title.trim(),
        description: description ?? null,
        taskType,
        projectId: projectId ?? null,
        createdBy: userId,
        assignedTo,
        priority,
        dueDate: dueDate ?? null,
        status: 'TODO',
      },
      select: {
        id: true,
        title: true,
        status: true,
        taskType: true,
        createdAt: true,
        creator: {
          select: {
            fullName: true,
          },
        },
      },
    })

    const workspaceId = await getWorkspaceIdFromProject(projectId, userId, tx)

    const activityProjectId = task.taskType === 'PROJECT' ? projectId : null

    await tx.activityLog.create({
      data: {
        action: 'CREATED',
        projectId: activityProjectId,
        workspaceId,
        actorId: userId,
        entityType: 'TASK',
        entityId: task.id,
        content:
          task.taskType === 'PROJECT'
            ? `Task "${task.title}" created by ${task.creator.fullName} and assigned to user ${assignedUser.fullName}`
            : `Personal task "${task.title}" created`,
      },
    })

    return task
  })
}

export const listTasksService = async (
  userId: number,
  filters: {
    projectId?: number
    assignedTo?: number
    status?: TaskStatus
    taskType?: TaskType
  },
): Promise<ListTaskDTO> => {
  const { projectId, assignedTo, status, taskType } = filters

  const where: Prisma.TasksWhereInput = {}

  if (!projectId) {
    where.taskType = 'PERSONAL'
    where.createdBy = userId
  } else {
    where.projectId = projectId
  }

  if (assignedTo) where.assignedTo = assignedTo
  if (status) where.status = status
  else where.status = { not: 'CANCELLED' }

  if (taskType && projectId) {
    where.taskType = taskType
  }

  const tasks = await prisma.tasks.findMany({
    where,
    select: {
      id: true,
      title: true,
      status: true,
      priority: true,
      assignedTo: true,
      taskType: true,
      projectId: true,
      dueDate: true,
      createdBy: true,
      assignee: {
        select: {
          id: true,
          fullName: true,
        },
      },
    },
    orderBy: [{ dueDate: { sort: 'asc', nulls: 'last' } }, { createdAt: 'desc' }],
  })

  const accessibleTasks = await prisma.$transaction(async tx => {
    const result = []
    for (const task of tasks) {
      try {
        await assertTaskPermission(
          tx,
          {
            taskType: task.taskType,
            projectId: task.projectId,
            createdBy: task.createdBy,
            assignedTo: task.assignedTo,
          },
          userId,
          'VIEW',
        )
        result.push(task)
      } catch {
        continue
      }
    }
    return result
  })

  return accessibleTasks.map(task => ({
    id: task.id,
    title: task.title,
    status: task.status,
    priority: task.priority,
    dueDate: task.dueDate,
    assignedTo: task.assignee
      ? { id: task.assignee.id, name: task.assignee.fullName }
      : null,
  })) as ListTaskDTO
}

export const getTaskByIdService = async (
  taskId: number,
  userId: number,
): Promise<GetTaskDTO> => {
  const task = await prisma.tasks.findUnique({
    where: { id: taskId },
    select: {
      id: true,
      title: true,
      description: true,
      taskType: true,
      projectId: true,
      status: true,
      priority: true,
      createdBy: true,
      assignedTo: true,
      createdAt: true,
      dueDate: true,
    },
  })

  ensureExists(task, 'Task')

  await prisma.$transaction(tx =>
    assertTaskPermission(
      tx,
      {
        taskType: task.taskType,
        projectId: task.projectId,
        createdBy: task.createdBy,
        assignedTo: task.assignedTo,
      },
      userId,
      'VIEW',
    ),
  )

  return {
    ...task,
    description: task.description ?? undefined,
  } as GetTaskDTO
}

export const updateTaskService = async (
  taskId: number,
  input: Omit<UpdateTaskInput, 'status'>,
  userId: number,
): Promise<UpdateTaskDTO> => {
  return await prisma.$transaction(async tx => {
    const task = await tx.tasks.findUnique({
      where: { id: taskId },
      select: {
        id: true,
        assignedTo: true,
        createdBy: true,
        taskType: true,
        projectId: true,
        title: true,
        description: true,
        creator: {
          select: {
            fullName: true,
          },
        },
        assignee: {
          select: {
            fullName: true,
          },
        },
      },
    })

    ensureExists(task, 'Task')

    await assertTaskPermission(
      tx,
      {
        taskType: task.taskType,
        projectId: task.projectId,
        createdBy: task.createdBy,
        assignedTo: task.assignedTo,
      },
      userId,
      'EDIT',
    )

    if (input.assignedTo !== undefined && input.assignedTo !== task.assignedTo) {
      const assignedUser = await tx.user.findUnique({
        where: { id: input.assignedTo },
        select: { id: true },
      })

      ensureExists(assignedUser, 'Assigned user')

      if (task.taskType === 'PROJECT') {
        const projectMember = await tx.project_Members.findFirst({
          where: {
            projectId: task.projectId!,
            userId: input.assignedTo,
          },
          select: { id: true },
        })

        if (!projectMember) {
          throw new ApiError(400, 'Assigned user must be a project member')
        }
      }
    }

    const updatedTask = await tx.tasks.update({
      where: { id: taskId },
      data: {
        ...(input.title !== undefined && { title: input.title.trim() }),
        ...(input.description !== undefined && { description: input.description }),
        ...(input.priority !== undefined && { priority: input.priority }),
        ...(input.assignedTo !== undefined && { assignedTo: input.assignedTo }),
        ...(input.dueDate !== undefined && { dueDate: input.dueDate }),
      },
      select: {
        id: true,
        title: true,
        description: true,
        priority: true,
        assignedTo: true,
        dueDate: true,
        updatedAt: true,
      },
    })

    const activityProjectId = task.taskType === 'PROJECT' ? task.projectId : null

    const workspaceId = await getWorkspaceIdFromProject(activityProjectId, userId, tx)

    await tx.activityLog.create({
      data: {
        action: 'UPDATED',
        projectId: activityProjectId,
        workspaceId,
        actorId: userId,
        entityType: 'TASK',
        entityId: task.id,
        content:
          task.taskType === 'PROJECT'
            ? `Task "${task.title}" updated by ${task.creator.fullName} and assigned to ${task.assignee?.fullName ?? 'no one'}`
            : `Personal task "${task.title}" updated`,
      },
    })

    return updatedTask
  })
}

export const changeTaskStatusService = async (
  taskId: number,
  input: ChangeTaskStatusInput,
  userId: number,
): Promise<ChangeTaskStatusDTO> => {
  return prisma.$transaction(async tx => {
    const task = await tx.tasks.findUnique({
      where: { id: taskId },
      select: {
        id: true,
        status: true,
        taskType: true,
        projectId: true,
        createdBy: true,
        assignedTo: true,
        title: true,
        assignee: {
          select: {
            fullName: true,
          },
        },
        creator: {
          select: {
            fullName: true,
          },
        },
      },
    })

    ensureExists(task, 'Task')

    await assertTaskPermission(
      tx,
      {
        taskType: task.taskType,
        projectId: task.projectId,
        createdBy: task.createdBy,
        assignedTo: task.assignedTo,
      },
      userId,
      'CHANGE_STATUS',
    )

    const validTransitions: Record<TaskStatus, TaskStatus[]> = {
      TODO: ['IN_PROGRESS'],
      IN_PROGRESS: ['DONE'],
      DONE: [],
      CANCELLED: [],
    }

    if (!validTransitions[task.status].includes(input.status)) {
      throw new ApiError(400, `Cannot transition from ${task.status} to ${input.status}`)
    }

    const updatedTask = await tx.tasks.update({
      where: { id: taskId },
      data: {
        status: input.status,
        completedAt: input.status === 'DONE' ? new Date() : null,
      },
      select: {
        id: true,
        status: true,
        updatedAt: true,
      },
    })

    const workspaceId = await getWorkspaceIdFromProject(task.projectId, userId, tx)

    const activityContent =
      task.taskType === 'PROJECT'
        ? `Task "${task.title}" status changed from "${task.status}" to "${input.status}" by ${task.creator.fullName}${
            task.assignedTo ? `, assigned to ${task.assignee?.fullName ?? 'no one'}` : ''
          }`
        : `Personal task "${task.title}" status changed from "${task.status}" to "${input.status}" by ${task.creator.fullName}`

    await tx.activityLog.create({
      data: {
        action: 'UPDATED',
        projectId: task.projectId,
        workspaceId,
        actorId: userId,
        entityType: 'TASK',
        entityId: task.id,
        content: activityContent,
      },
    })

    return updatedTask
  })
}

export const cancelTaskService = async (
  taskId: number,
  userId: number,
): Promise<CancelTaskDTO> => {
  return prisma.$transaction(async tx => {
    const task = await tx.tasks.findUnique({
      where: { id: taskId },
      select: {
        id: true,
        title: true,
        status: true,
        taskType: true,
        projectId: true,
        createdBy: true,
        assignedTo: true,
        creator: { select: { fullName: true } },
        assignee: { select: { fullName: true } },
      },
    })

    if (!task) {
      throw new ApiError(404, 'Task not found')
    }

    await assertTaskPermission(
      tx,
      {
        taskType: task.taskType,
        projectId: task.projectId,
        createdBy: task.createdBy,
        assignedTo: task.assignedTo,
      },
      userId,
      'CANCEL',
    )

    if (task.status === 'CANCELLED' || task.status === 'DONE') {
      throw new ApiError(400, `Cannot cancel a ${task.status.toLowerCase()} task`)
    }

    const cancelledTask = await tx.tasks.update({
      where: { id: taskId },
      data: {
        status: 'CANCELLED',
        cancelledBy: userId,
        cancelledAt: new Date(),
      },
      select: {
        id: true,
        status: true,
        cancelledBy: true,
        cancelledAt: true,
      },
    })

    const workspaceId = await getWorkspaceIdFromProject(task.projectId, userId, tx)
    const activityProjectId = task.taskType === 'PROJECT' ? task.projectId : null

    await tx.activityLog.create({
      data: {
        action: 'CANCELLED',
        projectId: activityProjectId,
        workspaceId,
        actorId: userId,
        entityType: 'TASK',
        entityId: task.id,
        content:
          task.taskType === 'PROJECT'
            ? `Task "${task.title}" was cancelled by ${task.creator.fullName}${
                task.assignedTo
                  ? `, assigned to ${task.assignee?.fullName ?? 'no one'}`
                  : ''
              }`
            : `Personal task "${task.title}" was cancelled by ${task.creator.fullName}`,
      },
    })

    return cancelledTask as CancelTaskDTO
  })
} 