import type { Server as HttpServer } from 'node:http'
import jwt from 'jsonwebtoken'
import { Server, Socket } from 'socket.io'
import { prisma } from '../config/db.config.ts'
import { env } from '../config/env.ts'
import type { jwtPayload, RequestUser } from '../types/types.ts'
import { assertProjectMember } from '../utils/assertProjectMember.ts'

type SocketAuthPayload = {
  token?: string
}

type AuthedSocket = Socket<
  Record<string, never>,
  Record<string, never>,
  Record<string, never>,
  { user: RequestUser }
>

let io: Server | null = null

const parseCookies = (cookieHeader?: string): Record<string, string> => {
  if (!cookieHeader) return {}

  return cookieHeader
    .split(';')
    .map(part => part.trim())
    .filter(Boolean)
    .reduce<Record<string, string>>((acc, cookie) => {
      const [key, ...valueParts] = cookie.split('=')

      if (!key) return acc

      acc[key] = decodeURIComponent(valueParts.join('='))
      return acc
    }, {})
}

const extractToken = (socket: Socket): string | null => {
  const authPayload = socket.handshake.auth as SocketAuthPayload | undefined

  if (authPayload?.token) return authPayload.token

  const authorizationHeader = socket.handshake.headers.authorization

  if (authorizationHeader?.startsWith('Bearer ')) {
    return authorizationHeader.slice(7)
  }

  const cookies = parseCookies(socket.handshake.headers.cookie)
  return cookies.accessToken ?? null
}

const authenticateSocketUser = async (socket: Socket): Promise<RequestUser> => {
  const token = extractToken(socket)

  if (!token) {
    throw new Error('Socket authentication failed: token missing')
  }

  const decoded = jwt.verify(token, env.ACCESS_TOKEN_SECRET) as jwtPayload

  const user = await prisma.user.findUnique({
    where: { id: decoded.id },
    select: {
      id: true,
      email: true,
      status: true,
      is_new: true,
    },
  })

  if (!user || user.status === 'INACTIVE') {
    throw new Error('Socket authentication failed: user not found')
  }

  return {
    id: user.id,
    email: user.email,
    is_new: user.is_new,
  }
}

export const getProjectRoom = (projectId: number) => `project:${projectId}`

export const getDiscussionRoom = (discussionId: number) =>
  `discussion:${discussionId}`

const assertDiscussionAccess = async (
  projectId: number,
  discussionId: number,
  userId: number,
) => {
  await assertProjectMember(projectId, userId)

  const discussion = await prisma.discussion.findFirst({
    where: {
      id: discussionId,
      projectId,
    },
    select: {
      id: true,
    },
  })

  if (!discussion) {
    throw new Error('Discussion not found')
  }
}

export const initializeSocketServer = (server: HttpServer) => {
  if (io) return io

  io = new Server(server, {
    cors: {
      origin: env.CORS_ORIGIN,
      credentials: true,
    },
  })

  io.use(async (socket, next) => {
    try {
      const user = await authenticateSocketUser(socket)
      ;(socket as AuthedSocket).data.user = user
      next()
    } catch (error) {
      next(error as Error)
    }
  })

  io.on('connection', socket => {
    const authedSocket = socket as AuthedSocket

    socket.on('project:join', async (projectId: number) => {
      try {
        await assertProjectMember(projectId, authedSocket.data.user.id)
        socket.join(getProjectRoom(projectId))
      } catch {
        socket.emit('socket:error', {
          code: 'PROJECT_JOIN_FAILED',
          message: 'Unable to join project room',
        })
      }
    })

    socket.on('project:leave', (projectId: number) => {
      socket.leave(getProjectRoom(projectId))
    })

    socket.on(
      'discussion:join',
      async ({ projectId, discussionId }: { projectId: number; discussionId: number }) => {
        try {
          await assertDiscussionAccess(
            projectId,
            discussionId,
            authedSocket.data.user.id,
          )
          socket.join(getDiscussionRoom(discussionId))
        } catch {
          socket.emit('socket:error', {
            code: 'DISCUSSION_JOIN_FAILED',
            message: 'Unable to join discussion room',
          })
        }
      },
    )

    socket.on('discussion:leave', (discussionId: number) => {
      socket.leave(getDiscussionRoom(discussionId))
    })
  })

  return io
}

export const getIO = () => {
  if (!io) {
    throw new Error('Socket server has not been initialized')
  }

  return io
}

export const emitToProjectRoom = (
  projectId: number,
  event: string,
  payload: unknown,
) => {
  getIO().to(getProjectRoom(projectId)).emit(event, payload)
}

export const emitToDiscussionRoom = (
  discussionId: number,
  event: string,
  payload: unknown,
) => {
  getIO().to(getDiscussionRoom(discussionId)).emit(event, payload)
}
