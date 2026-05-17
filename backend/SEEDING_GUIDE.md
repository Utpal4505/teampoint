# 🌱 TeamPoint Seeding Architecture

Complete modular seeding system that simulates 90 days of realistic startup activity.

## 📁 Folder Structure

```
backend/prisma/
├── seed.ts                 # Main orchestrator
└── seed/
    ├── faker.ts           # Faker utility functions
    ├── timeline.engine.ts # 90-day timeline orchestration
    ├── users.seed.ts      # Create 9 new users
    ├── workspace.seed.ts  # Add members to workspace
    ├── project.seed.ts    # Create 7 projects
    ├── task.seed.ts       # Create ~30 tasks per project
    ├── meeting.seed.ts    # Create ~10 meetings per project
    ├── document.seed.ts   # Create ~7 documents per project
    └── activity.seed.ts   # Create 200 activity log entries
```

## 🚀 Quick Start

```bash
# Run the seeder
npm run seed

# Output: 10 users + 7 projects + 210 tasks + 70 meetings + 49 docs + 200 activity logs
```

## 📊 Timeline Architecture

The seeder simulates realistic activity progression:

```
Day -90 → Workspace created
Day -85 → Members joined
Day -80 → Projects created
Day -70 → Tasks start appearing
Day -60 → First meetings
Day -50 → Documents uploaded
Day -40 → Discussions started
Day -30 → Action items assigned
Day -20 → Tasks completed
Day -7  → Recent activity
```

## 🧬 Data Generated

### Users

- **9 new users** + existing user 6 (owner)
- Realistic names & emails via faker
- Status: ACTIVE

### Workspace

- **Workspace ID 4** (configurable)
- 2 ADMIN roles
- 7 MEMBER roles
- 1 OWNER (user 6)

### Projects (7 total)

1. TeamPoint Platform
2. Mobile App
3. Marketing Website
4. AI Bug Analyzer
5. Internal Tools
6. Growth Experiments
7. Developer Docs

### Tasks (~210 total)

- 30 tasks per project
- Distributed statuses: TODO, IN_PROGRESS, DONE, CANCELLED
- Priorities: LOW, MEDIUM, HIGH, URGENT
- Realistic dates spread across 90-day period
- Completed tasks have `completedAt` timestamps

### Meetings (~70 total)

- 10 meetings per project
- Statuses: SCHEDULED, COMPLETED, CANCELLED
- 3-5 participants per meeting
- 1-hour durations with meeting links

### Documents (~49 total)

- 7 documents per project
- Each has Upload record (category: DOCUMENT)
- Realistic file metadata (size, content type)
- Uploaded via Upload table (S3/R2 compatible)

### Activity Logs (200 total)

- Types: TASK, PROJECT, MEETING, DOCUMENT
- Actions: CREATED, UPDATED, ASSIGNED, COMPLETED
- Distributed across entire 90-day period
- Real content phrases for variety

## 🔧 Customization

### Change workspace/owner

Edit [seed.ts](../src/seed.ts):

```typescript
const WORKSPACE_ID = 4 // Change this
const OWNER_ID = 6 // Or this
```

### Adjust data volume

Edit individual seed files:

```typescript
// In task.seed.ts - change from 30 to 50
for (let i = 0; i < 50; i++) { ... }
```

### Modify timeline

Edit [timeline.engine.ts](../prisma/seed/timeline.engine.ts):

```typescript
export const timeline = {
  workspaceCreated: -90, // 90 days ago
  projectsCreated: -80, // 80 days ago
  // ... adjust as needed
}
```

## 📈 Faker Utilities

Available in [faker.ts](../prisma/seed/faker.ts):

```typescript
randomEmail() // faker.internet.email()
randomName() // faker.person.fullName()
randomPhrase() // hacker phrase
randomUrl() // internet URL
randomBuzzPhrase() // company buzz phrase
randomDateBetween() // between two dates
randomPastDays() // N days ago
pickRandom() // random element from array
pickMultiple() // multiple random elements
randomInt() // integer in range
```

## ✅ Output Summary

```
✅ Seeding Complete! Summary:
  Users:        10 team members
  Projects:     7 active
  Tasks:        ~210 tasks
  Meetings:     ~70 meetings
  Documents:    ~49 docs
  Activity Log: 200 events
```

## 🔄 Clean & Reseed

```bash
# Reset database (careful - deletes all data!)
npx prisma migrate reset

# Then reseed
npm run seed
```

## 🐛 Troubleshooting

**Error: "Missing script: seed"**

- Make sure package.json has the seed script added
- Already included in updated version

**Foreign key constraint error**

- Check that workspace 4 exists
- Check that user 6 exists
- Verify IDs are correct in seed.ts

**Data not appearing**

- Check database connection in db.config.ts
- Verify NODE_ENV=development
- Check Prisma migrations are up to date: `npx prisma migrate status`

## 📝 Notes

- All timestamps are realistic and distributed across 90 days
- Completed tasks have proper `completedAt` values
- Meeting participants are randomly selected from user pool
- Document uploads include proper Upload table records
- Activity logs reference valid entities
- Safe to run multiple times (uses create/upsert appropriately)

---

**Created:** March 2026  
**Version:** 1.0 - Complete modular architecture
