import { useState } from "react";
import { Star, FileText, ChevronRight, ArrowLeft, Check, RotateCcw, Upload, Clock, AlertCircle } from "lucide-react";
import { REFUND_WINDOW_MS } from "../shared/dgcaUtils";

const stats = [
  { label: "Total Bookings", value: "24" },
  { label: "Acres Served", value: "186" },
  { label: "Amount Spent", value: "₹83,400" },
];

const historyItems = [
  { id: "JB-2390", date: "Jun 5, 2026", service: "Pesticide Spray", pilot: "Arjun Singh", amount: 5400, status: "Completed", farm: "North Field", acres: 12, cropType: "Wheat", rating: 5, completedAt: Date.now() - 2 * 60 * 60 * 1000 },
  { id: "JB-2376", date: "May 22, 2026", service: "Fertilizer Spray", pilot: "Kiran Rao", amount: 3600, status: "Completed", farm: "South Paddy", acres: 8, cropType: "Rice", rating: 4, completedAt: Date.now() - 48 * 60 * 60 * 1000 },
  { id: "JB-2355", date: "May 10, 2026", service: "Crop Monitoring", pilot: "Vikram Nair", amount: 2250, status: "Completed", farm: "East Orchard", acres: 5, cropType: "Mango", rating: 5, completedAt: Date.now() - 72 * 60 * 60 * 1000 },
  { id: "JB-2340", date: "Apr 28, 2026", service: "Seeding", pilot: "Rahul Desai", amount: 7200, status: "Completed", farm: "North Field", acres: 12, cropType: "Wheat", rating: 4, completedAt: Date.now() - 96 * 60 * 60 * 1000 },
];

type RefundEvidence = { beforePhoto: boolean; afterPhoto: boolean; pilotPhoto: boolean; flightLogs: boolean };

