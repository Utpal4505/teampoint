import { ApiResponse } from '../../utils/apiResponse.ts'
import { assertUser } from '../../utils/assertUser.ts'
import { asyncHandler } from '../../utils/asyncHandler.ts'
import type {
  CompleteGoalInput,
  CreateGoalInput,
  DeleteGoalInput,
  UpdateGoalInput,
} from '../../types/goal.type.ts'
import {
  completeGoalService,
  createGoalService,
  deleteGoalService,
  getGoalService,
  listGoalsService,
  updateGoalService,
} from './goal.service.ts'

export const createGoalController = asyncHandler(async (req, res) => {
  assertUser(req.user)

  const input: CreateGoalInput = req.body

  const goal = await createGoalService(input, req.user.id)

  return res
    .status(201)
    .json(new ApiResponse(201, 'Goal created successfully', goal))
})

export const listGoalsController = asyncHandler(async (req, res) => {
  assertUser(req.user)

  const projectId = Number(req.params.projectId)

  const result = await listGoalsService(projectId, req.user.id)

  return res
    .status(200)
    .json(new ApiResponse(200, 'Goals fetched successfully', result))
})

export const getGoalController = asyncHandler(async (req, res) => {
  assertUser(req.user)

  const goalId = Number(req.params.goalId)

  const goal = await getGoalService(goalId, req.user.id)

  return res
    .status(200)
    .json(new ApiResponse(200, 'Goal fetched successfully', goal))
})

export const updateGoalController = asyncHandler(async (req, res) => {
  assertUser(req.user)

  const input: UpdateGoalInput = {
    goalId: Number(req.params.goalId),
    ...req.body,
  }

  const updated = await updateGoalService(input, req.user.id)

  return res
    .status(200)
    .json(new ApiResponse(200, 'Goal updated successfully', updated))
})

export const completeGoalController = asyncHandler(async (req, res) => {
  assertUser(req.user)

  const input: CompleteGoalInput = {
    goalId: Number(req.params.goalId),
  }

  const completed = await completeGoalService(input, req.user.id)

  return res
    .status(200)
    .json(new ApiResponse(200, 'Goal completed successfully', completed))
})

export const deleteGoalController = asyncHandler(async (req, res) => {
  assertUser(req.user)

  const input: DeleteGoalInput = {
    goalId: Number(req.params.goalId),
  }

  const deleted = await deleteGoalService(input, req.user.id)

  return res
    .status(200)
    .json(new ApiResponse(200, 'Goal deleted successfully', deleted))
})