'use client'

import { useState } from 'react'
import { useActionState } from 'react'
import { createEvent } from '@/lib/actions/events'
import RichTextEditor from '@/components/RichTextEditor'
import EventPreview from '@/components/EventPreview'
import Link from 'next/link'
import { SectionHeader } from '@/components/neo'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { ArrowRight } from 'lucide-react'

interface EventFormProps {
  userId: string
  cities: Array<{ id: string; name: string }>
  organizerName?: string
}

export default function EventForm({ userId, cities, organizerName }: EventFormProps) {
  const [description, setDescription] = useState('<p>Describe your event here...</p>')
  const [state, formAction] = useActionState(createEvent, null)

  // Preview state
  const [previewData, setPreviewData] = useState({
    title: '',
    start_date: '',
    location_city: '',
    ticket_price: 0,
    organizer_name: organizerName || 'You'
  })

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Form Section */}
      <div className="lg:col-span-7">
        <div className="bg-card border-2 border-ink shadow-neo-lg p-4 sm:p-8">
      {/* Success Message */}
      {state?.success && (
        <div className="mb-6 p-4 bg-mint border-2 border-ink shadow-neo">
          <p className="text-sm text-ink font-bold">✅ Event created successfully!</p>
          <p className="text-xs text-ink/80 mt-2 font-mono">
            Your event is pending approval. You'll be notified once it's reviewed.
          </p>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1 mt-3 text-sm text-ink font-bold uppercase tracking-wider hover:text-coral transition"
          >
            Go to Dashboard <ArrowRight size={14} strokeWidth={3} />
          </Link>
        </div>
      )}

      {/* Error Message */}
      {state?.error && (
        <div className="mb-6 p-4 bg-coral border-2 border-ink shadow-neo">
          <p className="text-sm text-white font-bold">❌ {state.error}</p>
        </div>
      )}

      <form action={formAction} className="space-y-8">
        <input type="hidden" name="organizer_id" value={userId} />
        <input type="hidden" name="description" value={description} />

        {/* Basic Info */}
        <div>
          <SectionHeader number="01" title="Basic Info" className="mb-4" />
          <div className="space-y-4">
            <div>
              <Label htmlFor="title" className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-2 block">
                Event Title *
              </Label>
              <Input
                id="title"
                name="title"
                type="text"
                required
                className="w-full px-4 py-2 border-2 border-ink shadow-neo-sm focus:shadow-neo transition-shadow font-bold"
                placeholder="Summer Board Game Night"
                onChange={(e) => setPreviewData({ ...previewData, title: e.target.value })}
              />
            </div>
          </div>
        </div>

        {/* Description */}
        <div>
          <Label className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-2 block">
            Event Description *
          </Label>
          <RichTextEditor
            content={description}
            onChange={setDescription}
            placeholder="Describe your event, what games will be played, who should attend, etc."
          />
          <p className="text-xs text-muted-foreground mt-2 font-mono">
            Use the toolbar to format your description with headings, lists, and more.
          </p>
        </div>

        {/* Date and Time */}
        <div>
          <SectionHeader number="02" title="Date & Time" className="mb-4" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="start_date" className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-2 block">
                Start Date & Time *
              </Label>
              <Input
                id="start_date"
                name="start_date"
                type="datetime-local"
                required
                className="w-full px-4 py-2 border-2 border-ink shadow-neo-sm focus:shadow-neo transition-shadow font-mono"
                onChange={(e) => setPreviewData({ ...previewData, start_date: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="end_date" className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-2 block">
                End Date & Time
              </Label>
              <Input
                id="end_date"
                name="end_date"
                type="datetime-local"
                className="w-full px-4 py-2 border-2 border-ink shadow-neo-sm focus:shadow-neo transition-shadow font-mono"
              />
              <p className="text-xs text-muted-foreground mt-1 font-mono">Optional - leave empty if same as start date</p>
            </div>
          </div>
        </div>

        {/* Location */}
        <div>
          <SectionHeader number="03" title="Location Details" className="mb-4" />
          <div className="space-y-4">
            <div>
              <Label htmlFor="location_venue" className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-2 block">
                Venue Name
              </Label>
              <Input
                id="location_venue"
                name="location_venue"
                type="text"
                className="w-full px-4 py-2 border-2 border-ink shadow-neo-sm focus:shadow-neo transition-shadow font-bold"
                placeholder="The Game Cafe"
              />
            </div>

            <div>
              <Label htmlFor="location_address" className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-2 block">
                Address
              </Label>
              <Textarea
                id="location_address"
                name="location_address"
                rows={3}
                className="w-full px-4 py-2 border-2 border-ink shadow-neo-sm focus:shadow-neo transition-shadow font-mono resize-none"
                placeholder="123 Main Street, Near Central Park"
              />
            </div>

            <div>
              <Label htmlFor="location_city" className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-2 block">
                City *
              </Label>
              <select
                id="location_city"
                name="location_city"
                required
                className="w-full px-4 py-2 border-2 border-ink shadow-neo-sm focus:shadow-neo transition-shadow bg-card font-bold"
                onChange={(e) => setPreviewData({ ...previewData, location_city: e.target.value })}
              >
                <option value="">Select a city</option>
                {cities.map((city) => (
                  <option key={city.id} value={city.name}>
                    {city.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Capacity and Pricing */}
        <div>
          <SectionHeader number="04" title="Capacity & Pricing" className="mb-4" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="max_attendees" className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-2 block">
                Maximum Attendees
              </Label>
              <Input
                id="max_attendees"
                name="max_attendees"
                type="number"
                min="1"
                className="w-full px-4 py-2 border-2 border-ink shadow-neo-sm focus:shadow-neo transition-shadow font-bold"
                placeholder="20"
              />
              <p className="text-xs text-muted-foreground mt-1 font-mono">Leave empty for unlimited</p>
            </div>
            <div>
              <Label htmlFor="ticket_price" className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-2 block">
                Ticket Price (₹)
              </Label>
              <Input
                id="ticket_price"
                name="ticket_price"
                type="number"
                min="0"
                step="0.01"
                defaultValue="0"
                className="w-full px-4 py-2 border-2 border-ink shadow-neo-sm focus:shadow-neo transition-shadow font-bold"
                placeholder="0.00"
                onChange={(e) => setPreviewData({ ...previewData, ticket_price: parseFloat(e.target.value) || 0 })}
              />
              <p className="text-xs text-muted-foreground mt-1 font-mono">Set to 0 for free events</p>
            </div>
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-sky/10 border-2 border-sky p-4 shadow-neo">
          <p className="text-sm text-foreground font-mono">
            <strong className="font-black">📝 Note:</strong> Your event will be submitted for review. Once approved by our team,
            it will be visible to the community. We typically review events within 24 hours.
          </p>
        </div>

        {/* Submit Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            type="submit"
            className="flex-1 bg-coral text-white py-3 px-6 border-2 border-ink shadow-neo hover:shadow-neo-lg hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all font-bold uppercase tracking-wider flex items-center justify-center gap-2"
          >
            Create Event <ArrowRight size={18} strokeWidth={3} />
          </button>
          <Link
            href="/events"
            className="px-6 py-3 border-2 border-ink text-foreground shadow-neo hover:shadow-neo-lg hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all font-bold uppercase tracking-wider text-center"
          >
            Cancel
          </Link>
        </div>
      </form>
        </div>
      </div>

      {/* Preview Section */}
      <div className="lg:col-span-5">
        <EventPreview formData={previewData} />
      </div>
    </div>
  )
}
