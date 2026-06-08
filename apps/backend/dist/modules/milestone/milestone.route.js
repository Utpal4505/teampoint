import { Router } from 'express';
import { hardAuth } from '../../middlewares/auth.middlewares.js';
import { validateRequest } from '../../middlewares/validateRequest.js';
import { CreateMilestoneSchema, UpdateMilestoneSchema, CompleteMilestoneSchema, } from './milestone.schema.js';
import { createMilestoneController, listMilestonesController, getMilestoneController, updateMilestoneController, completeMilestoneController, } from './milestone.controller.js';
import { requireProjectPermission } from '../../middlewares/requireProjectPermission.middleware.js';
import { idParam } from '../documentLinks/documentLinks.schema.js';
const router = Router({ mergeParams: true });
router.use(hardAuth);
router.post('/', validateRequest(CreateMilestoneSchema, 'body'), requireProjectPermission('canCreateMilestones'), createMilestoneController);
router.get('/', validateRequest(idParam, 'params'), requireProjectPermission('canViewMilestones'), listMilestonesController);
router.get('/:milestoneId', validateRequest(idParam, 'params'), requireProjectPermission('canViewMilestones'), getMilestoneController);
router.patch('/:milestoneId', validateRequest(UpdateMilestoneSchema, 'body'), requireProjectPermission('canUpdateAnyMilestone'), updateMilestoneController);
router.post('/:milestoneId/complete', validateRequest(CompleteMilestoneSchema, 'params'), requireProjectPermission('canCompleteMilestone'), completeMilestoneController);
export default router;
//# sourceMappingURL=milestone.route.js.map