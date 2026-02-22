import { ApiError } from "./apiError.ts";

export function ensureExists<T>(
  value: T | null | undefined,
  entityName: string
): asserts value is T {
  if (value == null) {
    throw new ApiError(404, `${entityName} not found`)
  }
}
