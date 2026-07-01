import { useState } from "react";
import {
  User, Palette, Globe, HeadphonesIcon, Info, FileText, LogOut,
  ChevronRight, ChevronDown, ArrowLeft, Sun, Moon, Monitor, Check, Edit2, Camera,
  Phone, Mail, MapPin, Award, Shield, Crown, ExternalLink, Star,
  MessageCircle, X
} from "lucide-react";
import { pilotProfile } from "./pilotData";

interface PilotSettingsProps {
  onLogout: () => void;
}

type Page = "profile"|"theme"|"language"|"support"|"policies"|"about"|"privacy"|"terms"|"subscription"|"dgca"|null;

const languages = ["English","Hindi","Marathi","Tamil","Telugu","Kannada","Gujarati","Punjabi","Bengali","Odia"];

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

const privacySections = [
  { h: "Information We Collect",     b: "We collect your name, phone, license details, location, and job history to provide our services." },
  { h: "How We Use Your Data",       b: "Data is used to match you with farmers, process payments, send notifications, and improve the platform." },
  { h: "Data Sharing",               b: "Your contact details are shared with farmers only after a booking is accepted. We never sell your data." },
  { h: "Security",                   b: "All data is encrypted in transit and at rest using industry-standard AES-256 encryption." },
  { h: "Your Rights",                b: "You may access, edit, or delete your profile at any time from Settings > Profile." },
  { h: "Contact",                    b: "For privacy queries: privacy@agripilot.in" },
];

const termsSections = [
  { h: "Acceptance",                 b: "By using AgriPilot, you agree to these Terms. Discontinue use if you do not agree." },
  { h: "Pilot Eligibility",          b: "You must hold a valid DGCA drone pilot licence and maintain a minimum 3.5 star rating to remain active." },
  { h: "Bookings & Cancellations",   b: "Repeated cancellations of accepted jobs will automatically reduce your pilot rating. Maintain reliability to keep high visibility." },
  { h: "Payments",                   b: "Payouts are processed within 24 hours of job completion. Bank details must be up to date." },
  { h: "Liability",                  b: "AgriPilot is not liable for equipment damage or crop loss resulting from pilot error." },
  { h: "Governing Law",              b: "These terms are governed by Indian law. Disputes will be settled via arbitration in Nagpur, MH." },
];

