import { Octokit } from '@octokit/rest'
import type { CreateBugReport } from '../types/bug-report.type.ts'
import { env } from '../config/env.ts'

const severityEmoji: Record<string, string> = {
  LOW: '🟢',
  MEDIUM: '🟡',
  HIGH: '🟠',
  CRITICAL: '🔴',
}

export const formatGithubIssueBody = (
  bug: CreateBugReport & { reportedBy: number },
  reportCount: number,
  fingerprint: string,
) => {
  const severity = bug.severityLevel ?? 'LOW'
  const emoji = severityEmoji[severity] ?? '🟢'

  return `
# 🐛 ${bug.title}

> ${bug.description ?? '_No description provided._'}

---

## 📊 Severity

${emoji} **${severity}**

---

## 📋 Report Details

| Field               | Value                           |
|---------------------|---------------------------------|
| 📄 **Page**         | \`${bug.page ?? 'N/A'}\`        |
| 🔗 **API Route**    | \`${bug.apiRoute ?? 'N/A'}\`    |
| 👤 **Reported By**  | User \`#${bug.reportedBy}\`     |
| 🔁 **Report Count** | \`${reportCount}\`              |
| 🕐 **Reported At**  | \`${new Date().toUTCString()}\` |

---

${
  bug.stepsToReproduce
    ? `## 🪜 Steps to Reproduce

${bug.stepsToReproduce}

---`
    : ''
}

${
  bug.consoleLog
    ? `## 🖥️ Console Log

\`\`\`log
${bug.consoleLog}
\`\`\`

---`
    : ''
}

${
  bug.metadata
    ? `## 🧩 Metadata

\`\`\`json
${JSON.stringify(bug.metadata, null, 2)}
\`\`\`

---`
    : ''
}

## 🔍 Fingerprint

\`\`\`
${fingerprint}
\`\`\`

---

## ✅ Checklist

- [ ] Bug reproduced
- [ ] Root cause identified  
- [ ] Fix implemented
- [ ] Fix tested
- [ ] Closed

---

<sub>🤖 Automatically reported via <strong>TeamPoint</strong></sub>
`
}

const octokit = new Octokit({
  auth: env.GITHUB_PAT,
})

export const createGithubIssue = async (
  bug: CreateBugReport & { reportedBy: number },
  reportCount: number,
  fingerprint: string,
) => {
  const body = formatGithubIssueBody(bug, reportCount, fingerprint)
  const severity = bug.severityLevel ?? 'LOW'

  const response = await octokit.issues.create({
    owner: env.GITHUB_OWNER!,
    repo: env.GITHUB_REPO!,
    title: `🐛 [${severity}] ${bug.title}`,
    body,
    labels: ['bug', severity.toLowerCase()],
  })

  return response.data
}
