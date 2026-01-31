import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import Navigation from '@/components/Navigation'
import { EventCard as NeoEventCard } from '@/components/neo'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, X } from 'lucide-react'
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
    <div className="min-h-screen bg-background art-bg pt-16">
      <Navigation />

      {/* Hero Section */}
      <div className="bg-card border-b-2 border-ink">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-foreground mb-2 sm:mb-3 uppercase">
            Discover Events
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-2xl font-mono">
            Find and join board game meetups, tournaments, and game nights across India
          </p>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Filters */}
        <div className="bg-card border-2 border-ink shadow-neo p-4 sm:p-6 mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl">📍</span>
              <h2 className="text-base sm:text-lg font-black text-foreground uppercase tracking-wider">Filter by City</h2>
            </div>
            {params.city && (
              <Link
                href="/events"
                className="flex items-center gap-1 px-3 py-1.5 bg-coral text-white border-2 border-ink shadow-neo-sm hover:shadow-neo hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all text-xs font-bold uppercase tracking-wider self-start sm:self-auto"
              >
                <X size={12} strokeWidth={3} /> Clear Filter
              </Link>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/events"
              className={`px-3 sm:px-4 py-1.5 sm:py-2 border-2 border-ink text-sm font-bold uppercase tracking-wider transition-all ${
                !params.city
                  ? 'bg-grape text-white shadow-neo'
                  : 'bg-card text-foreground shadow-neo-sm hover:shadow-neo hover:-translate-x-0.5 hover:-translate-y-0.5'
              }`}
            >
              All Cities
            </Link>
            {cities.map((city) => (
              <Link
                key={city}
                href={`/events?city=${encodeURIComponent(city)}`}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 border-2 border-ink text-sm font-bold uppercase tracking-wider transition-all ${
                  params.city === city
                    ? 'bg-coral text-white shadow-neo'
                    : 'bg-card text-foreground shadow-neo-sm hover:shadow-neo hover:-translate-x-0.5 hover:-translate-y-0.5'
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
            <p className="text-sm sm:text-base text-muted-foreground font-mono">
              <span className="font-black text-foreground text-lg">{events.length}</span> upcoming event{events.length !== 1 ? 's' : ''}
              {params.city && ` in ${params.city}`}
            </p>
          </div>
        )}

        {/* Events List */}
        {error && (
          <div className="bg-coral/10 border-2 border-coral p-4 mb-8 shadow-neo">
            <p className="text-sm sm:text-base text-coral font-bold font-mono">Error loading events: {error.message}</p>
          </div>
        )}

        {!events || events.length === 0 ? (
          <div className="bg-card border-2 border-ink shadow-neo-lg p-8 sm:p-12 text-center">
            <div className="text-5xl sm:text-6xl lg:text-7xl mb-4">🎲</div>
            <h2 className="text-xl sm:text-2xl font-black text-foreground mb-2 uppercase">No Events Found</h2>
            <p className="text-sm sm:text-base text-muted-foreground mb-6 max-w-md mx-auto font-mono">
              {params.city
                ? `No upcoming events in ${params.city}. Try checking other cities or create your own event!`
                : 'No upcoming events at the moment. Be the first to create one!'}
            </p>
            <Link
              href="/events/create"
              className="inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base bg-coral text-primary-foreground border-2 border-ink shadow-neo hover:shadow-neo-lg hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all font-bold uppercase tracking-wider"
            >
              Create Your First Event <ArrowRight size={16} strokeWidth={3} />
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {events.map((event, index) => {
              const colors = ['coral', 'grape', 'sunny', 'mint'] as const
              const accent = colors[index % colors.length]
              const eventDate = format(new Date(event.start_date), 'MMM dd')
              const eventTime = format(new Date(event.start_date), 'p')

              return (
                <NeoEventCard
                  key={event.id}
                  id={event.id}
                  title={event.title}
                  date={eventDate}
                  time={eventTime}
                  venue={event.location_city || 'TBA'}
                  price={event.ticket_price || 0}
                  accent={accent}
                />
              )
            })}
          </div>
        )}

        {/* Create Event CTA */}
        {events && events.length > 0 && (
          <div className="mt-12 sm:mt-16 bg-coral border-2 border-ink shadow-neo-lg p-6 sm:p-8 lg:p-12 text-center relative overflow-hidden">
            <div className="max-w-2xl mx-auto relative z-10">
              <div className="text-4xl sm:text-5xl mb-4 flex items-center justify-center gap-2 animate-float">
                🎲 🎯 🎲
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white mb-3 sm:mb-4 uppercase">
                Host Your Own Event
              </h2>
              <p className="text-sm sm:text-base lg:text-lg text-white/90 mb-5 sm:mb-6 font-mono">
                Got a favorite game? Want to bring the community together? Create your own board game event and start building connections.
              </p>
              <Link
                href="/events/create"
                className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg bg-sunny text-ink border-2 border-ink shadow-[4px_4px_0_0_hsl(var(--ink))] hover:shadow-[6px_6px_0_0_hsl(var(--ink))] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all font-bold uppercase tracking-wider"
              >
                Create an Event <ArrowRight size={20} strokeWidth={3} />
              </Link>
            </div>
            {/* Decorative board game elements */}
            <div className="absolute top-4 left-4 text-2xl opacity-20 animate-float">🎲</div>
            <div className="absolute top-8 right-8 text-3xl opacity-20 animate-float" style={{ animationDelay: '0.5s' }}>♟️</div>
            <div className="absolute bottom-6 left-12 text-2xl opacity-20 animate-float" style={{ animationDelay: '1s' }}>🃏</div>
            <div className="absolute bottom-4 right-16 text-2xl opacity-20 animate-float" style={{ animationDelay: '1.5s' }}>🎮</div>
          </div>
        )}
      </main>
    </div>
  )
}
