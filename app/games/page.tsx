import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import Navigation from '@/components/Navigation'
import { Users, Clock, TrendingUp } from 'lucide-react'

export default async function GamesPage() {
  const supabase = await createClient()

  const { data: games } = await supabase
    .from('games')
    .select('*')
    .order('bgg_rating', { ascending: false, nullsFirst: false })
    .limit(50)

  return (
    <div className="min-h-screen bg-background art-bg pt-16">
      <Navigation />

      {/* Hero */}
      <div className="bg-sunny border-b-2 border-ink">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-ink mb-2 sm:mb-3 uppercase">
            Game Catalog
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-ink/90 max-w-2xl font-mono">
            Discover board games, track your collection, and log your plays
          </p>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {!games || games.length === 0 ? (
          <div className="bg-card border-2 border-ink shadow-neo-lg p-8 sm:p-12 text-center">
            <div className="text-5xl sm:text-6xl mb-4">🎲</div>
            <h2 className="text-xl sm:text-2xl font-black text-foreground mb-2 uppercase">No Games Yet</h2>
            <p className="text-sm sm:text-base text-foreground font-mono">
              The game catalog will be populated soon with board games from BoardGameGeek!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {games.map((game) => (
              <Link
                key={game.id}
                href={`/games/${game.id}`}
                className="bg-card border-2 border-ink shadow-neo hover:shadow-neo-lg hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all overflow-hidden"
              >
                {game.image_url && (
                  <div className="aspect-video bg-muted border-b-2 border-ink relative overflow-hidden">
                    <img
                      src={game.image_url}
                      alt={game.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="p-4">
                  <h3 className="font-black text-foreground mb-2 hover:text-coral transition">
                    {game.name}
                  </h3>
                  {game.year_published && (
                    <p className="text-xs text-foreground font-mono mb-3">
                      Published: {game.year_published}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-2 text-xs text-foreground font-mono">
                    {game.min_players && (
                      <span className="flex items-center gap-1">
                        <Users size={12} strokeWidth={2.5} />
                        {game.min_players}-{game.max_players || '?'}
                      </span>
                    )}
                    {game.playtime_min && (
                      <span className="flex items-center gap-1">
                        <Clock size={12} strokeWidth={2.5} />
                        {game.playtime_min}-{game.playtime_max || '?'}m
                      </span>
                    )}
                    {game.bgg_rating && (
                      <span className="flex items-center gap-1">
                        <TrendingUp size={12} strokeWidth={2.5} />
                        {game.bgg_rating.toFixed(1)}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
