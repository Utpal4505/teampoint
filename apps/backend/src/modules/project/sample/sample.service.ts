import { prisma } from '../../../config/db.config.js'

type CreateSampleProjectInput = {
  userId: number
  workspaceId: number
}

export async function createSampleProject(input: CreateSampleProjectInput) {
  const { userId, workspaceId } = input

  return await prisma.$transaction(async tx => {
    const project = await tx.project.create({
      data: {
        name: '🚀 Your First Product: Launch in 7 Days',
        description:
          'This is a sample project to help you explore how teams collaborate in TeamPoint. Build and launch a simple product in 7 days, focusing only on what matters.',
        workspaceId,
        createdBy: userId,
      },
    })

    const [alex, riya] = await Promise.all([
      tx.user.create({
        data: {
          fullName: 'Alex Carter',
          email: `alex.carter.sample.${project.id}@example.com`,
          is_new: false,
          avatarUrl: 'https://i.pravatar.cc/150?img=11',
        },
      }),
      tx.user.create({
        data: {
          fullName: 'Riya Sharma',
          email: `riya.sharma.sample.${project.id}@example.com`,
          is_new: false,
          avatarUrl: 'https://i.pravatar.cc/150?img=47',
        },
      }),
    ])

    await Promise.all([
      tx.workspace_Members.create({
        data: {
          workspaceId,
          userId: alex.id,
          role: 'MEMBER',
          permissions: {},
          joinedAt: new Date(),
        },
      }),
      tx.workspace_Members.create({
        data: {
          workspaceId,
          userId: riya.id,
          role: 'MEMBER',
          permissions: {},
          joinedAt: new Date(),
        },
      }),
    ])

    await Promise.all([
      tx.project_Members.create({
        data: {
          projectId: project.id,
          userId,
          role: 'OWNER',
          permissions: {},
          joinedAt: new Date(),
        },
      }),
      tx.project_Members.create({
        data: {
          projectId: project.id,
          userId: alex.id,
          role: 'MEMBER',
          permissions: {},
          joinedAt: new Date(),
        },
      }),
      tx.project_Members.create({
        data: {
          projectId: project.id,
          userId: riya.id,
          role: 'MEMBER',
          permissions: {},
          joinedAt: new Date(),
        },
      }),
    ])

    const tasks = await Promise.all([
      tx.tasks.create({
        data: {
          title: '💡 Define the idea',
          description:
            'A simple tool to help small teams manage tasks and discussions in one place.',
          status: 'DONE',
          projectId: project.id,
          createdBy: userId,
          assignedTo: userId,
          priority: 'HIGH',
          taskType: 'PROJECT',
          dueDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        },
      }),
      tx.tasks.create({
        data: {
          title: '🎨 Design the UI',
          description: 'Creating basic wireframes, focusing on simplicity.',
          status: 'IN_PROGRESS',
          projectId: project.id,
          createdBy: userId,
          assignedTo: alex.id,
          priority: 'URGENT',
          taskType: 'PROJECT',
          dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
        },
      }),
      tx.tasks.create({
        data: {
          title: '⚙️ Build core features',
          description: 'Tasks, discussions, and basic project structure.',
          status: 'TODO',
          projectId: project.id,
          createdBy: userId,
          assignedTo: riya.id,
          priority: 'MEDIUM',
          taskType: 'PROJECT',
          dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        },
      }),
      tx.tasks.create({
        data: {
          title: '🧪 Test with users',
          description: 'Share with 2–3 people and collect feedback.',
          status: 'TODO',
          projectId: project.id,
          createdBy: userId,
          assignedTo: userId,
          priority: 'LOW',
          taskType: 'PROJECT',
          dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        },
      }),
      tx.tasks.create({
        data: {
          title: '🚀 Launch v1',
          description: 'Ship a simple version, avoid overbuilding.',
          status: 'TODO',
          projectId: project.id,
          createdBy: userId,
          assignedTo: riya.id,
          priority: 'HIGH',
          taskType: 'PROJECT',
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
      }),
    ])

    const designTask = tasks[1]
    const buildTask = tasks[2]

    const designDiscussion = await tx.discussion.create({
      data: {
        title: '🎨 Feedback on UI wireframes',
        projectId: project.id,
        createdBy: userId,
        type: 'TASK',
        contextId: designTask.id,
      },
    })

    await tx.message.create({
      data: {
        discussionId: designDiscussion.id,
        createdBy: riya.id,
        content:
          'I went through the wireframes — the dashboard layout feels a bit cluttered. Can we simplify the sidebar?',
      },
    })

    const designMsg2 = await tx.message.create({
      data: {
        discussionId: designDiscussion.id,
        createdBy: alex.id,
        content: 'Agreed. Maybe collapse the nav by default and expand on hover?',
      },
    })

    await tx.message.create({
      data: {
        discussionId: designDiscussion.id,
        createdBy: userId,
        content:
          "Good call. Let's go minimal — one level deep only, no nested menus for v1.",
        parentMessageId: designMsg2.id,
      },
    })

    await tx.message.create({
      data: {
        discussionId: designDiscussion.id,
        createdBy: riya.id,
        content: 'Also, are we doing dark mode from day one?',
      },
    })

    await tx.message.create({
      data: {
        discussionId: designDiscussion.id,
        createdBy: userId,
        content:
          'Not for v1. Ship light mode first, dark mode can be a quick win post-launch.',
      },
    })

    const buildDiscussion = await tx.discussion.create({
      data: {
        title: '⚙️ Which core features make the cut for v1?',
        projectId: project.id,
        createdBy: userId,
        type: 'TASK',
        contextId: buildTask.id,
      },
    })

    const buildMsg1 = await tx.message.create({
      data: {
        discussionId: buildDiscussion.id,
        createdBy: alex.id,
        content:
          'I think tasks + discussions are the non-negotiables. Everything else is nice-to-have.',
      },
    })

    await tx.message.create({
      data: {
        discussionId: buildDiscussion.id,
        createdBy: userId,
        content: '100%. We cut milestones and goals for now — add them in v1.1.',
        parentMessageId: buildMsg1.id,
      },
    })

    await tx.message.create({
      data: {
        discussionId: buildDiscussion.id,
        createdBy: riya.id,
        content:
          'What about file uploads? Users will definitely want to attach things to tasks.',
      },
    })

    await tx.message.create({
      data: {
        discussionId: buildDiscussion.id,
        createdBy: alex.id,
        content:
          "Maybe just links for now? Full upload support adds infra complexity we don't need yet.",
      },
    })

    await tx.message.create({
      data: {
        discussionId: buildDiscussion.id,
        createdBy: userId,
        content:
          "Agreed — links only for v1. We'll revisit uploads once we have real user feedback.",
      },
    })

    const discussion = await tx.discussion.create({
      data: {
        title: '💬 What should we focus on for v1?',
        projectId: project.id,
        createdBy: userId,
        type: 'GENERAL',
      },
    })

    const msg1 = await tx.message.create({
      data: {
        discussionId: discussion.id,
        createdBy: alex.id,
        content: 'Should we keep auth simple for v1?',
      },
    })

    await tx.message.create({
      data: {
        discussionId: discussion.id,
        createdBy: userId,
        content: 'Yeah, email + password is enough for now.',
        parentMessageId: msg1.id,
      },
    })

    const msg3 = await tx.message.create({
      data: {
        discussionId: discussion.id,
        createdBy: riya.id,
        content: "Let's focus on core features first, we can improve later.",
      },
    })

    await tx.message.create({
      data: {
        discussionId: discussion.id,
        createdBy: userId,
        content: "Agreed. We shouldn't overbuild before testing.",
        parentMessageId: msg3.id,
        type: 'DECISION',
      },
    })

    await tx.message.create({
      data: {
        discussionId: discussion.id,
        createdBy: alex.id,
        content: 'Not sure about notifications yet, maybe skip for now?',
      },
    })

    const fileKey = `Sample/${project.id}/Project-brief.pdf`


    const upload = await tx.upload.create({
      data: {
        fileKey: fileKey,
        fileName: 'Project-brief.pdf',
        category: 'DOCUMENT',
        contextId: project.id,
        contextType: 'PROJECT',
        contentType: 'application/pdf',
        size: 68140,
        status: 'UPLOADED',
        uploadedBy: userId,
      },
    })

    const doc = await tx.document.create({
      data: {
        title: '📄 Product Plan',
        description: 'Idea, target users, and v1 goal for the project.',
        projectId: project.id,
        uploadedBy: userId,
        uploadId: upload.id,
      },
    })

    await tx.documentLink.create({
      data: {
        documentId: doc.id,
        entityType: 'TASK',
        entityId: buildTask.id,
      },
    })

    return project
  })
}
