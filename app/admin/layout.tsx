import { getUser } from '@/lib/actions/auth'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

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
    <div className="min-h-screen bg-slate-50">
      {/* Admin Header */}
      <header className="bg-slate-900 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Admin Dashboard</h1>
              <p className="text-sm text-slate-300 mt-1">BoardGameCulture Administration</p>
            </div>
            <Link
              href="/"
              className="px-4 py-2 text-sm bg-slate-700 hover:bg-slate-600 rounded-lg transition"
            >
              ← Back to Site
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex gap-6">
          {/* Sidebar Navigation */}
          <aside className="w-64 flex-shrink-0">
            <nav className="bg-white rounded-lg shadow-md p-4 sticky top-6">
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/admin"
                    className="block px-4 py-2 rounded-lg text-slate-700 hover:bg-slate-100 transition"
                  >
                    📊 Overview
                  </Link>
                </li>
                <li>
                  <Link
                    href="/admin/events"
                    className="block px-4 py-2 rounded-lg text-slate-700 hover:bg-slate-100 transition"
                  >
                    🎲 Events
                  </Link>
                </li>
                <li>
                  <Link
                    href="/admin/users"
                    className="block px-4 py-2 rounded-lg text-slate-700 hover:bg-slate-100 transition opacity-50 cursor-not-allowed"
                  >
                    👥 Users (Coming Soon)
                  </Link>
                </li>
                <li>
                  <Link
                    href="/admin/communities"
                    className="block px-4 py-2 rounded-lg text-slate-700 hover:bg-slate-100 transition opacity-50 cursor-not-allowed"
                  >
                    🏘️ Communities (Coming Soon)
                  </Link>
                </li>
                <li>
                  <Link
                    href="/admin/settings"
                    className="block px-4 py-2 rounded-lg text-slate-700 hover:bg-slate-100 transition opacity-50 cursor-not-allowed"
                  >
                    ⚙️ Settings (Coming Soon)
                  </Link>
                </li>
              </ul>
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}
