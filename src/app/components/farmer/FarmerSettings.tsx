import { useState } from "react";
import {
  User, Palette, Globe, HeadphonesIcon, FileText, Info, LogOut, ChevronRight, ChevronDown,
  ArrowLeft, Sun, Moon, Monitor, Check, Edit2, Camera, Phone, Mail,
  MapPin, Tractor, Calendar, Star, Shield, ExternalLink, MessageCircle, X
} from "lucide-react";

interface FarmerSettingsProps {
  onLogout: () => void;
}

type ActivePage = "profile" | "theme" | "language" | "support" | "policies" | "about" | "privacy" | "terms" | "aadhaar" | null;

const languages = ["English", "Hindi", "Marathi", "Tamil", "Telugu", "Kannada", "Gujarati", "Punjabi", "Bengali", "Odia"];

const privacyContent = [
  { heading: "Information We Collect", body: "We collect your name, phone number, farm details, location, and booking history to provide our services." },
  { heading: "How We Use Your Data", body: "Your data is used to match you with pilots, process bookings, send notifications, and improve the platform." },
  { heading: "Data Sharing", body: "We share your information with assigned pilots only to the extent necessary to complete a service. We never sell your data." },
  { heading: "Security", body: "All data is encrypted in transit and at rest. We use industry-standard security practices to protect your information." },
  { heading: "Your Rights", body: "You may access, edit, or delete your personal data at any time from the Profile section in Settings." },
  { heading: "Contact", body: "For privacy inquiries: privacy@agripilot.in" },
];

const termsContent = [
  { heading: "Acceptance", body: "By using AgriPilot, you agree to these Terms. If you do not agree, please discontinue use immediately." },
  { heading: "Bookings", body: "Bookings are subject to pilot availability. Free cancellation within 15 minutes of pilot acceptance; thereafter ₹100–₹300 fee applies." },
  { heading: "Payments", body: "All payments are processed securely. Refunds for cancelled services are credited within 5-7 business days." },
  { heading: "Liability", body: "AgriPilot is a marketplace. We are not liable for the quality of services rendered by individual pilots." },
  { heading: "Accounts", body: "You are responsible for keeping your credentials secure. Notify us immediately of unauthorized access." },
  { heading: "Governing Law", body: "These terms are governed by the laws of India. Disputes shall be resolved through arbitration in Nagpur, Maharashtra." },
  { heading: "Contact", body: "For legal queries: legal@agripilot.in" },
];

function BackHeader({ title, onBack }: { title: string; onBack: () => void }) {
  return (
    <div className="flex items-center gap-3 px-5 pt-12 pb-5 flex-shrink-0">
      <button onClick={onBack} className="w-9 h-9 bg-card border border-border rounded-xl flex items-center justify-center hover:bg-secondary transition-colors">
        <ArrowLeft className="w-4 h-4 text-foreground" />
      </button>
      <h2 className="text-foreground">{title}</h2>
    </div>
  );
}

const faqItems = [
  { q: "How do I book a drone pilot?",   a: "Go to Home → Book a Pilot, select your farm, choose a service type, pick a date and time, then confirm your booking. A pilot will be assigned within 2 hours." },
  { q: "What services are available?",   a: "We offer Pesticide Spray, Fertilizer Spray, Crop Monitoring / Inspection, and Seed Broadcasting. More services are being added regularly." },
  { q: "How is pricing calculated?",     a: "Pricing is based on the number of acres, service type, and the chemicals or materials required. An estimated cost is shown before you confirm." },
  { q: "Can I cancel a booking?",        a: "Yes. Cancel free within 15 minutes after the pilot accepts. After that, a cancellation fee of ₹100–₹300 applies." },
  { q: "How do I add a new farm?",       a: "Go to Home → Farms → Add Farm. Fill in the farm name, area, crop type, land type, crop stage, water source, and location. Tap Save to add it to your profile." },
];

