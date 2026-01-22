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
  // List variant (Luma style - horizontal layout with background image)
  if (variant === 'list') {
    return (
      <Link
        href={`/events/${event.id}`}
        className="group block relative h-48 sm:h-56 rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300"
      >
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src={`https://images.unsplash.com/photo-1606167668584-78701c57f13d?w=800&h=400&fit=crop&q=80`}
            alt={event.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
          {/* Gradient Overlay - transparent to dark */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent"></div>
        </div>

        {/* Content - positioned at bottom */}
        <div className="absolute inset-0 flex flex-col justify-end p-5 sm:p-6">
          {/* Time Badge */}
          <div className="text-xs sm:text-sm text-white/80 font-medium mb-2">
            {format(new Date(event.start_date), 'EEE, MMM d · h:mm a').toUpperCase()}
          </div>

          {/* Title */}
          <h3 className="font-bold text-white text-lg sm:text-xl lg:text-2xl mb-3 line-clamp-2 group-hover:text-brand-300 transition">
            {event.title}
          </h3>

          {/* Bottom Row: Location, Organizer, Price */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-4">
            {/* Location */}
            <div className="flex items-center gap-1.5 text-xs sm:text-sm text-white/90">
              <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="font-medium">{event.location_city}</span>
            </div>

            {/* Organizer */}
            {event.organizer && (
              <div className="flex items-center gap-2 text-xs sm:text-sm text-white/90">
                <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white text-xs font-semibold">
                  {event.organizer.name.charAt(0).toUpperCase()}
                </div>
                <span className="font-medium">{event.organizer.name}</span>
              </div>
            )}

            {/* Price */}
            <div className="ml-auto">
              {event.ticket_price && event.ticket_price > 0 ? (
                <span className="text-sm sm:text-base font-bold text-white">₹{event.ticket_price}</span>
              ) : (
                <span className="text-sm sm:text-base font-bold text-white">Free</span>
              )}
            </div>
          </div>
        </div>
      </Link>
    )
  }

  // Grid variant (default - card layout with background image)
  return (
    <Link
      href={`/events/${event.id}`}
      className="group block relative h-80 sm:h-72 md:h-80 rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300"
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={`https://images.unsplash.com/photo-1606167668584-78701c57f13d?w=600&h=400&fit=crop&q=80`}
          alt={event.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        {/* Gradient Overlay - transparent to dark */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
      </div>

      {/* FREE Badge */}
      {event.ticket_price === 0 && (
        <div className="absolute top-3 right-3 z-10 px-2.5 py-1 bg-brand-500/90 backdrop-blur-sm text-white text-xs font-bold rounded-lg shadow-lg">
          FREE
        </div>
      )}

      {/* Content - positioned at bottom */}
      <div className="absolute inset-0 flex flex-col justify-end p-4 sm:p-5">
        {/* Date */}
        <div className="text-xs font-semibold text-white/80 mb-2">
          {format(new Date(event.start_date), 'EEE, MMM d · h:mm a').toUpperCase()}
        </div>

        {/* Title */}
        <h3 className="font-bold text-white text-base sm:text-lg mb-3 line-clamp-2 group-hover:text-brand-300 transition min-h-[3rem]">
          {event.title}
        </h3>

        {/* Location */}
        <div className="flex items-center gap-1.5 text-sm text-white/90 mb-3">
          <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="truncate font-medium">{event.location_city}</span>
        </div>

        {/* Bottom Section */}
        <div className="flex items-center justify-between pt-3 border-t border-white/20">
          {/* Price - Always show either price or Free */}
          <div>
            {event.ticket_price && event.ticket_price > 0 ? (
              <span className="text-lg font-bold text-white">₹{event.ticket_price}</span>
            ) : (
              <span className="text-base font-bold text-white">Free</span>
            )}
          </div>

          {/* Organizer Avatar */}
          {event.organizer && (
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white text-xs font-semibold shadow-lg">
                {event.organizer.name.charAt(0).toUpperCase()}
              </div>
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}
