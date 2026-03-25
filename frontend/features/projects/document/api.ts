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
  return data.data
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
