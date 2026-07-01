import { useState, useMemo } from "react";
import { Droplets, Wind, MapPin, Clock, Check, X, Eye, AlertCircle, Settings, ChevronRight, Plane } from "lucide-react";
import { pilotProfile, initialJobRequests, weatherData, JobRequest, activeJobsList } from "./pilotData";
import { PilotProfileModal } from "./PilotProfileModal";
import { JobDetailModal } from "./JobDetailModal";
import { DeclineJobModal } from "./DeclineJobModal";
import { MapWithPins } from "../shared/MapWithPins";
import { PortalTopBar } from "../shared/PortalTopBar";
import { getDgcaFlyStatus } from "../shared/dgcaUtils";

// ── Weather condition → gradient & text ──────────────────────────────
const weatherGradients: Record<string, { from: string; to: string; text: string }> = {
  Sunny:          { from: "#fbbf24", to: "#f59e0b", text: "white" },
  Clear:          { from: "#fbbf24", to: "#f59e0b", text: "white" },
  "Partly Cloudy":{ from: "#7dd3fc", to: "#4b9fd5", text: "white" },
  Cloudy:         { from: "#94a3b8", to: "#64748b", text: "white" },
  Overcast:       { from: "#6b7280", to: "#374151", text: "white" },
  Rainy:          { from: "#60a5fa", to: "#3730a3", text: "white" },
  Stormy:         { from: "#374151", to: "#111827", text: "white" },
  Windy:          { from: "#a3e635", to: "#4d7c0f", text: "white" },
  Foggy:          { from: "#d1d5db", to: "#9ca3af", text: "#111827" },
};

function getWeatherStyle(condition: string) {
  const g = weatherGradients[condition] || weatherGradients["Partly Cloudy"];
  return {
    background: `linear-gradient(135deg, ${g.from}, ${g.to})`,
    color: g.text,
  };
}

// ── Profile completion ───────────────────────────────────────────────
const profileFields = [
  { key: "name",             label: "Name" },
  { key: "phone",            label: "Phone" },
  { key: "email",            label: "Email" },
  { key: "location",         label: "Location" },
  { key: "dgcaCertificate",  label: "DGCA Cert." },
  { key: "experience",       label: "Experience" },
  { key: "droneRegistration",label: "Drone Reg." },
  { key: "aadhaar",          label: "Aadhaar" },
  { key: "bankAccount",      label: "Bank Account" },
];

function completionStats() {
  const filled = profileFields.filter((f) => !!pilotProfile[f.key as keyof typeof pilotProfile]).length;
  const total   = profileFields.length;
  const pct     = Math.round((filled / total) * 100);
  const missing = profileFields.filter((f) => !pilotProfile[f.key as keyof typeof pilotProfile]).map((f) => f.label);
  return { filled, total, pct, missing };
}

function CompletionCircle({ pct }: { pct: number }) {
  const r = 18, c = 2 * Math.PI * r;
  const dash = (pct / 100) * c;
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" className="flex-shrink-0">
      <circle cx="24" cy="24" r={r} fill="none" stroke="#e5e7eb" strokeWidth="4" />
      <circle
        cx="24" cy="24" r={r} fill="none"
        stroke={pct >= 80 ? "#374151" : "#d97706"}
        strokeWidth="4"
        strokeDasharray={`${dash} ${c}`}
        strokeLinecap="round"
        transform="rotate(-90 24 24)"
      />
      <text x="24" y="28" textAnchor="middle" fontSize="11" fontWeight="700"
        fill={pct >= 80 ? "#374151" : "#d97706"}>
        {pct}%
      </text>
    </svg>
  );
}

const jobTypeColors: Record<string, string> = {
  Fertilizing: "bg-green-100 text-green-700",
  Pesticides:  "bg-orange-100 text-orange-700",
  Inspection:  "bg-blue-100 text-blue-700",
  Seeding:     "bg-yellow-100 text-yellow-700",
};


interface PilotHomeProps {
  onGoToSettings: () => void;
}