function FaqSection() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div className="bg-card border border-border rounded-2xl p-4">
      <p className="text-sm font-medium text-foreground mb-3">Frequently Asked Questions</p>
      {faqItems.map((item, i) => (
        <div key={i} className={i > 0 ? "border-t border-border" : ""}>
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="w-full flex items-center justify-between py-3 text-left hover:bg-secondary/30 transition-colors rounded-xl px-1"
          >
            <span className="text-xs font-medium text-foreground pr-2">{item.q}</span>
            <ChevronDown className={`w-3.5 h-3.5 text-primary flex-shrink-0 transition-transform ${open === i ? "rotate-180" : ""}`} />
          </button>
          {open === i && (
            <p className="text-xs text-muted-foreground leading-relaxed pb-3 px-1">{item.a}</p>
          )}
        </div>
      ))}
    </div>
  );
}

const initialProfile = {
  name: "Rajesh Kumar", phone: "+91 98765 43210", email: "rajesh.kumar@gmail.com",
  location: "Nagpur, Maharashtra", village: "Kamptee", totalFarms: "3",
  totalAcres: "25", experience: "12 years", primaryCrop: "Wheat, Rice, Mango", avatar: "RK",
  aadhaar: "", aadhaarVerified: false,
};

export function FarmerSettings({ onLogout }: FarmerSettingsProps) {
  const [activePage, setActivePage] = useState<ActivePage>(null);
  const [profile, setProfile] = useState(initialProfile);
  const [editingProfile, setEditingProfile] = useState(false);
  const [savedProfile, setSavedProfile] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark" | "system">("system");
  const [language, setLanguage] = useState("English");
  const [aadhaarOtp, setAadhaarOtp] = useState("");
  const [aadhaarStep, setAadhaarStep] = useState<"idle" | "otp" | "verified">("idle");

  const applyTheme = (t: "light" | "dark" | "system") => {
    const root = document.documentElement;
    if (t === "dark") {
      root.classList.add("dark");
    } else if (t === "light") {
      root.classList.remove("dark");
    } else {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      if (prefersDark) root.classList.add("dark"); else root.classList.remove("dark");
    }
    setTheme(t);
  };

  const saveProfile = () => {
    setSavedProfile(true);
    setEditingProfile(false);
    setTimeout(() => setSavedProfile(false), 2000);
  };

  // ── Profile ──
  if (activePage === "profile") {
    return (
      <div className="min-h-screen bg-background pb-8">
        <BackHeader title="My Profile" onBack={() => setActivePage(null)} />
        <div className="px-5 space-y-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-muted-foreground">Tap Edit to update your details</p>
            <div className="flex items-center gap-2">
              {savedProfile && <span className="text-xs text-primary font-medium">Saved ✓</span>}
              <button
                onClick={editingProfile ? saveProfile : () => setEditingProfile(true)}
                className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-xl ${editingProfile ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground border border-border"}`}
              >
                {editingProfile ? <><Check className="w-3.5 h-3.5" /> Save</> : <><Edit2 className="w-3.5 h-3.5" /> Edit</>}
              </button>
            </div>
          </div>

          {/* Avatar */}
          <div className="flex flex-col items-center py-3">
            <div className="relative">
              <div className="w-20 h-20 bg-primary rounded-2xl flex items-center justify-center text-primary-foreground text-2xl font-bold">{profile.avatar}</div>
              {editingProfile && (
                <button className="absolute -bottom-2 -right-2 w-7 h-7 bg-accent rounded-full flex items-center justify-center shadow-md">
                  <Camera className="w-3.5 h-3.5 text-white" />
                </button>
              )}
            </div>
            <p className="font-semibold text-foreground mt-3">{profile.name}</p>
            <p className="text-xs text-muted-foreground">Farmer · {profile.location}</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            {[["Farms", profile.totalFarms], ["Acres", profile.totalAcres], ["Exp.", profile.experience.split(" ")[0] + "yr"]].map(([l, v]) => (
              <div key={l} className="bg-secondary rounded-xl p-3 text-center">
                <p className="text-sm font-semibold text-primary">{v}</p>
                <p className="text-xs text-muted-foreground">{l}</p>
              </div>
            ))}
          </div>

          {/* Fields */}
          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            {[
              { icon: <User className="w-4 h-4" />, label: "Full Name", key: "name", type: "text" },
              { icon: <Phone className="w-4 h-4" />, label: "Phone Number", key: "phone", type: "tel" },
              { icon: <Mail className="w-4 h-4" />, label: "Email", key: "email", type: "email" },
              { icon: <MapPin className="w-4 h-4" />, label: "Location", key: "location", type: "text" },
              { icon: <MapPin className="w-4 h-4" />, label: "Village / Town", key: "village", type: "text" },
              { icon: <Tractor className="w-4 h-4" />, label: "Number of Farms", key: "totalFarms", type: "number" },
              { icon: <Tractor className="w-4 h-4" />, label: "Total Acres", key: "totalAcres", type: "number" },
              { icon: <Calendar className="w-4 h-4" />, label: "Farming Experience", key: "experience", type: "text" },
              { icon: <Star className="w-4 h-4" />, label: "Primary Crops", key: "primaryCrop", type: "text" },
              { icon: <Shield className="w-4 h-4" />, label: "Aadhaar (last 4)", key: "aadhaar", type: "text", readonly: true },
            ].map(({ icon, label, key, type, readonly }, i) => (
              <div key={key} className={`flex items-center gap-3 p-4 ${i > 0 ? "border-t border-border" : ""}`}>
                <div className="text-primary flex-shrink-0">{icon}</div>
                <div className="flex-1">
                  <p className="text-[10px] text-muted-foreground">{label}</p>
                  {editingProfile && !readonly ? (
                    <input type={type} value={profile[key as keyof typeof profile]}
                      onChange={(e) => setProfile({ ...profile, [key]: e.target.value })}
                      className="w-full bg-input-background rounded-lg px-2 py-1 mt-0.5 text-xs text-foreground outline-none focus:ring-1 focus:ring-primary" />
                  ) : (
                    <p className="text-xs text-foreground font-medium mt-0.5">
                      {key === "aadhaar" ? (profile.aadhaarVerified ? `XXXX-XXXX-${profile.aadhaar}` : "Not verified") : profile[key as keyof typeof profile]}
                    </p>
                  )}
                </div>
                {key === "aadhaar" && (
                  <span className={`text-[10px] px-2 py-0.5 rounded-full ${profile.aadhaarVerified ? "bg-secondary text-primary" : "bg-muted text-muted-foreground"}`}>
                    {profile.aadhaarVerified ? "Verified" : "Pending"}
                  </span>
                )}
              </div>
            ))}
          </div>

          {!profile.aadhaarVerified && (
            <button onClick={() => setActivePage("aadhaar")} className="w-full flex items-center justify-center gap-2 border border-primary text-primary rounded-xl py-3 text-sm font-medium">
              <Shield className="w-4 h-4" /> Verify Aadhaar
            </button>
          )}

          {editingProfile && (
            <button onClick={saveProfile} className="w-full bg-primary text-primary-foreground rounded-xl py-3 text-sm font-medium">Save Changes</button>
          )}
        </div>
      </div>
    );
  }

  // ── Aadhaar Verification ──
  if (activePage === "aadhaar") {
    return (
      <div className="min-h-screen bg-background pb-8">
        <BackHeader title="Aadhaar Verification" onBack={() => setActivePage("profile")} />
        <div className="px-5 space-y-4">
          <div className="bg-secondary rounded-2xl p-4 text-center">
            <Shield className="w-10 h-10 text-primary mx-auto mb-2" />
            <p className="text-sm font-medium text-foreground">Verify Your Identity</p>
            <p className="text-xs text-muted-foreground mt-1">Required for secure bookings and payments</p>
          </div>
          {aadhaarStep === "idle" && (
            <>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Aadhaar Number</label>
                <input type="text" maxLength={12} placeholder="XXXX XXXX XXXX"
                  onChange={(e) => setProfile({ ...profile, aadhaar: e.target.value.replace(/\D/g, "").slice(-4) })}
                  className="w-full bg-input-background rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-1 focus:ring-primary" />
              </div>
              <button onClick={() => setAadhaarStep("otp")} className="w-full bg-primary text-primary-foreground rounded-xl py-3 text-sm font-medium">Send OTP</button>
            </>
          )}
          {aadhaarStep === "otp" && (
            <>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Enter OTP sent to Aadhaar-linked mobile</label>
                <input type="text" maxLength={6} value={aadhaarOtp} onChange={(e) => setAadhaarOtp(e.target.value.replace(/\D/g, ""))}
                  className="w-full bg-input-background rounded-xl px-3 py-2.5 text-sm text-center tracking-widest outline-none focus:ring-1 focus:ring-primary" placeholder="••••••" />
              </div>
              <button onClick={() => { setProfile({ ...profile, aadhaarVerified: true }); setAadhaarStep("verified"); }}
                disabled={aadhaarOtp.length < 6} className="w-full bg-primary text-primary-foreground rounded-xl py-3 text-sm font-medium disabled:opacity-40">Verify OTP</button>
            </>
          )}
          {aadhaarStep === "verified" && (
            <div className="flex items-center gap-2 bg-secondary rounded-xl p-4">
              <Check className="w-5 h-5 text-primary" />
              <p className="text-sm text-primary font-medium">Aadhaar verified successfully!</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ── Theme ──
  if (activePage === "theme") {
    const themes = [
      { id: "light" as const, label: "Light Mode", desc: "Bright & clean interface", icon: <Sun className="w-5 h-5" />, preview: "bg-white border-gray-200" },
      { id: "dark" as const, label: "Dark Mode", desc: "Easy on the eyes at night", icon: <Moon className="w-5 h-5" />, preview: "bg-gray-900 border-gray-700" },
      { id: "system" as const, label: "System Default", desc: "Follow your device setting", icon: <Monitor className="w-5 h-5" />, preview: "bg-gradient-to-r from-white to-gray-900 border-gray-400" },
    ];
    return (
      <div className="min-h-screen bg-background pb-8">
        <BackHeader title="Theme" onBack={() => setActivePage(null)} />
        <div className="px-5 space-y-3">
          {themes.map((t) => (
            <button key={t.id} onClick={() => applyTheme(t.id)}
              className={`w-full flex items-center gap-4 p-4 rounded-2xl border transition-all ${theme === t.id ? "border-primary bg-secondary" : "border-border bg-card"}`}
            >
              {/* mini preview */}
              <div className={`w-12 h-8 rounded-lg border ${t.preview} flex-shrink-0`} />
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${theme === t.id ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground"}`}>
                {t.icon}
              </div>
              <div className="flex-1 text-left">
                <p className={`text-sm font-medium ${theme === t.id ? "text-primary" : "text-foreground"}`}>{t.label}</p>
                <p className="text-xs text-muted-foreground">{t.desc}</p>
              </div>
              {theme === t.id && <Check className="w-5 h-5 text-primary flex-shrink-0" />}
            </button>
          ))}
        </div>
      </div>
    );
  }

  // ── Language ──
  if (activePage === "language") {
    return (
      <div className="min-h-screen bg-background pb-8">
        <BackHeader title="Language" onBack={() => setActivePage(null)} />
        <div className="px-5">
          <p className="text-xs text-muted-foreground mb-4">Select your preferred language for the app</p>
          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            {languages.map((lang, i) => (
              <button key={lang} onClick={() => { setLanguage(lang); setActivePage(null); }}
                className={`w-full flex items-center justify-between p-4 hover:bg-secondary/50 transition-colors ${i > 0 ? "border-t border-border" : ""}`}
              >
                <span className={`text-sm ${language === lang ? "text-primary font-semibold" : "text-foreground"}`}>{lang}</span>
                {language === lang && <Check className="w-4 h-4 text-primary" />}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ── Support ──
  if (activePage === "support") {
    return (
      <div className="min-h-screen bg-background pb-8">
        <BackHeader title="Support" onBack={() => setActivePage(null)} />
        <div className="px-5 space-y-4">
          <div className="bg-primary rounded-2xl p-5 text-center">
            <div className="text-3xl mb-2">🎧</div>
            <p className="text-primary-foreground font-semibold">We're here to help</p>
            <p className="text-primary-foreground/70 text-xs mt-1">Available Mon–Sat, 8 AM – 8 PM IST</p>
          </div>

          {[
            { icon: <Phone className="w-4 h-4" />, label: "Call Us", value: "1800-123-4567 (Toll Free)", action: "Call Now" },
            { icon: <MessageCircle className="w-4 h-4" />, label: "WhatsApp Support", value: "+91 90000 12345", action: "Chat Now" },
            { icon: <Mail className="w-4 h-4" />, label: "Email Support", value: "support@agripilot.in", action: "Send Email" },
          ].map(({ icon, label, value, action }) => (
            <div key={label} className="bg-card border border-border rounded-2xl p-4 flex items-center gap-3">
              <div className="w-10 h-10 bg-secondary rounded-xl flex items-center justify-center text-primary flex-shrink-0">{icon}</div>
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">{label}</p>
                <p className="text-sm font-medium text-foreground">{value}</p>
              </div>
              <button className="text-xs text-primary font-medium bg-secondary px-3 py-1.5 rounded-xl hover:bg-primary hover:text-primary-foreground transition-colors">{action}</button>
            </div>
          ))}

          <FaqSection />
        </div>
      </div>
    );
  }

  // ── Policies ──
  if (activePage === "policies") {
    return (
      <div className="min-h-screen bg-background pb-8">
        <BackHeader title="Policies" onBack={() => setActivePage(null)} />
        <div className="px-5 space-y-3">
          <button onClick={() => setActivePage("privacy")}
            className="w-full flex items-center gap-3 p-4 bg-card border border-border rounded-2xl hover:bg-secondary/50 transition-colors">
            <div className="w-10 h-10 bg-secondary rounded-xl flex items-center justify-center text-primary"><Shield className="w-4 h-4" /></div>
            <div className="flex-1 text-left">
              <p className="text-sm font-medium text-foreground">Privacy Policy</p>
              <p className="text-xs text-muted-foreground">How we collect and use your data</p>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </button>
          <button onClick={() => setActivePage("terms")}
            className="w-full flex items-center gap-3 p-4 bg-card border border-border rounded-2xl hover:bg-secondary/50 transition-colors">
            <div className="w-10 h-10 bg-secondary rounded-xl flex items-center justify-center text-primary"><FileText className="w-4 h-4" /></div>
            <div className="flex-1 text-left">
              <p className="text-sm font-medium text-foreground">Terms & Conditions</p>
              <p className="text-xs text-muted-foreground">Rules and responsibilities of use</p>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
      </div>
    );
  }

  // ── Privacy / Terms ──
  if (activePage === "privacy" || activePage === "terms") {
    const content = activePage === "privacy" ? privacyContent : termsContent;
    const title = activePage === "privacy" ? "Privacy Policy" : "Terms & Conditions";
    const backTo: ActivePage = "policies";
    return (
      <div className="min-h-screen bg-background pb-8">
        <BackHeader title={title} onBack={() => setActivePage(backTo)} />
        <div className="px-5 space-y-4">
          {content.map(({ heading, body }) => (
            <div key={heading} className="bg-card border border-border rounded-2xl p-4">
              <p className="text-xs font-semibold text-foreground mb-1">{heading}</p>
              <p className="text-xs text-muted-foreground leading-relaxed">{body}</p>
            </div>
          ))}
          <p className="text-center text-xs text-muted-foreground">Last updated: June 1, 2026</p>
        </div>
      </div>
    );
  }

  // ── About ──
  if (activePage === "about") {
    return (
      <div className="min-h-screen bg-background pb-8">
        <BackHeader title="About AgriPilot" onBack={() => setActivePage(null)} />
        <div className="px-5 space-y-4">
          <div className="flex flex-col items-center py-4">
            <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mb-3">
              <span className="text-primary-foreground text-2xl">🌾</span>
            </div>
            <p className="font-semibold text-foreground">AgriPilot</p>
            <p className="text-xs text-muted-foreground mt-0.5">Version 2.4.1 (Build 241)</p>
          </div>

          {[
            { label: "Founded", value: "2021" },
            { label: "Farmers Served", value: "50,000+" },
            { label: "Licensed Pilots", value: "8,000+" },
            { label: "States Covered", value: "12" },
            { label: "Acres Sprayed", value: "2.5 Million" },
            { label: "Headquartered", value: "Nagpur, Maharashtra" },
          ].map(({ label, value }) => (
            <div key={label} className="bg-card border border-border rounded-xl flex items-center justify-between px-4 py-3">
              <span className="text-sm text-muted-foreground">{label}</span>
              <span className="text-sm font-semibold text-foreground">{value}</span>
            </div>
          ))}

          <div className="bg-secondary rounded-2xl p-4 text-center">
            <p className="text-xs text-muted-foreground leading-relaxed">
              AgriPilot is India's leading precision agriculture platform, dedicated to empowering farmers with drone technology for better yields and lower costs.
            </p>
          </div>

          <div className="flex gap-3">
            <button className="flex-1 flex items-center justify-center gap-2 py-3 bg-card border border-border rounded-xl text-xs text-foreground hover:bg-secondary">
              <ExternalLink className="w-3.5 h-3.5" /> Visit Website
            </button>
            <button className="flex-1 flex items-center justify-center gap-2 py-3 bg-card border border-border rounded-xl text-xs text-foreground hover:bg-secondary">
              <Star className="w-3.5 h-3.5" /> Rate App
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Main Settings Menu ──
  const menuItems = [
    { id: "profile" as ActivePage, icon: <User className="w-4 h-4" />, label: "Profile", desc: profile.name },
    { id: "theme" as ActivePage, icon: <Palette className="w-4 h-4" />, label: "Theme", desc: theme === "light" ? "Light Mode" : theme === "dark" ? "Dark Mode" : "System Default" },
    { id: "language" as ActivePage, icon: <Globe className="w-4 h-4" />, label: "Language", desc: language },
    { id: "support" as ActivePage, icon: <HeadphonesIcon className="w-4 h-4" />, label: "Support", desc: "Help & customer care" },
    { id: "policies" as ActivePage, icon: <Shield className="w-4 h-4" />, label: "Policies", desc: "Privacy & Terms" },
    { id: "about" as ActivePage, icon: <Info className="w-4 h-4" />, label: "About", desc: "App v2.4.1" },
  ];

  return (
    <div className="min-h-screen bg-background pb-8">
      <div className="px-5 pt-12 pb-6">
        <h2 className="text-foreground">Settings</h2>
      </div>

      {/* Profile Card */}
      <div className="px-5 mb-6">
        <button onClick={() => setActivePage("profile")}
          className="w-full bg-primary rounded-2xl p-5 flex items-center gap-4 hover:opacity-95 transition-opacity">
          <div className="w-14 h-14 bg-primary-foreground/20 rounded-2xl flex items-center justify-center text-primary-foreground text-xl font-bold">{profile.avatar}</div>
          <div className="flex-1 text-left">
            <p className="text-primary-foreground font-semibold">{profile.name}</p>
            <p className="text-primary-foreground/70 text-xs">{profile.phone}</p>
            <p className="text-primary-foreground/70 text-xs">Farmer · {profile.location}</p>
          </div>
          <ChevronRight className="w-5 h-5 text-primary-foreground/60" />
        </button>
      </div>

      <div className="px-5">
        <div className="bg-card border border-border rounded-2xl overflow-hidden mb-4">
          {menuItems.map((item, i) => (
            <button key={item.label} onClick={() => setActivePage(item.id)}
              className={`w-full flex items-center gap-3 p-4 hover:bg-secondary/50 transition-colors ${i > 0 ? "border-t border-border" : ""}`}
            >
              <div className="w-9 h-9 bg-secondary rounded-xl flex items-center justify-center text-primary flex-shrink-0">{item.icon}</div>
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

