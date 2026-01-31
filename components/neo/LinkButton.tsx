import { LucideIcon } from "lucide-react";

interface LinkButtonProps {
  icon: LucideIcon;
  label: string;
  href: string;
  color?: "coral" | "sunny" | "grape" | "mint" | "sky" | "ink";
}

const LinkButton = ({ icon: Icon, label, href, color = "ink" }: LinkButtonProps) => {
  const colorStyles = {
    coral: "bg-coral text-primary-foreground shadow-[4px_4px_0_0_hsl(var(--ink))] hover:shadow-[6px_6px_0_0_hsl(var(--ink))]",
    sunny: "bg-sunny text-secondary-foreground shadow-[4px_4px_0_0_hsl(var(--ink))] hover:shadow-[6px_6px_0_0_hsl(var(--ink))]",
    grape: "bg-grape text-accent-foreground shadow-[4px_4px_0_0_hsl(var(--ink))] hover:shadow-[6px_6px_0_0_hsl(var(--ink))]",
    mint: "bg-mint text-secondary-foreground shadow-[4px_4px_0_0_hsl(var(--ink))] hover:shadow-[6px_6px_0_0_hsl(var(--ink))]",
    sky: "bg-sky text-primary-foreground shadow-[4px_4px_0_0_hsl(var(--ink))] hover:shadow-[6px_6px_0_0_hsl(var(--ink))]",
    ink: "bg-ink text-primary-foreground shadow-[4px_4px_0_0_hsl(var(--coral))] hover:shadow-[6px_6px_0_0_hsl(var(--coral))]",
  };

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`flex items-center gap-4 w-full py-4 px-5 font-bold text-sm uppercase tracking-wider transition-all duration-200 btn-lift ${colorStyles[color]}`}
    >
      <Icon size={20} strokeWidth={2.5} />
      <span>{label}</span>
    </a>
  );
};

export default LinkButton;
