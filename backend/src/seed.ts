import { prisma } from './config/db.config.ts'
import { createUsers } from '../prisma/seed/users.seed'
import { seedWorkspaceMembers } from '../prisma/seed/workspace.seed'
import { createProjects } from '../prisma/seed/project.seed'
import { createAllProjectTasks } from '../prisma/seed/task.seed'
import { createAllProjectMeetings } from '../prisma/seed/meeting.seed'
import { createAllProjectDocuments } from '../prisma/seed/document.seed'
import { createActivityLogs } from '../prisma/seed/activity.seed'

declare const process: {
  exit: (code?: number) => never
  env: Record<string, string | undefined>
}

async function main() {
  console.log('\n╔════════════════════════════════════╗')
  console.log('║  🌱 TeamPoint Seeding Engine 🌱   ║')
  console.log('║  Simulating 90 days of activity    ║')
  console.log('╚════════════════════════════════════╝\n')

  try {
    const WORKSPACE_ID = 4
    const OWNER_ID = 6

    // Step 1: Create 9 new users (in addition to existing user 6)
    const users = await createUsers()

    // Create user ID array including the owner
    const userIds = users.map(u => u.id)
    userIds.push(OWNER_ID)

    // Step 2: Add members to workspace
    await seedWorkspaceMembers(WORKSPACE_ID, users)

    // Step 3: Create 7 projects
    const projects = await createProjects(WORKSPACE_ID, OWNER_ID)

    // Step 4: Populate each project with realistic data
    await createAllProjectTasks(projects, userIds)
    await createAllProjectMeetings(projects, userIds)
    await createAllProjectDocuments(projects, userIds)

    // Step 5: Create activity logs tying everything together
    await createActivityLogs(
      WORKSPACE_ID,
      projects.map(p => p.id),
      userIds,
    )

    // Summary
    console.log('╔════════════════════════════════════╗')
    console.log('║  ✅ Seeding Complete! Summary:     ║')
    console.log('╠════════════════════════════════════╣')
    console.log(`║ Users:              10 team members║`)
    console.log(`║ Projects:           7 active       ║`)
    console.log(`║ Tasks:              ~210 tasks     ║`)
    console.log(`║ Meetings:           ~70 meetings   ║`)
    console.log(`║ Documents:          ~49 docs       ║`)
    console.log(`║ Activity Log:       200 events     ║`)
    console.log('╚════════════════════════════════════╝\n')
  } catch (error) {
    console.error('\n❌ Seeding failed:', error)
    throw error
  }
}

main()
  .catch((e: Error) => {
    console.error(e)
    if (typeof process !== 'undefined') {
      process.exit(1)
    }
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
