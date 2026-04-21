import type { CreateMessageInput } from '../../types/message.type.ts'
import { ApiResponse } from '../../utils/apiResponse.ts'
import { assertUser } from '../../utils/assertUser.ts'
import { asyncHandler } from '../../utils/asyncHandler.ts'
import {
  createMessageSchema,
  discussionIdParamSchema,
  messageIdParamSchema,
  projectIdParamSchema,
  updateMessageSchema,
} from './message.schema.ts'
import {
  createMessageService,
  deleteMessageService,
  listMessagesService,
  updateMessageService,
} from './message.service.ts'

export const listMessagesController = asyncHandler(async (req, res) => {
  assertUser(req.user)

  const { projectId } = projectIdParamSchema.parse(req.params)
  const { discussionId } = discussionIdParamSchema.parse(req.params)

  const messages = await listMessagesService(projectId, discussionId, req.user.id)

  return res
    .status(200)
    .json(new ApiResponse(200, 'Messages fetched successfully', messages))
})

export const createMessageController = asyncHandler(async (req, res) => {
  assertUser(req.user)

  const { projectId } = projectIdParamSchema.parse(req.params)
  const { discussionId } = discussionIdParamSchema.parse(req.params)
  const body = createMessageSchema.parse(req.body)

  const message = await createMessageService(
    {
      ...body,
      projectId,
      discussionId,
    } satisfies CreateMessageInput,
    req.user.id,
  )

  return res
    .status(201)
    .json(new ApiResponse(201, 'Message created successfully', message))
})

export const deleteMessageController = asyncHandler(async (req, res) => {
  assertUser(req.user)

  const { projectId } = projectIdParamSchema.parse(req.params)
  const { discussionId } = discussionIdParamSchema.parse(req.params)
  const { messageId } = messageIdParamSchema.parse(req.params)

  const message = await deleteMessageService(
    projectId,
    discussionId,
    messageId,
    req.user.id,
  )

  return res
    .status(200)
    .json(new ApiResponse(200, 'Message deleted successfully', message))
})

export const updateMessageController = asyncHandler(async (req, res) => {
  assertUser(req.user)

  const { projectId } = projectIdParamSchema.parse(req.params)
  const { discussionId } = discussionIdParamSchema.parse(req.params)
  const { messageId } = messageIdParamSchema.parse(req.params)
  const body = updateMessageSchema.parse(req.body)

  const message = await updateMessageService(
    projectId,
    discussionId,
    messageId,
    body.content,
    req.user.id,
  )

  return res
    .status(200)
    .json(new ApiResponse(200, 'Message updated successfully', message))
})
