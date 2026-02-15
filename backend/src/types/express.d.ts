import type { RequestUser } from "./types.ts"

declare global {
  namespace Express {
    interface Request {
      id?: string
    }

    interface User extends RequestUser {}
  }
}

export {}
