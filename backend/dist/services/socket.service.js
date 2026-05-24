import jwt from 'jsonwebtoken';
import { Server, Socket } from 'socket.io';
import { prisma } from '../config/db.config.js';
import { env } from '../config/env.js';
import { assertProjectMember } from '../utils/assertProjectMember.js';
let io = null;
const parseCookies = (cookieHeader) => {
    if (!cookieHeader)
        return {};
    return cookieHeader
        .split(';')
        .map(part => part.trim())
        .filter(Boolean)
        .reduce((acc, cookie) => {
        const [key, ...valueParts] = cookie.split('=');
        if (!key)
            return acc;
        acc[key] = decodeURIComponent(valueParts.join('='));
        return acc;
    }, {});
};
const extractToken = (socket) => {
    const authPayload = socket.handshake.auth;
    if (authPayload?.token)
        return authPayload.token;
    const authorizationHeader = socket.handshake.headers.authorization;
    if (authorizationHeader?.startsWith('Bearer ')) {
        return authorizationHeader.slice(7);
    }
    const cookies = parseCookies(socket.handshake.headers.cookie);
    return cookies.accessToken ?? null;
};
const authenticateSocketUser = async (socket) => {
    const token = extractToken(socket);
    if (!token) {
        throw new Error('Socket authentication failed: token missing');
    }
    const decoded = jwt.verify(token, env.ACCESS_TOKEN_SECRET);
    const user = await prisma.user.findUnique({
        where: { id: decoded.id },
        select: {
            id: true,
            email: true,
            status: true,
            is_new: true,
        },
    });
    if (!user || user.status === 'INACTIVE') {
        throw new Error('Socket authentication failed: user not found');
    }
    return {
        id: user.id,
        email: user.email,
        is_new: user.is_new,
    };
};
export const getProjectRoom = (projectId) => `project:${projectId}`;
export const getDiscussionRoom = (discussionId) => `discussion:${discussionId}`;
const assertDiscussionAccess = async (projectId, discussionId, userId) => {
    await assertProjectMember(projectId, userId);
    const discussion = await prisma.discussion.findFirst({
        where: {
            id: discussionId,
            projectId,
        },
        select: {
            id: true,
        },
    });
    if (!discussion) {
        throw new Error('Discussion not found');
    }
};
export const initializeSocketServer = (server) => {
    if (io)
        return io;
    io = new Server(server, {
        cors: {
            origin: env.CORS_ORIGIN,
            credentials: true,
        },
    });
    io.use(async (socket, next) => {
        try {
            const user = await authenticateSocketUser(socket);
            socket.data.user = user;
            next();
        }
        catch (error) {
            next(error);
        }
    });
    io.on('connection', socket => {
        const authedSocket = socket;
        socket.on('project:join', async (projectId) => {
            try {
                await assertProjectMember(projectId, authedSocket.data.user.id);
                socket.join(getProjectRoom(projectId));
            }
            catch {
                socket.emit('socket:error', {
                    code: 'PROJECT_JOIN_FAILED',
                    message: 'Unable to join project room',
                });
            }
        });
        socket.on('project:leave', (projectId) => {
            socket.leave(getProjectRoom(projectId));
        });
        socket.on('discussion:join', async ({ projectId, discussionId }) => {
            try {
                await assertDiscussionAccess(projectId, discussionId, authedSocket.data.user.id);
                socket.join(getDiscussionRoom(discussionId));
            }
            catch {
                socket.emit('socket:error', {
                    code: 'DISCUSSION_JOIN_FAILED',
                    message: 'Unable to join discussion room',
                });
            }
        });
        socket.on('discussion:leave', (discussionId) => {
            socket.leave(getDiscussionRoom(discussionId));
        });
    });
    return io;
};
export const getIO = () => {
    if (!io) {
        throw new Error('Socket server has not been initialized');
    }
    return io;
};
export const emitToProjectRoom = (projectId, event, payload) => {
    getIO().to(getProjectRoom(projectId)).emit(event, payload);
};
export const emitToDiscussionRoom = (discussionId, event, payload) => {
    getIO().to(getDiscussionRoom(discussionId)).emit(event, payload);
};
//# sourceMappingURL=socket.service.js.map