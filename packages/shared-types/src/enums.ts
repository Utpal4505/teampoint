// Workspace
export type WorkspaceRole = 'OWNER' | 'ADMIN' | 'MEMBER'
export type WorkspaceStatus = 'ACTIVE' | 'ARCHIVED' | 'DELETED'
export type WorkspaceMemberStatus = 'ACTIVE' | 'INVITED' | 'REMOVED' | 'LEFT' | 'BLOCKED'

// Project
export type ProjectStatus = 'ACTIVE' | 'ARCHIVED' | 'ONHOLD' | 'COMPLETED' | 'DELETED'

// Task
export type TaskType = 'PERSONAL' | 'PROJECT'
export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE' | 'CANCELLED'
export type Priority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'

// Meeting
export type MeetingStatus = 'SCHEDULED' | 'COMPLETED' | 'CANCELLED'
export type MeetingRole = 'HOST' | 'PARTICIPANT'

// Discussion
export type DiscussionStatus = 'OPEN' | 'CLOSED'
export type DiscussionType = 'GENERAL' | 'TASK'
export type MessageType = 'NORMAL' | 'DECISION'

// Invite
export type InviteStatus = 'PENDING' | 'ACCEPTED' | 'DECLINED' | 'EXPIRED' | 'REVOKED'

// Goal
export type GoalStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'ACHIEVED' | 'MISSED'

// Document
export type DocumentEntityType = 'TASK' | 'DISCUSSION' | 'MILESTONE' | 'MEETING'
export type DocumentLinkStatus = 'LINKED' | 'UNLINKED'

// Upload
export type UploadCategory = 'AVATAR' | 'DOCUMENT' | 'BUG_ATTACHMENT'
export type UploadStatus = 'PENDING' | 'UPLOADED' | 'FAILED' | 'ABORTED'
export type ContextType = 'USER' | 'PROJECT'
export type StorageProvider = 'R2'

// Activity
export type ActivityEntityType = 'WORKSPACE' | 'WORKSPACE_MEMBER' | 'PROJECT' | 'PROJECT_MEMBER' | 'TASK' | 'MEETING' | 'DISCUSSION' | 'GOAL' | 'MILESTONE' | 'DOCUMENT' | 'COMMENT'
export type ActivityAction = 'CREATED' | 'UPDATED' | 'REMOVED' | 'DELETED' | 'COMPLETED' | 'COMMENTED' | 'ASSIGNED' | 'CANCELLED'

// Auth
export type OAuthProvider = 'GOOGLE' | 'GITHUB'
export type UserStatus = 'ACTIVE' | 'INACTIVE' | 'BANNED'

// Bug Report
export type BugReportStatus = 'PENDING' | 'PROCESSING' | 'DUPLICATE' | 'AI_PROCESSED' | 'GITHUB_CREATED' | 'FAILED' | 'RESOLVED' | 'ARCHIVED'
export type SeverityLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'

// Feedback
export type FeedbackType = 'GENERAL' | 'UI_UX' | 'PERFORMANCE' | 'FEATURE_REQUEST'
export type FeedbackStatus = 'NEW' | 'REVIEWED' | 'IN_PROGRESS' | 'RESOLVED' | 'ARCHIVED'

// Leave Request
export type LeaveRequestStatus = 'PENDING' | 'ACCEPTED' | 'DECLINED' | 'CANCELLED'

// Integration
export type IntegrationProvider = 'GOOGLE' | 'GITHUB'
export type IntegrationStatus = 'CONNECTED' | 'DISCONNECTED' | 'EXPIRED' | 'ERROR'

// Action Item
export type ActionItemStatus = 'PENDING' | 'CONVERTED'
