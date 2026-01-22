'use client'

import { approveEvent, rejectEvent, deleteEvent } from '@/lib/actions/admin'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface EventDetailActionsProps {
  event: any
}

export default function EventDetailActions({ event }: EventDetailActionsProps) {
  const [loading, setLoading] = useState(false)
  const [showRejectModal, setShowRejectModal] = useState(false)
  const [rejectReason, setRejectReason] = useState('')
  const router = useRouter()

  const handleApprove = async () => {
    if (!confirm('Are you sure you want to approve this event?')) return

    setLoading(true)
    const result = await approveEvent(event.id)
    setLoading(false)

    if (result.error) {
      alert(result.error)
    } else {
      alert('Event approved successfully!')
      router.refresh()
    }
  }

  const handleReject = async () => {
    setLoading(true)
    const result = await rejectEvent(event.id, rejectReason)
    setLoading(false)

    if (result.error) {
      alert(result.error)
    } else {
      alert('Event rejected successfully!')
      setShowRejectModal(false)
      setRejectReason('')
      router.refresh()
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to DELETE this event? This cannot be undone!')) return

    setLoading(true)
    const result = await deleteEvent(event.id)
    setLoading(false)

    if (result.error) {
      alert(result.error)
    } else {
      alert('Event deleted successfully!')
      router.push('/admin/events')
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-bold text-slate-900 mb-4">Admin Actions</h3>
      <div className="flex flex-wrap gap-3">
        {event.moderation_status === 'pending' && (
          <>
            <button
              onClick={handleApprove}
              disabled={loading}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium disabled:opacity-50"
            >
              ✅ Approve Event
            </button>
            <button
              onClick={() => setShowRejectModal(true)}
              disabled={loading}
              className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium disabled:opacity-50"
            >
              ❌ Reject Event
            </button>
          </>
        )}

        {event.moderation_status === 'approved' && (
          <div className="px-6 py-3 bg-green-100 text-green-800 rounded-lg font-medium">
            ✅ Event is Approved
          </div>
        )}

        {event.moderation_status === 'rejected' && (
          <button
            onClick={handleApprove}
            disabled={loading}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium disabled:opacity-50"
          >
            Re-approve Event
          </button>
        )}

        <button
          onClick={handleDelete}
          disabled={loading}
          className="px-6 py-3 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition font-medium disabled:opacity-50"
        >
          🗑️ Delete Event
        </button>
      </div>

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-slate-900 mb-4">Reject Event</h3>
            <p className="text-slate-600 mb-4">
              Please provide a reason for rejection (will be visible to the organizer):
            </p>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="e.g., Inappropriate content, missing details, duplicate event, etc."
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent mb-4"
              rows={5}
            />
            <div className="flex gap-3">
              <button
                onClick={handleReject}
                disabled={loading}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium disabled:opacity-50"
              >
                Reject Event
              </button>
              <button
                onClick={() => {
                  setShowRejectModal(false)
                  setRejectReason('')
                }}
                disabled={loading}
                className="flex-1 px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition font-medium disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
