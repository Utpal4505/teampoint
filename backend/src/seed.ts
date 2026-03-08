import { faker } from '@faker-js/faker'
import { TaskStatus, TaskType, Priority } from './generated/prisma/client.ts'
import { prisma } from './config/db.config.ts'

declare const process: {
  exit: (code?: number) => never
  env: Record<string, string | undefined>
}

async function main() {
  console.log('🌱 Seeding fake tasks...')

  // // 1. Ek existing user dhoondhein ya naya banayein
  // const user = await prisma.user.upsert({
  //   where: { email: 'testuser@example.com' },
  //   update: {},
  //   create: {
  //     fullName: 'Test User',
  //     email: 'testuser@example.com',
  //     is_new: false,
  //     status: 'ACTIVE',
  //   },
  // })

  // 2. Ek workspace banayein
  const workspace = await prisma.workspace.create({
    data: {
      name: 'Development Workspace',
      createdBy: 6,
      description: 'A place for fake data testing',
    },
  })

  // 3. 2-3 Projects banayein
  const projectNames = ['Frontend Refactor', 'Mobile App API', 'Marketing Website']

  for (const name of projectNames) {
    const project = await prisma.project.create({
      data: {
        name,
        workspaceId: workspace.id,
        createdBy: 6,
        description: faker.lorem.sentence(),
        status: 'ACTIVE',
      },
    })

    // 4. Har project mein 10-15 tasks generate karein
    const taskCount = faker.number.int({ min: 10, max: 15 })

    const tasksData = Array.from({ length: taskCount }).map(() => ({
      title: faker.hacker.phrase().slice(0, 100),
      description: faker.lorem.paragraph(),
      taskType: 'PROJECT' as TaskType,
      status: faker.helpers.arrayElement(['TODO', 'IN_PROGRESS', 'DONE']) as TaskStatus,
      priority: faker.helpers.arrayElement([
        'LOW',
        'MEDIUM',
        'HIGH',
        'URGENT',
      ]) as Priority,
      dueDate: faker.date.future(),
      projectId: project.id,
      createdBy: 6,
      assignedTo: 6, // Aapko assign kiya gaya hai
    }))

    await prisma.tasks.createMany({
      data: tasksData,
    })
  }

  console.log('✅ Seed successful! Generated projects and tasks.')
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
