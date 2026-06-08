import { prisma } from '../../config/db.config.js'
import { sendDiscordAlert } from '../../services/discord.service.js'
import { eventBus } from '../../utils/eventBus.js'
import { extractPath } from './ai/prompts.js'
import { processBugAIReport, processBugReport } from './bug-report.processor.js'

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
