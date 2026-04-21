import { Router } from 'express'
import { hardAuth } from '../../middlewares/auth.middlewares.ts'
import { requireProjectPermission } from '../../middlewares/requireProjectPermission.middleware.ts'
import { validateRequest } from '../../middlewares/validateRequest.ts'
import {
  createMessageSchema,
  discussionIdParamSchema,
  messageIdParamSchema,
  projectIdParamSchema,
} from './message.schema.ts'
import {
  createMessageController,
  deleteMessageController,
  listMessagesController,
  updateMessageController,
} from './message.controller.ts'

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
