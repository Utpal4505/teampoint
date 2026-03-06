import { useMutation } from '@tanstack/react-query'
import { sendWorkspaceInvite } from './api'

export const useSendWorkspaceInvite = () => {
  return useMutation({
    mutationFn: sendWorkspaceInvite,
  })
}