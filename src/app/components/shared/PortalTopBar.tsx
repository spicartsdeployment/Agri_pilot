import { Bell, Sprout } from "lucide-react";

type PortalTopBarProps = {
  notificationCount?: number;
  profileLabel: string;
  onNotifications: () => void;
  onProfile: () => void;
};

export function PortalTopBar({
  notificationCount = 0,
  profileLabel,
  onNotifications,
  onProfile,
}: PortalTopBarProps) {
  return (
    <div className="flex items-center justify-between px-5 pt-12 pb-4">
      <div className="flex items-center gap-2.5 min-w-0">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-green-600 to-emerald-700 flex items-center justify-center shadow-sm flex-shrink-0">
          <Sprout className="w-5 h-5 text-white" />
        </div>
        <p className="text-sm font-bold text-foreground truncate">AgriPilot</p>
      </div>
      <div className="flex items-center gap-3 flex-shrink-0">
        <button
          onClick={onNotifications}
          className="relative w-10 h-10 bg-card border border-border rounded-full flex items-center justify-center hover:bg-secondary transition-colors"
          aria-label="Notifications"
        >
          <Bell className="w-4 h-4 text-foreground" />
          {notificationCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-accent text-accent-foreground text-[9px] font-bold rounded-full flex items-center justify-center">
              {notificationCount}
            </span>
          )}
        </button>
        <button
          onClick={onProfile}
          className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-sm hover:opacity-90 transition-opacity"
          aria-label="Profile"
        >
          {profileLabel}
        </button>
      </div>
    </div>
  );
}
