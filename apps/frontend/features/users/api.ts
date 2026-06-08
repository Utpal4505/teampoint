import api from '@/lib/api'
import { User } from './types'
import { AxiosRequestConfig } from 'axios'
import { GetWorkspaceDTO } from '../workspace/types'
import { useUserStore } from '@/store/user.store'

interface CustomAxiosRequestConfig extends AxiosRequestConfig {
  authFlag?: boolean
}

export const getCurrentUser = async (): Promise<User> => {
  const { data } = await api.get('/users/me', {
    authFlag: true,
  } as CustomAxiosRequestConfig)

  return data.data
}

export const updateUserProfile = async ({
  fullName,
}: {
  fullName: string
}): Promise<User> => {
  const { data } = await api.patch('/users/me', {
    fullName,
  })
  return data.data
}

export const requestAvatarUploadUrl = async ({
  fileName,
  fileSize,
  contentType,
}: {
  fileName: string
  fileSize: number
  contentType: string
}) => {
  const { data } = await api.post('/uploads/request', {
    category: 'AVATAR',
    contextId: useUserStore.getState().user?.id,
    fileName,
    fileSize,
    contentType,
  })
  return data.data
}

export const completeUpload = async (uploadId: number) => {
  const { data } = await api.post(`/uploads/complete/${uploadId}`)
  return data.data
}

export const completeAvatarUpload = async (uploadId: number): Promise<User> => {
  const { data } = await api.patch('/users/avatar/complete', {
    uploadId,
  })
  return data.data
}

export const directUploadAvatar = async (
  file: File,
): Promise<{ uploadId: number; fileKey: string }> => {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('category', 'AVATAR')
  formData.append('contextId', String(useUserStore.getState().user?.id))
  formData.append('fileName', file.name)
  formData.append('contentType', file.type)

  const { data } = await api.post('/uploads/direct', formData)
  return data.data
}

export const onboardUser = async ({
  workspaceName,
  description,
}: {
  workspaceName: string
  description: string
}): Promise<GetWorkspaceDTO> => {
  const { data } = await api.post('/users/onboarding', {
    workspaceName,
    description,
  })
  return data.data
}
