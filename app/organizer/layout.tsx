import { getUser } from '@/lib/actions/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function OrganizerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Organizer Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Organizer Dashboard</h1>
              <p className="text-sm text-slate-600 mt-1">Manage your events and attendees</p>
            </div>
            <div className="flex gap-3">
              <Link
                href="/events/create"
                className="px-4 py-2 text-sm bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition font-medium"
              >
                + Create Event
              </Link>
              <Link
                href="/dashboard"
                className="px-4 py-2 text-sm bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition"
              >
                ← Dashboard
              </Link>
            </div>
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
                    href="/organizer"
                    className="block px-4 py-2 rounded-lg text-slate-700 hover:bg-slate-100 transition"
                  >
                    🎲 My Events
                  </Link>
                </li>
                <li>
                  <Link
                    href="/organizer/attendees"
                    className="block px-4 py-2 rounded-lg text-slate-700 hover:bg-slate-100 transition"
                  >
                    👥 All Attendees
                  </Link>
                </li>
                <li>
                  <Link
                    href="/organizer/earnings"
                    className="block px-4 py-2 rounded-lg text-slate-700 hover:bg-slate-100 transition opacity-50 cursor-not-allowed"
                  >
                    💰 Earnings (Coming Soon)
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
