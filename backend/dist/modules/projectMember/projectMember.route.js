import { Router } from 'express';
import { hardAuth } from '../../middlewares/auth.middlewares.js';
import { validateRequest } from '../../middlewares/validateRequest.js';
import { addProjectMemberSchema, exitProjectSchema, projectIdAndUserIdParamSchema, projectIdParamSchema, updateProjectMemberSchema, } from './projectMember.schema.js';
import { addProjectMemberController, exitProjectController, listProjectMembersController, removeProjectMemberController, updateProjectMemberController, } from './projectMember.controller.js';
import { requireProjectPermission } from '../../middlewares/requireProjectPermission.middleware.js';
const router = Router();
router.use(hardAuth);
router.get('/:projectId/members', validateRequest(projectIdParamSchema, 'params'), requireProjectPermission('canViewMembers'), listProjectMembersController);
router.post('/:projectId/members', validateRequest(projectIdParamSchema, 'params'), validateRequest(addProjectMemberSchema, 'body'), requireProjectPermission('canInviteMembers'), addProjectMemberController);
router.post('/:projectId/members/exit', validateRequest(projectIdParamSchema, 'params'), validateRequest(exitProjectSchema, 'body'), exitProjectController);
router.patch('/:projectId/members/:userId', validateRequest(projectIdAndUserIdParamSchema, 'params'), validateRequest(updateProjectMemberSchema, 'body'), requireProjectPermission('canChangeRoles'), updateProjectMemberController);
router.delete('/:projectId/members/:userId', validateRequest(projectIdAndUserIdParamSchema, 'params'), requireProjectPermission('canRemoveMembers'), removeProjectMemberController);
export default router;
//# sourceMappingURL=projectMember.route.js.map