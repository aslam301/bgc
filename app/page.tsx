import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import Navigation from '@/components/Navigation'
import EventCard from '@/components/EventCard'

export default async function Home() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Get upcoming events
  const { data: eventsData } = await supabase
    .from('events')
    .select(`
      id,
      title,
      start_date,
      location_city,
      ticket_price,
      organizer:profiles!organizer_id(name)
    `)
    .eq('status', 'published')
    .eq('moderation_status', 'approved')
    .gte('start_date', new Date().toISOString())
    .order('start_date', { ascending: true })
    .limit(4)

  // Transform the data to flatten organizer array
  const upcomingEvents = eventsData?.map(event => ({
    ...event,
    organizer: Array.isArray(event.organizer) && event.organizer.length > 0
      ? event.organizer[0]
      : undefined
  }))

  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      {/* Hero Section */}
      <section className="relative bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-24">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-slate-900 leading-tight mb-4 sm:mb-6">
              The home for board game events in India
            </h1>
            <p className="text-lg sm:text-xl lg:text-2xl text-slate-600 mb-6 sm:mb-8 max-w-2xl mx-auto">
              Discover meetups, tournaments, and game nights. Connect with players and build community.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
              <Link
                href="/events"
                className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition font-semibold text-base sm:text-lg text-center"
              >
                Explore Events
              </Link>
              {!user && (
                <Link
                  href="/signup"
                  className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-white text-slate-900 border-2 border-slate-200 rounded-lg hover:border-slate-300 hover:bg-slate-50 transition font-semibold text-base sm:text-lg text-center"
                >
                  Sign Up Free
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-y border-slate-200 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="grid grid-cols-3 gap-4 sm:gap-8 text-center">
            <div>
              <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900">500+</p>
              <p className="text-xs sm:text-sm lg:text-base text-slate-600 mt-1">Gamers</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900">100+</p>
              <p className="text-xs sm:text-sm lg:text-base text-slate-600 mt-1">Events</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900">15+</p>
              <p className="text-xs sm:text-sm lg:text-base text-slate-600 mt-1">Cities</p>
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      {upcomingEvents && upcomingEvents.length > 0 && (
        <section className="bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 sm:mb-10">
              <div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mb-2">
                  Upcoming Events
                </h2>
                <p className="text-sm sm:text-base lg:text-lg text-slate-600">
                  Join the next board game gathering near you
                </p>
              </div>
              <Link
                href="/events"
                className="text-sm sm:text-base text-slate-900 hover:text-slate-700 font-semibold flex items-center gap-2"
              >
                View All <span>→</span>
              </Link>
            </div>

            {/* Desktop: Grid */}
            <div className="hidden sm:grid sm:grid-cols-2 gap-4 lg:gap-6">
              {upcomingEvents.map((event) => (
                <EventCard key={event.id} event={event} variant="grid" />
              ))}
            </div>

            {/* Mobile: List */}
            <div className="sm:hidden space-y-3">
              {upcomingEvents.map((event) => (
                <EventCard key={event.id} event={event} variant="list" />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Features Section */}
      <section className="bg-slate-50 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
          <div className="text-center mb-10 sm:mb-12 lg:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mb-3 sm:mb-4">
              Why BoardGameCulture?
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-slate-600">
              Everything you need to connect with the board game community
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <div className="bg-white p-6 sm:p-8 rounded-xl border border-slate-200">
              <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">🎲</div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-2 sm:mb-3">
                Discover Events
              </h3>
              <p className="text-sm sm:text-base text-slate-600">
                Find board game nights, tournaments, and meetups happening near you. Never miss a game night again.
              </p>
            </div>

            <div className="bg-white p-6 sm:p-8 rounded-xl border border-slate-200">
              <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">🎯</div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-2 sm:mb-3">
                Host Events
              </h3>
              <p className="text-sm sm:text-base text-slate-600">
                Organize your own board game events with our easy-to-use platform. Manage registrations effortlessly.
              </p>
            </div>

            <div className="bg-white p-6 sm:p-8 rounded-xl border border-slate-200 sm:col-span-2 lg:col-span-1">
              <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">👥</div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-2 sm:mb-3">
                Build Community
              </h3>
              <p className="text-sm sm:text-base text-slate-600">
                Connect with fellow board game enthusiasts, share experiences, and grow the gaming culture together.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-slate-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 text-center">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4 lg:mb-6">
            Ready to Join?
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-slate-300 mb-6 sm:mb-8 max-w-2xl mx-auto">
            Join thousands of board gamers across India. Find your next game night today.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <Link
              href={user ? "/events" : "/signup"}
              className="px-6 sm:px-8 py-3 sm:py-4 bg-white text-slate-900 rounded-lg hover:bg-slate-100 transition font-semibold text-base sm:text-lg"
            >
              {user ? "Browse Events" : "Get Started Free"}
            </Link>
            <Link
              href="/events/create"
              className="px-6 sm:px-8 py-3 sm:py-4 bg-slate-800 text-white border-2 border-slate-700 rounded-lg hover:bg-slate-700 transition font-semibold text-base sm:text-lg"
            >
              Host an Event
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8 mb-8">
            <div className="col-span-2">
              <div className="flex items-center gap-2 mb-3 sm:mb-4">
                <span className="text-xl sm:text-2xl">🎲</span>
                <span className="text-base sm:text-lg font-bold text-slate-900">BoardGameCulture</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600">
                India's premier platform for board game enthusiasts.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-slate-900 mb-3 sm:mb-4 text-sm sm:text-base">Platform</h4>
              <ul className="space-y-2 text-xs sm:text-sm">
                <li><Link href="/events" className="text-slate-600 hover:text-slate-900 transition">Browse Events</Link></li>
                <li><Link href="/events/create" className="text-slate-600 hover:text-slate-900 transition">Host Event</Link></li>
                <li><Link href="/dashboard" className="text-slate-600 hover:text-slate-900 transition">Dashboard</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-slate-900 mb-3 sm:mb-4 text-sm sm:text-base">Company</h4>
              <ul className="space-y-2 text-xs sm:text-sm">
                <li><Link href="#" className="text-slate-600 hover:text-slate-900 transition">About</Link></li>
                <li><Link href="#" className="text-slate-600 hover:text-slate-900 transition">Contact</Link></li>
                <li><Link href="#" className="text-slate-600 hover:text-slate-900 transition">Privacy</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-200 pt-6 sm:pt-8 text-center text-xs sm:text-sm text-slate-600">
            <p>&copy; 2026 BoardGameCulture. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
