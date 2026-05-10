import MembersPage from "@/components/members/memberspage"

export const metadata = { title: 'Members' }

export default async function Page({ params }: { params: Promise<{ workspaceId: string }> }) {
  const { workspaceId } = await params
  return <MembersPage workspaceId={workspaceId} />
}
