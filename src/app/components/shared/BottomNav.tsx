import { LucideIcon } from "lucide-react";

interface NavItem {
  id: string;
  label: string;
  icon: LucideIcon;
}

interface BottomNavProps {
  items: NavItem[];
  active: string;
  onChange: (id: string) => void;
  wide?: boolean;
}

export function BottomNav({ items, active, onChange, wide }: BottomNavProps) {
  const compact = items.length > 4;
  return (
    <div
      className={`fixed bottom-0 left-0 right-0 w-full ${wide ? "md:max-w-6xl md:mx-auto" : ""} bg-card border-t border-border z-40`}
      style={{ paddingBottom: "max(0.5rem, env(safe-area-inset-bottom))" }}
    >
      <div className={`flex items-center justify-around ${compact ? "py-1.5" : "py-2"} px-1`}>
        {items.map(({ id, label, icon: Icon }) => {
          const isActive = active === id;
          return (
            <button
              key={id}
              onClick={() => onChange(id)}
              className={`flex flex-col items-center gap-0.5 rounded-xl transition-all min-w-0 flex-1 ${compact ? "px-1 py-1.5" : "px-2 py-2"}`}
            >
              <div className={`${compact ? "w-7 h-7" : "w-8 h-8"} flex items-center justify-center rounded-lg transition-colors ${isActive ? "bg-primary" : "bg-transparent"}`}>
                <Icon className={`${compact ? "w-3.5 h-3.5" : "w-4 h-4"} ${isActive ? "text-primary-foreground" : "text-muted-foreground"}`} />
              </div>
              <span className={`${compact ? "text-[9px]" : "text-[10px]"} font-medium truncate max-w-full ${isActive ? "text-primary" : "text-muted-foreground"}`}>{label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
