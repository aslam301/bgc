import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Calendar, Users, Gamepad2, Instagram, MessageCircle, Globe, Mail } from 'lucide-react'

export default async function CommunityPage({
  params
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const supabase = await createClient()

  // Fetch community data
  const { data: community, error } = await supabase
    .from('communities')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error || !community) {
    notFound()
  }

  // Fetch upcoming events from this community
  const { data: upcomingEvents } = await supabase
    .from('events')
    .select('id, title, start_date, ticket_price, city')
    .eq('community_id', community.id)
    .eq('status', 'published')
    .gte('start_date', new Date().toISOString())
    .order('start_date', { ascending: true })
    .limit(3)

  // Parse social links from JSON if stored that way
  const socialLinks = community.social_links || {}

  return (
    <div className="min-h-screen art-bg">
      {/* Fixed Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b-2 border-ink pt-16">
        <div className="container max-w-2xl mx-auto px-5 py-4">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-mono text-muted-foreground hover:text-foreground transition">
            ← Back to BoardGameCulture
          </Link>
        </div>
      </header>

      <main className="container max-w-2xl mx-auto px-5 py-8 pb-24">
        {/* Hero Section */}
        <div className="text-center mb-8 animate-slide-up">
          {/* Avatar */}
          <div className="relative w-24 h-24 mx-auto mb-4">
            {community.logo_url ? (
              <Image
                src={community.logo_url}
                alt={community.name}
                fill
                className="object-cover rounded-full border-4 border-ink shadow-[4px_4px_0_0_hsl(var(--ink))]"
              />
            ) : (
              <div className="w-full h-full bg-coral border-4 border-ink rounded-full flex items-center justify-center shadow-[4px_4px_0_0_hsl(var(--ink))]">
                <Gamepad2 size={40} className="text-white" />
              </div>
            )}
          </div>

          {/* Community Name */}
          <h1 className="font-black text-3xl text-foreground mb-3">
            {community.name}
          </h1>

          {/* Description */}
          <p className="text-muted-foreground max-w-md mx-auto leading-relaxed">
            {community.description || 'A vibrant board gaming community'}
          </p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-3 mb-8 animate-slide-up" style={{ animationDelay: '100ms' }}>
          <div className="bg-card border-2 border-ink p-4 text-center shadow-[3px_3px_0_0_hsl(var(--sunny))]">
            <div className="font-bold text-2xl text-foreground">{community.member_count || 0}</div>
            <div className="text-xs font-mono text-muted-foreground uppercase mt-1">Members</div>
          </div>
          <div className="bg-card border-2 border-ink p-4 text-center shadow-[3px_3px_0_0_hsl(var(--coral))]">
            <div className="font-bold text-2xl text-foreground">{community.events_per_year || 0}</div>
            <div className="text-xs font-mono text-muted-foreground uppercase mt-1">Events/Year</div>
          </div>
          <div className="bg-card border-2 border-ink p-4 text-center shadow-[3px_3px_0_0_hsl(var(--grape))]">
            <div className="font-bold text-2xl text-foreground">{community.games_played || 0}</div>
            <div className="text-xs font-mono text-muted-foreground uppercase mt-1">Games</div>
          </div>
        </div>

        {/* Primary Links - 2x2 Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6 animate-slide-up" style={{ animationDelay: '150ms' }}>
          {socialLinks.whatsapp && (
            <a
              href={socialLinks.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-mint border-2 border-ink p-5 flex flex-col items-center gap-2 hover:translate-y-[-2px] transition-transform shadow-[4px_4px_0_0_hsl(var(--ink))] hover:shadow-[2px_2px_0_0_hsl(var(--ink))]"
            >
              <MessageCircle size={24} className="text-ink" />
              <span className="font-bold text-sm text-ink">WhatsApp</span>
            </a>
          )}

          {socialLinks.instagram && (
            <a
              href={socialLinks.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-coral border-2 border-ink p-5 flex flex-col items-center gap-2 hover:translate-y-[-2px] transition-transform shadow-[4px_4px_0_0_hsl(var(--ink))] hover:shadow-[2px_2px_0_0_hsl(var(--ink))]"
            >
              <Instagram size={24} className="text-white" />
              <span className="font-bold text-sm text-white">Instagram</span>
            </a>
          )}

          {socialLinks.discord && (
            <a
              href={socialLinks.discord}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-grape border-2 border-ink p-5 flex flex-col items-center gap-2 hover:translate-y-[-2px] transition-transform shadow-[4px_4px_0_0_hsl(var(--ink))] hover:shadow-[2px_2px_0_0_hsl(var(--ink))]"
            >
              <MessageCircle size={24} className="text-white" />
              <span className="font-bold text-sm text-white">Discord</span>
            </a>
          )}

          {socialLinks.website && (
            <a
              href={socialLinks.website}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-sunny border-2 border-ink p-5 flex flex-col items-center gap-2 hover:translate-y-[-2px] transition-transform shadow-[4px_4px_0_0_hsl(var(--ink))] hover:shadow-[2px_2px_0_0_hsl(var(--ink))]"
            >
              <Globe size={24} className="text-ink" />
              <span className="font-bold text-sm text-ink">Website</span>
            </a>
          )}
        </div>

        {/* Quick Actions */}
        <div className="space-y-3 mb-8 animate-slide-up" style={{ animationDelay: '200ms' }}>
          <button className="w-full bg-card border-2 border-ink p-4 flex items-center gap-3 hover:bg-muted transition-colors shadow-[3px_3px_0_0_hsl(var(--ink))]">
            <div className="w-10 h-10 bg-mint flex items-center justify-center">
              <Users size={20} className="text-ink" />
            </div>
            <div className="flex-1 text-left">
              <p className="font-bold text-foreground">Join Community</p>
              <p className="text-xs font-mono text-muted-foreground">Connect with gamers</p>
            </div>
          </button>

          <Link href="/events" className="w-full bg-card border-2 border-ink p-4 flex items-center gap-3 hover:bg-muted transition-colors shadow-[3px_3px_0_0_hsl(var(--ink))]">
            <div className="w-10 h-10 bg-coral flex items-center justify-center">
              <Calendar size={20} className="text-white" />
            </div>
            <div className="flex-1 text-left">
              <p className="font-bold text-foreground">View All Events</p>
              <p className="text-xs font-mono text-muted-foreground">Upcoming meetups</p>
            </div>
          </Link>

          <button className="w-full bg-card border-2 border-ink p-4 flex items-center gap-3 hover:bg-muted transition-colors shadow-[3px_3px_0_0_hsl(var(--ink))]">
            <div className="w-10 h-10 bg-grape flex items-center justify-center">
              <Mail size={20} className="text-white" />
            </div>
            <div className="flex-1 text-left">
              <p className="font-bold text-foreground">Get in Touch</p>
              <p className="text-xs font-mono text-muted-foreground">Contact organizers</p>
            </div>
          </button>
        </div>

        {/* Upcoming Events */}
        {upcomingEvents && upcomingEvents.length > 0 && (
          <div className="mb-8 animate-slide-up" style={{ animationDelay: '250ms' }}>
            <h2 className="font-bold text-lg text-foreground mb-4 flex items-center gap-2">
              <span className="w-6 h-0.5 bg-coral" />
              Upcoming Events
            </h2>
            <div className="space-y-3">
              {upcomingEvents.map((event, index) => (
                <Link
                  key={event.id}
                  href={`/events/${event.id}`}
                  className="block bg-card border-2 border-ink p-4 hover:translate-y-[-2px] transition-transform shadow-[3px_3px_0_0_hsl(var(--ink))] hover:shadow-[2px_2px_0_0_hsl(var(--ink))]"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <p className="font-bold text-foreground mb-1">{event.title}</p>
                      <p className="text-xs font-mono text-muted-foreground">
                        {new Date(event.start_date).toLocaleDateString('en-IN', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })} • {event.city}
                      </p>
                    </div>
                    <div className={`px-3 py-1 border-2 border-ink font-bold text-sm ${
                      event.ticket_price && event.ticket_price > 0
                        ? 'bg-coral text-white'
                        : 'bg-mint text-ink'
                    }`}>
                      {event.ticket_price && event.ticket_price > 0 ? `₹${event.ticket_price}` : 'Free'}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* About Section */}
        {community.about && (
          <div className="mb-8 animate-slide-up" style={{ animationDelay: '300ms' }}>
            <h2 className="font-bold text-lg text-foreground mb-4 flex items-center gap-2">
              <span className="w-6 h-0.5 bg-grape" />
              About Us
            </h2>
            <div className="bg-card border-2 border-ink p-6 shadow-[4px_4px_0_0_hsl(var(--sunny))]">
              <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                {community.about}
              </p>
            </div>
          </div>
        )}

        {/* Photo Gallery */}
        {community.gallery_urls && community.gallery_urls.length > 0 && (
          <div className="mb-8 animate-slide-up" style={{ animationDelay: '350ms' }}>
            <h2 className="font-bold text-lg text-foreground mb-4 flex items-center gap-2">
              <span className="w-6 h-0.5 bg-mint" />
              Gallery
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {community.gallery_urls.map((url: string, index: number) => (
                <div key={index} className="relative aspect-square border-2 border-ink shadow-[3px_3px_0_0_hsl(var(--ink))]">
                  <Image
                    src={url}
                    alt={`${community.name} photo ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-12 pt-8 border-t-2 border-ink/10 animate-slide-up" style={{ animationDelay: '400ms' }}>
          <p className="text-xs font-mono text-muted-foreground mb-3">
            Powered by
          </p>
          <Link href="/" className="inline-flex items-center gap-2 hover:opacity-80 transition">
            <div className="relative w-8 h-8">
              <Image src="/logo.png" alt="BoardGameCulture" fill className="object-contain" />
            </div>
            <span className="font-bold text-foreground">BoardGameCulture</span>
          </Link>
          <p className="text-xs text-muted-foreground mt-2">
            India's Board Game Community Platform
          </p>
        </div>
      </main>
    </div>
  )
}
