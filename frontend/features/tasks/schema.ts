import z from 'zod'

export const createTaskSchema = z
  .object({
    taskType: z.enum(['PROJECT', 'PERSONAL']),
    projectId: z.number().int().positive().optional(),
    title: z.string().trim().min(2).max(100),
    description: z.string().trim().min(5).max(500).optional().or(z.literal('')),
    assignedTo: z.number().int().positive(),
    priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']),
    dueDate: z.preprocess(
      arg => (arg ? new Date(arg as string) : undefined),
      z.date().optional(),
    ),
  })
  .superRefine((data, ctx) => {
    if (data.taskType === 'PROJECT' && !data.projectId) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'projectId is required for PROJECT tasks',
      })
    }
    if (data.taskType === 'PERSONAL' && data.projectId) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'projectId must be null for PERSONAL tasks',
      })
    }
  })
