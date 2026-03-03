import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../lib/api'
import { sleep } from '../lib/utils'
import toast from 'react-hot-toast'

const MOCK_USERS = [
  { id: 1,  name: 'Priya Sharma',  email: 'priya@shridha.com',  role: 'Admin',  status: 'active',   joined: '2024-01-15' },
  { id: 2,  name: 'Rahul Verma',   email: 'rahul@shridha.com',  role: 'Editor', status: 'active',   joined: '2024-02-20' },
  { id: 3,  name: 'Anjali Patel',  email: 'anjali@shridha.com', role: 'Viewer', status: 'inactive', joined: '2024-03-05' },
  { id: 4,  name: 'Karan Singh',   email: 'karan@shridha.com',  role: 'Editor', status: 'active',   joined: '2024-03-10' },
  { id: 5,  name: 'Meera Joshi',   email: 'meera@shridha.com',  role: 'Viewer', status: 'pending',  joined: '2024-04-01' },
  { id: 6,  name: 'Arjun Nair',    email: 'arjun@shridha.com',  role: 'Admin',  status: 'active',   joined: '2024-04-15' },
  { id: 7,  name: 'Sneha Reddy',   email: 'sneha@shridha.com',  role: 'Editor', status: 'active',   joined: '2024-05-03' },
  { id: 8,  name: 'Dev Malhotra',  email: 'dev@shridha.com',    role: 'Viewer', status: 'inactive', joined: '2024-05-20' },
  { id: 9,  name: 'Pooja Iyer',    email: 'pooja@shridha.com',  role: 'Editor', status: 'active',   joined: '2024-06-01' },
  { id: 10, name: 'Vikram Gupta',  email: 'vikram@shridha.com', role: 'Viewer', status: 'pending',  joined: '2024-06-18' },
]

// ─── Queries ────────────────────────────────────────────────

export function useUsers(params = {}) {
  return useQuery({
    queryKey: ['users', params],
    queryFn: async () => {
      await sleep(600)
      return MOCK_USERS
      // Real: const { data } = await api.get('/users', { params }); return data
    },
  })
}

export function useUser(id) {
  return useQuery({
    queryKey: ['users', id],
    queryFn: async () => {
      await sleep(400)
      return MOCK_USERS.find((u) => u.id === id) ?? null
      // Real: const { data } = await api.get(`/users/${id}`); return data
    },
    enabled: !!id,
  })
}

// ─── Mutations ──────────────────────────────────────────────

export function useCreateUser() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (payload) => {
      await sleep(800)
      return { id: Date.now(), ...payload }
      // Real: const { data } = await api.post('/users', payload); return data
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['users'] })
      toast.success('User created successfully!')
    },
    onError: (err) =>
      toast.error(err?.response?.data?.message || 'Failed to create user'),
  })
}

export function useUpdateUser() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, ...payload }) => {
      await sleep(800)
      return { id, ...payload }
      // Real: const { data } = await api.put(`/users/${id}`, payload); return data
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['users'] })
      toast.success('User updated!')
    },
    onError: (err) =>
      toast.error(err?.response?.data?.message || 'Failed to update user'),
  })
}

export function useDeleteUser() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id) => {
      await sleep(600)
      return { id }
      // Real: await api.delete(`/users/${id}`)
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['users'] })
      toast.success('User deleted.')
    },
    onError: (err) =>
      toast.error(err?.response?.data?.message || 'Failed to delete user'),
  })
}