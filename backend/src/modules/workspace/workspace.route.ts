import { Router } from 'express'
import { validateRequest } from '../../middlewares/validateRequest.ts'
import { createWorkspaceSchema, workspaceIdParamSchema } from './workspace.schema.ts'
import {
  archiveWorkspaceController,
  createWorkspaceController,
  deleteWorkspaceController,
  getWorkspaceByIdController,
  listAllWorkspaceMembersController,
  removeWorkspaceMemberController,
  updateWorkspaceController,
  updateWorkspaceMemberRoleController,
} from './workspace.controller.ts'
import { hardAuth } from '../../middlewares/auth.middlewares.ts'
import { requireWorkspacePermission } from '../../middlewares/requireWorkspacePermission.middleware.ts'
import { userIdParamSchema } from '../user/user.schema.ts'

const router = Router()

router.post(
  '/',
  hardAuth,
  validateRequest(createWorkspaceSchema, 'body'),
  createWorkspaceController,
)

router.get(
  '/:workspaceId',
  hardAuth,
  validateRequest(workspaceIdParamSchema, 'params'),
  getWorkspaceByIdController,
)

router.patch(
  '/:workspaceId',
  hardAuth,
  validateRequest(workspaceIdParamSchema, 'params'),
  requireWorkspacePermission('canEditWorkspace'),
  updateWorkspaceController,
)

router.post(
  '/:workspaceId/archive',
  hardAuth,
  validateRequest(workspaceIdParamSchema, 'params'),
  requireWorkspacePermission('canArchiveWorkspace'),
  archiveWorkspaceController,
)

router.delete(
  '/:workspaceId',
  hardAuth,
  validateRequest(workspaceIdParamSchema, 'params'),
  requireWorkspacePermission('canDeleteWorkspace'),
  deleteWorkspaceController,
)

router.get(
  '/:workspaceId/members',
  hardAuth,
  validateRequest(workspaceIdParamSchema, 'params'),
  requireWorkspacePermission('canViewMembers'),
  listAllWorkspaceMembersController,
)

router.patch(
  '/:workspaceId/members/:targetUserId',
  hardAuth,
  validateRequest(workspaceIdParamSchema, 'params'),
  validateRequest(userIdParamSchema, 'params'),
  requireWorkspacePermission('canChangeRoles'),
  updateWorkspaceMemberRoleController,
)

router.delete(
  '/:workspaceId/members/:targetUserId',
  hardAuth,
  validateRequest(workspaceIdParamSchema, 'params'),
  validateRequest(userIdParamSchema, 'params'),
  requireWorkspacePermission('canRemoveMembers'),
  removeWorkspaceMemberController,
)

export default router
