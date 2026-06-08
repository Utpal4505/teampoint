export type MeetingStatus = 'SCHEDULED' | 'COMPLETED' | 'CANCELLED'
export type MeetingRole = 'HOST' | 'PARTICIPANT'
export type MeetingFilter = 'ALL' | MeetingStatus

export interface MeetingParticipant {
  userId: number
  name: string
  avatarUrl: string | null
  role: MeetingRole
}

export interface ActionItem {
  id: number
  title: string
  assignedToName: string
  dueDate: string | null
  taskId: number | null
}

export interface Meeting {
  id: number
  title: string
  description: string | null
  status: MeetingStatus
  startTime: string
  endTime: string
  meetingLink: string
  participantCount: number
  participants: MeetingParticipant[]
  keyDecisions: string | null
  actionItems: ActionItem[]
  createdAt: string
}
