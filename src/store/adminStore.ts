import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AdminState {
  isAuthenticated: boolean
  login: (password: string) => boolean
  logout: () => void
}

// Change this to whatever password you want
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD ?? 'voltz-admin-2025'

export const useAdminStore = create<AdminState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      login: (password) => {
        if (password === ADMIN_PASSWORD) {
          set({ isAuthenticated: true })
          return true
        }
        return false
      },
      logout: () => set({ isAuthenticated: false }),
    }),
    { name: 'voltz-admin' }
  )
)
