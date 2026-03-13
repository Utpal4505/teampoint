import { prisma } from '../../config/db.config.ts'
import type { CreateBugReport } from '../../types/bug-report.type.ts'
import { eventBus } from '../../utils/eventBus.ts'
import crypto from 'crypto'

function generateFingerprint({
  consoleLog,
  page,
  apiRoute,
  title,
}: {
  consoleLog: string[]
  page?: string | null
  apiRoute?: string | null
  title: string
}) {
  const cleanedLogs = consoleLog
    .map(log => log.replace(/\[\d{4}-\d{2}-\d{2}T[\d:.]+Z\]\s*/g, '').trim())
    .filter(Boolean)
    .sort()

  const combinedString = [
    title.toLowerCase().trim(),
    ...cleanedLogs,
    page ? new URL(page).pathname : '',
    apiRoute?.toLowerCase() ?? '',
  ].join('\n')

  return crypto.createHash('sha256').update(combinedString).digest('hex')
}

export const createBugReportService = async (
  data: CreateBugReport,
  userId: number | undefined,
) => {
  const consoleLogsArray: string[] = Array.isArray(data.consoleLog)
    ? data.consoleLog
    : data.consoleLog
      ? [data.consoleLog]
      : []

  const fingerprint = generateFingerprint({
    consoleLog: consoleLogsArray,
    page: data.page ?? null,
    apiRoute: data.apiRoute ?? null,
    title: data.title,
  })

  const existingBug = await prisma.bugReport.findFirst({
    where: {
      fingerprint,
    },
  })

  if (existingBug) {
    const updatedBug = await prisma.bugReport.update({
      where: {
        id: existingBug.id,
      },
      data: {
        reportCount: {
          increment: 1,
        },
        status: 'DUPLICATE',
      },
    })

    setImmediate(() => {
      eventBus.emit('BUG_REPORT_DUPLICATE', updatedBug.id, userId)
    })

    return updatedBug
  }

  const newBug = await prisma.bugReport.create({
    data: {
      reportedBy: userId ?? null,
      projectId: data.projectId ?? null,
      page: data.page ?? null,
      description: data.description ?? null,
      consoleLog: data.consoleLog ?? null,
      apiRoute: data.apiRoute ?? null,
      attachments: data.attachments ?? null,
      metadata: data.metadata ?? null,
      fingerprint: fingerprint,
      severityLevel: data.severityLevel ?? 'LOW',
      status: 'PENDING',
      processStartTime: new Date(),
      title: data.title,
      stepToReproduce: data.stepsToReproduce ?? null,
    },
  })

  setImmediate(() => {
    eventBus.emit('BUG_REPORT_CREATED', newBug.id, newBug.reportedBy)
  })

  return newBug
}
