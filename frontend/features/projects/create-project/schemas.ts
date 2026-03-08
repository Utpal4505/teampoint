import { z } from 'zod'

const sanitizeText = (v: string) => v.replace(/<[^>]*>/g, '').trim()

export const createProjectSchema = z.object({
  workspaceId: z.number().int().positive(),
  name: z
    .string()
    .trim()
    .min(2, 'Project name must be at least 2 characters')
    .max(150, 'Project name must be less than 150 characters')
    .transform(sanitizeText),
  description: z
    .string()
    .trim()
    .min(3, 'Description must be at least 3 characters')
    .max(500, 'Description must be less than 500 characters')
    .optional()
    .or(z.literal(''))
    .transform((v) => (!v ? null : sanitizeText(v.trim()))),
})

export const PROJECT_MEMBER_ROLES = ['OWNER', 'ADMIN', 'MEMBER'] as const
export type ProjectMemberRole = (typeof PROJECT_MEMBER_ROLES)[number]

export const addProjectMemberSchema = z.object({
  userId: z.number().int().positive(),
  role: z.enum(PROJECT_MEMBER_ROLES),
})

// ── Exported payload types ─────────────────────────────────────
export type ProjectStatus = 'ACTIVE' | 'ONHOLD'
export type ProjectRole   = ProjectMemberRole

export interface CreateProjectPayload {
  workspaceId: string
  name:        string
  description: string
  status:      ProjectStatus
}

export interface ProjectMemberPayload {
  userId: string
  role:   ProjectRole
}

export interface Step1Errors {
  name?:        string
  description?: string
}