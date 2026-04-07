export interface User {
  id: string
  email: string
  full_name?: string
  avatar_url?: string
  created_at: string
}

export interface Address {
  id: string
  user_id: string
  full_name: string
  line1: string
  line2?: string
  city: string
  state: string
  postal_code: string
  country: string
  is_default: boolean
}
