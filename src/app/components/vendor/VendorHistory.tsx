import { useState } from "react";
import { Cpu, TrendingUp, Package, ArrowLeft, Phone, MapPin, Calendar, FileText, User, Check, Beaker } from "lucide-react";
import { useAgriStore } from "../shared/agriInputsStore";

const stats = [
  { label: "Total Rentals", value: "38", icon: <Cpu className="w-4 h-4" /> },
  { label: "Drone Sales",   value: "12", icon: <Package className="w-4 h-4" /> },
  { label: "Total Revenue", value: "₹2.1L", icon: <TrendingUp className="w-4 h-4" /> },
];

type RentalItem = { id: string; drone: string; model: string; pilot: string; phone: string; date: string; duration: string; purpose: string; acres: number; amount: number; status: string; };
type SaleItem   = { id: string; drone: string; model: string; condition: string; buyer: string; buyerPhone: string; buyerLocation: string; date: string; amount: number; };

const rentalHistory: RentalItem[] = [
  { id: "RNT-001", drone: "AgriStar X500",  model: "DJI Agras T40",  pilot: "Arjun Singh",  phone: "+91 98765 43211", date: "Jun 5, 2026",  duration: "2 days",  purpose: "Wheat pesticide spray",    acres: 12, amount: 4800,  status: "Completed" },
  { id: "RNT-002", drone: "SprayMaster 8L", model: "DJI Agras T20P", pilot: "Kiran Rao",    phone: "+91 94823 33221", date: "May 28, 2026", duration: "1 day",   purpose: "Fertilizer application",   acres: 8,  amount: 2000,  status: "Completed" },
  { id: "RNT-003", drone: "CropFlyer Pro",  model: "XAG P100",       pilot: "Vikram Nair",  phone: "+91 97003 21189", date: "May 22, 2026", duration: "3 days",  purpose: "Pesticide – Paddy",        acres: 20, amount: 5400,  status: "Completed" },
  { id: "RNT-004", drone: "FarmDrone HD",   model: "Kisan D4",       pilot: "Deepak Mehta", phone: "+91 93450 88120", date: "May 10, 2026", duration: "2 days",  purpose: "Crop monitoring",          acres: 15, amount: 3200,  status: "Completed" },
];

const salesHistory: SaleItem[] = [
  { id: "SAL-001", drone: "AgriStar X200",  model: "DJI Agras T10", condition: "Good", buyer: "Mohan Farms Pvt Ltd",      buyerPhone: "+91 94020 55312", buyerLocation: "Akola, MH",   date: "May 15, 2026", amount: 85000 },
  { id: "SAL-002", drone: "OldFlyer 4L",    model: "XAG V40",       condition: "Fair", buyer: "Suresh Agri Solutions",    buyerPhone: "+91 91203 78844", buyerLocation: "Nashik, MH",  date: "Apr 30, 2026", amount: 55000 },
  { id: "SAL-003", drone: "SprayBot Mini",  model: "Kisan D2",      condition: "Good", buyer: "Ramesh Drone Cooperative", buyerPhone: "+91 98102 33221", buyerLocation: "Solapur, MH", date: "Apr 10, 2026", amount: 42000 },
];

