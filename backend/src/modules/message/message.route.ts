import { Router } from 'express'
import { hardAuth } from '../../middlewares/auth.middlewares.js'
import { requireProjectPermission } from '../../middlewares/requireProjectPermission.middleware.js'
import { validateRequest } from '../../middlewares/validateRequest.js'
import {
  createMessageSchema,
  discussionIdParamSchema,
  messageIdParamSchema,
  projectIdParamSchema,
} from './message.schema.js'
import {
  createMessageController,
  deleteMessageController,
  listMessagesController,
  updateMessageController,
} from './message.controller.js'

const router = Router({ mergeParams: true })

router.use(hardAuth)
router.use(validateRequest(projectIdParamSchema, 'params'))
router.use(validateRequest(discussionIdParamSchema, 'params'))

router.get('/', requireProjectPermission('canViewDiscussions'), listMessagesController)

router.post(
  '/',
  validateRequest(createMessageSchema, 'body'),
  requireProjectPermission('canComment'),
  createMessageController,
)

router.delete(
  '/:messageId',
  validateRequest(messageIdParamSchema, 'params'),
  deleteMessageController,
)

router.patch(
  '/:messageId',
  validateRequest(messageIdParamSchema, 'params'),
  validateRequest(createMessageSchema.partial(), 'body'),
  updateMessageController,
)

export default router
