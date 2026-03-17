import { prisma } from '../../src/config/db.config'
import { pickRandom, randomDateBetween } from './faker'
import { getTimlinePhaseRange } from './timeline.engine'

const entityTypes = [
  'TASK',
  'TASK',
  'TASK',
  'TASK',
  'PROJECT',
  'MEETING',
  'DOCUMENT',
] as const

const actions = ['CREATED', 'UPDATED', 'ASSIGNED', 'COMPLETED'] as const

const samplePhrases = [
  'Set up initial project structure',
  'Assigned high priority task',
  'Completed documentation',
  'Updated task status',
  'Meeting scheduled',
  'Document uploaded',
  'Task reassigned',
  'Project milestone reached',
  'Team aligned on goals',
  'Bug fixed and deployed',
  'Code review completed',
  'Design approved',
  'Requirements clarified',
  'Sprint planning done',
  'Backlog prioritized',
]

/**
 * Create 200 realistic activity log entries
 * Distributed across 90-day timeline
 */
export async function createActivityLogs(
  workspaceId: number,
  projectIds: number[],
  userIds: number[],
) {
  console.log('📊 Creating activity logs...')

  const activityPhase = getTimlinePhaseRange(-90, 0)

  for (let i = 0; i < 200; i++) {
    const createdAt = randomDateBetween(activityPhase.start, activityPhase.end)

    await prisma.activityLog.create({
      data: {
        workspaceId,
        projectId: pickRandom(projectIds),
        actorId: pickRandom(userIds),
        entityType: pickRandom(entityTypes) as any,
        entityId: Math.floor(Math.random() * 500) + 1,
        action: pickRandom(actions) as any,
        content: pickRandom(samplePhrases),
        createdAt,
      },
    })
  }

  console.log(`✅ Created 200 activity log entries\n`)
}
