import { useState } from "react";
import { Bell, User, Check, X, ChevronRight, Cpu, Clock, TrendingUp, Calendar, Camera, Edit2, Phone, Mail, MapPin, Star, Shield, FileText } from "lucide-react";

const rentalRequests = [
  { id: "REQ-101", pilot: "Arjun Singh",  experience: "3 years", license: "DL-MH-2023-0441", duration: "2 days", reason: "Crop spraying (Wheat)", cost: 4800, status: "pending" },
  { id: "REQ-102", pilot: "Kiran Rao",    experience: "5 years", license: "DL-KA-2021-0882", duration: "1 day",  reason: "Fertilizer application", cost: 2400, status: "pending" },
  { id: "REQ-103", pilot: "Vikram Nair",  experience: "2 years", license: "DL-TN-2024-0331", duration: "3 days", reason: "Pesticide spray (Paddy)", cost: 7200, status: "pending" },
];

const farmerBookingRequests = [
  { id: "FB-201", farmer: "Rajesh Kumar", farm: "North Field", service: "Pesticide Spray", acres: 12, pilot: "Arjun Singh", date: "Jun 14, 2026", amount: 5400, status: "pending" },
  { id: "FB-202", farmer: "Suresh Patel", farm: "West Farm", service: "Fertilizer Spray", acres: 20, pilot: "Kiran Rao", date: "Jun 15, 2026", amount: 9000, status: "pending" },
];

const vendorProfile = {
  name: "TechDrone Solutions",
  phone: "+91 98765 43212",
  email: "info@techdrone.in",
  location: "Pune, Maharashtra",
  gstin: "27AABCT1332L1ZQ",
  totalDrones: "8",
  yearsActive: "4",
  avatar: "TS",
};

const notifications = [
  { icon: "📋", title: "New Rental Request",   body: "Arjun Singh wants to rent AgriStar X500 for 2 days",      time: "20 min ago", unread: true  },
  { icon: "💰", title: "Payment Received",      body: "₹4,800 credited for REQ-098",                              time: "2h ago",     unread: true  },
  { icon: "✅", title: "Booking Completed",     body: "CropFlyer Pro returned by Kiran Rao — Jun 9",              time: "1d ago",     unread: false },
  { icon: "⭐", title: "New Review",            body: "Vikram Nair gave AgriStar X500 a 5-star review",           time: "2d ago",     unread: false },
];

