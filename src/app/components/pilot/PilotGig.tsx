import { useState } from "react";
import { CalendarCheck, CalendarX, Plus, X, ChevronLeft, ChevronRight, Crown, AlertCircle } from "lucide-react";

type DayStatus = "available" | "unavailable";

function getDaysInMonth(y: number, m: number) { return new Date(y, m + 1, 0).getDate(); }
function getFirstDay(y: number, m: number)    { return new Date(y, m, 1).getDay(); }

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const DAYS   = ["Su","Mo","Tu","We","Th","Fr","Sa"];

const subscription = {
  plan: "Pro Pilot",
  price: "₹999/month",
  expiry: "Jul 31, 2026",
  features: ["Priority job matching", "Unlimited bookings", "Drone rental access", "24/7 support"],
  daysLeft: 49,
};

export function PilotGig() {
  const today = new Date();
  const [isAvailable,    setIsAvailable]    = useState(true);
  const [year,           setYear]           = useState(today.getFullYear());
  const [month,          setMonth]          = useState(today.getMonth());
  const [unavailableDates, setUnavailableDates] = useState<string[]>(["2026-06-18","2026-06-19","2026-06-25"]);
  const [showAddDate,    setShowAddDate]    = useState(false);
  const [newDate,        setNewDate]        = useState("");
  const [newDateTo,      setNewDateTo]      = useState("");

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay    = getFirstDay(year, month);

  const fmt = (y: number, m: number, d: number) =>
    `${y}-${String(m+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;

  const todayStr = fmt(today.getFullYear(), today.getMonth(), today.getDate());

  const toggleAvailability = () => {
    const next = !isAvailable;
    setIsAvailable(next);
    if (!next) {
      if (!unavailableDates.includes(todayStr))
        setUnavailableDates((prev) => [...prev, todayStr]);
    } else {
      setUnavailableDates((prev) => prev.filter((d) => d !== todayStr));
    }
  };

  const isUnavail = (d: number) => unavailableDates.includes(fmt(year, month, d));
  const isToday   = (d: number) => year === today.getFullYear() && month === today.getMonth() && d === today.getDate();

  // Parse "YYYY-MM-DD" using local date components — avoids UTC midnight timezone shift
  const parseLocalDate = (s: string) => {
    const [y, m, d] = s.split("-").map(Number);
    return new Date(y, m - 1, d);
  };
  const localDateStr = (d: Date) =>
    `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;

  const addUnavailable = () => {
    if (!newDate) return;
    const dates: string[] = [];
    const cur  = parseLocalDate(newDate);
    const last = newDateTo ? parseLocalDate(newDateTo) : parseLocalDate(newDate);
    while (cur <= last) {
      const s = localDateStr(cur);
      if (!unavailableDates.includes(s)) dates.push(s);
      cur.setDate(cur.getDate() + 1);
    }
    setUnavailableDates([...unavailableDates, ...dates]);
    setShowAddDate(false); setNewDate(""); setNewDateTo("");
  };

  const removeDate = (d: string) => setUnavailableDates(unavailableDates.filter((x) => x !== d));

  const prevM = () => { if (month === 0) { setMonth(11); setYear(y => y-1); } else setMonth(m => m-1); };
  const nextM = () => { if (month === 11){ setMonth(0);  setYear(y => y+1); } else setMonth(m => m+1); };

  const subscriptionPct = Math.round((subscription.daysLeft / 30) * 100);
  const [renewDone, setRenewDone] = useState(false);
  const handleRenew = () => { setRenewDone(true); setTimeout(() => setRenewDone(false), 3000); };

  return (
    <div className="min-h-screen bg-background pb-6">
      <div className="px-5 pt-12 pb-5">
        <h2 className="text-foreground font-bold">Available</h2>
        <p className="text-sm text-muted-foreground mt-1">Manage your working schedule</p>
      </div>

      {/* ── Availability Toggle ── */}
      <div className="px-5 mb-5">
        <div
          className={`rounded-2xl p-5 transition-all duration-300 ${isAvailable ? "bg-green-600" : "bg-red-600"}`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-white">
                {isAvailable ? "You're Available" : "You're Unavailable"}
              </p>
              <p className="text-xs mt-0.5 text-white/70">
                {isAvailable ? "Farmers can see and book you" : "You won't receive new job requests"}
              </p>
            </div>
            <button
              onClick={toggleAvailability}
              className={`w-14 h-7 rounded-full transition-colors relative flex-shrink-0 ${isAvailable ? "bg-white/30" : "bg-white/20"}`}
            >
              <div
                className={`absolute top-0.5 w-6 h-6 rounded-full shadow transition-all ${isAvailable ? "left-7 bg-white" : "left-0.5 bg-white/60"}`}
              />
            </button>
          </div>
          <div className={`flex items-center gap-2 mt-4 rounded-xl px-3 py-2 ${isAvailable ? "bg-white/15" : "bg-white/10"}`}>
            <CalendarCheck className="w-4 h-4 text-white/80" />
            <span className="text-xs text-white/80">
              {isAvailable ? "Active — visible to farmers in your area" : "Inactive — marked red; no new bookings accepted"}
            </span>
          </div>
        </div>
      </div>

      {/* ── Subscription Card ── */}
      <div className="px-5 mb-5">
        <div className="bg-card border border-border rounded-2xl p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-amber-100 rounded-xl flex items-center justify-center">
                <Crown className="w-4 h-4 text-amber-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">{subscription.plan}</p>
                <p className="text-xs text-muted-foreground">{subscription.price}</p>
              </div>
            </div>
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${subscription.daysLeft <= 7 ? "bg-red-100 text-red-600" : "bg-amber-50 text-amber-700"}`}>
              {subscription.daysLeft} days left
            </span>
          </div>

          {/* Expiry progress */}
          <div className="mb-3">
            <div className="flex justify-between text-xs mb-1.5">
              <span className="text-muted-foreground">Expires {subscription.expiry}</span>
              <span className="text-foreground font-medium">{subscriptionPct}%</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${subscriptionPct > 30 ? "bg-amber-500" : "bg-red-500"}`}
                style={{ width: `${subscriptionPct}%` }}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-1.5 mb-3">
            {subscription.features.map((f) => (
              <div key={f} className="flex items-center gap-1.5 text-xs text-foreground">
                <span className="w-1.5 h-1.5 bg-amber-500 rounded-full flex-shrink-0" />{f}
              </div>
            ))}
          </div>

          {subscription.daysLeft <= 7 && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl p-2.5 mb-3">
              <AlertCircle className="w-3.5 h-3.5 text-red-500 flex-shrink-0" />
              <p className="text-xs text-red-600">Your subscription expires soon. Renew to continue receiving jobs.</p>
            </div>
          )}

          {renewDone ? (
            <div className="w-full bg-green-50 border border-green-200 rounded-xl py-2.5 px-4 text-center">
              <span className="text-xs font-medium text-green-700">✅ Subscription renewed! Expires Jul 31, 2027</span>
            </div>
          ) : (
            <button
              onClick={handleRenew}
              className="w-full bg-amber-500 text-white rounded-xl py-2.5 text-sm font-medium hover:opacity-90 active:scale-95 transition-all"
            >
              Renew Subscription
            </button>
          )}
        </div>
      </div>

      {/* ── Calendar ── */}
      <div className="px-5 mb-5">
        <div className="bg-card border border-border rounded-2xl p-4">
          <div className="flex items-center justify-between mb-4">
            <button onClick={prevM} className="w-8 h-8 bg-secondary rounded-lg flex items-center justify-center">
              <ChevronLeft className="w-4 h-4 text-foreground" />
            </button>
            <p className="text-sm font-semibold text-foreground">{MONTHS[month]} {year}</p>
            <button onClick={nextM} className="w-8 h-8 bg-secondary rounded-lg flex items-center justify-center">
              <ChevronRight className="w-4 h-4 text-foreground" />
            </button>
          </div>

          <div className="grid grid-cols-7 mb-2">
            {DAYS.map((d) => <div key={d} className="text-center text-[10px] font-medium text-muted-foreground py-1">{d}</div>)}
          </div>

          <div className="grid grid-cols-7 gap-y-1">
            {[...Array(firstDay)].map((_,i) => <div key={`e${i}`} />)}
            {[...Array(daysInMonth)].map((_,i) => {
              const day     = i + 1;
              const unavail = isUnavail(day);
              const isTod   = isToday(day);
              return (
                <button key={day}
                  onClick={() => {
                    const d = fmt(year, month, day);
                    if (unavail) removeDate(d);
                    else setUnavailableDates([...unavailableDates, d]);
                  }}
                  className={`h-8 w-full rounded-lg text-xs font-medium transition-colors ${
                    unavail ? "bg-red-100 text-red-600 hover:bg-red-200" :
                    isTod   ? "bg-primary text-primary-foreground" :
                    "hover:bg-secondary text-foreground"
                  }`}
                >
                  {day}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-4 mt-4 pt-3 border-t border-border">
            <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-primary" /><span className="text-[10px] text-muted-foreground">Today</span></div>
            <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-red-100 border border-red-300" /><span className="text-[10px] text-muted-foreground">Unavailable</span></div>
            <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-secondary" /><span className="text-[10px] text-muted-foreground">Available</span></div>
          </div>
        </div>
      </div>

      {/* Add Range */}
      <div className="px-5 mb-4">
        <button onClick={() => setShowAddDate(true)}
          className="w-full flex items-center justify-center gap-2 py-3 border border-dashed border-primary/40 rounded-2xl text-sm text-primary hover:bg-secondary/30">
          <Plus className="w-4 h-4" /> Add Unavailable Days
        </button>

        {showAddDate && (
          <div className="mt-3 bg-card border border-border rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-foreground">Mark Unavailable</p>
              <button onClick={() => setShowAddDate(false)}><X className="w-4 h-4 text-muted-foreground" /></button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-muted-foreground mb-1.5 block">From</label>
                <input type="date" value={newDate} onChange={(e) => setNewDate(e.target.value)}
                  className="w-full bg-input-background rounded-xl px-3 py-2.5 text-xs text-foreground outline-none" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1.5 block">To (optional)</label>
                <input type="date" value={newDateTo} onChange={(e) => setNewDateTo(e.target.value)}
                  className="w-full bg-input-background rounded-xl px-3 py-2.5 text-xs text-foreground outline-none" />
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setShowAddDate(false)}
                className="flex-1 border border-border rounded-xl py-2.5 text-xs text-foreground hover:bg-secondary">Cancel</button>
              <button onClick={addUnavailable} disabled={!newDate}
                className="flex-1 bg-red-500 text-white rounded-xl py-2.5 text-xs font-medium disabled:opacity-40">
                Mark Unavailable
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Unavailable list */}
      {unavailableDates.length > 0 && (
        <div className="px-5">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">Marked Unavailable</p>
          <div className="space-y-2">
            {[...unavailableDates].sort().map((date) => (
              <div key={date} className="bg-card border border-border rounded-xl px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CalendarX className="w-4 h-4 text-red-500" />
                  <span className="text-sm text-foreground">
                    {parseLocalDate(date).toLocaleDateString("en-IN", { weekday:"short", day:"numeric", month:"short", year:"numeric" })}
                  </span>
                </div>
                <button onClick={() => removeDate(date)} className="w-7 h-7 bg-red-50 rounded-lg flex items-center justify-center">
                  <X className="w-3.5 h-3.5 text-red-500" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
