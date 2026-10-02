import { getPrisma } from '../utils/db.ts'
import {
  createWorkspaceService,
  getWorkspaceByIdService,
  updateWorkspaceService,
  deleteWorkspaceService,
  listUserWorkspacesService,
} from '../../src/modules/workspace/workspace.service.ts'
import { ApiError } from '../../src/utils/apiError.ts'

describe('Workspace Service CRUD', () => {
  let prisma: Awaited<ReturnType<typeof getPrisma>>

  beforeAll(async () => {
    prisma = await getPrisma()
  })

  describe('Create Workspace', () => {
    it('should create a workspace successfully', async () => {
      const user = await prisma.user.create({
        data: { email: 'ws_create@test.com', fullName: 'Creator', is_new: false },
      })
      const ws = await createWorkspaceService({
        name: 'My New Workspace',
        description: 'Test description',
        ownerId: user.id,
      })
      expect(ws.id).toBeDefined()
      expect(ws.name).toBe('My New Workspace')
      expect(ws.description).toBe('Test description')
    })

    it('should limit user to 3 workspaces', async () => {
      const user = await prisma.user.create({
        data: { email: 'ws_limit@test.com', fullName: 'Limit User', is_new: false },
      })
      await createWorkspaceService({ name: 'WS 1', ownerId: user.id })
      await createWorkspaceService({ name: 'WS 2', ownerId: user.id })
      await createWorkspaceService({ name: 'WS 3', ownerId: user.id })

      await expect(
        createWorkspaceService({ name: 'WS 4', ownerId: user.id }),
      ).rejects.toThrow('You can only create up to 3 workspaces')
    })
  })

  describe('Get Workspace', () => {
    it('should get a workspace by ID', async () => {
      const user = await prisma.user.create({
        data: { email: 'ws_get@test.com', fullName: 'Get User', is_new: false },
      })
      const ws = await createWorkspaceService({ name: 'WS to get', ownerId: user.id })
      const fetched = await getWorkspaceByIdService(ws.id)
      expect(fetched.name).toBe('WS to get')
      expect(fetched.workspaceMembers[0]).toBeDefined()
      expect(fetched.workspaceMembers[0]?.user.id).toBe(user.id)
    })

    it('should throw if workspace not found', async () => {
      await expect(getWorkspaceByIdService(999999)).rejects.toThrow('Workspace not found')
    })

    it('should throw if workspace is deleted', async () => {
      const user = await prisma.user.create({
        data: { email: 'ws_get_del@test.com', fullName: 'Del Get User', is_new: false },
      })
      const ws = await createWorkspaceService({ name: 'WS to get del', ownerId: user.id })
      await deleteWorkspaceService({ workspaceId: ws.id })
      await expect(getWorkspaceByIdService(ws.id)).rejects.toThrow('Workspace not found')
    })
  })

  describe('Update Workspace', () => {
    it('should update workspace details', async () => {
      const user = await prisma.user.create({
        data: { email: 'ws_update@test.com', fullName: 'Updater', is_new: false },
      })
      const ws = await createWorkspaceService({ name: 'WS Old Name', ownerId: user.id })
      const updated = await updateWorkspaceService({
        workspaceId: ws.id,
        name: 'WS New Name',
        description: 'Updated desc',
      })
      expect(updated.name).toBe('WS New Name')
      expect(updated.description).toBe('Updated desc')
    })

    it('should throw if no fields to update', async () => {
      const user = await prisma.user.create({
        data: {
          email: 'ws_upd_empty@test.com',
          fullName: 'Updater Empty',
          is_new: false,
        },
      })
      const ws = await createWorkspaceService({ name: 'WS no fields', ownerId: user.id })
      await expect(updateWorkspaceService({ workspaceId: ws.id })).rejects.toThrow(
        'No fields to update',
      )
    })
  })

  describe('Delete Workspace', () => {
    it('should delete workspace', async () => {
      const user = await prisma.user.create({
        data: { email: 'ws_delete@test.com', fullName: 'Deleter', is_new: false },
      })
      const ws = await createWorkspaceService({ name: 'WS to delete', ownerId: user.id })
      const deleted = await deleteWorkspaceService({ workspaceId: ws.id })
      expect(deleted.status).toBe('DELETED')
    })

    it('should throw if already deleted or not found', async () => {
      const user = await prisma.user.create({
        data: { email: 'ws_del_err@test.com', fullName: 'Deleter Err', is_new: false },
      })
      const ws = await createWorkspaceService({
        name: 'WS to delete twice',
        ownerId: user.id,
      })
      await deleteWorkspaceService({ workspaceId: ws.id })
      await expect(deleteWorkspaceService({ workspaceId: ws.id })).rejects.toThrow(
        'Workspace not found or cannot be deleted',
      )
    })
  })

  describe('List User Workspaces', () => {
    it('should return only user workspaces', async () => {
      const user1 = await prisma.user.create({
        data: { email: 'ws_list1@test.com', fullName: 'List User 1', is_new: false },
      })
      const user2 = await prisma.user.create({
        data: { email: 'ws_list2@test.com', fullName: 'List User 2', is_new: false },
      })
      await createWorkspaceService({ name: 'U1 WS 1', ownerId: user1.id })
      await createWorkspaceService({ name: 'U1 WS 2', ownerId: user1.id })
      await createWorkspaceService({ name: 'U2 WS 1', ownerId: user2.id })

      const user1Ws = await listUserWorkspacesService({ userId: user1.id })
      expect(user1Ws.length).toBe(2)
      expect(user1Ws.map(w => w.name).sort()).toEqual(['U1 WS 1', 'U1 WS 2'])

      const user2Ws = await listUserWorkspacesService({ userId: user2.id })
      expect(user2Ws.length).toBe(1)
      expect(user2Ws[0]).toBeDefined()
      expect(user2Ws[0]!.name).toBe('U2 WS 1')
    })
  })
})
