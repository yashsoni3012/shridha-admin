import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useAuthStore = create(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      user: null,
      token: null,

      login: (user, token) =>
        set({ isAuthenticated: true, user, token }),

      logout: () =>
        set({ isAuthenticated: false, user: null, token: null }),

      updateUser: (updates) =>
        set((state) => ({ user: { ...state.user, ...updates } })),

      getToken: () => get().token,
    }),
    {
      name: 'shridha-auth',
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        user: state.user,
        token: state.token,
      }),
    }
  )
)