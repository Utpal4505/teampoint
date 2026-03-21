import { ApiResponse } from '../../utils/apiResponse.ts'
import { assertUser } from '../../utils/assertUser.ts'
import { asyncHandler } from '../../utils/asyncHandler.ts'
import type { TaskStatus, TaskType } from '../../generated/prisma/enums.ts'
import {
  cancelTaskService,
  changeTaskStatusService,
  createTaskService,
  getTaskByIdService,
  listTasksService,
  listWorkspaceAssignedTasksService,
  updateTaskService,
} from './task.service.ts'
import { listTasksQuerySchema, taskIdParamSchema } from './task.schema.ts'
import { workspaceIdParamSchema } from '../workspace/workspace.schema.ts'

export const createTaskController = asyncHandler(async (req, res) => {
  assertUser(req.user)

  const input = req.body

  const task = await createTaskService(input, req.user.id)

  return res.status(201).json(new ApiResponse(201, 'Task created successfully', task))
})

export const listTasksController = asyncHandler(async (req, res) => {
  assertUser(req.user)

  const parsed = listTasksQuerySchema.parse(req.query)

  const filters: {
    projectId?: number
    assignedTo?: number
    status?: TaskStatus
    taskType?: TaskType
  } = {}

  if (parsed.projectId !== undefined) filters.projectId = parsed.projectId
  if (parsed.assignedTo !== undefined) filters.assignedTo = parsed.assignedTo
  if (parsed.status !== undefined) filters.status = parsed.status as TaskStatus
  if (parsed.taskType !== undefined) filters.taskType = parsed.taskType as TaskType

  const tasks = await listTasksService(req.user.id, filters)

  return res.status(200).json(new ApiResponse(200, 'Tasks retrieved successfully', tasks))
})

export const getTaskByIdController = asyncHandler(async (req, res) => {
  assertUser(req.user)

  const { taskId } = taskIdParamSchema.parse(req.params)

  const task = await getTaskByIdService(taskId, req.user.id)

  return res.status(200).json(new ApiResponse(200, 'Task retrieved successfully', task))
})

export const updateTaskController = asyncHandler(async (req, res) => {
  assertUser(req.user)

  const { taskId } = taskIdParamSchema.parse(req.params)
  const input = req.body

  const task = await updateTaskService(taskId, input, req.user.id)

  return res.status(200).json(new ApiResponse(200, 'Task updated successfully', task))
})

export const changeTaskStatusController = asyncHandler(async (req, res) => {
  assertUser(req.user)

  const { taskId } = taskIdParamSchema.parse(req.params)
  const input = req.body

  const task = await changeTaskStatusService(taskId, input, req.user.id)

  return res
    .status(200)
    .json(new ApiResponse(200, 'Task status updated successfully', task))
})

export const cancelTaskController = asyncHandler(async (req, res) => {
  assertUser(req.user)

  const { taskId } = taskIdParamSchema.parse(req.params)

  const task = await cancelTaskService(taskId, req.user.id)

  return res.status(200).json(new ApiResponse(200, 'Task cancelled successfully', task))
})

export const listWorkspaceAssignedTasksController = asyncHandler(async (req, res) => {
  assertUser(req.user)

  const { workspaceId } = workspaceIdParamSchema.parse(req.params)

  const tasks = await listWorkspaceAssignedTasksService(workspaceId, req.user.id)

  return res
    .status(200)
    .json(new ApiResponse(200, 'Workspace tasks retrieved successfully', tasks))
})

export const createPersonalTaskController = asyncHandler(async (req, res) => {
  assertUser(req.user)

  const input = {
    ...req.body,
    projectId: null,
  }

  const task = await createTaskService(input, req.user.id)

  return res
    .status(201)
    .json(new ApiResponse(201, 'Personal task created successfully', task))
})
