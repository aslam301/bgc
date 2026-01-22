import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'
import FullscreenMenu from './FullscreenMenu'
import ThemeToggle from './ThemeToggle'

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
    <nav className="z-50 bg-white/95 dark:bg-stone-900/95 backdrop-blur-md border-b border-stone-200 dark:border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 sm:gap-3 group">
            <div className="relative w-10 h-10 sm:w-12 sm:h-12 group-hover:scale-105 transition-transform">
              <Image
                src="/logo.png"
                alt="BoardGameCulture Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
            <span className="text-base sm:text-xl font-bold text-stone-900 dark:text-stone-100 hidden sm:block">
              BoardGameCulture
            </span>
            <span className="text-base font-bold text-stone-900 dark:text-stone-100 sm:hidden">
              BGC
            </span>
          </Link>

          {/* Navigation Links - Desktop */}
          <div className="hidden md:flex items-center gap-1">
            <Link
              href="/events"
              className="px-4 py-2 text-sm text-stone-700 dark:text-stone-300 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-50 dark:hover:bg-stone-800 rounded-lg transition font-medium"
            >
              Browse Events
            </Link>
            {user && (
              <Link
                href="/events/create"
                className="px-4 py-2 text-sm text-stone-700 dark:text-stone-300 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-50 dark:hover:bg-stone-800 rounded-lg transition font-medium"
              >
                Create Event
              </Link>
            )}
          </div>

          {/* Menu */}
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <FullscreenMenu user={user} profile={profile} />
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {user && (
        <div className="md:hidden border-t border-stone-200 dark:border-stone-800 bg-white/90 dark:bg-stone-900/90 backdrop-blur-sm">
          <div className="flex justify-around py-2 px-4">
            <Link
              href="/events"
              className="flex-1 text-center px-3 py-2 text-sm text-stone-700 dark:text-stone-300 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-50 dark:hover:bg-stone-800 rounded-lg transition font-medium"
            >
              Browse
            </Link>
            <Link
              href="/events/create"
              className="flex-1 text-center px-3 py-2 text-sm text-stone-700 dark:text-stone-300 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-50 dark:hover:bg-stone-800 rounded-lg transition font-medium"
            >
              Create
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}