export function PilotSettings({ onLogout }: PilotSettingsProps) {
  const [page,         setPage]         = useState<Page>(null);
  const [profile,      setProfile]      = useState({ ...pilotProfile });
  const [editingP,     setEditingP]     = useState(false);
  const [savedP,       setSavedP]       = useState(false);
  const [theme,        setTheme]        = useState<"light"|"dark"|"system">("system");
  const [savedTheme,   setSavedTheme]   = useState<typeof theme>("system");
  const [language,     setLanguage]     = useState("English");
  const [savedLang,    setSavedLang]    = useState("English");
  // hoisted to avoid hooks-in-conditional violations
  const [activePlan,   setActivePlan]   = useState("pro");
  const [planToast,    setPlanToast]    = useState("");
  const [openFaq,      setOpenFaq]      = useState<number | null>(null);
  const [dgcaDoc,      setDgcaDoc]      = useState("");
  const [dgcaOtp,      setDgcaOtp]      = useState("");

  const saveProfile = () => { setSavedP(true); setEditingP(false); setTimeout(() => setSavedP(false), 2000); };
  const applyTheme = (t: "light" | "dark" | "system") => {
    // Target the .pilot-theme wrapper so our CSS vars take precedence
    const wrapper = document.querySelector(".pilot-theme") as HTMLElement | null;
    const isDark = t === "dark" || (t === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
    if (wrapper) {
      if (isDark) wrapper.classList.add("dark");
      else wrapper.classList.remove("dark");
    }
    // Also toggle on root so global elements (modals etc.) follow
    if (isDark) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
    setTheme(t);
  };
  const saveTheme = () => { setSavedTheme(theme); };
  const saveLang    = (l: string) => { setLanguage(l); setSavedLang(l); setPage(null); };

  // ── Profile ──────────────────────────────────────────────────────
  if (page === "profile") {
    return (
      <div className="min-h-screen bg-background pb-8">
        <BackHeader title="My Profile" onBack={() => setPage(null)} />
        <div className="px-5 space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">Edit your personal details</p>
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
              {editingP && <button className="absolute -bottom-2 -right-2 w-7 h-7 bg-amber-500 rounded-full flex items-center justify-center shadow-md"><Camera className="w-3.5 h-3.5 text-white" /></button>}
            </div>
            <p className="font-semibold text-foreground mt-3">{profile.name}</p>
            <p className="text-xs text-muted-foreground">{profile.role}</p>
          </div>

          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            {[
              { icon: <User className="w-4 h-4" />,     label: "Full Name",        key: "name",             type: "text" },
              { icon: <Phone className="w-4 h-4" />,    label: "Phone",            key: "phone",            type: "tel" },
              { icon: <Mail className="w-4 h-4" />,     label: "Email",            key: "email",            type: "email" },
              { icon: <MapPin className="w-4 h-4" />,   label: "Location",         key: "location",         type: "text" },
              { icon: <Award className="w-4 h-4" />,    label: "Experience",       key: "experience",       type: "text" },
              { icon: <Shield className="w-4 h-4" />,   label: "DGCA Certificate", key: "dgcaCertificate",  type: "text", verify: true },
              { icon: <FileText className="w-4 h-4" />, label: "Drone Reg.",       key: "droneRegistration",type: "text" },
              { icon: <Shield className="w-4 h-4" />,   label: "Aadhaar",          key: "aadhaar",          type: "text" },
              { icon: <FileText className="w-4 h-4" />, label: "Bank Account",     key: "bankAccount",      type: "text" },
            ].map(({ icon, label, key, type, verify }, i) => (
              <div key={key} className={`flex items-center gap-3 p-4 ${i > 0 ? "border-t border-border" : ""}`}>
                <div className="text-primary flex-shrink-0">{icon}</div>
                <div className="flex-1">
                  <p className="text-[10px] text-muted-foreground">{label}</p>
                  {editingP && !verify ? (
                    <input type={type} value={profile[key as keyof typeof profile] as string}
                      onChange={(e) => setProfile({ ...profile, [key]: e.target.value })}
                      placeholder={`Enter ${label.toLowerCase()}`}
                      className="w-full bg-input-background rounded-lg px-2 py-1 mt-0.5 text-xs text-foreground outline-none focus:ring-1 focus:ring-primary" />
                  ) : (
                    <p className={`text-xs mt-0.5 ${profile[key as keyof typeof profile] || profile.dgcaVerified ? "text-foreground font-medium" : "text-muted-foreground italic"}`}>
                      {verify ? (profile.dgcaVerified ? `Verified · ${profile.dgcaCertificate || "DGCA-RPAS"}` : "Not verified — tap Verify below") : (profile[key as keyof typeof profile] || "Not provided")}
                    </p>
                  )}
                </div>
                {verify && (
                  <span className={`text-[10px] px-2 py-0.5 rounded-full ${profile.dgcaVerified ? "bg-secondary text-primary" : "bg-muted text-muted-foreground"}`}>
                    {profile.dgcaVerified ? "Verified" : "Pending"}
                  </span>
                )}
              </div>
            ))}
          </div>
          {!profile.dgcaVerified && (
            <button onClick={() => setPage("dgca")} className="w-full flex items-center justify-center gap-2 border border-primary text-primary rounded-xl py-3 text-sm font-medium">
              <Shield className="w-4 h-4" /> Verify DGCA Certificate
            </button>
          )}
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
          <button onClick={() => { saveTheme(); setPage(null); }}
            className="w-full bg-primary text-primary-foreground rounded-xl py-3 text-sm font-medium mt-2 hover:opacity-90">
            Save Theme
          </button>
          {savedTheme !== theme && (
            <p className="text-center text-xs text-muted-foreground">Current saved: {savedTheme}</p>
          )}
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
          <p className="text-xs text-muted-foreground mb-4">Select your preferred app language. Changes save immediately.</p>
          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            {languages.map((lang, i) => (
              <button key={lang} onClick={() => saveLang(lang)}
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

  // ── Support ──────────────────────────────────────────────────────
  if (page === "support") {
    const faqItems = [
      { q: "How do I accept a job?",          a: "On the Home screen, new job requests appear below the map. Tap 'View Details' to review, then 'Accept' to confirm. The job moves to Active Jobs." },
      { q: "When do I get paid?",             a: "Payouts are processed within 24 hours of job completion. Ensure your bank account is up to date in Profile settings." },
      { q: "How do I update my licence?",     a: "Go to Settings → Profile, tap Edit, and update your Licence Number field. Save changes and we'll review within 48 hours." },
      { q: "Can I cancel a confirmed job?",   a: "Cancellations within 2 hours of a job start incur a ₹200 penalty. Contact support if you have an emergency." },
      { q: "How is my rating calculated?",    a: "Your rating is the average of all farmer reviews after completed jobs. Maintaining above 4.0 keeps you eligible for priority job matching." },
    ];
    const contactActions = [
      { icon: <Phone className="w-4 h-4" />, label: "Toll-Free", value: "1800-123-4567", action: "Call", href: "tel:18001234567" },
      { icon: <MessageCircle className="w-4 h-4" />, label: "WhatsApp", value: "+91 90000 12345", action: "Chat", href: "https://wa.me/919000012345" },
      { icon: <Mail className="w-4 h-4" />, label: "Email Support", value: "pilot-support@agripilot.in", action: "Email", href: "mailto:pilot-support@agripilot.in" },
    ];

    return (
      <div className="min-h-screen bg-background pb-8">
        <BackHeader title="Support" onBack={() => setPage(null)} />
        <div className="px-5 space-y-4">
          <div className="bg-primary rounded-2xl p-5 text-center">
            <div className="text-3xl mb-2">🎧</div>
            <p className="text-primary-foreground font-semibold">We're here to help</p>
            <p className="text-primary-foreground/70 text-xs mt-1">Available Mon–Sat, 8 AM – 8 PM IST</p>
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

  // ── Policies menu ────────────────────────────────────────────────
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
              <p className="text-xs text-muted-foreground">Rules and responsibilities of use</p>
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
            ["Farmers Served",    "50,000+"],
            ["Active Pilots",     "8,000+"],
            ["States Covered",    "12"],
            ["Acres Sprayed",     "2.5 Million"],
            ["Headquarters",      "Nagpur, Maharashtra"],
          ].map(([l, v]) => (
            <div key={l} className="bg-card border border-border rounded-xl flex items-center justify-between px-4 py-3">
              <span className="text-sm text-muted-foreground">{l}</span>
              <span className="text-sm font-semibold text-foreground">{v}</span>
            </div>
          ))}
          <div className="bg-secondary rounded-2xl p-4 text-center">
            <p className="text-xs text-muted-foreground leading-relaxed">
              AgriPilot empowers farmers with precision drone technology. We connect certified pilots with farmers for crop spraying, monitoring, and seeding services across India.
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
                if (window.confirm("Rate AgriPilot on the App Store?")) {
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

  // ── DGCA Certificate Verification ───────────────────────────────
  if (page === "dgca") {
    return (
      <div className="min-h-screen bg-background pb-8">
        <BackHeader title="DGCA Certificate Verification" onBack={() => setPage("profile")} />
        <div className="px-5 space-y-4">
          <div className="bg-secondary rounded-2xl p-4 text-center">
            <Shield className="w-10 h-10 text-primary mx-auto mb-2" />
            <p className="text-sm font-medium text-foreground">Upload DGCA RPAS Certificate</p>
            <p className="text-xs text-muted-foreground mt-1">Required for compliance with aviation regulations</p>
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Certificate Number</label>
            <input type="text" value={dgcaDoc} onChange={(e) => setDgcaDoc(e.target.value)} placeholder="e.g. DL-MH-2023-0441"
              className="w-full bg-input-background rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-1 focus:ring-primary" />
          </div>
          <button className="w-full border border-dashed border-border rounded-xl py-8 text-xs text-muted-foreground hover:bg-secondary">
            📷 Upload Certificate Photo
          </button>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Verification OTP</label>
            <input type="text" maxLength={6} value={dgcaOtp} onChange={(e) => setDgcaOtp(e.target.value.replace(/\D/g, ""))}
              className="w-full bg-input-background rounded-xl px-3 py-2.5 text-sm text-center tracking-widest outline-none" placeholder="••••••" />
          </div>
          <button onClick={() => { setProfile({ ...profile, dgcaCertificate: dgcaDoc || "DL-MH-2023-0441", dgcaVerified: true }); setPage("profile"); }}
            disabled={dgcaOtp.length < 6} className="w-full bg-primary text-primary-foreground rounded-xl py-3 text-sm font-medium disabled:opacity-40">Verify Certificate</button>
        </div>
      </div>
    );
  }

  // ── Subscription ─────────────────────────────────────────────────
  if (page === "subscription") {
    const allPlans = [
      { id: "basic",   label: "Basic",     price: "₹499/mo",   features: ["Up to 20 jobs/month","Standard support","Drone access"] },
      { id: "pro",     label: "Pro Pilot", price: "₹999/mo",   features: ["Unlimited jobs","Priority matching","Drone rental","24/7 support"] },
      { id: "premium", label: "Premium",   price: "₹1,999/mo", features: ["Everything in Pro","Dedicated manager","Custom branding","Analytics dashboard"] },
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
            <div className="bg-amber-50 border border-amber-300 rounded-2xl p-3 flex items-center gap-2">
              <span className="text-xs font-medium text-amber-800">{planToast}</span>
            </div>
          )}
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center gap-3">
            <Crown className="w-5 h-5 text-amber-600 flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold text-foreground">Current Plan: {allPlans.find((p) => p.id === activePlan)?.label}</p>
              <p className="text-xs text-muted-foreground">Expires Jul 31, 2026 · 49 days remaining</p>
            </div>
          </div>
          {allPlans.map((p) => {
            const isCurrent = p.id === activePlan;
            return (
              <div key={p.id} className={`bg-card border rounded-2xl p-4 ${isCurrent ? "border-amber-400 shadow-sm" : "border-border"}`}>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className={`text-sm font-semibold ${isCurrent ? "text-amber-600" : "text-foreground"}`}>{p.label}</p>
                    <p className="text-lg font-bold text-foreground">{p.price}</p>
                  </div>
                  {isCurrent && <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">Active</span>}
                </div>
                <ul className="space-y-1.5 mb-4">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-xs text-foreground">
                      <Check className="w-3 h-3 text-amber-500 flex-shrink-0" />{f}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => handlePlanAction(p.id, p.label)}
                  className={`w-full py-2.5 rounded-xl text-sm font-medium transition-all hover:opacity-90 active:scale-95 ${isCurrent ? "bg-amber-500 text-white" : "bg-card border border-border text-foreground hover:bg-secondary"}`}
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

  // ── Main Menu ────────────────────────────────────────────────────
  const menuItems: { id: Page; icon: React.ReactNode; label: string; desc: string }[] = [
    { id: "profile",      icon: <User className="w-4 h-4" />,           label: "Profile",      desc: profile.name },
    { id: "theme",        icon: <Palette className="w-4 h-4" />,         label: "Theme",        desc: savedTheme === "light" ? "Light Mode" : savedTheme === "dark" ? "Dark Mode" : "System Default" },
    { id: "language",     icon: <Globe className="w-4 h-4" />,           label: "Language",     desc: savedLang },
    { id: "support",      icon: <HeadphonesIcon className="w-4 h-4" />,  label: "Support",      desc: "Help & customer care" },
    { id: "policies",     icon: <Shield className="w-4 h-4" />,          label: "Policies",     desc: "Privacy & Terms" },
    { id: "about",        icon: <Info className="w-4 h-4" />,            label: "About",        desc: "App v2.4.1" },
    { id: "subscription", icon: <Crown className="w-4 h-4" />,           label: "Subscription", desc: "Pro Pilot · expires Jul 31" },
  ];

  return (
    <div className="min-h-screen bg-background pb-8">
      <div className="px-5 pt-12 pb-6"><h2 className="text-foreground font-bold">Settings</h2></div>

      <div className="px-5 mb-6">
        <button onClick={() => setPage("profile")}
          className="w-full bg-primary rounded-2xl p-5 flex items-center gap-4 hover:opacity-95 transition-opacity">
          <div className="w-14 h-14 bg-primary-foreground/20 rounded-2xl flex items-center justify-center text-primary-foreground text-xl font-bold">{profile.avatar}</div>
          <div className="flex-1 text-left">
            <p className="text-primary-foreground font-semibold">{profile.name}</p>
            <p className="text-primary-foreground/70 text-xs">{profile.phone}</p>
            <p className="text-primary-foreground/70 text-xs">{profile.role} · {profile.experience}</p>
          </div>
          <ChevronRight className="w-5 h-5 text-primary-foreground/60" />
        </button>
      </div>

      <div className="px-5">
        <div className="bg-card border border-border rounded-2xl overflow-hidden mb-4">
          {menuItems.map((item, i) => (
            <button key={item.label} onClick={() => setPage(item.id)}
              className={`w-full flex items-center gap-3 p-4 hover:bg-secondary/50 transition-colors ${i > 0 ? "border-t border-border" : ""}`}>
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${item.id === "subscription" ? "bg-amber-100 text-amber-600" : "bg-secondary text-primary"}`}>{item.icon}</div>
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

