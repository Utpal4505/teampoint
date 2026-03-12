import { prisma } from '../../config/db.config.ts'
import type { SeverityLevel } from '../../generated/prisma/enums.ts'
import { ensureExists } from '../../utils/ensureExists.ts'
import { createGithubIssue } from '../../utils/github.ts'

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

    const issue = await createGithubIssue(
      {
        title: bug.title,
        description: bug.description ?? undefined,
        page: bug.page ?? undefined,
        apiRoute: bug.apiRoute ?? undefined,
        consoleLog: bug.consoleLog ?? undefined,
        severityLevel: (bug.severityLevel as SeverityLevel) ?? undefined,
        metadata: bug.metadata ?? undefined,
        reportedBy: userId,
        stepsToReproduce: bug.stepToReproduce ?? undefined,
      },
      bug.reportCount,
      bug.fingerprint,
    )

    await prisma.bugReport.update({
      where: { id: bugReportId },
      data: {
        status: 'GITHUB_CREATED',
        githubIssueUrl: issue.html_url,
      },
    })
  } catch (error) {
    console.error(`Failed to process bug report #${bugReportId}:`, error)

    await prisma.bugReport.update({
      where: { id: bugReportId },
      data: { status: 'FAILED' },
    })
  }
}
