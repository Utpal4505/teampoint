import api from '@/lib/api'
import type {
  BugReportPayload,
  BugReportResponse,
  FeedbackPayload,
  FeedbackResponse,
} from './types'

// ─── Bug Report ───────────────────────────────────────────────────────────────

export const submitBugReport = async (
  payload: BugReportPayload,
): Promise<BugReportResponse> => {
  const { attachments: _a, ...jsonPayload } = payload

  const res = await api.post<{ data: BugReportResponse }>('/bug-reports', jsonPayload)

  return res.data.data
}

// ─── Feedback ─────────────────────────────────────────────────────────────────

export const submitFeedback = async (
  payload: FeedbackPayload,
): Promise<FeedbackResponse> => {
  const res = await api.post<{ data: FeedbackResponse }>('/feedback', payload)

  return res.data.data
}
