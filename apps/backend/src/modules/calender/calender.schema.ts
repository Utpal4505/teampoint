import { z } from 'zod'

export const CalendarEventTypeSchema = z.enum([
  'MEETING',
  'MILESTONE',
  'TASK',
  'GOOGLE',
])

export const CalendarEventSourceSchema = z.enum([
  'INTERNAL',
  'GOOGLE',
])

// YYYY-MM-DD format
export const DateOnlySchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format')

// ISO 8601 (basic validation)
export const ISODateTimeSchema = z
  .string()
  .datetime({ offset: true })

export const CalendarDateRangeSchema = z.object({
  from: DateOnlySchema,
  to: DateOnlySchema,
})

export const CalendarQueryParamsSchema = CalendarDateRangeSchema.extend({
  types: z.array(CalendarEventTypeSchema).optional(),
})

export const CalendarEventSchema = z.object({
  id: z.string(),

  projectId: z.number().nullable(),

  type: CalendarEventTypeSchema,
  source: CalendarEventSourceSchema,

  title: z.string().min(1).max(255),
  description: z.string().nullable().optional(),

  startTime: ISODateTimeSchema,
  endTime: ISODateTimeSchema,

  isAllDay: z.boolean(),

  status: z.string().min(1),
})

export const CalendarListResponseSchema = z.object({
  data: z.array(CalendarEventSchema),
})

export const CalendarEventDetailSchema = CalendarEventSchema

export const TaskCalendarSourceSchema = z.object({
  id: z.number(),
  projectId: z.number().nullable(),
  title: z.string(),
  description: z.string().nullable().optional(),
  dueDate: z.date().nullable(),
  status: z.string(),
})

export const MeetingCalendarSourceSchema = z.object({
  id: z.number(),
  projectId: z.number(),
  title: z.string(),
  description: z.string().nullable().optional(),
  startTime: z.date(),
  endTime: z.date(),
  status: z.string(),
})

export const MilestoneCalendarSourceSchema = z.object({
  id: z.number(),
  projectId: z.number(),
  title: z.string(),
  description: z.string().nullable().optional(),
  dueDate: z.date().nullable(),
  status: z.string(),
})

export const GoogleCalendarSourceSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().nullable().optional(),
  startTime: z.date(),
  endTime: z.date(),
  status: z.string().optional(),
})