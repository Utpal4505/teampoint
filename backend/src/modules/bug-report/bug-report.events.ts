import { prisma } from '../../config/db.config.ts'
import { sendDiscordAlert } from '../../services/discord.service.ts'
import { eventBus } from '../../utils/eventBus.ts'
import { extractPath } from './ai/prompts.ts'
import { processBugAIReport, processBugReport } from './bug-report.processor.ts'

export const registerBugReportEvents = () => {
  eventBus.on('BUG_REPORT_CREATED', async (bugReportId: number, userId: number) => {
    await processBugReport(bugReportId, userId)
  })

  eventBus.on('BUG_AI_PROCESSED', async (bugReportId: number, userId: number) => {
    await processBugAIReport(bugReportId, userId)
  })

  eventBus.on('BUG_REPORT_DUPLICATE', async (bugReportId: number) => {
    const bug = await prisma.bugReport.findUnique({ where: { id: bugReportId } })
    if (!bug) return

    await sendDiscordAlert({
      webhookKey: 'alerts',
      color: 'DUPLICATE',
      title: '🔁 Duplicate Bug Detected',
      description: `**${bug.title}**`,
      fields: [
        {
          name: '🔁 Report Count',
          value: `\`${bug.reportCount}\` reports`,
          inline: true,
        },
        { name: '📄 Page', value: extractPath(bug.page), inline: true },
        ...(bug.githubIssueUrl
          ? [
              {
                name: '🔗 GitHub',
                value: `[View Issue](${bug.githubIssueUrl})`,
                inline: false,
              },
            ]
          : []),
      ],
    })
  })
}
