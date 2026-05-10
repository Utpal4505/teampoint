import { useMutation, useQuery } from '@tanstack/react-query'
import { validateInviteToken, acceptInvite } from './api'


export const useValidateInvite = (tokenId: string, token: string) => {
  return useQuery({
    queryKey: ['invite', 'validate', tokenId, token],
    queryFn: () => validateInviteToken(tokenId, token),
    enabled: !!tokenId && !!token,
    retry: false,
    staleTime: 1000 * 60 * 5,
  })
}


export const useAcceptInvite = () => {
  return useMutation({
    mutationFn: ({ tokenId, token }: { tokenId: number; token: string }) =>
      acceptInvite(tokenId, token),
  })
}
