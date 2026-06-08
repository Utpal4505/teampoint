export interface User {
  id: number
  fullName: string
  avatarUrl: string | null
  email: string
  status: 'ACTIVE' | 'INACTIVE' | 'BANNED'
  is_new: boolean
  created_at: Date
}
