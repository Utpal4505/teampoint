import MeetingsPage from '@/components/meetings/meetingspage'

export const metadata = { title: 'Meetings' }

export default async function Page({
  params,
}: {
  params: Promise<{ workspaceId: string }>
}) {
  const { workspaceId } = await params
  return <MeetingsPage workspaceId={workspaceId} />
}
