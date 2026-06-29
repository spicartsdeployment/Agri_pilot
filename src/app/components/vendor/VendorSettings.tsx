import { useState } from "react";
import {
  User, Globe, HeadphonesIcon, FileText, Info as InfoIcon, LogOut, ChevronRight, ChevronDown,
  ArrowLeft, Sun, Moon, Monitor, Check, Edit2, Camera, Phone, Mail,
  MapPin, Shield, Crown, ExternalLink, Star, MessageCircle, Cpu, Calendar
} from "lucide-react";

interface VendorSettingsProps {
  onLogout: () => void;
}

type Page = "profile"|"theme"|"language"|"subscription"|"policies"|"support"|"about"|"privacy"|"terms"|"pilots"|"certification"|"inputs"|null;

const languages = ["English","Hindi","Marathi","Tamil","Telugu","Kannada","Gujarati","Punjabi","Bengali","Odia"];

const allPlansMeta = [
  { id: "basic",   label: "Basic Vendor" },
  { id: "pro",     label: "Pro Vendor" },
  { id: "multi",   label: "Multi-Pilot Subscription" },
];

const registeredPilots = [
  { id: "P1", name: "Arjun Singh", license: "DL-MH-2023-0441", status: "Active", jobs: 24 },
  { id: "P2", name: "Kiran Rao", license: "DL-KA-2021-0882", status: "Active", jobs: 18 },
  { id: "P3", name: "Vikram Nair", license: "DL-TN-2024-0331", status: "On Leave", jobs: 9 },
];

const initialProfile = {
  name: "TechDrone Solutions", phone: "+91 98765 43212", email: "info@techdrone.in",
  location: "Pune, Maharashtra", gstin: "27AABCT1332L1ZQ",
  totalDrones: "8", totalPilots: "3", yearsActive: "4", avatar: "TS",
};

const privacySections = [
  { h: "Data Collection",  b: "We collect your business name, contact info, drone registration details, and transaction history." },
  { h: "Data Usage",       b: "Your data is used to display your listings to pilots, process bookings, and send rental/sale notifications." },
  { h: "Data Sharing",     b: "Pilot contact details are shared only after a rental is accepted. We do not sell business data." },
  { h: "Security",         b: "All data is encrypted with AES-256. Payments are handled via PCI-DSS compliant processors." },
  { h: "Your Rights",      b: "You can update or delete your business profile and listing data at any time from Settings > Profile." },
  { h: "Contact",          b: "For privacy inquiries: privacy@agripilot.in" },
];

const termsSections = [
  { h: "Acceptance",       b: "Using AgriPilot Vendor Portal means you agree to these terms. Discontinue use if you disagree." },
  { h: "Listing Accuracy", b: "You are responsible for providing accurate drone details, pricing, and availability status." },
  { h: "Rental Policy",    b: "Drones must be in the listed condition when handed over to pilots. Damage disputes are handled via arbitration." },
  { h: "Sales Policy",     b: "Sales are final once both parties confirm. AgriPilot takes a 2% platform fee on completed transactions." },
  { h: "Cancellations",    b: "Vendor-initiated cancellations less than 12 hours before a scheduled rental may result in a penalty fee." },
  { h: "Governing Law",    b: "These terms are governed by Indian law. Disputes resolved via arbitration in Pune, Maharashtra." },
];

function BackHeader({ title, onBack }: { title: string; onBack: () => void }) {
  return (
    <div className="flex items-center gap-3 px-5 pt-12 pb-5">
      <button onClick={onBack} className="w-9 h-9 bg-card border border-border rounded-xl flex items-center justify-center hover:bg-secondary transition-colors">
        <ArrowLeft className="w-4 h-4 text-foreground" />
      </button>
      <h2 className="text-foreground">{title}</h2>
    </div>
  );
}

function PaletteIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="13.5" cy="6.5" r=".5" /><circle cx="17.5" cy="10.5" r=".5" />
      <circle cx="8.5" cy="7.5" r=".5" /><circle cx="6.5" cy="12.5" r=".5" />
      <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" />
    </svg>
  );
}

