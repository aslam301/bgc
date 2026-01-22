import Link from 'next/link'
import { format } from 'date-fns'
import Image from 'next/image'

interface EventCardProps {
  event: {
    id: string
    title: string
    start_date: string
    location_city: string
    location_venue?: string
    ticket_price: number
    organizer?: {
      name: string
    }
  }
  variant?: 'grid' | 'list'
}

export default function EventCard({ event, variant = 'grid' }: EventCardProps) {
  // List variant (Luma style - horizontal layout)
  if (variant === 'list') {
    return (
      <Link
        href={`/events/${event.id}`}
        className="group flex gap-4 p-4 sm:p-5 bg-white border border-stone-200 rounded-2xl hover:border-brand-300 hover:shadow-md transition-all"
      >
        {/* Time Badge */}
        <div className="flex-shrink-0 text-sm text-stone-600 font-medium pt-1">
          {format(new Date(event.start_date), 'HH:mm')}
        </div>

        {/* Event Content */}
        <div className="flex-1 min-w-0 flex flex-col sm:flex-row gap-4">
          <div className="flex-1 min-w-0">
            {/* Title */}
            <h3 className="font-bold text-stone-900 text-lg sm:text-xl mb-2 group-hover:text-brand-700 transition line-clamp-2">
              {event.title}
            </h3>

            {/* Organizer */}
            {event.organizer && (
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white text-xs font-semibold">
                  {event.organizer.name.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm text-stone-600">
                  By <span className="font-medium text-stone-700">{event.organizer.name}</span>
                </span>
              </div>
            )}

            {/* Location */}
            <div className="flex items-center gap-1.5 text-sm text-stone-600">
              <svg className="w-4 h-4 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="font-medium">{event.location_venue || event.location_city}</span>
            </div>

            {/* Price */}
            <div className="mt-3">
              {event.ticket_price > 0 ? (
                <span className="text-sm font-semibold text-stone-900">₹{event.ticket_price}</span>
              ) : (
                <span className="inline-block px-2 py-1 text-xs font-bold text-brand-700 bg-brand-50 border border-brand-200 rounded-md">
                  FREE
                </span>
              )}
            </div>
          </div>

          {/* Event Image */}
          <div className="flex-shrink-0 w-full sm:w-32 h-32 sm:h-auto rounded-xl overflow-hidden bg-stone-200 relative">
            <img
              src={`https://images.unsplash.com/photo-1606167668584-78701c57f13d?w=300&h=200&fit=crop&q=80`}
              alt={event.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
        </div>
      </Link>
    )
  }

  // Grid variant (default - card layout)
  return (
    <Link
      href={`/events/${event.id}`}
      className="group block bg-white border border-stone-200 rounded-2xl overflow-hidden hover:border-brand-300 hover:shadow-lg transition-all duration-300"
    >
      {/* Event Image */}
      <div className="relative h-36 sm:h-40 overflow-hidden bg-stone-200">
        <img
          src={`https://images.unsplash.com/photo-1606167668584-78701c57f13d?w=500&h=300&fit=crop&q=80`}
          alt={event.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
        {event.ticket_price === 0 && (
          <div className="absolute top-3 right-3 px-2.5 py-1 bg-brand-500 text-white text-xs font-bold rounded-lg shadow-lg">
            FREE
          </div>
        )}
      </div>

      {/* Event Content */}
      <div className="p-4">
        {/* Date */}
        <div className="text-xs font-semibold text-brand-600 mb-2">
          {format(new Date(event.start_date), 'EEE, MMM d · h:mm a').toUpperCase()}
        </div>

        {/* Title */}
        <h3 className="font-bold text-stone-900 text-base mb-3 line-clamp-2 group-hover:text-brand-700 transition min-h-[3rem]">
          {event.title}
        </h3>

        {/* Location */}
        <div className="flex items-center gap-1.5 text-sm text-stone-600 mb-3">
          <svg className="w-4 h-4 text-stone-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="truncate font-medium text-stone-700">{event.location_city}</span>
        </div>

        {/* Bottom Section */}
        <div className="flex items-center justify-between pt-3 border-t border-stone-100">
          {/* Price */}
          <div>
            {event.ticket_price > 0 ? (
              <span className="text-lg font-bold text-stone-900">₹{event.ticket_price}</span>
            ) : (
              <span className="text-sm font-semibold text-brand-600">Free</span>
            )}
          </div>

          {/* Organizer Avatar */}
          {event.organizer && (
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white text-xs font-semibold">
                {event.organizer.name.charAt(0).toUpperCase()}
              </div>
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}
