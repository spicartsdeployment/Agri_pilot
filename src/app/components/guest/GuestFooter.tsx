import { Sprout, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import { footerLinks } from "./guestData";

interface GuestFooterProps {
  onNavigate: (tab: string) => void;
  onLogin: () => void;
}

export function GuestFooter({ onNavigate, onLogin }: GuestFooterProps) {
  return (
    <footer className="bg-gradient-to-b from-slate-900 to-slate-950 text-white mt-8">
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-10 space-y-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-9 h-9 rounded-xl bg-green-600 flex items-center justify-center">
                <Sprout className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold">AgriPilot</span>
            </div>
            <p className="text-xs text-white/60 leading-relaxed">
              India's trusted platform for agricultural drone services, pilot booking, and drone rentals.
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-white/40 mb-3">Quick Links</p>
            <ul className="space-y-2">
              {footerLinks.quick.map((l) => (
                <li key={l}>
                  <button onClick={() => onNavigate(l.toLowerCase().replace(" ", ""))}
                    className="text-xs text-white/70 hover:text-white transition-colors">{l}</button>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-white/40 mb-3">Services</p>
            <ul className="space-y-2">
              {footerLinks.services.map((l) => (
                <li key={l}><span className="text-xs text-white/70">{l}</span></li>
              ))}
              <li>
                <button onClick={onLogin} className="text-xs text-orange-400 hover:text-orange-300">Become a Pilot</button>
              </li>
            </ul>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-white/40 mb-3">Contact</p>
            <ul className="space-y-2 text-xs text-white/70">
              <li className="flex items-center gap-2"><Phone className="w-3.5 h-3.5" /> +91 1800-AGRI-FLY</li>
              <li className="flex items-center gap-2"><Mail className="w-3.5 h-3.5" /> hello@agripilot.in</li>
              <li className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5" /> Nagpur, Maharashtra</li>
            </ul>
            <div className="flex gap-3 mt-4">
              {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                <button key={i} className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                  <Icon className="w-3.5 h-3.5" />
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[10px] text-white/40">© {new Date().getFullYear()} AgriPilot. All rights reserved.</p>
          <div className="flex gap-4">
            {footerLinks.legal.map((l) => (
              <span key={l} className="text-[10px] text-white/40 hover:text-white/60 cursor-pointer">{l}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
