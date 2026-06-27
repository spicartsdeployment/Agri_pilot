import { useState } from "react";
import { ChevronRight, Clock, CheckCircle, User, ArrowLeft, MapPin, XCircle, CreditCard, AlertTriangle } from "lucide-react";
import { Booking } from "./farmerData";
import { getCancellationFee, ADVANCE_PERCENT } from "../shared/dgcaUtils";

interface JobsTabProps {
  bookings: Booking[];
  onUpdateBooking: (id: string, updates: Partial<Booking>) => void;
}

const statusConfig: Record<string, { label: string; color: string; dot: string }> = {
  in_progress: { label: "In Progress", color: "text-primary bg-secondary", dot: "bg-primary animate-pulse" },
  confirmed: { label: "Confirmed", color: "text-sky-700 bg-sky-50", dot: "bg-sky-500" },
  completed: { label: "Completed", color: "text-green-700 bg-green-50", dot: "bg-green-500" },
  cancelled: { label: "Cancelled", color: "text-muted-foreground bg-muted", dot: "bg-muted-foreground" },
  pending_quote: { label: "Quote Pending", color: "text-amber-700 bg-amber-50", dot: "bg-amber-500" },
};

export function JobsTab({ bookings, onUpdateBooking }: JobsTabProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const [cancelConfirm, setCancelConfirm] = useState(false);
  const [payingAdvance, setPayingAdvance] = useState(false);

  const activeJobs = bookings.filter((b) => b.status === "in_progress");
  const upcomingJobs = bookings.filter((b) => b.status === "confirmed" || b.status === "pending_quote");
  const completedJobs = bookings.filter((b) => b.status === "completed");

  const job = bookings.find((b) => b.id === selected);

  const handleCancel = () => {
    if (!job) return;
    onUpdateBooking(job.id, { status: "cancelled" });
    setCancelConfirm(false);
    setSelected(null);
  };

  const handlePayAdvance = () => {
    if (!job) return;
    setPayingAdvance(true);
    setTimeout(() => {
      onUpdateBooking(job.id, { advancePaid: true, status: "confirmed" });
      setPayingAdvance(false);
    }, 1200);
  };

  if (selected && job) {
    const cfg = statusConfig[job.status] || statusConfig.confirmed;
    const cancelInfo = getCancellationFee(job.pilotAcceptedAt ?? null);
    const advanceAmount = Math.round(job.amount * ADVANCE_PERCENT);
    const canCancel = job.status === "confirmed" || job.status === "in_progress" || job.status === "pending_quote";

    return (
      <div className="bg-card border border-border rounded-2xl overflow-hidden mb-6">
        <button onClick={() => { setSelected(null); setCancelConfirm(false); }} className="flex items-center gap-2 px-5 py-4 text-muted-foreground border-b border-border w-full hover:bg-secondary/30">
          <ArrowLeft className="w-4 h-4" /> <span className="text-sm">Back to jobs</span>
        </button>
        <div className="p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-foreground">{job.service}</p>
              <p className="text-xs font-mono text-muted-foreground">{job.id}</p>
            </div>
            <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${cfg.color}`}>{cfg.label}</span>
          </div>
          <div className="space-y-2">
            {[
              ["Farm", job.farm],
              ["Date", job.date],
              ["Time", job.time],
              ["Pilot", job.pilot],
              ["Acres", `${job.acres} acres`],
              ["Qty / Material", job.quantity],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between py-2 border-b border-border last:border-0">
                <span className="text-xs text-muted-foreground">{k}</span>
                <span className="text-xs text-foreground font-medium">{v}</span>
              </div>
            ))}
          </div>
          <div className="bg-secondary rounded-xl p-3 flex justify-between">
            <span className="text-sm text-foreground">Amount</span>
            <span className="text-sm font-semibold text-primary">₹{job.amount.toLocaleString()}</span>
          </div>

          {job.status === "completed" && !job.advancePaid && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 space-y-3">
              <p className="text-xs text-amber-800">Job completed. Pay 20% advance to confirm booking.</p>
              <button onClick={handlePayAdvance} disabled={payingAdvance}
                className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground rounded-xl py-3 text-sm font-medium disabled:opacity-60">
                <CreditCard className="w-4 h-4" />
                {payingAdvance ? "Processing…" : `Pay 20% Advance — ₹${advanceAmount.toLocaleString()}`}
              </button>
            </div>
          )}
          {job.status === "completed" && job.advancePaid && (
            <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl p-3">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span className="text-xs text-green-700 font-medium">Advance paid — booking confirmed</span>
            </div>
          )}

          {canCancel && !cancelConfirm && (
            <button onClick={() => setCancelConfirm(true)} className="w-full flex items-center justify-center gap-2 border border-destructive/30 text-destructive rounded-xl py-3 text-sm hover:bg-destructive/5">
              <XCircle className="w-4 h-4" /> Cancel Booking
            </button>
          )}
          {cancelConfirm && (
            <div className="bg-destructive/5 border border-destructive/20 rounded-xl p-4 space-y-3">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-destructive flex-shrink-0 mt-0.5" />
                <p className="text-xs text-foreground">{cancelInfo.message}</p>
              </div>
              {!cancelInfo.free && <p className="text-xs font-semibold text-destructive">Fee: ₹{cancelInfo.fee}</p>}
              <div className="flex gap-2">
                <button onClick={() => setCancelConfirm(false)} className="flex-1 border border-border rounded-xl py-2 text-xs">Keep Booking</button>
                <button onClick={handleCancel} className="flex-1 bg-destructive text-white rounded-xl py-2 text-xs font-medium">Confirm Cancel</button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  const JobCard = ({ job: j }: { job: Booking }) => {
    const cfg = statusConfig[j.status] || statusConfig.confirmed;
    return (
      <button onClick={() => setSelected(j.id)} className="w-full bg-card border border-border rounded-2xl p-4 text-left hover:bg-secondary/30 transition-colors">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-mono text-muted-foreground">{j.id}</span>
          <div className="flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${cfg.dot}`} />
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${cfg.color}`}>{cfg.label}</span>
          </div>
        </div>
        <p className="text-sm font-medium text-foreground mb-1">{j.service}</p>
        <div className="flex items-center gap-4 text-xs text-muted-foreground mb-2">
          <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{j.farm}</span>
          <span className="flex items-center gap-1"><User className="w-3 h-3" />{j.pilot}</span>
        </div>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{j.date}</span>
          <span>·</span>
          <span>₹{j.amount.toLocaleString()}</span>
        </div>
        {j.status === "completed" && !j.advancePaid && (
          <div className="mt-2 text-xs text-amber-700 font-medium flex items-center gap-1">
            <CreditCard className="w-3 h-3" /> Pay 20% Advance required
          </div>
        )}
      </button>
    );
  };

  if (bookings.length === 0) {
    return (
      <div className="bg-card border border-border rounded-2xl p-8 text-center mb-6">
        <p className="text-muted-foreground text-sm">No bookings yet</p>
        <p className="text-xs text-muted-foreground mt-1">Book a pilot from the Book a Pilot tab</p>
      </div>
    );
  }

  return (
    <div className="space-y-5 mb-6">
      {activeJobs.length > 0 && (
        <div>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">In Progress</p>
          <div className="space-y-3">{activeJobs.map((j) => <JobCard key={j.id} job={j} />)}</div>
        </div>
      )}
      {upcomingJobs.length > 0 && (
        <div>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">Upcoming / Confirmed</p>
          <div className="space-y-3">{upcomingJobs.map((j) => <JobCard key={j.id} job={j} />)}</div>
        </div>
      )}
      {completedJobs.length > 0 && (
        <div>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">Completed</p>
          <div className="space-y-3">{completedJobs.map((j) => <JobCard key={j.id} job={j} />)}</div>
        </div>
      )}
    </div>
  );
}
