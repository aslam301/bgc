import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import Navigation from '@/components/Navigation'
import { format } from 'date-fns'

export default async function DashboardPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Get user profile from database
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  // Get user stats
  const { count: myEventsCount } = await supabase
    .from('events')
    .select('*', { count: 'exact', head: true })
    .eq('organizer_id', user.id)

  // Get user's registered events
  const { data: registrations } = await supabase
    .from('event_registrations')
    .select(`
      *,
      event:events(*)
    `)
    .eq('user_id', user.id)
    .order('registered_at', { ascending: false })
    .limit(5)

  const confirmedRegistrations = registrations?.filter(r => r.status === 'confirmed') || []

  return (
    <div className="min-h-screen bg-off-white">
      <Navigation />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-br from-stone-800 via-stone-900 to-black rounded-2xl shadow-sm p-6 sm:p-8 mb-8 border border-stone-700">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold mb-2 text-white">
                Welcome back, {profile?.name || 'Gamer'}!
              </h1>
              <p className="text-stone-200">
                Ready for your next board game adventure?
              </p>
            </div>
            <div className="hidden sm:block text-5xl sm:text-6xl opacity-10 text-brand-400">🎲</div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
          <Link
            href="/organizer"
            className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition border border-stone-200 hover:border-brand-200"
          >
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-semibold text-stone-600">Events Created</p>
              <div className="text-2xl">🎯</div>
            </div>
            <p className="text-3xl font-bold text-stone-900">{myEventsCount || 0}</p>
            <p className="text-xs text-brand-600 mt-2 font-semibold">Manage events →</p>
          </Link>

          <div className="bg-white rounded-2xl shadow-sm p-6 border border-stone-200">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-semibold text-stone-600">Events Registered</p>
              <div className="text-2xl">🎟️</div>
            </div>
            <p className="text-3xl font-bold text-stone-900">{confirmedRegistrations.length}</p>
            <p className="text-xs text-stone-500 mt-2">Active registrations</p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-6 border border-stone-200">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-semibold text-stone-600">Community Rank</p>
              <div className="text-2xl">⭐</div>
            </div>
            <p className="text-3xl font-bold text-stone-900">
              {myEventsCount && myEventsCount > 0 ? 'Organizer' : 'Player'}
            </p>
            <p className="text-xs text-stone-500 mt-2">Keep gaming!</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Registered Events */}
            <div className="bg-white rounded-2xl shadow-sm border border-stone-200">
              <div className="p-6 border-b border-stone-200">
                <h2 className="text-xl font-bold text-stone-900">My Registered Events</h2>
              </div>

              {!registrations || registrations.length === 0 ? (
                <div className="p-12 text-center">
                  <div className="text-5xl mb-4">🎲</div>
                  <h3 className="text-lg font-bold text-stone-900 mb-2">
                    No Events Yet
                  </h3>
                  <p className="text-stone-600 mb-6">
                    Discover and register for board game events near you
                  </p>
                  <Link
                    href="/events"
                    className="inline-block px-6 py-3 bg-stone-900 text-white rounded-xl hover:bg-stone-800 transition font-semibold shadow-sm"
                  >
                    Browse Events
                  </Link>
                </div>
              ) : (
                <div className="divide-y divide-stone-200">
                  {registrations.map((reg) => (
                    <Link
                      key={reg.id}
                      href={`/events/${reg.event.id}`}
                      className="block p-6 hover:bg-stone-50 transition"
                    >
                      <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-stone-900 mb-2 hover:text-brand-600 transition">
                            {reg.event.title}
                          </h3>
                          <div className="space-y-1 text-sm text-stone-600">
                            <p>📅 {format(new Date(reg.event.start_date), 'PPP')}</p>
                            <p>📍 {reg.event.location_city}</p>
                          </div>
                        </div>
                        <div className="text-left sm:text-right">
                          <span
                            className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${
                              reg.status === 'confirmed'
                                ? 'bg-green-50 border border-green-200 text-green-800'
                                : reg.status === 'pending_payment'
                                ? 'bg-orange-50 border border-orange-200 text-orange-800'
                                : 'bg-stone-50 border border-stone-200 text-stone-800'
                            }`}
                          >
                            {reg.status === 'confirmed' ? '✓ Confirmed' : reg.status}
                          </span>
                          {reg.event.ticket_price > 0 && (
                            <p className="text-sm font-bold text-stone-900 mt-2">
                              ₹{reg.event.ticket_price}
                            </p>
                          )}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Become Organizer CTA - Only show if user hasn't created events */}
            {(!myEventsCount || myEventsCount === 0) && (
              <div className="bg-gradient-to-br from-brand-50 to-brand-100 rounded-2xl border-2 border-brand-200 p-6 sm:p-8">
                <div className="flex flex-col sm:flex-row items-start gap-4">
                  <div className="text-4xl sm:text-5xl">🎯</div>
                  <div className="flex-1">
                    <h3 className="text-xl sm:text-2xl font-bold text-stone-900 mb-2">
                      Become an Event Organizer
                    </h3>
                    <p className="text-stone-700 mb-4">
                      Host your own board game events! Create meetups, tournaments, and game nights.
                      Build your community and bring gamers together.
                    </p>
                    <ul className="space-y-2 mb-6 text-sm text-stone-700">
                      <li className="flex items-center gap-2">
                        <span className="text-green-600 font-semibold">✓</span> Free event hosting
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-green-600 font-semibold">✓</span> Manage registrations easily
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-green-600 font-semibold">✓</span> Track attendees and payments
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-green-600 font-semibold">✓</span> Build your gaming community
                      </li>
                    </ul>
                    <Link
                      href="/events/create"
                      className="inline-block px-6 py-3 bg-stone-900 text-white rounded-xl hover:bg-stone-800 transition font-semibold shadow-sm"
                    >
                      Create Your First Event →
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-6">
              <h3 className="font-bold text-stone-900 mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <Link
                  href="/events"
                  className="block p-3 rounded-xl hover:bg-brand-50 transition border border-transparent hover:border-brand-200"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">📅</span>
                    <div>
                      <p className="font-semibold text-stone-900 text-sm">Browse Events</p>
                      <p className="text-xs text-stone-600">Find game nights</p>
                    </div>
                  </div>
                </Link>
                <Link
                  href="/events/create"
                  className="block p-3 rounded-xl hover:bg-brand-50 transition border border-transparent hover:border-brand-200"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">➕</span>
                    <div>
                      <p className="font-semibold text-stone-900 text-sm">Create Event</p>
                      <p className="text-xs text-stone-600">Host your own</p>
                    </div>
                  </div>
                </Link>
                {myEventsCount && myEventsCount > 0 && (
                  <Link
                    href="/organizer"
                    className="block p-3 rounded-xl hover:bg-brand-50 transition border border-transparent hover:border-brand-200"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">🎯</span>
                      <div>
                        <p className="font-semibold text-stone-900 text-sm">My Events</p>
                        <p className="text-xs text-stone-600">Manage & track</p>
                      </div>
                    </div>
                  </Link>
                )}
              </div>
            </div>

            {/* Profile Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-6">
              <h3 className="font-bold text-stone-900 mb-4">Profile</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-stone-600 text-xs mb-1">Name</p>
                  <p className="font-semibold text-stone-900">{profile?.name || 'Not set'}</p>
                </div>
                <div>
                  <p className="text-stone-600 text-xs mb-1">Email</p>
                  <p className="font-semibold text-stone-900 truncate">{user.email}</p>
                </div>
                <div>
                  <p className="text-stone-600 text-xs mb-1">Role</p>
                  <span className="inline-block px-2 py-1 bg-stone-100 text-stone-800 text-xs font-semibold rounded">
                    {profile?.role || 'user'}
                  </span>
                </div>
              </div>
            </div>

            {/* Coming Soon */}
            <div className="bg-gradient-to-br from-stone-100 to-stone-200 rounded-2xl p-6 opacity-75">
              <h3 className="font-bold text-stone-900 mb-2">Coming Soon</h3>
              <ul className="space-y-2 text-sm text-stone-700">
                <li>💬 Community Discussions</li>
                <li>🏆 Achievement Badges</li>
                <li>📊 Gaming Statistics</li>
                <li>👥 Friend Connections</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
