import "express";
import type { User as PrismaUser } from "../generated/prisma/client.ts";

declare global {
  namespace Express {
    interface Request {
      id?: string;
    }

    interface User extends PrismaUser {}
  }
}
