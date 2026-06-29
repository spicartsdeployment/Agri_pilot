import { useEffect, useState } from "react";
import { Sprout, Plane } from "lucide-react";

interface SplashScreenProps {
  onComplete: () => void;
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const [phase, setPhase] = useState<"enter" | "hold" | "exit">("enter");

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("hold"), 400);
    const t2 = setTimeout(() => setPhase("exit"), 2200);
    const t3 = setTimeout(() => onComplete(), 2800);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[100] overflow-hidden flex flex-col items-center justify-center"
      style={{
        background: "linear-gradient(145deg, #0f766e 0%, #15803d 35%, #0369a1 100%)",
        opacity: phase === "exit" ? 0 : 1,
        transform: phase === "exit" ? "scale(1.05)" : "scale(1)",
        transition: "opacity 0.6s ease, transform 0.6s ease",
      }}
    >
      {/* Animated field pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-0 right-0 h-px bg-white/40 animate-pulse" />
        <div className="absolute top-1/2 left-0 right-0 h-px bg-white/30 animate-pulse" style={{ animationDelay: "0.3s" }} />
        <div className="absolute top-3/4 left-0 right-0 h-px bg-white/20 animate-pulse" style={{ animationDelay: "0.6s" }} />
      </div>

      {/* Floating drone icon */}
      <div className="absolute top-[18%] right-[15%] opacity-30 animate-bounce" style={{ animationDuration: "3s" }}>
        <Plane className="w-10 h-10 text-white rotate-[-20deg]" />
      </div>

      {/* Logo */}
      <div
        className="flex flex-col items-center gap-4"
        style={{
          transform: phase === "enter" ? "scale(0.7)" : "scale(1)",
          opacity: phase === "enter" ? 0 : 1,
          transition: "transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.6s ease",
        }}
      >
        <div className="relative">
          <div className="w-24 h-24 rounded-3xl bg-white/15 backdrop-blur-md border border-white/25 flex items-center justify-center shadow-2xl">
            <Sprout className="w-12 h-12 text-white" />
          </div>
          <div className="absolute -inset-2 rounded-3xl border border-white/20 animate-ping" style={{ animationDuration: "2s" }} />
        </div>
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white tracking-tight">AgriPilot</h1>
          <p className="text-white/75 text-sm mt-1">Precision Agriculture, Delivered</p>
        </div>
      </div>

      {/* Loading bar */}
      <div className="absolute bottom-16 w-48">
        <div className="h-1 bg-white/20 rounded-full overflow-hidden">
          <div
            className="h-full bg-white rounded-full transition-all duration-[2.2s] ease-out"
            style={{ width: phase === "enter" ? "0%" : "100%" }}
          />
        </div>
        <p className="text-center text-white/60 text-xs mt-3">Loading experience…</p>
      </div>
    </div>
  );
}
