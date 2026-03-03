// import { useState } from 'react'
// import { useForm } from 'react-hook-form'
// import {
//   User, Lock, Bell, Globe, Save, Loader2, Camera, Eye, EyeOff,
// } from 'lucide-react'
// import { cn, getInitials } from '../../lib/utils'
// import { useAuthStore } from '../../store/authStore'
// import toast from 'react-hot-toast'

// const TABS = [
//   { id: 'profile',       label: 'Profile',       icon: User  },
//   { id: 'security',      label: 'Security',       icon: Lock  },
//   { id: 'notifications', label: 'Notifications',  icon: Bell  },
//   { id: 'general',       label: 'General',        icon: Globe },
// ]

// // ─── Profile Tab ────────────────────────────────────────────
// function ProfileTab() {
//   const user       = useAuthStore((s) => s.user)
//   const updateUser = useAuthStore((s) => s.updateUser)
//   const [saving, setSaving] = useState(false)

//   const { register, handleSubmit, formState: { isDirty } } = useForm({
//     defaultValues: {
//       name:  user?.name  ?? '',
//       email: user?.email ?? '',
//       phone: '',
//       bio:   '',
//     },
//   })

//   const onSubmit = async (data) => {
//     setSaving(true)
//     await new Promise((r) => setTimeout(r, 900))
//     updateUser({ name: data.name, email: data.email })
//     setSaving(false)
//     toast.success('Profile updated!')
//   }

//   return (
//     <form onSubmit={handleSubmit(onSubmit)} className="space-y-7 max-w-lg">
//       {/* Avatar */}
//       <div className="flex items-center gap-5">
//         <div className="relative">
//           <div className="w-20 h-20 rounded-2xl bg-brand-100 flex items-center justify-center ring-4 ring-brand-50">
//             <span className="text-brand-700 text-3xl font-display font-bold">
//               {getInitials(user?.name)}
//             </span>
//           </div>
//           <button
//             type="button"
//             className="absolute -bottom-1 -right-1 w-7 h-7 bg-brand-500 rounded-lg flex items-center justify-center shadow-brand hover:bg-brand-600 transition-colors"
//           >
//             <Camera size={13} className="text-white" />
//           </button>
//         </div>
//         <div>
//           <p className="text-sm font-medium text-surface-800 font-body">{user?.name}</p>
//           <p className="text-xs text-surface-400 font-body mt-0.5">{user?.role}</p>
//           <button
//             type="button"
//             className="text-xs text-brand-600 font-body mt-1.5 hover:text-brand-700 transition-colors"
//           >
//             Upload new photo
//           </button>
//         </div>
//       </div>

//       {/* Fields */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//         <div className="space-y-1.5">
//           <label className="text-sm font-medium text-surface-700 font-body">Full Name</label>
//           <input className="input" {...register('name', { required: true })} />
//         </div>
//         <div className="space-y-1.5">
//           <label className="text-sm font-medium text-surface-700 font-body">Email</label>
//           <input type="email" className="input" {...register('email', { required: true })} />
//         </div>
//         <div className="space-y-1.5">
//           <label className="text-sm font-medium text-surface-700 font-body">Role</label>
//           <input className="input bg-surface-50 cursor-not-allowed text-surface-500" value={user?.role ?? ''} readOnly />
//         </div>
//         <div className="space-y-1.5">
//           <label className="text-sm font-medium text-surface-700 font-body">Phone</label>
//           <input className="input" placeholder="+91 98000 00000" {...register('phone')} />
//         </div>
//       </div>
//       <div className="space-y-1.5">
//         <label className="text-sm font-medium text-surface-700 font-body">Bio</label>
//         <textarea
//           rows={3}
//           className="input resize-none"
//           placeholder="A short description about yourself…"
//           {...register('bio')}
//         />
//       </div>

//       <button type="submit" disabled={saving || !isDirty} className="btn-primary">
//         {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
//         {saving ? 'Saving…' : 'Save Changes'}
//       </button>
//     </form>
//   )
// }

// // ─── Security Tab ────────────────────────────────────────────
// function SecurityTab() {
//   const [show, setShow] = useState({ current: false, new: false, confirm: false })
//   const [saving, setSaving] = useState(false)
//   const toggle = (k) => setShow((v) => ({ ...v, [k]: !v[k] }))

//   const { register, handleSubmit, watch, reset, formState: { errors } } = useForm()
//   const newPass = watch('newPassword')

//   const onSubmit = async () => {
//     setSaving(true)
//     await new Promise((r) => setTimeout(r, 900))
//     setSaving(false)
//     reset()
//     toast.success('Password changed!')
//   }

//   const Field = ({ label, name, show: shown, toggle: tog, rules }) => (
//     <div className="space-y-1.5">
//       <label className="text-sm font-medium text-surface-700 font-body">{label}</label>
//       <div className="relative">
//         <input
//           type={shown ? 'text' : 'password'}
//           className="input pr-10"
//           {...register(name, rules)}
//         />
//         <button
//           type="button"
//           onClick={tog}
//           className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-600 transition-colors"
//         >
//           {shown ? <EyeOff size={15} /> : <Eye size={15} />}
//         </button>
//       </div>
//       {errors[name] && <p className="text-xs text-red-500">{errors[name].message}</p>}
//     </div>
//   )

