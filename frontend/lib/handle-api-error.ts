import { toast } from 'sonner'
import axios from 'axios'

export function handleApiError(error: unknown) {
  if (axios.isAxiosError(error)) {
    const message =
      error.response?.data?.message ||
      "Something went wrong"

    const requestId = error.response?.data?.requestId

    toast.error(message)

    if (requestId) {
      console.error("Request ID:", requestId)
    }

    return
  }

  toast.error("Unexpected error occurred")
}
