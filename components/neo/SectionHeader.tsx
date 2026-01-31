interface SectionHeaderProps {
  title: string;
  number?: string;
  className?: string;
}

const SectionHeader = ({ title, number, className = "mb-4" }: SectionHeaderProps) => {
  return (
    <div className={`flex items-baseline gap-3 ${className}`}>
      {number && (
        <span className="font-mono text-xs text-coral font-bold">{number}</span>
      )}
      <h3 className="font-black text-xs uppercase tracking-[0.2em] text-foreground">
        {title}
      </h3>
      <div className="flex-1 h-px bg-border" />
    </div>
  );
};

export default SectionHeader;
