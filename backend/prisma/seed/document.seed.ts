import { prisma } from '../../src/config/db.config'
import {
  randomBuzzPhrase,
  randomSentence,
  pickRandom,
  randomDateBetween,
  randomInt,
} from './faker'
import { getTimlinePhaseRange } from './timeline.engine'

/**
 * Create ~7 documents per project
 * Each document needs an Upload record
 * Timeline: Documents uploaded 50 days ago
 */
export async function createDocuments(projectId: number, userIds: number[]) {
  console.log(`   📄 Creating documents for project ${projectId}...`)

  const docPhase = getTimlinePhaseRange(-50, -20)

  for (let i = 0; i < 7; i++) {
    const uploadedAt = randomDateBetween(docPhase.start, docPhase.end)
    const fileName = `${randomBuzzPhrase().replace(/\s+/g, '_').slice(0, 30)}_${i}.pdf`
    const fileKey = `documents/${projectId}/${Date.now()}_${i}`

    // Create Upload record first
    const upload = await prisma.upload.create({
      data: {
        fileKey,
        fileName,
        category: 'DOCUMENT',
        contextId: projectId,
        contextType: 'PROJECT',
        contentType: 'application/pdf',
        size: randomInt(100000, 5000000),
        storage: 'R2',
        status: 'UPLOADED',
        uploadedBy: pickRandom(userIds),
        createdAt: uploadedAt,
      },
    })

    // Create Document record
    await prisma.document.create({
      data: {
        projectId,
        uploadedBy: pickRandom(userIds),
        title: randomBuzzPhrase().slice(0, 100),
        description: randomSentence(),
        uploadId: upload.id,
        isArchived: false,
        createdAt: uploadedAt,
      },
    })
  }

  console.log(`      ✓ Created 7 documents`)
}

/**
 * Create documents for all projects
 */
export async function createAllProjectDocuments(
  projects: Array<{ id: number }>,
  userIds: number[],
) {
  console.log('📄 Creating documents across projects...')

  for (const project of projects) {
    await createDocuments(project.id, userIds)
  }

  console.log(`✅ Created ~${projects.length * 7} total documents\n`)
}
