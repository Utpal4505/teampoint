import type {
  ListDiscussionsQuery,
  UpdateDiscussionInput,
} from '../../types/discussion.type.ts'
import { ApiResponse } from '../../utils/apiResponse.ts'
import { assertUser } from '../../utils/assertUser.ts'
import { asyncHandler } from '../../utils/asyncHandler.ts'
import {
  createDiscussionSchema,
  listDiscussionsQuerySchema,
  projectDiscussionParamsSchema,
  projectIdParamSchema,
  updateDiscussionSchema,
} from './discussion.schema.ts'
import {
  closeDiscussionService,
  createDiscussionService,
  getDiscussionByIdService,
  listDiscussionsService,
  reopenDiscussionService,
  updateDiscussionService,
} from './discussion.service.ts'

export const createDiscussionController = asyncHandler(async (req, res) => {
  assertUser(req.user)

  const { projectId } = projectIdParamSchema.parse(req.params)
  const body = createDiscussionSchema.parse(req.body)

  const discussion = await createDiscussionService({ projectId, ...body }, req.user.id)

  return res
    .status(201)
    .json(new ApiResponse(201, 'Discussion created successfully', discussion))
})

export const listDiscussionsController = asyncHandler(async (req, res) => {
  assertUser(req.user)

  const { projectId } = projectIdParamSchema.parse(req.params)
  const filters = listDiscussionsQuerySchema.parse(
    req.query,
  ) satisfies ListDiscussionsQuery

  const discussions = await listDiscussionsService(projectId, req.user.id, filters)

  return res
    .status(200)
    .json(new ApiResponse(200, 'Discussions fetched successfully', discussions))
})

export const getDiscussionByIdController = asyncHandler(async (req, res) => {
  assertUser(req.user)

  const { projectId, discussionId } = projectDiscussionParamsSchema.parse(req.params)

  const discussion = await getDiscussionByIdService(projectId, discussionId, req.user.id)

  return res
    .status(200)
    .json(new ApiResponse(200, 'Discussion fetched successfully', discussion))
})

export const updateDiscussionController = asyncHandler(async (req, res) => {
  assertUser(req.user)

  const { projectId, discussionId } = projectDiscussionParamsSchema.parse(req.params)
  const body = updateDiscussionSchema.parse(req.body)

  const discussion = await updateDiscussionService(
    {
      ...body,
      projectId,
      discussionId,
    } satisfies UpdateDiscussionInput,
    req.user.id,
  )

  return res
    .status(200)
    .json(new ApiResponse(200, 'Discussion updated successfully', discussion))
})

export const closeDiscussionController = asyncHandler(async (req, res) => {
  assertUser(req.user)

  const { projectId, discussionId } = projectDiscussionParamsSchema.parse(req.params)

  const discussion = await closeDiscussionService(projectId, discussionId, req.user.id)

  return res
    .status(200)
    .json(new ApiResponse(200, 'Discussion closed successfully', discussion))
})

export const reopenDiscussionController = asyncHandler(async (req, res) => {
  assertUser(req.user)

  const { projectId, discussionId } = projectDiscussionParamsSchema.parse(req.params)

  const discussion = await reopenDiscussionService(projectId, discussionId, req.user.id)

  return res
    .status(200)
    .json(new ApiResponse(200, 'Discussion reopened successfully', discussion))
})
