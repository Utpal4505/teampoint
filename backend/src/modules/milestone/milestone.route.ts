import { Router } from 'express'
import { hardAuth } from '../../middlewares/auth.middlewares.ts'
import { validateRequest } from '../../middlewares/validateRequest.ts'

import {
  CreateMilestoneSchema,
  UpdateMilestoneSchema,
  CompleteMilestoneSchema,
} from './milestone.schema.ts'

import {
  createMilestoneController,
  listMilestonesController,
  getMilestoneController,
  updateMilestoneController,
  completeMilestoneController,
} from './milestone.controller.ts'

import { requireProjectPermission } from '../../middlewares/requireProjectPermission.middleware.ts'
import { idParam } from '../documentLinks/documentLinks.schema.ts'

const router = Router({ mergeParams: true })

router.use(hardAuth)

router.post(
  '/',
  validateRequest(CreateMilestoneSchema, 'body'),
  requireProjectPermission('canCreateMilestones'),
  createMilestoneController,
)

router.get(
  '/',
  validateRequest(idParam, 'params'),
  requireProjectPermission('canViewMilestones'),
  listMilestonesController,
)

router.get(
  '/:milestoneId',
  validateRequest(idParam, 'params'),
  requireProjectPermission('canViewMilestones'),
  getMilestoneController,
)

router.patch(
  '/:milestoneId',
  validateRequest(UpdateMilestoneSchema, 'body'),
  requireProjectPermission('canUpdateAnyMilestone'),
  updateMilestoneController,
)

router.post(
  '/:milestoneId/complete',
  validateRequest(CompleteMilestoneSchema, 'params'),
  requireProjectPermission('canCompleteMilestone'),
  completeMilestoneController,
)

export default router
