import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Navigation from '@/components/Navigation'
import { format } from 'date-fns'
import { ArrowLeft, MessageSquare, ThumbsUp, ThumbsDown, Award } from 'lucide-react'
import CommentForm from './CommentForm'
import CommentList from './CommentList'
import VoteButtons from './VoteButtons'

export default async function DiscussionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { id } = await params

  // Fetch discussion
  const { data: discussion, error } = await supabase
    .from('discussions')
    .select(`
      *,
      author:profiles!user_id(name)
    `)
    .eq('id', id)
    .single()

  if (error || !discussion) {
    notFound()
  }

  // Fetch comments
  const { data: comments } = await supabase
    .from('discussion_comments')
    .select(`
      *,
      author:profiles!user_id(name)
    `)
    .eq('discussion_id', id)
    .is('parent_id', null)
    .order('created_at', { ascending: true })

  // Fetch user's vote if logged in
  let userVote = null
  if (user) {
    const { data } = await supabase
      .from('discussion_votes')
      .select('vote_type')
      .eq('discussion_id', id)
      .eq('user_id', user.id)
      .single()
    userVote = data
  }

  const categories = {
    rules: { label: 'Rules Questions', icon: '📖', color: 'grape' },
    strategy: { label: 'Strategy Tips', icon: '🎯', color: 'coral' },
    general: { label: 'General Chat', icon: '🎲', color: 'sunny' },
    marketplace: { label: 'Buy/Sell/Trade', icon: '🛒', color: 'mint' },
    meetups: { label: 'Looking for Group', icon: '👥', color: 'grape' },
  }

  const categoryInfo = categories[discussion.category as keyof typeof categories] || categories.general

  return (
    <div className="min-h-screen bg-background art-bg pt-16">
      <Navigation />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Back Button */}
        <Link
          href="/discussions"
          className="inline-flex items-center gap-2 text-sm font-bold text-foreground hover:text-coral transition uppercase tracking-wider mb-6"
        >
          <ArrowLeft size={16} strokeWidth={3} />
          Back to Discussions
        </Link>

        {/* Discussion Card */}
        <div className="bg-card border-2 border-ink shadow-neo-lg mb-6">
          {/* Header */}
          <div className="p-4 sm:p-6 border-b-2 border-ink">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className={`px-3 py-1 bg-${categoryInfo.color}/20 border-2 border-ink text-xs font-bold uppercase tracking-wider text-foreground`}>
                {categoryInfo.icon} {categoryInfo.label}
              </span>
              {discussion.is_pinned && (
                <span className="px-3 py-1 bg-sunny border-2 border-ink text-xs font-bold uppercase tracking-wider text-ink">
                  📌 Pinned
                </span>
              )}
              {discussion.is_locked && (
                <span className="px-3 py-1 bg-coral border-2 border-ink text-xs font-bold uppercase tracking-wider text-white">
                  🔒 Locked
                </span>
              )}
            </div>

            <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-foreground mb-3">
              {discussion.title}
            </h1>

            <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm text-foreground font-mono">
              <span className="font-bold">
                by {discussion.author?.name || 'Anonymous'}
              </span>
              <span>{format(new Date(discussion.created_at), 'PPP')}</span>
              <span className="flex items-center gap-1">
                <MessageSquare size={14} strokeWidth={2.5} />
                {discussion.comment_count} {discussion.comment_count === 1 ? 'reply' : 'replies'}
              </span>
              <span>{discussion.view_count} views</span>
            </div>
          </div>

          {/* Content */}
          <div className="p-4 sm:p-6">
            <div className="prose prose-stone max-w-none">
              <p className="text-foreground font-mono whitespace-pre-wrap">{discussion.content}</p>
            </div>
          </div>

          {/* Vote Section */}
          <div className="p-4 sm:p-6 border-t-2 border-ink bg-muted/30">
            <div className="flex items-center justify-between">
              <VoteButtons
                discussionId={discussion.id}
                upvotes={discussion.upvotes}
                downvotes={discussion.downvotes}
                userVote={userVote?.vote_type || null}
              />
              <div className="text-right">
                <p className="text-sm text-foreground font-mono">Was this helpful?</p>
              </div>
            </div>
          </div>
        </div>

        {/* Comments Section */}
        <div className="bg-card border-2 border-ink shadow-neo-lg mb-6">
          <div className="p-4 sm:p-6 border-b-2 border-ink">
            <h2 className="text-lg sm:text-xl font-black text-foreground uppercase">
              {discussion.comment_count} {discussion.comment_count === 1 ? 'Reply' : 'Replies'}
            </h2>
          </div>

          {comments && comments.length > 0 && (
            <div className="divide-y-2 divide-border">
              <CommentList
                comments={comments}
                discussionId={discussion.id}
                discussionAuthorId={discussion.user_id}
                bestAnswerId={discussion.best_answer_id}
                user={user}
              />
            </div>
          )}

          {/* Comment Form */}
          {user && !discussion.is_locked && (
            <div className="p-4 sm:p-6 border-t-2 border-ink bg-muted/30">
              <CommentForm discussionId={discussion.id} />
            </div>
          )}

          {!user && (
            <div className="p-4 sm:p-6 border-t-2 border-ink bg-muted/30 text-center">
              <p className="text-foreground font-mono mb-3">Sign in to join the discussion</p>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 px-6 py-3 bg-coral text-white border-2 border-ink shadow-neo hover:shadow-neo-lg hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all font-bold uppercase tracking-wider"
              >
                Sign In
              </Link>
            </div>
          )}

          {discussion.is_locked && (
            <div className="p-4 sm:p-6 border-t-2 border-ink bg-coral/20 text-center">
              <p className="text-foreground font-mono font-bold">🔒 This discussion is locked. No new replies can be added.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
