import type { Prisma } from "../../generated/prisma/client.ts"
import type { CreateActivityInput } from "../../types/activityLog.type.ts"

export const createActivityLog = (
  tx: Prisma.TransactionClient,
  input: CreateActivityInput
) => {
  return tx.activityLog.create({
    data: input,
  })
}