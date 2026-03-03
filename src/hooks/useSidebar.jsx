import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'

export default function useSidebar() {
  const [isOpen, setIsOpen] = useState(false)
  const location = useLocation()

  // Close on route change (mobile)
  useEffect(() => { setIsOpen(false) }, [location.pathname])

  // Close on resize to desktop
  useEffect(() => {
    const fn = () => { if (window.innerWidth >= 768) setIsOpen(false) }
    window.addEventListener('resize', fn)
    return () => window.removeEventListener('resize', fn)
  }, [])

  return {
    isOpen,
    toggleSidebar: () => setIsOpen(v => !v),
    closeSidebar:  () => setIsOpen(false),
    openSidebar:   () => setIsOpen(true),
  }
}