function ProfileModal({ onClose }: { onClose: () => void }) {
  const [editing, setEditing] = useState(false);
  const [profile, setProfile] = useState(vendorProfile);
  const [saved, setSaved] = useState(false);
  const save = () => { setSaved(true); setEditing(false); setTimeout(() => setSaved(false), 2000); };

  return (
    <div className="fixed inset-0 z-50 bg-foreground/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-background w-full max-w-sm rounded-3xl shadow-2xl max-h-[90vh] flex flex-col">
        <div className="flex justify-center pt-3 pb-1 flex-shrink-0"><div className="w-10 h-1 bg-border rounded-full" /></div>
        <div className="flex items-center justify-between px-5 py-3 border-b border-border flex-shrink-0">
          <h3 className="text-foreground font-medium">Vendor Profile</h3>
          <div className="flex items-center gap-2">
            {saved && <span className="text-xs text-primary font-medium">Saved ✓</span>}
            <button onClick={editing ? save : () => setEditing(true)}
              className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-xl ${editing ? "bg-primary text-primary-foreground" : "bg-secondary border border-border text-foreground"}`}>
              {editing ? <><Check className="w-3.5 h-3.5" /> Save</> : <><Edit2 className="w-3.5 h-3.5" /> Edit</>}
            </button>
            <button onClick={onClose} className="w-8 h-8 bg-secondary rounded-xl flex items-center justify-center"><X className="w-4 h-4 text-foreground" /></button>
          </div>
        </div>
        <div className="overflow-y-auto px-5 py-5 space-y-4">
          <div className="flex flex-col items-center">
            <div className="relative">
              <div className="w-20 h-20 bg-primary rounded-2xl flex items-center justify-center text-primary-foreground text-2xl font-bold">{profile.avatar}</div>
              {editing && <button className="absolute -bottom-2 -right-2 w-7 h-7 bg-accent rounded-full flex items-center justify-center shadow-md"><Camera className="w-3.5 h-3.5 text-white" /></button>}
            </div>
            <p className="font-semibold text-foreground mt-3">{profile.name}</p>
            <p className="text-xs text-muted-foreground">Drone Vendor · {profile.location}</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[["Drones", profile.totalDrones], ["Years Active", profile.yearsActive]].map(([l, v]) => (
              <div key={l} className="bg-secondary rounded-xl p-3 text-center">
                <p className="text-sm font-semibold text-primary">{v}</p>
                <p className="text-xs text-muted-foreground">{l}</p>
              </div>
            ))}
          </div>

          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            {[
              { icon: <User className="w-4 h-4" />,    label: "Business Name", key: "name",        type: "text" },
              { icon: <Phone className="w-4 h-4" />,   label: "Phone",         key: "phone",       type: "tel" },
              { icon: <Mail className="w-4 h-4" />,    label: "Email",         key: "email",       type: "email" },
              { icon: <MapPin className="w-4 h-4" />,  label: "Location",      key: "location",    type: "text" },
              { icon: <Shield className="w-4 h-4" />,  label: "GSTIN",         key: "gstin",       type: "text" },
              { icon: <Cpu className="w-4 h-4" />,     label: "Total Drones",  key: "totalDrones", type: "number" },
              { icon: <Calendar className="w-4 h-4" />,label: "Years Active",  key: "yearsActive", type: "number" },
            ].map(({ icon, label, key, type }, i) => (
              <div key={key} className={`flex items-center gap-3 p-4 ${i > 0 ? "border-t border-border" : ""}`}>
                <div className="text-primary flex-shrink-0">{icon}</div>
                <div className="flex-1">
                  <p className="text-[10px] text-muted-foreground">{label}</p>
                  {editing ? (
                    <input type={type} value={profile[key as keyof typeof profile]}
                      onChange={(e) => setProfile({ ...profile, [key]: e.target.value })}
                      className="w-full bg-input-background rounded-lg px-2 py-1 mt-0.5 text-xs text-foreground outline-none focus:ring-1 focus:ring-primary" />
                  ) : (
                    <p className="text-xs font-medium text-foreground mt-0.5">{profile[key as keyof typeof profile]}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
          {editing && <button onClick={save} className="w-full bg-primary text-primary-foreground rounded-xl py-3 text-sm font-medium">Save Changes</button>}
        </div>
      </div>
    </div>
  );
}

function NotificationPanel({ onClose }: { onClose: () => void }) {
  const [items, setItems] = useState(notifications);
  const unread = items.filter((n) => n.unread).length;
  return (
    <div className="fixed inset-0 z-50 bg-foreground/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-background w-full max-w-sm rounded-3xl shadow-2xl max-h-[75vh] overflow-y-auto">
        <div className="flex justify-center pt-3 pb-1"><div className="w-10 h-1 bg-border rounded-full" /></div>
        <div className="flex items-center justify-between px-5 py-3 border-b border-border">
          <div className="flex items-center gap-2">
            <h3 className="text-foreground font-medium">Notifications</h3>
            {unread > 0 && <span className="bg-accent text-accent-foreground text-xs w-5 h-5 rounded-full flex items-center justify-center font-medium">{unread}</span>}
          </div>
          <div className="flex items-center gap-2">
            {unread > 0 && <button onClick={() => setItems(items.map((n) => ({ ...n, unread: false })))} className="text-xs text-primary hover:underline">Mark all read</button>}
            <button onClick={onClose} className="w-8 h-8 bg-secondary rounded-xl flex items-center justify-center"><X className="w-4 h-4 text-foreground" /></button>
          </div>
        </div>
        {items.map((item, i) => (
          <button key={i} onClick={() => setItems(items.map((n, j) => j === i ? { ...n, unread: false } : n))}
            className={`w-full flex items-start gap-3 px-5 py-4 border-b border-border last:border-0 text-left hover:bg-secondary/40 ${item.unread ? "bg-secondary/30" : ""}`}>
            <div className="w-9 h-9 bg-secondary rounded-xl flex items-center justify-center text-base flex-shrink-0">{item.icon}</div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <p className={`text-sm ${item.unread ? "font-semibold text-foreground" : "font-medium text-foreground"}`}>{item.title}</p>
                {item.unread && <span className="w-2 h-2 bg-accent rounded-full flex-shrink-0" />}
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">{item.body}</p>
              <p className="text-xs text-muted-foreground mt-1">{item.time}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

export function VendorHome() {
  const [requests, setRequests] = useState(rentalRequests);
  const [farmerRequests, setFarmerRequests] = useState(farmerBookingRequests);
  const [showProfile, setShowProfile] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const handleAction = (id: string, action: "accepted" | "declined") =>
    setRequests(requests.map((r) => r.id === id ? { ...r, status: action } : r));
  const handleFarmerAction = (id: string, action: "accepted" | "declined") =>
    setFarmerRequests(farmerRequests.map((r) => r.id === id ? { ...r, status: action } : r));
  const pending = requests.filter((r) => r.status === "pending");
  const pendingFarmer = farmerRequests.filter((r) => r.status === "pending");

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {showProfile && <ProfileModal onClose={() => setShowProfile(false)} />}
      {showNotifications && <NotificationPanel onClose={() => setShowNotifications(false)} />}

      {/* Top Bar */}
      <div className="flex items-center justify-between px-5 pt-12 pb-4">
        <div>
          <p className="text-xs text-muted-foreground">Drone Vendor</p>
          <h2 className="text-foreground">TechDrone Solutions</h2>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setShowNotifications(true)}
            className="relative w-9 h-9 bg-card border border-border rounded-xl flex items-center justify-center hover:bg-secondary transition-colors">
            <Bell className="w-4 h-4 text-foreground" />
            {pending.length + pendingFarmer.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-accent text-accent-foreground text-[9px] font-bold rounded-full flex items-center justify-center">
                {pending.length + pendingFarmer.length}
              </span>
            )}
          </button>
          <button onClick={() => setShowProfile(true)}
            className="w-10 h-10 bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm hover:opacity-90 transition-opacity"
            style={{ borderRadius: "0.75rem 0.75rem 1.25rem 1.25rem" }}>
            TS
          </button>
        </div>
      </div>

      {/* Summary */}
      <div className="px-5 mb-5">
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Total Drones", value: "8",     icon: <Cpu className="w-4 h-4" /> },
            { label: "Pending Req.", value: (pending.length + pendingFarmer.length).toString(), icon: <Clock className="w-4 h-4" /> },
            { label: "Revenue Today", value: "₹4,800", icon: <TrendingUp className="w-4 h-4" /> },
          ].map(({ label, value, icon }) => (
            <div key={label} className="bg-card border border-border rounded-2xl p-3 text-center">
              <div className="flex justify-center mb-1 text-primary">{icon}</div>
              <p className="text-sm font-semibold text-foreground">{value}</p>
              <p className="text-xs text-muted-foreground leading-tight">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Rental Requests */}
      <div className="px-5 pb-6">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
          Rental Requests
          {pending.length > 0 && <span className="ml-1.5 bg-accent text-accent-foreground text-xs px-1.5 py-0.5 rounded-full">{pending.length}</span>}
        </p>
        <div className="space-y-3">
          {requests.map((req) => (
            <div key={req.id} className={`bg-card border rounded-2xl p-4 ${req.status === "accepted" ? "border-primary/30" : req.status === "declined" ? "border-border opacity-60" : "border-border"}`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-xs font-semibold">{req.pilot[0]}</div>
                  <div>
                    <p className="text-xs font-medium text-foreground">{req.pilot}</p>
                    <p className="text-xs text-muted-foreground">{req.experience} exp.</p>
                  </div>
                </div>
                {req.status !== "pending" ? (
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${req.status === "accepted" ? "bg-secondary text-primary" : "bg-muted text-muted-foreground"}`}>
                    {req.status === "accepted" ? "Accepted" : "Declined"}
                  </span>
                ) : (
                  <span className="text-xs font-mono text-muted-foreground">{req.id}</span>
                )}
              </div>
              <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
                <div><span className="text-muted-foreground">License</span><p className="text-foreground font-mono text-[10px]">{req.license}</p></div>
                <div><span className="text-muted-foreground">Duration</span><p className="text-foreground">{req.duration}</p></div>
                <div className="col-span-2"><span className="text-muted-foreground">Usage</span><p className="text-foreground">{req.reason}</p></div>
              </div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-muted-foreground">Rental Cost</span>
                <span className="text-sm font-semibold text-primary">₹{req.cost.toLocaleString()}</span>
              </div>
              {req.status === "pending" && (
                <div className="flex gap-2">
                  <button onClick={() => handleAction(req.id, "declined")}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 border border-border rounded-xl text-xs text-foreground hover:bg-secondary">
                    <X className="w-3.5 h-3.5" /> Decline
                  </button>
                  <button onClick={() => handleAction(req.id, "accepted")}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-primary text-primary-foreground rounded-xl text-xs hover:opacity-90">
                    <Check className="w-3.5 h-3.5" /> Accept
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3 mt-6">
          Farmer Booking Requests
          {pendingFarmer.length > 0 && <span className="ml-1.5 bg-accent text-accent-foreground text-xs px-1.5 py-0.5 rounded-full">{pendingFarmer.length}</span>}
        </p>
        <p className="text-[10px] text-muted-foreground mb-3">Routed to your registered pilots when farmers book services</p>
        <div className="space-y-3">
          {farmerRequests.map((req) => (
            <div key={req.id} className={`bg-card border rounded-2xl p-4 ${req.status === "accepted" ? "border-primary/30" : req.status === "declined" ? "border-border opacity-60" : "border-border"}`}>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-xs font-medium text-foreground">{req.farmer} · {req.farm}</p>
                  <p className="text-xs text-muted-foreground">Pilot: {req.pilot}</p>
                </div>
                <span className="text-xs font-mono text-muted-foreground">{req.id}</span>
              </div>
              <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
                <div><span className="text-muted-foreground">Service</span><p className="text-foreground">{req.service}</p></div>
                <div><span className="text-muted-foreground">Acres</span><p className="text-foreground">{req.acres}</p></div>
                <div><span className="text-muted-foreground">Date</span><p className="text-foreground">{req.date}</p></div>
                <div><span className="text-muted-foreground">Amount</span><p className="text-primary font-semibold">₹{req.amount.toLocaleString()}</p></div>
              </div>
              {req.status === "pending" && (
                <div className="flex gap-2">
                  <button onClick={() => handleFarmerAction(req.id, "declined")} className="flex-1 flex items-center justify-center gap-1.5 py-2.5 border border-border rounded-xl text-xs hover:bg-secondary"><X className="w-3.5 h-3.5" /> Decline</button>
                  <button onClick={() => handleFarmerAction(req.id, "accepted")} className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-primary text-primary-foreground rounded-xl text-xs hover:opacity-90"><Check className="w-3.5 h-3.5" /> Route to Pilot</button>
                </div>
              )}
              {req.status !== "pending" && (
                <span className={`text-xs px-2 py-0.5 rounded-full ${req.status === "accepted" ? "bg-secondary text-primary" : "bg-muted text-muted-foreground"}`}>{req.status}</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
