'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { logout } from '@/lib/actions/auth'

interface FullscreenMenuProps {
  user: any | null
  profile: any
}

export default function FullscreenMenu({ user, profile }: FullscreenMenuProps) {
  const [isOpen, setIsOpen] = useState(false)

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  // Close menu on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false)
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [])

  return (
    <>
      {/* Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center w-10 h-10 border-2 border-ink shadow-neo-sm hover:shadow-neo hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all bg-card"
        aria-label="Menu"
      >
        <svg className="w-6 h-6 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Fullscreen Menu Overlay */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[200]"
            onClick={() => setIsOpen(false)}
          />

          {/* Menu Panel */}
          <div className="fixed inset-0 z-[210] flex items-start justify-end p-4 pointer-events-none">
            <div className="pointer-events-auto w-full max-w-md bg-card border-2 border-ink shadow-[8px_8px_0_0_hsl(var(--ink))] overflow-hidden animate-slide-in">
              {/* Header */}
              <div className="bg-coral border-b-2 border-ink p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="relative w-12 h-12 bg-white p-2">
                      <Image
                        src="/logo.png"
                        alt="BoardGameCulture"
                        fill
                        className="object-contain"
                      />
                    </div>
                    <div>
                      <h2 className="font-black text-lg text-ink uppercase">BoardGameCulture</h2>
                      <p className="text-xs text-ink/80 font-mono">Board Game Events in India</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="w-8 h-8 border-2 border-ink shadow-neo-sm hover:shadow-neo hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all bg-card flex items-center justify-center"
                  >
                    <svg className="w-5 h-5 text-ink" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* User Info */}
                {user && (
                  <div className="flex items-center gap-3 p-3 bg-ink border-2 border-ink shadow-[2px_2px_0_0_hsl(var(--ink))]">
                    <div className="w-10 h-10 border-2 border-ink bg-sunny flex items-center justify-center text-ink font-black">
                      {profile?.name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold truncate text-white">{profile?.name || 'User'}</p>
                      <p className="text-xs text-white/80 truncate font-mono">{user.email}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Menu Items */}
              <div className="p-6 max-h-[calc(100vh-16rem)] overflow-y-auto">
                <nav className="space-y-2">
                  {/* Public Links */}
                  <Link
                    href="/"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 p-3 border-2 border-ink shadow-neo-sm hover:shadow-neo hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all bg-card text-foreground font-bold uppercase text-sm tracking-wider"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    Home
                  </Link>

                  <Link
                    href="/events"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 p-3 border-2 border-ink shadow-neo-sm hover:shadow-neo hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all bg-card text-foreground font-bold uppercase text-sm tracking-wider"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Browse Events
                  </Link>

                  <Link
                    href="/discussions"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 p-3 border-2 border-ink shadow-neo-sm hover:shadow-neo hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all bg-card text-foreground font-bold uppercase text-sm tracking-wider"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    Discussions
                  </Link>

                  <Link
                    href="/games"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 p-3 border-2 border-ink shadow-neo-sm hover:shadow-neo hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all bg-card text-foreground font-bold uppercase text-sm tracking-wider"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Games
                  </Link>

                  <Link
                    href="/reviews"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 p-3 border-2 border-ink shadow-neo-sm hover:shadow-neo hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all bg-card text-foreground font-bold uppercase text-sm tracking-wider"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                    Reviews
                  </Link>

                  <Link
                    href="/shop"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 p-3 border-2 border-ink shadow-neo-sm hover:shadow-neo hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all bg-card text-foreground font-bold uppercase text-sm tracking-wider"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    Where to Buy
                  </Link>

                  {user ? (
                    <>
                      <div className="h-0.5 bg-border my-4"></div>

                      {/* User Links */}
                      <Link
                        href="/dashboard"
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-3 p-3 border-2 border-ink shadow-neo-sm hover:shadow-neo hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all bg-mint text-ink font-bold uppercase text-sm tracking-wider"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        My Dashboard
                      </Link>

                      <Link
                        href="/collection"
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-3 p-3 border-2 border-ink shadow-neo-sm hover:shadow-neo hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all bg-card text-foreground font-bold uppercase text-sm tracking-wider"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                        My Collection
                      </Link>

                      <div className="h-0.5 bg-border my-4"></div>

                      <Link
                        href="/events/create"
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-3 p-3 border-2 border-ink shadow-neo-sm hover:shadow-neo hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all bg-sunny text-ink font-bold uppercase text-sm tracking-wider"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                        </svg>
                        Create Event
                      </Link>

                      {(profile?.role === 'organizer' || profile?.role === 'super_admin') && (
                        <Link
                          href="/organizer"
                          onClick={() => setIsOpen(false)}
                          className="flex items-center gap-3 p-3 border-2 border-ink shadow-neo-sm hover:shadow-neo hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all bg-grape text-white font-bold uppercase text-sm tracking-wider"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                          </svg>
                          My Events
                        </Link>
                      )}

                      {profile?.role === 'super_admin' && (
                        <>
                          <div className="h-0.5 bg-border my-4"></div>
                          <Link
                            href="/admin"
                            onClick={() => setIsOpen(false)}
                            className="flex items-center gap-3 p-3 border-2 border-ink shadow-neo-sm hover:shadow-neo hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all bg-coral text-white font-bold uppercase text-sm tracking-wider"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            Admin Panel
                          </Link>
                        </>
                      )}

                      <div className="h-0.5 bg-border my-4"></div>

                      {/* Logout */}
                      <form action={logout}>
                        <button
                          type="submit"
                          className="w-full flex items-center gap-3 p-3 border-2 border-ink shadow-neo-sm hover:shadow-neo hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all bg-card text-coral font-bold uppercase text-sm tracking-wider"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                          Sign Out
                        </button>
                      </form>
                    </>
                  ) : (
                    <>
                      <div className="h-0.5 bg-border my-4"></div>

                      {/* Auth Links */}
                      <Link
                        href="/login"
                        onClick={() => setIsOpen(false)}
                        className="flex items-center justify-center gap-2 p-3 bg-card border-2 border-ink shadow-neo hover:shadow-neo-lg hover:-translate-x-0.5 hover:-translate-y-0.5 text-foreground transition-all font-bold uppercase tracking-wider"
                      >
                        Sign In
                      </Link>

                      <Link
                        href="/signup"
                        onClick={() => setIsOpen(false)}
                        className="flex items-center justify-center gap-2 p-3 bg-coral border-2 border-ink shadow-neo hover:shadow-neo-lg hover:-translate-x-0.5 hover:-translate-y-0.5 text-white transition-all font-bold uppercase tracking-wider"
                      >
                        Sign Up
                      </Link>
                    </>
                  )}
                </nav>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
}
