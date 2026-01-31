'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createDiscussion(prevState: any, formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'You must be logged in to create a discussion' }
  }

  const title = formData.get('title') as string
  const content = formData.get('content') as string
  const category = formData.get('category') as string

  if (!title || !content || !category) {
    return { error: 'Title, content, and category are required' }
  }

  const { data, error } = await supabase
    .from('discussions')
    .insert({
      user_id: user.id,
      title,
      content,
      category,
    })
    .select()
    .single()

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/discussions')
  redirect(`/discussions/${data.id}`)
}

export async function createComment(discussionId: string, content: string, parentId?: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'You must be logged in to comment' }
  }

  const { data, error } = await supabase
    .from('discussion_comments')
    .insert({
      discussion_id: discussionId,
      user_id: user.id,
      content,
      parent_id: parentId || null,
    })
    .select()
    .single()

  if (error) {
    return { error: error.message }
  }

  revalidatePath(`/discussions/${discussionId}`)
  return { success: true, data }
}

export async function voteDiscussion(discussionId: string, voteType: number) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'You must be logged in to vote' }
  }

  // Check if user already voted
  const { data: existingVote } = await supabase
    .from('discussion_votes')
    .select('*')
    .eq('discussion_id', discussionId)
    .eq('user_id', user.id)
    .single()

  if (existingVote) {
    if (existingVote.vote_type === voteType) {
      // Remove vote
      await supabase
        .from('discussion_votes')
        .delete()
        .eq('id', existingVote.id)

      // Update discussion counts
      const updateField = voteType === 1 ? 'upvotes' : 'downvotes'
      await supabase.rpc('decrement', {
        table_name: 'discussions',
        row_id: discussionId,
        column_name: updateField
      })
    } else {
      // Change vote
      await supabase
        .from('discussion_votes')
        .update({ vote_type: voteType })
        .eq('id', existingVote.id)

      // Update both counts
      const oldField = existingVote.vote_type === 1 ? 'upvotes' : 'downvotes'
      const newField = voteType === 1 ? 'upvotes' : 'downvotes'

      await supabase.rpc('decrement', {
        table_name: 'discussions',
        row_id: discussionId,
        column_name: oldField
      })
      await supabase.rpc('increment', {
        table_name: 'discussions',
        row_id: discussionId,
        column_name: newField
      })
    }
  } else {
    // New vote
    await supabase
      .from('discussion_votes')
      .insert({
        discussion_id: discussionId,
        user_id: user.id,
        vote_type: voteType,
      })

    // Update discussion counts
    const { data: discussion } = await supabase
      .from('discussions')
      .select('upvotes, downvotes')
      .eq('id', discussionId)
      .single()

    if (discussion) {
      const updates = voteType === 1
        ? { upvotes: discussion.upvotes + 1 }
        : { downvotes: discussion.downvotes + 1 }

      await supabase
        .from('discussions')
        .update(updates)
        .eq('id', discussionId)
    }
  }

  revalidatePath(`/discussions/${discussionId}`)
  return { success: true }
}

export async function voteComment(commentId: string, voteType: number) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'You must be logged in to vote' }
  }

  // Check if user already voted
  const { data: existingVote } = await supabase
    .from('comment_votes')
    .select('*')
    .eq('comment_id', commentId)
    .eq('user_id', user.id)
    .single()

  if (existingVote) {
    if (existingVote.vote_type === voteType) {
      // Remove vote
      await supabase
        .from('comment_votes')
        .delete()
        .eq('id', existingVote.id)

      const updateField = voteType === 1 ? 'upvotes' : 'downvotes'
      const { data: comment } = await supabase
        .from('discussion_comments')
        .select('upvotes, downvotes')
        .eq('id', commentId)
        .single()

      if (comment) {
        const updates = voteType === 1
          ? { upvotes: comment.upvotes - 1 }
          : { downvotes: comment.downvotes - 1 }

        await supabase
          .from('discussion_comments')
          .update(updates)
          .eq('id', commentId)
      }
    } else {
      // Change vote
      await supabase
        .from('comment_votes')
        .update({ vote_type: voteType })
        .eq('id', existingVote.id)

      const { data: comment } = await supabase
        .from('discussion_comments')
        .select('upvotes, downvotes')
        .eq('id', commentId)
        .single()

      if (comment) {
        const oldUpdates = existingVote.vote_type === 1
          ? { upvotes: comment.upvotes - 1 }
          : { downvotes: comment.downvotes - 1 }
        const newUpdates = voteType === 1
          ? { upvotes: comment.upvotes + 1 }
          : { downvotes: comment.downvotes + 1 }

        await supabase
          .from('discussion_comments')
          .update({ ...oldUpdates, ...newUpdates })
          .eq('id', commentId)
      }
    }
  } else {
    // New vote
    await supabase
      .from('comment_votes')
      .insert({
        comment_id: commentId,
        user_id: user.id,
        vote_type: voteType,
      })

    const { data: comment } = await supabase
      .from('discussion_comments')
      .select('upvotes, downvotes, discussion_id')
      .eq('id', commentId)
      .single()

    if (comment) {
      const updates = voteType === 1
        ? { upvotes: comment.upvotes + 1 }
        : { downvotes: comment.downvotes + 1 }

      await supabase
        .from('discussion_comments')
        .update(updates)
        .eq('id', commentId)

      revalidatePath(`/discussions/${comment.discussion_id}`)
    }
  }

  return { success: true }
}

export async function markBestAnswer(discussionId: string, commentId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'You must be logged in' }
  }

  // Check if user is the discussion author
  const { data: discussion } = await supabase
    .from('discussions')
    .select('user_id')
    .eq('id', discussionId)
    .single()

  if (!discussion || discussion.user_id !== user.id) {
    return { error: 'Only the discussion author can mark best answer' }
  }

  // Unmark previous best answer if any
  await supabase
    .from('discussion_comments')
    .update({ is_best_answer: false })
    .eq('discussion_id', discussionId)

  // Mark new best answer
  await supabase
    .from('discussion_comments')
    .update({ is_best_answer: true })
    .eq('id', commentId)

  // Update discussion
  await supabase
    .from('discussions')
    .update({ best_answer_id: commentId })
    .eq('id', discussionId)

  revalidatePath(`/discussions/${discussionId}`)
  return { success: true }
}
