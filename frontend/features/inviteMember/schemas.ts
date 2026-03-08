import { z } from 'zod'

export const WORKSPACE_ROLES = ['ADMIN', 'MEMBER', 'VIEWER'] as const
export type WorkspaceRole = (typeof WORKSPACE_ROLES)[number]

export const inviteMemberSchema = z.object({
  email: z.string().trim().email('Please enter a valid email address'),
  role: z.enum(WORKSPACE_ROLES),
})

export interface InviteEntry {
  id: string
  email: string
  role: WorkspaceRole
}

export interface InviteMembersPayload {
  invites: InviteEntry[]
}
