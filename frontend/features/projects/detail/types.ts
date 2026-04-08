import { WorkspaceRole } from '@/features/workspace/types'

export type ProjectStatus = 'ACTIVE' | 'ONHOLD' | 'COMPLETED' | 'DELETED' | 'INACTIVE'
export type ProjectRole = 'OWNER' | 'ADMIN' | 'MEMBER'
export type MemberStatus = 'ACTIVE' | 'INVITED' | 'REMOVED' | 'LEFT' | 'BLOCKED'

export interface ProjectMember {
  userId: number
  fullName: string
  role: ProjectRole
  joinedAt: string
  status: MemberStatus
  projectId?: number
}

export interface ProjectMemberDTO {
  projectId: number
  userId: number
  fullName: string
  email?: string
  avatarUrl?: string | null
  role: ProjectRole
  joinedAt: string
  status: MemberStatus
}

export interface ProjectDetail {
  id: number
  workspaceId: number
  name: string
  description: string | null
  status: ProjectStatus
  createdBy: number
  projectMembers: ProjectMember[]
  createdAt: string
}

export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE' | 'CANCELLED'
export type TaskPriority = 'URGENT' | 'HIGH' | 'MEDIUM' | 'LOW'
export type TaskType = 'PERSONAL' | 'PROJECT'

export interface ProjectTask {
  id: number
  title: string
  status: TaskStatus
  priority: TaskPriority
  dueDate: string | null
  assignedTo: {
    id: number
    name: string
    avatarUrl?: string
  } | null
  project: {
    id: number
    name: string
  } | null
}

export interface ProjectDocument {
  id: number
  title: string
  description: string | null
  fileKey: string
  fileType: string
  uploadedBy: number
  isArchived: boolean
  createdAt: string
  updatedAt: string
}

export interface ProjectStats {
  totalTasks: number
  todoTasks: number
  inProgressTasks: number
  doneTasks: number
  totalMembers: number
  totalDocuments: number
}

export interface UpdateProjectMemberRoleInput {
  projectId: number
  userId: number
  role: ProjectRole | null
  status: MemberStatus | null
}

export type MeetingStatus = 'SCHEDULED' | 'COMPLETED' | 'CANCELLED'
export type MeetingRole = 'HOST' | 'PARTICIPANT'

export interface MeetingParticipant {
  userId: number
  name: string
  avatarUrl: string | null
  role: MeetingRole
}

export interface MeetingListItem {
  id: number
  title: string
  status: MeetingStatus
  startTime: string
  endTime: string
  meetingLink: string
  participantCount: number
  participants: MeetingParticipant[]
}

export interface ProjectMeeting extends MeetingListItem {
  projectId: number
  description: string | null
  createdAt: string
}

export interface CreateMeetingInput {
  title: string
  description?: string
  startTime: string | Date
  endTime: string | Date
  participants: Array<{
    userId: number
    role: MeetingRole
  }>
}

export interface CompleteMeetingInput {
  meetingId: number
  keyDecisions?: string
  actionItems?: Array<{
    title: string
    assignedTo: number
    dueDate?: string
  }>
}
