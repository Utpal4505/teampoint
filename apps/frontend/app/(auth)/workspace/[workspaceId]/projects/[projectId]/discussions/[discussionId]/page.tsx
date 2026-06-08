'use client'

import { useParams } from 'next/navigation'
import { DiscussionDetailPage } from '@/components/projects/detail/tabs/discussions'

export default function ProjectDiscussionDetailRoute() {
  const params = useParams<{ discussionId: string }>()
  const discussionId = Number(params.discussionId)

  return <DiscussionDetailPage discussionId={discussionId} />
}
