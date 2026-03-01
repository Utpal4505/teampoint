import { Router } from 'express'
import { hardAuth } from '../../middlewares/auth.middlewares.ts'
import {
  avatarCompleteController,
  deleteUserController,
  getCurrentUserController,
  loggedOutController,
  onboardingController,
  updateUserController,
} from './user.controller.ts'
import { validateRequest } from '../../middlewares/validateRequest.ts'
import { updateUserSchema, userOnboardingSchema } from './user.schema.ts'
import { AvatarCompleteSchema } from '../upload/upload.schema.ts'

const router = Router()

router.use(hardAuth)

/**
 * @swagger
 * /users/me:
 *   get:
 *     summary: Get current logged in user
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User details fetched successfully
 */
router.get('/me', getCurrentUserController)

/**
 * @swagger
 * /users/onboarding:
 *   post:
 *     summary: Complete user onboarding
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Onboarding completed
 */
router.post(
  '/onboarding',
  validateRequest(userOnboardingSchema, 'body'),
  onboardingController,
)

/**
 * @swagger
 * /users/me:
 *   patch:
 *     summary: Update current user
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: User updated successfully
 */
router.patch('/me', validateRequest(updateUserSchema, 'body'), updateUserController)

/**
 * @swagger
 * /users/me:
 *   delete:
 *     summary: Delete current user
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User deleted successfully
 */
router.delete('/me', deleteUserController)

/**
 * @swagger
 * /users/logout:
 *   post:
 *     summary: Logout current user
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User logged out
 */
router.post('/logout', loggedOutController)

/**
 * @swagger
 * /users/avatar/complete:
 *   patch:
 *     summary: Complete avatar upload
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Avatar completed successfully
 */
router.patch(
  '/avatar/complete',
  validateRequest(AvatarCompleteSchema, 'body'),
  avatarCompleteController,
)

export default router