function RentalDetailView({ item, onBack }: { item: RentalItem; onBack: () => void }) {
  return (
    <div className="min-h-screen bg-background pb-8">
      <div className="flex items-center gap-3 px-5 pt-12 pb-5">
        <button onClick={onBack} className="w-9 h-9 bg-card border border-border rounded-xl flex items-center justify-center hover:bg-secondary">
          <ArrowLeft className="w-4 h-4 text-foreground" />
        </button>
        <div>
          <h2 className="text-foreground">Rental Detail</h2>
          <p className="text-xs text-muted-foreground font-mono">{item.id}</p>
        </div>
      </div>
      <div className="px-5 space-y-4">
        {/* Status banner */}
        <div className="bg-primary rounded-2xl p-4 flex items-center justify-between">
          <div>
            <p className="text-primary-foreground font-semibold">{item.drone}</p>
            <p className="text-primary-foreground/70 text-xs">{item.model}</p>
          </div>
          <span className="bg-primary-foreground/20 text-primary-foreground text-xs px-2.5 py-1 rounded-full font-medium">{item.status}</span>
        </div>

        {/* Pilot info */}
        <div className="bg-card border border-border rounded-2xl p-4">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">Pilot Information</p>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-secondary rounded-xl flex items-center justify-center text-primary font-semibold">{item.pilot[0]}</div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-foreground">{item.pilot}</p>
              <p className="text-xs text-muted-foreground">{item.phone}</p>
            </div>
            <a href={`tel:${item.phone}`} className="w-9 h-9 bg-secondary rounded-xl flex items-center justify-center text-primary hover:bg-primary hover:text-primary-foreground transition-colors">
              <Phone className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Rental details */}
        <div className="bg-card border border-border rounded-2xl p-4 space-y-3">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Rental Details</p>
          {[
            ["Date",      item.date],
            ["Duration",  item.duration],
            ["Purpose",   item.purpose],
            ["Work Area", `${item.acres} acres`],
          ].map(([k, v]) => (
            <div key={k} className="flex justify-between py-2 border-b border-border last:border-0">
              <span className="text-xs text-muted-foreground">{k}</span>
              <span className="text-xs font-medium text-foreground">{v}</span>
            </div>
          ))}
        </div>

        {/* Revenue */}
        <div className="bg-secondary rounded-2xl p-4 flex items-center justify-between">
          <span className="text-sm font-medium text-foreground">Revenue Earned</span>
          <span className="text-lg font-bold text-primary">₹{item.amount.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}

function SaleDetailView({ item, onBack }: { item: SaleItem; onBack: () => void }) {
  return (
    <div className="min-h-screen bg-background pb-8">
      <div className="flex items-center gap-3 px-5 pt-12 pb-5">
        <button onClick={onBack} className="w-9 h-9 bg-card border border-border rounded-xl flex items-center justify-center hover:bg-secondary">
          <ArrowLeft className="w-4 h-4 text-foreground" />
        </button>
        <div>
          <h2 className="text-foreground">Sale Detail</h2>
          <p className="text-xs text-muted-foreground font-mono">{item.id}</p>
        </div>
      </div>
      <div className="px-5 space-y-4">
        {/* Banner */}
        <div className="bg-primary rounded-2xl p-4">
          <p className="text-primary-foreground font-semibold">{item.drone}</p>
          <p className="text-primary-foreground/70 text-xs">{item.model} · Condition: {item.condition}</p>
        </div>

        {/* Buyer info */}
        <div className="bg-card border border-border rounded-2xl p-4">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">Buyer Information</p>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-secondary rounded-xl flex items-center justify-center text-primary font-semibold">{item.buyer[0]}</div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-foreground">{item.buyer}</p>
              <p className="text-xs text-muted-foreground">{item.buyerPhone}</p>
            </div>
            <a href={`tel:${item.buyerPhone}`} className="w-9 h-9 bg-secondary rounded-xl flex items-center justify-center text-primary hover:bg-primary hover:text-primary-foreground transition-colors">
              <Phone className="w-4 h-4" />
            </a>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <MapPin className="w-3.5 h-3.5" /><span>{item.buyerLocation}</span>
          </div>
        </div>

        {/* Sale details */}
        <div className="bg-card border border-border rounded-2xl p-4 space-y-3">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Transaction Details</p>
          {[
            ["Sale Date",       item.date],
            ["Drone Model",     item.model],
            ["Condition",       item.condition],
            ["Buyer Location",  item.buyerLocation],
          ].map(([k, v]) => (
            <div key={k} className="flex justify-between py-2 border-b border-border last:border-0">
              <span className="text-xs text-muted-foreground">{k}</span>
              <span className="text-xs font-medium text-foreground">{v}</span>
            </div>
          ))}
        </div>

        {/* Invoice summary */}
        <div className="bg-card border border-border rounded-2xl p-4 space-y-2">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Invoice</p>
          <div className="flex justify-between text-xs"><span className="text-muted-foreground">Sale Price</span><span className="text-foreground">₹{item.amount.toLocaleString()}</span></div>
          <div className="flex justify-between text-xs"><span className="text-muted-foreground">Platform Fee (2%)</span><span className="text-foreground">-₹{Math.round(item.amount * 0.02).toLocaleString()}</span></div>
          <div className="flex justify-between text-xs pt-2 border-t border-border font-semibold">
            <span className="text-foreground">Net Received</span>
            <span className="text-primary">₹{Math.round(item.amount * 0.98).toLocaleString()}</span>
          </div>
        </div>

        <button className="w-full flex items-center justify-center gap-2 bg-secondary border border-border rounded-xl py-3 text-sm text-foreground hover:bg-muted">
          <FileText className="w-4 h-4 text-primary" /> Download Invoice
        </button>
      </div>
    </div>
  );
}

export function VendorHistory() {
  const [selectedRental, setSelectedRental] = useState<RentalItem | null>(null);
  const [selectedSale,   setSelectedSale]   = useState<SaleItem   | null>(null);
  const { sales: agriSales } = useAgriStore();

  if (selectedRental) return <RentalDetailView item={selectedRental} onBack={() => setSelectedRental(null)} />;
  if (selectedSale)   return <SaleDetailView   item={selectedSale}   onBack={() => setSelectedSale(null)} />;

  return (
    <div className="min-h-screen bg-background pb-8">
      <div className="px-5 pt-12 pb-5">
        <h2 className="text-foreground font-bold">History</h2>
        <p className="text-sm text-muted-foreground mt-1">Rentals, drone sales & agri-inputs</p>
      </div>

      {/* Stats */}
      <div className="px-5 mb-6">
        <div className="grid grid-cols-3 gap-3">
          {stats.map(({ label, value, icon }) => (
            <div key={label} className="bg-card border border-border rounded-2xl p-3 text-center">
              <div className="flex justify-center mb-1 text-primary">{icon}</div>
              <p className="text-sm font-semibold text-primary">{value}</p>
              <p className="text-xs text-muted-foreground leading-tight">{label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="px-5 space-y-6">
        {/* Rental History */}
        <div>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">Rental History</p>
          <div className="space-y-2">
            {rentalHistory.map((item) => (
              <button key={item.id} onClick={() => setSelectedRental(item)}
                className="w-full bg-card border border-border rounded-2xl p-4 flex items-center gap-3 hover:bg-secondary/30 transition-colors text-left">
                <div className="w-10 h-10 bg-secondary rounded-xl flex items-center justify-center flex-shrink-0">
                  <Cpu className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-medium text-foreground">{item.drone}</p>
                  <p className="text-xs text-muted-foreground">{item.pilot} · {item.date}</p>
                  <p className="text-xs text-muted-foreground">{item.duration} · {item.acres} acres</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-semibold text-foreground">₹{item.amount.toLocaleString()}</p>
                  <p className="text-xs text-primary">View →</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Sales History */}
        <div>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">Sales History</p>
          <div className="space-y-2">
            {salesHistory.map((item) => (
              <button key={item.id} onClick={() => setSelectedSale(item)}
                className="w-full bg-card border border-border rounded-2xl p-4 flex items-center gap-3 hover:bg-secondary/30 transition-colors text-left">
                <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Package className="w-5 h-5 text-accent" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-medium text-foreground">{item.drone}</p>
                  <p className="text-xs text-muted-foreground">{item.buyer}</p>
                  <p className="text-xs text-muted-foreground">{item.date}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-semibold text-foreground">₹{item.amount.toLocaleString()}</p>
                  <p className="text-xs text-primary">View →</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Agri-Inputs Sales */}
        <div>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">Agri-Inputs Sales</p>
          <div className="space-y-2">
            {agriSales.length === 0 ? (
              <p className="text-xs text-muted-foreground text-center py-4">No agri-input sales yet</p>
            ) : agriSales.map((item) => (
              <div key={item.id}
                className="w-full bg-card border border-border rounded-2xl p-4 flex items-center gap-3 text-left">
                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Beaker className="w-5 h-5 text-green-700" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-medium text-foreground">{item.brand}</p>
                  <p className="text-xs text-muted-foreground">{item.pilot} · {item.date}</p>
                  <p className="text-xs text-muted-foreground capitalize">{item.type} · {item.quantity} {item.unit}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-semibold text-foreground">₹{item.amount.toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
