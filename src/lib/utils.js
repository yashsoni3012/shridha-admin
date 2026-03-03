import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Merge Tailwind classes safely
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

/**
 * Format numbers with locale
 */
export function formatNumber(n) {
  return new Intl.NumberFormat('en-IN').format(n)
}

/**
 * Format currency in INR
 */
export function formatCurrency(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount)
}

/**
 * Format date to readable string
 */
export function formatDate(date) {
  return new Date(date).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

/**
 * Get initials from name
 */
export function getInitials(name = '') {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

/**
 * Truncate string
 */
export function truncate(str, n = 30) {
  return str.length > n ? str.slice(0, n) + '…' : str
}

/**
 * Sleep helper for mock delays
 */
export const sleep = (ms) => new Promise((r) => setTimeout(r, ms))