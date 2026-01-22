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
    <nav className="fixed top-0 left-0 right-0 z-[100] bg-white dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800 shadow-sm">
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

          {/* Empty spacer for layout */}
          <div className="hidden md:block"></div>

          {/* Menu */}
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <FullscreenMenu user={user} profile={profile} />
          </div>
        </div>
      </div>

    </nav>
  )
}
