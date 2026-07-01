import { useState } from "react";
import { Search, Plus, Edit2, Eye, Trash2, Check, X, ChevronDown, ArrowLeft, Cpu, User, Phone, MapPin, Calendar, DollarSign, CreditCard, Package } from "lucide-react";
import { useAgriStore, updateInventoryStock, acceptAgriRequest, declineAgriRequest } from "../shared/agriInputsStore";

// ── Types ────────────────────────────────────────────────────────────
type DroneCategory = "Agriculture" | "Survey" | "Inspection" | "Cinematic";
type DroneStatus = "Available" | "Booked" | "Under Maintenance" | "Damaged" | "Offline";
type RentDrone = {
  id: number; name: string; model: string; reg: string; price: number;
  status: DroneStatus; capacity: string; category: DroneCategory;
  maxRentalDays: number; maintenanceLog: { date: string; note: string }[];
};
type SellDrone = { id: number; name: string; model: string; condition: string; price: number; desc: string; };

const statusColor: Record<DroneStatus, string> = {
  Available:          "bg-secondary text-primary",
  Booked:             "bg-amber-100 text-amber-700",
  "Under Maintenance":"bg-orange-100 text-orange-700",
  Damaged:            "bg-red-100 text-red-700",
  Offline:            "bg-muted text-muted-foreground",
};

const initialRentDrones: RentDrone[] = [
  { id: 1, name: "AgriStar X500", model: "DJI Agras T40", reg: "MH-UAV-2024-001", price: 2400, status: "Available", capacity: "40L", category: "Agriculture", maxRentalDays: 30, maintenanceLog: [{ date: "Jun 1, 2026", note: "Propeller replacement" }] },
  { id: 2, name: "CropFlyer Pro", model: "XAG P100", reg: "MH-UAV-2024-002", price: 1800, status: "Booked", capacity: "30L", category: "Agriculture", maxRentalDays: 14, maintenanceLog: [] },
  { id: 3, name: "SurveyDrone HD", model: "DJI M300", reg: "MH-UAV-2024-003", price: 3500, status: "Available", capacity: "N/A", category: "Survey", maxRentalDays: 30, maintenanceLog: [{ date: "May 20, 2026", note: "Camera calibration" }] },
  { id: 4, name: "InspectPro", model: "Skydio 2+", reg: "MH-UAV-2024-004", price: 2800, status: "Under Maintenance", capacity: "N/A", category: "Inspection", maxRentalDays: 7, maintenanceLog: [{ date: "Jun 10, 2026", note: "Battery health check" }] },
];

const initialSellDrones: SellDrone[] = [
  { id: 1, name: "AgriStar X200",  model: "DJI Agras T10",  condition: "Good", price: 85000, desc: "2 years old, well maintained, comes with 2 batteries." },
  { id: 2, name: "OldFlyer 4L",   model: "XAG V40",        condition: "Fair", price: 55000, desc: "3 years old, minor wear, new propellers installed." },
];

const pendingRequests = [
  { id: "RQ-301", pilot: "Arjun Singh",  exp: "3 yrs", purpose: "Wheat spray",       acres: 12, dates: "Jun 14–15", phone: "+91 98765 43211" },
  { id: "RQ-302", pilot: "Deepak Mehta", exp: "4 yrs", purpose: "Fertilizer – Rice", acres: 20, dates: "Jun 18",    phone: "+91 97003 44221" },
];

const buyerRequests = [
  { id: "BQ-101", buyer: "Suresh Agri Co.",   phone: "+91 94832 11209", offer: 80000, droneId: 1, message: "Interested in bulk purchase. Can discuss price." },
  { id: "BQ-102", buyer: "Ramesh Farms Ltd.", phone: "+91 90011 77332", offer: 52000, droneId: 2, message: "Ready to pay in full. Available this week." },
];

const agriTypeLabel: Record<string, string> = { pesticide: "Pesticide", fertilizer: "Fertilizer", chemical: "Chemical" };

