'use client'

import { useState } from 'react'
import { useActionState } from 'react'
import { createEvent } from '@/lib/actions/events'
import RichTextEditor from '@/components/RichTextEditor'
import Link from 'next/link'

interface EventFormProps {
  userId: string
}

export default function EventForm({ userId }: EventFormProps) {
  const [description, setDescription] = useState('<p>Describe your event here...</p>')
  const [state, formAction] = useActionState(createEvent, null)

  return (
    <div className="bg-white rounded-lg shadow-md p-8">
      {/* Success Message */}
      {state?.success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-800 font-medium">✅ Event created successfully!</p>
          <p className="text-xs text-green-700 mt-2">
            Your event is pending approval. You'll be notified once it's reviewed.
          </p>
          <Link
            href="/dashboard"
            className="inline-block mt-3 text-sm text-green-800 underline font-medium"
          >
            Go to Dashboard →
          </Link>
        </div>
      )}

      {/* Error Message */}
      {state?.error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-800 font-medium">❌ {state.error}</p>
        </div>
      )}

      <form action={formAction} className="space-y-6">
        <input type="hidden" name="organizer_id" value={userId} />
        <input type="hidden" name="description" value={description} />

        {/* Basic Info */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-slate-700 mb-2">
            Event Title *
          </label>
          <input
            id="title"
            name="title"
            type="text"
            required
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
            placeholder="Summer Board Game Night"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Event Description *
          </label>
          <RichTextEditor
            content={description}
            onChange={setDescription}
            placeholder="Describe your event, what games will be played, who should attend, etc."
          />
          <p className="text-xs text-slate-500 mt-1">
            Use the toolbar to format your description with headings, lists, and more.
          </p>
        </div>

        {/* Date and Time */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="start_date" className="block text-sm font-medium text-slate-700 mb-2">
              Start Date & Time *
            </label>
            <input
              id="start_date"
              name="start_date"
              type="datetime-local"
              required
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
            />
          </div>
          <div>
            <label htmlFor="end_date" className="block text-sm font-medium text-slate-700 mb-2">
              End Date & Time
            </label>
            <input
              id="end_date"
              name="end_date"
              type="datetime-local"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
            />
            <p className="text-xs text-slate-500 mt-1">Optional - leave empty if same as start date</p>
          </div>
        </div>

        {/* Location */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-slate-900">Location Details</h3>

          <div>
            <label htmlFor="location_venue" className="block text-sm font-medium text-slate-700 mb-2">
              Venue Name
            </label>
            <input
              id="location_venue"
              name="location_venue"
              type="text"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
              placeholder="The Game Cafe"
            />
          </div>

          <div>
            <label htmlFor="location_address" className="block text-sm font-medium text-slate-700 mb-2">
              Address
            </label>
            <textarea
              id="location_address"
              name="location_address"
              rows={3}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
              placeholder="123 Main Street, Near Central Park"
            />
          </div>

          <div>
            <label htmlFor="location_city" className="block text-sm font-medium text-slate-700 mb-2">
              City *
            </label>
            <input
              id="location_city"
              name="location_city"
              type="text"
              required
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
              placeholder="Mumbai"
            />
          </div>
        </div>

        {/* Capacity and Pricing */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="max_attendees" className="block text-sm font-medium text-slate-700 mb-2">
              Maximum Attendees
            </label>
            <input
              id="max_attendees"
              name="max_attendees"
              type="number"
              min="1"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
              placeholder="20"
            />
            <p className="text-xs text-slate-500 mt-1">Leave empty for unlimited</p>
          </div>
          <div>
            <label htmlFor="ticket_price" className="block text-sm font-medium text-slate-700 mb-2">
              Ticket Price (₹)
            </label>
            <input
              id="ticket_price"
              name="ticket_price"
              type="number"
              min="0"
              step="0.01"
              defaultValue="0"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
              placeholder="0.00"
            />
            <p className="text-xs text-slate-500 mt-1">Set to 0 for free events</p>
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            <strong>📝 Note:</strong> Your event will be submitted for review. Once approved by our team,
            it will be visible to the community. We typically review events within 24 hours.
          </p>
        </div>

        {/* Submit Buttons */}
        <div className="flex gap-4">
          <button
            type="submit"
            className="flex-1 bg-slate-900 text-white py-3 px-6 rounded-lg hover:bg-slate-800 transition font-medium"
          >
            Create Event
          </button>
          <Link
            href="/events"
            className="px-6 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition font-medium"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  )
}
