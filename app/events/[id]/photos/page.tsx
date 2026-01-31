import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Navigation from '@/components/Navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Camera, ArrowLeft } from 'lucide-react'
import PhotoUploadForm from './PhotoUploadForm'

export default async function EventPhotosPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const { data: event, error } = await supabase
    .from('events')
    .select(`
      *,
      organizer:profiles!organizer_id(name)
    `)
    .eq('id', id)
    .single()

  if (error || !event) {
    notFound()
  }

  // Get approved photos for this event
  const { data: photos } = await supabase
    .from('event_photos')
    .select(`
      *,
      uploader:profiles!uploaded_by(name)
    `)
    .eq('event_id', id)
    .eq('status', 'approved')
    .order('created_at', { ascending: false })

  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div className="min-h-screen bg-background art-bg pt-16">
      <Navigation />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Back Link */}
        <Link
          href={`/events/${id}`}
          className="inline-flex items-center gap-2 text-sm font-mono text-foreground hover:text-coral transition mb-6"
        >
          <ArrowLeft size={16} strokeWidth={2.5} />
          Back to Event
        </Link>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-black text-foreground mb-3 uppercase">
            Event Photos
          </h1>
          <p className="text-base sm:text-lg text-foreground font-mono">
            {event.title}
          </p>
        </div>

        {/* Upload Form */}
        {user && (
          <div className="bg-card border-2 border-ink shadow-[4px_4px_0_0_hsl(var(--ink))] p-6 mb-8">
            <div className="flex items-start gap-3 mb-4">
              <Camera size={24} strokeWidth={2.5} className="text-coral" />
              <div>
                <h2 className="font-black text-foreground mb-1">Share Your Photos</h2>
                <p className="text-sm text-foreground font-mono">
                  Upload photos from this event (max 5MB)
                </p>
              </div>
            </div>
            <PhotoUploadForm eventId={id} />
          </div>
        )}

        {/* Photo Gallery */}
        {!photos || photos.length === 0 ? (
          <div className="bg-card border-2 border-ink shadow-[4px_4px_0_0_hsl(var(--ink))] p-12 text-center">
            <div className="text-6xl mb-4">📷</div>
            <h2 className="text-xl font-black text-foreground mb-2 uppercase">No Photos Yet</h2>
            <p className="text-sm text-foreground font-mono">
              {user ? 'Be the first to share photos from this event!' : 'Photos from attendees will appear here'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {photos.map((photo) => (
              <div
                key={photo.id}
                className="bg-card border-2 border-ink shadow-[4px_4px_0_0_hsl(var(--ink))] overflow-hidden"
              >
                <div className="relative aspect-square">
                  <Image
                    src={photo.photo_url}
                    alt={`Photo by ${photo.uploader?.name || 'Anonymous'}`}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-3">
                  <p className="text-xs font-mono text-foreground">
                    by {photo.uploader?.name || 'Anonymous'}
                  </p>
                  <p className="text-xs font-mono text-muted-foreground">
                    {new Date(photo.created_at).toLocaleDateString('en-IN')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
