import type { Application } from 'express'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import cookieParser from 'cookie-parser'
import { errorHandler } from './middlewares/errorHandler.ts'
import { requestIdMiddleware } from './middlewares/requestId.middleware.ts'
import { requestLoggerMiddleware } from './middlewares/requestLoggerMiddleware.ts'
import googleAuthRouter from './modules/auth/routes/google.routes.ts'
import githubAuthRouter from './modules/auth/routes/github.routes.ts'
import googlePassport from './modules/auth/providers/google.provider.ts'
import githubPassport from './modules/auth/providers/github.provider.ts'

const app: Application = express()

app.use(requestIdMiddleware)
app.use(requestLoggerMiddleware)

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  }),
)

app.use(helmet())
app.use(express.urlencoded({ extended: true }))
app.use(express.json({ limit: '16kb' }))
app.use(express.static('public'))
app.use(cookieParser())
app.use(googlePassport.initialize())
app.use(githubPassport.initialize())

app.use('/api/v1/auth', googleAuthRouter)
app.use('/api/v1/auth', githubAuthRouter)

app.use(errorHandler)

export { app }
