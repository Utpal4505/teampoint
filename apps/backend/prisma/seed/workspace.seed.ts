import { prisma } from '../../src/config/db.config'
import { randomDateBetween } from './faker'
import { getTimlinePhaseRange } from './timeline.engine'

/**
 * Seed workspace members with realistic roles and dates
 * User 6 is the OWNER
 * Others get ADMIN or MEMBER roles
 */
export async function seedWorkspaceMembers(
  workspaceId: number,
  users: Array<{ id: number; fullName: string }>,
) {
  console.log('🏢 Setting up workspace members...')

  const roles = [
    'ADMIN',
    'ADMIN',
    'MEMBER',
    'MEMBER',
    'MEMBER',
    'MEMBER',
    'MEMBER',
    'MEMBER',
    'MEMBER',
  ] as const

  const memberPhase = getTimlinePhaseRange(-85, -80)

  for (let i = 0; i < users.length; i++) {
    const joinedAt = randomDateBetween(memberPhase.start, memberPhase.end)

    const member = await prisma.workspace_Members.create({
      data: {
        workspaceId,
        userId: users[i].id,
        role: roles[i] as any,
        status: 'ACTIVE',
        permissions: {},
        joinedAt,
      },
    })

    console.log(`   ✓ ${users[i].fullName} added as ${roles[i]}`)
  }

  // Add workspace owner (user 6)
  const owner = await prisma.user.findUnique({ where: { id: 6 } })
  if (owner) {
    await prisma.workspace_Members.upsert({
      where: {
        workspaceId_userId: {
          workspaceId,
          userId: 6,
        },
      },
      create: {
        workspaceId,
        userId: 6,
        role: 'OWNER',
        status: 'ACTIVE',
        permissions: {},
        joinedAt: new Date(new Date().getTime() - 90 * 24 * 60 * 60 * 1000),
      },
      update: {},
    })

    console.log(`   ✓ User 6 confirmed as OWNER`)
  }

  console.log('✅ Workspace members configured\n')
}
