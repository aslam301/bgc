import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { format } from 'date-fns'

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

  const { data: events, error } = await query

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
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Board Game Events</h1>
              <p className="text-slate-600 mt-1">Discover upcoming board game events across India</p>
            </div>
            <Link
              href="/"
              className="px-4 py-2 text-sm text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition"
            >
              ← Home
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Filter by City</h2>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/events"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
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
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
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

        {/* Events List */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
            <p className="text-red-800">Error loading events: {error.message}</p>
          </div>
        )}

        {!events || events.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="text-6xl mb-4">📅</div>
            <h2 className="text-2xl font-semibold text-slate-900 mb-2">No Events Found</h2>
            <p className="text-slate-600 mb-6">
              {params.city
                ? `No upcoming events in ${params.city}`
                : 'No upcoming events at the moment'}
            </p>
            <Link
              href="/events/create"
              className="inline-block px-6 py-3 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition font-medium"
            >
              Create Your First Event
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <Link
                key={event.id}
                href={`/events/${event.id}`}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition overflow-hidden group"
              >
                {/* Event Image Placeholder */}
                <div className="h-48 bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center">
                  <span className="text-6xl">🎲</span>
                </div>

                <div className="p-6">
                  {/* Event Title */}
                  <h3 className="text-xl font-semibold text-slate-900 group-hover:text-slate-700 mb-2">
                    {event.title}
                  </h3>

                  {/* Event Details */}
                  <div className="space-y-2 text-sm text-slate-600">
                    <div className="flex items-center gap-2">
                      <span>📅</span>
                      <span>{format(new Date(event.start_date), 'PPP')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>⏰</span>
                      <span>{format(new Date(event.start_date), 'p')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>📍</span>
                      <span>{event.location_city}</span>
                    </div>
                    {event.ticket_price > 0 ? (
                      <div className="flex items-center gap-2">
                        <span>💰</span>
                        <span className="font-semibold text-slate-900">₹{event.ticket_price}</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span>🎟️</span>
                        <span className="font-semibold text-green-600">Free Event</span>
                      </div>
                    )}
                  </div>

                  {/* Organizer */}
                  {event.organizer && (
                    <div className="mt-4 pt-4 border-t border-slate-200">
                      <p className="text-xs text-slate-500">
                        Organized by <span className="font-medium text-slate-700">{event.organizer.name}</span>
                      </p>
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Create Event CTA */}
        {events && events.length > 0 && (
          <div className="mt-12 text-center">
            <p className="text-slate-600 mb-4">Want to host your own board game event?</p>
            <Link
              href="/events/create"
              className="inline-block px-6 py-3 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition font-medium"
            >
              Create an Event
            </Link>
          </div>
        )}
      </main>
    </div>
  )
}
