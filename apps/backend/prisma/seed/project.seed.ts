import { prisma } from '../../src/config/db.config'
import { pickRandom, randomCompanyPhrase } from './faker'
import { daysAgo } from './timeline.engine'

const projectNames = [
  'TeamPoint Platform',
  'Mobile App',
  'Marketing Website',
  'AI Bug Analyzer',
  'Internal Tools',
  'Growth Experiments',
  'Developer Docs',
]

const projectStatuses = ['ACTIVE', 'ARCHIVED', 'COMPLETED', 'ONHOLD'] as const

/**
 * Create 7 projects in the workspace
 * All created 80 days ago
 */
export async function createProjects(workspaceId: number, creatorId: number) {
  console.log('📁 Creating projects...')

  const projects = []
  const createdAt = daysAgo(-80)

  for (const name of projectNames) {
    const project = await prisma.project.create({
      data: {
        workspaceId,
        name,
        description: randomCompanyPhrase(),
        status: pickRandom(projectStatuses) as any,
        createdBy: creatorId,
        createdAt,
      },
    })

    projects.push(project)
    console.log(`   ✓ Created: ${name}`)
  }

  console.log(`✅ Created ${projects.length} projects\n`)

  return projects
}
