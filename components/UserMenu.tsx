'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { logout } from '@/lib/actions/auth'

interface UserMenuProps {
  user: any
  profile: any
}

export default function UserMenu({ user, profile }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-stone-50 transition"
      >
        <div className="w-8 h-8 bg-gradient-to-br from-brand-500 to-brand-700 rounded-full flex items-center justify-center text-white font-semibold">
          {profile?.name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase()}
        </div>
        <svg
          className={`w-4 h-4 text-stone-600 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-stone-200 py-2 z-[60]">
          {/* User Info */}
          <div className="px-4 py-3 border-b border-stone-200">
            <p className="text-sm font-semibold text-stone-900">{profile?.name || 'User'}</p>
            <p className="text-xs text-stone-600 truncate">{user.email}</p>
          </div>

          {/* Menu Items */}
          <div className="py-1">
            <Link
              href="/dashboard"
              className="block px-4 py-2 text-sm text-stone-900 font-medium hover:bg-brand-50 hover:text-brand-700 transition"
              onClick={() => setIsOpen(false)}
            >
              <span className="inline-block w-5">🏠</span> Dashboard
            </Link>
            <Link
              href="/organizer"
              className="block px-4 py-2 text-sm text-stone-900 font-medium hover:bg-brand-50 hover:text-brand-700 transition"
              onClick={() => setIsOpen(false)}
            >
              <span className="inline-block w-5">🎯</span> My Events
            </Link>
            {profile?.role === 'super_admin' && (
              <Link
                href="/admin"
                className="block px-4 py-2 text-sm text-stone-900 font-medium hover:bg-brand-50 hover:text-brand-700 transition"
                onClick={() => setIsOpen(false)}
              >
                <span className="inline-block w-5">⚙️</span> Admin Panel
              </Link>
            )}
          </div>

          {/* Logout */}
          <div className="border-t border-stone-200 py-1">
            <form action={logout}>
              <button
                type="submit"
                className="w-full text-left px-4 py-2 text-sm text-red-600 font-medium hover:bg-red-50 transition"
              >
                <span className="inline-block w-5">🚪</span> Sign Out
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
