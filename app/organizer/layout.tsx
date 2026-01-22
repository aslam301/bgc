import { getUser } from '@/lib/actions/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import Navigation from '@/components/Navigation'

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
    <div className="min-h-screen bg-stone-50 pt-16">
      <Navigation />

      {/* Organizer Header */}
      <header className="bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-stone-900">Organizer Dashboard</h1>
              <p className="text-sm text-stone-600 mt-1">Manage your events and attendees</p>
            </div>
            <div className="flex gap-3 w-full sm:w-auto">
              <Link
                href="/events/create"
                className="flex-1 sm:flex-none px-4 py-2 text-sm bg-stone-900 text-white rounded-xl hover:bg-stone-800 transition font-semibold text-center shadow-sm"
              >
                + Create Event
              </Link>
              <Link
                href="/dashboard"
                className="flex-1 sm:flex-none px-4 py-2 text-sm bg-stone-100 text-stone-700 rounded-xl hover:bg-stone-200 transition font-medium text-center"
              >
                ← Dashboard
              </Link>
            </div>
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
                    href="/organizer"
                    className="block px-4 py-2 rounded-xl text-stone-900 font-medium hover:bg-brand-50 hover:text-brand-700 transition"
                  >
                    🎲 My Events
                  </Link>
                </li>
                <li>
                  <Link
                    href="/organizer/attendees"
                    className="block px-4 py-2 rounded-xl text-stone-900 font-medium hover:bg-brand-50 hover:text-brand-700 transition"
                  >
                    👥 All Attendees
                  </Link>
                </li>
                <li>
                  <Link
                    href="/organizer/earnings"
                    className="block px-4 py-2 rounded-xl text-stone-500 font-medium opacity-50 cursor-not-allowed"
                  >
                    💰 Earnings (Coming Soon)
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
