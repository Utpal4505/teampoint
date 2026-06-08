import { Router } from 'express';
import { hardAuth } from '../../middlewares/auth.middlewares.js';
import { avatarCompleteController, deleteUserController, getCurrentUserController, loggedOutController, onboardingController, updateUserController, } from './user.controller.js';
import { validateRequest } from '../../middlewares/validateRequest.js';
import { updateUserSchema, userOnboardingSchema } from './user.schema.js';
import { AvatarCompleteSchema } from '../upload/upload.schema.js';
const router = Router();
router.use(hardAuth);
router.get('/me', getCurrentUserController);
router.post('/onboarding', validateRequest(userOnboardingSchema, 'body'), onboardingController);
router.patch('/me', validateRequest(updateUserSchema, 'body'), updateUserController);
router.delete('/me', deleteUserController);
router.post('/logout', loggedOutController);
router.patch('/avatar/complete', validateRequest(AvatarCompleteSchema, 'body'), avatarCompleteController);
export default router;
//# sourceMappingURL=user.route.js.map