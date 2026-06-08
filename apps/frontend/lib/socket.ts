import { io, type Socket } from 'socket.io-client'

let socket: Socket | null = null

const SOCKET_API_SUFFIX = /\/api\/v1\/?$/

export const getSocketBaseUrl = () => {
  const explicitUrl = process.env.NEXT_PUBLIC_SOCKET_URL

  if (explicitUrl) {
    return explicitUrl
  }

  const apiUrl = process.env.NEXT_PUBLIC_API_URL

  if (!apiUrl) {
    return 'http://localhost:8000'
  }

  return apiUrl.replace(SOCKET_API_SUFFIX, '')
}

export const getSocketClient = () => {
  if (typeof window === 'undefined') {
    throw new Error('Socket client can only be used in the browser')
  }

  if (!socket) {
    socket = io(getSocketBaseUrl(), {
      withCredentials: true,
      autoConnect: false,
      transports: ['websocket', 'polling'],
    })
  }

  return socket
}

export const connectSocket = () => {
  const client = getSocketClient()

  if (!client.connected) {
    client.connect()
  }

  return client
}

export const disconnectSocket = () => {
  if (!socket) return

  socket.disconnect()
  socket = null
}

export const joinProjectRoom = (projectId: number) => {
  const client = connectSocket()
  client.emit('project:join', projectId)
  return client
}

export const leaveProjectRoom = (projectId: number) => {
  socket?.emit('project:leave', projectId)
}

export const joinDiscussionRoom = (projectId: number, discussionId: number) => {
  const client = connectSocket()
  client.emit('discussion:join', { projectId, discussionId })
  return client
}

export const leaveDiscussionRoom = (discussionId: number) => {
  socket?.emit('discussion:leave', discussionId)
}
