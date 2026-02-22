import { z } from 'zod'
import { sanitizeText } from '../../utils/sanitize.ts'
import { Priority, TaskStatus, TaskType } from '../../generated/prisma/enums.ts'

export const TaskTypeEnum = z.enum(TaskType)
export const TaskStatusEnum = z.enum(TaskStatus)
export const TaskPriorityEnum = z.enum(Priority)

const idParam = z.number().int().positive().transform(Number)

export const createTaskSchema = z
  .object({
    taskType: TaskTypeEnum,
    projectId: idParam,
    title: z.string().trim().min(2).max(100).transform(sanitizeText),
    description: z
      .string()
      .trim()
      .min(5)
      .max(500)
      .optional()
      .or(z.literal(''))
      .transform(v => (v ? sanitizeText(v) : undefined)),
    assignedTo: idParam,
    priority: TaskPriorityEnum,
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

export const updateTaskSchema = z.object({
  title: z
    .string()
    .trim()
    .min(2)
    .max(100)
    .optional()
    .transform(v => (v ? sanitizeText(v) : undefined)),
  description: z
    .string()
    .trim()
    .min(5)
    .max(500)
    .optional()
    .transform(v => (v ? sanitizeText(v) : undefined)),
  priority: TaskPriorityEnum.optional(),
  assignedTo: idParam,
  dueDate: z.preprocess(
    arg => (arg ? new Date(arg as string) : undefined),
    z.date().optional(),
  ),
})

export const changeTaskStatusSchema = z.object({
  status: TaskStatusEnum.refine(
    status => ['TODO', 'IN_PROGRESS', 'DONE', 'CANCELLED'].includes(status),
    {
      message: 'Invalid status transition',
    },
  ),
})
