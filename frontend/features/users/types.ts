export interface User {
  id: number
  fullName: string
  avatarUrl: string | null
  status: 'ACTIVE' | 'INACTIVE' | 'BANNED'
  is_new: boolean
  created_at: Date
}
