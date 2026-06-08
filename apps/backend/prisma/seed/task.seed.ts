import { prisma } from '../../src/config/db.config'
import { randomPhrase, pickRandom, randomDateBetween } from './faker'
import { getTimlinePhaseRange } from './timeline.engine'

const statuses = [
  'TODO',
  'TODO',
  'TODO',
  'IN_PROGRESS',
  'IN_PROGRESS',
  'IN_PROGRESS',
  'DONE',
  'DONE',
  'DONE',
  'CANCELLED',
] as const

const priorities = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'] as const

/**
 * Create ~30 tasks per project
 * Timeline: Tasks appear 70 days ago and are completed around day -20
 */
export async function createTasks(projectId: number, userIds: number[]) {
  console.log(`   📋 Creating tasks for project ${projectId}...`)

  const taskPhase = getTimlinePhaseRange(-70, -45)

  for (let i = 0; i < 30; i++) {
    const creator = pickRandom(userIds)
    const assignee = pickRandom(userIds)
    const status = pickRandom(statuses)
    const priority = pickRandom(priorities)

    const createdAt = randomDateBetween(taskPhase.start, taskPhase.end)

    let completedAt: Date | undefined
    if (status === 'DONE') {
      // Completed tasks have a completedAt date 10-20 days ago
      completedAt = new Date(
        createdAt.getTime() +
          Math.random() * (20 * 24 * 60 * 60 * 1000 - 10 * 24 * 60 * 60 * 1000) +
          10 * 24 * 60 * 60 * 1000,
      )
    }

    await prisma.tasks.create({
      data: {
        projectId,
        title: randomPhrase(),
        description: randomPhrase(),
        taskType: 'PROJECT',
        priority,
        status: status as any,
        createdBy: creator,
        assignedTo: assignee,
        dueDate: randomDateBetween(taskPhase.start, new Date()),
        createdAt,
        completedAt,
      },
    })
  }

  console.log(`      ✓ Created 30 tasks`)
}

/**
 * Create tasks for all projects
 */
export async function createAllProjectTasks(
  projects: Array<{ id: number }>,
  userIds: number[],
) {
  console.log('📋 Creating tasks across projects...')

  for (const project of projects) {
    await createTasks(project.id, userIds)
  }

  console.log(`✅ Created ~${projects.length * 30} total tasks\n`)
}
