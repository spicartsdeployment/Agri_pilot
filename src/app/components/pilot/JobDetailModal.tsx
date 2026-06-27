import { useState } from "react";
import { X, MapPin, Clock, Leaf, Mountain, Droplets, Layers, Check, XCircle, FileText } from "lucide-react";
import { JobRequest } from "./pilotData";
import { CUSTOM_QUOTE_ACRE_THRESHOLD } from "../shared/dgcaUtils";

interface JobDetailModalProps {
  job: JobRequest;
  onClose: () => void;
  onAccept: (customQuote?: number) => void;
  onDecline: () => void;
}

const jobTypeColors: Record<string, string> = {
  Fertilizing: "bg-green-100 text-green-700",
  Pesticides: "bg-orange-100 text-orange-700",
  Inspection: "bg-blue-100 text-blue-700",
  Seeding: "bg-yellow-100 text-yellow-700",
};

export function JobDetailModal({ job, onClose, onAccept, onDecline }: JobDetailModalProps) {
  const [quoteAmount, setQuoteAmount] = useState(job.price.toString());
  const needsQuote = job.requiresQuote || job.acres > CUSTOM_QUOTE_ACRE_THRESHOLD;

  return (
    <div className="fixed inset-0 z-50 bg-foreground/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-background w-full max-w-sm rounded-3xl max-h-[88vh] overflow-y-auto shadow-2xl">
        <div className="flex justify-center pt-3 pb-1"><div className="w-10 h-1 bg-border rounded-full" /></div>
        <div className="flex items-center justify-between px-5 py-3 border-b border-border">
          <div>
            <h3 className="text-foreground font-medium">Job Details</h3>
            <p className="text-xs text-muted-foreground font-mono">{job.id}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 bg-secondary rounded-xl flex items-center justify-center"><X className="w-4 h-4 text-foreground" /></button>
        </div>

        <div className="px-5 py-5 space-y-4">
          {needsQuote && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-start gap-2">
              <FileText className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-amber-800">Job exceeds {CUSTOM_QUOTE_ACRE_THRESHOLD} acres — submit a custom quotation for farmer review.</p>
            </div>
          )}

          <div className="bg-secondary rounded-2xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-primary-foreground font-semibold">{job.farmer[0]}</div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{job.farmer}</p>
                  <p className="text-xs text-muted-foreground">{job.phone}</p>
                </div>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${jobTypeColors[job.jobType]}`}>{job.jobType}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">{job.location}</span>
              <span className="text-xs text-primary font-medium">{job.distance} km away</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: <Layers className="w-4 h-4" />, label: "Area", value: `${job.acres} Acres` },
              { icon: <Clock className="w-4 h-4" />, label: "Date & Time", value: `${job.date}, ${job.time}` },
            ].map(({ icon, label, value }) => (
              <div key={label} className="bg-secondary rounded-xl p-3">
                <div className="text-primary mb-1.5">{icon}</div>
                <p className="text-[10px] text-muted-foreground">{label}</p>
                <p className="text-xs font-medium text-foreground">{value}</p>
              </div>
            ))}
          </div>

          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">Farm Details</p>
            <div className="bg-card border border-border rounded-2xl p-4 space-y-3">
              {[
                { icon: <Leaf className="w-3.5 h-3.5" />, label: "Crop Type", value: job.cropType },
                { icon: <Mountain className="w-3.5 h-3.5" />, label: "Soil Type", value: job.soilType },
                { icon: <Layers className="w-3.5 h-3.5" />, label: "Land Type", value: job.landType },
                { icon: <Droplets className="w-3.5 h-3.5" />, label: "Crop Stage", value: job.cropStage },
              ].map(({ icon, label, value }) => (
                <div key={label} className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-muted-foreground">{icon}<span className="text-xs text-muted-foreground">{label}</span></div>
                  <span className="text-xs font-medium text-foreground">{value}</span>
                </div>
              ))}
            </div>
          </div>

          {needsQuote ? (
            <div className="space-y-2">
              <label className="text-xs text-muted-foreground">Custom Quotation (₹)</label>
              <input type="number" value={quoteAmount} onChange={(e) => setQuoteAmount(e.target.value)}
                className="w-full bg-input-background rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-1 focus:ring-primary" />
              <p className="text-[10px] text-muted-foreground">Base estimate: ₹{job.price.toLocaleString()} — adjust based on terrain & logistics</p>
            </div>
          ) : (
            <div className="bg-primary rounded-2xl p-4 flex items-center justify-between">
              <div>
                <p className="text-primary-foreground/70 text-xs">Total Payout</p>
                <p className="text-primary-foreground font-semibold" style={{ fontSize: "1.5rem" }}>₹{job.price.toLocaleString()}</p>
              </div>
              <div className="text-right">
                <p className="text-primary-foreground/70 text-xs">Per Acre</p>
                <p className="text-primary-foreground font-medium">₹{Math.round(job.price / job.acres)}</p>
              </div>
            </div>
          )}

          <div className="flex gap-3 pb-2">
            <button onClick={onDecline} className="flex-1 flex items-center justify-center gap-2 py-3 border border-destructive/20 rounded-xl text-sm text-destructive hover:bg-destructive/5">
              <XCircle className="w-4 h-4" /> Decline
            </button>
            <button onClick={() => onAccept(needsQuote ? parseInt(quoteAmount, 10) : undefined)}
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-primary text-primary-foreground rounded-xl text-sm hover:opacity-90">
              <Check className="w-4 h-4" /> {needsQuote ? "Submit Quote" : "Accept Job"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
