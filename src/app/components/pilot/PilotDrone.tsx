import { useState } from "react";
import { Search, X, Check, MapPin, Star, Cpu, User, ChevronLeft, ChevronRight, CreditCard, Clock, AlertTriangle } from "lucide-react";
import { ADVANCE_PERCENT, DRONE_RENTAL_FREE_CANCEL_MS, DRONE_RENTAL_MIN_HOURS, DRONE_RENTAL_MAX_DAYS } from "../shared/dgcaUtils";

const nearbyDrones = [
  {
    id: "D101", model: "DJI Agras T40", name: "AgriStar X500",
    owner: "Ramesh Drone Rentals", ownerAddress: "Nagpur, MH",
    capacity: "40L tank", flightTime: "22 min", pricePerDay: 2400,
    rating: 4.8, distance: 3.2, available: true,
    // pre-existing booked date ranges (vendor-booked)
    bookedDates: ["2026-06-14", "2026-06-15", "2026-06-16", "2026-06-20"],
  },
  {
    id: "D102", model: "XAG P100 Pro", name: "CropFlyer Pro",
    owner: "Singh Agri Tech", ownerAddress: "Wardha, MH",
    capacity: "50L tank", flightTime: "25 min", pricePerDay: 3000,
    rating: 4.9, distance: 7.5, available: true,
    bookedDates: ["2026-06-18", "2026-06-19"],
  },
  {
    id: "D103", model: "DJI Agras T20P", name: "SprayMaster 8L",
    owner: "TechDrone Solutions", ownerAddress: "Nagpur, MH",
    capacity: "20L tank", flightTime: "18 min", pricePerDay: 1800,
    rating: 4.6, distance: 5.1, available: false,
    bookedDates: ["2026-06-11", "2026-06-12", "2026-06-13", "2026-06-14", "2026-06-15"],
  },
];

const myDroneRequests = [
  { id: "RQ-201", pilot: "Vikram Nair", experience: "2 years", purpose: "Pesticide spray – Paddy", acres: 8, date: "Jun 14, 2026", status: "pending" },
  { id: "RQ-202", pilot: "Deepak Mehta", experience: "4 years", purpose: "Fertilizer – Wheat", acres: 15, date: "Jun 16, 2026", status: "pending" },
];

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const DAYS   = ["Su","Mo","Tu","We","Th","Fr","Sa"];

