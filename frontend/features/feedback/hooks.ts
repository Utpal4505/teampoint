import { useMutation } from '@tanstack/react-query'
import { BugFormData, FeedbackFormData } from './types'
import { collectMetadata } from '@/lib/feedback-metadata'
import { clearConsoleErrors, getConsoleErrors } from '@/lib/feedback-consoleError'
import { submitBugReport, submitFeedback } from './api'
import { toast } from 'sonner'
import { handleApiError } from '@/lib/handle-api-error'

interface UseBugReportOptions {
  projectId?: number
  onSuccess?: (githubIssueUrl?: string) => void
}

export const useBugReport = ({ projectId, onSuccess }: UseBugReportOptions = {}) => {
  return useMutation({
    mutationFn: async (formData: BugFormData) => {
      const meta = collectMetadata()
      const capturedErrors = getConsoleErrors()

      return submitBugReport({
        projectId,
        page: meta.url,
        title: formData.title,
        description: formData.description,
        severityLevel: formData.severityLevel,
        stepsToReproduce: formData.stepsToReproduce,
        attachments: formData.attachments,
        metadata: meta,
        consoleLog:
          capturedErrors.length > 0 ? JSON.stringify(capturedErrors) : undefined,
      })
    },
    onSuccess: res => {
      clearConsoleErrors()
      toast.success('Bug report submitted', {
        description: res.githubIssueUrl
          ? 'GitHub issue created automatically.'
          : "We've logged the issue and will look into it.",
      })
      onSuccess?.(res.githubIssueUrl)
    },
    onError: handleApiError,
  })
}

// ─── useFeedback ──────────────────────────────────────────────────────────────

interface UseFeedbackOptions {
  projectId?: number
  onSuccess?: () => void
}

export const useFeedback = ({ projectId, onSuccess }: UseFeedbackOptions = {}) => {
  return useMutation({
    mutationFn: (formData: FeedbackFormData) =>
      submitFeedback({
        projectId,
        rating: formData.rating,
        message: formData.message,
      }),
    onSuccess: () => {
      toast.success('Feedback received', {
        description: 'Thanks for taking the time. We read every response.',
      })
      onSuccess?.()
    },
    onError: handleApiError,
  })
}
