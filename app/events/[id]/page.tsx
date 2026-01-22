import { createClient } from '@/lib/supabase/server'
import { getUser } from '@/lib/actions/auth'
import Link from 'next/link'
import { format } from 'date-fns'
import { notFound } from 'next/navigation'
import RegisterButton from './RegisterButton'
import Navigation from '@/components/Navigation'

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

  return (
    <div className="min-h-screen bg-off-white">
      <Navigation />

      {/* Breadcrumb */}
      <div className="bg-white border-b border-stone-200">
        <div className="max-w-4xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <Link
            href="/events"
            className="inline-flex items-center text-sm text-stone-600 hover:text-stone-900 font-medium transition"
          >
            ← Back to Events
          </Link>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Event Hero */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-6">
          {/* Event Image */}
          <div className="relative h-64 sm:h-80 overflow-hidden bg-stone-200">
            <img
              src="https://images.unsplash.com/photo-1606167668584-78701c57f13d?w=800&h=400&fit=crop&q=80"
              alt={event.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
          </div>

          {/* Event Header */}
          <div className="p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row items-start justify-between gap-4 mb-6">
              <div className="flex-1">
                <h1 className="text-3xl sm:text-4xl font-bold text-stone-900 mb-2">{event.title}</h1>
                {event.community && (
                  <Link
                    href={`/communities/${event.community.slug}`}
                    className="text-sm text-stone-600 hover:text-brand-600 font-medium transition"
                  >
                    by {event.community.name}
                  </Link>
                )}
              </div>
              {event.status === 'published' && event.moderation_status === 'approved' && (
                <span className="px-3 py-1 bg-green-50 border border-green-200 text-green-800 text-sm font-medium rounded-full">
                  Published
                </span>
              )}
            </div>

            {/* Event Meta */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6">
              <div className="flex items-start gap-3">
                <span className="text-2xl mt-0.5">📅</span>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-stone-900">{format(new Date(event.start_date), 'PPP')}</p>
                  <p className="text-sm text-stone-600 mt-0.5">
                    {format(new Date(event.start_date), 'p')}
                    {event.end_date && ` - ${format(new Date(event.end_date), 'p')}`}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl mt-0.5">📍</span>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-stone-900">{event.location_venue || 'Venue TBA'}</p>
                  <p className="text-sm text-stone-600 mt-0.5">{event.location_city}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl mt-0.5">👥</span>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-stone-900">
                    {registrationCount || 0} registered
                    {event.max_attendees && ` / ${event.max_attendees} max`}
                  </p>
                  {spotsLeft !== null && spotsLeft > 0 && (
                    <p className="text-sm text-stone-600 mt-0.5">{spotsLeft} spots left</p>
                  )}
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl mt-0.5">💰</span>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-stone-900">
                    {event.ticket_price > 0 ? `₹${event.ticket_price}` : 'Free Event'}
                  </p>
                  {event.ticket_price > 0 && (
                    <p className="text-sm text-stone-600 mt-0.5">Per person</p>
                  )}
                </div>
              </div>
            </div>

            {/* Registration Button */}
            {user ? (
              isRegistered ? (
                <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                  <p className="text-green-800 font-semibold flex items-center gap-2">
                    ✓ You're registered for this event
                  </p>
                  <p className="text-sm text-green-700 mt-1">
                    Status: <span className="font-semibold capitalize">{registration?.status}</span>
                  </p>
                </div>
              ) : isFull ? (
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                  <p className="text-yellow-800 font-semibold">This event is full</p>
                </div>
              ) : (
                <RegisterButton eventId={event.id} ticketPrice={event.ticket_price} />
              )
            ) : (
              <div className="bg-stone-50 border border-stone-200 rounded-xl p-4">
                <p className="text-stone-700 mb-3 font-medium">Sign in to register for this event</p>
                <Link
                  href="/login"
                  className="inline-block px-6 py-3 bg-stone-900 text-white rounded-xl hover:bg-stone-800 transition font-semibold shadow-sm"
                >
                  Sign In
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Event Description */}
        <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-8 mb-6">
          <h2 className="text-2xl font-bold text-stone-900 mb-4">About This Event</h2>
          <div
            className="prose prose-stone prose-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: event.description }}
          />
        </div>

        {/* Venue Details */}
        {event.location_address && (
          <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-8 mb-6">
            <h2 className="text-2xl font-bold text-stone-900 mb-4">Venue</h2>
            <div className="space-y-2">
              <p className="text-stone-900 font-semibold">{event.location_venue}</p>
              <p className="text-stone-600 whitespace-pre-line">{event.location_address}</p>
              <p className="text-stone-600">{event.location_city}</p>
            </div>
          </div>
        )}

        {/* Organizer Info */}
        {event.organizer && (
          <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-stone-900 mb-4">Organizer</h2>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-stone-200 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">👤</span>
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-stone-900">{event.organizer.name}</p>
                <p className="text-sm text-stone-600 truncate">{event.organizer.email}</p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
