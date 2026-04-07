import { create } from 'zustand'
import type { User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'

interface AuthStore {
  user: User | null
  isLoading: boolean
  isAuthModalOpen: boolean
  authModalView: 'login' | 'signup'

  setUser: (user: User | null) => void
  setLoading: (loading: boolean) => void
  openAuthModal: (view?: 'login' | 'signup') => void
  closeAuthModal: () => void
  signOut: () => Promise<void>
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isLoading: true,
  isAuthModalOpen: false,
  authModalView: 'login',

  setUser: (user) => set({ user }),
  setLoading: (isLoading) => set({ isLoading }),

  openAuthModal: (view = 'login') =>
    set({ isAuthModalOpen: true, authModalView: view }),
  closeAuthModal: () => set({ isAuthModalOpen: false }),

  signOut: async () => {
    await supabase.auth.signOut()
    set({ user: null })
  },
}))
