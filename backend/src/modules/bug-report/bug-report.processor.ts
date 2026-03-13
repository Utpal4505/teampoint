import { prisma } from '../../config/db.config.ts'
import type { SeverityLevel } from '../../generated/prisma/enums.ts'
import { ensureExists } from '../../utils/ensureExists.ts'
import { eventBus } from '../../utils/eventBus.ts'
import { createGithubIssue } from '../../utils/github.ts'
import { enrichBugWithAI } from './ai/bugEnricher.service.ts'

export const processBugReport = async (bugReportId: number, userId: number) => {
  const bug = await prisma.bugReport.findUnique({
    where: {
      id: bugReportId,
    },
  })

  ensureExists(bug, 'BugReport')

  try {
    await prisma.bugReport.update({
      where: { id: bugReportId },
      data: { status: 'PROCESSING' },
    })

    const aiData = await enrichBugWithAI({
      title: bug.title,
      description: bug.description,
      page: bug.page,
      apiRoute: bug.apiRoute,
      consoleLog: bug.consoleLog as string | null,
      stepToReproduce: bug.stepToReproduce,
      metadata: bug.metadata as Record<string, unknown> | null,
    })

    await prisma.bugReport.update({
      where: { id: bugReportId },
      data: {
        severityLevel: aiData.severityLevel,
        severityScore: aiData.severityScore,
        aiSummary: aiData.aiSummary,
        aiTags: aiData.aiTags,
        status: 'AI_PROCESSED',
      },
    })

    eventBus.emit('BUG_AI_PROCESSED', bugReportId, userId)
  } catch (error) {
    console.error(`Failed to process bug report #${bugReportId}:`, error)

    await prisma.bugReport.update({
      where: { id: bugReportId },
      data: { status: 'FAILED', processEndTime: new Date() },
    })
  }
}

export const processBugAIReport = async (bugReportId: number, userId: number) => {
  const bug = await prisma.bugReport.findUnique({
    where: {
      id: bugReportId,
    },
  })

  ensureExists(bug, 'BugReport')

  try {
    const issue = await createGithubIssue(
      {
        title: bug.title,
        description: bug.description ?? undefined,
        page: bug.page ?? undefined,
        apiRoute: bug.apiRoute ?? undefined,
        consoleLog: bug.consoleLog ?? undefined,
        severityLevel: bug.severityLevel as SeverityLevel,
        metadata: bug.metadata ?? undefined,
        reportedBy: userId,
        stepsToReproduce: bug.stepToReproduce ?? undefined,
      },
      bug.reportCount,
      bug.fingerprint,
      {
        severityLevel: bug.severityLevel as SeverityLevel,
        severityScore: bug.severityScore ?? 0,
        aiSummary: bug.aiSummary ?? '',
        aiTags: (bug.aiTags as string[]) ?? [],
      },
    )

    await prisma.bugReport.update({
      where: { id: bugReportId },
      data: {
        status: 'GITHUB_CREATED',
        githubIssueUrl: issue.html_url,
        processEndTime: new Date(),
      },
    })
  } catch (error) {
    console.error(`Bug AI enrichment failed #${bugReportId}:`, error)

    await prisma.bugReport.update({
      where: { id: bugReportId },
      data: { status: 'FAILED', processEndTime: new Date() },
    })
  }
}
