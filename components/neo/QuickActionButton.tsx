import Link from "next/link";
import { LucideIcon } from "lucide-react";

interface QuickActionButtonProps {
  icon: LucideIcon;
  label: string;
  href: string;
  color: "coral" | "sunny" | "grape" | "mint";
}

const QuickActionButton = ({ icon: Icon, label, href, color }: QuickActionButtonProps) => {
  const colorStyles = {
    coral: "border-coral text-coral hover:bg-coral hover:text-primary-foreground",
    sunny: "border-sunny text-sunny hover:bg-sunny hover:text-secondary-foreground",
    grape: "border-grape text-grape hover:bg-grape hover:text-accent-foreground",
    mint: "border-mint text-mint hover:bg-mint hover:text-secondary-foreground",
  };

  return (
    <Link
      href={href}
      className={`flex flex-col items-center gap-2 p-4 border-2 bg-card transition-all duration-200 btn-lift ${colorStyles[color]}`}
    >
      <Icon size={22} strokeWidth={2.5} />
      <span className="text-[10px] font-bold uppercase tracking-widest">
        {label}
      </span>
    </Link>
  );
};

export default QuickActionButton;
