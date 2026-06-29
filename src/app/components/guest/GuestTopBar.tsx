import { Sprout, LogIn } from "lucide-react";

interface GuestTopBarProps {
  onLogin: () => void;
}

export function GuestTopBar({ onLogin }: GuestTopBarProps) {
  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-border/60 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 md:px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-green-600 to-emerald-700 flex items-center justify-center shadow-md">
            <Sprout className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-sm font-bold text-foreground leading-none">AgriPilot</p>
            <p className="text-[10px] text-muted-foreground hidden sm:block">Smart Drone Agriculture</p>
          </div>
        </div>
        <button
          onClick={onLogin}
          className="flex items-center gap-1.5 bg-primary text-primary-foreground px-4 py-2 rounded-xl text-xs font-semibold hover:opacity-90 transition-opacity shadow-sm"
        >
          <LogIn className="w-3.5 h-3.5" />
          Login
        </button>
      </div>
    </header>
  );
}
