import { eventBus } from '../../utils/eventBus.ts'
import { processBugReport } from './bug-report.processor.ts'

export const registerBugReportEvents = () => {
  eventBus.on('BUG_REPORT_CREATED', async (bugReportId: number, userId: number) => {
    await processBugReport(bugReportId, userId)
  })
}
