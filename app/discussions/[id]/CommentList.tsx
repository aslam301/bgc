'use client'

import { format } from 'date-fns'
import { Award, ThumbsUp, ThumbsDown, Reply } from 'lucide-react'
import { useState } from 'react'
import CommentForm from './CommentForm'
import { voteComment, markBestAnswer } from '@/lib/actions/discussions'

interface Comment {
  id: string
  content: string
  upvotes: number
  downvotes: number
  created_at: string
  is_best_answer: boolean
  author: { name: string } | null
  user_id: string
}

export default function CommentList({
  comments,
  discussionId,
  discussionAuthorId,
  bestAnswerId,
  user,
}: {
  comments: Comment[]
  discussionId: string
  discussionAuthorId: string
  bestAnswerId: string | null
  user: any
}) {
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [votingComments, setVotingComments] = useState<Set<string>>(new Set())

  async function handleVote(commentId: string, voteType: number) {
    setVotingComments(prev => new Set(prev).add(commentId))
    await voteComment(commentId, voteType)
    setVotingComments(prev => {
      const next = new Set(prev)
      next.delete(commentId)
      return next
    })
  }

  async function handleMarkBestAnswer(commentId: string) {
    await markBestAnswer(discussionId, commentId)
  }

  return (
    <>
      {comments.map((comment) => {
        const isVoting = votingComments.has(comment.id)
        const isAuthor = user?.id === discussionAuthorId

        return (
          <div key={comment.id} className="p-4 sm:p-6">
            {comment.is_best_answer && (
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-mint border-2 border-ink mb-3 text-xs font-bold uppercase tracking-wider text-ink">
                <Award size={14} strokeWidth={3} />
                Best Answer
              </div>
            )}

            <div className="flex gap-3 sm:gap-4">
              {/* Vote Column */}
              <div className="flex flex-col items-center gap-2">
                <button
                  onClick={() => handleVote(comment.id, 1)}
                  disabled={isVoting || !user}
                  className="w-8 h-8 border-2 border-ink flex items-center justify-center hover:bg-mint hover:text-ink transition disabled:opacity-50"
                >
                  <ThumbsUp size={14} strokeWidth={2.5} />
                </button>

                <div className="font-black text-foreground">
                  {comment.upvotes - comment.downvotes}
                </div>

                <button
                  onClick={() => handleVote(comment.id, -1)}
                  disabled={isVoting || !user}
                  className="w-8 h-8 border-2 border-ink flex items-center justify-center hover:bg-coral hover:text-white transition disabled:opacity-50"
                >
                  <ThumbsDown size={14} strokeWidth={2.5} />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2 text-xs text-foreground font-mono">
                  <span className="font-bold">{comment.author?.name || 'Anonymous'}</span>
                  <span>{format(new Date(comment.created_at), 'PPP')}</span>
                </div>

                <p className="text-foreground font-mono whitespace-pre-wrap mb-3">
                  {comment.content}
                </p>

                {/* Actions */}
                <div className="flex flex-wrap items-center gap-3">
                  {user && (
                    <button
                      onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                      className="inline-flex items-center gap-1 text-xs text-coral hover:underline font-bold uppercase tracking-wider"
                    >
                      <Reply size={12} strokeWidth={3} />
                      Reply
                    </button>
                  )}

                  {isAuthor && !comment.is_best_answer && !bestAnswerId && (
                    <button
                      onClick={() => handleMarkBestAnswer(comment.id)}
                      className="inline-flex items-center gap-1 text-xs text-mint hover:underline font-bold uppercase tracking-wider"
                    >
                      <Award size={12} strokeWidth={3} />
                      Mark as Best Answer
                    </button>
                  )}
                </div>

                {/* Reply Form */}
                {replyingTo === comment.id && (
                  <div className="mt-4 pl-4 border-l-2 border-coral">
                    <CommentForm discussionId={discussionId} parentId={comment.id} />
                  </div>
                )}
              </div>
            </div>
          </div>
        )
      })}
    </>
  )
}
