import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'
import FullscreenMenu from './FullscreenMenu'

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
    <nav className="fixed top-0 left-0 right-0 z-[100] bg-card/95 backdrop-blur-sm border-b-2 border-ink shadow-neo">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 sm:gap-3 group">
            <div className="relative w-12 h-12 sm:w-14 sm:h-14">
              <Image
                src="/logo.png"
                alt="BoardGameCulture Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
            <span className="text-base sm:text-xl font-black text-foreground hidden sm:block uppercase">
              BoardGameCulture
            </span>
            <span className="text-base font-black text-foreground sm:hidden uppercase">
              BGC
            </span>
          </Link>

          {/* Empty spacer for layout */}
          <div className="hidden md:block"></div>

          {/* Menu */}
          <FullscreenMenu user={user} profile={profile} />
        </div>
      </div>

    </nav>
  )
}
