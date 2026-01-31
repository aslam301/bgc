interface StatBadgeProps {
  value: string;
  label: string;
}

const StatBadge = ({ value, label }: StatBadgeProps) => {
  return (
    <div className="text-center py-3">
      <span className="font-black text-3xl text-ink tracking-tight">
        {value}
      </span>
      <p className="font-mono text-[9px] text-muted-foreground mt-1 uppercase tracking-widest">
        {label}
      </p>
    </div>
  );
};

export default StatBadge;