export function FarmerHistory() {
  const [selected, setSelected] = useState<string | null>(null);
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [feedbacks, setFeedbacks] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState<Record<string, boolean>>({});
  const [rebookSuccess, setRebookSuccess] = useState<string | null>(null);
  const [showRefund, setShowRefund] = useState(false);
  const [refundEvidence, setRefundEvidence] = useState<RefundEvidence>({ beforePhoto: false, afterPhoto: false, pilotPhoto: false, flightLogs: false });
  const [refundSubmitted, setRefundSubmitted] = useState<Record<string, boolean>>({});

  const item = historyItems.find((h) => h.id === selected);
  const withinRefundWindow = item ? Date.now() - item.completedAt < REFUND_WINDOW_MS : false;
  const refundHoursLeft = item ? Math.max(0, Math.ceil((REFUND_WINDOW_MS - (Date.now() - item.completedAt)) / 3600000)) : 0;
  const allEvidenceUploaded = Object.values(refundEvidence).every(Boolean);

  const handleRebook = (id: string, service: string, farm: string) => {
    setRebookSuccess(`${service} at ${farm} — booking request sent!`);
    setTimeout(() => { setRebookSuccess(null); setSelected(null); }, 2500);
  };

  if (selected && item) {
    const userRating = ratings[item.id] || item.rating;
    const isSubmitted = submitted[item.id];

    return (
      <div className="min-h-screen bg-background">
        <div className="flex items-center gap-3 px-5 pt-12 pb-4">
          <button onClick={() => setSelected(null)} className="w-9 h-9 bg-card border border-border rounded-xl flex items-center justify-center hover:bg-secondary transition-colors">
            <ArrowLeft className="w-4 h-4 text-foreground" />
          </button>
          <div>
            <h2 className="text-foreground">Service Detail</h2>
            <p className="text-xs text-muted-foreground font-mono">{item.id}</p>
          </div>
        </div>

        <div className="px-5 space-y-4 pb-8">
          {/* Status badge */}
          <div className="flex items-center justify-between bg-card border border-border rounded-2xl p-4">
            <div>
              <p className="text-sm font-semibold text-foreground">{item.service}</p>
              <p className="text-xs text-muted-foreground">{item.farm} · {item.date}</p>
            </div>
            <span className="text-xs bg-secondary text-primary px-2.5 py-1 rounded-full font-medium">{item.status}</span>
          </div>

          {/* Details */}
          <div className="bg-card border border-border rounded-2xl p-4 space-y-3">
            <h4 className="text-sm font-medium text-foreground border-b border-border pb-3">Service Information</h4>
            {[
              ["Booking Date", item.date],
              ["Farm", item.farm],
              ["Crop Type", item.cropType],
              ["Pilot", item.pilot],
              ["Area Covered", `${item.acres} acres`],
              ["Amount Paid", `₹${item.amount.toLocaleString()}`],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between">
                <span className="text-xs text-muted-foreground">{k}</span>
                <span className="text-xs text-foreground font-medium">{v}</span>
              </div>
            ))}
          </div>

          {/* Invoice */}
          <div className="bg-card border border-border rounded-2xl p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-medium text-foreground">Invoice</h4>
              <button className="flex items-center gap-1.5 text-xs text-primary hover:underline">
                <FileText className="w-3.5 h-3.5" /> Download PDF
              </button>
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between"><span className="text-muted-foreground">Service charge (85%)</span><span className="text-foreground">₹{Math.round(item.amount * 0.85).toLocaleString()}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Materials (10%)</span><span className="text-foreground">₹{Math.round(item.amount * 0.1).toLocaleString()}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Platform fee (5%)</span><span className="text-foreground">₹{Math.round(item.amount * 0.05).toLocaleString()}</span></div>
              <div className="flex justify-between pt-2 border-t border-border font-semibold text-foreground">
                <span>Total</span><span>₹{item.amount.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Rating */}
          <div className="bg-card border border-border rounded-2xl p-4">
            <h4 className="text-sm font-medium text-foreground mb-3">Rate this Service</h4>
            <div className="flex gap-2 mb-3">
              {[1, 2, 3, 4, 5].map((s) => (
                <button
                  key={s}
                  disabled={isSubmitted}
                  onClick={() => !isSubmitted && setRatings({ ...ratings, [item.id]: s })}
                >
                  <Star className={`w-7 h-7 transition-colors ${s <= userRating ? "fill-accent text-accent" : "text-border"}`} />
                </button>
              ))}
            </div>
            <textarea
              disabled={isSubmitted}
              value={feedbacks[item.id] || ""}
              onChange={(e) => setFeedbacks({ ...feedbacks, [item.id]: e.target.value })}
              placeholder="Leave feedback for the pilot..."
              className="w-full bg-input-background rounded-xl px-3 py-2.5 text-sm text-foreground outline-none resize-none h-20 placeholder:text-muted-foreground disabled:opacity-60"
            />
            {isSubmitted ? (
              <div className="flex items-center gap-2 mt-3 bg-secondary rounded-xl p-3">
                <Check className="w-4 h-4 text-primary" />
                <span className="text-xs text-primary font-medium">Rating submitted — thank you!</span>
              </div>
            ) : (
              <button
                onClick={() => setSubmitted({ ...submitted, [item.id]: true })}
                className="w-full mt-3 bg-primary text-primary-foreground rounded-xl py-3 text-sm font-medium hover:opacity-90 transition-opacity"
              >
                Submit Rating
              </button>
            )}
          </div>

          {/* Refund Request */}
          {withinRefundWindow && !refundSubmitted[item.id] && (
            <div className="bg-card border border-border rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <Clock className="w-4 h-4 text-primary" />
                <h4 className="text-sm font-medium text-foreground">Request Refund</h4>
                <span className="text-[10px] text-muted-foreground ml-auto">{refundHoursLeft}h left (24h window)</span>
              </div>
              {!showRefund ? (
                <button onClick={() => setShowRefund(true)} className="w-full border border-border rounded-xl py-2.5 text-xs text-foreground hover:bg-secondary">Request Refund</button>
              ) : (
                <div className="space-y-3">
                  <p className="text-xs text-muted-foreground">Upload required evidence:</p>
                  {([
                    ["beforePhoto", "Before-work field photos"],
                    ["afterPhoto", "After-work field photos"],
                    ["pilotPhoto", "Pilot facial verification photo"],
                    ["flightLogs", "Drone flight logs"],
                  ] as const).map(([key, label]) => (
                    <button key={key} onClick={() => setRefundEvidence({ ...refundEvidence, [key]: true })}
                      className={`w-full flex items-center gap-2 p-3 rounded-xl border text-left text-xs ${refundEvidence[key] ? "border-primary bg-secondary" : "border-border"}`}>
                      <Upload className="w-3.5 h-3.5 text-primary" />
                      <span className="flex-1 text-foreground">{label}</span>
                      {refundEvidence[key] && <Check className="w-3.5 h-3.5 text-primary" />}
                    </button>
                  ))}
                  <button disabled={!allEvidenceUploaded} onClick={() => { setRefundSubmitted({ ...refundSubmitted, [item.id]: true }); setShowRefund(false); }}
                    className="w-full bg-primary text-primary-foreground rounded-xl py-3 text-sm font-medium disabled:opacity-40">Submit Refund Request</button>
                </div>
              )}
            </div>
          )}
          {refundSubmitted[item.id] && (
            <div className="flex items-center gap-2 bg-secondary rounded-xl p-4">
              <Check className="w-4 h-4 text-primary" />
              <p className="text-xs text-primary font-medium">Refund request submitted — review within 3–5 business days</p>
            </div>
          )}
          {!withinRefundWindow && !refundSubmitted[item.id] && (
            <div className="flex items-center gap-2 bg-muted rounded-xl p-3">
              <AlertCircle className="w-4 h-4 text-muted-foreground" />
              <p className="text-xs text-muted-foreground">Refund window expired (24 hours after completion)</p>
            </div>
          )}

          {/* Rebook */}
          {rebookSuccess ? (
            <div className="flex items-center gap-2 bg-secondary rounded-xl p-4">
              <Check className="w-4 h-4 text-primary" />
              <p className="text-xs text-primary font-medium">{rebookSuccess}</p>
            </div>
          ) : (
            <button
              onClick={() => handleRebook(item.id, item.service, item.farm)}
              className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground rounded-xl py-3 text-sm font-medium hover:opacity-90 transition-opacity"
            >
              <RotateCcw className="w-4 h-4" /> Rebook this Service
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="px-5 pt-12 pb-4">
        <h2 className="text-foreground font-bold">History</h2>
        <p className="text-sm text-muted-foreground mt-1">Your service history</p>
      </div>

      <div className="px-5 mb-5">
        <div className="grid grid-cols-3 gap-3">
          {stats.map(({ label, value }) => (
            <div key={label} className="bg-card border border-border rounded-2xl p-3 text-center">
              <p className="text-base font-semibold text-primary">{value}</p>
              <p className="text-xs text-muted-foreground leading-tight mt-1">{label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="px-5 space-y-3 pb-8">
        {historyItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setSelected(item.id)}
            className="w-full bg-card border border-border rounded-2xl p-4 text-left hover:bg-secondary/30 transition-colors"
          >
            <div className="flex items-start justify-between mb-2">
              <div>
                <p className="text-sm font-medium text-foreground">{item.service}</p>
                <p className="text-xs text-muted-foreground">{item.date} · {item.pilot}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-foreground">₹{item.amount.toLocaleString()}</p>
                <div className="flex items-center gap-0.5 justify-end mt-0.5">
                  {[...Array(item.rating)].map((_, i) => (
                    <Star key={i} className="w-2.5 h-2.5 fill-accent text-accent" />
                  ))}
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs bg-secondary text-primary px-2 py-0.5 rounded-full font-medium">{item.status}</span>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
