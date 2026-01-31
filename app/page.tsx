import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'
import Navigation from '@/components/Navigation'
import { EventCard as NeoEventCard, StatBadge } from '@/components/neo'
import { Card } from '@/components/ui/card'
import { ArrowRight } from 'lucide-react'
import { format } from 'date-fns'

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
    <div className="min-h-screen bg-background art-bg">
      <Navigation />

      {/* Hero Section */}
      <section className="relative pt-16 overflow-hidden">
        <div className="absolute top-20 left-10 text-6xl opacity-10 animate-float">🎲</div>
        <div className="absolute top-32 right-20 text-5xl opacity-10 animate-float" style={{ animationDelay: '0.5s' }}>♟️</div>
        <div className="absolute bottom-20 left-1/4 text-4xl opacity-10 animate-float" style={{ animationDelay: '1s' }}>🎯</div>
        <div className="absolute bottom-32 right-1/4 text-5xl opacity-10 animate-float" style={{ animationDelay: '1.5s' }}>🃏</div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-28 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="text-5xl sm:text-6xl mb-4 sm:mb-6 animate-float">🎲 🎮 🎯</div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-black text-foreground leading-tight mb-4 sm:mb-5">
              The home for board game events in India
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-muted-foreground mb-7 sm:mb-8 max-w-2xl mx-auto">
              Discover meetups, tournaments, and game nights. Connect with players and build community.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
              <Link
                href="/events"
                className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-3.5 bg-coral text-primary-foreground border-2 border-ink font-bold text-sm sm:text-base text-center shadow-neo hover:shadow-neo-lg hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all uppercase tracking-wider"
              >
                Explore Events
              </Link>
              {!user && (
                <Link
                  href="/signup"
                  className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-3.5 bg-sunny text-secondary-foreground border-2 border-ink font-bold text-sm sm:text-base text-center shadow-neo hover:shadow-neo-lg hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all uppercase tracking-wider"
                >
                  Sign Up Free
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-y-2 border-ink bg-coral relative overflow-hidden">
        <div className="absolute top-0 left-0 text-6xl opacity-10 animate-float">🎲</div>
        <div className="absolute bottom-0 right-0 text-6xl opacity-10 animate-float" style={{ animationDelay: '1s' }}>♟️</div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 relative z-10">
          <div className="grid grid-cols-3 gap-6 sm:gap-10">
            <div className="text-center">
              <p className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-2">500+</p>
              <p className="text-xs sm:text-sm lg:text-base font-mono uppercase tracking-wider text-white/90">Gamers</p>
            </div>
            <div className="text-center">
              <p className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-2">100+</p>
              <p className="text-xs sm:text-sm lg:text-base font-mono uppercase tracking-wider text-white/90">Events</p>
            </div>
            <div className="text-center">
              <p className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-2">15+</p>
              <p className="text-xs sm:text-sm lg:text-base font-mono uppercase tracking-wider text-white/90">Cities</p>
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      {upcomingEvents && upcomingEvents.length > 0 && (
        <section className="bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 sm:mb-10">
              <div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-foreground mb-2 uppercase">
                  Upcoming Events
                </h2>
                <p className="text-sm sm:text-base lg:text-lg text-muted-foreground font-mono">
                  Join the next board game gathering near you
                </p>
              </div>
              <Link
                href="/events"
                className="flex items-center gap-2 px-4 py-2 bg-grape text-accent-foreground border-2 border-ink shadow-neo-sm hover:shadow-neo hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all font-bold text-xs uppercase tracking-wider"
              >
                View All <ArrowRight size={14} strokeWidth={3} />
              </Link>
            </div>

            {/* Event Cards */}
            <div className="space-y-3">
              {upcomingEvents.map((event, index) => {
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
          </div>
        </section>
      )}

      {/* Features Section */}
      <section className="bg-card border-y-2 border-ink">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
          <div className="text-center mb-10 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-foreground mb-3 sm:mb-4 uppercase">
              Why BoardGameCulture?
            </h2>
            <p className="text-sm sm:text-base lg:text-lg text-muted-foreground font-mono">
              Everything you need to connect with the board game community
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {/* Discover Events Card */}
            <Link
              href="/events"
              className="group relative h-64 sm:h-72 border-2 border-ink overflow-hidden shadow-neo hover:shadow-neo-lg hover:-translate-x-1 hover:-translate-y-1 transition-all"
            >
              <div className="absolute inset-0">
                <img
                  src="https://images.unsplash.com/photo-1606167668584-78701c57f13d?w=800&h=600&fit=crop&q=80"
                  alt="Discover Events"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/70 to-ink/20"></div>
              </div>
              <div className="absolute inset-0 flex flex-col justify-end p-6 relative z-10">
                <h3 className="text-xl sm:text-2xl font-black text-white mb-3 group-hover:text-coral transition uppercase drop-shadow-lg">
                  Discover Events
                </h3>
                <p className="text-sm text-white leading-relaxed mb-4 font-mono drop-shadow-md">
                  Find board game nights, tournaments, and meetups happening near you.
                </p>
                <div className="inline-flex items-center gap-2 text-sm font-bold text-white group-hover:text-coral transition uppercase tracking-wider drop-shadow-md">
                  Browse Events
                  <ArrowRight size={16} strokeWidth={3} />
                </div>
              </div>
            </Link>

            {/* Host Events Card */}
            <Link
              href="/events/create"
              className="group relative h-64 sm:h-72 border-2 border-ink overflow-hidden shadow-neo hover:shadow-neo-lg hover:-translate-x-1 hover:-translate-y-1 transition-all"
            >
              <div className="absolute inset-0">
                <img
                  src="https://images.unsplash.com/photo-1632501641765-e568d28b0015?w=800&h=600&fit=crop&q=80"
                  alt="Host Events"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/70 to-ink/20"></div>
              </div>
              <div className="absolute inset-0 flex flex-col justify-end p-6 relative z-10">
                <h3 className="text-xl sm:text-2xl font-black text-white mb-3 group-hover:text-sunny transition uppercase drop-shadow-lg">
                  Host Events
                </h3>
                <p className="text-sm text-white leading-relaxed mb-4 font-mono drop-shadow-md">
                  Organize your own board game events with our easy-to-use platform.
                </p>
                <div className="inline-flex items-center gap-2 text-sm font-bold text-white group-hover:text-sunny transition uppercase tracking-wider drop-shadow-md">
                  Create Event
                  <ArrowRight size={16} strokeWidth={3} />
                </div>
              </div>
            </Link>

            {/* Build Community Card */}
            <div className="group relative h-64 sm:h-72 border-2 border-ink overflow-hidden shadow-neo sm:col-span-2 lg:col-span-1">
              <div className="absolute inset-0">
                <img
                  src="https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&h=600&fit=crop&q=80"
                  alt="Build Community"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/70 to-ink/20"></div>
              </div>
              <div className="absolute inset-0 flex flex-col justify-end p-6 relative z-10">
                <h3 className="text-xl sm:text-2xl font-black text-white mb-3 uppercase drop-shadow-lg">
                  Build Community
                </h3>
                <p className="text-sm text-white leading-relaxed mb-4 font-mono drop-shadow-md">
                  Connect with fellow board game enthusiasts and grow the gaming culture.
                </p>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-mint/80 text-ink text-xs font-bold uppercase tracking-wider border-2 border-ink shadow-neo-sm">
                  Coming Soon
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-background border-t-2 border-ink">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
          <div className="text-center mb-10 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-foreground mb-3 sm:mb-4 uppercase">
              How It Works
            </h2>
            <p className="text-sm sm:text-base lg:text-lg text-foreground font-mono">
              Join the board gaming community in 3 simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 sm:gap-8">
            <div className="bg-sunny/20 border-2 border-ink shadow-neo p-6 sm:p-8 text-center">
              <div className="w-16 h-16 bg-sunny border-2 border-ink flex items-center justify-center mx-auto mb-4 text-3xl font-black text-ink">
                1
              </div>
              <h3 className="text-lg sm:text-xl font-black text-foreground mb-3 uppercase">Sign Up Free</h3>
              <p className="text-sm text-foreground font-mono">
                Create your account in seconds. No credit card required. Start exploring events immediately.
              </p>
            </div>

            <div className="bg-mint/20 border-2 border-ink shadow-neo p-6 sm:p-8 text-center">
              <div className="w-16 h-16 bg-mint border-2 border-ink flex items-center justify-center mx-auto mb-4 text-3xl font-black text-ink">
                2
              </div>
              <h3 className="text-lg sm:text-xl font-black text-foreground mb-3 uppercase">Find Events</h3>
              <p className="text-sm text-foreground font-mono">
                Browse events by city, game type, or date. Register with one click and get ready to play.
              </p>
            </div>

            <div className="bg-grape/20 border-2 border-ink shadow-neo p-6 sm:p-8 text-center">
              <div className="w-16 h-16 bg-grape border-2 border-ink flex items-center justify-center mx-auto mb-4 text-3xl font-black text-white">
                3
              </div>
              <h3 className="text-lg sm:text-xl font-black text-foreground mb-3 uppercase">Show Up & Play</h3>
              <p className="text-sm text-foreground font-mono">
                Meet fellow gamers, play amazing games, and build lasting friendships in your community.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Communities Section */}
      <section className="bg-card border-t-2 border-ink">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
          <div className="text-center mb-10 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-foreground mb-3 sm:mb-4 uppercase">
              Growing Communities
            </h2>
            <p className="text-sm sm:text-base lg:text-lg text-foreground font-mono">
              Join thriving board game communities across India
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="bg-coral/20 border-2 border-ink shadow-neo p-6 text-center hover:shadow-neo-lg hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all">
              <div className="text-4xl mb-3">🎲</div>
              <h3 className="font-black text-foreground mb-2 uppercase">Mumbai</h3>
              <p className="text-sm text-foreground font-mono">50+ Active Gamers</p>
            </div>

            <div className="bg-mint/20 border-2 border-ink shadow-neo p-6 text-center hover:shadow-neo-lg hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all">
              <div className="text-4xl mb-3">♟️</div>
              <h3 className="font-black text-foreground mb-2 uppercase">Bangalore</h3>
              <p className="text-sm text-foreground font-mono">80+ Active Gamers</p>
            </div>

            <div className="bg-sunny/20 border-2 border-ink shadow-neo p-6 text-center hover:shadow-neo-lg hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all">
              <div className="text-4xl mb-3">🎯</div>
              <h3 className="font-black text-foreground mb-2 uppercase">Delhi</h3>
              <p className="text-sm text-foreground font-mono">60+ Active Gamers</p>
            </div>

            <div className="bg-grape/20 border-2 border-ink shadow-neo p-6 text-center hover:shadow-neo-lg hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all">
              <div className="text-4xl mb-3">🃏</div>
              <h3 className="font-black text-foreground mb-2 uppercase">Pune</h3>
              <p className="text-sm text-foreground font-mono">40+ Active Gamers</p>
            </div>
          </div>

          <div className="text-center mt-10">
            <Link
              href="/events"
              className="inline-flex items-center gap-2 px-6 py-3 bg-coral text-white border-2 border-ink shadow-neo hover:shadow-neo-lg hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all font-bold uppercase tracking-wider"
            >
              Explore All Cities →
            </Link>
          </div>
        </div>
      </section>

      {/* Link-in-Bio Creator Section */}
      <section className="bg-grape border-t-2 border-ink relative overflow-hidden">
        <div className="absolute top-10 right-10 text-8xl opacity-10 animate-float">🎮</div>
        <div className="absolute bottom-10 left-10 text-8xl opacity-10 animate-float" style={{ animationDelay: '0.5s' }}>🎲</div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white mb-4 sm:mb-6 uppercase">
              For Event Organizers
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-white/90 mb-8 sm:mb-10 font-mono">
              Create your custom event page with all your board game events in one place. Share a single link across all your social media.
            </p>

            <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 mb-8 sm:mb-10">
              <div className="bg-white/10 border-2 border-white/20 p-4 sm:p-6">
                <div className="text-3xl mb-3">📱</div>
                <h3 className="font-black text-white mb-2 uppercase">One Link</h3>
                <p className="text-sm text-white/90 font-mono">Share all your events with a single memorable link</p>
              </div>

              <div className="bg-white/10 border-2 border-white/20 p-4 sm:p-6">
                <div className="text-3xl mb-3">🎨</div>
                <h3 className="font-black text-white mb-2 uppercase">Customizable</h3>
                <p className="text-sm text-white/90 font-mono">Brand your page with custom colors and bio</p>
              </div>

              <div className="bg-white/10 border-2 border-white/20 p-4 sm:p-6">
                <div className="text-3xl mb-3">📊</div>
                <h3 className="font-black text-white mb-2 uppercase">Analytics</h3>
                <p className="text-sm text-white/90 font-mono">Track views and registrations in real-time</p>
              </div>

              <div className="bg-white/10 border-2 border-white/20 p-4 sm:p-6">
                <div className="text-3xl mb-3">⚡</div>
                <h3 className="font-black text-white mb-2 uppercase">Fast Setup</h3>
                <p className="text-sm text-white/90 font-mono">Get your page live in under 2 minutes</p>
              </div>
            </div>

            <Link
              href="/events/create"
              className="inline-flex items-center gap-2 px-8 py-4 bg-coral text-white border-2 border-ink shadow-[6px_6px_0_0_hsl(var(--ink))] hover:shadow-[8px_8px_0_0_hsl(var(--ink))] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all font-bold text-lg uppercase tracking-wider"
            >
              Create Your Page Free →
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-ink text-white border-t-2 border-ink">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 text-center">
          <div className="mb-4 text-3xl sm:text-4xl animate-float">🎲 🎯 🎮</div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black mb-3 sm:mb-4 uppercase">
            Ready to Join?
          </h2>
          <p className="text-sm sm:text-base lg:text-lg text-white/90 mb-6 sm:mb-8 max-w-2xl mx-auto font-mono">
            Join thousands of board gamers across India. Find your next game night today.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <Link
              href={user ? "/events" : "/signup"}
              className="px-6 sm:px-8 py-3 sm:py-3.5 bg-coral text-white border-2 border-ink shadow-[4px_4px_0_0_hsl(var(--ink))] hover:shadow-[6px_6px_0_0_hsl(var(--ink))] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all font-bold text-sm sm:text-base uppercase tracking-wider"
            >
              {user ? "Browse Events" : "Get Started Free"}
            </Link>
            <Link
              href="/events/create"
              className="px-6 sm:px-8 py-3 sm:py-3.5 bg-sunny text-ink border-2 border-ink shadow-[4px_4px_0_0_hsl(var(--ink))] hover:shadow-[6px_6px_0_0_hsl(var(--ink))] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all font-bold text-sm sm:text-base uppercase tracking-wider"
            >
              Host an Event
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t-2 border-ink relative overflow-hidden">
        <div className="absolute top-4 right-4 text-4xl opacity-5 animate-float">🎲</div>
        <div className="absolute bottom-4 left-4 text-4xl opacity-5 animate-float" style={{ animationDelay: '0.7s' }}>♟️</div>
        <div className="absolute top-1/2 left-1/2 text-6xl opacity-5">🎯</div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 relative z-10">
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
                <span className="text-base sm:text-lg font-black text-foreground">BoardGameCulture</span>
              </Link>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-sm font-mono">
                India's premier platform for board game enthusiasts. Discover events, connect with players, and build communities across cities.
              </p>
            </div>
            <div>
              <h4 className="font-black text-foreground mb-3 text-xs uppercase tracking-wider">Platform</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/events" className="text-muted-foreground hover:text-coral transition font-mono">Browse Events</Link></li>
                <li><Link href="/events/create" className="text-muted-foreground hover:text-coral transition font-mono">Host Event</Link></li>
                <li><Link href="/dashboard" className="text-muted-foreground hover:text-coral transition font-mono">Dashboard</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-black text-foreground mb-3 text-xs uppercase tracking-wider">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="#" className="text-muted-foreground hover:text-coral transition font-mono">About</Link></li>
                <li><Link href="#" className="text-muted-foreground hover:text-coral transition font-mono">Contact</Link></li>
                <li><Link href="#" className="text-muted-foreground hover:text-coral transition font-mono">Privacy</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t-2 border-border pt-6 text-center text-xs text-muted-foreground font-mono uppercase tracking-wider">
            <p>&copy; 2026 BoardGameCulture. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
