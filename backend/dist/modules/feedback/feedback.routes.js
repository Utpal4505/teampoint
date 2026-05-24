import { Router } from 'express';
import { validateRequest } from '../../middlewares/validateRequest.js';
import { createFeedbackSchema, updateFeedbackStatusSchema } from './feedback.schema.js';
import { createFeedbackController, getFeedbackController, listFeedbackController, updateFeedbackStatusController, deleteFeedbackController, } from './feedback.controller.js';
import { softAuth } from '../../middlewares/auth.middlewares.js';
const router = Router();
router.use(softAuth);
router.post('/', validateRequest(createFeedbackSchema), createFeedbackController);
router.get('/', listFeedbackController);
router.get('/:id', getFeedbackController);
router.patch('/:id/status', validateRequest(updateFeedbackStatusSchema), updateFeedbackStatusController);
router.delete('/:id', deleteFeedbackController);
export default router;
//# sourceMappingURL=feedback.routes.js.map