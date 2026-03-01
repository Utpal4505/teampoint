import z from 'zod'


const idParam = z.coerce.number().int().positive()

export const MeetingStatusSchema = z.enum(['SCHEDULED', 'COMPLETED', 'CANCELLED'])
export const MeetingRoleSchema = z.enum(['HOST', 'PARTICIPANT'])
export const ActionItemStatusSchema = z.enum(['PENDING', 'CONVERTED'])


export const MeetingIdParamSchema = z.object({
  meetingId: idParam,
})


export const ParticipantInputSchema = z.object({
  userId: idParam,
  role: MeetingRoleSchema,
})

export const CreateMeetingSchema = z.object({
  title: z.string().trim().min(1).max(255),
  description: z.string().trim().max(2000).optional(),
  startTime: z.coerce.date(),
  endTime: z.coerce.date(),
  participants: z
    .array(ParticipantInputSchema)
    .min(1, 'At least one participant required'),
}).refine(
  data => data.endTime > data.startTime,
  { message: 'End time must be after start time', path: ['endTime'] },
)

export const CreateMeetingResponseSchema = z.object({
  id: idParam,
  status: z.literal('SCHEDULED'),
  meetingLink: z.string().url(),
  createdAt: z.date(),
})


export const ListMeetingsQuerySchema = z.object({
  projectId: idParam,
  status: MeetingStatusSchema.optional(),
  from: z.coerce.date().optional(),
  to: z.coerce.date().optional(),
})

export const MeetingListItemSchema = z.object({
  id: idParam,
  title: z.string(),
  status: MeetingStatusSchema,
  startTime: z.date(),
  endTime: z.date(),
  meetingLink: z.string(),
  participantCount: z.number(),
})

export const ListMeetingsResponseSchema = z.object({
  data: z.array(MeetingListItemSchema),
})


export const GetMeetingResponseSchema = z.object({
  id: idParam,
  projectId: idParam,
  title: z.string(),
  description: z.string().nullable(),
  status: MeetingStatusSchema,
  startTime: z.date(),
  endTime: z.date(),
  meetingLink: z.string(),
  participantCount: z.number(),
  createdAt: z.date(),
})


export const UpdateMeetingSchema = z.object({
  meetingId: idParam,
  title: z.string().trim().min(1).max(255).optional(),
  description: z.string().trim().max(2000).nullable().optional(),
  startTime: z.coerce.date().optional(),
  endTime: z.coerce.date().optional(),
}).refine(
  data => {
    if (data.startTime && data.endTime) return data.endTime > data.startTime
    return true
  },
  { message: 'End time must be after start time', path: ['endTime'] },
)

export const UpdateMeetingResponseSchema = z.object({
  id: idParam,
  title: z.string(),
  startTime: z.date(),
  endTime: z.date(),
  updatedAt: z.date(),
})


export const GetParticipantsQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
})

export const ParticipantItemSchema = z.object({
  userId: idParam,
  name: z.string(),
  role: MeetingRoleSchema,
})

export const GetParticipantsResponseSchema = z.object({
  total: z.number(),
  page: z.number(),
  limit: z.number(),
  data: z.array(ParticipantItemSchema),
})

export const ManageParticipantsSchema = z.object({
  meetingId: idParam,
  add: z.array(ParticipantInputSchema).optional(),
  remove: z.array(idParam).optional(),
}).refine(
  data => (data.add?.length ?? 0) + (data.remove?.length ?? 0) > 0,
  { message: 'Provide at least one add or remove entry' },
)

export const ManageParticipantsResponseSchema = z.object({
  meetingId: idParam,
  added: z.number(),
  removed: z.number(),
})


export const ActionItemInputSchema = z.object({
  title: z.string().trim().min(1).max(255),
  assignedTo: idParam,
  dueDate: z.coerce.date().optional(),
})

export const CompleteMeetingSchema = z.object({
  meetingId: idParam,
  keyDecisions: z.string().trim().max(5000).optional(),
  actionItems: z.array(ActionItemInputSchema).optional(),
})

export const CompleteMeetingResponseSchema = z.object({
  id: idParam,
  status: z.literal('COMPLETED'),
  completedAt: z.date(),
  createdTasks: z.array(idParam),
})


export const CancelMeetingSchema = z.object({
  meetingId: idParam,
})

export const CancelMeetingResponseSchema = z.object({
  id: idParam,
  status: z.literal('CANCELLED'),
  cancelledAt: z.date(),
})