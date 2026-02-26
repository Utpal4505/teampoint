import { ApiResponse } from '../../utils/apiResponse.ts'
import { assertUser } from '../../utils/assertUser.ts'
import { asyncHandler } from '../../utils/asyncHandler.ts'
import type {
  CompleteMilestoneInput,
  CreateMilestoneInput,
  UpdateMilestoneInput,
} from '../../types/milestone.type.ts'
import {
  completeMilestoneService,
  createMilestoneService,
  getMilestoneService,
  listMilestonesService,
  updateMilestoneService,
} from './milestone.service.ts'


export const createMilestoneController = asyncHandler(async (req, res) => {
  assertUser(req.user)

  const input: CreateMilestoneInput = req.body

  const milestone = await createMilestoneService(input, req.user.id)

  return res
    .status(201)
    .json(new ApiResponse(201, 'Milestone created successfully', milestone))
})


export const listMilestonesController = asyncHandler(async (req, res) => {
  assertUser(req.user)

  const projectId = Number(req.params.projectId)

  const result = await listMilestonesService(projectId, req.user.id)

  return res
    .status(200)
    .json(new ApiResponse(200, 'Milestones fetched successfully', result))
})


export const getMilestoneController = asyncHandler(async (req, res) => {
  assertUser(req.user)

  const milestoneId = Number(req.params.milestoneId)

  const milestone = await getMilestoneService(milestoneId, req.user.id)

  return res
    .status(200)
    .json(new ApiResponse(200, 'Milestone fetched successfully', milestone))
})


export const updateMilestoneController = asyncHandler(async (req, res) => {
  assertUser(req.user)

  const input: UpdateMilestoneInput = {
    milestoneId: Number(req.params.milestoneId),
    ...req.body,
  }

  const updated = await updateMilestoneService(input, req.user.id)

  return res
    .status(200)
    .json(new ApiResponse(200, 'Milestone updated successfully', updated))
})


export const completeMilestoneController = asyncHandler(async (req, res) => {
  assertUser(req.user)

  const input: CompleteMilestoneInput = {
    milestoneId: Number(req.params.milestoneId),
  }

  const completed = await completeMilestoneService(input, req.user.id)

  return res
    .status(200)
    .json(new ApiResponse(200, 'Milestone completed successfully', completed))
})