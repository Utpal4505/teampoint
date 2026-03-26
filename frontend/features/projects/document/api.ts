import api from '@/lib/api'
import type {
  Document,
  DocumentWithLinks,
  CreateDocumentInput,
  UpdateDocumentInput,
  DocumentLink,
  CreateDocumentLinkInput,
  DocumentEntityType,
} from './types'

export const uploadDocumentFile = async (
  projectId: number,
  file: File,
): Promise<{ uploadId: number; fileKey: string }> => {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('category', 'DOCUMENT')
  formData.append('contextId', String(projectId))
  formData.append('fileName', file.name)
  formData.append('contentType', file.type)

  const { data } = await api.post('/uploads/direct', formData)
  return data.data
}

export const getProjectDocuments = async (
  projectId: number,
): Promise<DocumentWithLinks[]> => {
  const { data } = await api.get(`/projects/${projectId}/documents`)
  return (data.data ?? []).map((doc: DocumentWithLinks) => ({
    ...doc,
    links: doc.links ?? [],
  }))
}

export const getDocument = async (
  projectId: number,
  documentId: number,
): Promise<DocumentWithLinks> => {
  const { data } = await api.get(`/projects/${projectId}/documents/${documentId}`)
  return data.data
}

export const createDocument = async (input: CreateDocumentInput): Promise<Document> => {
  const { projectId, ...body } = input
  const sendBody = { ...body, projectId }
  const { data } = await api.post(`/projects/${projectId}/documents/`, sendBody)
  return data.data
}

export const updateDocument = async (
  projectId: number,
  documentId: number,
  input: UpdateDocumentInput,
): Promise<Document> => {
  const { data } = await api.patch(
    `/projects/${projectId}/documents/${documentId}`,
    input,
  )
  return data.data
}

export const deleteDocument = async (
  projectId: number,
  documentId: number,
): Promise<{ id: number; isArchived: boolean }> => {
  const { data } = await api.delete(`/projects/${projectId}/documents/${documentId}`)
  return data.data
}

export const getDocumentLinks = async (
  projectId: number,
  documentId: number,
): Promise<DocumentLink[]> => {
  const { data } = await api.get(
    `/projects/${projectId}/documents/${documentId}/document-links`,
  )
  return data.data.data
}

export const createDocumentLink = async (
  projectId: number,
  input: CreateDocumentLinkInput,
): Promise<DocumentLink> => {
  const { data } = await api.post(`/projects/${projectId}/document-links`, input)
  return data.data
}

export const getEntityDocuments = async (
  projectId: number,
  entityType: DocumentEntityType,
  entityId: number,
): Promise<DocumentLink[]> => {
  const { data } = await api.get(
    `/projects/${projectId}/document-links/${entityType}/${entityId}`,
  )
  return data.data
}

export const unlinkDocument = async (
  projectId: number,
  linkId: number,
): Promise<{ id: number; status: string; unlinkedAt: string }> => {
  const { data } = await api.patch(
    `/projects/${projectId}/document-links/${linkId}/unlink`,
  )
  return data.data
}

export const getDocumentDownloadUrl = async (
  projectId: number,
  documentId: number,
): Promise<{ presignedUrl: string; expiresIn: number }> => {
  const { data } = await api.post(
    `/projects/${projectId}/documents/${documentId}/download-url`,
  )
  return data.data
}

export interface EntityOption {
  id: number
  title: string
  type: DocumentEntityType
  status?: string
  date?: string
}

// Backend response types for entities
interface MilestoneResponse {
  id: number
  title: string
  dueDate?: string
}

interface MeetingResponse {
  id: number
  title: string
  dateTime?: string
}

interface TaskResponse {
  id: number
  title: string
  status?: string
  dueDate?: string
}

interface DiscussionResponse {
  id: number
  title: string
  createdAt?: string
}

export const getProjectDiscussions = async (
  projectId: number,
): Promise<EntityOption[]> => {
  const { data } = await api.get(`/projects/${projectId}/discussions`)
  return (data.data ?? []).map((discussion: DiscussionResponse) => ({
    id: discussion.id,
    title: discussion.title,
    type: 'DISCUSSION' as const,
    date: discussion.createdAt,
  }))
}

export const getProjectMilestones = async (
  projectId: number,
): Promise<EntityOption[]> => {
  const { data } = await api.get(`/projects/${projectId}/milestones`)
  return (data.data ?? []).map((milestone: MilestoneResponse) => ({
    id: milestone.id,
    title: milestone.title,
    type: 'MILESTONE' as const,
    date: milestone.dueDate,
  }))
}

export const getProjectMeetings = async (projectId: number): Promise<EntityOption[]> => {
  const { data } = await api.get(`/projects/${projectId}/meetings`)
  return (data.data ?? []).map((meeting: MeetingResponse) => ({
    id: meeting.id,
    title: meeting.title,
    type: 'MEETING' as const,
    date: meeting.dateTime,
  }))
}
