import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { listIntegrations, initiateIntegration, disconnectIntegration } from './api'
import type { IntegrationProvider } from './types'
import { toast } from 'sonner'
import { handleApiError } from '@/lib/handle-api-error'

export const useListIntegrations = () => {
  return useQuery({
    queryKey: ['integrations', 'list'],
    queryFn: listIntegrations,
  })
}

export const useInitiateIntegration = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      provider,
      workspaceId,
    }: {
      provider: IntegrationProvider
      workspaceId: number
    }) => initiateIntegration(provider, workspaceId),
    onSuccess: data => {
      if (data.authorizationUrl) {
        window.location.href = data.authorizationUrl
      }
    },
    onError: handleApiError,
  })
}

export const useDisconnectIntegration = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (provider: IntegrationProvider) => disconnectIntegration(provider),
    onSuccess: (data, provider) => {
      toast.success(`${provider} disconnected`, {
        description: 'Integration has been removed.',
      })
      queryClient.invalidateQueries({ queryKey: ['integrations'] })
    },
    onError: handleApiError,
  })
}
