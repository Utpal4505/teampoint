import { prisma } from '../../config/db.config.ts'
import type {
  SendInviteInput,
  SendInviteDTO,
  GetInviteInput,
  GetInviteDTO,
  ListInvitesInput,
  ListInvitesDTO,
  RevokeInviteInput,
  RevokeInviteDTO,
  AcceptInviteInput,
  AcceptInviteDTO,
} from '../../types/inviteMember.type.ts'
import { ApiError } from '../../utils/apiError.ts'
import { v4 as uuid } from 'uuid'
import bcrypt from 'bcrypt'
import { env } from '../../config/env.ts'
import { ROLE_PERMISSIONS } from '../workspace/workspace.permissions.ts'
import { generateInviteEmailTemplate } from './inviteMember.email.template.ts'
import { sendEmail } from '../../utils/sendEmail.ts'
import { withRetry } from '../../utils/retry.ts'

const buildInviteLink = (token: string, tokenId: number) =>
  `${env.CLIENT_URL}/invite/${tokenId}/${token}/accept`

export const sendInviteService = async (input: SendInviteInput): Promise<SendInviteDTO> => {
  const { workspaceId, email, role, invitedBy } = input

  const workspace = await prisma.workspace.findUnique({
    where: { id: workspaceId },
    select: { id: true, name: true, status: true },
  })

  if (!workspace || workspace.status === 'DELETED') {
    throw new ApiError(404, 'Workspace not found')
  }

  const existingUser = await prisma.user.findUnique({
    where: { email },
    select: { id: true },
  })

  if (existingUser) {
    const membership = await prisma.workspace_Members.findUnique({
      where: {
        workspaceId_userId: {
          workspaceId,
          userId: existingUser.id,
        },
      },
      select: { status: true },
    })

    if (membership && membership.status === 'ACTIVE') {
      throw new ApiError(400, 'User is already a member of this workspace')
    }
  }

  const existingInvite = await prisma.invite_Member.findFirst({
    where: {
      workspaceId,
      email,
      status: 'PENDING',
    },
  })

  if (existingInvite) {
    throw new ApiError(400, 'An invite has already been sent to this email')
  }

  if (!ROLE_PERMISSIONS[role]) throw new ApiError(400, 'Invalid role')

  const token = uuid()

  const hashedToken = await bcrypt.hash(token, 10)

  const expiredAt = new Date(Date.now() + 10 * 60 * 1000)

  const inviteRecord = await prisma.invite_Member.create({
    data: {
      workspaceId,
      email,
      role,
      invitedBy,
      token: hashedToken,
      expiredAt: expiredAt,
      permissions: ROLE_PERMISSIONS[role],
      status: 'PENDING',
    },
    select: {
      id: true,
      invitedBy: true,
      workspaceId: true,
      email: true,
      role: true,
      status: true,
      expiredAt: true,
    },
  })

  setImmediate(async () => {
    let attempts = 0

    try {
      const inviter = await prisma.user.findUnique({
        where: { id: invitedBy },
        select: { fullName: true },
      })

      if (!inviter) {
        throw new Error('Inviter not found')
      }

      const inviteLink = buildInviteLink(token, inviteRecord.id)

      const html = generateInviteEmailTemplate({
        invitedByName: inviter.fullName,
        workspaceName: workspace.name,
        role,
        inviteLink,
        expiredAt: expiredAt.toISOString(),
      })

      await withRetry(
        async () => {
          attempts++

          await sendEmail({
            to: email,
            subject: `You're invited to join ${workspace.name} on TeamPoint!`,
            html,
          })
        },
        5,
        2000,
      )

      await prisma.invite_Member.update({
        where: { id: inviteRecord.id },
        data: {
          emailStatus: 'SENT',
          emailAttempts: { increment: attempts },
          lastEmailError: null,
        },
      })
    } catch (error) {
      await prisma.invite_Member.update({
        where: { id: inviteRecord.id },
        data: {
          emailStatus: 'FAILED',
          emailAttempts: { increment: attempts || 1 },
          lastEmailError: error instanceof Error ? error.message : String(error),
        },
      })
    }
  })

  return {
    ...inviteRecord,
    inviteLink: buildInviteLink(token, inviteRecord.id),
  }
}

