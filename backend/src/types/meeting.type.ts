import type { z } from 'zod'
import type {
  MeetingStatusSchema,
  MeetingRoleSchema,
  ActionItemStatusSchema,
  ParticipantInputSchema,
  ActionItemInputSchema,
  CreateMeetingSchema,
  CreateMeetingResponseSchema,
  MeetingListItemSchema,
  ListMeetingsResponseSchema,
  ListMeetingsQuerySchema,
  GetMeetingResponseSchema,
  UpdateMeetingSchema,
  UpdateMeetingResponseSchema,
  GetParticipantsQuerySchema,
  ParticipantItemSchema,
  GetParticipantsResponseSchema,
  ManageParticipantsSchema,
  ManageParticipantsResponseSchema,
  CompleteMeetingSchema,
  CompleteMeetingResponseSchema,
  CancelMeetingSchema,
  CancelMeetingResponseSchema,
} from '../modules/meeting/meeting.schema.ts'


export type MeetingStatus = z.infer<typeof MeetingStatusSchema>
export type MeetingRole = z.infer<typeof MeetingRoleSchema>
export type ActionItemStatus = z.infer<typeof ActionItemStatusSchema>


export type ParticipantInput = z.infer<typeof ParticipantInputSchema>
export type ActionItemInput = z.infer<typeof ActionItemInputSchema>

export type CreateMeetingInput = z.infer<typeof CreateMeetingSchema>
export type ListMeetingsQuery = z.infer<typeof ListMeetingsQuerySchema>
export type UpdateMeetingInput = z.infer<typeof UpdateMeetingSchema>
export type ManageParticipantsInput = z.infer<typeof ManageParticipantsSchema>
export type CompleteMeetingInput = z.infer<typeof CompleteMeetingSchema>
export type CancelMeetingInput = z.infer<typeof CancelMeetingSchema>
export type GetParticipantsQuery = z.infer<typeof GetParticipantsQuerySchema>


export type CreateMeetingResponse = z.infer<typeof CreateMeetingResponseSchema>
export type MeetingListItem = z.infer<typeof MeetingListItemSchema>
export type ListMeetingsResponse = z.infer<typeof ListMeetingsResponseSchema>
export type GetMeetingResponse = z.infer<typeof GetMeetingResponseSchema>
export type UpdateMeetingResponse = z.infer<typeof UpdateMeetingResponseSchema>
export type ParticipantItem = z.infer<typeof ParticipantItemSchema>
export type GetParticipantsResponse = z.infer<typeof GetParticipantsResponseSchema>
export type ManageParticipantsResponse = z.infer<typeof ManageParticipantsResponseSchema>
export type CompleteMeetingResponse = z.infer<typeof CompleteMeetingResponseSchema>
export type CancelMeetingResponse = z.infer<typeof CancelMeetingResponseSchema>


export interface CreateGoogleEventInput {
  title: string
  description?: string
  startTime: Date
  endTime: Date
  attendeeEmails: string[]
}

export interface GoogleEventResult {
  meetingLink: string
  googleEventId: string
}

export interface UpdateGoogleEventInput {
  googleEventId: string
  title?: string
  startTime?: Date
  endTime?: Date
}

export interface CreateMeetingServiceInput extends CreateMeetingInput {
  projectId: number
}

export interface ListMeetingsServiceQuery extends ListMeetingsQuery {
  projectId: number
}