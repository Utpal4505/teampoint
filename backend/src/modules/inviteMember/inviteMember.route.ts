import { Router } from 'express'
import { hardAuth } from '../../middlewares/auth.middlewares.ts'
import { validateRequest } from '../../middlewares/validateRequest.ts'
import { workspaceIdParamSchema } from '../workspace/workspace.schema.ts'
import { requireWorkspacePermission } from '../../middlewares/requireWorkspacePermission.middleware.ts'
import { acceptInviteSchema, inviteIdParamSchema } from './inviteMember.schema.ts'
import {
  acceptInviteController,
  getSingleInviteController,
  listAllInvitesController,
  revokeInviteController,
  sendInviteController,
} from './inviteMember.controller.ts'

const router = Router()

router.post(
  '/:workspaceId/invites',
  hardAuth,
  validateRequest(workspaceIdParamSchema, 'params'),
  requireWorkspacePermission('canInviteMembers'),
  sendInviteController,
)

router.get(
  '/:workspaceId/invites/:inviteId',
  hardAuth,
  validateRequest(workspaceIdParamSchema, 'params'),
  validateRequest(inviteIdParamSchema, 'params'),
  requireWorkspacePermission('canViewInvites'),
  getSingleInviteController,
)

router.get(
  '/:workspaceId/invites',
  hardAuth,
  validateRequest(workspaceIdParamSchema, 'params'),
  requireWorkspacePermission('canViewInvites'),
  listAllInvitesController,
)

router.delete(
  '/:workspaceId/invites/:inviteId/revoke',
  hardAuth,
  validateRequest(workspaceIdParamSchema, 'params'),
  validateRequest(inviteIdParamSchema, 'params'),
  requireWorkspacePermission('canRevokeInviteMembers'),
  revokeInviteController,
)

router.post(
  '/invites/accept',
  hardAuth,
  validateRequest(acceptInviteSchema, 'body'),
  acceptInviteController,
)

export default router
