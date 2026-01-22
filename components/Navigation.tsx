import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import UserMenu from './UserMenu'

export default async function Navigation() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let profile = null
  if (user) {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()
    profile = data
  }

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <span className="text-2xl group-hover:scale-110 transition-transform">🎲</span>
            <span className="text-lg sm:text-xl font-bold text-slate-900 hidden sm:block">
              BoardGameCulture
            </span>
            <span className="text-lg font-bold text-slate-900 sm:hidden">
              BGC
            </span>
          </Link>

          {/* Navigation Links - Desktop */}
          <div className="hidden md:flex items-center gap-1">
            <Link
              href="/events"
              className="px-4 py-2 text-slate-700 hover:text-slate-900 hover:bg-slate-100/50 rounded-lg transition font-medium"
            >
              Browse Events
            </Link>
            {user && (
              <Link
                href="/events/create"
                className="px-4 py-2 text-slate-700 hover:text-slate-900 hover:bg-slate-100/50 rounded-lg transition font-medium"
              >
                Create Event
              </Link>
            )}
          </div>

          {/* Auth Section */}
          <div className="flex items-center gap-2 sm:gap-3">
            {user ? (
              <UserMenu user={user} profile={profile} />
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-3 sm:px-4 py-2 text-sm sm:text-base text-slate-700 hover:text-slate-900 font-medium"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="px-3 sm:px-4 py-2 text-sm sm:text-base bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition font-medium"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {user && (
        <div className="md:hidden border-t border-slate-200/50 bg-white/90">
          <div className="flex justify-around py-2 px-4">
            <Link
              href="/events"
              className="flex-1 text-center px-3 py-2 text-sm text-slate-700 hover:text-slate-900 hover:bg-slate-100/50 rounded-lg transition font-medium"
            >
              Browse
            </Link>
            <Link
              href="/events/create"
              className="flex-1 text-center px-3 py-2 text-sm text-slate-700 hover:text-slate-900 hover:bg-slate-100/50 rounded-lg transition font-medium"
            >
              Create
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}
