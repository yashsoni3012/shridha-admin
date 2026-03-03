import { useMutation } from '@tanstack/react-query'
import { useAuthStore } from '../store/authStore'
import { api } from '../lib/api'
import { sleep } from '../lib/utils'
import toast from 'react-hot-toast'

/**
 * Login mutation — swap mock with real API call when ready
 */
export function useLogin() {
  const login = useAuthStore((s) => s.login)

  return useMutation({
    mutationFn: async ({ email, password }) => {
      // ── MOCK ── remove below and uncomment real call
      await sleep(1200)
      if (email === 'admin@shridha.com' && password === 'admin123') {
        return {
          user: {
            id: 1,
            name: 'Admin User',
            email,
            role: 'Super Admin',
            avatar: null,
          },
          token: 'mock-jwt-token-xyz',
        }
      }
      throw new Error('Invalid email or password')

      // ── REAL ──
      // const { data } = await api.post('/auth/login', { email, password })
      // return data
    },
    onSuccess: ({ user, token }) => {
      login(user, token)
      toast.success(`Welcome back, ${user.name}!`)
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || err.message || 'Login failed')
    },
  })
}

/**
 * Logout helper
 */
export function useLogout() {
  const logout = useAuthStore((s) => s.logout)
  return () => {
    logout()
    toast.success('Logged out successfully')
  }
}

/**
 * Current user from store
 */
export function useCurrentUser() {
  return useAuthStore((s) => s.user)
}