import { getUser } from '@/lib/actions/auth'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import Navigation from '@/components/Navigation'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getUser()

  if (!user) {
    redirect('/login')
  }

  // Check if user is super admin
  const supabase = await createClient()
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'super_admin') {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen bg-stone-50 pt-16">
      <Navigation />

      {/* Admin Header */}
      <header className="bg-stone-900 text-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">Admin Dashboard</h1>
              <p className="text-sm text-stone-300 mt-1">BoardGameCulture Administration</p>
            </div>
            <Link
              href="/"
              className="px-4 py-2 text-sm bg-stone-700 hover:bg-stone-600 rounded-xl transition font-semibold"
            >
              ← Back to Site
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar Navigation */}
          <aside className="w-full lg:w-64 flex-shrink-0">
            <nav className="bg-white rounded-2xl shadow-sm border border-stone-200 p-4 lg:sticky lg:top-20">
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/admin"
                    className="block px-4 py-2 rounded-xl text-stone-900 font-medium hover:bg-brand-50 hover:text-brand-700 transition"
                  >
                    📊 Overview
                  </Link>
                </li>
                <li>
                  <Link
                    href="/admin/events"
                    className="block px-4 py-2 rounded-xl text-stone-900 font-medium hover:bg-brand-50 hover:text-brand-700 transition"
                  >
                    🎲 Events
                  </Link>
                </li>
                <li>
                  <Link
                    href="/admin/users"
                    className="block px-4 py-2 rounded-xl text-stone-500 font-medium opacity-50 cursor-not-allowed"
                  >
                    👥 Users (Coming Soon)
                  </Link>
                </li>
                <li>
                  <Link
                    href="/admin/communities"
                    className="block px-4 py-2 rounded-xl text-stone-500 font-medium opacity-50 cursor-not-allowed"
                  >
                    🏘️ Communities (Coming Soon)
                  </Link>
                </li>
                <li>
                  <Link
                    href="/admin/settings"
                    className="block px-4 py-2 rounded-xl text-stone-500 font-medium opacity-50 cursor-not-allowed"
                  >
                    ⚙️ Settings (Coming Soon)
                  </Link>
                </li>
              </ul>
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}
