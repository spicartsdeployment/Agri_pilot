import { useEffect, useRef, useState } from "react";
import { Star, Target, Eye, BookOpen } from "lucide-react";
import { stats, testimonials, aboutGoals } from "./guestData";

function AnimatedCounter({ value, suffix }: { value: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) {
        started.current = true;
        const duration = 1500;
        const start = performance.now();
        const tick = (now: number) => {
          const p = Math.min((now - start) / duration, 1);
          setCount(Math.floor(value * (1 - Math.pow(1 - p, 3))));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }
    }, { threshold: 0.3 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [value]);

  return (
    <div ref={ref} className="text-center">
      <p className="text-2xl md:text-3xl font-bold text-green-600">
        {count.toLocaleString()}{suffix}
      </p>
    </div>
  );
}

export function GuestAbout() {
  return (
    <div className="animate-in fade-in duration-500 max-w-6xl mx-auto px-4 md:px-6 py-8 md:py-12">
      {/* Hero */}
      <div className="text-center mb-12">
        <h1 className="text-2xl md:text-4xl font-bold text-foreground">About AgriPilot</h1>
        <p className="text-sm text-muted-foreground mt-3 max-w-2xl mx-auto leading-relaxed">
          We're on a mission to make precision agriculture accessible to every farmer in India through technology, trust, and certified drone operations.
        </p>
      </div>

      {/* Mission / Vision / Story */}
      <div className="grid md:grid-cols-3 gap-4 mb-12">
        {[
          { icon: Target, title: "Mission", text: "Connect farmers with certified drone pilots for affordable, safe, and efficient crop operations." },
          { icon: Eye, title: "Vision", text: "A future where every Indian farm benefits from drone technology—regardless of farm size or location." },
          { icon: BookOpen, title: "Our Story", text: "Founded in 2024 by agri-tech veterans who saw farmers struggle with labour shortages and uneven chemical application." },
        ].map(({ icon: Icon, title, text }) => (
          <div key={title} className="bg-card border border-border rounded-2xl p-5 hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center mb-3">
              <Icon className="w-5 h-5 text-green-700" />
            </div>
            <h3 className="text-sm font-bold text-foreground">{title}</h3>
            <p className="text-xs text-muted-foreground mt-2 leading-relaxed">{text}</p>
          </div>
        ))}
      </div>

      {/* Goals */}
      <section className="mb-12">
        <h2 className="text-xl font-bold text-foreground mb-4">Our Goals</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {aboutGoals.map((g) => (
            <div key={g} className="flex items-center gap-2 bg-gradient-to-r from-green-50 to-blue-50 border border-green-100 rounded-xl p-3">
              <span className="w-2 h-2 rounded-full bg-green-600 flex-shrink-0" />
              <span className="text-xs font-medium text-foreground">{g}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-6 md:p-10 mb-12">
        <h2 className="text-xl font-bold text-white text-center mb-8">AgriPilot by the Numbers</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
          {stats.map(({ label, value, suffix }) => (
            <div key={label}>
              <AnimatedCounter value={value} suffix={suffix} />
              <p className="text-[10px] text-white/60 text-center mt-1">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="mb-12">
        <h2 className="text-xl font-bold text-foreground mb-6">Why Farmers Trust Us</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {testimonials.map((t) => (
            <div key={t.name} className="bg-card border border-border rounded-2xl p-5">
              <div className="flex gap-0.5 mb-3">
                {[...Array(t.rating)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                ))}
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed italic">"{t.text}"</p>
              <div className="mt-4 pt-3 border-t border-border">
                <p className="text-xs font-semibold text-foreground">{t.name}</p>
                <p className="text-[10px] text-muted-foreground">{t.location}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
