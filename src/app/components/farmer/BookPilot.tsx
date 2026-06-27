import { useState } from "react";
import { CheckCircle, Calendar, Clock, Droplet, Leaf, MapPin, ChevronRight, ArrowLeft, Sprout, Beaker, Eye, Plus, Crown, User, X } from "lucide-react";
import { Booking, Farm, newBookingId } from "./farmerData";
import { assignBestPilot, availablePilots } from "../shared/pilotAssignment";
import { CUSTOM_QUOTE_ACRE_THRESHOLD, MIN_ACRES } from "../shared/dgcaUtils";

interface BookPilotProps {
  onBookingConfirmed: (b: Booking) => void;
  bookings: Booking[];
  farms: Farm[];
  onAddFarm: (farm: Farm) => void;
  isPremium: boolean;
}

const serviceOptions = [
  { label: "Pesticide Spray", img: "https://images.unsplash.com/photo-1628352081506-83c43123ed6d?w=200&h=120&fit=crop&auto=format", icon: <Beaker className="w-4 h-4" /> },
  { label: "Fertilizer Spray", img: "https://images.unsplash.com/photo-1655130944329-b3a63166f6b5?w=200&h=120&fit=crop&auto=format", icon: <Leaf className="w-4 h-4" /> },
  { label: "Seeding", img: "https://images.unsplash.com/photo-1717702576954-c07131c54169?w=200&h=120&fit=crop&auto=format", icon: <Sprout className="w-4 h-4" /> },
  { label: "Crop Monitoring", img: "https://images.unsplash.com/photo-1586771107445-d3ca888129ff?w=200&h=120&fit=crop&auto=format", icon: <Eye className="w-4 h-4" /> },
];

type Step = "form" | "summary" | "confirmed";

