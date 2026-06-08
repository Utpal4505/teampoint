import { useMutation } from '@tanstack/react-query'
import type { BugFormData } from './types'
import type { FeedbackFormData } from '@/components/feedback/feedbackForm'
import { collectMetadata } from '@/lib/feedback-metadata'
import { clearConsoleErrors, getConsoleErrors } from '@/lib/feedback-consoleError'
import { submitBugReport, submitFeedback, uploadBugAttachment } from './api'
import { toast } from 'sonner'
import { handleApiError } from '@/lib/handle-api-error'
import { useUserStore } from '@/store/user.store'
import axios from 'axios'

interface UseBugReportOptions {
  projectId?: number
  onSuccess?: (githubIssueUrl?: string) => void
}

export const useBugReport = ({ projectId, onSuccess }: UseBugReportOptions = {}) => {
  return useMutation({
    mutationFn: async (formData: BugFormData) => {
      const meta = collectMetadata()
      const capturedErrors = getConsoleErrors()
      const attachments = formData.attachments?.length
        ? await Promise.all(
            formData.attachments.map(file => {
              const contextId = projectId ?? useUserStore.getState().user?.id

              if (!contextId) {
                throw new Error('Please login before uploading bug images')
              }

              return uploadBugAttachment(contextId, file)
            }),
          )
        : undefined

      return submitBugReport({
        projectId,
        page: meta.url,
        title: formData.title,
        description: formData.description,
        severityLevel: formData.severityLevel,
        stepsToReproduce: formData.stepsToReproduce,
        attachments,
        metadata: meta,
        consoleLog:
          capturedErrors.length > 0
            ? capturedErrors
                .map(
                  e =>
                    `[${e.timestamp}] ${e.message}${e.source ? ` at ${e.source}` : ''}${e.line ? `:${e.line}` : ''}`,
                )
                .join('\n')
            : undefined,
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
    onError: error => {
      if (error instanceof Error && !axios.isAxiosError(error)) {
        toast.error(error.message)
        return
      }

      handleApiError(error)
    },
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
        type: formData.type,
        rating: formData.rating,
        message: formData.message,
        problem: formData.problem,
        solution: formData.solution,
        page: formData.page,
        confusion: formData.confusion,
        slowArea: formData.slowArea,
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
