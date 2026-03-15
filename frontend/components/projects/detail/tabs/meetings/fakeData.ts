import type { Meeting } from './meetings.types'

export const FAKE_MEETINGS: Meeting[] = [
  {
    id: 1,
    title: 'Sprint Planning',
    description:
      'Plan tasks and goals for Sprint 3. Review backlog and assign priorities.',
    status: 'SCHEDULED',
    startTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    endTime: new Date(
      Date.now() + 2 * 24 * 60 * 60 * 1000 + 60 * 60 * 1000,
    ).toISOString(),
    meetingLink: 'https://meet.google.com/abc-defg-hij',
    participantCount: 4,
    participants: [
      { userId: 1, name: 'Utpal Kumar', avatarUrl: null, role: 'HOST' },
      { userId: 2, name: 'Rahul Sharma', avatarUrl: null, role: 'PARTICIPANT' },
      { userId: 3, name: 'Aman Verma', avatarUrl: null, role: 'PARTICIPANT' },
      { userId: 4, name: 'Neha Singh', avatarUrl: null, role: 'PARTICIPANT' },
    ],
    keyDecisions: null,
    actionItems: [],
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 2,
    title: 'API Design Review',
    description: 'Review REST endpoints, finalize request/response schemas.',
    status: 'SCHEDULED',
    startTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    endTime: new Date(
      Date.now() + 5 * 24 * 60 * 60 * 1000 + 90 * 60 * 1000,
    ).toISOString(),
    meetingLink: 'https://meet.google.com/klm-nopq-rst',
    participantCount: 3,
    participants: [
      { userId: 1, name: 'Utpal Kumar', avatarUrl: null, role: 'HOST' },
      { userId: 2, name: 'Rahul Sharma', avatarUrl: null, role: 'PARTICIPANT' },
      { userId: 5, name: 'Dev Patel', avatarUrl: null, role: 'PARTICIPANT' },
    ],
    keyDecisions: null,
    actionItems: [],
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 3,
    title: 'Backend Planning',
    description: 'Discussed database schema, auth flow, and deployment strategy.',
    status: 'COMPLETED',
    startTime: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    endTime: new Date(
      Date.now() - 5 * 24 * 60 * 60 * 1000 + 60 * 60 * 1000,
    ).toISOString(),
    meetingLink: 'https://meet.google.com/uvw-xyza-bcd',
    participantCount: 3,
    participants: [
      { userId: 1, name: 'Utpal Kumar', avatarUrl: null, role: 'HOST' },
      { userId: 3, name: 'Aman Verma', avatarUrl: null, role: 'PARTICIPANT' },
      { userId: 2, name: 'Rahul Sharma', avatarUrl: null, role: 'PARTICIPANT' },
    ],
    keyDecisions:
      'OAuth flow approved. Will use Google OAuth for v1. Postgres confirmed as primary DB. Deployment on Railway for MVP.',
    actionItems: [
      {
        id: 1,
        title: 'Implement Google OAuth',
        assignedToName: 'Rahul Sharma',
        dueDate: '2026-01-30',
        taskId: 101,
      },
      {
        id: 2,
        title: 'Set up Railway deploy',
        assignedToName: 'Utpal Kumar',
        dueDate: '2026-02-01',
        taskId: 102,
      },
      {
        id: 3,
        title: 'Write DB migration script',
        assignedToName: 'Aman Verma',
        dueDate: '2026-01-28',
        taskId: 103,
      },
    ],
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 4,
    title: 'Design System Review',
    description: 'Review component library and finalize design tokens.',
    status: 'CANCELLED',
    startTime: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    endTime: new Date(
      Date.now() - 3 * 24 * 60 * 60 * 1000 + 60 * 60 * 1000,
    ).toISOString(),
    meetingLink: 'https://meet.google.com/efg-hijk-lmn',
    participantCount: 4,
    participants: [
      { userId: 1, name: 'Utpal Kumar', avatarUrl: null, role: 'HOST' },
      { userId: 4, name: 'Neha Singh', avatarUrl: null, role: 'PARTICIPANT' },
    ],
    keyDecisions: null,
    actionItems: [],
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
]
