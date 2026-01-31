import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import Navigation from '@/components/Navigation'
import { format } from 'date-fns'
import { MessageSquare, TrendingUp, Clock, Plus } from 'lucide-react'

export default async function DiscussionsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>
}) {
  const supabase = await createClient()
  const params = await searchParams
  const { data: { user } } = await supabase.auth.getUser()

  // Build query
  let query = supabase
    .from('discussions')
    .select(`
      *,
      author:profiles!user_id(name),
      comments:discussion_comments(count)
    `)
    .order('created_at', { ascending: false })

  if (params.category) {
    query = query.eq('category', params.category)
  }

  const { data: discussions } = await query

  const categories = [
    { value: 'all', label: 'All Discussions', icon: '💬' },
    { value: 'rules', label: 'Rules Questions', icon: '📖' },
    { value: 'strategy', label: 'Strategy Tips', icon: '🎯' },
    { value: 'general', label: 'General Chat', icon: '🎲' },
    { value: 'marketplace', label: 'Buy/Sell/Trade', icon: '🛒' },
    { value: 'meetups', label: 'Looking for Group', icon: '👥' },
  ]

  return (
    <div className="min-h-screen bg-background art-bg pt-16">
      <Navigation />

      {/* Hero Section */}
      <div className="bg-grape border-b-2 border-ink">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-2 sm:mb-3 uppercase">
            Community Discussions
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-white/90 max-w-2xl font-mono">
            Ask questions, share strategies, and connect with fellow board gamers
          </p>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Category Filter */}
        <div className="bg-card border-2 border-ink shadow-neo p-4 sm:p-6 mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-4">
            <h2 className="text-base sm:text-lg font-black text-foreground uppercase tracking-wider">Browse by Category</h2>
            {user && (
              <Link
                href="/discussions/create"
                className="inline-flex items-center gap-2 px-4 py-2 bg-coral text-white border-2 border-ink shadow-neo-sm hover:shadow-neo hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all font-bold text-sm uppercase tracking-wider"
              >
                <Plus size={16} strokeWidth={3} />
                New Discussion
              </Link>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <Link
                key={cat.value}
                href={cat.value === 'all' ? '/discussions' : `/discussions?category=${cat.value}`}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 border-2 border-ink text-sm font-bold uppercase tracking-wider transition-all ${
                  (cat.value === 'all' && !params.category) || params.category === cat.value
                    ? 'bg-grape text-white shadow-neo'
                    : 'bg-card text-foreground shadow-neo-sm hover:shadow-neo hover:-translate-x-0.5 hover:-translate-y-0.5'
                }`}
              >
                <span className="mr-2">{cat.icon}</span>
                {cat.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Discussions List */}
        {!discussions || discussions.length === 0 ? (
          <div className="bg-card border-2 border-ink shadow-neo-lg p-8 sm:p-12 text-center">
            <div className="text-5xl sm:text-6xl mb-4">💬</div>
            <h2 className="text-xl sm:text-2xl font-black text-foreground mb-2 uppercase">No Discussions Yet</h2>
            <p className="text-sm sm:text-base text-foreground mb-6 font-mono">
              Be the first to start a conversation in this category!
            </p>
            {user && (
              <Link
                href="/discussions/create"
                className="inline-flex items-center gap-2 px-6 py-3 bg-coral text-white border-2 border-ink shadow-neo hover:shadow-neo-lg hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all font-bold uppercase tracking-wider"
              >
                <Plus size={18} strokeWidth={3} />
                Start Discussion
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {discussions.map((discussion) => {
              const commentCount = discussion.comments?.[0]?.count || 0
              const categoryInfo = categories.find(c => c.value === discussion.category) || categories[0]

              return (
                <Link
                  key={discussion.id}
                  href={`/discussions/${discussion.id}`}
                  className="block bg-card border-2 border-ink shadow-neo hover:shadow-neo-lg hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all p-4 sm:p-6"
                >
                  <div className="flex flex-col sm:flex-row gap-4">
                    {/* Vote Section */}
                    <div className="flex sm:flex-col items-center gap-2 sm:w-20">
                      <div className="w-12 h-12 sm:w-16 sm:h-16 bg-mint border-2 border-ink flex items-center justify-center">
                        <TrendingUp size={24} strokeWidth={2.5} className="text-ink" />
                      </div>
                      <div className="text-center">
                        <p className="text-xl sm:text-2xl font-black text-foreground">{discussion.upvotes - discussion.downvotes}</p>
                        <p className="text-xs text-foreground font-mono uppercase">votes</p>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className="px-2 py-1 bg-grape/20 border border-grape text-xs font-bold uppercase tracking-wider text-foreground">
                          {categoryInfo.icon} {categoryInfo.label}
                        </span>
                        {discussion.is_pinned && (
                          <span className="px-2 py-1 bg-sunny border border-ink text-xs font-bold uppercase tracking-wider text-ink">
                            📌 Pinned
                          </span>
                        )}
                      </div>
                      <h3 className="text-lg sm:text-xl font-black text-foreground mb-2 hover:text-coral transition">
                        {discussion.title}
                      </h3>
                      <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm text-foreground font-mono">
                        <span className="flex items-center gap-1">
                          <MessageSquare size={14} strokeWidth={2.5} />
                          {commentCount} {commentCount === 1 ? 'reply' : 'replies'}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock size={14} strokeWidth={2.5} />
                          {format(new Date(discussion.created_at), 'MMM dd, yyyy')}
                        </span>
                        <span className="font-bold">
                          by {discussion.author?.name || 'Anonymous'}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}
