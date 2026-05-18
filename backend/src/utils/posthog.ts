import { PostHog } from 'posthog-node'
import { env } from '../config/env.js'

export const posthog = new PostHog(env.POSTHOG_PROJECT_TOKEN, {
  host: 'https://us.i.posthog.com',
})

type EventName =
  | 'user_signed_up'
  | 'user_logged_in'
  | 'workspace_created'
  | 'workspace_member_invited'
  | 'workspace_joined'
  | 'project_created'
  | 'project_archived'
  | 'task_created'
  | 'task_assigned'
  | 'task_completed'
  | 'task_cancelled'
  | 'discussion_created'
  | 'message_sent'
  | 'document_uploaded'
  | 'bug_reported'
  | 'feedback_submitted'

export function trackPosthogEvent(
  userId: string | number,
  event: EventName,
  properties?: Record<string, unknown>,
) {
  posthog.capture({
    distinctId: String(userId),
    event,
    ...(properties ? { properties } : {}),
  })
}
