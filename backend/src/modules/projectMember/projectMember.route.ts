import { Router } from 'express'
import { hardAuth } from '../../middlewares/auth.middlewares.ts'
import { validateRequest } from '../../middlewares/validateRequest.ts'
import {
  addProjectMemberSchema,
  exitProjectSchema,
  projectIdAndUserIdParamSchema,
  projectIdParamSchema,
  updateProjectMemberSchema,
} from './projectMember.schema.ts'
import {
  addProjectMemberController,
  exitProjectController,
  listProjectMembersController,
  removeProjectMemberController,
  updateProjectMemberController,
} from './projectMember.controller.ts'
import { requireProjectPermission } from '../../middlewares/requireProjectPermission.middleware.ts'

const router = Router()

router.use(hardAuth)

router.get(
  '/:projectId/members',
  validateRequest(projectIdParamSchema, 'params'),
  requireProjectPermission('canViewMembers'),
  listProjectMembersController,
)

router.post(
  '/:projectId/members',
  validateRequest(projectIdParamSchema, 'params'),
  validateRequest(addProjectMemberSchema, 'body'),
  requireProjectPermission('canInviteMembers'),
  addProjectMemberController,
)

router.post(
  '/:projectId/members/exit',
  validateRequest(projectIdParamSchema, 'params'),
  validateRequest(exitProjectSchema, 'body'),
  exitProjectController,
)

router.patch(
  '/:projectId/members/:userId',
  validateRequest(projectIdAndUserIdParamSchema, 'params'),
  validateRequest(updateProjectMemberSchema, 'body'),
  requireProjectPermission('canChangeRoles'),
  updateProjectMemberController,
)

router.delete(
  '/:projectId/members/:userId',
  validateRequest(projectIdAndUserIdParamSchema, 'params'),
  requireProjectPermission('canRemoveMembers'),
  removeProjectMemberController,
)

export default router
