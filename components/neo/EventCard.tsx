import Link from "next/link";
import { ArrowUpRight, Calendar, MapPin } from "lucide-react";

interface EventCardProps {
  id: string;
  title: string;
  date: string;
  time: string;
  venue: string;
  price: number;
  accent: "coral" | "grape" | "sunny" | "mint";
}

const EventCard = ({ id, title, date, time, venue, price, accent }: EventCardProps) => {
  const accentBg: Record<string, string> = {
    coral: "bg-coral",
    grape: "bg-grape",
    sunny: "bg-sunny",
    mint: "bg-mint",
  };

  return (
    <Link href={`/events/${id}`} className="block">
      <div className="bg-card border-2 border-ink shadow-[4px_4px_0_0_hsl(var(--ink))] hover:shadow-[6px_6px_0_0_hsl(var(--ink))] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all group">
        <div className="flex">
          {/* Date column */}
          <div className={`w-16 shrink-0 ${accentBg[accent]} flex flex-col items-center justify-center py-3 border-r-2 border-ink`}>
            <span className="font-mono text-[10px] text-ink/80 uppercase tracking-wide">
              {date.split(" ")[0]}
            </span>
            <span className="font-black text-xl text-ink">
              {date.split(" ")[1]}
            </span>
          </div>

          <div className="flex-1 p-3 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-1.5">
              <h4 className="font-bold text-foreground text-sm group-hover:text-coral transition-colors line-clamp-1">
                {title}
              </h4>
              <span className={`shrink-0 px-1.5 py-0.5 text-[10px] font-bold border border-ink ${
                price === 0 ? "bg-mint text-ink" : "bg-sunny text-ink"
              }`}>
                {price === 0 ? "FREE" : `₹${price}`}
              </span>
            </div>

            <div className="flex items-center gap-3 font-mono text-[11px] text-muted-foreground">
              <span className="flex items-center gap-1">
                <Calendar size={10} />
                {time}
              </span>
              <span className="flex items-center gap-1">
                <MapPin size={10} />
                {venue}
              </span>
            </div>
          </div>

          <div className="shrink-0 w-10 flex items-center justify-center border-l-2 border-ink bg-muted group-hover:bg-coral group-hover:text-white transition-colors">
            <ArrowUpRight size={16} strokeWidth={2.5} />
          </div>
        </div>
      </div>
    </Link>
  );
};

export default EventCard;
