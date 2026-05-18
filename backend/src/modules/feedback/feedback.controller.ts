import { ApiResponse } from '../../utils/apiResponse.js'
import { assertUser } from '../../utils/assertUser.js'
import { asyncHandler } from '../../utils/asyncHandler.js'
import { FeedbackTypeEnum, FeedbackStatusEnum } from './feedback.schema.js'
import {
  createFeedbackService,
  getFeedbackByIdService,
  listFeedbackService,
  updateFeedbackStatusService,
  deleteFeedbackService,
} from './feedback.service.js'

export const createFeedbackController = asyncHandler(async (req, res) => {
  const feedback = await createFeedbackService(req.body, req.user?.id)

  return res
    .status(201)
    .json(new ApiResponse(201, 'Feedback submitted successfully', feedback))
})

export const getFeedbackController = asyncHandler(async (req, res) => {
  const { id } = req.params
  const feedback = await getFeedbackByIdService(Number(id))

  if (!feedback) {
    return res.status(404).json(new ApiResponse(404, 'Feedback not found'))
  }

  return res
    .status(200)
    .json(new ApiResponse(200, 'Feedback fetched successfully', feedback))
})

export const listFeedbackController = asyncHandler(async (req, res) => {
  const { projectId, type, status } = req.query

  const validatedType = type ? FeedbackTypeEnum.parse(type) : undefined
  const validatedStatus = status ? FeedbackStatusEnum.parse(status) : undefined

  const feedback = await listFeedbackService(
    projectId ? Number(projectId) : undefined,
    validatedType,
    validatedStatus,
  )

  return res
    .status(200)
    .json(new ApiResponse(200, 'Feedback list fetched successfully', feedback))
})

export const updateFeedbackStatusController = asyncHandler(async (req, res) => {
  assertUser(req.user)

  const feedback = await updateFeedbackStatusService(req.body, req.user?.id || 0)

  return res
    .status(200)
    .json(new ApiResponse(200, 'Feedback status updated successfully', feedback))
})

export const deleteFeedbackController = asyncHandler(async (req, res) => {
  assertUser(req.user)

  const { id } = req.params
  await deleteFeedbackService(Number(id))

  return res.status(200).json(new ApiResponse(200, 'Feedback deleted successfully'))
})
