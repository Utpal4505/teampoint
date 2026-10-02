import { getPrisma } from '../utils/db.ts'
import { createWorkspaceService } from '../../src/modules/workspace/workspace.service.ts'
import {
  createProjectService,
  getProjectByIdService,
  updateProjectService,
  deleteProjectService,
  listAllWorkspaceProjectService,
} from '../../src/modules/project/project.service.ts'
import { listProjectMembersService } from '../../src/modules/projectMember/projectMember.service.ts'

describe('Project Service CRUD', () => {
  let prisma: Awaited<ReturnType<typeof getPrisma>>

  beforeAll(async () => {
    prisma = await getPrisma()
  })

  describe('Create Project', () => {
    it('should create a project successfully', async () => {
      const user = await prisma.user.create({
        data: { email: 'proj_create@test.com', fullName: 'Proj Creator', is_new: false },
      })
      const ws = await createWorkspaceService({
        name: 'WS Proj Create',
        ownerId: user.id,
      })

      const project = await createProjectService({
        name: 'My New Project',
        description: 'Proj desc',
        workspaceId: ws.id,
        createdBy: user.id,
      })

      expect(project.id).toBeDefined()
      expect(project.name).toBe('My New Project')
      expect(project.workspaceId).toBe(ws.id)
    })
  })

  describe('Get Project', () => {
    it('should get a project by ID', async () => {
      const user = await prisma.user.create({
        data: { email: 'proj_get@test.com', fullName: 'Proj Getter', is_new: false },
      })
      const ws = await createWorkspaceService({ name: 'WS Proj Get', ownerId: user.id })
      const project = await createProjectService({
        name: 'Project to get',
        description: 'Project for retrieval test',
        workspaceId: ws.id,
        createdBy: user.id,
      })

      const fetched = await getProjectByIdService(project.id)
      expect(fetched.name).toBe('Project to get')
      expect(fetched.projectMembers[0]).toBeDefined()
      expect(fetched.projectMembers[0]?.user.id).toBe(user.id)
    })

    it('should throw if project not found', async () => {
      await expect(getProjectByIdService(999999)).rejects.toThrow('Project not found')
    })
  })

  describe('Update Project', () => {
    it('should update project details', async () => {
      const user = await prisma.user.create({
        data: { email: 'proj_update@test.com', fullName: 'Proj Updater', is_new: false },
      })
      const ws = await createWorkspaceService({
        name: 'WS Proj Update',
        ownerId: user.id,
      })
      const project = await createProjectService({
        name: 'Project Old Name',
        description: 'Older project description',
        workspaceId: ws.id,
        createdBy: user.id,
      })

      const updated = await updateProjectService({
        projectId: project.id,
        name: 'Project New Name',
        description: 'New Desc',
      })

      expect(updated.name).toBe('Project New Name')
      expect(updated.description).toBe('New Desc')
    })
  })

  describe('Delete Project', () => {
    it('should delete project', async () => {
      const user = await prisma.user.create({
        data: { email: 'proj_delete@test.com', fullName: 'Proj Deleter', is_new: false },
      })
      const ws = await createWorkspaceService({
        name: 'WS Proj Delete',
        ownerId: user.id,
      })
      const project = await createProjectService({
        name: 'Project to delete',
        description: 'Project scheduled for deletion',
        workspaceId: ws.id,
        createdBy: user.id,
      })

      const deleted = await deleteProjectService(project.id)
      expect(deleted.status).toBe('DELETED')
    })

    it('should throw if already deleted or not found', async () => {
      const user = await prisma.user.create({
        data: {
          email: 'proj_del_err@test.com',
          fullName: 'Proj Deleter Err',
          is_new: false,
        },
      })
      const ws = await createWorkspaceService({
        name: 'WS Proj Delete Err',
        ownerId: user.id,
      })
      const project = await createProjectService({
        name: 'Project to delete twice',
        description: 'Project deleted twice scenario',
        workspaceId: ws.id,
        createdBy: user.id,
      })

      await deleteProjectService(project.id)
      await expect(deleteProjectService(project.id)).rejects.toThrow(
        'Project not found or cannot be deleted',
      )
    })
  })

  describe('List Workspace Projects', () => {
    it('should return projects accessible to the user', async () => {
      const owner = await prisma.user.create({
        data: { email: 'proj_list_owner@test.com', fullName: 'Owner', is_new: false },
      })
      const stranger = await prisma.user.create({
        data: {
          email: 'proj_list_stranger@test.com',
          fullName: 'Stranger',
          is_new: false,
        },
      })

      const ws = await createWorkspaceService({ name: 'WS List Proj', ownerId: owner.id })

      await createProjectService({
        name: 'P1',
        description: 'First project for listing test',
        workspaceId: ws.id,
        createdBy: owner.id,
      })
      await createProjectService({
        name: 'P2',
        description: 'Second project for listing test',
        workspaceId: ws.id,
        createdBy: owner.id,
      })

      const ownerProjects = await listAllWorkspaceProjectService(ws.id, owner.id)
      expect(ownerProjects.length).toBe(2)

      const strangerProjects = await listAllWorkspaceProjectService(ws.id, stranger.id)
      expect(strangerProjects.length).toBe(0)
    })

    it('should apply page and limit bounds when listing workspace projects', async () => {
      const owner = await prisma.user.create({
        data: {
          email: 'proj_paged_owner@test.com',
          fullName: 'Paged Owner',
          is_new: false,
        },
      })

      const ws = await createWorkspaceService({
        name: 'WS Paged Proj List',
        ownerId: owner.id,
      })

      for (let i = 1; i <= 5; i += 1) {
        await createProjectService({
          name: `Paged Project ${i}`,
          description: `Paged project number ${i}`,
          workspaceId: ws.id,
          createdBy: owner.id,
        })
      }

      const pageOne = await listAllWorkspaceProjectService(ws.id, owner.id, {
        page: 1,
        limit: 2,
      })
      const pageTwo = await listAllWorkspaceProjectService(ws.id, owner.id, {
        page: 2,
        limit: 2,
      })

      expect(pageOne).toHaveLength(2)
      expect(pageTwo).toHaveLength(2)
      expect(pageOne[0]).toBeDefined()
      expect(pageTwo[0]).toBeDefined()
      expect(pageOne[0]!.id).not.toBe(pageTwo[0]!.id)
    })

    it('should apply page and limit bounds when listing project members', async () => {
      const owner = await prisma.user.create({
        data: {
          email: 'proj_member_paged_owner@test.com',
          fullName: 'Project Member Paged Owner',
          is_new: false,
        },
      })

      const ws = await createWorkspaceService({
        name: 'WS Paged Project Members',
        ownerId: owner.id,
      })

      const project = await createProjectService({
        name: 'Paged Member Project',
        description: 'Project membership pagination regression',
        workspaceId: ws.id,
        createdBy: owner.id,
      })

      for (let i = 1; i <= 5; i += 1) {
        const member = await prisma.user.create({
          data: {
            email: `proj_member_${i}@test.com`,
            fullName: `Member ${i}`,
            is_new: false,
          },
        })

        await prisma.project_Members.create({
          data: {
            projectId: project.id,
            userId: member.id,
            role: 'MEMBER',
            status: 'ACTIVE',
            permissions: {},
            joinedAt: new Date(),
          },
        })
      }

      const pageOne = await listProjectMembersService(project.id, { page: 1, limit: 2 })
      const pageTwo = await listProjectMembersService(project.id, { page: 2, limit: 2 })

      expect(pageOne).toHaveLength(2)
      expect(pageTwo).toHaveLength(2)
      expect(pageOne[0]).toBeDefined()
      expect(pageTwo[0]).toBeDefined()
      expect(pageOne[0]!.userId).not.toBe(pageTwo[0]!.userId)
    })
  })
})
