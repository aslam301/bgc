import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import Navigation from '@/components/Navigation'
import { BookOpen, Star } from 'lucide-react'

export default async function ReviewsPage() {
  const supabase = await createClient()

  const { data: reviews } = await supabase
    .from('reviews')
    .select(`
      *,
      author:profiles!user_id(name),
      game:games(name)
    `)
    .eq('is_published', true)
    .order('created_at', { ascending: false })
    .limit(20)

  return (
    <div className="min-h-screen bg-background art-bg pt-16">
      <Navigation />

      {/* Hero */}
      <div className="bg-grape border-b-2 border-ink">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-2 sm:mb-3 uppercase">
            Game Reviews & Guides
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-white/90 max-w-2xl font-mono">
            Expert reviews, comparisons, and buyer's guides for board games
          </p>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {!reviews || reviews.length === 0 ? (
          <div className="bg-card border-2 border-ink shadow-neo-lg p-8 sm:p-12 text-center">
            <div className="text-5xl sm:text-6xl mb-4">📝</div>
            <h2 className="text-xl sm:text-2xl font-black text-foreground mb-2 uppercase">Reviews Coming Soon</h2>
            <p className="text-sm sm:text-base text-foreground font-mono">
              Our community is working on detailed game reviews and guides!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <Link
                key={review.id}
                href={`/reviews/${review.id}`}
                className="block bg-card border-2 border-ink shadow-neo hover:shadow-neo-lg hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all p-6"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-2 py-1 text-xs font-bold uppercase border-2 border-ink ${
                        review.type === 'full_review' ? 'bg-grape/20 text-foreground' :
                        review.type === 'comparison' ? 'bg-coral/20 text-foreground' :
                        'bg-sunny/20 text-foreground'
                      }`}>
                        {review.type.replace('_', ' ')}
                      </span>
                      {review.rating && (
                        <span className="flex items-center gap-1 text-sm font-black text-foreground">
                          <Star size={14} strokeWidth={2.5} className="text-sunny" />
                          {review.rating}/10
                        </span>
                      )}
                    </div>
                    <h3 className="text-xl font-black text-foreground mb-2 hover:text-coral transition">
                      {review.title}
                    </h3>
                    {review.game && (
                      <p className="text-sm text-foreground font-mono mb-2">
                        Game: {review.game.name}
                      </p>
                    )}
                    <p className="text-sm text-foreground font-mono">
                      by {review.author?.name || 'Anonymous'} • {review.view_count} views
                    </p>
                  </div>
                  <div className="text-4xl">📚</div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
