import { createClient } from '@/lib/supabase/server'
import { getUser } from '@/lib/actions/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { format } from 'date-fns'
import { Users, Check, Clock } from 'lucide-react'

export default async function AllAttendeesPage() {
  const supabase = await createClient()
  const user = await getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch all events by this organizer
  const { data: events } = await supabase
    .from('events')
    .select('id, title')
    .eq('organizer_id', user.id)

  const eventIds = events?.map(e => e.id) || []

  // Fetch all registrations for organizer's events
  const { data: registrations } = await supabase
    .from('event_registrations')
    .select(`
      *,
      attendee:profiles!user_id(name, email),
      event:events!event_id(title, start_date)
    `)
    .in('event_id', eventIds)
    .order('registered_at', { ascending: false })

  const totalAttendees = registrations?.length || 0
  const confirmedCount = registrations?.filter(r => r.status === 'confirmed').length || 0
  const pendingCount = registrations?.filter(r => r.status === 'pending_payment').length || 0

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-foreground uppercase">All Attendees</h1>
        <p className="text-foreground mt-1 font-mono">View all registrations across your events</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-grape/20 border-2 border-ink shadow-neo p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-mono uppercase tracking-wider text-foreground font-bold">Total Registrations</p>
              <p className="text-3xl font-black text-foreground mt-2">
                {totalAttendees}
              </p>
            </div>
            <div className="w-12 h-12 bg-grape border-2 border-ink flex items-center justify-center">
              <Users size={24} strokeWidth={2.5} className="text-white" />
            </div>
          </div>
        </div>

        <div className="bg-mint/20 border-2 border-ink shadow-neo p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-mono uppercase tracking-wider text-foreground font-bold">Confirmed</p>
              <p className="text-3xl font-black text-mint mt-2">{confirmedCount}</p>
            </div>
            <div className="w-12 h-12 bg-mint border-2 border-ink flex items-center justify-center">
              <Check size={24} strokeWidth={2.5} className="text-ink" />
            </div>
          </div>
        </div>

        <div className="bg-sunny/20 border-2 border-ink shadow-neo p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-mono uppercase tracking-wider text-foreground font-bold">Pending Payment</p>
              <p className="text-3xl font-black text-sunny mt-2">{pendingCount}</p>
            </div>
            <div className="w-12 h-12 bg-sunny border-2 border-ink flex items-center justify-center">
              <Clock size={24} strokeWidth={2.5} className="text-ink" />
            </div>
          </div>
        </div>
      </div>

      {/* Attendees List */}
      <div className="bg-card border-2 border-ink shadow-neo-lg overflow-hidden">
        <div className="p-4 sm:p-6 border-b-2 border-ink bg-coral/10">
          <h3 className="text-base sm:text-lg font-black text-foreground uppercase">All Attendees</h3>
        </div>

        {!registrations || registrations.length === 0 ? (
          <div className="p-8 sm:p-12 text-center">
            <div className="w-16 h-16 bg-grape border-2 border-ink flex items-center justify-center mx-auto mb-4">
              <Users size={32} strokeWidth={2.5} className="text-white" />
            </div>
            <h3 className="text-lg sm:text-xl font-black text-foreground mb-2 uppercase">No Attendees Yet</h3>
            <p className="text-foreground font-mono">
              When people register for your events, they'll appear here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted border-b-2 border-ink">
                <tr>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-mono font-bold text-foreground uppercase tracking-wider">
                    Attendee
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-mono font-bold text-foreground uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-mono font-bold text-foreground uppercase tracking-wider">
                    Event
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-mono font-bold text-foreground uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-mono font-bold text-foreground uppercase tracking-wider">
                    Registered
                  </th>
                </tr>
              </thead>
              <tbody className="bg-card divide-y-2 divide-border">
                {registrations.map((registration) => (
                  <tr key={registration.id} className="hover:bg-muted transition-colors">
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-black text-foreground">
                        {registration.attendee?.name || 'Unknown'}
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-foreground font-mono">
                        {registration.attendee?.email || 'N/A'}
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4">
                      <Link
                        href={`/organizer/events/${registration.event_id}/attendees`}
                        className="text-sm text-coral hover:underline font-bold"
                      >
                        {registration.event?.title || 'Unknown Event'}
                      </Link>
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 text-xs font-bold border-2 border-ink uppercase tracking-wider ${
                          registration.status === 'confirmed'
                            ? 'bg-mint text-ink'
                            : registration.status === 'pending_payment'
                            ? 'bg-sunny text-ink'
                            : 'bg-card text-foreground'
                        }`}
                      >
                        {registration.status}
                      </span>
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-foreground font-mono">
                      {registration.registered_at
                        ? format(new Date(registration.registered_at), 'PP p')
                        : 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