function AddFarmModal({ onClose, onSave }: { onClose: () => void; onSave: (farm: Farm) => void }) {
  const [name, setName] = useState("");
  const [crop, setCrop] = useState("");
  const [acres, setAcres] = useState("");
  const [location, setLocation] = useState("Kamptee, MH");
  const err = acres && parseFloat(acres) < MIN_ACRES ? `Minimum ${MIN_ACRES} acre required` : "";

  const save = () => {
    const a = parseFloat(acres);
    if (!name || !crop || !a || a < MIN_ACRES) return;
    onSave({
      id: Date.now(),
      name,
      crop,
      acres: a,
      location,
      img: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=120&h=80&fit=crop&auto=format",
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-foreground/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-background w-full max-w-sm rounded-2xl p-5 space-y-3 shadow-2xl">
        <div className="flex items-center justify-between">
          <h3 className="text-foreground font-medium">Add New Farm</h3>
          <button onClick={onClose}><X className="w-4 h-4 text-muted-foreground" /></button>
        </div>
        {[["Farm Name", name, setName, "text"], ["Crop Type", crop, setCrop, "text"], ["Area (acres)", acres, setAcres, "number"], ["Location", location, setLocation, "text"]].map(([label, val, set, type]) => (
          <div key={label as string}>
            <label className="text-xs text-muted-foreground mb-1 block">{label}</label>
            <input type={type as string} value={val as string} min={type === "number" ? MIN_ACRES : undefined}
              onChange={(e) => (set as (v: string) => void)(e.target.value)}
              className="w-full bg-input-background rounded-xl px-3 py-2.5 text-sm text-foreground outline-none focus:ring-1 focus:ring-primary" />
          </div>
        ))}
        <p className="text-[10px] text-muted-foreground">Land size: min {MIN_ACRES} acre · no maximum limit</p>
        {err && <p className="text-xs text-destructive">{err}</p>}
        <button onClick={save} disabled={!!err || !name || !crop || !acres}
          className="w-full bg-primary text-primary-foreground rounded-xl py-3 text-sm font-medium disabled:opacity-40">Save Farm</button>
      </div>
    </div>
  );
}

export function BookPilot({ onBookingConfirmed, bookings, farms, onAddFarm, isPremium }: BookPilotProps) {
  const [step, setStep] = useState<Step>("form");
  const [form, setForm] = useState({ farm: "", service: "", quantity: "", date: "", time: " AM", selectedPilot: "" });
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);
  const [showAddFarm, setShowAddFarm] = useState(false);

  const recentBookings = bookings.slice(0, 3);
  const selectedFarm = farms.find((f) => f.name === form.farm);
  const acres = selectedFarm?.acres || 0;
  const needsQuote = acres > CUSTOM_QUOTE_ACRE_THRESHOLD;
  const estimatedCost = acres * 450;

  const handleConfirm = () => {
    let pilotName = "Pending";
    if (isPremium && form.selectedPilot) {
      pilotName = form.selectedPilot;
    } else if (!needsQuote) {
      const assigned = assignBestPilot(availablePilots);
      pilotName = assigned?.name || "Pending";
    }

    const b: Booking = {
      id: newBookingId(),
      farm: form.farm,
      service: form.service,
      quantity: form.quantity ? `${form.quantity} L` : "N/A",
      date: form.date,
      time: form.time,
      pilot: needsQuote ? "Awaiting Quote" : pilotName,
      acres,
      amount: estimatedCost,
      status: needsQuote ? "pending_quote" : "confirmed",
      progress: 0,
      quotePending: needsQuote,
    };
    setConfirmedBooking(b);
    onBookingConfirmed(b);
    setStep("confirmed");
  };

  const handleAddFarm = (farm: Farm) => {
    onAddFarm(farm);
    setForm({ ...form, farm: farm.name });
  };

  if (step === "confirmed" && confirmedBooking) {
    return (
      <div className="bg-card border border-border rounded-2xl p-6 flex flex-col items-center text-center gap-3 mb-6">
        <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center">
          <CheckCircle className="w-8 h-8 text-primary" />
        </div>
        <h3 className="text-foreground">{confirmedBooking.quotePending ? "Quote Request Sent!" : "Booking Confirmed!"}</h3>
        <p className="text-sm text-muted-foreground">
          {confirmedBooking.quotePending
            ? "Pilot will submit a custom quotation for review (>50 acres)."
            : isPremium ? "Your preferred pilot will be notified." : "Best-matched pilot auto-assigned based on rating, subscription, availability & distance."}
        </p>
        <div className="bg-secondary rounded-xl p-3 w-full text-left space-y-2">
          {[
            ["Booking ID", confirmedBooking.id],
            ["Farm", confirmedBooking.farm],
            ["Acres", `${confirmedBooking.acres} acres`],
            ["Pilot", confirmedBooking.pilot],
            ["Estimated Cost", confirmedBooking.quotePending ? "Pending quote" : `₹${confirmedBooking.amount.toLocaleString()}`],
          ].map(([k, v]) => (
            <div key={k} className="flex justify-between text-xs">
              <span className="text-muted-foreground">{k}</span>
              <span className={`font-medium ${k === "Estimated Cost" ? "text-primary" : "text-foreground"}`}>{v}</span>
            </div>
          ))}
        </div>
        <button onClick={() => { setStep("form"); setForm({ farm: "", service: "", quantity: "", date: "", time: "", selectedPilot: "" }); }}
          className="w-full bg-primary text-primary-foreground rounded-xl py-3 text-sm font-medium hover:opacity-90">New Booking</button>
      </div>
    );
  }

  if (step === "summary") {
    return (
      <div className="bg-card border border-border rounded-2xl overflow-hidden mb-6">
        <button onClick={() => setStep("form")} className="flex items-center gap-2 px-5 py-4 text-muted-foreground border-b border-border w-full hover:bg-secondary/30">
          <ArrowLeft className="w-4 h-4" /> <span className="text-sm">Back to form</span>
        </button>
        <div className="p-5 space-y-4">
          <h3 className="text-foreground">Booking Summary</h3>
          {selectedFarm && (
            <div className="rounded-xl overflow-hidden relative h-24">
              <img src={selectedFarm.img} alt={selectedFarm.name} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-foreground/40 flex items-end p-3">
                <p className="text-white text-sm font-semibold">{selectedFarm.name} · {selectedFarm.crop} · {selectedFarm.acres} acres</p>
              </div>
            </div>
          )}
          <div className="space-y-2">
            {[
              ["Service", form.service],
              ["Pilot", isPremium ? (form.selectedPilot || "Not selected") : "Auto-assigned (best match)"],
              ["Date", form.date],
              ["Time", form.time || "Not specified"],
              ["Land Size", `${acres} acres (min ${MIN_ACRES} ac, no max)`],
            ].map(([k, v]) => (
              <div key={k} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <span className="text-xs text-muted-foreground">{k}</span>
                <span className="text-xs text-foreground font-medium">{v}</span>
              </div>
            ))}
          </div>
          {needsQuote && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-800">
              Jobs over {CUSTOM_QUOTE_ACRE_THRESHOLD} acres require a custom pilot quotation before confirmation.
            </div>
          )}
          <div className="bg-secondary rounded-xl p-4 flex items-center justify-between">
            <span className="text-sm font-medium text-foreground">{needsQuote ? "Estimated Base" : "Estimated Cost"}</span>
            <span className="text-primary font-semibold">{needsQuote ? "Quote pending" : `₹${estimatedCost.toLocaleString()}`}</span>
          </div>
          <div className="flex gap-3">
            <button onClick={() => setStep("form")} className="flex-1 border border-border text-foreground rounded-xl py-3 text-sm font-medium hover:bg-secondary">Cancel</button>
            <button onClick={handleConfirm} className="flex-1 bg-primary text-primary-foreground rounded-xl py-3 text-sm font-medium hover:opacity-90">Confirm Booking</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 mb-6">
      {showAddFarm && <AddFarmModal onClose={() => setShowAddFarm(false)} onSave={handleAddFarm} />}

      {recentBookings.length > 0 && (
        <div>
          <p className="text-xs text-muted-foreground font-medium mb-2">Recent Bookings</p>
          <div className="space-y-2">
            {recentBookings.map((b) => (
              <div key={b.id} className="flex items-center gap-3 bg-card border border-border rounded-xl px-3 py-2.5">
                <span className={`w-2 h-2 rounded-full flex-shrink-0 ${b.status === "in_progress" ? "bg-primary animate-pulse" : "bg-muted-foreground"}`} />
                <div className="flex-1">
                  <p className="text-xs font-medium text-foreground">{b.farm} · {b.service}</p>
                  <p className="text-xs text-muted-foreground">{b.date} · {b.id}</p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${b.status === "in_progress" ? "bg-secondary text-primary" : "bg-muted text-muted-foreground"}`}>
                  {b.status === "in_progress" ? "Active" : "Confirmed"}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="relative h-28 overflow-hidden">
          <img src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&h=200&fit=crop&auto=format" alt="Farm field" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent flex items-end p-4">
            <h3 className="text-white">Book a Pilot</h3>
          </div>
        </div>

        <div className="p-5 space-y-5">
          <div className="bg-secondary/60 rounded-xl px-3 py-2 text-[10px] text-muted-foreground">
            Land size limits: minimum <strong>{MIN_ACRES} acre</strong> · no maximum acreage limit
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-medium text-muted-foreground">Select Farm *</label>
              <button onClick={() => setShowAddFarm(true)} className="flex items-center gap-1 text-xs text-primary font-medium">
                <Plus className="w-3.5 h-3.5" /> Add New Farm
              </button>
            </div>
            <div className="space-y-2">
              {farms.map((f) => (
                <button key={f.id} onClick={() => setForm({ ...form, farm: f.name })}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all ${form.farm === f.name ? "border-primary bg-secondary" : "border-border bg-background hover:bg-secondary/50"}`}>
                  <img src={f.img} alt={f.name} className="w-12 h-10 object-cover rounded-lg flex-shrink-0" />
                  <div className="flex-1 text-left">
                    <p className="text-xs font-medium text-foreground">{f.name}</p>
                    <p className="text-xs text-muted-foreground">{f.crop} · {f.acres} acres</p>
                  </div>
                  {form.farm === f.name && <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />}
                </button>
              ))}
            </div>
          </div>

          {isPremium ? (
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1.5">
                <Crown className="w-3.5 h-3.5 text-amber-500" /> Select Preferred Pilot (Premium)
              </label>
              <div className="space-y-2">
                {availablePilots.filter((p) => p.available).map((p) => (
                  <button key={p.id} onClick={() => setForm({ ...form, selectedPilot: p.name })}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl border ${form.selectedPilot === p.name ? "border-primary bg-secondary" : "border-border"}`}>
                    <User className="w-4 h-4 text-primary" />
                    <div className="flex-1 text-left">
                      <p className="text-xs font-medium text-foreground">{p.name}</p>
                      <p className="text-[10px] text-muted-foreground">★ {p.rating} · {p.distanceKm} km · {p.subscriptionTier}</p>
                    </div>
                    {form.selectedPilot === p.name && <CheckCircle className="w-4 h-4 text-primary" />}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-muted rounded-xl px-3 py-2.5 text-xs text-muted-foreground">
              Pilot will be <strong className="text-foreground">auto-assigned</strong> based on rating, subscription, availability & distance. Upgrade to Premium to choose your pilot.
            </div>
          )}

          <div>
            <label className="text-xs font-medium text-muted-foreground mb-2 block">Service Type *</label>
            <div className="grid grid-cols-2 gap-2">
              {serviceOptions.map((s) => (
                <button key={s.label} onClick={() => setForm({ ...form, service: s.label })}
                  className={`relative overflow-hidden rounded-xl border transition-all ${form.service === s.label ? "border-primary ring-2 ring-primary/30" : "border-border"}`}>
                  <img src={s.img} alt={s.label} className="w-full h-16 object-cover" />
                  <div className={`absolute inset-0 flex items-end p-2 ${form.service === s.label ? "bg-primary/60" : "bg-foreground/30"}`}>
                    <span className="text-white text-xs font-medium leading-tight">{s.label}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
              <span className="flex items-center gap-1.5"><Droplet className="w-3.5 h-3.5 text-sky-500" /> Chemical / Fertilizer Quantity (Litres)</span>
            </label>
            <div className="flex items-center gap-2 bg-input-background rounded-xl px-3 py-2.5">
              <input type="number" placeholder="e.g. 50" value={form.quantity}
                onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                className="flex-1 bg-transparent outline-none text-sm text-foreground placeholder:text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Litres</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-primary" /> Date *</span>
              </label>
              <div className="flex items-center gap-2 bg-input-background rounded-xl px-3 py-2.5">
                <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })}
                  className="flex-1 bg-transparent outline-none text-xs text-foreground" />
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-primary" /> Time</span>
              </label>
              <div className="flex items-center gap-1.5 bg-input-background rounded-xl px-3 py-2">
                <input type="text" inputMode="numeric" maxLength={5} placeholder="08:30"
                  value={form.time.replace(/ AM| PM/, "")}
                  onChange={(e) => {
                    const ampm = form.time.endsWith("PM") ? " PM" : " AM";
                    let raw = e.target.value.replace(/[^0-9:]/g, "");
                    const digitsOnly = raw.replace(/:/g, "");
                    if (!raw.includes(":")) {
                      if (digitsOnly.length >= 3) raw = digitsOnly.slice(0, 2) + ":" + digitsOnly.slice(2, 4);
                      else if (digitsOnly.length === 2) raw = digitsOnly + ":";
                    }
                    if (raw.includes(":")) {
                      const [h, m] = raw.split(":");
                      raw = (h.length === 1 ? "0" + h : h.slice(0, 2)) + ":" + (m || "").slice(0, 2);
                    }
                    setForm({ ...form, time: raw + ampm });
                  }}
                  className="w-14 bg-transparent outline-none text-xs text-foreground text-center" />
                <div className="flex bg-border/40 rounded-lg overflow-hidden flex-shrink-0">
                  {(["AM", "PM"] as const).map((p) => (
                    <button key={p} type="button" onClick={() => setForm({ ...form, time: form.time.replace(/ AM| PM/, "") + ` ${p}` })}
                      className={`px-2 py-1 text-[10px] font-semibold transition-colors ${form.time.endsWith(p) ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-secondary"}`}>{p}</button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {selectedFarm && form.service && (
            <div className="bg-secondary rounded-xl px-4 py-3 flex justify-between items-center">
              <span className="text-xs text-muted-foreground">{needsQuote ? "Custom quote required" : "Estimated Cost"}</span>
              <span className="text-sm font-semibold text-primary">{needsQuote ? ">50 acres" : `₹${estimatedCost.toLocaleString()}`}</span>
            </div>
          )}

          <button onClick={() => setStep("summary")} disabled={!form.farm || !form.service || !form.date || (isPremium && !form.selectedPilot && !needsQuote)}
            className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground rounded-xl py-3 text-sm font-medium disabled:opacity-40 hover:opacity-90 transition-opacity">
            Review Booking <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
