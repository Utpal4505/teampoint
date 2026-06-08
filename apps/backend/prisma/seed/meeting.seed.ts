import { prisma } from '../../src/config/db.config'
import {
  randomBuzzPhrase,
  randomUrl,
  pickRandom,
  pickMultiple,
  randomDateBetween,
} from './faker'
import { getTimlinePhaseRange } from './timeline.engine'

const meetingStatuses = ['SCHEDULED', 'COMPLETED', 'CANCELLED'] as const

/**
 * Create ~10 meetings per project
 * Timeline: Meetings start 60 days ago
 */
export async function createMeetings(projectId: number, userIds: number[]) {
  console.log(`   🎥 Creating meetings for project ${projectId}...`)

  const meetingPhase = getTimlinePhaseRange(-60, -15)

  for (let i = 0; i < 10; i++) {
    const startTime = randomDateBetween(meetingPhase.start, meetingPhase.end)
    const endTime = new Date(startTime.getTime() + 60 * 60 * 1000) // 1 hour meeting

    const meeting = await prisma.meeting.create({
      data: {
        projectId,
        createdBy: pickRandom(userIds),
        title: randomBuzzPhrase().slice(0, 255),
        description: randomBuzzPhrase(),
        startTime,
        endTime,
        meetingLink: randomUrl(),
        status: pickRandom(meetingStatuses) as any,
      },
    })

    // Add 3-5 participants
    const participants = pickMultiple(userIds, Math.floor(Math.random() * 3) + 3)

    for (const userId of participants) {
      await prisma.meetingParticipant.create({
        data: {
          meetingId: meeting.id,
          userId,
          role: 'PARTICIPANT',
        },
      })
    }
  }

  console.log(`      ✓ Created 10 meetings`)
}

/**
 * Create meetings for all projects
 */
export async function createAllProjectMeetings(
  projects: Array<{ id: number }>,
  userIds: number[],
) {
  console.log('🎥 Creating meetings across projects...')

  for (const project of projects) {
    await createMeetings(project.id, userIds)
  }

  console.log(`✅ Created ~${projects.length * 10} total meetings\n`)
}
