import { useState, useEffect } from "react";
import { Phone, MapPin, Clock, KeyRound, Navigation, Activity, Calendar, CheckCircle, Lock, X, Check, Camera, MapPinned, RefreshCw, XCircle } from "lucide-react";
import { activeJobsList, ActiveJob } from "./pilotData";

const jobStatusConfig = {
  active:   { label: "In Progress", color: "bg-primary text-primary-foreground",    dot: "bg-primary" },
  today:    { label: "Today",       color: "bg-amber-100 text-amber-700",            dot: "bg-amber-500" },
  upcoming: { label: "Upcoming",    color: "bg-secondary text-muted-foreground",     dot: "bg-muted-foreground" },
};

function PassKeyInput({ jobId }: { jobId: string }) {
  const [key, setKey] = useState("");
  const [saved, setSaved] = useState(false);
  const [editing, setEditing] = useState(false);
  const submit = () => { if (key.trim()) { setSaved(true); setEditing(false); } };

  if (saved && !editing) {
    return (
      <div className="flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-xl px-3 py-2.5 mb-3">
        <KeyRound className="w-4 h-4 text-primary flex-shrink-0" />
        <div className="flex-1">
          <p className="text-[10px] text-muted-foreground">Farmer Pass Key</p>
          <p className="text-sm font-mono font-bold text-primary tracking-widest">{key}</p>
        </div>
        <button onClick={() => setEditing(true)} className="text-xs text-primary hover:underline">Edit</button>
      </div>
    );
  }

  return (
    <div className="bg-muted border border-border rounded-xl px-3 py-2.5 mb-3">
      <div className="flex items-center gap-2 mb-2">
        <Lock className="w-4 h-4 text-muted-foreground flex-shrink-0" />
        <p className="text-xs text-muted-foreground">{editing ? "Update farmer pass key" : "Tap to enter farmer pass key"}</p>
      </div>
      {editing || !saved ? (
        <div className="flex gap-2">
          <input type="text" placeholder="Enter pass key from farmer" value={key}
            onChange={(e) => setKey(e.target.value.toUpperCase())}
            className="flex-1 bg-card border border-border rounded-lg px-3 py-2 text-sm font-mono text-foreground outline-none focus:border-primary" />
          <button onClick={submit} disabled={!key.trim()} className="w-9 h-9 bg-primary text-primary-foreground rounded-lg flex items-center justify-center disabled:opacity-40"><Check className="w-4 h-4" /></button>
        </div>
      ) : (
        <button onClick={() => setEditing(true)} className="w-full py-2 text-xs text-primary font-medium text-center">+ Enter Pass Key</button>
      )}
    </div>
  );
}

function openMaps(location: string) {
  window.open(`https://maps.google.com/?q=${encodeURIComponent(location + ", Maharashtra, India")}`, "_blank");
}

