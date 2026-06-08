'use client'

import { useEffect, useMemo } from 'react'
import {
  connectSocket,
  disconnectSocket,
  getSocketClient,
  joinDiscussionRoom,
  joinProjectRoom,
  leaveDiscussionRoom,
  leaveProjectRoom,
} from '@/lib/socket'

interface UseSocketOptions {
  autoConnect?: boolean
  projectId?: number
  discussionId?: number
  disconnectOnUnmount?: boolean
}

export function useSocket({
  autoConnect = true,
  projectId,
  discussionId,
  disconnectOnUnmount = false,
}: UseSocketOptions = {}) {
  const socket = useMemo(() => {
    if (typeof window === 'undefined') return null

    return getSocketClient()
  }, [])

  useEffect(() => {
    if (!autoConnect || !socket) return

    connectSocket()

    if (projectId && !discussionId) {
      joinProjectRoom(projectId)
    }

    if (projectId && discussionId) {
      joinDiscussionRoom(projectId, discussionId)
    }

    return () => {
      if (discussionId) {
        leaveDiscussionRoom(discussionId)
      }

      if (projectId && !discussionId) {
        leaveProjectRoom(projectId)
      }

      if (disconnectOnUnmount) {
        disconnectSocket()
      }
    }
  }, [autoConnect, discussionId, disconnectOnUnmount, projectId, socket])

  return socket
}
