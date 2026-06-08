export enum CalendarEventType {
  MEETING = 'MEETING',
  MILESTONE = 'MILESTONE',
  TASK = 'TASK',
  GOOGLE = 'GOOGLE',
}

export enum CalendarEventSource {
  INTERNAL = 'INTERNAL',
  GOOGLE = 'GOOGLE',
}

// YYYY-MM-DD format only
export interface CalendarDateRange {
  from: string
  to: string
}

export interface CalendarQueryParams extends CalendarDateRange {
  types?: CalendarEventType[]
}

export interface CalendarEvent {
  id: string
  projectId: number | null

  type: CalendarEventType
  source: CalendarEventSource

  title: string
  description?: string | null

  startTime: string // ISO 8601 (UTC)
  endTime: string // ISO 8601 (UTC)

  isAllDay: boolean

  status: string & {}
}

export interface CalendarListResponse {
  data: CalendarEvent[]
}

export type CalendarEventDetail = CalendarEvent

export interface TaskCalendarSource {
  id: number
  projectId: number | null
  title: string
  description?: string | null
  dueDate: Date | null
  status: string
}

export interface MeetingCalendarSource {
  id: number
  projectId: number
  title: string
  description?: string | null
  startTime: Date
  endTime: Date
  status: string
}

export interface MilestoneCalendarSource {
  id: number
  projectId: number
  title: string
  description?: string | null
  dueDate: Date | null
  status: string
}

export interface GoogleCalendarSource {
  id: string
  title: string
  description?: string | null
  startTime: Date
  endTime: Date
  status?: string
}
