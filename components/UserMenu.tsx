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
        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-50 transition"
      >
        <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-medium">
          {profile?.name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase()}
        </div>
        <svg
          className={`w-4 h-4 text-slate-600 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-slate-200 py-2">
          {/* User Info */}
          <div className="px-4 py-3 border-b border-slate-200">
            <p className="text-sm font-medium text-slate-900">{profile?.name || 'User'}</p>
            <p className="text-xs text-slate-600 truncate">{user.email}</p>
          </div>

          {/* Menu Items */}
          <div className="py-1">
            <Link
              href="/dashboard"
              className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition"
              onClick={() => setIsOpen(false)}
            >
              <span className="inline-block w-5">🏠</span> Dashboard
            </Link>
            <Link
              href="/organizer"
              className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition"
              onClick={() => setIsOpen(false)}
            >
              <span className="inline-block w-5">🎯</span> My Events
            </Link>
            {profile?.role === 'super_admin' && (
              <Link
                href="/admin"
                className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition"
                onClick={() => setIsOpen(false)}
              >
                <span className="inline-block w-5">⚙️</span> Admin Panel
              </Link>
            )}
          </div>

          {/* Logout */}
          <div className="border-t border-slate-200 py-1">
            <form action={logout}>
              <button
                type="submit"
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition"
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
