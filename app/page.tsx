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
    <div className="min-h-screen bg-off-white">
      <Navigation />

      {/* Hero Section */}
      <section className="relative bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-28">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-stone-900 leading-tight mb-5 sm:mb-6">
              The home for board game events in India
            </h1>
            <p className="text-lg sm:text-xl lg:text-2xl text-stone-600 mb-8 sm:mb-10 max-w-2xl mx-auto">
              Discover meetups, tournaments, and game nights. Connect with players and build community.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
              <Link
                href="/events"
                className="w-full sm:w-auto px-7 sm:px-9 py-3.5 sm:py-4 bg-stone-900 text-white rounded-xl hover:bg-stone-800 transition-all font-semibold text-base sm:text-lg text-center shadow-sm"
              >
                Explore Events
              </Link>
              {!user && (
                <Link
                  href="/signup"
                  className="w-full sm:w-auto px-7 sm:px-9 py-3.5 sm:py-4 bg-white text-stone-900 border-2 border-stone-300 rounded-xl hover:border-stone-400 hover:bg-stone-50 transition-all font-semibold text-base sm:text-lg text-center"
                >
                  Sign Up Free
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-y border-stone-200 bg-warm-gray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          <div className="grid grid-cols-3 gap-6 sm:gap-10 text-center">
            <div>
              <p className="text-3xl sm:text-4xl lg:text-5xl font-bold text-stone-900">500+</p>
              <p className="text-sm sm:text-base lg:text-lg text-stone-600 mt-2">Gamers</p>
            </div>
            <div>
              <p className="text-3xl sm:text-4xl lg:text-5xl font-bold text-stone-900">100+</p>
              <p className="text-sm sm:text-base lg:text-lg text-stone-600 mt-2">Events</p>
            </div>
            <div>
              <p className="text-3xl sm:text-4xl lg:text-5xl font-bold text-stone-900">15+</p>
              <p className="text-sm sm:text-base lg:text-lg text-stone-600 mt-2">Cities</p>
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      {upcomingEvents && upcomingEvents.length > 0 && (
        <section className="bg-off-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-18 lg:py-24">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10 sm:mb-12">
              <div>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-stone-900 mb-2">
                  Upcoming Events
                </h2>
                <p className="text-base sm:text-lg lg:text-xl text-stone-600">
                  Join the next board game gathering near you
                </p>
              </div>
              <Link
                href="/events"
                className="text-sm sm:text-base text-stone-900 hover:text-brand-600 font-semibold flex items-center gap-2 transition"
              >
                View All <span>→</span>
              </Link>
            </div>

            {/* Desktop: 4-column grid, Tablet: 2-column, Mobile: list */}
            <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-5">
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
      <section className="bg-white border-y border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-18 lg:py-24">
          <div className="text-center mb-12 sm:mb-14 lg:mb-18">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-stone-900 mb-4 sm:mb-5">
              Why BoardGameCulture?
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-stone-600">
              Everything you need to connect with the board game community
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <div className="bg-off-white p-7 sm:p-9 rounded-2xl border border-stone-200">
              <div className="text-4xl sm:text-5xl mb-4 sm:mb-5">🎲</div>
              <h3 className="text-xl sm:text-2xl font-bold text-stone-900 mb-3 sm:mb-4">
                Discover Events
              </h3>
              <p className="text-sm sm:text-base text-stone-600 leading-relaxed">
                Find board game nights, tournaments, and meetups happening near you. Never miss a game night again.
              </p>
            </div>

            <div className="bg-off-white p-7 sm:p-9 rounded-2xl border border-stone-200">
              <div className="text-4xl sm:text-5xl mb-4 sm:mb-5">🎯</div>
              <h3 className="text-xl sm:text-2xl font-bold text-stone-900 mb-3 sm:mb-4">
                Host Events
              </h3>
              <p className="text-sm sm:text-base text-stone-600 leading-relaxed">
                Organize your own board game events with our easy-to-use platform. Manage registrations effortlessly.
              </p>
            </div>

            <div className="bg-off-white p-7 sm:p-9 rounded-2xl border border-stone-200 sm:col-span-2 lg:col-span-1">
              <div className="text-4xl sm:text-5xl mb-4 sm:mb-5">👥</div>
              <h3 className="text-xl sm:text-2xl font-bold text-stone-900 mb-3 sm:mb-4">
                Build Community
              </h3>
              <p className="text-sm sm:text-base text-stone-600 leading-relaxed">
                Connect with fellow board game enthusiasts, share experiences, and grow the gaming culture together.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-stone-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-18 lg:py-24 text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-5 lg:mb-7">
            Ready to Join?
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-stone-300 mb-8 sm:mb-10 max-w-2xl mx-auto">
            Join thousands of board gamers across India. Find your next game night today.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <Link
              href={user ? "/events" : "/signup"}
              className="px-7 sm:px-9 py-3.5 sm:py-4 bg-white text-stone-900 rounded-xl hover:bg-stone-100 transition-all font-semibold text-base sm:text-lg"
            >
              {user ? "Browse Events" : "Get Started Free"}
            </Link>
            <Link
              href="/events/create"
              className="px-7 sm:px-9 py-3.5 sm:py-4 bg-stone-800 text-white border-2 border-stone-700 rounded-xl hover:bg-stone-700 transition-all font-semibold text-base sm:text-lg"
            >
              Host an Event
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 sm:gap-10 mb-10">
            <div className="col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xl sm:text-2xl">🎲</span>
                <span className="text-base sm:text-lg font-bold text-stone-900">BoardGameCulture</span>
              </div>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                India's premier platform for board game enthusiasts.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-stone-900 mb-4 text-sm sm:text-base">Platform</h4>
              <ul className="space-y-2.5 text-xs sm:text-sm">
                <li><Link href="/events" className="text-stone-600 hover:text-stone-900 transition">Browse Events</Link></li>
                <li><Link href="/events/create" className="text-stone-600 hover:text-stone-900 transition">Host Event</Link></li>
                <li><Link href="/dashboard" className="text-stone-600 hover:text-stone-900 transition">Dashboard</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-stone-900 mb-4 text-sm sm:text-base">Company</h4>
              <ul className="space-y-2.5 text-xs sm:text-sm">
                <li><Link href="#" className="text-stone-600 hover:text-stone-900 transition">About</Link></li>
                <li><Link href="#" className="text-stone-600 hover:text-stone-900 transition">Contact</Link></li>
                <li><Link href="#" className="text-stone-600 hover:text-stone-900 transition">Privacy</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-stone-200 pt-8 text-center text-xs sm:text-sm text-stone-600">
            <p>&copy; 2026 BoardGameCulture. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
