// import { useState } from 'react'
// import { useForm } from 'react-hook-form'
// import {
//   Search, Plus, Download, Filter, Edit2, Trash2, Eye,
//   Loader2, X, UserPlus,
// } from 'lucide-react'
// import { useUsers, useCreateUser, useDeleteUser } from '../../hooks/useUsers'
// import { cn, getInitials, formatDate } from '../../lib/utils'
// import Badge from '../../components/ui/Badge'
// import Modal from '../../components/ui/Model'
// import { PageLoader } from '../../components/ui/Loader'
// import toast from 'react-hot-toast'

// const STATUS_VARIANT = { active: 'success', inactive: 'default', pending: 'warning' }
// const ROLE_VARIANT   = { Admin: 'brand', Editor: 'info', Viewer: 'default' }

// function UserRow({ user, onDelete }) {
//   return (
//     <tr className="hover:bg-surface-50/70 transition-colors group animate-slide-up">
//       {/* User */}
//       <td className="table-cell">
//         <div className="flex items-center gap-3">
//           <div className="w-9 h-9 rounded-full bg-brand-100 flex items-center justify-center shrink-0">
//             <span className="text-brand-700 text-sm font-semibold font-body">
//               {getInitials(user.name)}
//             </span>
//           </div>
//           <div className="min-w-0">
//             <p className="text-sm font-medium text-surface-900 font-body truncate">{user.name}</p>
//             <p className="text-xs text-surface-400 font-body truncate">{user.email}</p>
//           </div>
//         </div>
//       </td>
//       {/* Role */}
//       <td className="table-cell">
//         <Badge variant={ROLE_VARIANT[user.role]}>{user.role}</Badge>
//       </td>
//       {/* Status */}
//       <td className="table-cell">
//         <Badge variant={STATUS_VARIANT[user.status]} dot>{user.status}</Badge>
//       </td>
//       {/* Joined */}
//       <td className="table-cell text-surface-500">{user.joined}</td>
//       {/* Actions */}
//       <td className="table-cell">
//         <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
//           <button className="p-1.5 rounded-lg hover:bg-surface-100 text-surface-400 hover:text-blue-500 transition-colors">
//             <Eye size={14} />
//           </button>
//           <button className="p-1.5 rounded-lg hover:bg-surface-100 text-surface-400 hover:text-surface-600 transition-colors">
//             <Edit2 size={14} />
//           </button>
//           <button
//             onClick={() => onDelete(user.id)}
//             className="p-1.5 rounded-lg hover:bg-red-50 text-surface-400 hover:text-red-500 transition-colors"
//           >
//             <Trash2 size={14} />
//           </button>
//         </div>
//       </td>
//     </tr>
//   )
// }

// function AddUserModal({ open, onClose }) {
//   const { mutate: createUser, isPending } = useCreateUser()
//   const { register, handleSubmit, reset, formState: { errors } } = useForm()

//   const onSubmit = (data) => {
//     createUser(data, { onSuccess: () => { reset(); onClose() } })
//   }

//   return (
//     <Modal open={open} onClose={onClose} title="Add New User">
//       <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
//         <div className="grid grid-cols-2 gap-4">
//           <div className="space-y-1.5">
//             <label className="text-sm font-medium text-surface-700 font-body">Full Name</label>
//             <input
//               className="input"
//               placeholder="John Doe"
//               {...register('name', { required: 'Required' })}
//             />
//             {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
//           </div>
//           <div className="space-y-1.5">
//             <label className="text-sm font-medium text-surface-700 font-body">Role</label>
//             <select className="input" {...register('role')}>
//               <option>Admin</option>
//               <option>Editor</option>
//               <option>Viewer</option>
//             </select>
//           </div>
//         </div>
//         <div className="space-y-1.5">
//           <label className="text-sm font-medium text-surface-700 font-body">Email</label>
//           <input
//             type="email"
//             className="input"
//             placeholder="user@shridha.com"
//             {...register('email', {
//               required: 'Required',
//               pattern: { value: /\S+@\S+\.\S+/, message: 'Invalid email' },
//             })}
//           />
//           {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
//         </div>
//         <div className="space-y-1.5">
//           <label className="text-sm font-medium text-surface-700 font-body">Password</label>
//           <input
//             type="password"
//             className="input"
//             placeholder="Min 6 characters"
//             {...register('password', { required: 'Required', minLength: { value: 6, message: 'Min 6 chars' } })}
//           />
//           {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
//         </div>
//         <div className="flex gap-3 pt-2">
//           <button type="button" onClick={onClose} className="btn-ghost flex-1 border border-surface-200">
//             Cancel
//           </button>
//           <button type="submit" disabled={isPending} className="btn-primary flex-1">
//             {isPending ? <Loader2 size={14} className="animate-spin" /> : <UserPlus size={14} />}
//             {isPending ? 'Creating…' : 'Create User'}
//           </button>
//         </div>
//       </form>
//     </Modal>
//   )
// }

