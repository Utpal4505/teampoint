import { ApiResponse } from '../../utils/apiResponse.js'
import { assertUser } from '../../utils/assertUser.js'
import { asyncHandler } from '../../utils/asyncHandler.js'
import type {
  CreateLeaveRequestInput,
  UpdateLeaveRequestInput,
  ReviewLeaveRequestInput,
} from '../../types/workspaceLeave.type.js'
import {
  createLeaveRequestService,
  listLeaveRequestsService,
  getLeaveRequestService,
  updateLeaveRequestService,
  reviewLeaveRequestService,
} from './workspaceLeave.service.js'
import { ApiError } from '../../utils/apiError.js'

export const createLeaveRequestController = asyncHandler(async (req, res) => {
  assertUser(req.user)

  const input: CreateLeaveRequestInput = req.body

  const leaveRequest = await createLeaveRequestService(input, req.user.id)

  return res
    .status(201)
    .json(new ApiResponse(201, 'Leave request created successfully', leaveRequest))
})

export const listLeaveRequestsController = asyncHandler(async (req, res) => {
  assertUser(req.user)

  const workspaceId = Number(req.params.workspaceId)

  const result = await listLeaveRequestsService(workspaceId, req.user.id)

  return res
    .status(200)
    .json(new ApiResponse(200, 'Leave requests fetched successfully', result))
})

export const getLeaveRequestController = asyncHandler(async (req, res) => {
  assertUser(req.user)

  const requestId = Number(req.params.requestId)

  const leaveRequest = await getLeaveRequestService(requestId, req.user.id)

  return res
    .status(200)
    .json(new ApiResponse(200, 'Leave request fetched successfully', leaveRequest))
})

export const updateLeaveRequestController = asyncHandler(async (req, res) => {
  assertUser(req.user)

  const input: UpdateLeaveRequestInput = {
    requestId: Number(req.params.requestId),
    ...req.body,
  }

  if (!req.user.role) {
    throw new ApiError(500, 'User role is missing')
  }

  const updated = await updateLeaveRequestService(input, {
    id: req.user.id,
    role: req.user.role,
  })

  return res
    .status(200)
    .json(new ApiResponse(200, 'Leave request updated successfully', updated))
})

export const reviewLeaveRequestController = asyncHandler(async (req, res) => {
  assertUser(req.user)

  const input: ReviewLeaveRequestInput = {
    requestId: Number(req.params.requestId),
    ...req.body,
  }

  const reviewed = await reviewLeaveRequestService(input, req.user.id)

  return res
    .status(200)
    .json(new ApiResponse(200, 'Leave request reviewed successfully', reviewed))
})
