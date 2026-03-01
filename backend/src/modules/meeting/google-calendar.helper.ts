import axios from 'axios'
import { getValidAccessTokenService } from '../integration/integration.service.ts'
import { ApiError } from '../../utils/apiError.ts'
import crypto from 'crypto'


interface CreateEventInput {
  title: string
  description?: string | undefined  
  startTime: Date
  endTime: Date
  attendeeEmails: string[]
}

interface UpdateEventInput {
  googleEventId: string
  title?: string | undefined
  description?: string | undefined
  startTime?: Date | undefined
  endTime?: Date | undefined
}

interface GoogleEventResult {
  meetingLink: string
  googleEventId: string
}


const CALENDAR_BASE = 'https://www.googleapis.com/calendar/v3/calendars/primary/events'

const getAuthHeader = async (userId: number) => {
  const { accessToken } = await getValidAccessTokenService(userId, 'GOOGLE')
  return { Authorization: `Bearer ${accessToken}` }
}


export const createGoogleMeetEvent = async (
  userId: number,
  input: CreateEventInput,
): Promise<GoogleEventResult> => {
  const headers = await getAuthHeader(userId)

  const body = {
    summary: input.title,
    description: input.description ?? '',
    start: {
      dateTime: input.startTime.toISOString(),
      timeZone: 'UTC',
    },
    end: {
      dateTime: input.endTime.toISOString(),
      timeZone: 'UTC',
    },
    attendees: input.attendeeEmails.map(email => ({ email })),
    conferenceData: {
      createRequest: {
        requestId: crypto.randomUUID(),
        conferenceSolutionKey: { type: 'hangoutsMeet' },
      },
    },
  }

  const res = await axios
    .post(`${CALENDAR_BASE}?conferenceDataVersion=1`, body, { headers })
    .catch(err => {
      const msg = err.response?.data?.error?.message ?? 'Failed to create Google Calendar event'
      throw new ApiError(502, msg)
    })

  const meetingLink = res.data.hangoutLink
  const googleEventId = res.data.id

  if (!meetingLink) {
    throw new ApiError(502, 'Google did not return a Meet link — check Calendar API scopes')
  }

  return { meetingLink, googleEventId }
}


export const updateGoogleMeetEvent = async (
  userId: number,
  input: UpdateEventInput,
): Promise<void> => {
  const headers = await getAuthHeader(userId)

  const body: Record<string, unknown> = {}

  if (input.title) body.summary = input.title
  if (input.description !== undefined) body.description = input.description
  if (input.startTime) body.start = { dateTime: input.startTime.toISOString(), timeZone: 'UTC' }
  if (input.endTime) body.end = { dateTime: input.endTime.toISOString(), timeZone: 'UTC' }

  await axios
    .patch(`${CALENDAR_BASE}/${input.googleEventId}`, body, { headers })
    .catch(err => {
      const msg = err.response?.data?.error?.message ?? 'Failed to update Google Calendar event'
      throw new ApiError(502, msg)
    })
}


export const cancelGoogleMeetEvent = async (
  userId: number,
  googleEventId: string,
): Promise<void> => {
  const headers = await getAuthHeader(userId)

  await axios
    .delete(`${CALENDAR_BASE}/${googleEventId}`, { headers })
    .catch(err => {
      const status = err.response?.status
      // 410 = already deleted — silent
      if (status === 410) return
      const msg = err.response?.data?.error?.message ?? 'Failed to cancel Google Calendar event'
      throw new ApiError(502, msg)
    })
}