// export default function UsersPage() {
//   const [search, setSearch]   = useState('')
//   const [addOpen, setAddOpen] = useState(false)
//   const [page, setPage]       = useState(1)

//   const { data: users, isLoading } = useUsers()
//   const { mutate: deleteUser }     = useDeleteUser()

//   const filtered = users?.filter(
//     (u) =>
//       u.name.toLowerCase().includes(search.toLowerCase()) ||
//       u.email.toLowerCase().includes(search.toLowerCase())
//   )

//   const handleDelete = (id) => {
//     if (window.confirm('Delete this user?')) deleteUser(id)
//   }

//   return (
//     <div className="space-y-6">
//       {/* ── Header ── */}
//       <div className="flex items-start justify-between">
//         <div>
//           <h1 className="page-title">Users</h1>
//           <p className="page-subtitle">
//             Manage your platform users and their permissions.
//           </p>
//         </div>
//         <button onClick={() => setAddOpen(true)} className="btn-primary">
//           <Plus size={15} /> Add User
//         </button>
//       </div>

//       {/* ── Filters ── */}
//       <div className="card !p-4 flex flex-wrap items-center gap-3">
//         <div className="relative flex-1 min-w-52">
//           <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400 pointer-events-none" />
//           <input
//             value={search}
//             onChange={(e) => { setSearch(e.target.value); setPage(1) }}
//             placeholder="Search by name or email…"
//             className="input pl-9"
//           />
//           {search && (
//             <button
//               onClick={() => setSearch('')}
//               className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-600"
//             >
//               <X size={13} />
//             </button>
//           )}
//         </div>
//         <button className="btn-ghost border border-surface-200">
//           <Filter size={14} /> Filter
//         </button>
//         <button className="btn-ghost border border-surface-200">
//           <Download size={14} /> Export
//         </button>
//       </div>

//       {/* ── Table ── */}
//       <div className="card !p-0 overflow-hidden">
//         {isLoading ? (
//           <PageLoader />
//         ) : (
//           <>
//             <div className="overflow-x-auto">
//               <table className="w-full">
//                 <thead>
//                   <tr className="border-b border-surface-100 bg-surface-50/60">
//                     <th className="table-header">User</th>
//                     <th className="table-header">Role</th>
//                     <th className="table-header">Status</th>
//                     <th className="table-header">Joined</th>
//                     <th className="table-header text-right">Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-surface-50">
//                   {filtered?.length ? (
//                     filtered.map((user) => (
//                       <UserRow key={user.id} user={user} onDelete={handleDelete} />
//                     ))
//                   ) : (
//                     <tr>
//                       <td colSpan={5} className="px-6 py-16 text-center">
//                         <p className="text-surface-400 font-body text-sm">No users found.</p>
//                       </td>
//                     </tr>
//                   )}
//                 </tbody>
//               </table>
//             </div>

//             {/* Pagination */}
//             <div className="px-6 py-4 border-t border-surface-100 flex items-center justify-between">
//               <p className="text-sm text-surface-500 font-body">
//                 <span className="font-medium text-surface-700">{filtered?.length ?? 0}</span> users
//               </p>
//               <div className="flex items-center gap-1">
//                 {[1, 2, 3].map((p) => (
//                   <button
//                     key={p}
//                     onClick={() => setPage(p)}
//                     className={cn(
//                       'w-8 h-8 rounded-lg text-sm font-medium font-body transition-colors',
//                       page === p
//                         ? 'bg-brand-500 text-white'
//                         : 'hover:bg-surface-100 text-surface-600'
//                     )}
//                   >
//                     {p}
//                   </button>
//                 ))}
//               </div>
//             </div>
//           </>
//         )}
//       </div>

//       {/* ── Add user modal ── */}
//       <AddUserModal open={addOpen} onClose={() => setAddOpen(false)} />
//     </div>
//   )
// }

import React from 'react'

const UsersPage = () => {
  return (
    <div>
      user page
    </div>
  )
}

export default UsersPage
