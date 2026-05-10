import { Router } from 'express'
import { validateRequest } from '../../middlewares/validateRequest.ts'
import { workspaceIdParamSchema } from '../workspace/workspace.schema.ts'
import { requireWorkspacePermission } from '../../middlewares/requireWorkspacePermission.middleware.ts'
import { acceptInviteSchema, inviteIdParamSchema, validateInviteParamSchema } from './inviteMember.schema.ts'
import {
  acceptInviteController,
  getSingleInviteController,
  listAllInvitesController,
  revokeInviteController,
  sendInviteController,
  validateInviteController,
} from './inviteMember.controller.ts'

const router = Router()

router.post(
  '/:workspaceId/invites',
  requireWorkspacePermission('canInviteMembers'),
  sendInviteController,
)

router.get(
  '/:workspaceId/invites/:inviteId',
  validateRequest(workspaceIdParamSchema, 'params'),
  validateRequest(inviteIdParamSchema, 'params'),
  requireWorkspacePermission('canViewInvites'),
  getSingleInviteController,
)

router.get(
  '/:workspaceId/invites',
  validateRequest(workspaceIdParamSchema, 'params'),
  requireWorkspacePermission('canViewInvites'),
  listAllInvitesController,
)

router.delete(
  '/:workspaceId/invites/:inviteId/revoke',
  validateRequest(workspaceIdParamSchema, 'params'),
  validateRequest(inviteIdParamSchema, 'params'),
  requireWorkspacePermission('canRevokeInviteMembers'),
  revokeInviteController,
)

router.post(
  '/invites/accept',
  validateRequest(acceptInviteSchema, 'body'),
  acceptInviteController,
)

export const publicInviteRouter = Router()

publicInviteRouter.get(
  '/invites/validate/:tokenId/:token',
  validateRequest(validateInviteParamSchema, 'params'),
  validateInviteController,
)

export default router
