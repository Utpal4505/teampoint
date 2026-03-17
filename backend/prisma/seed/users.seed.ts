import { prisma } from '../../src/config/db.config'
import { randomEmail, randomName } from './faker'

/**
 * Create 9 new team members
 * User 6 is the workspace owner (existing)
 */
export async function createUsers() {
  console.log('👥 Creating users...')

  const users = []

  for (let i = 0; i < 9; i++) {
    const user = await prisma.user.create({
      data: {
        fullName: randomName(),
        email: randomEmail(),
        is_new: false,
        status: 'ACTIVE',
      },
    })

    users.push(user)
    console.log(`   ✓ Created ${user.fullName}`)
  }

  console.log(`✅ Created ${users.length} users\n`)

  return users
}
