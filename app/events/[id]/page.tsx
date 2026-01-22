import { createClient } from '@/lib/supabase/server'
import { getUser } from '@/lib/actions/auth'
import Link from 'next/link'
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

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <Link
            href="/events"
            className="inline-flex items-center text-sm text-slate-600 hover:text-slate-900"
          >
            ← Back to Events
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Event Hero */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          {/* Event Image Placeholder */}
          <div className="h-64 bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center">
            <span className="text-8xl">🎲</span>
          </div>

          {/* Event Header */}
          <div className="p-8">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h1 className="text-4xl font-bold text-slate-900 mb-2">{event.title}</h1>
                {event.community && (
                  <Link
                    href={`/communities/${event.community.slug}`}
                    className="text-sm text-slate-600 hover:text-slate-900"
                  >
                    by {event.community.name}
                  </Link>
                )}
              </div>
              {event.status === 'published' && event.moderation_status === 'approved' && (
                <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                  Published
                </span>
              )}
            </div>

            {/* Event Meta */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="flex items-center gap-3 text-slate-700">
                <span className="text-2xl">📅</span>
                <div>
                  <p className="font-medium">{format(new Date(event.start_date), 'PPP')}</p>
                  <p className="text-sm text-slate-600">
                    {format(new Date(event.start_date), 'p')}
                    {event.end_date && ` - ${format(new Date(event.end_date), 'p')}`}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-slate-700">
                <span className="text-2xl">📍</span>
                <div>
                  <p className="font-medium">{event.location_venue || 'Venue TBA'}</p>
                  <p className="text-sm text-slate-600">{event.location_city}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-slate-700">
                <span className="text-2xl">👥</span>
                <div>
                  <p className="font-medium">
                    {registrationCount || 0} registered
                    {event.max_attendees && ` / ${event.max_attendees} max`}
                  </p>
                  {spotsLeft !== null && spotsLeft > 0 && (
                    <p className="text-sm text-slate-600">{spotsLeft} spots left</p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-3 text-slate-700">
                <span className="text-2xl">💰</span>
                <div>
                  <p className="font-medium">
                    {event.ticket_price > 0 ? `₹${event.ticket_price}` : 'Free Event'}
                  </p>
                  {event.ticket_price > 0 && (
                    <p className="text-sm text-slate-600">Per person</p>
                  )}
                </div>
              </div>
            </div>

            {/* Registration Button */}
            {user ? (
              isRegistered ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-green-800 font-medium flex items-center gap-2">
                    ✅ You're registered for this event
                  </p>
                  <p className="text-sm text-green-700 mt-1">
                    Status: <span className="font-medium capitalize">{registration?.status}</span>
                  </p>
                </div>
              ) : isFull ? (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-yellow-800 font-medium">⚠️ This event is full</p>
                </div>
              ) : (
                <RegisterButton eventId={event.id} ticketPrice={event.ticket_price} />
              )
            ) : (
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                <p className="text-slate-700 mb-3">Sign in to register for this event</p>
                <Link
                  href="/login"
                  className="inline-block px-6 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition font-medium"
                >
                  Sign In
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Event Description */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">About This Event</h2>
          <div
            className="prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: event.description }}
          />
        </div>

        {/* Venue Details */}
        {event.location_address && (
          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Venue</h2>
            <div className="space-y-2">
              <p className="text-slate-700 font-medium">{event.location_venue}</p>
              <p className="text-slate-600 whitespace-pre-line">{event.location_address}</p>
              <p className="text-slate-600">{event.location_city}</p>
            </div>
          </div>
        )}

        {/* Organizer Info */}
        {event.organizer && (
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Organizer</h2>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center">
                <span className="text-2xl">👤</span>
              </div>
              <div>
                <p className="font-medium text-slate-900">{event.organizer.name}</p>
                <p className="text-sm text-slate-600">{event.organizer.email}</p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
