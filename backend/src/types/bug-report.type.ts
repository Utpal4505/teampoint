import { z } from 'zod'
import type {
  BugReportStatusEnum,
  createBugReportSchema,
  SeverityLevelEnum,
  updateBugReportStatusSchema,
  updateBugReportSeveritySchema,
} from '../modules/bug-report/bug-report.schema.ts'

export type BugReportStatus = z.infer<typeof BugReportStatusEnum>
export type SeverityLevel = z.infer<typeof SeverityLevelEnum>
export type CreateBugReport = z.infer<typeof createBugReportSchema>
export type UpdateBugReportStatus = z.infer<typeof updateBugReportStatusSchema>
export type UpdateBugReportSeverity = z.infer<typeof updateBugReportSeveritySchema>
