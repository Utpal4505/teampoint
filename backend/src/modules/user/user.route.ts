import { Router } from 'express'
import { hardAuth } from '../../middlewares/auth.middlewares.ts'
import {
  deleteUserController,
  getCurrentUserController,
  loggedOutController,
  onboardingController,
  updateUserController,
} from './user.controller.ts'
import { validateRequest } from '../../middlewares/validateRequest.ts'
import { updateUserSchema, userOnboardingSchema } from './user.schema.ts'

const router = Router()

router.use(hardAuth)

router.get('/me', getCurrentUserController)
router.post(
  '/onboarding',
  validateRequest(userOnboardingSchema, 'body'),
  onboardingController,
)
router.patch('/me', validateRequest(updateUserSchema, 'body'), updateUserController)
router.delete('/me', deleteUserController)
router.post('/logout', loggedOutController)

export default router