export const getSingleInviteService = async (
  input: GetInviteInput,
): Promise<GetInviteDTO> => {
  const { workspaceId, inviteId } = input

  const invite = await prisma.invite_Member.findUnique({
    where: { id: inviteId },
    select: {
      id: true,
      workspaceId: true,
      email: true,
      role: true,
      status: true,
      invitedBy: true,
      createdAt: true,
      expiredAt: true,
    },
  })

  if (!invite || invite.workspaceId !== workspaceId) {
    throw new ApiError(404, 'Invite not found')
  }

  return {
    ...invite,
    inviteId: invite.id,
    createdBy: invite.invitedBy,
  }
}

export const listAllInvitesService = async (
  input: ListInvitesInput,
): Promise<ListInvitesDTO> => {
  const { workspaceId } = input
  const invites = await prisma.invite_Member.findMany({
    where: { workspaceId },
    select: {
      id: true,
      email: true,
      role: true,
      status: true,
      createdAt: true,
      expiredAt: true,
    },
  })

  return invites.map(i => ({
    inviteId: i.id,
    email: i.email,
    role: i.role,
    status: i.status,
    createdAt: i.createdAt,
    expiredAt: i.expiredAt,
  }))
}

export const revokeInviteService = async (
  input: RevokeInviteInput,
): Promise<RevokeInviteDTO> => {
  const { workspaceId, inviteId } = input
  const invite = await prisma.invite_Member.findUnique({
    where: { id: inviteId },
    select: { status: true, workspaceId: true },
  })

  if (!invite || invite.workspaceId !== workspaceId) {
    throw new ApiError(404, 'Invite not found')
  }

  if (invite.status !== 'PENDING') {
    throw new ApiError(400, 'Only pending invites can be revoked')
  }

  const now = new Date()

  const updated = await prisma.invite_Member.updateMany({
    where: {
      id: inviteId,
      workspaceId,
      status: 'PENDING',
    },
    data: { status: 'REVOKED', expiredAt: now },
  })

  if (updated.count === 0) {
    throw new ApiError(400, 'Invite not found or not pending')
  }

  return {
    inviteId,
    status: 'REVOKED',
    revokedAt: now,
  }
}

export const acceptInviteService = async (
  input: AcceptInviteInput,
): Promise<AcceptInviteDTO> => {
  const { tokenId, token, userId } = input

  const invite = await prisma.invite_Member.findUnique({
    where: {
      id: tokenId,
    },
  })

  if (!invite || invite.status !== 'PENDING') {
    throw new ApiError(400, 'Invite cannot be accepted')
  }

  const isTokenValid = await bcrypt.compare(token, invite.token)

  if (!isTokenValid) throw new ApiError(400, 'Invalid invite token')

  if (invite.expiredAt && invite.expiredAt < new Date()) {
    await prisma.invite_Member.update({
      where: { id: invite.id },
      data: { status: 'EXPIRED' },
    })
    throw new ApiError(400, 'Invite token expired')
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { email: true },
  })

  if (!user) {
    throw new ApiError(404, 'User not found')
  }

  if (user.email !== invite.email) {
    throw new ApiError(403, 'Email on invite does not match authenticated user')
  }

  const existingMember = await prisma.workspace_Members.findUnique({
    where: {
      workspaceId_userId: {
        workspaceId: invite.workspaceId,
        userId,
      },
    },
  })

  if (existingMember && existingMember.status === 'ACTIVE') {
    await prisma.invite_Member.update({
      where: { id: invite.id },
      data: { status: 'ACCEPTED', acceptedAt: new Date(), expiredAt: new Date() },
    })

    return {
      workspaceId: invite.workspaceId,
      userId,
      role: existingMember.role,
    }
  }

  await prisma.$transaction(async tx => {
    const exists = await tx.workspace_Members.findUnique({
      where: {
        workspaceId_userId: {
          workspaceId: invite.workspaceId,
          userId,
        },
      },
    })

    if (!exists) {
      await tx.workspace_Members.create({
        data: {
          workspaceId: invite.workspaceId,
          userId,
          role: invite.role,
          status: 'ACTIVE',
          joinedAt: new Date(),
          permissions: ROLE_PERMISSIONS[invite.role] ?? {},
        },
      })
    }

    await tx.invite_Member.update({
      where: { id: invite.id },
      data: {
        status: 'ACCEPTED',
        acceptedAt: new Date(),
        expiredAt: new Date(),
      },
    })
  })

  return {
    workspaceId: invite.workspaceId,
    userId,
    role: invite.role,
  }
}
