import type { UpdateProjectInput } from '../../types/project.type.ts'
import { ApiResponse } from '../../utils/apiResponse.ts'
import { assertUser } from '../../utils/assertUser.ts'
import { asyncHandler } from '../../utils/asyncHandler.ts'
import {
  projectIdParamSchema,
  updateProjectSchema,
} from './project.schema.ts'
import {
  createProjectService,
  deleteProjectService,
  getProjectByIdService,
  updateProjectService,
} from './project.service.ts'

export const createProjectController = asyncHandler(async (req, res) => {
  assertUser(req.user)

  const { description, name, workspaceId } = req.body

  const project = await createProjectService({
    workspaceId,
    name,
    description,
    createdBy: req.user.id,
  })

  return res
    .status(201)
    .json(new ApiResponse(201, 'Project created successfully', project))
})

export const getProjectByIdController = asyncHandler(async (req, res) => {
  assertUser(req.user)

  const { projectId } = projectIdParamSchema.parse(req.params)

  const project = await getProjectByIdService(projectId)

  return res
    .status(200)
    .json(new ApiResponse(200, 'Project retrieved successfully', project))
})

export const updateProjectController = asyncHandler(async (req, res) => {
  assertUser(req.user)

  const { projectId } = projectIdParamSchema.parse(req.params)
  const { description, name, status } = updateProjectSchema.parse(req.body)

  const input: UpdateProjectInput = {
    projectId,
    description,
    name,
    status,
  }

  const updatedProject = await updateProjectService(input)

  return res
    .status(200)
    .json(new ApiResponse(200, 'Project updated successfully', updatedProject))
})

export const deleteProjectController = asyncHandler(async (req, res) => {
  assertUser(req.user)

  const { projectId } = projectIdParamSchema.parse(req.params)

  const deletedProject = await deleteProjectService(projectId)

  return res
    .status(200)
    .json(new ApiResponse(200, 'Project deleted successfully', deletedProject))
})
