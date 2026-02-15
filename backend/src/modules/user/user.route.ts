import { Router } from 'express'
import { hardAuth } from '../../middlewares/auth.middlewares.ts'
import {
  deleteUserController,
  getCurrentUserController,
  loggedOutController,
  onboardingController,
} from './user.controller.ts'
import { validateRequest } from '../../middlewares/validateRequest.ts'
import { userOnboardingSchema } from './user.schema.ts'

const router = Router()

router.get('/me', hardAuth, getCurrentUserController)
router.post(
  '/onboarding',
  hardAuth,
  validateRequest(userOnboardingSchema, 'body'),
  onboardingController,
)
router.delete('/me', hardAuth, deleteUserController)
router.post('/logout', hardAuth, loggedOutController)

export default router
