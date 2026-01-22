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
        className="group flex gap-4 p-4 bg-white border border-slate-200 rounded-xl hover:border-slate-300 hover:shadow-md transition-all"
      >
        {/* Event Image */}
        <div className="flex-shrink-0 w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg overflow-hidden">
          <div className="w-full h-full flex items-center justify-center text-3xl group-hover:scale-110 transition-transform duration-300">
            🎲
          </div>
        </div>

        {/* Event Content */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-slate-900 text-base sm:text-lg mb-1 truncate group-hover:text-slate-700 transition">
            {event.title}
          </h3>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm text-slate-600">
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {format(new Date(event.start_date), 'MMM d')}
            </span>
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {event.location_city}
            </span>
          </div>
        </div>

        {/* Price */}
        <div className="flex-shrink-0 text-right">
          {event.ticket_price > 0 ? (
            <div className="text-base sm:text-lg font-bold text-slate-900">
              ₹{event.ticket_price}
            </div>
          ) : (
            <div className="text-xs sm:text-sm font-semibold text-green-600 px-2 py-1 bg-green-50 rounded-md">
              FREE
            </div>
          )}
        </div>
      </Link>
    )
  }

  // Grid variant (default)
  return (
    <Link
      href={`/events/${event.id}`}
      className="group block bg-white border border-slate-200 rounded-xl overflow-hidden hover:border-slate-300 hover:shadow-lg transition-all"
    >
      {/* Event Image */}
      <div className="relative h-40 sm:h-48 bg-gradient-to-br from-slate-100 to-slate-200 overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center text-5xl sm:text-6xl group-hover:scale-110 transition-transform duration-300">
          🎲
        </div>
        {event.ticket_price === 0 && (
          <div className="absolute top-3 right-3 px-2 py-1 bg-green-500 text-white text-xs font-bold rounded-md shadow-md">
            FREE
          </div>
        )}
      </div>

      {/* Event Content */}
      <div className="p-4 sm:p-5">
        <h3 className="font-semibold text-slate-900 text-base sm:text-lg mb-2 line-clamp-2 group-hover:text-slate-700 transition min-h-[3rem]">
          {event.title}
        </h3>

        <div className="space-y-1.5 text-sm text-slate-600 mb-3">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="font-medium">{format(new Date(event.start_date), 'MMM d, yyyy')}</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="truncate">{event.location_city}</span>
          </div>
        </div>

        {/* Price & Organizer */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
          {event.ticket_price > 0 ? (
            <div>
              <span className="text-lg sm:text-xl font-bold text-slate-900">₹{event.ticket_price}</span>
              <span className="text-xs text-slate-500 ml-1">/ person</span>
            </div>
          ) : (
            <div className="text-base font-bold text-green-600">Free Event</div>
          )}
          {event.organizer && (
            <div className="text-xs text-slate-500 truncate max-w-[120px]">
              by {event.organizer.name}
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}
