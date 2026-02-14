import type { RequestUser } from './auth.type.ts'

declare global {
  namespace Express {
    interface Request {
      id?: string
    }

    interface User extends RequestUser {}
  }
}

export {}
