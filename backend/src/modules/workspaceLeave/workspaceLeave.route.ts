import { Router } from 'express'
import { hardAuth } from '../../middlewares/auth.middlewares.ts'
import { validateRequest } from '../../middlewares/validateRequest.ts'

import {
  CreateLeaveRequestSchema,
  UpdateLeaveRequestSchema,
  ReviewLeaveRequestSchema,
} from './workspaceLeave.schema.ts'

import {
  createLeaveRequestController,
  listLeaveRequestsController,
  getLeaveRequestController,
  updateLeaveRequestController,
  reviewLeaveRequestController,
} from './workspaceLeave.controller.ts'
import { requireWorkspacePermission } from '../../middlewares/requireWorkspacePermission.middleware.ts'
import { idParam } from '../documentLinks/documentLinks.schema.ts'

const router = Router({ mergeParams: true })

router.use(hardAuth)

router.post(
  '/',
  validateRequest(CreateLeaveRequestSchema, 'body'),
  requireWorkspacePermission('canCreateLeaveRequest'),
  createLeaveRequestController,
)

router.get(
  '/',
  requireWorkspacePermission('canViewAllLeaveRequests'),
  listLeaveRequestsController,
)

router.get(
  '/:requestId',
  validateRequest(idParam, 'params'),
  requireWorkspacePermission('canViewAllLeaveRequests'),
  getLeaveRequestController,
)

router.patch(
  '/:requestId',
  validateRequest(UpdateLeaveRequestSchema, 'body'),
  requireWorkspacePermission('canUpdateLeaveRequests'),
  updateLeaveRequestController,
)

router.post(
  '/:requestId/review',
  validateRequest(ReviewLeaveRequestSchema, 'body'),
  requireWorkspacePermission('canReviewLeaveRequests'),
  reviewLeaveRequestController,
)

export default router
