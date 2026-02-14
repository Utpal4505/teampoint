import { Router } from 'express'
import { hardAuth } from '../../middlewares/auth.middlewares.ts'
import { getUserByIdController, onboardingController } from './user.controller.ts'
import { validateRequest } from '../../middlewares/validateRequest.ts'
import { userOnboardingSchema } from './user.schema.ts'

const router = Router()

router.get("/me", hardAuth, getUserByIdController)
router.post("/onboarding", hardAuth, validateRequest(userOnboardingSchema, 'body'), onboardingController)

export default router