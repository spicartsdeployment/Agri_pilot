import { useState, useEffect } from "react";
import { Droplets, Wind, BookOpen, Briefcase, Tractor, Gift, ArrowLeft, Plane, AlertTriangle } from "lucide-react";
import { BookPilot } from "./BookPilot";
import { JobsTab } from "./JobsTab";
import { FarmsTab } from "./FarmsTab";
import { ReferEarn } from "./ReferEarn";
import { NotificationPanel } from "./NotificationPanel";
import { FarmerProfileModal } from "./FarmerProfileModal";
import { initialBookings, initialFarms, initialNotifications, Booking, Farm, FarmerNotification, JOB_TRACKING_EVENTS } from "./farmerData";
import { getDgcaFlyStatus } from "../shared/dgcaUtils";
import { MapWithPins } from "../shared/MapWithPins";
import { PortalTopBar } from "../shared/PortalTopBar";

type SubPage = "book" | "jobs" | "farms" | "refer" | null;

// ── Weather condition → gradient ──────────────────────────────────────
const weatherGradients: Record<string, { bg: string; accent: string }> = {
  "Sunny":          { bg: "linear-gradient(135deg,#fbbf24,#f59e0b)", accent: "rgba(255,255,255,0.2)" },
  "Clear":          { bg: "linear-gradient(135deg,#fbbf24,#f59e0b)", accent: "rgba(255,255,255,0.2)" },
  "Partly Cloudy":  { bg: "linear-gradient(135deg,#38bdf8,#0369a1)", accent: "rgba(255,255,255,0.2)" },
  "Cloudy":         { bg: "linear-gradient(135deg,#94a3b8,#475569)", accent: "rgba(255,255,255,0.2)" },
  "Rainy":          { bg: "linear-gradient(135deg,#60a5fa,#3730a3)", accent: "rgba(255,255,255,0.2)" },
  "Stormy":         { bg: "linear-gradient(135deg,#374151,#111827)", accent: "rgba(255,255,255,0.15)" },
  "Windy":          { bg: "linear-gradient(135deg,#86efac,#16a34a)", accent: "rgba(255,255,255,0.2)" },
  "Foggy":          { bg: "linear-gradient(135deg,#cbd5e1,#94a3b8)", accent: "rgba(255,255,255,0.3)" },
};

const weatherData = {
  today: { temp: 28, condition: "Partly Cloudy", humidity: 65, wind: 12, icon: "⛅" },
  week: [
    { day: "Mon", temp: 29, icon: "☀️", low: 22 },
    { day: "Tue", temp: 27, icon: "🌤", low: 21 },
    { day: "Wed", temp: 24, icon: "🌧", low: 19 },
    { day: "Thu", temp: 26, icon: "⛅", low: 20 },
    { day: "Fri", temp: 30, icon: "☀️", low: 23 },
    { day: "Sat", temp: 31, icon: "☀️", low: 24 },
    { day: "Sun", temp: 28, icon: "🌤", low: 22 },
  ],
};

const subPages = [
  { id: "book"  as const, label: "Book a Pilot", icon: <BookOpen  className="w-7 h-7" />, color: "bg-green-600", text: "text-white" },
  { id: "jobs"  as const, label: "Jobs",          icon: <Briefcase className="w-7 h-7" />, color: "bg-green-600", text: "text-white" },
  { id: "farms" as const, label: "Farms",         icon: <Tractor   className="w-7 h-7" />, color: "bg-green-600", text: "text-white" },
  { id: "refer" as const, label: "Refer & Earn",  icon: <Gift      className="w-7 h-7" />, color: "bg-green-600", text: "text-white" },
];

function SubPageWrapper({ title, onBack, children }: { title: string; onBack: () => void; children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <div className="flex items-center gap-3 px-5 pt-12 pb-4 sticky top-0 bg-background z-10 border-b border-border">
        <button onClick={onBack} className="w-9 h-9 bg-card border border-border rounded-xl flex items-center justify-center hover:bg-secondary transition-colors">
          <ArrowLeft className="w-4 h-4 text-foreground" />
        </button>
        <h2 className="text-foreground font-bold">{title}</h2>
      </div>
      <div className="px-5 pt-4">{children}</div>
    </div>
  );
}

