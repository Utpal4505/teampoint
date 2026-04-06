import { Router } from 'express'
import { validateRequest } from '../../middlewares/validateRequest.ts'
import { createFeedbackSchema, updateFeedbackStatusSchema } from './feedback.schema.ts'
import {
  createFeedbackController,
  getFeedbackController,
  listFeedbackController,
  updateFeedbackStatusController,
  deleteFeedbackController,
} from './feedback.controller.ts'
import { softAuth } from '../../middlewares/auth.middlewares.ts'

const router = Router()

// Apply soft authentication middleware to all routes
router.use(softAuth)

// Create feedback
router.post('/', validateRequest(createFeedbackSchema), createFeedbackController)

// List feedback with filters
router.get('/', listFeedbackController)

// Get feedback by ID
router.get('/:id', getFeedbackController)

// Update feedback status (admin only)
router.patch(
  '/:id/status',
  validateRequest(updateFeedbackStatusSchema),
  updateFeedbackStatusController,
)

// Delete feedback
router.delete('/:id', deleteFeedbackController)

export default router
