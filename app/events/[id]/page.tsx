import { createClient } from '@/lib/supabase/server'
import { getUser } from '@/lib/actions/auth'
import Link from 'next/link'
import Image from 'next/image'
import { format } from 'date-fns'
import { notFound } from 'next/navigation'
import RegisterButton from './RegisterButton'

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const supabase = await createClient()
  const user = await getUser()
  const { id } = await params

  // Fetch event details
  const { data: event, error } = await supabase
    .from('events')
    .select(`
      *,
      organizer:profiles!organizer_id(name, email),
      community:communities(name, slug)
    `)
    .eq('id', id)
    .single()

  if (error || !event) {
    notFound()
  }

  // Check if user is already registered
  let isRegistered = false
  let registration = null
  if (user) {
    const { data } = await supabase
      .from('event_registrations')
      .select('*')
      .eq('event_id', id)
      .eq('user_id', user.id)
      .single()

    if (data) {
      isRegistered = true
      registration = data
    }
  }

  // Check if event is full
  const { count: registrationCount } = await supabase
    .from('event_registrations')
    .select('*', { count: 'exact', head: true })
    .eq('event_id', id)
    .eq('status', 'confirmed')

  const isFull = event.max_attendees && registrationCount && registrationCount >= event.max_attendees
  const spotsLeft = event.max_attendees && registrationCount ? event.max_attendees - registrationCount : null
  const almostFull = spotsLeft !== null && spotsLeft <= 5 && spotsLeft > 0

  return (
    <div className="min-h-screen art-bg pt-16">
      {/* Fixed Header */}
      <header className="sticky top-16 z-40 bg-card/95 backdrop-blur-sm border-b-2 border-ink">
        <div className="container max-w-2xl mx-auto px-5 py-3">
          <Link
            href="/events"
            className="inline-flex items-center gap-2 text-sm font-bold text-foreground hover:text-coral transition uppercase tracking-wider"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Events
          </Link>
        </div>
      </header>

      <main className="container max-w-2xl mx-auto px-5 py-6 pb-36">
        {/* Event Header */}
        <div className="mb-6 animate-slide-up">
          {/* Date Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-coral border-2 border-ink mb-4">
            <svg className="w-4 h-4 text-ink" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="font-mono text-sm text-ink font-bold">
              {format(new Date(event.start_date), 'MMM dd, yyyy')}
            </span>
          </div>

          <h1 className="font-black text-3xl text-foreground mb-3 leading-tight">
            {event.title}
          </h1>

          {/* Community/Host */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-coral border-2 border-ink flex items-center justify-center">
              <div className="relative w-6 h-6">
                <Image src="/logo.png" alt="Host" width={24} height={24} className="object-contain" />
              </div>
            </div>
            <div>
              <p className="text-sm font-bold text-foreground">Hosted by</p>
              {event.community ? (
                <Link
                  href={`/communities/${event.community.slug}`}
                  className="text-xs text-coral font-bold hover:underline uppercase tracking-wider"
                >
                  {event.community.name}
                </Link>
              ) : (
                <p className="text-xs text-foreground font-bold uppercase tracking-wider">{event.organizer?.name || 'Community Organizer'}</p>
              )}
            </div>
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-2 gap-3 mb-6 animate-slide-up" style={{ animationDelay: '100ms' }}>
          <div className="bg-card border-2 border-ink p-4 shadow-[4px_4px_0_0_hsl(var(--ink))]">
            <div className="flex items-center gap-2 mb-1">
              <svg className="w-4 h-4 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-mono text-xs uppercase tracking-wider text-foreground font-bold">Time</span>
            </div>
            <p className="font-bold text-foreground">
              {format(new Date(event.start_date), 'p')}
            </p>
            {event.end_date && (
              <p className="text-xs text-muted-foreground font-mono mt-0.5">
                to {format(new Date(event.end_date), 'p')}
              </p>
            )}
          </div>

          <div className="bg-card border-2 border-ink p-4 shadow-[4px_4px_0_0_hsl(var(--ink))]">
            <div className="flex items-center gap-2 mb-1">
              <svg className="w-4 h-4 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
              </svg>
              <span className="font-mono text-xs uppercase tracking-wider text-foreground font-bold">Entry</span>
            </div>
            <p className={`font-bold ${event.ticket_price === 0 ? 'text-mint' : 'text-foreground'}`}>
              {event.ticket_price > 0 ? `₹${event.ticket_price}` : 'Free'}
            </p>
          </div>
        </div>

        {/* Venue Card */}
        <div className="bg-card border-2 border-ink p-4 shadow-[5px_5px_0_0_hsl(var(--grape))] mb-6 animate-slide-up" style={{ animationDelay: '150ms' }}>
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-grape flex items-center justify-center shrink-0">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="font-bold text-foreground mb-0.5">{event.location_venue || 'Venue TBA'}</p>
              {event.location_address && (
                <p className="text-sm text-foreground font-mono">{event.location_address}</p>
              )}
              <p className="text-sm text-foreground font-mono">{event.location_city}</p>
            </div>
            {event.location_address && (
              <a
                href={`https://maps.google.com/?q=${encodeURIComponent((event.location_venue || '') + ', ' + event.location_address)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 border-2 border-ink bg-card flex items-center justify-center hover:bg-grape hover:text-white transition-colors"
              >
                <svg className="w-4 h-4 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            )}
          </div>
        </div>

        {/* Attendees Card */}
        {event.max_attendees && (
          <div className="bg-card border-2 border-ink p-4 shadow-[5px_5px_0_0_hsl(var(--sunny))] mb-6 animate-slide-up" style={{ animationDelay: '200ms' }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-sunny flex items-center justify-center">
                  <svg className="w-5 h-5 text-ink" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div>
                  <p className="font-bold text-foreground">{registrationCount || 0} attending</p>
                  <p className="text-xs text-foreground font-mono">
                    {spotsLeft !== null && spotsLeft >= 0 ? `${spotsLeft} spots left of ${event.max_attendees}` : `Max ${event.max_attendees}`}
                  </p>
                </div>
              </div>
              {almostFull && (
                <span className="px-2 py-1 bg-coral text-white text-xs font-bold border-2 border-ink">
                  Almost full!
                </span>
              )}
            </div>
            {/* Progress Bar */}
            <div className="mt-3 h-2 bg-muted border-2 border-ink">
              <div
                className="h-full bg-sunny border-r-2 border-ink transition-all"
                style={{ width: `${event.max_attendees ? ((registrationCount || 0) / event.max_attendees) * 100 : 0}%` }}
              />
            </div>
          </div>
        )}

        {/* Description */}
        {event.description && (
          <div className="mb-8 animate-slide-up" style={{ animationDelay: '250ms' }}>
            <h2 className="font-bold text-lg text-foreground mb-3 flex items-center gap-2">
              <span className="w-6 h-0.5 bg-coral" />
              About this event
            </h2>
            <div
              className="text-muted-foreground leading-relaxed prose prose-stone prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: event.description }}
            />
          </div>
        )}

        {/* Event Photos Link */}
        <div className="mb-8 animate-slide-up" style={{ animationDelay: '275ms' }}>
          <Link
            href={`/events/${id}/photos`}
            className="block bg-card border-2 border-ink p-4 shadow-[4px_4px_0_0_hsl(var(--ink))] hover:shadow-[6px_6px_0_0_hsl(var(--ink))] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-grape flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="font-bold text-foreground">Event Photos</p>
                  <p className="text-xs font-mono text-foreground">
                    {user ? 'View gallery or upload photos' : 'View photos from this event'}
                  </p>
                </div>
              </div>
              <svg className="w-5 h-5 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Link>
        </div>

        {/* Organizer */}
        {event.organizer && (
          <div className="mb-8 animate-slide-up" style={{ animationDelay: '300ms' }}>
            <h2 className="font-bold text-lg text-foreground mb-3 flex items-center gap-2">
              <span className="w-6 h-0.5 bg-mint" />
              Organizer
            </h2>
            <div className="bg-card border-2 border-ink p-4 shadow-[4px_4px_0_0_hsl(var(--mint))]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-mint border-2 border-ink flex items-center justify-center">
                  <svg className="w-5 h-5 text-ink" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div>
                  <p className="font-bold text-foreground">{event.organizer.name}</p>
                  {event.community && (
                    <Link
                      href={`/communities/${event.community.slug}`}
                      className="text-xs text-mint font-bold hover:underline uppercase tracking-wider"
                    >
                      View Community →
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Fixed Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-t-2 border-ink">
        <div className="container max-w-2xl mx-auto px-5 py-4">
          {user ? (
            isRegistered ? (
              <div className="bg-mint border-2 border-ink p-4 shadow-[4px_4px_0_0_hsl(var(--ink))]">
                <p className="text-ink font-bold flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  You're registered for this event
                </p>
                <p className="text-xs text-ink/80 font-mono mt-1">
                  Status: <span className="font-bold capitalize">{registration?.status}</span>
                </p>
              </div>
            ) : isFull ? (
              <div className="bg-card border-2 border-ink p-4 shadow-[4px_4px_0_0_hsl(var(--ink))]">
                <p className="text-foreground font-bold">This event is full</p>
                <p className="text-xs text-muted-foreground font-mono mt-1">Check back for cancellations</p>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <p className="font-bold text-foreground">
                    {event.ticket_price === 0 ? 'Free Event' : `₹${event.ticket_price}`}
                  </p>
                  <p className="text-xs text-muted-foreground font-mono">
                    {spotsLeft !== null && spotsLeft > 0 ? `${spotsLeft} spots remaining` : 'Register now'}
                  </p>
                </div>
                <RegisterButton eventId={event.id} ticketPrice={event.ticket_price} />
              </div>
            )
          ) : (
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <p className="font-bold text-foreground">
                  {event.ticket_price === 0 ? 'Free Event' : `₹${event.ticket_price}`}
                </p>
                <p className="text-xs text-muted-foreground font-mono">Sign in to register</p>
              </div>
              <Link
                href="/login"
                className="px-8 py-3 font-bold text-sm border-2 border-ink bg-coral text-white shadow-[4px_4px_0_0_hsl(var(--ink))] transition-all hover:shadow-[6px_6px_0_0_hsl(var(--ink))] hover:-translate-x-0.5 hover:-translate-y-0.5 uppercase tracking-wider"
              >
                Sign In
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