export function FarmerHome() {
  const [weatherView,       setWeatherView]       = useState<"today" | "week">("today");
  const [activePage,        setActivePage]        = useState<SubPage>(null);
  const [selectedFarm,      setSelectedFarm]      = useState<number | null>(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile,       setShowProfile]       = useState(false);
  const [bookings,          setBookings]          = useState<Booking[]>(initialBookings);
  const [farms,             setFarms]             = useState<Farm[]>(initialFarms);
  const [notifs,            setNotifs]            = useState<FarmerNotification[]>(initialNotifications);
  const [isPremium]                               = useState(false);

  const unreadCount = notifs.filter((n) => !n.read).length;
  const flyStatus = getDgcaFlyStatus(weatherData.today.wind, weatherData.today.condition);

  const addBooking = (b: Booking) => {
    setBookings((p) => [b, ...p]);
    setNotifs((p) => [{ id: Date.now(), type: "booking", title: "Booking Confirmed", body: `${b.id} confirmed for ${b.farm}`, time: "Just now", read: false }, ...p]);
    setActivePage("jobs");
  };

  const updateBooking = (id: string, updates: Partial<Booking>) => {
    setBookings((p) => p.map((b) => (b.id === id ? { ...b, ...updates } : b)));
  };

  const addFarm = (farm: Farm) => setFarms((p) => [...p, farm]);

  useEffect(() => {
    const active = bookings.find((b) => b.status === "in_progress");
    if (!active) return;
    let idx = 0;
    const interval = setInterval(() => {
      if (idx >= JOB_TRACKING_EVENTS.length) { clearInterval(interval); return; }
      const title = JOB_TRACKING_EVENTS[idx];
      setNotifs((p) => [{ id: Date.now() + idx, type: "tracking", title, body: `${title} — ${active.farm} (${active.id})`, time: "Just now", read: false }, ...p]);
      idx++;
    }, 8000);
    return () => clearInterval(interval);
  }, [bookings]);

  const wg = weatherGradients[weatherData.today.condition] || weatherGradients["Partly Cloudy"];
  const jobCount = bookings.length;

  // ── Sub-pages ──────────────────────────────────────────────────────
  if (activePage === "book")  return <SubPageWrapper title="Book a Pilot" onBack={() => setActivePage(null)}><BookPilot onBookingConfirmed={addBooking} bookings={bookings} farms={farms} onAddFarm={addFarm} isPremium={isPremium} /></SubPageWrapper>;
  if (activePage === "jobs")  return <SubPageWrapper title="Jobs"          onBack={() => setActivePage(null)}><JobsTab bookings={bookings} onUpdateBooking={updateBooking} /></SubPageWrapper>;
  if (activePage === "farms") return <SubPageWrapper title="Farms"         onBack={() => setActivePage(null)}><FarmsTab /></SubPageWrapper>;
  if (activePage === "refer") return <SubPageWrapper title="Refer & Earn"  onBack={() => setActivePage(null)}><ReferEarn /></SubPageWrapper>;

  // ── Home ───────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col min-h-screen bg-background">
      {showNotifications && <NotificationPanel notifications={notifs} onUpdate={setNotifs} onClose={() => setShowNotifications(false)} />}
      {showProfile       && <FarmerProfileModal onClose={() => setShowProfile(false)} />}

      <PortalTopBar
        notificationCount={unreadCount}
        profileLabel="RK"
        onNotifications={() => setShowNotifications(true)}
        onProfile={() => setShowProfile(true)}
      />

      <div className="px-5 pb-4">
        <p className="text-sm font-bold text-foreground">Good morning,</p>
        <p className="text-sm font-bold text-foreground">Rajesh Kumar</p>
      </div>

      {/* ── Weather Card — condition-matched colors ── */}
      <div className="mx-5 mb-4 rounded-2xl p-5 overflow-hidden relative" style={{ background: wg.bg }}>
        <div className="absolute -right-3 -top-3 text-7xl opacity-10 select-none pointer-events-none">
          {weatherData.today.icon}
        </div>

        <div className="flex items-center justify-between mb-4">
          <p className="text-white/80 text-xs font-medium">Weather · Nagpur, MH</p>
          <div className="flex rounded-lg p-0.5" style={{ background: wg.accent }}>
            {(["today","week"] as const).map((v) => (
              <button key={v} onClick={() => setWeatherView(v)}
                className="text-xs px-3 py-1 rounded-md transition-colors capitalize"
                style={weatherView === v ? { background: "rgba(255,255,255,0.95)", color: "#1a2512", fontWeight: 600 } : { color: "rgba(255,255,255,0.85)" }}>
                {v === "today" ? "Today" : "This Week"}
              </button>
            ))}
          </div>
        </div>

        {weatherView === "today" ? (
          <div>
            <div className="flex items-end gap-3 mb-4">
              <span className="text-5xl leading-none">{weatherData.today.icon}</span>
              <div>
                <p className="text-white/70 text-xs mb-0.5">{weatherData.today.condition}</p>
                <p className="text-white leading-none font-semibold" style={{ fontSize: "2.5rem" }}>{weatherData.today.temp}°C</p>
              </div>
            </div>
            <div className="flex gap-5 mb-3">
              <div className="flex items-center gap-1.5"><Droplets className="w-3.5 h-3.5 text-white/60" /><span className="text-white/80 text-xs">{weatherData.today.humidity}% humidity</span></div>
              <div className="flex items-center gap-1.5"><Wind    className="w-3.5 h-3.5 text-white/60" /><span className="text-white/80 text-xs">{weatherData.today.wind} km/h wind</span></div>
            </div>
            <div className={`flex items-center gap-2 rounded-xl px-3 py-2 ${flyStatus.status === "good" ? "bg-white/20" : "bg-red-500/30"}`}>
              {flyStatus.status === "good" ? <Plane className="w-4 h-4 text-white" /> : <AlertTriangle className="w-4 h-4 text-white" />}
              <div>
                <p className="text-white text-xs font-semibold">{flyStatus.label}</p>
                <p className="text-white/70 text-[10px]">{flyStatus.reason}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex gap-1.5 overflow-x-auto -mx-1 px-1">
            {weatherData.week.map((d) => (
              <button key={d.day}
                className="flex flex-col items-center gap-1.5 px-2.5 py-2.5 rounded-xl flex-shrink-0 min-w-[44px] transition-opacity hover:opacity-90"
                style={{ background: wg.accent }}>
                <span className="text-[10px] font-medium text-white/80">{d.day}</span>
                <span className="text-lg leading-none">{d.icon}</span>
                <span className="text-xs font-semibold text-white">{d.temp}°</span>
                <span className="text-[10px] text-white/50">{d.low}°</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── Map — farmer fields (edge-to-edge) ── */}
      <div className="mb-5">
        <MapWithPins
          fullBleed
          interactive
          title="Kamptee, Maharashtra"
          height={200}
          selectedPinId={selectedFarm !== null ? String(selectedFarm) : null}
          onPinClick={(id) => setSelectedFarm(selectedFarm === Number(id) ? null : Number(id))}
          pins={farms.map((f) => ({
            id: String(f.id),
            label: f.name,
            lat: f.lat,
            lng: f.lng,
            color: selectedFarm === f.id ? "#16a34a" : "#0369a1",
          }))}
          legend={[{ label: "Your Fields", color: "#0369a1" }]}
        />
        <div className="mx-4 mt-3 bg-card rounded-2xl border border-border p-3 space-y-2">
          {farms.map((f) => (
            <button
              key={f.id}
              onClick={() => setSelectedFarm(selectedFarm === f.id ? null : f.id)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl border text-left transition-colors ${selectedFarm === f.id ? "bg-primary text-primary-foreground border-primary" : "bg-secondary text-foreground border-border hover:bg-muted"}`}
            >
              <span className="w-2 h-2 rounded-full bg-current opacity-70 flex-shrink-0" />
              <span className="text-xs font-medium flex-1">{f.name}</span>
              <span className={`text-xs ${selectedFarm === f.id ? "text-primary-foreground/70" : "text-muted-foreground"}`}>{f.crop} · {f.acres} ac</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── 2×2 Sub-page Grid ── */}
      <div className="px-5 pb-8">
        <div className="grid grid-cols-2 gap-4">
          {subPages.map((sp) => (
            <button
              key={sp.id}
              onClick={() => setActivePage(sp.id)}
              className={`${sp.color} rounded-2xl p-5 flex flex-col items-center gap-3 hover:opacity-90 transition-opacity shadow-sm relative`}
            >
              <div className={sp.text}>{sp.icon}</div>
              <span className={`text-sm font-semibold ${sp.text}`}>{sp.label}</span>
              {/* Badge on top-right of card, not on icon */}
              {sp.id === "jobs" && jobCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-white text-green-700 text-[10px] font-bold rounded-full flex items-center justify-center shadow-md border border-green-200">
                  {jobCount}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
