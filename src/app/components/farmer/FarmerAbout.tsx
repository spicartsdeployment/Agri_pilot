import { useState } from "react";
import { ChevronRight, Sprout, Shield, FileText, Zap, Star, ArrowLeft, X } from "lucide-react";

const privacyContent = `**Privacy Policy — AgriPilot**

Last updated: June 1, 2026

**1. Information We Collect**
We collect information you provide directly to us when you create an account, use our services, or contact us for support. This includes your name, phone number, email address, farm location data, and usage information.

**2. How We Use Your Information**
We use the information we collect to provide, maintain, and improve our services, match you with available drone pilots, process transactions, send you technical notices and support messages, and comply with legal obligations.

**3. Data Sharing**
We share your information with drone pilots only to the extent necessary to complete a service booking. We do not sell your personal information to third parties.

**4. Data Security**
We implement appropriate technical and organizational measures to protect your personal information against accidental or unlawful destruction, loss, alteration, unauthorized disclosure or access.

**5. Your Rights**
You have the right to access, correct, or delete your personal information at any time through the app settings or by contacting our support team.

**6. Contact Us**
For privacy-related questions, contact us at privacy@agripilot.in`;

const termsContent = `**Terms & Conditions — AgriPilot**

Last updated: June 1, 2026

**1. Acceptance of Terms**
By accessing and using AgriPilot, you agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use our service.

**2. User Accounts**
You are responsible for maintaining the confidentiality of your account credentials. You agree to notify us immediately of any unauthorized use of your account.

**3. Service Bookings**
All bookings are subject to pilot availability. Cancellations made less than 24 hours before the scheduled service may incur a cancellation fee of up to 20% of the booking amount.

**4. Payments**
All payments are processed securely. Refunds for cancelled services will be credited within 5-7 business days to the original payment method.

**5. Limitation of Liability**
AgriPilot acts as a marketplace connecting farmers with drone pilots. We are not responsible for the quality of services rendered by individual pilots.

**6. Governing Law**
These Terms shall be governed by and construed in accordance with the laws of India.

**7. Contact**
For queries regarding these terms, contact us at legal@agripilot.in`;

function PolicyModal({ title, content, onClose }: { title: string; content: string; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 bg-foreground/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-background w-full max-w-sm rounded-3xl max-h-[85vh] flex flex-col shadow-2xl">
        <div className="flex justify-center pt-3 pb-1 flex-shrink-0"><div className="w-10 h-1 bg-border rounded-full" /></div>
        <div className="flex items-center justify-between px-5 py-3 border-b border-border flex-shrink-0">
          <h3 className="text-foreground font-medium">{title}</h3>
          <button onClick={onClose} className="w-8 h-8 bg-secondary rounded-xl flex items-center justify-center">
            <X className="w-4 h-4 text-foreground" />
          </button>
        </div>
        <div className="overflow-y-auto px-5 py-5">
          {content.split("\n\n").map((para, i) => (
            <p key={i} className={`text-xs leading-relaxed mb-3 ${para.startsWith("**") ? "font-semibold text-foreground" : "text-muted-foreground"}`}>
              {para.replace(/\*\*/g, "")}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}

const updates = [
  { date: "Jun 10, 2026", title: "Multi-farm batch booking now available", tag: "New" },
  { date: "May 28, 2026", title: "Real-time drone tracking added to Jobs screen", tag: "Update" },
  { date: "May 12, 2026", title: "AgriPilot now available in Tamil & Telugu", tag: "Feature" },
];

export function FarmerAbout() {
  const [modal, setModal] = useState<"privacy" | "terms" | null>(null);

  return (
    <div className="min-h-screen bg-background pb-8">
      {modal === "privacy" && <PolicyModal title="Privacy Policy" content={privacyContent} onClose={() => setModal(null)} />}
      {modal === "terms" && <PolicyModal title="Terms & Conditions" content={termsContent} onClose={() => setModal(null)} />}

      <div className="px-5 pt-12 pb-6">
        <h2 className="text-foreground font-bold">About</h2>
      </div>

      <div className="px-5 space-y-4">
        {/* About AgriPilot */}
        <div className="bg-card border border-border rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 bg-secondary rounded-lg flex items-center justify-center text-primary"><Sprout className="w-4 h-4" /></div>
            <h3 className="text-sm font-medium text-foreground">About AgriPilot</h3>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            AgriPilot is India's leading precision agriculture platform connecting farmers with certified drone pilots for crop spraying, monitoring, and seeding services. We serve 50,000+ farmers across 12 states with a network of 8,000+ licensed pilots.
          </p>
        </div>

        {/* Services */}
        <div className="bg-card border border-border rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 bg-secondary rounded-lg flex items-center justify-center text-primary"><Zap className="w-4 h-4" /></div>
            <h3 className="text-sm font-medium text-foreground">Services Offered</h3>
          </div>
          <ul className="space-y-2">
            {["Pesticide & Fungicide Spray", "Fertilizer Application", "Crop Monitoring & Analytics", "Seed Broadcasting", "Soil Moisture Mapping"].map((item) => (
              <li key={item} className="flex items-center gap-2 text-xs text-foreground">
                <span className="w-1.5 h-1.5 bg-primary rounded-full flex-shrink-0" />{item}
              </li>
            ))}
          </ul>
        </div>

        {/* Updates */}
        <div className="bg-card border border-border rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 bg-secondary rounded-lg flex items-center justify-center text-primary"><Star className="w-4 h-4" /></div>
            <h3 className="text-sm font-medium text-foreground">Latest Updates</h3>
          </div>
          <div className="space-y-3">
            {updates.map((u) => (
              <div key={u.title} className="flex items-start gap-3 pb-3 border-b border-border last:border-0 last:pb-0">
                <span className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 mt-0.5 font-medium ${u.tag === "New" ? "bg-primary text-primary-foreground" : u.tag === "Update" ? "bg-secondary text-primary" : "bg-accent/10 text-accent"}`}>{u.tag}</span>
                <div>
                  <p className="text-xs text-foreground font-medium">{u.title}</p>
                  <p className="text-xs text-muted-foreground">{u.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Policies — clickable */}
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          <button
            onClick={() => setModal("privacy")}
            className="w-full flex items-center gap-3 p-4 hover:bg-secondary/50 transition-colors"
          >
            <div className="w-8 h-8 bg-secondary rounded-lg flex items-center justify-center text-primary"><Shield className="w-4 h-4" /></div>
            <span className="flex-1 text-sm text-foreground text-left">Privacy Policy</span>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </button>
          <button
            onClick={() => setModal("terms")}
            className="w-full flex items-center gap-3 p-4 border-t border-border hover:bg-secondary/50 transition-colors"
          >
            <div className="w-8 h-8 bg-secondary rounded-lg flex items-center justify-center text-primary"><FileText className="w-4 h-4" /></div>
            <span className="flex-1 text-sm text-foreground text-left">Terms & Conditions</span>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>

        <p className="text-center text-xs text-muted-foreground">AgriPilot v2.4.1 · Made with ❤️ for Indian Farmers</p>
      </div>
    </div>
  );
}
