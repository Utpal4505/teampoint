import { prisma } from '../../config/db.config.ts'
import type { CreateBugReport } from '../../types/bug-report.type.ts'
import { eventBus } from '../../utils/eventBus.ts'
import crypto from 'crypto'

function generateFingerprint({
  consoleLog,
  page,
  apiRoute,
}: {
  consoleLog: string[]
  page?: string | null
  apiRoute?: string | null
}) {
  const combinedString = [...(consoleLog || []), page || '', apiRoute || ''].join('\n')

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

  const fingerprint = await generateFingerprint({
    consoleLog: consoleLogsArray,
    page: data.page ?? null,
    apiRoute: data.apiRoute ?? null,
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
