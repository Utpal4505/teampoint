import { eventBus } from '../../utils/eventBus.ts'
import { processBugAIReport, processBugReport } from './bug-report.processor.ts'

export const registerBugReportEvents = () => {
  eventBus.on('BUG_REPORT_CREATED', async (bugReportId: number, userId: number) => {
    await processBugReport(bugReportId, userId)
  })

  eventBus.on('BUG_AI_PROCESSED', async (bugReportId: number, userId: number) => {
    await processBugAIReport(bugReportId, userId)
  })
}
