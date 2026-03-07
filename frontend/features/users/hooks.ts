import { useMutation, useQuery } from '@tanstack/react-query'
import { getCurrentUser, onboardUser } from './api'

export const useCurrentUser = () => {
  return useQuery({
    queryKey: ['current-user'],
    queryFn: getCurrentUser,
    retry: false,
    staleTime: 1000 * 60 * 5,
  })
}

export const useOnboardUser = () => {
  return useMutation({
    mutationFn: onboardUser,
  })
}