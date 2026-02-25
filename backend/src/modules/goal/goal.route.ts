import { Router } from 'express'
import { hardAuth } from '../../middlewares/auth.middlewares.ts'
import { validateRequest } from '../../middlewares/validateRequest.ts'

import {
  CreateGoalSchema,
  UpdateGoalSchema,
  CompleteGoalSchema,
  DeleteGoalSchema,
  idParam,
} from './goal.schema.ts'

import {
  createGoalController,
  listGoalsController,
  getGoalController,
  updateGoalController,
  completeGoalController,
  deleteGoalController,
} from './goal.controller.ts'
import { requireProjectPermission } from '../../middlewares/requireProjectPermission.middleware.ts'

const router = Router({ mergeParams: true })

router.use(hardAuth)

router.post(
  '/',
  validateRequest(CreateGoalSchema, 'body'),
  requireProjectPermission('canCreateGoals'),
  createGoalController,
)

router.get(
  '/',
  validateRequest(idParam, 'params'),
  requireProjectPermission('canViewGoals'),
  listGoalsController,
)

router.get(
  '/:goalId',
  validateRequest(idParam, 'params'),
  requireProjectPermission('canViewGoals'),
  getGoalController,
)

router.patch(
  '/:goalId',
  validateRequest(UpdateGoalSchema, 'body'),
  requireProjectPermission('canUpdateAnyGoal'),
  updateGoalController,
)

router.post(
  '/:goalId/complete',
  validateRequest(CompleteGoalSchema, 'params'),
  requireProjectPermission('canCompleteGoal'),
  completeGoalController,
)

router.delete(
  '/:goalId',
  validateRequest(DeleteGoalSchema, 'params'),
  requireProjectPermission('canDeleteGoals'),
  deleteGoalController,
)

export default router