export function PilotHome({ onGoToSettings }: PilotHomeProps) {
  const [weatherView, setWeatherView] = useState<"today" | "week">("today");
  const [showProfile, setShowProfile] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [jobs, setJobs] = useState<JobRequest[]>(initialJobRequests);
  const [detailJob, setDetailJob] = useState<JobRequest | null>(null);
  const [pilotRating, setPilotRating] = useState(pilotProfile.rating);
  const [cancelCount, setCancelCount] = useState(pilotProfile.cancellationCount);
  const [declineTarget, setDeclineTarget] = useState<{ id: string; farmerName: string } | null>(null);

  const pendingJobs = jobs.filter((j) => j.status === "pending");
  const jobMapPins = useMemo(() => {
    const active = activeJobsList
      .filter((j) => j.jobStatus === "active")
      .map((j) => ({ id: j.id, label: j.farm, lat: j.lat, lng: j.lng, color: "#374151" }));
    const accepted = jobs
      .filter((j) => j.status === "accepted")
      .map((j) => ({ id: j.id, label: j.location.split(",")[0], lat: j.lat, lng: j.lng, color: "#16a34a" }));
    return [...active, ...accepted];
  }, [jobs]);
  const { pct, missing, filled, total } = completionStats();
  const weatherStyle = getWeatherStyle(weatherData.today.condition);
  const flyStatus = getDgcaFlyStatus(weatherData.today.wind, weatherData.today.condition);
  const weekWeatherStyle = (condition: string) => getWeatherStyle(condition);

  const handleAccept = (id: string, quote?: number) => {
    setJobs(jobs.map((j) => j.id === id ? { ...j, status: "accepted", customQuote: quote } : j));
    setDetailJob(null);
  };
  const handleDecline = (id: string, reason: string) => {
    setJobs(jobs.map((j) => j.id === id ? { ...j, status: "declined", declineReason: reason } : j));
    const newCount = cancelCount + 1;
    setCancelCount(newCount);
    if (newCount >= 2) setPilotRating((r) => Math.max(3.5, Math.round((r - 0.2) * 10) / 10));
    setDetailJob(null);
    setDeclineTarget(null);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {showProfile && <PilotProfileModal onClose={() => setShowProfile(false)} />}
      {detailJob && (
        <JobDetailModal
          job={detailJob}
          onClose={() => setDetailJob(null)}
          onAccept={(quote) => handleAccept(detailJob.id, quote)}
          onDecline={() => setDeclineTarget({ id: detailJob.id, farmerName: detailJob.farmer })}
        />
      )}
      {declineTarget && (
        <DeclineJobModal
          farmerName={declineTarget.farmerName}
          onClose={() => setDeclineTarget(null)}
          onConfirm={(reason) => handleDecline(declineTarget.id, reason)}
        />
      )}

      {/* Notifications panel */}
      {showNotifications && (
        <div className="fixed inset-0 z-50 bg-foreground/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-background w-full max-w-sm rounded-3xl max-h-[80vh] overflow-y-auto shadow-2xl">
            <div className="flex justify-center pt-3 pb-1"><div className="w-10 h-1 bg-border rounded-full" /></div>
            <div className="flex items-center justify-between px-5 py-3 border-b border-border">
              <h3 className="text-foreground font-medium">Notifications</h3>
              <div className="flex items-center gap-2">
                {/* Go to Settings */}
                <button
                  onClick={() => { setShowNotifications(false); onGoToSettings(); }}
                  className="flex items-center gap-1.5 text-xs text-primary bg-secondary px-3 py-1.5 rounded-xl hover:bg-muted transition-colors"
                >
                  <Settings className="w-3.5 h-3.5" /> Settings
                </button>
                <button onClick={() => setShowNotifications(false)} className="w-8 h-8 bg-secondary rounded-xl flex items-center justify-center">
                  <X className="w-4 h-4 text-foreground" />
                </button>
              </div>
            </div>
            {[
              { icon: "📋", title: "New Job Request", body: "Rajesh Kumar needs Fertilizer Spray — 12 acres, Jun 13", time: "30 min ago", unread: true },
              { icon: "✅", title: "Job Accepted", body: "JB-2398 confirmed for Kiran Rao — Jun 11", time: "2h ago", unread: true },
              { icon: "💰", title: "Payment Received", body: "₹4,500 credited for JB-2395", time: "1d ago", unread: false },
              { icon: "⭐", title: "New Rating", body: "Mahesh Yadav gave you 5 stars!", time: "2d ago", unread: false },
            ].map((n, i) => (
              <div key={i} className={`flex items-start gap-3 px-5 py-4 border-b border-border last:border-0 ${n.unread ? "bg-secondary/40" : ""}`}>
                <div className="w-9 h-9 bg-secondary rounded-xl flex items-center justify-center text-base flex-shrink-0">{n.icon}</div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className={`text-sm ${n.unread ? "font-semibold text-foreground" : "font-medium text-foreground"}`}>{n.title}</p>
                    {n.unread && <span className="w-2 h-2 bg-amber-500 rounded-full" />}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{n.body}</p>
                  <p className="text-xs text-muted-foreground mt-1">{n.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <PortalTopBar
        notificationCount={pendingJobs.length}
        profileLabel={pilotProfile.avatar}
        onNotifications={() => setShowNotifications(true)}
        onProfile={() => setShowProfile(true)}
      />

      <div className="px-5 pb-4">
        <p className="text-sm font-bold text-foreground">Good morning 👋</p>
        <p className="text-sm font-bold text-foreground">{pilotProfile.name}</p>
        <p className="text-xs text-muted-foreground mt-0.5">Licensed Pilot · ★ {pilotRating}</p>
      </div>

      {/* ── Weather Card — condition-matched colors ── */}
      {/* ── Weather always sky blue ── */}
      <div className="mx-5 mb-4 rounded-2xl p-5 overflow-hidden relative"
        style={{ background: "linear-gradient(135deg, #38bdf8, #0369a1)" }}>
        <div className="absolute -right-3 -top-3 text-7xl opacity-10 select-none pointer-events-none">
          {weatherData.today.icon}
        </div>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 opacity-70" style={{ color: "white" }} />
            <span className="text-xs opacity-80" style={{ color: "white" }}>Nagpur, MH</span>
          </div>
          <div className="flex rounded-lg p-0.5" style={{ background: "rgba(255,255,255,0.2)" }}>
            {(["today", "week"] as const).map((v) => (
              <button
                key={v}
                onClick={() => setWeatherView(v)}
                className="text-xs px-3 py-1 rounded-md transition-colors capitalize"
                style={weatherView === v
                  ? { background: "rgba(255,255,255,0.95)", color: "#0369a1", fontWeight: 600 }
                  : { color: "rgba(255,255,255,0.85)" }
                }
              >
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
                <p className="text-xs mb-0.5 opacity-75" style={{ color: "white" }}>{weatherData.today.condition}</p>
                <p className="leading-none font-semibold" style={{ fontSize: "2.5rem", color: weatherStyle.color }}>{weatherData.today.temp}°C</p>
              </div>
            </div>
            <div className="flex gap-5 mb-3">
              <div className="flex items-center gap-1.5">
                <Droplets className="w-3.5 h-3.5 opacity-60" style={{ color: "white" }} />
                <span className="text-xs opacity-80" style={{ color: "white" }}>{weatherData.today.humidity}% humidity</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Wind className="w-3.5 h-3.5 opacity-60" style={{ color: "white" }} />
                <span className="text-xs opacity-80" style={{ color: "white" }}>{weatherData.today.wind} km/h</span>
              </div>
            </div>
            <div className={`flex items-center gap-2 rounded-xl px-3 py-2 ${flyStatus.status === "good" ? "bg-white/20" : "bg-red-500/30"}`}>
              {flyStatus.status === "good" ? <Plane className="w-4 h-4 text-white" /> : <AlertCircle className="w-4 h-4 text-white" />}
              <div>
                <p className="text-white text-xs font-semibold">{flyStatus.label}</p>
                <p className="text-white/70 text-[10px]">{flyStatus.reason}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex gap-1.5 overflow-x-auto -mx-1 px-1">
            {weatherData.week.map((d) => {
              const ws = weekWeatherStyle(d.day === "Mon" ? "Sunny" : d.day === "Wed" ? "Rainy" : "Partly Cloudy");
              return (
                <button
                  key={d.day}
                  className="flex flex-col items-center gap-1.5 px-2.5 py-2.5 rounded-xl flex-shrink-0 min-w-[44px] transition-opacity hover:opacity-90"
                  style={{ background: "rgba(255,255,255,0.18)" }}
                >
                  <span className="text-[10px] font-medium opacity-80" style={{ color: "white" }}>{d.day}</span>
                  <span className="text-lg leading-none">{d.icon}</span>
                  <span className="text-xs font-semibold" style={{ color: "white" }}>{d.temp}°</span>
                  <span className="text-[10px] opacity-50" style={{ color: "white" }}>{d.low}°</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Map — Active & Accepted jobs (edge-to-edge) */}
      <div className="mb-4">
        <MapWithPins
          fullBleed
          title="Job Locations"
          height={200}
          pins={jobMapPins}
          legend={[
            { label: "Active", color: "#374151" },
            { label: "Accepted", color: "#16a34a" },
          ]}
        />
      </div>

      {/* Available Job Requests */}
      <div className="px-5 mb-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Available Job Requests</p>
          {pendingJobs.length > 0 && (
            <span className="bg-amber-100 text-amber-700 text-xs px-2 py-0.5 rounded-full font-medium">{pendingJobs.length} new</span>
          )}
        </div>

        {pendingJobs.length === 0 ? (
          <div className="bg-card border border-border rounded-2xl p-6 text-center">
            <p className="text-sm text-muted-foreground">No new job requests right now</p>
          </div>
        ) : (
          <div className="space-y-3">
            {pendingJobs.map((job) => (
              <div key={job.id} className="bg-card border border-border rounded-2xl p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-sm font-semibold text-foreground">{job.farmer}</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <MapPin className="w-3 h-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">{job.location}</span>
                      <span className="text-muted-foreground">·</span>
                      <span className="text-xs text-muted-foreground">{job.distance} km away</span>
                    </div>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${jobTypeColors[job.jobType]}`}>{job.jobType}</span>
                </div>
                <div className="grid grid-cols-3 gap-2 mb-3">
                  <div className="bg-secondary rounded-xl p-2 text-center">
                    <p className="text-xs font-semibold text-foreground">{job.acres}</p>
                    <p className="text-[10px] text-muted-foreground">Acres</p>
                  </div>
                  <div className="bg-secondary rounded-xl p-2 text-center">
                    <p className="text-xs font-semibold text-foreground">{job.time}</p>
                    <p className="text-[10px] text-muted-foreground">{job.date.split(",")[0]}</p>
                  </div>
                  <div className="bg-secondary rounded-xl p-2 text-center">
                    <p className="text-xs font-semibold text-primary">₹{job.price.toLocaleString()}</p>
                    <p className="text-[10px] text-muted-foreground">Payout</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setDetailJob(job)}
                    className="flex items-center justify-center gap-1.5 px-3 py-2.5 border border-border rounded-xl text-xs text-foreground hover:bg-secondary transition-colors flex-1">
                    <Eye className="w-3.5 h-3.5" /> View Details
                  </button>
                  <button onClick={() => setDeclineTarget({ id: job.id, farmerName: job.farmer })}
                    className="flex items-center justify-center gap-1.5 px-3 py-2.5 border border-destructive/30 rounded-xl text-xs text-destructive hover:bg-destructive/5 transition-colors">
                    <X className="w-3.5 h-3.5" /> Decline
                  </button>
                  <button onClick={() => handleAccept(job.id)}
                    className="flex items-center justify-center gap-1.5 px-3 py-2.5 bg-primary text-primary-foreground rounded-xl text-xs hover:opacity-90 transition-opacity flex-1">
                    <Check className="w-3.5 h-3.5" /> Accept
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Profile Completion Status ── */}
      {missing.length > 0 && (
        <div className="mx-5 mb-6">
          <div className="bg-card border border-border rounded-2xl p-4">
            <div className="flex items-center gap-4">
              <CompletionCircle pct={pct} />
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-semibold text-foreground">Complete your profile</p>
                  <span className="text-xs text-muted-foreground">{filled}/{total} fields</span>
                </div>
                {/* Progress bar */}
                <div className="h-1.5 bg-muted rounded-full overflow-hidden mb-2">
                  <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${pct}%` }} />
                </div>
                <p className="text-xs text-muted-foreground mb-2">Missing: {missing.join(", ")}</p>
                <button
                  onClick={() => setShowProfile(true)}
                  className="flex items-center gap-1.5 text-xs text-primary font-medium hover:underline"
                >
                  <Settings className="w-3 h-3" /> Go to my Profile <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
