import api from '@/lib/api'
import type {
  BugAttachment,
  BugReportPayload,
  BugReportResponse,
  FeedbackPayload,
  FeedbackResponse,
} from './types'

// ─── Bug Report ───────────────────────────────────────────────────────────────

export const submitBugReport = async (
  payload: BugReportPayload,
): Promise<BugReportResponse> => {
  const res = await api.post<{ data: BugReportResponse }>('/bug-reports', payload)
  return res.data.data
}

export const uploadBugAttachment = async (
  contextId: number,
  file: File,
): Promise<BugAttachment> => {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('category', 'BUG_ATTACHMENT')
  formData.append('contextId', String(contextId))
  formData.append('fileName', file.name)
  formData.append('contentType', file.type)

  const { data } = await api.post<{ data: BugAttachment }>('/uploads/direct', formData)
  return {
    ...data.data,
    fileName: file.name,
    contentType: file.type as BugAttachment['contentType'],
    size: file.size,
  }
}

// ─── Feedback ─────────────────────────────────────────────────────────────────

export const submitFeedback = async (
  payload: FeedbackPayload,
): Promise<FeedbackResponse> => {
  const res = await api.post<{ data: FeedbackResponse }>('/feedback', payload)

  return res.data.data
}
