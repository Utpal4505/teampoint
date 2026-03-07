import { z } from "zod"

export const UserSchema = z.object({
  id: z.number(),
  fullName: z.string(),
  avatarUrl: z.string().nullable(),
  email: z.string().email(),
  status: z.enum(['ACTIVE', 'INACTIVE', 'BANNED']),
  is_new: z.boolean(),
  created_at: z.string().or(z.date()),
})

export type User = z.infer<typeof UserSchema>