import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import Navigation from '@/components/Navigation'
import EventCard from '@/components/EventCard'

export default async function EventsPage({
  searchParams,
}: {
  searchParams: Promise<{ city?: string }>
}) {
  const supabase = await createClient()
  const params = await searchParams

  // Build query
  let query = supabase
    .from('events')
    .select(`
      *,
      organizer:profiles!organizer_id(name, email),
      community:communities(name, slug)
    `)
    .eq('status', 'published')
    .eq('moderation_status', 'approved')
    .gte('start_date', new Date().toISOString())
    .order('start_date', { ascending: true })

  // Apply city filter if provided
  if (params.city) {
    query = query.ilike('location_city', `%${params.city}%`)
  }

  const { data: eventsData, error } = await query

  // Transform the data to flatten organizer array
  const events = eventsData?.map(event => ({
    ...event,
    organizer: Array.isArray(event.organizer) && event.organizer.length > 0
      ? event.organizer[0]
      : undefined,
    community: Array.isArray(event.community) && event.community.length > 0
      ? event.community[0]
      : undefined
  }))

  // Get unique cities for filter
  const { data: allEvents } = await supabase
    .from('events')
    .select('location_city')
    .eq('status', 'published')
    .eq('moderation_status', 'approved')

  const cities = Array.from(new Set(allEvents?.map(e => e.location_city) || []))
    .filter(Boolean)
    .sort()

  return (
    <div className="min-h-screen bg-stone-50 pt-16">
      <Navigation />

      {/* Hero Section */}
      <div className="bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-stone-900 mb-2 sm:mb-3">
            Discover Events
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-stone-600 max-w-2xl">
            Find and join board game meetups, tournaments, and game nights across India
          </p>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Filters */}
        <div className="bg-white rounded-xl border border-stone-200 p-4 sm:p-6 mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-4">
            <h2 className="text-base sm:text-lg font-semibold text-stone-900">Filter by City</h2>
            {params.city && (
              <Link
                href="/events"
                className="text-sm text-stone-600 hover:text-stone-900 font-medium self-start sm:self-auto"
              >
                Clear filters ×
              </Link>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/events"
              className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-sm font-medium transition ${
                !params.city
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              All Cities
            </Link>
            {cities.map((city) => (
              <Link
                key={city}
                href={`/events?city=${encodeURIComponent(city)}`}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-sm font-medium transition ${
                  params.city === city
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {city}
              </Link>
            ))}
          </div>
        </div>

        {/* Events Count */}
        {events && events.length > 0 && (
          <div className="mb-4 sm:mb-6">
            <p className="text-sm sm:text-base text-slate-600">
              <span className="font-semibold text-slate-900">{events.length}</span> upcoming event{events.length !== 1 ? 's' : ''}
              {params.city && ` in ${params.city}`}
            </p>
          </div>
        )}

        {/* Events List */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
            <p className="text-sm sm:text-base text-red-800">Error loading events: {error.message}</p>
          </div>
        )}

        {!events || events.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-8 sm:p-12 text-center">
            <div className="text-5xl sm:text-6xl lg:text-7xl mb-4">🎲</div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">No Events Found</h2>
            <p className="text-sm sm:text-base text-slate-600 mb-6 max-w-md mx-auto">
              {params.city
                ? `No upcoming events in ${params.city}. Try checking other cities or create your own event!`
                : 'No upcoming events at the moment. Be the first to create one!'}
            </p>
            <Link
              href="/events/create"
              className="inline-block px-5 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition font-semibold"
            >
              Create Your First Event
            </Link>
          </div>
        ) : (
          <>
            {/* Desktop: 4-column grid, Tablet: 2-column, Mobile: list */}
            <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-5">
              {events.map((event) => (
                <EventCard key={event.id} event={event} variant="grid" />
              ))}
            </div>

            {/* Mobile: List view */}
            <div className="sm:hidden space-y-3">
              {events.map((event) => (
                <EventCard key={event.id} event={event} variant="list" />
              ))}
            </div>
          </>
        )}

        {/* Create Event CTA */}
        {events && events.length > 0 && (
          <div className="mt-12 sm:mt-16 bg-white rounded-xl sm:rounded-2xl border-2 border-slate-200 p-6 sm:p-8 lg:p-12 text-center">
            <div className="max-w-2xl mx-auto">
              <div className="text-4xl sm:text-5xl mb-4">🎯</div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3 sm:mb-4">
                Host Your Own Event
              </h2>
              <p className="text-sm sm:text-base lg:text-lg text-slate-700 mb-5 sm:mb-6">
                Got a favorite game? Want to bring the community together? Create your own board game event and start building connections.
              </p>
              <Link
                href="/events/create"
                className="inline-block px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition font-semibold"
              >
                Create an Event →
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
