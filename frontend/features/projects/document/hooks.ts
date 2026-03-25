import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  getProjectDocuments,
  getDocument,
  createDocument,
  updateDocument,
  deleteDocument,
  getDocumentLinks,
  createDocumentLink,
  getEntityDocuments,
  unlinkDocument,
  uploadDocumentFile,
} from './api'
import type {
  CreateDocumentInput,
  UpdateDocumentInput,
  CreateDocumentLinkInput,
  DocumentEntityType,
} from './types'


const documentKeys = {
  all: ['documents'],
  byProject: (projectId: number) => [...documentKeys.all, 'project', projectId],
  detail: (projectId: number, documentId: number) => [
    ...documentKeys.byProject(projectId),
    documentId,
  ],
  links: (projectId: number, documentId: number) => [
    ...documentKeys.detail(projectId, documentId),
    'links',
  ],
  entityDocuments: (projectId: number, entityType: string, entityId: number) => [
    ...documentKeys.all,
    'entity',
    projectId,
    entityType,
    entityId,
  ],
}

export const useProjectDocuments = (projectId: number | null) => {
  return useQuery({
    queryKey: documentKeys.byProject(projectId || 0),
    queryFn: () => getProjectDocuments(projectId!),
    enabled: projectId !== null,
    staleTime: 5 * 60 * 1000,
  })
}

export const useDocument = (projectId: number | null, documentId: number | null) => {
  return useQuery({
    queryKey: documentKeys.detail(projectId || 0, documentId || 0),
    queryFn: () => getDocument(projectId!, documentId!),
    enabled: projectId !== null && documentId !== null,
    staleTime: 5 * 60 * 1000,
  })
}

export const useDocumentLinks = (projectId: number | null, documentId: number | null) => {
  return useQuery({
    queryKey: documentKeys.links(projectId || 0, documentId || 0),
    queryFn: () => getDocumentLinks(projectId!, documentId!),
    enabled: projectId !== null && documentId !== null,
    staleTime: 5 * 60 * 1000,
  })
}

export const useEntityDocuments = (
  projectId: number | null,
  entityType: DocumentEntityType | null,
  entityId: number | null,
) => {
  return useQuery({
    queryKey: documentKeys.entityDocuments(
      projectId || 0,
      entityType || '',
      entityId || 0,
    ),
    queryFn: () => getEntityDocuments(projectId!, entityType!, entityId!),
    enabled: projectId !== null && entityType !== null && entityId !== null,
    staleTime: 5 * 60 * 1000,
  })
}


export const useCreateDocument = (projectId: number) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: CreateDocumentInput) => createDocument(input),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: documentKeys.byProject(projectId),
      })
    },
  })
}

/**
 * Update a document
 */
export const useUpdateDocument = (projectId: number, documentId: number) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: UpdateDocumentInput) =>
      updateDocument(projectId, documentId, input),
    onSuccess: () => {
      // Invalidate document detail and list
      queryClient.invalidateQueries({
        queryKey: documentKeys.detail(projectId, documentId),
      })
      queryClient.invalidateQueries({
        queryKey: documentKeys.byProject(projectId),
      })
    },
  })
}

/**
 * Delete/Archive a document
 */
export const useDeleteDocument = (projectId: number) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (documentId: number) => deleteDocument(projectId, documentId),
    onSuccess: () => {
      // Invalidate documents list
      queryClient.invalidateQueries({
        queryKey: documentKeys.byProject(projectId),
      })
    },
  })
}

/**
 * Create a link between document and entity
 */
export const useCreateDocumentLink = (projectId: number, documentId: number) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: CreateDocumentLinkInput) => createDocumentLink(projectId, input),
    onSuccess: () => {
      // Invalidate document detail and links
      queryClient.invalidateQueries({
        queryKey: documentKeys.detail(projectId, documentId),
      })
      queryClient.invalidateQueries({
        queryKey: documentKeys.links(projectId, documentId),
      })
    },
  })
}

/**
 * Unlink a document from an entity
 */
export const useUnlinkDocument = (projectId: number, documentId: number) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (linkId: number) => unlinkDocument(projectId, linkId),
    onSuccess: () => {
      // Invalidate document detail and links
      queryClient.invalidateQueries({
        queryKey: documentKeys.detail(projectId, documentId),
      })
      queryClient.invalidateQueries({
        queryKey: documentKeys.links(projectId, documentId),
      })
    },
  })
}

/**
 * Upload file and create document in one step
 */
export const useUploadAndCreateDocument = (projectId: number) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      file,
      title,
      description,
    }: {
      file: File
      title: string
      description?: string
    }) => {
      const uploadResponse = await uploadDocumentFile(projectId, file)

      const document = await createDocument({
        projectId,
        uploadId: uploadResponse.uploadId,
        title,
        description,
      })

      return document
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: documentKeys.byProject(projectId),
      })
    },
  })
}
