import type { Prisma } from '../../generated/prisma/client.ts'
import type { TaskType } from '../../generated/prisma/enums.ts'
import { ApiError } from '../../utils/apiError.ts'

export type TaskAction = 'VIEW' | 'EDIT' | 'CHANGE_STATUS' | 'CANCEL' | 'CREATE'

export async function assertTaskPermission(
  tx: Prisma.TransactionClient,
  task: {
    taskType: TaskType
    projectId: number | null
    createdBy: number
    assignedTo: number
  },
  userId: number,
  action: TaskAction,
): Promise<void> {
  const isCreator = task.createdBy === userId
  const isAssignee = task.assignedTo === userId

  // PERSONAL TASKS
  if (task.taskType === 'PERSONAL') {
    if (!isCreator) {
      throw new ApiError(403, 'You do not have access to this task')
    }
    return
  }

  // PROJECT TASKS

  if (isCreator) return

  if (action === 'CHANGE_STATUS' && isAssignee) return

  const membership = await tx.project_Members.findFirst({
    where: {
      projectId: task.projectId!,
      userId,
    },
    select: { role: true },
  })

  if (!membership) {
    throw new ApiError(403, 'You do not have access to this task')
  }

  const isAdmin = ['OWNER', 'ADMIN'].includes(membership.role)

  switch (action) {
    case 'VIEW':
      return

    case 'EDIT':
      if (isAdmin) return
      break

    case 'CHANGE_STATUS':
      if (isAdmin) return
      break

    case 'CANCEL':
      if (isAdmin) return
      break
  }

  throw new ApiError(403, 'You do not have permission for this action')
}
