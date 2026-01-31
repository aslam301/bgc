import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import Navigation from '@/components/Navigation'

export default async function CollectionPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: collection } = await supabase
    .from('user_games')
    .select(`
      *,
      game:games(*)
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  const stats = {
    own: collection?.filter(g => g.status === 'own').length || 0,
    wishlist: collection?.filter(g => g.status === 'wishlist').length || 0,
    played: collection?.filter(g => g.status === 'played').length || 0,
  }

  return (
    <div className="min-h-screen bg-background art-bg pt-16">
      <Navigation />

      {/* Hero */}
      <div className="bg-mint border-b-2 border-ink">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-ink mb-2 sm:mb-3 uppercase">
            My Collection
          </h1>
          <p className="text-base sm:text-lg text-ink/90 font-mono">
            Track games you own, want, and have played
          </p>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-coral/20 border-2 border-ink shadow-neo p-6 text-center">
            <p className="text-3xl font-black text-foreground mb-1">{stats.own}</p>
            <p className="text-xs font-mono uppercase text-foreground">Own</p>
          </div>
          <div className="bg-sunny/20 border-2 border-ink shadow-neo p-6 text-center">
            <p className="text-3xl font-black text-foreground mb-1">{stats.wishlist}</p>
            <p className="text-xs font-mono uppercase text-foreground">Wishlist</p>
          </div>
          <div className="bg-mint/20 border-2 border-ink shadow-neo p-6 text-center">
            <p className="text-3xl font-black text-foreground mb-1">{stats.played}</p>
            <p className="text-xs font-mono uppercase text-foreground">Played</p>
          </div>
        </div>

        {/* Collection List */}
        {!collection || collection.length === 0 ? (
          <div className="bg-card border-2 border-ink shadow-neo-lg p-8 sm:p-12 text-center">
            <div className="text-5xl sm:text-6xl mb-4">📚</div>
            <h2 className="text-xl sm:text-2xl font-black text-foreground mb-2 uppercase">Start Your Collection</h2>
            <p className="text-sm sm:text-base text-foreground mb-6 font-mono">
              Browse games and add them to your collection
            </p>
            <Link
              href="/games"
              className="inline-flex items-center gap-2 px-6 py-3 bg-coral text-white border-2 border-ink shadow-neo hover:shadow-neo-lg hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all font-bold uppercase tracking-wider"
            >
              Browse Games
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {collection.map((item) => (
              <div
                key={item.id}
                className="bg-card border-2 border-ink shadow-neo p-4"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-black text-foreground">{item.game.name}</h3>
                  <span className={`px-2 py-1 text-xs font-bold uppercase border-2 border-ink ${
                    item.status === 'own' ? 'bg-coral text-white' :
                    item.status === 'wishlist' ? 'bg-sunny text-ink' :
                    'bg-mint text-ink'
                  }`}>
                    {item.status}
                  </span>
                </div>
                {item.notes && (
                  <p className="text-sm text-foreground font-mono">{item.notes}</p>
                )}
                {item.times_played > 0 && (
                  <p className="text-xs text-foreground font-mono mt-2">
                    Played {item.times_played} times
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
