import { Router } from 'express'
import { validateRequest } from '../../middlewares/validateRequest.ts'
import { createWorkspaceSchema, workspaceIdParamSchema } from './workspace.schema.ts'
import {
  archiveWorkspaceController,
  createWorkspaceController,
  deleteWorkspaceController,
  getWorkspaceByIdController,
  listAllWorkspaceMembersController,
  listAllWorkspaceProjectController,
  listUserWorkspacesController,
  removeWorkspaceMemberController,
  updateWorkspaceController,
  updateWorkspaceMemberRoleController,
} from './workspace.controller.ts'
import { hardAuth } from '../../middlewares/auth.middlewares.ts'
import { requireWorkspacePermission } from '../../middlewares/requireWorkspacePermission.middleware.ts'
import { userIdParamSchema } from '../user/user.schema.ts'
import { listWorkspaceAssignedTasksController } from '../tasks/task.controller.ts'

const router = Router()

router.use(hardAuth)

router.get('/user-workspaces', listUserWorkspacesController)

router.post(
  '/',
  validateRequest(createWorkspaceSchema, 'body'),
  createWorkspaceController,
)

router.get(
  '/:workspaceId',
  validateRequest(workspaceIdParamSchema, 'params'),
  getWorkspaceByIdController,
)

router.patch(
  '/:workspaceId',
  validateRequest(workspaceIdParamSchema, 'params'),
  requireWorkspacePermission('canEditWorkspace'),
  updateWorkspaceController,
)

router.post(
  '/:workspaceId/archive',
  validateRequest(workspaceIdParamSchema, 'params'),
  requireWorkspacePermission('canArchiveWorkspace'),
  archiveWorkspaceController,
)

router.delete(
  '/:workspaceId',
  validateRequest(workspaceIdParamSchema, 'params'),
  requireWorkspacePermission('canDeleteWorkspace'),
  deleteWorkspaceController,
)

router.get(
  '/:workspaceId/members',
  validateRequest(workspaceIdParamSchema, 'params'),
  requireWorkspacePermission('canViewMembers'),
  listAllWorkspaceMembersController,
)

router.patch(
  '/:workspaceId/members/:targetUserId',
  validateRequest(workspaceIdParamSchema, 'params'),
  validateRequest(userIdParamSchema, 'params'),
  requireWorkspacePermission('canChangeRoles'),
  updateWorkspaceMemberRoleController,
)

router.delete(
  '/:workspaceId/members/:targetUserId',
  validateRequest(workspaceIdParamSchema, 'params'),
  validateRequest(userIdParamSchema, 'params'),
  requireWorkspacePermission('canRemoveMembers'),
  removeWorkspaceMemberController,
)

router.get(
  '/:workspaceId/projects',
  validateRequest(workspaceIdParamSchema, 'params'),
  listAllWorkspaceProjectController,
)

router.get(
  '/:workspaceId/my-tasks',
  validateRequest(workspaceIdParamSchema, 'params'),
  listWorkspaceAssignedTasksController,
)
export default router
