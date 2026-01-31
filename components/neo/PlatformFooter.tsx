import { Gamepad2 } from "lucide-react";

const PlatformFooter = () => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 platform-bar-light py-4">
      <div className="container max-w-lg mx-auto px-4">
        <a
          href="https://boardgameculture.com"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 py-2.5 px-5 bg-ink text-primary-foreground mx-auto w-fit shadow-[3px_3px_0_0_hsl(var(--coral))] hover:shadow-[4px_4px_0_0_hsl(var(--coral))] transition-all btn-lift"
        >
          <Gamepad2 size={14} strokeWidth={2.5} />
          <span className="font-mono text-[10px] font-bold uppercase tracking-wider">
            BoardGameCulture
          </span>
        </a>
      </div>
    </div>
  );
};

export default PlatformFooter;
