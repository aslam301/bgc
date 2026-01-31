'use client'

import { voteDiscussion } from '@/lib/actions/discussions'
import { ThumbsUp, ThumbsDown } from 'lucide-react'
import { useState } from 'react'

export default function VoteButtons({
  discussionId,
  upvotes,
  downvotes,
  userVote,
}: {
  discussionId: string
  upvotes: number
  downvotes: number
  userVote: number | null
}) {
  const [isVoting, setIsVoting] = useState(false)

  async function handleVote(voteType: number) {
    setIsVoting(true)
    await voteDiscussion(discussionId, voteType)
    setIsVoting(false)
  }

  const totalVotes = upvotes - downvotes

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={() => handleVote(1)}
        disabled={isVoting}
        className={`flex items-center gap-2 px-4 py-2 border-2 border-ink shadow-neo-sm hover:shadow-neo hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all font-bold uppercase tracking-wider ${
          userVote === 1
            ? 'bg-mint text-ink'
            : 'bg-card text-foreground'
        }`}
      >
        <ThumbsUp size={16} strokeWidth={2.5} />
        <span>{upvotes}</span>
      </button>

      <div className="px-4 py-2 bg-muted border-2 border-ink font-black text-foreground text-lg">
        {totalVotes > 0 ? '+' : ''}{totalVotes}
      </div>

      <button
        onClick={() => handleVote(-1)}
        disabled={isVoting}
        className={`flex items-center gap-2 px-4 py-2 border-2 border-ink shadow-neo-sm hover:shadow-neo hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all font-bold uppercase tracking-wider ${
          userVote === -1
            ? 'bg-coral text-white'
            : 'bg-card text-foreground'
        }`}
      >
        <ThumbsDown size={16} strokeWidth={2.5} />
        <span>{downvotes}</span>
      </button>
    </div>
  )
}