function JobCard({ job, onUpdate, onCancel, onReschedule, rescheduleSent }: {
  job: ActiveJob;
  onUpdate: (id: string, u: Partial<ActiveJob>) => void;
  onCancel: (id: string) => void;
  onReschedule: (id: string) => void;
  rescheduleSent: boolean;
}) {
  const cfg = jobStatusConfig[job.jobStatus];
  const progress = job.autoProgress ?? 0;
  const canReschedule = job.jobStatus === "active" || job.jobStatus === "today" || job.jobStatus === "upcoming";

  return (
    <div className={`bg-card border rounded-2xl p-4 ${job.jobStatus === "active" ? "border-primary/30 shadow-sm" : "border-border"}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${cfg.dot} ${job.jobStatus === "active" ? "animate-pulse" : ""}`} />
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${cfg.color}`}>{cfg.label}</span>
        </div>
        <span className="text-xs font-mono text-muted-foreground">{job.id}</span>
      </div>

      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-sm font-semibold text-foreground">{job.farmer}</p>
          <p className="text-xs text-muted-foreground">{job.farm}</p>
        </div>
        <a href={`tel:${job.phone}`} className="w-9 h-9 bg-secondary rounded-xl flex items-center justify-center text-primary hover:bg-primary hover:text-primary-foreground transition-colors">
          <Phone className="w-4 h-4" />
        </a>
      </div>

      <div className="space-y-2 mb-3">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Activity className="w-3.5 h-3.5 text-primary flex-shrink-0" />
          <span className="text-foreground font-medium">{job.service}</span><span>·</span><span>{job.acres} acres</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground"><MapPin className="w-3.5 h-3.5 flex-shrink-0" /><span>{job.location}</span></div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground"><Clock className="w-3.5 h-3.5 flex-shrink-0" /><span>{job.date} · {job.time}</span></div>
      </div>

      {job.jobStatus === "active" && (
        <div className="space-y-2 mb-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Auto Progress (GPS + logs + photos)</span>
            <span className="text-primary font-medium">{progress}%</span>
          </div>
          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${progress}%` }} />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button onClick={() => onUpdate(job.id, { geofenceVerified: true })}
              className={`flex items-center gap-1.5 p-2 rounded-lg text-[10px] border ${job.geofenceVerified ? "border-primary bg-secondary text-primary" : "border-border text-muted-foreground"}`}>
              <MapPinned className="w-3 h-3" /> {job.geofenceVerified ? "Geofence OK" : "Verify GPS Geofence"}
            </button>
            <button onClick={() => onUpdate(job.id, { arrivalPhotoTaken: true })}
              className={`flex items-center gap-1.5 p-2 rounded-lg text-[10px] border ${job.arrivalPhotoTaken ? "border-primary bg-secondary text-primary" : "border-border text-muted-foreground"}`}>
              <Camera className="w-3 h-3" /> {job.arrivalPhotoTaken ? "Arrival Verified" : "Arrival Photo"}
            </button>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between mb-3 bg-secondary rounded-xl px-3 py-2">
        <span className="text-xs text-muted-foreground">Payout</span>
        <span className="text-sm font-semibold text-primary">₹{job.pay.toLocaleString()}</span>
      </div>

      {job.jobStatus === "today" && <PassKeyInput jobId={job.id} />}

      {(job.jobStatus === "active" || job.jobStatus === "today") && (
        <button onClick={() => openMaps(job.location)} className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground rounded-xl py-3 text-sm font-medium hover:opacity-90 mb-2">
          <Navigation className="w-4 h-4" /> Navigate to Farm
        </button>
      )}

      {(job.jobStatus === "today" || job.jobStatus === "upcoming" || job.jobStatus === "active") && (
        <div className="space-y-2">
          {rescheduleSent && (
            <div className="flex items-center gap-2 bg-secondary rounded-xl p-2.5">
              <CheckCircle className="w-3.5 h-3.5 text-primary flex-shrink-0" />
              <p className="text-xs text-primary font-medium">Reschedule request sent</p>
            </div>
          )}
          {canReschedule && (
            <div className="flex gap-2">
              <button
                onClick={() => onReschedule(job.id)}
                disabled={rescheduleSent}
                className="flex-1 flex items-center justify-center gap-1 py-2 border border-border rounded-xl text-xs text-foreground hover:bg-secondary disabled:opacity-50"
              >
                <RefreshCw className="w-3 h-3" /> Reschedule
              </button>
              {(job.jobStatus === "today" || job.jobStatus === "upcoming") && (
                <button onClick={() => onCancel(job.id)} className="flex-1 flex items-center justify-center gap-1 py-2 border border-destructive/30 rounded-xl text-xs text-destructive hover:bg-destructive/5">
                  <XCircle className="w-3 h-3" /> Cancel
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function PilotActiveJobs() {
  const [jobs, setJobs] = useState<ActiveJob[]>(activeJobsList);
  const [toast, setToast] = useState("");
  const [rescheduleSentIds, setRescheduleSentIds] = useState<Set<string>>(new Set());

  const updateJob = (id: string, updates: Partial<ActiveJob>) => {
    setJobs((p) => p.map((j) => (j.id === id ? { ...j, ...updates } : j)));
  };

  const handleCancel = (id: string) => {
    setJobs((p) => p.filter((j) => j.id !== id));
    setToast("Job cancelled — repeated cancellations affect your rating");
    setTimeout(() => setToast(""), 3000);
  };

  const handleReschedule = (id: string) => {
    const job = jobs.find((j) => j.id === id);
    if (!job) return;
    setRescheduleSentIds((prev) => new Set(prev).add(id));
    setToast("Reschedule request sent");
    setTimeout(() => setToast(""), 4000);
  };

  useEffect(() => {
    const active = jobs.find((j) => j.jobStatus === "active");
    if (!active || (active.autoProgress ?? 0) >= 100) return;
    const interval = setInterval(() => {
      setJobs((p) => p.map((j) => j.id === active.id && (j.autoProgress ?? 0) < 100
        ? { ...j, autoProgress: Math.min(100, (j.autoProgress ?? 0) + 5) } : j));
    }, 4000);
    return () => clearInterval(interval);
  }, [jobs]);

  const activeJobs = jobs.filter((j) => j.jobStatus === "active");
  const todayJobs = jobs.filter((j) => j.jobStatus === "today");
  const upcomingJobs = jobs.filter((j) => j.jobStatus === "upcoming");

  return (
    <div className="min-h-screen bg-background pb-6">
      <div className="px-5 pt-12 pb-5">
        <h2 className="text-foreground">Active Jobs</h2>
        <p className="text-sm text-muted-foreground mt-1">GPS geofencing, arrival verification & auto progress tracking</p>
      </div>

      {toast && (
        <div className="mx-5 mb-4 flex items-center gap-2 bg-secondary rounded-xl p-3">
          <CheckCircle className="w-4 h-4 text-primary" />
          <p className="text-xs text-primary font-medium">{toast}</p>
        </div>
      )}

      <div className="px-5 mb-5">
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "In Progress", value: activeJobs.length, dot: "bg-primary" },
            { label: "Today", value: todayJobs.length, dot: "bg-amber-500" },
            { label: "Upcoming", value: upcomingJobs.length, dot: "bg-muted-foreground" },
          ].map(({ label, value, dot }) => (
            <div key={label} className="bg-card border border-border rounded-2xl p-3 text-center">
              <div className="flex justify-center mb-1.5"><span className={`w-2 h-2 rounded-full ${dot}`} /></div>
              <p className="text-base font-semibold text-foreground">{value}</p>
              <p className="text-xs text-muted-foreground">{label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="px-5 space-y-6">
        {activeJobs.length > 0 && (
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">In Progress</p>
            <div className="space-y-3">{activeJobs.map((j) => <JobCard key={j.id} job={j} onUpdate={updateJob} onCancel={handleCancel} onReschedule={handleReschedule} rescheduleSent={rescheduleSentIds.has(j.id)} />)}</div>
          </div>
        )}
        {todayJobs.length > 0 && (
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">Today's Jobs</p>
            <div className="space-y-3">{todayJobs.map((j) => <JobCard key={j.id} job={j} onUpdate={updateJob} onCancel={handleCancel} onReschedule={handleReschedule} rescheduleSent={rescheduleSentIds.has(j.id)} />)}</div>
          </div>
        )}
        {upcomingJobs.length > 0 && (
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">Upcoming</p>
            <div className="space-y-3">{upcomingJobs.map((j) => <JobCard key={j.id} job={j} onUpdate={updateJob} onCancel={handleCancel} onReschedule={handleReschedule} rescheduleSent={rescheduleSentIds.has(j.id)} />)}</div>
          </div>
        )}
      </div>
    </div>
  );
}
