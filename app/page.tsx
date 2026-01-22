import Link from 'next/link'
import Image from 'next/image'
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
    <div className="min-h-screen bg-stone-50">
      <Navigation />

      {/* Hero Section */}
      <section className="relative pt-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-28">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-stone-900 leading-tight mb-4 sm:mb-5">
              The home for board game events in India
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-stone-600 mb-7 sm:mb-8 max-w-2xl mx-auto">
              Discover meetups, tournaments, and game nights. Connect with players and build community.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
              <Link
                href="/events"
                className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-3.5 bg-stone-900 text-white rounded-xl hover:bg-stone-800 transition-all font-semibold text-sm sm:text-base text-center shadow-sm"
              >
                Explore Events
              </Link>
              {!user && (
                <Link
                  href="/signup"
                  className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-3.5 bg-white text-stone-900 border-2 border-stone-300 rounded-xl hover:border-stone-400 hover:bg-stone-50 transition-all font-semibold text-sm sm:text-base text-center"
                >
                  Sign Up Free
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-y border-stone-200 bg-stone-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
          <div className="grid grid-cols-3 gap-6 sm:gap-10 text-center">
            <div>
              <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-stone-900">500+</p>
              <p className="text-xs sm:text-sm lg:text-base text-stone-600 mt-2">Gamers</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-stone-900">100+</p>
              <p className="text-xs sm:text-sm lg:text-base text-stone-600 mt-2">Events</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-stone-900">15+</p>
              <p className="text-xs sm:text-sm lg:text-base text-stone-600 mt-2">Cities</p>
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      {upcomingEvents && upcomingEvents.length > 0 && (
        <section className="bg-stone-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 sm:mb-10">
              <div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-stone-900 mb-2">
                  Upcoming Events
                </h2>
                <p className="text-sm sm:text-base lg:text-lg text-stone-600">
                  Join the next board game gathering near you
                </p>
              </div>
              <Link
                href="/events"
                className="text-xs sm:text-sm text-stone-900 hover:text-brand-600 font-semibold flex items-center gap-2 transition"
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
          <div className="text-center mb-10 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-stone-900 mb-3 sm:mb-4">
              Why BoardGameCulture?
            </h2>
            <p className="text-sm sm:text-base lg:text-lg text-stone-600">
              Everything you need to connect with the board game community
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {/* Discover Events Card */}
            <Link
              href="/events"
              className="group relative h-64 sm:h-72 rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300"
            >
              <div className="absolute inset-0">
                <img
                  src="https://images.unsplash.com/photo-1606167668584-78701c57f13d?w=800&h=600&fit=crop&q=80"
                  alt="Discover Events"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent"></div>
              </div>
              <div className="absolute inset-0 flex flex-col justify-end p-6">
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 group-hover:text-brand-300 transition">
                  Discover Events
                </h3>
                <p className="text-sm text-white/90 leading-relaxed mb-4">
                  Find board game nights, tournaments, and meetups happening near you.
                </p>
                <div className="inline-flex items-center gap-2 text-sm font-semibold text-white group-hover:text-brand-300 transition">
                  Browse Events
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </div>
            </Link>

            {/* Host Events Card */}
            <Link
              href="/events/create"
              className="group relative h-64 sm:h-72 rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300"
            >
              <div className="absolute inset-0">
                <img
                  src="https://images.unsplash.com/photo-1632501641765-e568d28b0015?w=800&h=600&fit=crop&q=80"
                  alt="Host Events"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent"></div>
              </div>
              <div className="absolute inset-0 flex flex-col justify-end p-6">
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 group-hover:text-brand-300 transition">
                  Host Events
                </h3>
                <p className="text-sm text-white/90 leading-relaxed mb-4">
                  Organize your own board game events with our easy-to-use platform.
                </p>
                <div className="inline-flex items-center gap-2 text-sm font-semibold text-white group-hover:text-brand-300 transition">
                  Create Event
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </div>
            </Link>

            {/* Build Community Card */}
            <div className="group relative h-64 sm:h-72 rounded-2xl overflow-hidden sm:col-span-2 lg:col-span-1">
              <div className="absolute inset-0">
                <img
                  src="https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&h=600&fit=crop&q=80"
                  alt="Build Community"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent"></div>
              </div>
              <div className="absolute inset-0 flex flex-col justify-end p-6">
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">
                  Build Community
                </h3>
                <p className="text-sm text-white/90 leading-relaxed mb-4">
                  Connect with fellow board game enthusiasts and grow the gaming culture.
                </p>
                <div className="inline-flex items-center gap-2 text-sm font-semibold text-white/80">
                  Coming Soon
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-stone-900 text-white border-t border-stone-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 text-center">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4">
            Ready to Join?
          </h2>
          <p className="text-sm sm:text-base lg:text-lg text-stone-300 mb-6 sm:mb-8 max-w-2xl mx-auto">
            Join thousands of board gamers across India. Find your next game night today.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <Link
              href={user ? "/events" : "/signup"}
              className="px-6 sm:px-8 py-3 sm:py-3.5 bg-white text-stone-900 rounded-xl hover:bg-stone-100 transition-all font-semibold text-sm sm:text-base"
            >
              {user ? "Browse Events" : "Get Started Free"}
            </Link>
            <Link
              href="/events/create"
              className="px-6 sm:px-8 py-3 sm:py-3.5 bg-stone-800 text-white border-2 border-stone-700 rounded-xl hover:bg-stone-700 transition-all font-semibold text-sm sm:text-base"
            >
              Host an Event
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 sm:gap-10 mb-8">
            <div className="col-span-2">
              <Link href="/" className="flex items-center gap-2 mb-3 group">
                <div className="relative w-8 h-8">
                  <Image
                    src="/logo.png"
                    alt="BoardGameCulture"
                    fill
                    className="object-contain group-hover:scale-110 transition-transform"
                  />
                </div>
                <span className="text-base sm:text-lg font-bold text-stone-900">BoardGameCulture</span>
              </Link>
              <p className="text-sm text-stone-600 leading-relaxed max-w-sm">
                India's premier platform for board game enthusiasts. Discover events, connect with players, and build communities across cities. Join thousands of gamers hosting and attending board game nights, tournaments, and meetups.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-stone-900 mb-3 text-sm">Platform</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/events" className="text-stone-600 hover:text-stone-900 transition">Browse Events</Link></li>
                <li><Link href="/events/create" className="text-stone-600 hover:text-stone-900 transition">Host Event</Link></li>
                <li><Link href="/dashboard" className="text-stone-600 hover:text-stone-900 transition">Dashboard</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-stone-900 mb-3 text-sm">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="#" className="text-stone-600 hover:text-stone-900 transition">About</Link></li>
                <li><Link href="#" className="text-stone-600 hover:text-stone-900 transition">Contact</Link></li>
                <li><Link href="#" className="text-stone-600 hover:text-stone-900 transition">Privacy</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-stone-200 pt-6 text-center text-sm text-stone-600">
            <p>&copy; 2026 BoardGameCulture. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
