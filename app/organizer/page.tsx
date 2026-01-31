import { createClient } from '@/lib/supabase/server'
import { getUser } from '@/lib/actions/auth'
import Link from 'next/link'
import { format } from 'date-fns'
import { Calendar, Check, Clock, MapPin, DollarSign, Users, Edit, Eye } from 'lucide-react'

export default async function OrganizerDashboard() {
  const supabase = await createClient()
  const user = await getUser()

  // Fetch organizer's events
  const { data: events } = await supabase
    .from('events')
    .select(`
      *,
      registrations:event_registrations(count)
    `)
    .eq('organizer_id', user!.id)
    .order('created_at', { ascending: false })

  // Calculate stats
  const totalEvents = events?.length || 0
  const publishedEvents = events?.filter(e => e.status === 'published').length || 0
  const pendingEvents = events?.filter(e => e.moderation_status === 'pending').length || 0

  return (
    <div className="space-y-6 sm:space-y-8">
      <div>
        <h2 className="text-2xl sm:text-3xl font-black text-foreground uppercase">My Events</h2>
        <p className="text-foreground mt-1 font-mono">Manage all your events in one place</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-coral/20 border-2 border-ink shadow-neo p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-mono uppercase tracking-wider text-foreground font-bold">Total Events</p>
              <p className="text-3xl font-black text-foreground mt-2">{totalEvents}</p>
            </div>
            <div className="w-12 h-12 bg-coral border-2 border-ink flex items-center justify-center">
              <Calendar size={24} strokeWidth={2.5} className="text-white" />
            </div>
          </div>
        </div>

        <div className="bg-mint/20 border-2 border-ink shadow-neo p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-mono uppercase tracking-wider text-foreground font-bold">Published</p>
              <p className="text-3xl font-black text-mint mt-2">{publishedEvents}</p>
            </div>
            <div className="w-12 h-12 bg-mint border-2 border-ink flex items-center justify-center">
              <Check size={24} strokeWidth={2.5} className="text-ink" />
            </div>
          </div>
        </div>

        <div className="bg-sunny/20 border-2 border-ink shadow-neo p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-mono uppercase tracking-wider text-foreground font-bold">Pending Approval</p>
              <p className="text-3xl font-black text-sunny mt-2">{pendingEvents}</p>
            </div>
            <div className="w-12 h-12 bg-sunny border-2 border-ink flex items-center justify-center">
              <Clock size={24} strokeWidth={2.5} className="text-ink" />
            </div>
          </div>
        </div>
      </div>

      {/* Events List */}
      {!events || events.length === 0 ? (
        <div className="bg-card border-2 border-ink shadow-neo-lg p-8 sm:p-12 text-center">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-coral border-2 border-ink flex items-center justify-center mx-auto mb-4">
            <Calendar size={32} strokeWidth={2.5} className="text-white" />
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-foreground mb-2 uppercase">No Events Yet</h3>
          <p className="text-foreground mb-6 font-mono">
            Create your first event and start building your community!
          </p>
          <Link
            href="/events/create"
            className="inline-flex items-center gap-2 px-6 py-3 bg-coral text-white border-2 border-ink shadow-neo hover:shadow-neo-lg hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all font-bold uppercase tracking-wider"
          >
            Create Your First Event →
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {events.map((event) => {
            const registrationCount = event.registrations?.[0]?.count || 0

            return (
              <div
                key={event.id}
                className="bg-card border-2 border-ink shadow-neo hover:shadow-neo-lg hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all p-4 sm:p-6"
              >
                <div className="flex flex-col lg:flex-row items-start justify-between gap-4">
                  {/* Event Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <Link
                        href={`/events/${event.id}`}
                        target="_blank"
                        className="text-lg sm:text-xl font-black text-foreground hover:text-coral transition"
                      >
                        {event.title}
                      </Link>
                      <span
                        className={`px-3 py-1 text-xs font-bold border-2 border-ink uppercase tracking-wider ${
                          event.status === 'published'
                            ? 'bg-mint text-ink'
                            : event.status === 'draft'
                            ? 'bg-card text-foreground'
                            : event.status === 'cancelled'
                            ? 'bg-coral text-white'
                            : 'bg-sunny text-ink'
                        }`}
                      >
                        {event.status}
                      </span>
                      <span
                        className={`px-3 py-1 text-xs font-bold border-2 border-ink uppercase tracking-wider ${
                          event.moderation_status === 'approved'
                            ? 'bg-mint text-ink'
                            : event.moderation_status === 'pending'
                            ? 'bg-sunny text-ink'
                            : 'bg-coral text-white'
                        }`}
                      >
                        {event.moderation_status}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 text-sm text-foreground mb-4">
                      <div className="flex items-center gap-2 font-mono">
                        <Calendar size={16} strokeWidth={2.5} className="text-coral" />
                        <span className="font-bold">{format(new Date(event.start_date), 'PP')}</span>
                      </div>
                      <div className="flex items-center gap-2 font-mono">
                        <MapPin size={16} strokeWidth={2.5} className="text-grape" />
                        <span className="font-bold">{event.location_city}</span>
                      </div>
                      <div className="flex items-center gap-2 font-mono">
                        <DollarSign size={16} strokeWidth={2.5} className="text-sunny" />
                        <span className="font-bold">
                          {event.ticket_price > 0 ? `₹${event.ticket_price}` : 'Free'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 font-mono">
                        <Users size={16} strokeWidth={2.5} className="text-mint" />
                        <span className="font-bold">{registrationCount}
                        {event.max_attendees && ` / ${event.max_attendees}`}</span>
                      </div>
                    </div>

                    {event.moderation_status === 'rejected' && event.admin_notes && (
                      <div className="mt-3 p-3 bg-coral border-2 border-ink shadow-neo-sm">
                        <p className="text-sm text-white font-bold">
                          <strong>Rejection Reason:</strong> {event.admin_notes}
                        </p>
                      </div>
                    )}

                    {event.moderation_status === 'pending' && (
                      <div className="mt-3 p-3 bg-sunny border-2 border-ink shadow-neo-sm">
                        <p className="text-sm text-ink font-bold">
                          ⏳ Your event is pending approval. We typically review events within 24 hours.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-row lg:flex-col gap-2 w-full lg:w-auto">
                    {event.status !== 'cancelled' && (
                      <>
                        <Link
                          href={`/organizer/events/${event.id}/edit`}
                          className="flex-1 lg:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-coral text-white border-2 border-ink shadow-neo-sm hover:shadow-neo hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all font-bold text-sm uppercase tracking-wider"
                        >
                          <Edit size={16} strokeWidth={2.5} />
                          Edit
                        </Link>
                        <Link
                          href={`/organizer/events/${event.id}/attendees`}
                          className="flex-1 lg:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-grape text-white border-2 border-ink shadow-neo-sm hover:shadow-neo hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all font-bold text-sm uppercase tracking-wider"
                        >
                          <Eye size={16} strokeWidth={2.5} />
                          Attendees
                        </Link>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
