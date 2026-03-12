'use client'

import FeedbackModal from '@/components/feedback/page'
import { useState } from 'react'

export default function FeedbackPage() {
  const [open, setOpen] = useState(true)

  return (
    <FeedbackModal
      open={open}
      onClose={() => setOpen(false)}
    />
  )
}