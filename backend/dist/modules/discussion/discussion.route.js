import { Router } from 'express';
import { hardAuth } from '../../middlewares/auth.middlewares.js';
import { requireProjectPermission } from '../../middlewares/requireProjectPermission.middleware.js';
import { validateRequest } from '../../middlewares/validateRequest.js';
import { createDiscussionSchema, discussionIdParamSchema, listDiscussionsQuerySchema, projectIdParamSchema, updateDiscussionSchema, } from './discussion.schema.js';
import { createDiscussionController, getDiscussionByIdController, listDiscussionsController, closeDiscussionController, deleteDiscussionController, reopenDiscussionController, updateDiscussionController, } from './discussion.controller.js';
const router = Router({ mergeParams: true });
router.use(hardAuth);
router.use(validateRequest(projectIdParamSchema, 'params'));
router.get('/', requireProjectPermission('canViewDiscussions'), validateRequest(listDiscussionsQuerySchema, 'query'), listDiscussionsController);
router.post('/', validateRequest(createDiscussionSchema, 'body'), requireProjectPermission('canCreateDiscussions'), createDiscussionController);
router.get('/:discussionId', validateRequest(discussionIdParamSchema, 'params'), requireProjectPermission('canViewDiscussions'), getDiscussionByIdController);
router.patch('/:discussionId', validateRequest(discussionIdParamSchema, 'params'), validateRequest(updateDiscussionSchema, 'body'), updateDiscussionController);
router.post('/:discussionId/close', validateRequest(discussionIdParamSchema, 'params'), closeDiscussionController);
router.post('/:discussionId/reopen', validateRequest(discussionIdParamSchema, 'params'), reopenDiscussionController);
router.delete('/:discussionId', validateRequest(discussionIdParamSchema, 'params'), deleteDiscussionController);
export default router;
//# sourceMappingURL=discussion.route.js.map