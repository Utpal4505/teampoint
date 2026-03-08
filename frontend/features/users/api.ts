import api from '@/lib/api'
import { User } from './types'
import { AxiosRequestConfig } from 'axios'
import { GetWorkspaceDTO } from '../workspace/types'

interface CustomAxiosRequestConfig extends AxiosRequestConfig {
  authFlag?: boolean
}

export const getCurrentUser = async (): Promise<User> => {
  const { data } = await api.get('/users/me', {
    authFlag: true,
  } as CustomAxiosRequestConfig)

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