function getDaysInMonth(y: number, m: number) { return new Date(y, m + 1, 0).getDate(); }
function getFirstDay(y: number, m: number)    { return new Date(y, m, 1).getDay(); }
function dateStr(y: number, m: number, d: number) {
  return `${y}-${String(m+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
}

function DroneCalendar({
  existingBooked, myBooked,
  fromDate, toDate,
  onFromChange, onToChange,
}: {
  existingBooked: string[];
  myBooked: string[];
  fromDate: string; toDate: string;
  onFromChange: (d: string) => void;
  onToChange:   (d: string) => void;
}) {
  const today = new Date();
  const [year,  setYear]  = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay    = getFirstDay(year, month);

  const prevM = () => { if (month === 0) { setMonth(11); setYear(y => y-1); } else setMonth(m => m-1); };
  const nextM = () => { if (month === 11) { setMonth(0); setYear(y => y+1); } else setMonth(m => m+1); };

  const handleDayClick = (d: number) => {
    const s = dateStr(year, month, d);
    if (existingBooked.includes(s) || myBooked.includes(s)) return; // can't select booked
    if (!fromDate || (fromDate && toDate)) {
      onFromChange(s); onToChange("");
    } else {
      if (s < fromDate) { onFromChange(s); }
      else              { onToChange(s); }
    }
  };

  const inRange = (d: number) => {
    if (!fromDate || !toDate) return false;
    const s = dateStr(year, month, d);
    return s > fromDate && s < toDate;
  };

  return (
    <div className="bg-secondary rounded-xl p-3">
      {/* Month nav */}
      <div className="flex items-center justify-between mb-3">
        <button onClick={prevM} className="w-7 h-7 bg-card border border-border rounded-lg flex items-center justify-center">
          <ChevronLeft className="w-3.5 h-3.5 text-foreground" />
        </button>
        <p className="text-xs font-semibold text-foreground">{MONTHS[month]} {year}</p>
        <button onClick={nextM} className="w-7 h-7 bg-card border border-border rounded-lg flex items-center justify-center">
          <ChevronRight className="w-3.5 h-3.5 text-foreground" />
        </button>
      </div>
      {/* Day labels */}
      <div className="grid grid-cols-7 mb-1">
        {DAYS.map((d) => <div key={d} className="text-center text-[9px] font-medium text-muted-foreground py-1">{d}</div>)}
      </div>
      {/* Days */}
      <div className="grid grid-cols-7 gap-y-0.5">
        {[...Array(firstDay)].map((_,i) => <div key={`e${i}`} />)}
        {[...Array(daysInMonth)].map((_,i) => {
          const day = i+1;
          const s   = dateStr(year, month, day);
          const isExBooked = existingBooked.includes(s);
          const isMyBooked = myBooked.includes(s);
          const isFrom     = s === fromDate;
          const isTo       = s === toDate;
          const isInRange  = inRange(day);
          const isToday    = year === today.getFullYear() && month === today.getMonth() && day === today.getDate();

          return (
            <button
              key={day}
              disabled={isExBooked || isMyBooked}
              onClick={() => handleDayClick(day)}
              className={`h-7 w-full rounded-md text-[10px] font-medium transition-colors
                ${isExBooked ? "bg-red-100 text-red-600 cursor-not-allowed" : ""}
                ${isMyBooked ? "bg-red-500 text-white cursor-not-allowed" : ""}
                ${(isFrom || isTo) && !isMyBooked && !isExBooked ? "bg-primary text-primary-foreground" : ""}
                ${isInRange && !isMyBooked && !isExBooked ? "bg-primary/20 text-primary" : ""}
                ${isToday && !isFrom && !isTo && !isInRange && !isExBooked && !isMyBooked ? "ring-1 ring-primary text-foreground" : ""}
                ${!isExBooked && !isMyBooked && !isFrom && !isTo && !isInRange && !isToday ? "text-foreground hover:bg-card" : ""}
              `}
            >
              {day}
            </button>
          );
        })}
      </div>
      {/* Legend */}
      <div className="flex items-center gap-3 mt-3 pt-2 border-t border-border flex-wrap">
        <div className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-red-100 border border-red-300" /><span className="text-[9px] text-muted-foreground">Already Booked</span></div>
        <div className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-red-500" /><span className="text-[9px] text-muted-foreground">My Booking</span></div>
        <div className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-primary" /><span className="text-[9px] text-muted-foreground">Selected</span></div>
      </div>
    </div>
  );
}

export function PilotDrone() {
  const [activeTab,      setActiveTab]      = useState<"rent"|"myDrone">("rent");
  const [search,         setSearch]         = useState("");
  const [bookingDrone,   setBookingDrone]   = useState<(typeof nearbyDrones)[0] | null>(null);
  const [myBookedDates,  setMyBookedDates]  = useState<Record<string, string[]>>({}); // droneId → dates[]
  const [fromDate,       setFromDate]       = useState("");
  const [toDate,         setToDate]         = useState("");
  const [workType,       setWorkType]       = useState("");
  const [acres,          setAcres]          = useState("");
  const [bookingConfirmed, setBookingConfirmed] = useState<string|null>(null);
  const [confirmedAt, setConfirmedAt] = useState<number | null>(null);
  const [advancePaid, setAdvancePaid] = useState(false);
  const [payingAdvance, setPayingAdvance] = useState(false);
  const [requests,       setRequests]       = useState(myDroneRequests);

  const filtered = nearbyDrones.filter((d) =>
    !search || d.model.toLowerCase().includes(search.toLowerCase()) || d.name.toLowerCase().includes(search.toLowerCase())
  );

  // Parse date string using LOCAL components to avoid UTC timezone shift
  const parseLocal = (s: string) => { const [y,m,d] = s.split("-").map(Number); return new Date(y, m-1, d); };
  const localStr   = (d: Date)   => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;

  const buildRange = (from: string, to: string): string[] => {
    if (!from) return [];
    const dates: string[] = [];
    const cur  = parseLocal(from);
    const last = parseLocal(to || from);
    while (cur <= last) {
      dates.push(localStr(cur));
      cur.setDate(cur.getDate() + 1);
    }
    return dates;
  };

  const days = fromDate && toDate
    ? Math.max(1, Math.round((parseLocal(toDate).getTime() - parseLocal(fromDate).getTime()) / 86400000) + 1)
    : fromDate ? 1 : 0;

  const confirmBooking = () => {
    if (!bookingDrone || !fromDate || !workType) return;
    if (days > DRONE_RENTAL_MAX_DAYS) return;
    const range = buildRange(fromDate, toDate || fromDate);
    setMyBookedDates(prev => ({ ...prev, [bookingDrone.id]: [...(prev[bookingDrone.id] || []), ...range] }));
    setBookingConfirmed(bookingDrone.id);
    setConfirmedAt(Date.now());
    setAdvancePaid(false);
  };

  const payAdvance = () => {
    setPayingAdvance(true);
    setTimeout(() => { setAdvancePaid(true); setPayingAdvance(false); }, 1000);
  };

  const cancelRental = () => {
    if (!confirmedAt || Date.now() - confirmedAt > DRONE_RENTAL_FREE_CANCEL_MS) {
      alert("Free cancellation window expired. Repeated cancellations affect your rating.");
    }
    resetForm();
  };

  const resetForm = () => {
    setBookingDrone(null); setBookingConfirmed(null); setConfirmedAt(null);
    setAdvancePaid(false); setPayingAdvance(false);
    setFromDate(""); setToDate(""); setWorkType(""); setAcres("");
  };

  const totalCost = bookingDrone ? days * bookingDrone.pricePerDay : 0;
  const advanceAmount = Math.round(totalCost * ADVANCE_PERCENT);
  const canFreeCancel = confirmedAt ? Date.now() - confirmedAt <= DRONE_RENTAL_FREE_CANCEL_MS : false;
  const cancelMinsLeft = confirmedAt ? Math.max(0, Math.ceil((DRONE_RENTAL_FREE_CANCEL_MS - (Date.now() - confirmedAt)) / 60000)) : 0;

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <div className="px-5 pt-12 pb-4">
        <h2 className="text-foreground">Drone</h2>
        <div className="flex items-center gap-2 mt-4 bg-card border border-border rounded-xl px-3 py-2.5">
          <Search className="w-4 h-4 text-muted-foreground flex-shrink-0" />
          <input placeholder="Search drones…" value={search} onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-transparent outline-none text-sm text-foreground placeholder:text-muted-foreground" />
        </div>
      </div>

      <div className="px-5 mb-2">
        <div className="bg-secondary rounded-xl px-3 py-2 text-[10px] text-muted-foreground">
          Rental: min {DRONE_RENTAL_MIN_HOURS}h · max {DRONE_RENTAL_MAX_DAYS} days · 20% advance · 10-min free cancel
        </div>
      </div>

      <div className="px-5 mb-5">
        <div className="flex bg-secondary rounded-xl p-1 gap-1">
          {(["rent","myDrone"] as const).map((t) => (
            <button key={t} onClick={() => setActiveTab(t)}
              className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === t ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"}`}>
              {t === "rent" ? "Rent a Drone" : "Rent My Drone"}
            </button>
          ))}
        </div>
      </div>

      {/* ── Booking Modal ── */}
      {bookingDrone && (
        <div className="fixed inset-0 z-50 bg-foreground/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-background w-full max-w-sm rounded-3xl max-h-[92vh] overflow-y-auto shadow-2xl">
            <div className="flex justify-center pt-3 pb-1"><div className="w-10 h-1 bg-border rounded-full" /></div>
            <div className="flex items-center justify-between px-5 py-3 border-b border-border">
              <div>
                <h3 className="text-foreground font-medium">Book Drone</h3>
                <p className="text-xs text-muted-foreground">{bookingDrone.name} · {bookingDrone.model}</p>
              </div>
              <button onClick={resetForm} className="w-8 h-8 bg-secondary rounded-xl flex items-center justify-center">
                <X className="w-4 h-4 text-foreground" />
              </button>
            </div>

            <div className="px-5 py-5 space-y-4">
              {bookingConfirmed === bookingDrone.id ? (
                <div className="text-center py-4 space-y-3">
                  <div className="w-14 h-14 bg-secondary rounded-full flex items-center justify-center mx-auto">
                    <Check className="w-7 h-7 text-primary" />
                  </div>
                  <p className="text-foreground font-semibold">{advancePaid ? "Booking Confirmed!" : "Pay Advance to Confirm"}</p>
                  {!advancePaid && (
                    <button onClick={payAdvance} disabled={payingAdvance}
                      className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground rounded-xl py-3 text-sm font-medium disabled:opacity-60">
                      <CreditCard className="w-4 h-4" />
                      {payingAdvance ? "Processing…" : `Pay 20% Advance — ₹${advanceAmount.toLocaleString()}`}
                    </button>
                  )}
                  {canFreeCancel && (
                    <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl p-3 text-left">
                      <Clock className="w-4 h-4 text-amber-600 flex-shrink-0" />
                      <p className="text-xs text-amber-800">Free cancel within {cancelMinsLeft} min · repeated cancellations affect rating</p>
                    </div>
                  )}
                  <div className="bg-secondary rounded-xl p-3 text-left space-y-1.5 text-xs">
                    <div className="flex justify-between"><span className="text-muted-foreground">Drone</span><span className="text-foreground font-medium">{bookingDrone.name}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Duration</span><span className="text-foreground font-medium">{days} day{days !== 1 ? "s" : ""} (min 2h)</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Total</span><span className="text-primary font-semibold">₹{totalCost.toLocaleString()}</span></div>
                  </div>
                  {canFreeCancel && (
                    <button onClick={cancelRental} className="w-full border border-destructive/30 text-destructive rounded-xl py-2.5 text-xs">Cancel Booking (Free)</button>
                  )}
                  {!canFreeCancel && confirmedAt && (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground"><AlertTriangle className="w-3.5 h-3.5" /> 10-min free cancel window expired</div>
                  )}
                  <button onClick={resetForm} className="w-full bg-primary text-primary-foreground rounded-xl py-3 text-sm font-medium">Done</button>
                </div>
              ) : (
                <>
                  {/* Explicit From / To date inputs */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-muted-foreground mb-1.5 block">From Date *</label>
                      <input
                        type="date"
                        value={fromDate}
                        onChange={(e) => { setFromDate(e.target.value); if (toDate && e.target.value > toDate) setToDate(""); }}
                        className="w-full bg-input-background rounded-xl px-3 py-2.5 text-xs text-foreground outline-none focus:ring-1 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground mb-1.5 block">To Date</label>
                      <input
                        type="date"
                        value={toDate}
                        min={fromDate || undefined}
                        onChange={(e) => setToDate(e.target.value)}
                        className="w-full bg-input-background rounded-xl px-3 py-2.5 text-xs text-foreground outline-none focus:ring-1 focus:ring-primary"
                      />
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground -mt-1">Or tap dates on the calendar. Red = already booked.</p>

                  <DroneCalendar
                    existingBooked={bookingDrone.bookedDates}
                    myBooked={myBookedDates[bookingDrone.id] || []}
                    fromDate={fromDate} toDate={toDate}
                    onFromChange={setFromDate} onToChange={setToDate}
                  />

                  {fromDate && (
                    <div className="bg-secondary rounded-xl p-3 text-xs flex justify-between">
                      <span className="text-muted-foreground">{fromDate}{toDate ? ` → ${toDate}` : " (1 day)"}</span>
                      <span className="text-primary font-semibold">{days} day{days !== 1 ? "s" : ""} · ₹{(days * bookingDrone.pricePerDay).toLocaleString()}</span>
                    </div>
                  )}

                  <div>
                    <label className="text-xs text-muted-foreground mb-2 block">Work Type *</label>
                    <div className="grid grid-cols-2 gap-2">
                      {["Pesticide Spray","Fertilizer Spray","Seeding","Monitoring"].map((w) => (
                        <button key={w} onClick={() => setWorkType(w)}
                          className={`py-2.5 px-3 rounded-xl text-xs border transition-colors ${workType === w ? "border-primary bg-secondary text-primary font-medium" : "border-border text-muted-foreground hover:bg-secondary"}`}>
                          {w}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-muted-foreground mb-1.5 block">Work Load (Acres)</label>
                    <input type="number" placeholder="e.g. 15" value={acres} onChange={(e) => setAcres(e.target.value)}
                      className="w-full bg-input-background rounded-xl px-3 py-2.5 text-sm text-foreground outline-none" />
                  </div>

                  {days > DRONE_RENTAL_MAX_DAYS && (
                    <p className="text-xs text-destructive">Maximum rental period is {DRONE_RENTAL_MAX_DAYS} days</p>
                  )}

                  <div className="flex gap-3">
                    <button onClick={resetForm} className="flex-1 border border-border rounded-xl py-3 text-sm text-foreground hover:bg-secondary">Cancel</button>
                    <button onClick={confirmBooking} disabled={!fromDate || !workType || days > DRONE_RENTAL_MAX_DAYS}
                      className="flex-1 bg-primary text-primary-foreground rounded-xl py-3 text-sm font-medium disabled:opacity-40 hover:opacity-90">
                      Confirm Booking
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="px-5 pb-6 space-y-3">
        {activeTab === "rent" && filtered.map((drone) => (
          <div key={drone.id} className={`bg-card border rounded-2xl p-4 ${!drone.available ? "opacity-60" : "border-border"}`}>
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 bg-secondary rounded-xl flex items-center justify-center">
                  <Cpu className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{drone.name}</p>
                  <p className="text-xs text-muted-foreground">{drone.model}</p>
                </div>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${drone.available ? "bg-secondary text-primary" : "bg-muted text-muted-foreground"}`}>
                {drone.available ? "Available" : "Booked"}
              </span>
            </div>
            <div className="flex items-center gap-1.5 mb-3">
              <User className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="text-xs text-foreground font-medium">{drone.owner}</span>
              <span className="text-muted-foreground">·</span>
              <MapPin className="w-3 h-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">{drone.ownerAddress}</span>
            </div>
            <div className="grid grid-cols-3 gap-2 mb-3">
              <div className="bg-secondary rounded-xl p-2 text-center">
                <p className="text-xs font-medium text-foreground">{drone.capacity}</p>
                <p className="text-[10px] text-muted-foreground">Tank</p>
              </div>
              <div className="bg-secondary rounded-xl p-2 text-center">
                <div className="flex items-center justify-center gap-0.5">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  <p className="text-xs font-medium text-foreground">{drone.rating}</p>
                </div>
                <p className="text-[10px] text-muted-foreground">{drone.distance} km</p>
              </div>
              <div className="bg-secondary rounded-xl p-2 text-center">
                <p className="text-xs font-semibold text-primary">₹{drone.pricePerDay.toLocaleString()}</p>
                <p className="text-[10px] text-muted-foreground">/day</p>
              </div>
            </div>
            {(myBookedDates[drone.id]?.length || 0) > 0 && (
              <p className="text-xs text-red-600 mb-2">You have {myBookedDates[drone.id].length} day(s) booked</p>
            )}
            <button onClick={() => drone.available && setBookingDrone(drone)} disabled={!drone.available}
              className="w-full bg-primary text-primary-foreground rounded-xl py-2.5 text-sm font-medium disabled:opacity-40 hover:opacity-90">
              Book Drone
            </button>
          </div>
        ))}

        {activeTab === "myDrone" && requests.map((req) => (
          <div key={req.id} className={`bg-card border rounded-2xl p-4 ${req.status !== "pending" ? "opacity-60" : ""} border-border`}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono text-muted-foreground">{req.id}</span>
              {req.status !== "pending" && (
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${req.status === "accepted" ? "bg-secondary text-primary" : "bg-muted text-muted-foreground"}`}>
                  {req.status === "accepted" ? "Accepted" : "Declined"}
                </span>
              )}
            </div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-secondary rounded-xl flex items-center justify-center text-primary font-semibold text-sm">{req.pilot[0]}</div>
              <div>
                <p className="text-sm font-medium text-foreground">{req.pilot}</p>
                <p className="text-xs text-muted-foreground">{req.experience} experience</p>
              </div>
            </div>
            <div className="space-y-2 mb-3 text-xs">
              <div className="flex justify-between"><span className="text-muted-foreground">Purpose</span><span className="text-foreground font-medium">{req.purpose}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Work Load</span><span className="text-foreground font-medium">{req.acres} acres</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Requested</span><span className="text-foreground font-medium">{req.date}</span></div>
            </div>
            {req.status === "pending" && (
              <div className="flex gap-2">
                <button onClick={() => setRequests(requests.map((r) => r.id === req.id ? { ...r, status: "declined" } : r))}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 border border-destructive/20 rounded-xl text-xs text-destructive">
                  <X className="w-3.5 h-3.5" /> Decline
                </button>
                <button onClick={() => setRequests(requests.map((r) => r.id === req.id ? { ...r, status: "accepted" } : r))}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-primary text-primary-foreground rounded-xl text-xs">
                  <Check className="w-3.5 h-3.5" /> Accept
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
