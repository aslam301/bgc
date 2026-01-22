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
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950">
      <Navigation />

      {/* Hero Section */}
      <section className="relative pt-16 bg-white dark:bg-stone-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-28">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-stone-900 dark:text-stone-100 leading-tight mb-4 sm:mb-5">
              The home for board game events in India
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-stone-600 dark:text-stone-400 mb-7 sm:mb-8 max-w-2xl mx-auto">
              Discover meetups, tournaments, and game nights. Connect with players and build community.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
              <Link
                href="/events"
                className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-3.5 bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 rounded-xl hover:bg-stone-800 dark:hover:bg-stone-200 transition-all font-semibold text-sm sm:text-base text-center shadow-sm"
              >
                Explore Events
              </Link>
              {!user && (
                <Link
                  href="/signup"
                  className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-3.5 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 border-2 border-stone-300 dark:border-stone-700 rounded-xl hover:border-stone-400 dark:hover:border-stone-600 hover:bg-stone-50 dark:hover:bg-stone-700 transition-all font-semibold text-sm sm:text-base text-center"
                >
                  Sign Up Free
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-y border-stone-200 dark:border-stone-800 bg-stone-100 dark:bg-stone-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
          <div className="grid grid-cols-3 gap-6 sm:gap-10 text-center">
            <div>
              <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-stone-900 dark:text-stone-100">500+</p>
              <p className="text-xs sm:text-sm lg:text-base text-stone-600 dark:text-stone-400 mt-2">Gamers</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-stone-900 dark:text-stone-100">100+</p>
              <p className="text-xs sm:text-sm lg:text-base text-stone-600 dark:text-stone-400 mt-2">Events</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-stone-900 dark:text-stone-100">15+</p>
              <p className="text-xs sm:text-sm lg:text-base text-stone-600 dark:text-stone-400 mt-2">Cities</p>
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      {upcomingEvents && upcomingEvents.length > 0 && (
        <section className="bg-stone-50 dark:bg-stone-950">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 sm:mb-10">
              <div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-stone-900 dark:text-stone-100 mb-2">
                  Upcoming Events
                </h2>
                <p className="text-sm sm:text-base lg:text-lg text-stone-600 dark:text-stone-400">
                  Join the next board game gathering near you
                </p>
              </div>
              <Link
                href="/events"
                className="text-xs sm:text-sm text-stone-900 dark:text-stone-100 hover:text-brand-600 dark:hover:text-brand-400 font-semibold flex items-center gap-2 transition"
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
      <section className="bg-white dark:bg-stone-900 border-y border-stone-200 dark:border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
          <div className="text-center mb-10 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-stone-900 dark:text-stone-100 mb-3 sm:mb-4">
              Why BoardGameCulture?
            </h2>
            <p className="text-sm sm:text-base lg:text-lg text-stone-600 dark:text-stone-400">
              Everything you need to connect with the board game community
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            <div className="bg-stone-50 dark:bg-stone-800/50 p-6 sm:p-7 rounded-2xl border border-stone-200 dark:border-stone-700">
              <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">🎲</div>
              <h3 className="text-lg sm:text-xl font-bold text-stone-900 dark:text-stone-100 mb-2 sm:mb-3">
                Discover Events
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
                Find board game nights, tournaments, and meetups happening near you. Never miss a game night again.
              </p>
            </div>

            <div className="bg-stone-50 dark:bg-stone-800/50 p-6 sm:p-7 rounded-2xl border border-stone-200 dark:border-stone-700">
              <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">🎯</div>
              <h3 className="text-lg sm:text-xl font-bold text-stone-900 dark:text-stone-100 mb-2 sm:mb-3">
                Host Events
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
                Organize your own board game events with our easy-to-use platform. Manage registrations effortlessly.
              </p>
            </div>

            <div className="bg-stone-50 dark:bg-stone-800/50 p-6 sm:p-7 rounded-2xl border border-stone-200 dark:border-stone-700 sm:col-span-2 lg:col-span-1">
              <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">👥</div>
              <h3 className="text-lg sm:text-xl font-bold text-stone-900 dark:text-stone-100 mb-2 sm:mb-3">
                Build Community
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
                Connect with fellow board game enthusiasts, share experiences, and grow the gaming culture together.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-stone-900 dark:bg-stone-950 text-white border-t border-stone-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 text-center">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4">
            Ready to Join?
          </h2>
          <p className="text-sm sm:text-base lg:text-lg text-stone-300 dark:text-stone-400 mb-6 sm:mb-8 max-w-2xl mx-auto">
            Join thousands of board gamers across India. Find your next game night today.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <Link
              href={user ? "/events" : "/signup"}
              className="px-6 sm:px-8 py-3 sm:py-3.5 bg-white dark:bg-stone-100 text-stone-900 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-200 transition-all font-semibold text-sm sm:text-base"
            >
              {user ? "Browse Events" : "Get Started Free"}
            </Link>
            <Link
              href="/events/create"
              className="px-6 sm:px-8 py-3 sm:py-3.5 bg-stone-800 dark:bg-stone-800 text-white border-2 border-stone-700 dark:border-stone-700 rounded-xl hover:bg-stone-700 dark:hover:bg-stone-700 transition-all font-semibold text-sm sm:text-base"
            >
              Host an Event
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white dark:bg-stone-900 border-t border-stone-200 dark:border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 sm:gap-10 mb-8">
            <div className="col-span-2">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg sm:text-xl">🎲</span>
                <span className="text-sm sm:text-base font-bold text-stone-900 dark:text-stone-100">BoardGameCulture</span>
              </div>
              <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                India's premier platform for board game enthusiasts.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-stone-900 dark:text-stone-100 mb-3 text-xs sm:text-sm">Platform</h4>
              <ul className="space-y-2 text-xs">
                <li><Link href="/events" className="text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 transition">Browse Events</Link></li>
                <li><Link href="/events/create" className="text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 transition">Host Event</Link></li>
                <li><Link href="/dashboard" className="text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 transition">Dashboard</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-stone-900 dark:text-stone-100 mb-3 text-xs sm:text-sm">Company</h4>
              <ul className="space-y-2 text-xs">
                <li><Link href="#" className="text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 transition">About</Link></li>
                <li><Link href="#" className="text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 transition">Contact</Link></li>
                <li><Link href="#" className="text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 transition">Privacy</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-stone-200 dark:border-stone-800 pt-6 text-center text-xs text-stone-600 dark:text-stone-400">
            <p>&copy; 2026 BoardGameCulture. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
