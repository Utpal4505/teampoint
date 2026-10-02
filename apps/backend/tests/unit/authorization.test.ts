import { jest } from '@jest/globals'
import { clearDatabase, getPrisma } from '../utils/db.ts'
import {
  createWorkspaceService,
  getWorkspaceByIdService,
} from '../../src/modules/workspace/workspace.service.ts'
import {
  createProjectService,
  getProjectByIdService,
} from '../../src/modules/project/project.service.ts'
import { assertWorkspaceMember } from '../../src/utils/assertWorkspaceMember.ts'
import { assertProjectMember } from '../../src/utils/assertProjectMember.ts'
import { UploadRequestSchema } from '../../src/modules/upload/upload.schema.ts'
import { requireWorkspacePermission } from '../../src/middlewares/requireWorkspacePermission.middleware.ts'
import { updateWorkspaceMemberRoleService } from '../../src/modules/workspace/workspace.service.ts'

describe('Authorization - Tenant Isolation', () => {
  let prisma: Awaited<ReturnType<typeof getPrisma>>

  beforeAll(async () => {
    prisma = await getPrisma()
  })

  describe('Workspace Access', () => {
    it('should allow workspace member to be verified', async () => {
      // Create user
      const user = await prisma.user.create({
        data: { email: 'owner@test.com', fullName: 'Owner', is_new: false },
      })
      // Create workspace
      const workspace = await createWorkspaceService({
        name: 'Test Workspace',
        ownerId: user.id,
      })
      // Verify member assertion succeeds
      const member = await assertWorkspaceMember(workspace.id, user.id)
      expect(member.role).toBe('OWNER')
    })

    it('should deny non-member access to workspace', async () => {
      const owner = await prisma.user.create({
        data: { email: 'owner2@test.com', fullName: 'Owner', is_new: false },
      })
      const stranger = await prisma.user.create({
        data: { email: 'stranger@test.com', fullName: 'Stranger', is_new: false },
      })
      const workspace = await createWorkspaceService({
        name: 'Private Workspace',
        ownerId: owner.id,
      })
      // Stranger should be denied
      await expect(assertWorkspaceMember(workspace.id, stranger.id)).rejects.toThrow(
        'Not a workspace member',
      )
    })
  })

  describe('Project Access', () => {
    it('should allow project member to be verified', async () => {
      const user = await prisma.user.create({
        data: { email: 'projowner@test.com', fullName: 'Project Owner', is_new: false },
      })
      const workspace = await createWorkspaceService({
        name: 'WS for Project',
        ownerId: user.id,
      })
      const project = await createProjectService({
        name: 'Test Project',
        description: 'Project used for access assertion test',
        workspaceId: workspace.id,
        createdBy: user.id,
      })
      const member = await assertProjectMember(project.id, user.id)
      expect(member.role).toBe('OWNER')
    })

    it('should deny non-member access to project', async () => {
      const owner = await prisma.user.create({
        data: { email: 'projowner2@test.com', fullName: 'Owner', is_new: false },
      })
      const stranger = await prisma.user.create({
        data: { email: 'stranger2@test.com', fullName: 'Stranger', is_new: false },
      })
      const workspace = await createWorkspaceService({
        name: 'WS Private',
        ownerId: owner.id,
      })
      const project = await createProjectService({
        name: 'Private Project',
        description: 'Private project access test',
        workspaceId: workspace.id,
        createdBy: owner.id,
      })
      await expect(assertProjectMember(project.id, stranger.id)).rejects.toThrow(
        'Not a project member',
      )
    })

    it('should allow workspace OWNER/ADMIN to access projects', async () => {
      const owner = await prisma.user.create({
        data: { email: 'wsadmin@test.com', fullName: 'WS Admin', is_new: false },
      })
      const workspace = await createWorkspaceService({
        name: 'WS Admin Access',
        ownerId: owner.id,
      })
      // Create project by owner (automatically adds as project member)
      const project = await createProjectService({
        name: 'Admin Accessible',
        description: 'Workspace owner project access test',
        workspaceId: workspace.id,
        createdBy: owner.id,
      })
      // Owner should have access even through workspace membership
      const member = await assertProjectMember(project.id, owner.id)
      expect(member).toBeTruthy()
    })
  })

  describe('Workspace Creation Limits', () => {
    it('should limit user to 3 workspaces', async () => {
      const user = await prisma.user.create({
        data: { email: 'limited@test.com', fullName: 'Limited User', is_new: false },
      })
      await createWorkspaceService({ name: 'WS 1', ownerId: user.id })
      await createWorkspaceService({ name: 'WS 2', ownerId: user.id })
      await createWorkspaceService({ name: 'WS 3', ownerId: user.id })

      await expect(
        createWorkspaceService({ name: 'WS 4', ownerId: user.id }),
      ).rejects.toThrow('You can only create up to 3 workspaces')
    })
  })

  describe('Middleware authorization guards', () => {
    it('should reject inactive workspace members even if a stale membership exists', async () => {
      const owner = await prisma.user.create({
        data: {
          email: 'inactive-owner@test.com',
          fullName: 'Inactive Owner',
          is_new: false,
        },
      })
      const member = await prisma.user.create({
        data: {
          email: 'inactive-member@test.com',
          fullName: 'Inactive Member',
          is_new: false,
        },
      })

      const workspace = await createWorkspaceService({
        name: 'Inactive Member Workspace',
        ownerId: owner.id,
      })

      await prisma.workspace_Members.create({
        data: {
          workspaceId: workspace.id,
          userId: member.id,
          role: 'ADMIN',
          status: 'LEFT',
          joinedAt: new Date(),
          permissions: {},
        },
      })

      const req = {
        user: { id: member.id, email: member.email },
        params: { workspaceId: String(workspace.id) },
      } as any

      const res = {} as any
      const next = jest.fn()

      await requireWorkspacePermission('canViewMembers')(req, res, next)

      expect(next).toHaveBeenCalledTimes(1)
      expect(next).toHaveBeenCalledWith(expect.objectContaining({ statusCode: 403 }))
      expect(next.mock.calls[0][0].message).toBe('User is not a member of this workspace')
    })

    it('should sync workspace member permissions with the new role', async () => {
      const owner = await prisma.user.create({
        data: {
          email: 'perm-owner@test.com',
          fullName: 'Permission Owner',
          is_new: false,
        },
      })
      const member = await prisma.user.create({
        data: {
          email: 'perm-member@test.com',
          fullName: 'Permission Member',
          is_new: false,
        },
      })

      const workspace = await createWorkspaceService({
        name: 'Permission Sync Workspace',
        ownerId: owner.id,
      })

      await prisma.workspace_Members.create({
        data: {
          workspaceId: workspace.id,
          userId: member.id,
          role: 'ADMIN',
          status: 'ACTIVE',
          joinedAt: new Date(),
          permissions: { canInviteMembers: true, canDeleteWorkspace: false },
        },
      })

      await updateWorkspaceMemberRoleService({
        workspaceId: workspace.id,
        actorId: owner.id,
        targetUserId: member.id,
        role: 'MEMBER',
      })

      const freshMember = await prisma.workspace_Members.findUnique({
        where: {
          workspaceId_userId: {
            workspaceId: workspace.id,
            userId: member.id,
          },
        },
        select: {
          role: true,
          permissions: true,
        },
      })

      expect(freshMember?.role).toBe('MEMBER')
      expect(freshMember?.permissions).toMatchObject({
        canInviteMembers: false,
        canViewMembers: true,
      })
    })
  })

  describe('Upload validation', () => {
    beforeEach(async () => {
      await clearDatabase()
    })

    it('should reject path traversal in uploaded file names', () => {
      expect(() =>
        UploadRequestSchema.parse({
          category: 'DOCUMENT',
          contextId: 1,
          fileName: '../../../../malware.pdf',
          contentType: 'application/pdf',
          fileSize: 1024,
        }),
      ).toThrow(/unsafe|invalid file name|path/i)
    })

    it('should reject mismatched file extension and content type', () => {
      expect(() =>
        UploadRequestSchema.parse({
          category: 'DOCUMENT',
          contextId: 1,
          fileName: 'notes.exe',
          contentType: 'application/pdf',
          fileSize: 1024,
        }),
      ).toThrow(/extension|content type|file type/i)
    })
  })
})