//   return (
//     <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 max-w-sm">
//       <Field label="Current Password" name="currentPassword" show={show.current} toggle={() => toggle('current')}
//         rules={{ required: 'Required' }} />
//       <Field label="New Password" name="newPassword" show={show.new} toggle={() => toggle('new')}
//         rules={{ required: 'Required', minLength: { value: 8, message: 'Min 8 characters' } }} />
//       <Field label="Confirm New Password" name="confirmPassword" show={show.confirm} toggle={() => toggle('confirm')}
//         rules={{ required: 'Required', validate: (v) => v === newPass || 'Passwords do not match' }} />
//       <button type="submit" disabled={saving} className="btn-primary">
//         {saving ? <Loader2 size={14} className="animate-spin" /> : <Lock size={14} />}
//         {saving ? 'Updating…' : 'Update Password'}
//       </button>
//     </form>
//   )
// }

// // ─── Notifications Tab ───────────────────────────────────────
// function NotificationsTab() {
//   const [prefs, setPrefs] = useState({
//     emailAlerts:    true,
//     orderUpdates:   true,
//     systemAlerts:   false,
//     newsletter:     false,
//     smsAlerts:      false,
//     pushNotif:      true,
//   })
//   const toggle = (key) => setPrefs((p) => ({ ...p, [key]: !p[key] }))

//   const items = [
//     { key: 'emailAlerts',  label: 'Email Alerts',      desc: 'Receive important alerts via email'      },
//     { key: 'orderUpdates', label: 'Order Updates',      desc: 'Get notified on order status changes'    },
//     { key: 'systemAlerts', label: 'System Alerts',      desc: 'Critical system and uptime notifications' },
//     { key: 'newsletter',   label: 'Newsletter',         desc: 'Weekly product & feature updates'        },
//     { key: 'smsAlerts',    label: 'SMS Alerts',         desc: 'Receive alerts via SMS'                  },
//     { key: 'pushNotif',    label: 'Push Notifications', desc: 'Browser push notifications'              },
//   ]

//   return (
//     <div className="space-y-3 max-w-lg">
//       {items.map((item) => (
//         <div
//           key={item.key}
//           className="flex items-center justify-between p-4 rounded-xl border border-surface-100 hover:border-surface-200 transition-colors"
//         >
//           <div>
//             <p className="text-sm font-medium text-surface-800 font-body">{item.label}</p>
//             <p className="text-xs text-surface-400 font-body mt-0.5">{item.desc}</p>
//           </div>
//           <button
//             onClick={() => toggle(item.key)}
//             className={cn(
//               'relative inline-flex h-6 w-11 items-center rounded-full transition-colors shrink-0 ml-4',
//               prefs[item.key] ? 'bg-brand-500' : 'bg-surface-200'
//             )}
//           >
//             <span
//               className={cn(
//                 'inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform',
//                 prefs[item.key] ? 'translate-x-6' : 'translate-x-1'
//               )}
//             />
//           </button>
//         </div>
//       ))}
//       <button
//         onClick={() => toast.success('Preferences saved!')}
//         className="btn-primary mt-2"
//       >
//         <Save size={14} /> Save Preferences
//       </button>
//     </div>
//   )
// }

// // ─── Main ────────────────────────────────────────────────────
// export default function SettingsPage() {
//   const [activeTab, setActiveTab] = useState('profile')

//   const TabContent = {
//     profile:       <ProfileTab />,
//     security:      <SecurityTab />,
//     notifications: <NotificationsTab />,
//     general: (
//       <div className="flex flex-col items-center justify-center h-40 text-center">
//         <Globe size={32} className="text-surface-300 mb-3" />
//         <p className="text-surface-400 font-body text-sm">General settings coming soon.</p>
//       </div>
//     ),
//   }

//   return (
//     <div className="space-y-6">
//       <div>
//         <h1 className="page-title">Settings</h1>
//         <p className="page-subtitle">Manage your account and platform preferences.</p>
//       </div>

//       <div className="flex flex-col lg:flex-row gap-6">
//         {/* Tab nav */}
//         <nav className="lg:w-52 shrink-0 space-y-1">
//           {TABS.map(({ id, label, icon: Icon }) => (
//             <button
//               key={id}
//               onClick={() => setActiveTab(id)}
//               className={cn('w-full nav-item', activeTab === id && 'active')}
//             >
//               <Icon size={16} />
//               {label}
//             </button>
//           ))}
//         </nav>

//         {/* Content */}
//         <div className="flex-1 card animate-fade-in" key={activeTab}>
//           <h2 className="font-display text-lg font-semibold text-surface-900 mb-6">
//             {TABS.find((t) => t.id === activeTab)?.label}
//           </h2>
//           {TabContent[activeTab]}
//         </div>
//       </div>
//     </div>
//   )
// }

import React from 'react'

const SettingsPage = () => {
  return (
    <div>
      settings page
    </div>
  )
}

export default SettingsPage
