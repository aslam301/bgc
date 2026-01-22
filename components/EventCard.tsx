import Link from 'next/link'
import { format } from 'date-fns'

interface EventCardProps {
  event: {
    id: string
    title: string
    start_date: string
    location_city: string
    ticket_price: number
    organizer?: {
      name: string
    }
  }
  variant?: 'grid' | 'list'
}

export default function EventCard({ event, variant = 'grid' }: EventCardProps) {
  if (variant === 'list') {
    return (
      <Link
        href={`/events/${event.id}`}
        className="group flex gap-3 sm:gap-4 p-3 sm:p-4 bg-white border border-stone-200 rounded-xl hover:border-stone-300 hover:shadow-sm transition-all"
      >
        {/* Event Image */}
        <div className="flex-shrink-0 w-[90px] h-[90px] sm:w-[120px] sm:h-[120px] rounded-lg overflow-hidden bg-stone-200 relative">
          <img
            src={`https://images.unsplash.com/photo-1606167668584-78701c57f13d?w=200&h=200&fit=crop&q=80`}
            alt={event.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
        </div>

        {/* Event Content */}
        <div className="flex-1 min-w-0 py-1">
          <h3 className="font-semibold text-stone-900 text-base sm:text-lg mb-2 truncate group-hover:text-stone-700 transition">
            {event.title}
          </h3>

          <div className="flex flex-col gap-1.5 text-xs sm:text-sm text-stone-600">
            <span className="flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {format(new Date(event.start_date), 'EEE, MMM d · h:mm a')}
            </span>
            <span className="flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {event.location_city}
            </span>
          </div>

          {/* Price */}
          <div className="mt-2">
            {event.ticket_price > 0 ? (
              <span className="text-sm sm:text-base font-semibold text-stone-900">
                ₹{event.ticket_price}
              </span>
            ) : (
              <span className="inline-block px-2 py-0.5 text-xs font-semibold text-brand-700 bg-brand-50 rounded-md">
                FREE
              </span>
            )}
          </div>
        </div>
      </Link>
    )
  }

  // Grid variant (default)
  return (
    <Link
      href={`/events/${event.id}`}
      className="group block bg-white border border-stone-200 rounded-xl overflow-hidden hover:border-stone-300 hover:shadow-md transition-all duration-200"
    >
      {/* Event Image */}
      <div className="relative h-36 sm:h-40 overflow-hidden bg-stone-200">
        <img
          src={`https://images.unsplash.com/photo-1606167668584-78701c57f13d?w=500&h=300&fit=crop&q=80`}
          alt={event.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
        {event.ticket_price === 0 && (
          <div className="absolute top-2 right-2 px-2 py-0.5 bg-brand-500 text-white text-xs font-bold rounded-md shadow-md">
            FREE
          </div>
        )}
      </div>

      {/* Event Content */}
      <div className="p-3 sm:p-4">
        <h3 className="font-semibold text-stone-900 text-sm sm:text-base mb-2 line-clamp-2 group-hover:text-stone-700 transition min-h-[2.5rem] sm:min-h-[3rem]">
          {event.title}
        </h3>

        <div className="space-y-1.5 text-xs sm:text-sm text-stone-600 mb-3">
          <div className="flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5 flex-shrink-0 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="font-medium text-stone-700">{format(new Date(event.start_date), 'MMM d')}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5 flex-shrink-0 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-xs">{format(new Date(event.start_date), 'h:mm a')}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5 flex-shrink-0 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="truncate font-medium text-stone-700 text-xs">{event.location_city}</span>
          </div>
        </div>

        {/* Price & Organizer */}
        <div className="flex items-center justify-between pt-3 border-t border-stone-100">
          {event.ticket_price > 0 ? (
            <div>
              <span className="text-base sm:text-lg font-bold text-stone-900">₹{event.ticket_price}</span>
            </div>
          ) : (
            <div className="text-sm font-semibold text-brand-600">Free</div>
          )}
          {event.organizer && (
            <div className="text-xs text-stone-500 truncate max-w-[80px] sm:max-w-[100px]">
              {event.organizer.name}
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}
