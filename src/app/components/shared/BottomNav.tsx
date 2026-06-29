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
  return (
    <div className={`fixed bottom-0 left-0 right-0 ${wide ? "max-w-6xl" : "max-w-sm"} mx-auto bg-card border-t border-border px-2 pb-safe z-40`}>
      <div className="flex items-center justify-around py-2">
        {items.map(({ id, label, icon: Icon }) => {
          const isActive = active === id;
          return (
            <button
              key={id}
              onClick={() => onChange(id)}
              className="flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all"
            >
              <div className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors ${isActive ? "bg-primary" : "bg-transparent"}`}>
                <Icon className={`w-4 h-4 ${isActive ? "text-primary-foreground" : "text-muted-foreground"}`} />
              </div>
              <span className={`text-[10px] font-medium ${isActive ? "text-primary" : "text-muted-foreground"}`}>{label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
