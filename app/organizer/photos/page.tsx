import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Navigation from '@/components/Navigation'
import Image from 'next/image'
import { Camera } from 'lucide-react'
import PhotoModerationButtons from './PhotoModerationButtons'

export default async function OrganizerPhotosPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Get user profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!profile || (profile.role !== 'organizer' && profile.role !== 'admin')) {
    redirect('/dashboard')
  }

  // Get pending photos for organizer's events
  const { data: pendingPhotos } = await supabase
    .from('event_photos')
    .select(`
      *,
      event:events!inner(id, title, organizer_id),
      uploader:profiles!uploaded_by(name)
    `)
    .eq('event.organizer_id', user.id)
    .eq('status', 'pending')
    .order('created_at', { ascending: false })

  // Get approved photos
  const { data: approvedPhotos } = await supabase
    .from('event_photos')
    .select(`
      *,
      event:events!inner(id, title, organizer_id),
      uploader:profiles!uploaded_by(name)
    `)
    .eq('event.organizer_id', user.id)
    .eq('status', 'approved')
    .order('created_at', { ascending: false })
    .limit(20)

  return (
    <div className="min-h-screen bg-background art-bg pt-16">
      <Navigation />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <h1 className="text-3xl sm:text-4xl font-black text-foreground mb-8 uppercase">
          Photo Moderation
        </h1>

        {/* Pending Photos */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <Camera size={24} strokeWidth={2.5} className="text-sunny" />
            <h2 className="text-2xl font-black text-foreground uppercase">
              Pending Approval ({pendingPhotos?.length || 0})
            </h2>
          </div>

          {!pendingPhotos || pendingPhotos.length === 0 ? (
            <div className="bg-card border-2 border-ink shadow-[4px_4px_0_0_hsl(var(--ink))] p-8 text-center">
              <p className="text-sm text-foreground font-mono">
                No photos pending moderation
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {pendingPhotos.map((photo) => (
                <div
                  key={photo.id}
                  className="bg-card border-2 border-ink shadow-[4px_4px_0_0_hsl(var(--ink))]"
                >
                  <div className="relative aspect-square">
                    <Image
                      src={photo.photo_url}
                      alt="Pending photo"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <p className="font-black text-foreground mb-1">
                      {photo.event.title}
                    </p>
                    <p className="text-xs font-mono text-foreground mb-3">
                      by {photo.uploader?.name || 'Anonymous'}
                    </p>
                    <PhotoModerationButtons photoId={photo.id} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Approved Photos */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <Camera size={24} strokeWidth={2.5} className="text-mint" />
            <h2 className="text-2xl font-black text-foreground uppercase">
              Approved Photos
            </h2>
          </div>

          {!approvedPhotos || approvedPhotos.length === 0 ? (
            <div className="bg-card border-2 border-ink shadow-[4px_4px_0_0_hsl(var(--ink))] p-8 text-center">
              <p className="text-sm text-foreground font-mono">
                No approved photos yet
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {approvedPhotos.map((photo) => (
                <div
                  key={photo.id}
                  className="bg-card border-2 border-ink shadow-[4px_4px_0_0_hsl(var(--ink))]"
                >
                  <div className="relative aspect-square">
                    <Image
                      src={photo.photo_url}
                      alt="Event photo"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-2">
                    <p className="text-xs font-mono text-foreground truncate">
                      {photo.event.title}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  )
}
