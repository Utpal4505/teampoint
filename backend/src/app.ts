import type { Application } from 'express'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import cookieParser from 'cookie-parser'
import swaggerUi from 'swagger-ui-express'
import { swaggerSpec } from './config/swagger.ts'
import { errorHandler } from './middlewares/errorHandler.ts'
import { requestIdMiddleware } from './middlewares/requestId.middleware.ts'
import { requestLoggerMiddleware } from './middlewares/requestLoggerMiddleware.ts'
import {
  globalLimiter,
  authLimiter,
  uploadLimiter,
  apiLimiter,
  integrationLimiter,
} from './middlewares/rateLimiters.ts'
import googleAuthRouter from './modules/auth/routes/google.route.ts'
import githubAuthRouter from './modules/auth/routes/github.route.ts'
import refreshAuthRouter from './modules/auth/routes/refresh.route.ts'
import devAuthRouter from './modules/auth/routes/auth.dev.route.ts'
import googlePassport from './modules/auth/providers/google.provider.ts'
import githubPassport from './modules/auth/providers/github.provider.ts'
import { hardAuth, restrictNewUserRoutes } from './middlewares/auth.middlewares.ts'
import userRouter from './modules/user/user.route.ts'
import workspaceRouter from './modules/workspace/workspace.route.ts'
import workspaceInviteRouter from './modules/inviteMember/inviteMember.route.ts'
import uploadRouter from './modules/upload/upload.routes.ts'
import projectRouter from './modules/project/project.route.ts'
import projectMemberRouter from './modules/projectMember/projectMember.route.ts'
import taskRouter from './modules/tasks/task.route.ts'
import documentRouter from './modules/document/document.route.ts'
import documentLinkRouter from './modules/documentLinks/documentLinks.route.ts'
import goalRouter from './modules/goal/goal.route.ts'
import milestoneRouter from './modules/milestone/milestone.route.ts'
import workspaceLeaveRouter from './modules/workspaceLeave/workspaceLeave.route.ts'
import integrationRouter from './modules/integration/integration.routes.ts'
import meetingRouter from './modules/meeting/meeting.route.ts'

import { env } from './config/env.ts'

const app: Application = express()

app.use(requestIdMiddleware)
app.use(requestLoggerMiddleware)

app.use(globalLimiter)

app.use(
  cors({
    origin: env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
  }),
)

app.use(helmet())
app.use(express.urlencoded({ extended: true }))
app.use(express.json({ limit: '16kb' }))
app.use(express.static('public'))
app.use(cookieParser())
app.use(googlePassport.initialize())
app.use(githubPassport.initialize())

app.use('/api/v1/auth', authLimiter, googleAuthRouter)
app.use('/api/v1/auth', authLimiter, githubAuthRouter)
app.use('/api/v1/auth', authLimiter, refreshAuthRouter)
app.use('/api/v1/auth', authLimiter, devAuthRouter)

app.use('/api/v1/integrations', integrationLimiter, integrationRouter)

app.use('/api/v1', hardAuth, restrictNewUserRoutes, apiLimiter)
app.use('/api/v1/users', userRouter)
app.use('/api/v1/workspaces', workspaceRouter)
app.use('/api/v1/workspaces', workspaceInviteRouter)
app.use('/api/v1/uploads', uploadLimiter, uploadRouter)
app.use('/api/v1/projects', projectRouter)
app.use('/api/v1/projects', projectMemberRouter)
app.use('/api/v1/projects/:projectId/tasks', taskRouter)
app.use('/api/v1/projects/:projectId/documents', documentRouter)
app.use('/api/v1/projects/:projectId/document-links', documentLinkRouter)
app.use('/api/v1/projects/:projectId/goals', goalRouter)
app.use('/api/v1/projects/:projectId/milestones', milestoneRouter)
app.use('/api/v1/workspaces/:workspaceId/leave-requests', workspaceLeaveRouter)
app.use('/api/v1/projects/:projectId/meetings', meetingRouter)

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

app.get('/health', (_req, res) => {
  res.status(200).json({ message: 'Server running' })
})

app.use(errorHandler)

export { app }
