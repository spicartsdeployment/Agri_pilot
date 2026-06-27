import { X, Bell, CreditCard, CheckCircle, AlertCircle, Navigation } from "lucide-react";
import { FarmerNotification } from "./farmerData";
import { useState } from "react";

interface NotificationPanelProps {
  notifications: FarmerNotification[];
  onUpdate: (items: FarmerNotification[]) => void;
  onClose: () => void;
}

const typeIcon: Record<string, React.ReactNode> = {
  booking: <Bell className="w-4 h-4 text-primary" />,
  payment: <CreditCard className="w-4 h-4 text-accent" />,
  alert: <CheckCircle className="w-4 h-4 text-green-600" />,
  tracking: <Navigation className="w-4 h-4 text-sky-600" />,
};

export function NotificationPanel({ notifications, onUpdate, onClose }: NotificationPanelProps) {
  const [items, setItems] = useState(notifications);

  const update = (next: FarmerNotification[]) => { setItems(next); onUpdate(next); };
  const markAllRead = () => update(items.map((n) => ({ ...n, read: true })));
  const unreadCount = items.filter((n) => !n.read).length;

  return (
    <div className="fixed inset-0 z-50 bg-foreground/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-background w-full max-w-sm rounded-3xl max-h-[80vh] overflow-y-auto shadow-2xl">
        <div className="flex justify-center pt-3 pb-1"><div className="w-10 h-1 bg-border rounded-full" /></div>
        <div className="flex items-center justify-between px-5 py-3 border-b border-border">
          <div className="flex items-center gap-2">
            <h3 className="text-foreground font-medium">Notifications</h3>
            {unreadCount > 0 && <span className="bg-accent text-accent-foreground text-xs w-5 h-5 rounded-full flex items-center justify-center font-medium">{unreadCount}</span>}
          </div>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && <button onClick={markAllRead} className="text-xs text-primary hover:underline">Mark all read</button>}
            <button onClick={onClose} className="w-8 h-8 bg-secondary rounded-xl flex items-center justify-center"><X className="w-4 h-4 text-foreground" /></button>
          </div>
        </div>
        <p className="px-5 py-2 text-[10px] text-muted-foreground border-b border-border">Live updates: Pilot Assigned → En Route → Arrived → Started → 50% → Completed → Payment → Invoice</p>
        <div className="divide-y divide-border">
          {items.map((item) => (
            <button key={item.id} onClick={() => update(items.map((n) => n.id === item.id ? { ...n, read: true } : n))}
              className={`w-full flex items-start gap-3 px-5 py-4 text-left hover:bg-secondary/50 transition-colors ${!item.read ? "bg-secondary/30" : ""}`}>
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${!item.read ? "bg-secondary" : "bg-muted"}`}>
                {typeIcon[item.type] || <AlertCircle className="w-4 h-4 text-muted-foreground" />}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className={`text-sm ${!item.read ? "font-semibold text-foreground" : "font-medium text-foreground"}`}>{item.title}</p>
                  {!item.read && <span className="w-2 h-2 bg-accent rounded-full flex-shrink-0" />}
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">{item.body}</p>
                <p className="text-xs text-muted-foreground mt-1">{item.time}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
