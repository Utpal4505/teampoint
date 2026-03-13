'use client'

import { useState } from 'react'
import { MessageSquare, ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import FeedbackModal from '@/components/feedback/feedbackModal'

export default function FeedbackPage() {
  const [open, setOpen] = useState(false)
  const router = useRouter()

  return (
    <>
      <button
        onClick={() => router.back()}
        className="fixed top-5 left-5 z-40 flex items-center gap-2
          rounded-xl border border-border bg-card shadow-lg
          px-4 py-2.5 text-sm font-medium text-foreground
          hover:bg-accent transition-all duration-150"
      >
        <ArrowLeft size={15} />
        Back
      </button>

      <div className="flex min-h-screen items-center justify-center bg-background">
        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 rounded-xl border border-border bg-card
            px-4 py-2.5 text-sm font-medium text-foreground
            hover:bg-accent transition-colors duration-150"
        >
          <MessageSquare size={15} />
          Give Feedback
        </button>

        <FeedbackModal open={open} onClose={() => setOpen(false)} />
      </div>
    </>
  )
}