function AgriInputsPanel() {
  const { inventory, requests } = useAgriStore();
  const [editingStock, setEditingStock] = useState<Record<string, string>>({});
  const pending = requests.filter((r) => r.status === "pending");

  const saveStock = (id: string) => {
    const val = parseInt(editingStock[id], 10);
    if (!isNaN(val)) updateInventoryStock(id, val);
    setEditingStock((p) => { const n = { ...p }; delete n[id]; return n; });
  };

  return (
    <div className="space-y-5">
      <div className="bg-secondary rounded-xl p-3 flex items-center gap-2">
        <Package className="w-4 h-4 text-primary" />
        <p className="text-xs text-muted-foreground">Manage available stock of pesticides, fertilizers & chemicals</p>
      </div>

      {pending.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Pilot Purchase Requests</p>
          {pending.map((req) => (
            <div key={req.id} className="bg-card border border-border rounded-2xl p-4 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-medium text-foreground">{req.pilotName}</p>
                  <p className="text-xs text-muted-foreground font-mono">{req.id} · {req.date}</p>
                </div>
                <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">Pending</span>
              </div>
              <div className="bg-secondary rounded-xl p-3 text-xs space-y-1">
                <div className="flex justify-between"><span className="text-muted-foreground">Product</span><span className="text-foreground font-medium">{req.brand}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Quantity</span><span className="text-foreground">{req.quantity} {req.unit}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Amount</span><span className="text-primary font-semibold">₹{req.amount.toLocaleString()}</span></div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => declineAgriRequest(req.id)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 border border-destructive/30 rounded-xl text-xs text-destructive hover:bg-destructive/5">
                  <X className="w-3.5 h-3.5" /> Decline
                </button>
                <button onClick={() => acceptAgriRequest(req.id)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-primary text-primary-foreground rounded-xl text-xs font-medium hover:opacity-90">
                  <Check className="w-3.5 h-3.5" /> Accept
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="space-y-2">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Available Stock</p>
        {inventory.map((item) => (
          <div key={item.id} className="bg-card border border-border rounded-2xl p-4">
            <div className="flex items-start justify-between mb-2">
              <div>
                <p className="text-sm font-medium text-foreground">{item.brand}</p>
                <p className="text-[10px] text-muted-foreground">{agriTypeLabel[item.type]} · ₹{item.pricePerUnit}/{item.unit}</p>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full ${item.stock > 20 ? "bg-secondary text-primary" : item.stock > 0 ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700"}`}>
                {item.stock > 0 ? `${item.stock} ${item.unit} left` : "Out of stock"}
              </span>
            </div>
            <div className="flex gap-2 items-center">
              <input
                type="number"
                min={0}
                placeholder={String(item.stock)}
                value={editingStock[item.id] ?? ""}
                onChange={(e) => setEditingStock({ ...editingStock, [item.id]: e.target.value.replace(/\D/g, "") })}
                className="flex-1 bg-input-background rounded-xl px-3 py-2 text-xs text-foreground outline-none focus:ring-1 focus:ring-primary"
              />
              <button
                onClick={() => saveStock(item.id)}
                disabled={editingStock[item.id] === undefined || editingStock[item.id] === ""}
                className="px-3 py-2 bg-primary text-primary-foreground rounded-xl text-xs font-medium disabled:opacity-40"
              >
                Update
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Reusable SelectField ──────────────────────────────────────────────
function SelectField({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <label className="text-xs text-muted-foreground mb-1 block">{label}</label>
      <button type="button" onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between bg-input-background rounded-xl px-3 py-2.5 text-sm text-foreground">
        <span className={value ? "text-foreground" : "text-muted-foreground"}>{value || `Select…`}</span>
        <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="absolute z-30 top-full left-0 right-0 mt-1 bg-card border border-border rounded-xl shadow-lg max-h-40 overflow-y-auto">
          {options.map((opt) => (
            <button key={opt} type="button" onClick={() => { onChange(opt); setOpen(false); }}
              className={`w-full flex items-center justify-between px-4 py-2.5 text-sm hover:bg-secondary text-left ${value === opt ? "text-primary font-medium" : "text-foreground"}`}>
              {opt} {value === opt && <Check className="w-3.5 h-3.5 text-primary" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Add / Edit Rent Drone form ────────────────────────────────────────
function RentDroneForm({ drone, onSave, onCancel }: { drone?: Partial<RentDrone>; onSave: (d: RentDrone) => void; onCancel: () => void }) {
  const [data, setData] = useState({
    name: drone?.name || "", model: drone?.model || "", reg: drone?.reg || "",
    price: drone?.price?.toString() || "", status: drone?.status || "Available",
    capacity: drone?.capacity || "", category: drone?.category || "Agriculture",
    maxRentalDays: drone?.maxRentalDays?.toString() || "30",
  });
  return (
    <div className="bg-card border border-primary/30 rounded-2xl p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-foreground">{drone?.name ? "Edit Drone" : "Add Drone for Rent"}</h4>
        <button onClick={onCancel}><X className="w-4 h-4 text-muted-foreground" /></button>
      </div>
      {[["Drone Name","name","text"],["Model","model","text"],["Registration No.","reg","text"],["Price per Day (₹)","price","number"],["Tank Capacity","capacity","text"],["Max Rental Days (max 30)","maxRentalDays","number"]].map(([l, k, t]) => (
        <div key={k}>
          <label className="text-xs text-muted-foreground mb-1 block">{l}</label>
          <input type={t} value={data[k as keyof typeof data]} placeholder={`Enter ${l.toLowerCase()}`}
            max={k === "maxRentalDays" ? 30 : undefined}
            onChange={(e) => setData({ ...data, [k]: e.target.value })}
            className="w-full bg-input-background rounded-xl px-3 py-2.5 text-sm text-foreground outline-none focus:ring-1 focus:ring-primary" />
        </div>
      ))}
      <SelectField label="Category" value={data.category} options={["Agriculture","Survey","Inspection","Cinematic"]} onChange={(v) => setData({ ...data, category: v as DroneCategory })} />
      <SelectField label="Status" value={data.status} options={["Available","Booked","Under Maintenance","Damaged","Offline"]} onChange={(v) => setData({ ...data, status: v as DroneStatus })} />
      <div className="flex gap-2">
        <button onClick={onCancel} className="flex-1 border border-border rounded-xl py-2.5 text-xs text-foreground hover:bg-secondary">Cancel</button>
        <button onClick={() => data.name && onSave({ ...data, price: parseInt(data.price, 10) || 0, maxRentalDays: Math.min(30, parseInt(data.maxRentalDays, 10) || 30), maintenanceLog: drone?.maintenanceLog || [] } as RentDrone)} disabled={!data.name}
          className="flex-1 bg-primary text-primary-foreground rounded-xl py-2.5 text-xs font-medium disabled:opacity-40">Save</button>
      </div>
    </div>
  );
}

// ── Add / Edit Sell Drone form ────────────────────────────────────────
function SellDroneForm({ drone, onSave, onCancel }: { drone?: Partial<SellDrone>; onSave: (d: any) => void; onCancel: () => void }) {
  const [data, setData] = useState({ name: drone?.name || "", model: drone?.model || "", condition: drone?.condition || "", price: drone?.price?.toString() || "", desc: drone?.desc || "" });
  return (
    <div className="bg-card border border-primary/30 rounded-2xl p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-foreground">{drone?.name ? "Edit Listing" : "Add Drone for Sale"}</h4>
        <button onClick={onCancel}><X className="w-4 h-4 text-muted-foreground" /></button>
      </div>
      {[["Drone Name","name","text"],["Model","model","text"],["Selling Price (₹)","price","number"]].map(([l, k, t]) => (
        <div key={k}>
          <label className="text-xs text-muted-foreground mb-1 block">{l}</label>
          <input type={t} value={data[k as keyof typeof data]} placeholder={`Enter ${l.toLowerCase()}`}
            onChange={(e) => setData({ ...data, [k]: e.target.value })}
            className="w-full bg-input-background rounded-xl px-3 py-2.5 text-sm text-foreground outline-none focus:ring-1 focus:ring-primary" />
        </div>
      ))}
      <SelectField label="Condition" value={data.condition} options={["New","Excellent","Good","Fair","For Parts"]} onChange={(v) => setData({ ...data, condition: v })} />
      <div>
        <label className="text-xs text-muted-foreground mb-1 block">Description</label>
        <textarea value={data.desc} onChange={(e) => setData({ ...data, desc: e.target.value })} rows={2}
          className="w-full bg-input-background rounded-xl px-3 py-2.5 text-sm text-foreground outline-none resize-none" placeholder="Brief description of drone condition…" />
      </div>
      <div className="flex gap-2">
        <button onClick={onCancel} className="flex-1 border border-border rounded-xl py-2.5 text-xs text-foreground hover:bg-secondary">Cancel</button>
        <button onClick={() => data.name && onSave(data)} disabled={!data.name}
          className="flex-1 bg-primary text-primary-foreground rounded-xl py-2.5 text-xs font-medium disabled:opacity-40">Save Listing</button>
      </div>
    </div>
  );
}

// ── Requests detail panel ─────────────────────────────────────────────
function RequestsPanel({ drone, onClose }: { drone: RentDrone; onClose: () => void }) {
  const [reqs, setReqs] = useState(pendingRequests);
  return (
    <div className="space-y-4 mb-6">
      <button onClick={onClose} className="flex items-center gap-2 text-muted-foreground">
        <ArrowLeft className="w-4 h-4" /><span className="text-sm">Back to drones</span>
      </button>
      <div className="bg-secondary rounded-2xl p-4">
        <p className="text-sm font-semibold text-foreground">{drone.name}</p>
        <p className="text-xs text-muted-foreground">{drone.model} · {drone.reg}</p>
      </div>
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Pending Rental Requests</p>
      {reqs.length === 0 ? (
        <div className="bg-card border border-border rounded-2xl p-6 text-center"><p className="text-sm text-muted-foreground">No pending requests</p></div>
      ) : (
        reqs.map((req) => (
          <div key={req.id} className="bg-card border border-border rounded-2xl p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center text-primary-foreground font-semibold text-sm">{req.pilot[0]}</div>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">{req.pilot}</p>
                <p className="text-xs text-muted-foreground">{req.exp} experience</p>
              </div>
              <span className="text-xs font-mono text-muted-foreground">{req.id}</span>
            </div>
            <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
              <div><span className="text-muted-foreground">Purpose</span><p className="text-foreground font-medium">{req.purpose}</p></div>
              <div><span className="text-muted-foreground">Work Load</span><p className="text-foreground font-medium">{req.acres} acres</p></div>
              <div><span className="text-muted-foreground">Dates</span><p className="text-foreground font-medium">{req.dates}</p></div>
              <div><span className="text-muted-foreground">Phone</span><p className="text-foreground font-medium">{req.phone}</p></div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setReqs(reqs.filter((r) => r.id !== req.id))}
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 border border-destructive/20 rounded-xl text-xs text-destructive hover:bg-destructive/5">
                <X className="w-3.5 h-3.5" /> Decline
              </button>
              <button onClick={() => setReqs(reqs.filter((r) => r.id !== req.id))}
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-primary text-primary-foreground rounded-xl text-xs hover:opacity-90">
                <Check className="w-3.5 h-3.5" /> Accept
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

// ── Buyers detail panel ───────────────────────────────────────────────
function BuyersPanel({ drone, onClose }: { drone: SellDrone; onClose: () => void }) {
  const [buyers, setBuyers] = useState(buyerRequests.filter((b) => b.droneId === drone.id));
  return (
    <div className="space-y-4 mb-6">
      <button onClick={onClose} className="flex items-center gap-2 text-muted-foreground">
        <ArrowLeft className="w-4 h-4" /><span className="text-sm">Back to listings</span>
      </button>
      <div className="bg-secondary rounded-2xl p-4">
        <p className="text-sm font-semibold text-foreground">{drone.name}</p>
        <p className="text-xs text-muted-foreground">{drone.model} · Listed at ₹{drone.price.toLocaleString()}</p>
      </div>
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Buyer Requests</p>
      {buyers.length === 0 ? (
        <div className="bg-card border border-border rounded-2xl p-6 text-center"><p className="text-sm text-muted-foreground">No buyer requests yet</p></div>
      ) : (
        buyers.map((b) => (
          <div key={b.id} className="bg-card border border-border rounded-2xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center text-primary-foreground font-semibold text-sm">{b.buyer[0]}</div>
                <div>
                  <p className="text-sm font-medium text-foreground">{b.buyer}</p>
                  <p className="text-xs text-muted-foreground">{b.phone}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Offer</p>
                <p className="text-sm font-semibold text-primary">₹{b.offer.toLocaleString()}</p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground italic mb-3">"{b.message}"</p>
            <div className="flex gap-2">
              <button onClick={() => setBuyers(buyers.filter((x) => x.id !== b.id))}
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 border border-border rounded-xl text-xs text-foreground hover:bg-secondary">
                <X className="w-3.5 h-3.5" /> Decline
              </button>
              <button className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-secondary border border-primary/30 rounded-xl text-xs text-primary font-medium hover:bg-primary hover:text-primary-foreground">
                <Phone className="w-3.5 h-3.5" /> Call Buyer
              </button>
              <button onClick={() => setBuyers(buyers.filter((x) => x.id !== b.id))}
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-primary text-primary-foreground rounded-xl text-xs hover:opacity-90">
                <Check className="w-3.5 h-3.5" /> Accept
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

// ── Main DroneModule ──────────────────────────────────────────────────
export function DroneModule() {
  const [activeTab,    setActiveTab]    = useState<"rent"|"sell"|"inputs">("rent");
  const [statusFilter, setStatusFilter] = useState("All");
  const [search,       setSearch]       = useState("");
  const [rentDrones,   setRentDrones]   = useState<RentDrone[]>(initialRentDrones);
  const [sellDrones,   setSellDrones]   = useState<SellDrone[]>(initialSellDrones);
  const [showAddRent,  setShowAddRent]  = useState(false);
  const [showAddSell,  setShowAddSell]  = useState(false);
  const [editRentId,   setEditRentId]   = useState<number|null>(null);
  const [editSellId,   setEditSellId]   = useState<number|null>(null);
  const [viewRequests, setViewRequests] = useState<RentDrone|null>(null);
  const [viewBuyers,   setViewBuyers]   = useState<SellDrone|null>(null);
  const [confirmDelete, setConfirmDelete] = useState<number|null>(null);

  const filteredRent = rentDrones.filter((d) => {
    const matchSearch = !search || d.name.toLowerCase().includes(search.toLowerCase()) || d.model.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "All" || d.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const filteredSell = sellDrones.filter((d) =>
    !search || d.name.toLowerCase().includes(search.toLowerCase())
  );

  // Requests panel
  if (viewRequests) return (
    <div className="min-h-screen bg-background px-5 pt-12">
      <RequestsPanel drone={viewRequests} onClose={() => setViewRequests(null)} />
    </div>
  );
  // Buyers panel
  if (viewBuyers) return (
    <div className="min-h-screen bg-background px-5 pt-12">
      <BuyersPanel drone={viewBuyers} onClose={() => setViewBuyers(null)} />
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <div className="px-5 pt-12 pb-4">
        <h2 className="text-foreground font-bold">Drones</h2>
        <div className="flex items-center gap-2 mt-4 bg-card border border-border rounded-xl px-3 py-2.5">
          <Search className="w-4 h-4 text-muted-foreground flex-shrink-0" />
          <input placeholder={activeTab === "inputs" ? "Search agri-inputs…" : `Search ${activeTab === "rent" ? "rental" : "sale"} drones…`} value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-transparent outline-none text-sm text-foreground placeholder:text-muted-foreground" />
        </div>
      </div>

      {/* Tabs */}
      <div className="px-5 mb-4">
        <div className="flex bg-secondary rounded-xl p-1 gap-1 overflow-x-auto">
          {([
            { id: "rent" as const, label: "Rent Drone" },
            { id: "sell" as const, label: "Sell Drone" },
            { id: "inputs" as const, label: "Agri-Inputs" },
          ]).map((t) => (
            <button key={t.id} onClick={() => { setActiveTab(t.id); setStatusFilter("All"); setShowAddRent(false); setShowAddSell(false); }}
              className={`flex-1 min-w-[90px] py-2.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${activeTab === t.id ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"}`}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="px-5 pb-6 space-y-3">
        {/* ── Rent Drone ── */}
        {activeTab === "rent" && (
          <>
            {/* Status filters */}
            <div className="flex gap-2 overflow-x-auto pb-1">
              {["All","Available","Booked","Under Maintenance","Damaged","Offline"].map((s) => (
                <button key={s} onClick={() => setStatusFilter(s)}
                  className={`flex-shrink-0 text-xs px-3 py-1.5 rounded-xl border transition-colors whitespace-nowrap ${statusFilter === s ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border text-muted-foreground hover:bg-secondary"}`}>
                  {s}
                </button>
              ))}
            </div>

            {/* Add form or button */}
            {showAddRent ? (
              <RentDroneForm
                onSave={(d) => { setRentDrones([...rentDrones, { ...d, id: Date.now(), price: Number(d.price) }]); setShowAddRent(false); }}
                onCancel={() => setShowAddRent(false)}
              />
            ) : (
              <button onClick={() => setShowAddRent(true)}
                className="w-full flex items-center justify-center gap-2 py-3 border border-dashed border-primary/40 rounded-2xl text-sm text-primary hover:bg-secondary/30">
                <Plus className="w-4 h-4" /> Add Drone for Rent
              </button>
            )}

            {/* Drone cards */}
            {filteredRent.map((drone) => (
              <div key={drone.id}>
                {editRentId === drone.id ? (
                  <RentDroneForm drone={drone}
                    onSave={(d) => { setRentDrones(rentDrones.map((r) => r.id === drone.id ? { ...r, ...d, price: Number(d.price) } : r)); setEditRentId(null); }}
                    onCancel={() => setEditRentId(null)}
                  />
                ) : (
                  <div className="bg-card border border-border rounded-2xl p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="text-sm font-semibold text-foreground">{drone.name}</p>
                        <p className="text-xs text-muted-foreground">{drone.model}</p>
                        <p className="text-xs font-mono text-muted-foreground mt-0.5">{drone.reg}</p>
                      </div>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColor[drone.status]}`}>{drone.status}</span>
                    </div>
                    <div className="flex gap-2 mb-2">
                      <span className="text-[10px] px-2 py-0.5 bg-muted rounded-full text-muted-foreground">{drone.category}</span>
                      <span className="text-[10px] px-2 py-0.5 bg-muted rounded-full text-muted-foreground">Max {drone.maxRentalDays}d rental</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      <div className="bg-secondary rounded-xl p-2 text-center">
                        <p className="text-xs font-medium text-foreground">{drone.capacity}</p>
                        <p className="text-[10px] text-muted-foreground">Tank</p>
                      </div>
                      <div className="bg-secondary rounded-xl p-2 text-center">
                        <p className="text-xs font-semibold text-primary">₹{drone.price.toLocaleString()}/day</p>
                        <p className="text-[10px] text-muted-foreground">Rental</p>
                      </div>
                    </div>
                    {drone.maintenanceLog.length > 0 && (
                      <div className="mb-3 bg-muted rounded-xl p-2">
                        <p className="text-[10px] font-medium text-muted-foreground mb-1">Maintenance Log</p>
                        {drone.maintenanceLog.slice(-2).map((log, i) => (
                          <p key={i} className="text-[10px] text-foreground">{log.date}: {log.note}</p>
                        ))}
                      </div>
                    )}
                    <div className="flex gap-2">
                      <button onClick={() => setEditRentId(drone.id)}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 border border-border rounded-xl text-xs text-foreground hover:bg-secondary">
                        <Edit2 className="w-3 h-3" /> Edit
                      </button>
                      <button onClick={() => setViewRequests(drone)}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-primary text-primary-foreground rounded-xl text-xs hover:opacity-90">
                        <Eye className="w-3 h-3" /> Requests
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </>
        )}

        {/* ── Sell Drone ── */}
        {activeTab === "sell" && (
          <>
            {showAddSell ? (
              <SellDroneForm
                onSave={(d) => { setSellDrones([...sellDrones, { ...d, id: Date.now(), price: Number(d.price) }]); setShowAddSell(false); }}
                onCancel={() => setShowAddSell(false)}
              />
            ) : (
              <button onClick={() => setShowAddSell(true)}
                className="w-full flex items-center justify-center gap-2 py-3 border border-dashed border-primary/40 rounded-2xl text-sm text-primary hover:bg-secondary/30">
                <Plus className="w-4 h-4" /> Add Drone for Sale
              </button>
            )}

            {filteredSell.map((drone) => (
              <div key={drone.id}>
                {editSellId === drone.id ? (
                  <SellDroneForm drone={drone}
                    onSave={(d) => { setSellDrones(sellDrones.map((s) => s.id === drone.id ? { ...s, ...d, price: Number(d.price) } : s)); setEditSellId(null); }}
                    onCancel={() => setEditSellId(null)}
                  />
                ) : confirmDelete === drone.id ? (
                  <div className="bg-card border border-destructive/30 rounded-2xl p-4 space-y-3">
                    <p className="text-sm font-medium text-foreground">Remove "{drone.name}"?</p>
                    <p className="text-xs text-muted-foreground">This will delete the listing permanently.</p>
                    <div className="flex gap-2">
                      <button onClick={() => setConfirmDelete(null)} className="flex-1 border border-border rounded-xl py-2.5 text-xs text-foreground hover:bg-secondary">Cancel</button>
                      <button onClick={() => { setSellDrones(sellDrones.filter((s) => s.id !== drone.id)); setConfirmDelete(null); }}
                        className="flex-1 bg-destructive text-destructive-foreground rounded-xl py-2.5 text-xs font-medium">Remove</button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-card border border-border rounded-2xl p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="text-sm font-semibold text-foreground">{drone.name}</p>
                        <p className="text-xs text-muted-foreground">{drone.model}</p>
                      </div>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-secondary text-foreground font-medium">{drone.condition}</span>
                    </div>
                    {drone.desc && <p className="text-xs text-muted-foreground italic mb-3">"{drone.desc}"</p>}
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs text-muted-foreground">Selling Price</span>
                      <span className="text-sm font-semibold text-primary">₹{drone.price.toLocaleString()}</span>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => setEditSellId(drone.id)}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 border border-border rounded-xl text-xs text-foreground hover:bg-secondary">
                        <Edit2 className="w-3 h-3" /> Edit
                      </button>
                      <button onClick={() => setConfirmDelete(drone.id)}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 border border-destructive/20 text-destructive rounded-xl text-xs hover:bg-destructive/5">
                        <Trash2 className="w-3 h-3" /> Remove
                      </button>
                      <button onClick={() => setViewBuyers(drone)}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-primary text-primary-foreground rounded-xl text-xs hover:opacity-90">
                        <Eye className="w-3 h-3" /> Buyers
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </>
        )}

        {/* ── Pesticides & Fertilizers ── */}
        {activeTab === "inputs" && <AgriInputsPanel />}
      </div>
    </div>
  );
}
