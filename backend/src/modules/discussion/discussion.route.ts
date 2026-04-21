import { Router } from 'express'
import { hardAuth } from '../../middlewares/auth.middlewares.ts'
import { requireProjectPermission } from '../../middlewares/requireProjectPermission.middleware.ts'
import { validateRequest } from '../../middlewares/validateRequest.ts'
import {
  createDiscussionSchema,
  discussionIdParamSchema,
  listDiscussionsQuerySchema,
  projectIdParamSchema,
  updateDiscussionSchema,
} from './discussion.schema.ts'
import {
  createDiscussionController,
  getDiscussionByIdController,
  listDiscussionsController,
  closeDiscussionController,
  reopenDiscussionController,
  updateDiscussionController,
} from './discussion.controller.ts'

const router = Router({ mergeParams: true })

router.use(hardAuth)
router.use(validateRequest(projectIdParamSchema, 'params'))

router.get(
  '/',
  requireProjectPermission('canViewDiscussions'),
  validateRequest(listDiscussionsQuerySchema, 'query'),
  listDiscussionsController,
)

router.post(
  '/',
  validateRequest(createDiscussionSchema, 'body'),
  requireProjectPermission('canCreateDiscussions'),
  createDiscussionController,
)

router.get(
  '/:discussionId',
  validateRequest(discussionIdParamSchema, 'params'),
  requireProjectPermission('canViewDiscussions'),
  getDiscussionByIdController,
)

router.patch(
  '/:discussionId',
  validateRequest(discussionIdParamSchema, 'params'),
  validateRequest(updateDiscussionSchema, 'body'),
  updateDiscussionController,
)

router.post(
  '/:discussionId/close',
  validateRequest(discussionIdParamSchema, 'params'),
  requireProjectPermission('canCloseDiscussions'),
  closeDiscussionController,
)

router.post(
  '/:discussionId/reopen',
  validateRequest(discussionIdParamSchema, 'params'),
  requireProjectPermission('canReopenDiscussions'),
  reopenDiscussionController,
)

export default router
