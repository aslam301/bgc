import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import Navigation from '@/components/Navigation'
import { format } from 'date-fns'
import { SectionHeader, StatBadge, QuickActionButton } from '@/components/neo'
import { Calendar, Plus, Clipboard, Sparkles, MessageSquare, Trophy, BarChart3, Users } from 'lucide-react'

export default async function DashboardPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Get user profile from database
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  // Get user stats
  const { count: myEventsCount } = await supabase
    .from('events')
    .select('*', { count: 'exact', head: true })
    .eq('organizer_id', user.id)

  // Get user's registered events
  const { data: registrations } = await supabase
    .from('event_registrations')
    .select(`
      *,
      event:events(*)
    `)
    .eq('user_id', user.id)
    .order('registered_at', { ascending: false })
    .limit(5)

  const confirmedRegistrations = registrations?.filter(r => r.status === 'confirmed') || []

  return (
    <div className="min-h-screen bg-background art-bg pt-16">
      <Navigation />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="bg-coral border-2 border-ink shadow-neo-lg p-6 sm:p-8 mb-8">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black mb-2 text-ink uppercase">
                Welcome back, {profile?.name || 'Gamer'}!
              </h1>
              <p className="text-ink/80 font-mono">
                Ready for your next board game adventure?
              </p>
            </div>
            <div className="hidden sm:block text-5xl sm:text-6xl text-ink/20">🎲</div>
          </div>
        </div>

        {/* Quick Stats */}
        <SectionHeader number="01" title="Your Stats" className="mb-6" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <Link
            href="/organizer"
            className="bg-sunny/20 border-2 border-ink shadow-neo hover:shadow-neo-lg hover:-translate-x-1 hover:-translate-y-1 transition-all p-6"
          >
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-mono uppercase tracking-wider text-foreground font-bold">Events Created</p>
              <div className="w-10 h-10 bg-sunny border-2 border-ink flex items-center justify-center">
                <Clipboard size={20} strokeWidth={2.5} className="text-ink" />
              </div>
            </div>
            <p className="text-3xl font-black text-foreground tracking-tight">{myEventsCount || 0}</p>
            <p className="text-xs text-coral mt-2 font-bold uppercase tracking-wider">Manage →</p>
          </Link>

          <div className="bg-mint/20 border-2 border-ink shadow-neo p-6">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-mono uppercase tracking-wider text-foreground font-bold">Registered</p>
              <div className="w-10 h-10 bg-mint border-2 border-ink flex items-center justify-center">
                <Calendar size={20} strokeWidth={2.5} className="text-ink" />
              </div>
            </div>
            <p className="text-3xl font-black text-foreground tracking-tight">{confirmedRegistrations.length}</p>
            <p className="text-xs text-foreground mt-2 font-mono uppercase tracking-wider">Active</p>
          </div>

          <div className="bg-grape/20 border-2 border-ink shadow-neo p-6">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-mono uppercase tracking-wider text-foreground font-bold">Rank</p>
              <div className="w-10 h-10 bg-grape border-2 border-ink flex items-center justify-center">
                <Sparkles size={20} strokeWidth={2.5} className="text-white" />
              </div>
            </div>
            <p className="text-2xl font-black text-foreground tracking-tight uppercase">
              {(myEventsCount !== null && myEventsCount > 0) ? 'Organizer' : 'Player'}
            </p>
            <p className="text-xs text-foreground mt-2 font-mono uppercase tracking-wider">Keep Gaming!</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Registered Events */}
            <div>
              <SectionHeader number="02" title="My Registered Events" className="mb-6" />
              <div className="bg-card border-2 border-ink shadow-neo-lg">
                {!registrations || registrations.length === 0 ? (
                  <div className="p-12 text-center">
                    <div className="w-16 h-16 bg-mint border-2 border-ink flex items-center justify-center mx-auto mb-4">
                      <Calendar size={32} strokeWidth={2.5} className="text-ink" />
                    </div>
                    <h3 className="text-lg font-black text-foreground mb-2 uppercase">
                      No Events Yet
                    </h3>
                    <p className="text-foreground mb-6 font-mono">
                      Discover and register for board game events near you
                    </p>
                    <Link
                      href="/events"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-coral text-white border-2 border-ink shadow-neo hover:shadow-neo-lg hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all font-bold uppercase tracking-wider"
                    >
                      Browse Events →
                    </Link>
                  </div>
                ) : (
                  <div className="divide-y-2 divide-border">
                    {registrations.map((reg) => (
                      <Link
                        key={reg.id}
                        href={`/events/${reg.event.id}`}
                        className="block p-6 hover:bg-muted transition-colors"
                      >
                        <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <h3 className="font-black text-foreground mb-2 hover:text-coral transition">
                              {reg.event.title}
                            </h3>
                            <div className="space-y-1 text-sm text-foreground font-mono">
                              <p>📅 {format(new Date(reg.event.start_date), 'PPP')}</p>
                              <p>📍 {reg.event.location_city}</p>
                            </div>
                          </div>
                          <div className="text-left sm:text-right">
                            <span
                              className={`inline-block px-3 py-1 text-xs font-bold border-2 border-ink uppercase tracking-wider ${
                                reg.status === 'confirmed'
                                  ? 'bg-mint text-ink'
                                  : reg.status === 'pending_payment'
                                  ? 'bg-sunny text-ink'
                                  : 'bg-card text-foreground'
                              }`}
                            >
                              {reg.status === 'confirmed' ? '✓ Confirmed' : reg.status}
                            </span>
                            {reg.event.ticket_price > 0 && (
                              <p className="text-sm font-black text-foreground mt-2">
                                ₹{reg.event.ticket_price}
                              </p>
                            )}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Become Organizer Card - Moved to top */}
            {(!myEventsCount || myEventsCount === 0) && (
              <div className="bg-grape border-2 border-ink shadow-neo-lg p-6">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 bg-coral border-2 border-ink flex items-center justify-center flex-shrink-0">
                    <Clipboard size={20} strokeWidth={2.5} className="text-white" />
                  </div>
                  <h3 className="text-lg font-black text-white uppercase">
                    Become an Organizer
                  </h3>
                </div>
                <p className="text-sm text-white/90 mb-4 font-mono">
                  Host your own board game events! Create meetups, tournaments, and game nights. Build your community and bring gamers together.
                </p>
                <ul className="space-y-1.5 mb-4 text-xs text-white/90 font-mono">
                  <li className="flex items-center gap-2">
                    <span className="w-4 h-4 bg-sunny border-2 border-ink flex items-center justify-center flex-shrink-0 text-[10px] font-bold text-ink">✓</span>
                    <span>Free event hosting</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-4 h-4 bg-sunny border-2 border-ink flex items-center justify-center flex-shrink-0 text-[10px] font-bold text-ink">✓</span>
                    <span>Manage registrations easily</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-4 h-4 bg-sunny border-2 border-ink flex items-center justify-center flex-shrink-0 text-[10px] font-bold text-ink">✓</span>
                    <span>Track attendees and payments</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-4 h-4 bg-sunny border-2 border-ink flex items-center justify-center flex-shrink-0 text-[10px] font-bold text-ink">✓</span>
                    <span>Build your gaming community</span>
                  </li>
                </ul>
                <Link
                  href="/events/create"
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-coral text-white border-2 border-ink shadow-[3px_3px_0_0_hsl(var(--ink))] hover:shadow-[5px_5px_0_0_hsl(var(--ink))] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all font-bold text-sm uppercase tracking-wider"
                >
                  Create First Event →
                </Link>
              </div>
            )}

            {/* Profile Card */}
            <div className="bg-coral/20 border-2 border-ink shadow-neo p-6">
              <h3 className="font-black text-foreground mb-4 text-xs uppercase tracking-wider">Profile</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-foreground text-xs mb-1 font-mono uppercase tracking-wider font-bold">Name</p>
                  <p className="font-black text-foreground">{profile?.name || 'Not set'}</p>
                </div>
                <div>
                  <p className="text-foreground text-xs mb-1 font-mono uppercase tracking-wider font-bold">Email</p>
                  <p className="font-black text-foreground truncate">{user.email}</p>
                </div>
                <div>
                  <p className="text-foreground text-xs mb-1 font-mono uppercase tracking-wider font-bold">Role</p>
                  <span className="inline-block px-2 py-1 bg-mint text-ink border-2 border-ink text-xs font-bold uppercase tracking-wider">
                    {profile?.role || 'user'}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div>
              <h3 className="font-black text-foreground mb-4 text-xs uppercase tracking-wider">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-2">
                <QuickActionButton icon={Calendar} label="Browse" href="/events" color="coral" />
                <QuickActionButton icon={Plus} label="Create" href="/events/create" color="sunny" />
                {(myEventsCount !== null && myEventsCount > 0) && (
                  <QuickActionButton icon={Clipboard} label="Manage" href="/organizer" color="grape" />
                )}
              </div>
            </div>

            {/* Coming Soon */}
            <div className="bg-muted border-2 border-border shadow-neo p-6">
              <h3 className="font-black text-foreground mb-3 text-xs uppercase tracking-wider">Coming Soon</h3>
              <ul className="space-y-2 text-sm text-muted-foreground font-mono">
                <li className="flex items-center gap-2">
                  <MessageSquare size={16} strokeWidth={2.5} />
                  <span>Discussions</span>
                </li>
                <li className="flex items-center gap-2">
                  <Trophy size={16} strokeWidth={2.5} />
                  <span>Badges</span>
                </li>
                <li className="flex items-center gap-2">
                  <BarChart3 size={16} strokeWidth={2.5} />
                  <span>Statistics</span>
                </li>
                <li className="flex items-center gap-2">
                  <Users size={16} strokeWidth={2.5} />
                  <span>Friends</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
