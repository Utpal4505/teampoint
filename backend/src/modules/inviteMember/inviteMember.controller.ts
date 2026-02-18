import { ApiResponse } from '../../utils/apiResponse.ts'
import { assertUser } from '../../utils/assertUser.ts'
import { asyncHandler } from '../../utils/asyncHandler.ts'
import {
  revokeInviteService,
  acceptInviteService,
  getSingleInviteService,
  listAllInvitesService,
  sendInviteService,
} from './inviteMember.service.ts'
import type {
  SendInviteInput,
  GetInviteInput,
  ListInvitesInput,
  RevokeInviteInput,
  AcceptInviteInput,
} from '../../types/inviteMember.type.ts'

export const sendInviteController = asyncHandler(async (req, res) => {
  assertUser(req.user)

  const { workspaceId } = req.params
  const { email, role } = req.body

  const result = await sendInviteService({
    workspaceId: Number(workspaceId),
    email,
    role,
    invitedBy: req.user.id,
  } as SendInviteInput)

  return res.status(201).json(new ApiResponse(201, 'Invite created', result))
})

export const getSingleInviteController = asyncHandler(async (req, res) => {
  assertUser(req.user)

  const { workspaceId, inviteId } = req.params

  const result = await getSingleInviteService({
    workspaceId: Number(workspaceId),
    inviteId: Number(inviteId),
  } as GetInviteInput)

  return res.status(200).json(new ApiResponse(200, 'Invite retrieved', result))
})

export const listAllInvitesController = asyncHandler(async (req, res) => {
  assertUser(req.user)

  const { workspaceId } = req.params

  const result = await listAllInvitesService({
    workspaceId: Number(workspaceId),
  } as ListInvitesInput)

  return res.status(200).json(new ApiResponse(200, 'Invites listed', result))
})

export const revokeInviteController = asyncHandler(async (req, res) => {
  assertUser(req.user)

  const { workspaceId, inviteId } = req.params

  const result = await revokeInviteService({
    workspaceId: Number(workspaceId),
    inviteId: Number(inviteId),
    actorId: req.user.id,
  } as RevokeInviteInput)

  return res.status(200).json(new ApiResponse(200, 'Invite revoked successfully', result))
})

export const acceptInviteController = asyncHandler(async (req, res) => {
  assertUser(req.user)

  const { token, tokenId } = req.body 

  const result = await acceptInviteService({
    token,
    tokenId,
    userId: req.user.id,
  } as AcceptInviteInput)

  return res
    .status(200)
    .json(new ApiResponse(200, 'Invite accepted successfully', result))
})