export function VendorSettings({ onLogout }: VendorSettingsProps) {
  const [page,       setPage]       = useState<Page>(null);
  const [profile,    setProfile]    = useState(initialProfile);
  const [editingP,   setEditingP]   = useState(false);
  const [savedP,     setSavedP]     = useState(false);
  const [theme,      setTheme]      = useState<"light"|"dark"|"system">("system");
  const [savedTheme, setSavedTheme] = useState<"light"|"dark"|"system">("system");
  const [language,   setLanguage]   = useState("English");
  // Sub-page states hoisted to avoid hooks-in-conditional violation
  const [activePlan,  setActivePlan]  = useState("pro");
  const [planToast,   setPlanToast]   = useState("");
  const [openFaq,     setOpenFaq]     = useState<number | null>(null);
  const [pilots,      setPilots]      = useState(registeredPilots);
  const [newPilotName, setNewPilotName] = useState("");
  const [certStatus,  setCertStatus]  = useState({ pesticide: false, fertilizer: false, gst: false });

  const saveProfile = () => { setSavedP(true); setEditingP(false); setTimeout(() => setSavedP(false), 2000); };

  const applyTheme = (t: "light" | "dark" | "system") => {
    const wrapper = document.querySelector(".vendor-theme") as HTMLElement | null;
    const isDark = t === "dark" || (t === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
    if (wrapper) { if (isDark) wrapper.classList.add("dark"); else wrapper.classList.remove("dark"); }
    if (isDark) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
    setTheme(t);
  };

  const saveTheme = () => { setSavedTheme(theme); setPage(null); };

  // ── Profile ──────────────────────────────────────────────────────
  if (page === "profile") {
    return (
      <div className="min-h-screen bg-background pb-8">
        <BackHeader title="Business Profile" onBack={() => setPage(null)} />
        <div className="px-5 space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">Edit your business details</p>
            <div className="flex items-center gap-2">
              {savedP && <span className="text-xs text-primary font-medium">Saved ✓</span>}
              <button onClick={editingP ? saveProfile : () => setEditingP(true)}
                className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-xl ${editingP ? "bg-primary text-primary-foreground" : "bg-secondary border border-border text-foreground"}`}>
                {editingP ? <><Check className="w-3.5 h-3.5" /> Save</> : <><Edit2 className="w-3.5 h-3.5" /> Edit</>}
              </button>
            </div>
          </div>

          <div className="flex flex-col items-center py-3">
            <div className="relative">
              <div className="w-20 h-20 bg-primary rounded-2xl flex items-center justify-center text-primary-foreground text-2xl font-bold">{profile.avatar}</div>
              {editingP && <button className="absolute -bottom-2 -right-2 w-7 h-7 bg-accent rounded-full flex items-center justify-center shadow-md"><Camera className="w-3.5 h-3.5 text-white" /></button>}
            </div>
            <p className="font-semibold text-foreground mt-3">{profile.name}</p>
            <p className="text-xs text-muted-foreground">Drone Vendor · {profile.location}</p>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {[["Total Drones", profile.totalDrones], ["Pilots", profile.totalPilots], ["Years Active", profile.yearsActive]].map(([l, v]) => (
              <div key={l} className="bg-secondary rounded-xl p-3 text-center">
                <p className="text-sm font-semibold text-primary">{v}</p>
                <p className="text-xs text-muted-foreground">{l}</p>
              </div>
            ))}
          </div>

          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            {[
              { icon: <User className="w-4 h-4" />,     label: "Business Name",  key: "name",        type: "text" },
              { icon: <Phone className="w-4 h-4" />,    label: "Phone",          key: "phone",       type: "tel" },
              { icon: <Mail className="w-4 h-4" />,     label: "Email",          key: "email",       type: "email" },
              { icon: <MapPin className="w-4 h-4" />,   label: "Location",       key: "location",    type: "text" },
              { icon: <Shield className="w-4 h-4" />,   label: "GSTIN",          key: "gstin",       type: "text" },
              { icon: <Cpu className="w-4 h-4" />,      label: "Total Drones",   key: "totalDrones", type: "number" },
              { icon: <User className="w-4 h-4" />,     label: "Pilots Under Vendor", key: "totalPilots", type: "number" },
              { icon: <Calendar className="w-4 h-4" />, label: "Years Active",   key: "yearsActive", type: "number" },
            ].map(({ icon, label, key, type }, i) => (
              <div key={key} className={`flex items-center gap-3 p-4 ${i > 0 ? "border-t border-border" : ""}`}>
                <div className="text-primary flex-shrink-0">{icon}</div>
                <div className="flex-1">
                  <p className="text-[10px] text-muted-foreground">{label}</p>
                  {editingP ? (
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
          {editingP && <button onClick={saveProfile} className="w-full bg-primary text-primary-foreground rounded-xl py-3 text-sm font-medium">Save Changes</button>}
        </div>
      </div>
    );
  }

  // ── Theme ────────────────────────────────────────────────────────
  if (page === "theme") {
    const themes = [
      { id: "light"  as const, label: "Light Mode",     desc: "Bright, clean interface",       icon: <Sun className="w-5 h-5" />,     preview: "bg-white border-gray-200" },
      { id: "dark"   as const, label: "Dark Mode",      desc: "Easy on eyes at night",         icon: <Moon className="w-5 h-5" />,    preview: "bg-gray-900 border-gray-700" },
      { id: "system" as const, label: "System Default", desc: "Follow your device preference", icon: <Monitor className="w-5 h-5" />, preview: "bg-gradient-to-r from-white to-gray-900 border-gray-400" },
    ];
    return (
      <div className="min-h-screen bg-background pb-8">
        <BackHeader title="Theme" onBack={() => setPage(null)} />
        <div className="px-5 space-y-3">
          {themes.map((t) => (
            <button key={t.id} onClick={() => applyTheme(t.id)}
              className={`w-full flex items-center gap-4 p-4 rounded-2xl border transition-all ${theme === t.id ? "border-primary bg-secondary" : "border-border bg-card"}`}>
              <div className={`w-12 h-8 rounded-lg border flex-shrink-0 ${t.preview}`} />
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${theme === t.id ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground"}`}>{t.icon}</div>
              <div className="flex-1 text-left">
                <p className={`text-sm font-medium ${theme === t.id ? "text-primary" : "text-foreground"}`}>{t.label}</p>
                <p className="text-xs text-muted-foreground">{t.desc}</p>
              </div>
              {theme === t.id && <Check className="w-5 h-5 text-primary flex-shrink-0" />}
            </button>
          ))}
          <button onClick={saveTheme} className="w-full bg-primary text-primary-foreground rounded-xl py-3 text-sm font-medium hover:opacity-90">Save Theme</button>
        </div>
      </div>
    );
  }

  // ── Language ─────────────────────────────────────────────────────
  if (page === "language") {
    return (
      <div className="min-h-screen bg-background pb-8">
        <BackHeader title="Language" onBack={() => setPage(null)} />
        <div className="px-5">
          <p className="text-xs text-muted-foreground mb-4">Select your preferred app language</p>
          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            {languages.map((lang, i) => (
              <button key={lang} onClick={() => { setLanguage(lang); setPage(null); }}
                className={`w-full flex items-center justify-between p-4 hover:bg-secondary/50 transition-colors ${i > 0 ? "border-t border-border" : ""}`}>
                <span className={`text-sm ${language === lang ? "text-primary font-semibold" : "text-foreground"}`}>{lang}</span>
                {language === lang && <Check className="w-4 h-4 text-primary" />}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ── Multi-Pilot Management ───────────────────────────────────────
  if (page === "pilots") {
    return (
      <div className="min-h-screen bg-background pb-8">
        <BackHeader title="Manage Pilots" onBack={() => setPage(null)} />
        <div className="px-5 space-y-4">
          <p className="text-xs text-muted-foreground">Add and manage pilots under your organization. Booking requests route to registered pilots.</p>
          {pilots.map((p) => (
            <div key={p.id} className="bg-card border border-border rounded-2xl p-4 flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-primary-foreground font-semibold">{p.name[0]}</div>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">{p.name}</p>
                <p className="text-[10px] text-muted-foreground font-mono">{p.license} · {p.jobs} jobs</p>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full ${p.status === "Active" ? "bg-secondary text-primary" : "bg-muted text-muted-foreground"}`}>{p.status}</span>
            </div>
          ))}
          <div className="flex gap-2">
            <input type="text" value={newPilotName} onChange={(e) => setNewPilotName(e.target.value)} placeholder="Pilot name"
              className="flex-1 bg-input-background rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-1 focus:ring-primary" />
            <button onClick={() => { if (newPilotName) { setPilots([...pilots, { id: `P${Date.now()}`, name: newPilotName, license: "Pending", status: "Active", jobs: 0 }]); setNewPilotName(""); setProfile((p) => ({ ...p, totalPilots: String(pilots.length + 1) })); } }}
              className="bg-primary text-primary-foreground px-4 rounded-xl text-sm font-medium">Add</button>
          </div>
        </div>
      </div>
    );
  }

  // ── Agri-Input Certification ─────────────────────────────────────
  if (page === "certification") {
    const docs = [
      { key: "pesticide" as const, label: "Pesticide Dealer Certificate", icon: "🧪" },
      { key: "fertilizer" as const, label: "Fertilizer Dealer Certificate", icon: "🌱" },
      { key: "gst" as const, label: "GST Number & Verification", icon: "📋" },
    ];
    const allVerified = certStatus.pesticide && certStatus.fertilizer && certStatus.gst;
    return (
      <div className="min-h-screen bg-background pb-8">
        <BackHeader title="Agri-Input Certification" onBack={() => setPage(null)} />
        <div className="px-5 space-y-4">
          <p className="text-xs text-muted-foreground">Upload certificates via photo verification to sell pesticides and fertilizers on the platform.</p>
          {docs.map(({ key, label, icon }) => (
            <div key={key} className="bg-card border border-border rounded-2xl p-4">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-xl">{icon}</span>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{label}</p>
                  <p className="text-xs text-muted-foreground">{certStatus[key] ? "Verified" : "Upload required"}</p>
                </div>
                {certStatus[key] && <Check className="w-4 h-4 text-primary" />}
              </div>
              {!certStatus[key] && (
                <button onClick={() => setCertStatus({ ...certStatus, [key]: true })}
                  className="w-full border border-dashed border-border rounded-xl py-4 text-xs text-muted-foreground hover:bg-secondary">📷 Upload Certificate Photo</button>
              )}
            </div>
          ))}
          {allVerified && (
            <div className="bg-secondary rounded-xl p-4 text-center">
              <p className="text-sm text-primary font-medium">Certification complete — pesticides & fertilizers sales enabled</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ── Pesticides & Fertilizers Sales ───────────────────────────────
  if (page === "inputs") {
    const certified = certStatus.pesticide && certStatus.fertilizer && certStatus.gst;
    return (
      <div className="min-h-screen bg-background pb-8">
        <BackHeader title="Pesticides & Fertilizers" onBack={() => setPage(null)} />
        <div className="px-5 space-y-4">
          {!certified ? (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-center">
              <p className="text-sm text-amber-800 font-medium">Certification Required</p>
              <p className="text-xs text-amber-700 mt-1">Complete GST and dealer certificate verification to sell agri-inputs.</p>
              <button onClick={() => setPage("certification")} className="mt-3 text-xs text-primary font-medium underline">Go to Certification</button>
            </div>
          ) : (
            <>
              <button className="w-full bg-primary text-primary-foreground rounded-xl py-3 text-sm font-medium">+ Add Pesticide / Fertilizer Product</button>
              {[{ name: "Confidor 200 SL", type: "Pesticide", price: 850, stock: 120 }, { name: "Urea 46%", type: "Fertilizer", price: 320, stock: 500 }].map((p) => (
                <div key={p.name} className="bg-card border border-border rounded-2xl p-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-foreground">{p.name}</p>
                    <p className="text-xs text-muted-foreground">{p.type} · Stock: {p.stock} units</p>
                  </div>
                  <p className="text-sm font-semibold text-primary">₹{p.price}</p>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    );
  }

  // ── Subscription ─────────────────────────────────────────────────
  if (page === "subscription") {
    const allPlans = [
      { id: "basic", label: "Basic Vendor", price: "₹699/mo", features: ["Up to 5 drone listings", "Standard support", "Basic analytics"] },
      { id: "pro", label: "Pro Vendor", price: "₹1,499/mo", features: ["Up to 20 listings", "Priority visibility", "Rental analytics", "24/7 support"] },
      { id: "multi", label: "Multi-Pilot Subscription", price: "₹2,999/mo", features: ["Manage multiple pilots", "Farmer booking routing", "Pilot roster dashboard", "Fleet analytics", "Maintenance logs"] },
    ];

    const handlePlanAction = (planId: string, label: string) => {
      if (planId === activePlan) {
        setPlanToast(`✅ ${label} renewed successfully!`);
      } else {
        setActivePlan(planId);
        setPlanToast(`✅ Switched to ${label}!`);
      }
      setTimeout(() => setPlanToast(""), 3000);
    };

    return (
      <div className="min-h-screen bg-background pb-8">
        <BackHeader title="Subscription" onBack={() => setPage(null)} />
        <div className="px-5 space-y-4">
          {planToast && (
            <div className="bg-secondary border border-primary/30 rounded-2xl p-3">
              <span className="text-xs font-medium text-primary">{planToast}</span>
            </div>
          )}
          <div className="bg-secondary border border-primary/20 rounded-2xl p-4 flex items-center gap-3">
            <Crown className="w-5 h-5 text-primary flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold text-foreground">Current: {allPlans.find((p) => p.id === activePlan)?.label}</p>
              <p className="text-xs text-muted-foreground">Expires Aug 15, 2026 · 64 days remaining</p>
            </div>
          </div>
          {allPlans.map((p) => {
            const isCurrent = p.id === activePlan;
            return (
              <div key={p.id} className={`bg-card border rounded-2xl p-4 ${isCurrent ? "border-primary shadow-sm" : "border-border"}`}>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className={`text-sm font-semibold ${isCurrent ? "text-primary" : "text-foreground"}`}>{p.label}</p>
                    <p className="text-lg font-bold text-foreground">{p.price}</p>
                  </div>
                  {isCurrent && <span className="text-xs bg-secondary text-primary px-2 py-0.5 rounded-full font-medium">Active</span>}
                </div>
                <ul className="space-y-1.5 mb-4">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-xs text-foreground">
                      <Check className="w-3 h-3 text-primary flex-shrink-0" />{f}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => handlePlanAction(p.id, p.label)}
                  className={`w-full py-2.5 rounded-xl text-sm font-medium transition-all hover:opacity-90 active:scale-95 ${isCurrent ? "bg-primary text-primary-foreground" : "border border-border text-foreground hover:bg-secondary"}`}
                >
                  {isCurrent ? "Renew Plan" : `Switch to ${p.label}`}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // ── Policies ─────────────────────────────────────────────────────
  if (page === "policies") {
    return (
      <div className="min-h-screen bg-background pb-8">
        <BackHeader title="Policies" onBack={() => setPage(null)} />
        <div className="px-5 space-y-3">
          <button onClick={() => setPage("privacy")}
            className="w-full flex items-center gap-3 p-4 bg-card border border-border rounded-2xl hover:bg-secondary/50 transition-colors">
            <div className="w-10 h-10 bg-secondary rounded-xl flex items-center justify-center text-primary"><Shield className="w-4 h-4" /></div>
            <div className="flex-1 text-left">
              <p className="text-sm font-medium text-foreground">Privacy Policy</p>
              <p className="text-xs text-muted-foreground">How we collect and use your data</p>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </button>
          <button onClick={() => setPage("terms")}
            className="w-full flex items-center gap-3 p-4 bg-card border border-border rounded-2xl hover:bg-secondary/50 transition-colors">
            <div className="w-10 h-10 bg-secondary rounded-xl flex items-center justify-center text-primary"><FileText className="w-4 h-4" /></div>
            <div className="flex-1 text-left">
              <p className="text-sm font-medium text-foreground">Terms & Conditions</p>
              <p className="text-xs text-muted-foreground">Vendor responsibilities and rules</p>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
      </div>
    );
  }

  // ── Privacy / Terms content ──────────────────────────────────────
  if (page === "privacy" || page === "terms") {
    const sections = page === "privacy" ? privacySections : termsSections;
    const title    = page === "privacy" ? "Privacy Policy" : "Terms & Conditions";
    return (
      <div className="min-h-screen bg-background pb-8">
        <BackHeader title={title} onBack={() => setPage("policies")} />
        <div className="px-5 space-y-3">
          {sections.map(({ h, b }) => (
            <div key={h} className="bg-card border border-border rounded-2xl p-4">
              <p className="text-xs font-semibold text-foreground mb-1">{h}</p>
              <p className="text-xs text-muted-foreground leading-relaxed">{b}</p>
            </div>
          ))}
          <p className="text-center text-xs text-muted-foreground">Last updated: June 1, 2026</p>
        </div>
      </div>
    );
  }

  // ── Support ──────────────────────────────────────────────────────
  if (page === "support") {
    const faqItems = [
      { q: "How do I add a drone listing?",       a: "Go to Drones → Rent Drone or Sell Drone, then tap 'Add Drone for Rent/Sale'. Fill in the drone details, pricing, and availability, then save." },
      { q: "How do I receive payments?",          a: "Payments are processed within 24 hours after a rental or sale is completed. Ensure your bank account details are up to date in Profile settings." },
      { q: "How are rental rates calculated?",    a: "You set the price per day for each drone. The platform calculates the total based on the number of days the pilot books." },
      { q: "Can I block specific dates?",         a: "Yes. In the drone listing, you can mark specific dates as unavailable. These will appear in red on the pilot's booking calendar." },
      { q: "How do I verify a pilot's licence?",  a: "When a pilot submits a rental request, their licence number is shown in the request details. You can cross-check it against the DGCA online portal." },
    ];
    const contactActions = [
      { icon: <Phone className="w-4 h-4" />, label: "Toll-Free", value: "1800-123-9999", action: "Call", href: "tel:18001239999" },
      { icon: <MessageCircle className="w-4 h-4" />, label: "WhatsApp", value: "+91 90000 99999", action: "Chat", href: "https://wa.me/919000099999" },
      { icon: <Mail className="w-4 h-4" />, label: "Email", value: "vendor-support@agripilot.in", action: "Email", href: "mailto:vendor-support@agripilot.in" },
    ];
    return (
      <div className="min-h-screen bg-background pb-8">
        <BackHeader title="Support" onBack={() => setPage(null)} />
        <div className="px-5 space-y-4">
          <div className="bg-primary rounded-2xl p-5 text-center">
            <div className="text-3xl mb-2">🎧</div>
            <p className="text-primary-foreground font-semibold">Vendor Support</p>
            <p className="text-primary-foreground/70 text-xs mt-1">Available Mon–Sat, 9 AM – 7 PM IST</p>
          </div>
          {contactActions.map(({ icon, label, value, action, href }) => (
            <div key={label} className="bg-card border border-border rounded-2xl p-4 flex items-center gap-3">
              <div className="w-10 h-10 bg-secondary rounded-xl flex items-center justify-center text-primary flex-shrink-0">{icon}</div>
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">{label}</p>
                <p className="text-sm font-medium text-foreground">{value}</p>
              </div>
              <a
                href={href}
                target={href.startsWith("http") ? "_blank" : undefined}
                rel="noopener noreferrer"
                className="text-xs text-primary font-medium bg-secondary px-3 py-1.5 rounded-xl hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                {action}
              </a>
            </div>
          ))}
          <div className="bg-card border border-border rounded-2xl p-4">
            <p className="text-sm font-medium text-foreground mb-3">Frequently Asked Questions</p>
            {faqItems.map((item, i) => (
              <div key={i} className={i > 0 ? "border-t border-border" : ""}>
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between py-3 text-left hover:bg-secondary/30 rounded-xl px-1 transition-colors"
                >
                  <span className="text-xs font-medium text-foreground pr-2">{item.q}</span>
                  <ChevronDown className={`w-3.5 h-3.5 text-primary flex-shrink-0 transition-transform ${openFaq === i ? "rotate-180" : ""}`} />
                </button>
                {openFaq === i && (
                  <p className="text-xs text-muted-foreground leading-relaxed pb-3 px-1">{item.a}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ── About ─────────────────────────────────────────────────────────
  if (page === "about") {
    return (
      <div className="min-h-screen bg-background pb-8">
        <BackHeader title="About AgriPilot" onBack={() => setPage(null)} />
        <div className="px-5 space-y-4">
          <div className="flex flex-col items-center py-4">
            <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mb-3">
              <span className="text-white text-2xl">🌾</span>
            </div>
            <p className="font-semibold text-foreground">AgriPilot</p>
            <p className="text-xs text-muted-foreground mt-0.5">Version 2.4.1 (Build 241)</p>
          </div>
          {[
            ["Founded",           "2021"],
            ["Registered Vendors","1,200+"],
            ["Drones on Platform","12,000+"],
            ["States Covered",    "12"],
            ["Total Transactions","₹45 Crore+"],
            ["Headquarters",      "Nagpur, Maharashtra"],
          ].map(([l, v]) => (
            <div key={l} className="bg-card border border-border rounded-xl flex items-center justify-between px-4 py-3">
              <span className="text-sm text-muted-foreground">{l}</span>
              <span className="text-sm font-semibold text-foreground">{v}</span>
            </div>
          ))}
          <div className="bg-secondary rounded-2xl p-4 text-center">
            <p className="text-xs text-muted-foreground leading-relaxed">
              AgriPilot connects drone vendors with certified pilots and farmers, making agricultural drone services accessible across India.
            </p>
          </div>
          <div className="flex gap-3">
            <a
              href="https://agripilot.in"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-card border border-border rounded-xl text-xs text-foreground hover:bg-secondary transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" /> Visit Website
            </a>
            <button
              onClick={() => {
                if (window.confirm("Rate AgriPilot on the Play Store?")) {
                  window.open("https://play.google.com/store/apps/details?id=in.agripilot.app", "_blank");
                }
              }}
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-card border border-border rounded-xl text-xs text-foreground hover:bg-secondary transition-colors"
            >
              <Star className="w-3.5 h-3.5" /> Rate App
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Main Menu ────────────────────────────────────────────────────
  const menuItems: { id: Page; icon: React.ReactNode; label: string; desc: string }[] = [
    { id: "profile",      icon: <User className="w-4 h-4" />,           label: "Profile",      desc: profile.name },
    { id: "pilots",       icon: <User className="w-4 h-4" />,           label: "Manage Pilots", desc: `${pilots.length} registered pilots` },
    { id: "certification",icon: <Shield className="w-4 h-4" />,          label: "Certification", desc: "Pesticide, Fertilizer & GST" },
    { id: "inputs",       icon: <FileText className="w-4 h-4" />,        label: "Agri-Inputs",  desc: "Pesticides & Fertilizers" },
    { id: "theme",        icon: <PaletteIcon />,                         label: "Theme",        desc: savedTheme === "light" ? "Light Mode" : savedTheme === "dark" ? "Dark Mode" : "System Default" },
    { id: "language",     icon: <Globe className="w-4 h-4" />,           label: "Language",     desc: language },
    { id: "policies",     icon: <Shield className="w-4 h-4" />,          label: "Policies",     desc: "Privacy & Terms" },
    { id: "support",      icon: <HeadphonesIcon className="w-4 h-4" />,  label: "Support",      desc: "Help & customer care" },
    { id: "about",        icon: <InfoIcon className="w-4 h-4" />,         label: "About",        desc: "App v2.4.1" },
    { id: "subscription", icon: <Crown className="w-4 h-4" />,           label: "Subscription", desc: `${allPlansMeta.find(p => p.id === activePlan)?.label || "Pro Vendor"} · expires Aug 15` },
  ];

  return (
    <div className="min-h-screen bg-background pb-8">
      <div className="px-5 pt-12 pb-6"><h2 className="text-foreground">Settings</h2></div>

      <div className="px-5 mb-6">
        <button onClick={() => setPage("profile")}
          className="w-full bg-primary rounded-2xl p-5 flex items-center gap-4 hover:opacity-95 transition-opacity">
          <div className="w-14 h-14 bg-primary-foreground/20 rounded-2xl flex items-center justify-center text-primary-foreground text-xl font-bold">{profile.avatar}</div>
          <div className="flex-1 text-left">
            <p className="text-primary-foreground font-semibold">{profile.name}</p>
            <p className="text-primary-foreground/70 text-xs">{profile.phone}</p>
            <p className="text-primary-foreground/70 text-xs">Drone Vendor · {profile.location}</p>
          </div>
          <ChevronRight className="w-5 h-5 text-primary-foreground/60" />
        </button>
      </div>

      <div className="px-5">
        <div className="bg-card border border-border rounded-2xl overflow-hidden mb-4">
          {menuItems.map((item, i) => (
            <button key={item.label} onClick={() => setPage(item.id)}
              className={`w-full flex items-center gap-3 p-4 hover:bg-secondary/50 transition-colors ${i > 0 ? "border-t border-border" : ""}`}>
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${item.id === "subscription" ? "bg-purple-100 text-purple-600" : "bg-secondary text-primary"}`}>{item.icon}</div>
              <div className="flex-1 text-left">
                <p className="text-sm text-foreground">{item.label}</p>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </button>
          ))}
        </div>

        <button onClick={onLogout}
          className="w-full flex items-center justify-center gap-2 py-3.5 bg-destructive/10 border border-destructive/20 rounded-2xl text-destructive text-sm font-medium hover:bg-destructive/15 transition-colors">
          <LogOut className="w-4 h-4" /> Logout
        </button>
      </div>
    </div>
  );
}

