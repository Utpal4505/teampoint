import { Router } from 'express';
import { hardAuth } from '../../middlewares/auth.middlewares.js';
import { validateRequest } from '../../middlewares/validateRequest.js';
import { CreateLeaveRequestSchema, UpdateLeaveRequestSchema, ReviewLeaveRequestSchema, } from './workspaceLeave.schema.js';
import { createLeaveRequestController, listLeaveRequestsController, getLeaveRequestController, updateLeaveRequestController, reviewLeaveRequestController, } from './workspaceLeave.controller.js';
import { requireWorkspacePermission } from '../../middlewares/requireWorkspacePermission.middleware.js';
import { idParam } from '../documentLinks/documentLinks.schema.js';
const router = Router({ mergeParams: true });
router.use(hardAuth);
router.post('/', validateRequest(CreateLeaveRequestSchema, 'body'), requireWorkspacePermission('canCreateLeaveRequest'), createLeaveRequestController);
router.get('/', requireWorkspacePermission('canViewAllLeaveRequests'), listLeaveRequestsController);
router.get('/:requestId', validateRequest(idParam, 'params'), requireWorkspacePermission('canViewAllLeaveRequests'), getLeaveRequestController);
router.patch('/:requestId', validateRequest(UpdateLeaveRequestSchema, 'body'), requireWorkspacePermission('canUpdateLeaveRequests'), updateLeaveRequestController);
router.post('/:requestId/review', validateRequest(ReviewLeaveRequestSchema, 'body'), requireWorkspacePermission('canReviewLeaveRequests'), reviewLeaveRequestController);
export default router;
//# sourceMappingURL=workspaceLeave.route.js.map