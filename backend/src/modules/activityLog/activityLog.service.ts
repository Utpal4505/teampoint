import type { Prisma } from "../../generated/prisma/client.js"
import type { CreateActivityInput } from "../../types/activityLog.type.js"

export const createActivityLog = (
  tx: Prisma.TransactionClient,
  input: CreateActivityInput
) => {
  return tx.activityLog.create({
    data: input,
  })
}