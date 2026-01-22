'use client'

import { format } from 'date-fns'
import { useState } from 'react'

interface EventPreviewProps {
  formData: {
    title: string
    start_date: string
    location_city: string
    ticket_price: number
    organizer_name?: string
  }
}

export default function EventPreview({ formData }: EventPreviewProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const eventCard = (className: string = '') => (
    <div className={`relative h-80 rounded-2xl overflow-hidden shadow-2xl ${className}`}>
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1606167668584-78701c57f13d?w=600&h=400&fit=crop&q=80"
          alt="Event Preview"
          className="w-full h-full object-cover"
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
      </div>

      {/* FREE Badge */}
      {(!formData.ticket_price || formData.ticket_price === 0) && (
        <div className="absolute top-3 right-3 z-10 px-2.5 py-1 bg-brand-500/90 backdrop-blur-sm text-white text-xs font-bold rounded-lg shadow-lg">
          FREE
        </div>
      )}

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-end p-4 sm:p-5">
        {/* Date */}
        <div className="text-xs font-semibold text-white/80 mb-2">
          {formData.start_date ? (
            format(new Date(formData.start_date), 'EEE, MMM d · h:mm a').toUpperCase()
          ) : (
            'SELECT DATE'
          )}
        </div>

        {/* Title */}
        <h3 className="font-bold text-white text-base sm:text-lg mb-3 line-clamp-2 min-h-[3rem]">
          {formData.title || 'Your Event Title'}
        </h3>

        {/* Location */}
        <div className="flex items-center gap-1.5 text-sm text-white/90 mb-3">
          <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="truncate font-medium">{formData.location_city || 'Select City'}</span>
        </div>

        {/* Bottom Section */}
        <div className="flex items-center justify-between pt-3 border-t border-white/20">
          {/* Price */}
          <div>
            {formData.ticket_price && formData.ticket_price > 0 ? (
              <span className="text-lg font-bold text-white">₹{formData.ticket_price}</span>
            ) : (
              <span className="text-base font-bold text-white">Free</span>
            )}
          </div>

          {/* Organizer Avatar */}
          {formData.organizer_name && (
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white text-xs font-semibold shadow-lg">
                {formData.organizer_name.charAt(0).toUpperCase()}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop: Side-by-side Preview */}
      <div className="hidden lg:block sticky top-20 space-y-4">
        <div className="bg-white rounded-lg border-2 border-stone-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <svg className="w-5 h-5 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            <h3 className="text-lg font-bold text-stone-900">Live Preview</h3>
          </div>
          <p className="text-sm text-stone-600 mb-4">
            This is how your event will appear on the events page
          </p>
          {eventCard()}
        </div>
      </div>

      {/* Mobile: Popup Button */}
      <div className="lg:hidden fixed bottom-4 right-4 z-50">
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-3 bg-brand-600 hover:bg-brand-700 text-white rounded-full shadow-lg transition font-semibold"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          Preview
        </button>
      </div>

      {/* Mobile: Modal */}
      {isModalOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[200] lg:hidden"
            onClick={() => setIsModalOpen(false)}
          />

          {/* Modal Content */}
          <div className="fixed inset-0 z-[210] flex items-center justify-center p-4 pointer-events-none lg:hidden">
            <div className="pointer-events-auto w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden animate-slide-in">
              {/* Modal Header */}
              <div className="flex items-center justify-between p-4 border-b border-stone-200">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <h3 className="text-lg font-bold text-stone-900">Live Preview</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 hover:bg-stone-100 rounded-lg transition"
                >
                  <svg className="w-5 h-5 text-stone-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6">
                <p className="text-sm text-stone-600 mb-4">
                  This is how your event will appear on the events page
                </p>
                {eventCard('w-full')}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
}
