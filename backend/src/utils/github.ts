import { Octokit } from '@octokit/rest'
import type { CreateBugReport } from '../types/bug-report.type.ts'
import { env } from '../config/env.ts'
import type { BugAIEnrichment } from '../types/ai.types.ts'

const severityEmoji: Record<string, string> = {
  LOW: '🟢',
  MEDIUM: '🟡',
  HIGH: '🟠',
  CRITICAL: '🔴',
}

const SEVERITY_LABELS: Record<string, { color: string; description: string }> = {
  low: { color: '0075ca', description: '🟢 Low severity bug' },
  medium: { color: 'e4e669', description: '🟡 Medium severity bug' },
  high: { color: 'ff8c00', description: '🟠 High severity bug' },
  critical: { color: 'd73a4a', description: '🔴 Critical severity bug' },
}

const TAG_LABELS: Record<string, { color: string; description: string }> = {
  ui: { color: 'bfd4f2', description: 'User interface issue' },
  api: { color: 'c5def5', description: 'API or backend issue' },
  auth: { color: 'f9d0c4', description: 'Authentication or authorization' },
  database: { color: 'fef2c0', description: 'Database related issue' },
  performance: { color: 'd4edda', description: 'Performance or speed issue' },
  crash: { color: 'e11d48', description: 'Application crash' },
  'data-loss': { color: 'b91c1c', description: 'Data loss or corruption' },
  security: { color: '7f1d1d', description: 'Security vulnerability' },
  payments: { color: '166534', description: 'Payment or billing issue' },
  'file-upload': { color: 'a8a29e', description: 'File upload issue' },
  notifications: { color: 'ddd6fe', description: 'Notification issue' },
  'third-party': { color: 'fed7aa', description: 'Third-party service issue' },
  mobile: { color: 'e0e7ff', description: 'Mobile specific issue' },
  regression: { color: 'fca5a5', description: 'Regression from previous version' },
}

const octokit = new Octokit({
  auth: env.GITHUB_PAT,
})

export const severityScoreBar = (score: number): string => {
  const filled = Math.round(score * 10)
  const empty = 10 - filled
  return '█'.repeat(filled) + '░'.repeat(empty) + ` ${(score * 100).toFixed(0)}%`
}

const ensureLabel = async (
  name: string,
  color: string,
  description: string,
): Promise<void> => {
  try {
    await octokit.issues.getLabel({
      owner: env.GITHUB_OWNER!,
      repo: env.GITHUB_REPO!,
      name,
    })
  } catch (err: unknown) {
    if (
      err instanceof Error &&
      'status' in err &&
      (err as { status: number }).status === 404
    ) {
      await octokit.issues.createLabel({
        owner: env.GITHUB_OWNER!,
        repo: env.GITHUB_REPO!,
        name,
        color,
        description,
      })
    }
  }
}

const ensureLabels = async (severity: string, aiTags: string[]): Promise<void> => {
  const tasks: Promise<void>[] = []

  tasks.push(ensureLabel('bug', 'ee0701', 'Something is broken'))

  const severityKey = severity.toLowerCase()
  if (SEVERITY_LABELS[severityKey]) {
    const { color, description } = SEVERITY_LABELS[severityKey]
    tasks.push(ensureLabel(severityKey, color, description))
  }

  for (const tag of aiTags) {
    if (TAG_LABELS[tag]) {
      const { color, description } = TAG_LABELS[tag]
      tasks.push(ensureLabel(tag, color, description))
    }
  }

  await Promise.allSettled(tasks)
}

export const formatGithubIssueBody = (
  bug: CreateBugReport & { reportedBy: number },
  reportCount: number,
  fingerprint: string,
  ai?: BugAIEnrichment | null,
) => {
  const severity = ai?.severityLevel ?? bug.severityLevel ?? 'LOW'
  const emoji = severityEmoji[severity] ?? '🟢'
  const aiOverrode = ai && ai.severityLevel !== (bug.severityLevel ?? 'LOW')

  return `
# 🐛 ${bug.title}

> ${ai?.aiSummary ?? bug.description ?? '_No description provided._'}

---

## 📊 Severity

${emoji} **${severity}** ${aiOverrode ? `*(AI reassessed from ${bug.severityLevel ?? 'LOW'} → ${ai.severityLevel})*` : ''}
${ai ? `\`${severityScoreBar(ai.severityScore)}\`` : ''}

---

${
  ai?.aiTags?.length
    ? `## 🏷️ AI Tags

${ai.aiTags.map(tag => `\`${tag}\``).join(' ')}

---`
    : ''
}

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
  bug.description && ai?.aiSummary
    ? `## 📝 Original Description

> ${bug.description}

---`
    : ''
}

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

<sub>🤖 Automatically reported via <strong>TeamPoint</strong> ${ai ? '· ✨ AI enriched' : ''}</sub>
`
}

export const createGithubIssue = async (
  bug: CreateBugReport & { reportedBy: number },
  reportCount: number,
  fingerprint: string,
  ai?: BugAIEnrichment | null,
) => {
  const severity = ai?.severityLevel ?? bug.severityLevel ?? 'LOW'
  const aiTags = ai?.aiTags ?? []

  await ensureLabels(severity, aiTags)

  const body = formatGithubIssueBody(bug, reportCount, fingerprint, ai)

  const response = await octokit.issues.create({
    owner: env.GITHUB_OWNER!,
    repo: env.GITHUB_REPO!,
    title: `🐛 [${severity}] ${bug.title}`,
    body,
    labels: ['bug', severity.toLowerCase(), ...aiTags],
  })

  return response.data
}
