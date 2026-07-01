import { ArrowRight, CheckCircle2, ChevronRight, Plane, Sprout, Target, Zap } from "lucide-react";
import { HeroVideo } from "./HeroVideo";
import {
  servicePreviews, whyChoose, howItWorks, pilotFeatures,
} from "./guestData";

interface GuestHomeProps {
  onBookPilot: () => void;
  onBecomePilot: () => void;
  onLearnMore: () => void;
}

export function GuestHome({ onBookPilot, onBecomePilot, onLearnMore }: GuestHomeProps) {
  return (
    <div className="animate-in fade-in duration-500">
      {/* Hero */}
      <section className="relative w-full min-h-[72vh] md:min-h-[80vh] flex items-center overflow-hidden">
        <HeroVideo />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />
        <div className="relative z-10 max-w-6xl mx-auto px-4 md:px-6 py-16 md:py-24 w-full">
          <div className="max-w-2xl">
            {/* <span className="inline-block bg-orange-500/90 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4">
              #1 Agri-Drone Platform
            </span> */}
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-4">
              Smart Drone Solutions for Modern Agriculture
            </h1>
            <p className="text-sm md:text-lg text-white/85 leading-relaxed mb-8 max-w-xl">
              Book certified drone pilots, rent agricultural drones, monitor farms, and improve crop productivity—all from one platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              {/* <button onClick={onBookPilot}
                className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-500 text-white px-6 py-3.5 rounded-2xl text-sm font-semibold shadow-lg shadow-green-900/30 transition-all hover:scale-[1.02]">
                Book a Pilot <ArrowRight className="w-4 h-4" />
              </button> */}
              <button onClick={onBookPilot}
                className=" flex items-center justify-center bg-white/15 hover:bg-white/25 backdrop-blur text-white border border-white/30 px-6 py-3.5 rounded-2xl text-sm font-semibold transition-all"
                style={{ backdropFilter: "blur(10px)", width: "fit-content" }}>
                Book  a Pilot
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* About AgriPilot */}
      <section className="max-w-6xl mx-auto px-4 md:px-6 py-12 md:py-16">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">About AgriPilot</h2>
          <p className="text-sm text-muted-foreground mt-2 max-w-2xl mx-auto">
            Bridging farmers and certified drone pilots for precision agriculture across India
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="rounded-3xl overflow-hidden shadow-xl">
            <img src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&h=500&fit=crop" alt="Drone over farmland" className="w-full h-56 md:h-72 object-cover" />
          </div>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground leading-relaxed">
              AgriPilot was created to solve the gap between farmers who need fast, affordable drone services and skilled pilots looking for work. We simplify booking, tracking, payments, and compliance—so you focus on your crops, not logistics.
            </p>
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: Target, title: "What we do", desc: "End-to-end agri-drone marketplace" },
                { icon: Zap, title: "Why we exist", desc: "Manual spraying is slow & wasteful" },
                { icon: Sprout, title: "Problems solved", desc: "Labour shortage, uneven spray" },
                { icon: Plane, title: "How we help", desc: "One app for book, track & pay" },
              ].map(({ icon: Icon, title, desc }) => (
                <div key={title} className="bg-card border border-border rounded-2xl p-4 hover:shadow-md transition-shadow">
                  <Icon className="w-5 h-5 text-green-600 mb-2" />
                  <p className="text-xs font-semibold text-foreground">{title}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="bg-gradient-to-b from-green-50/80 to-white py-12 md:py-16">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground">Our Services</h2>
              <p className="text-sm text-muted-foreground mt-1">Everything your farm needs from the sky</p>
            </div>
            <button onClick={onLearnMore} className="hidden sm:flex items-center gap-1 text-sm text-primary font-medium hover:underline">
              View all <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {servicePreviews.map(({ icon: Icon, title, desc, color }) => (
              <div key={title} className="bg-white rounded-2xl border border-border p-4 hover:shadow-lg hover:-translate-y-0.5 transition-all group">
                <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center mb-3`}>
                  <Icon className="w-5 h-5" />
                </div>
                <p className="text-xs font-semibold text-foreground">{title}</p>
                <p className="text-[10px] text-muted-foreground mt-1 leading-relaxed">{desc}</p>
                <button onClick={onLearnMore} className="mt-3 text-[10px] text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  Learn More →
                </button>
              </div>
            ))}
          </div>
          <button onClick={onLearnMore} className="sm:hidden w-full mt-4 py-3 border border-primary/30 text-primary rounded-xl text-sm font-medium">
            View All Services
          </button>
        </div>
      </section>

      {/* Why Choose */}
      <section className="max-w-6xl mx-auto px-4 md:px-6 py-12 md:py-16">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground text-center mb-8">Why Choose AgriPilot</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {whyChoose.map((item) => (
            <div key={item} className="flex items-start gap-2 bg-card border border-border rounded-xl p-3 hover:border-green-300 transition-colors">
              <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
              <span className="text-xs font-medium text-foreground">{item}</span>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-slate-50 py-12 md:py-16">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground text-center mb-10">How It Works</h2>
          <div className="relative">
            <div className="hidden md:block absolute top-8 left-8 right-8 h-0.5 bg-green-200" />
            <div className="grid md:grid-cols-6 gap-4">
              {howItWorks.map(({ step, title, desc }, i) => (
                <div key={step} className="flex md:flex-col items-center md:text-center gap-3 md:gap-2">
                  <div className="w-10 h-10 rounded-full bg-green-600 text-white flex items-center justify-center text-sm font-bold flex-shrink-0 shadow-md z-10">
                    {step}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-foreground">{title}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{desc}</p>
                  </div>
                  {i < howItWorks.length - 1 && (
                    <ChevronRight className="w-4 h-4 text-green-400 md:hidden flex-shrink-0" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Join as Pilot */}
      <section className="max-w-6xl mx-auto px-4 md:px-6 py-12 md:py-16">
        <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-3xl p-6 md:p-10 text-white overflow-hidden relative">
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/4" />
          <div className="relative z-10 md:max-w-lg">
            <h2 className="text-xl md:text-2xl font-bold mb-2">Earn Money Using Your Drone Skills</h2>
            <p className="text-sm text-white/80 leading-relaxed mb-5">
              Certified drone pilots can register on AgriPilot to receive nearby service requests, manage bookings, and grow their business.
            </p>
            <ul className="space-y-2 mb-6">
              {pilotFeatures.map((f) => (
                <li key={f} className="flex items-center gap-2 text-xs text-white/90">
                  <CheckCircle2 className="w-3.5 h-3.5 text-orange-300" /> {f}
                </li>
              ))}
            </ul>
            <button onClick={onBecomePilot}
              className="bg-orange-500 hover:bg-orange-400 text-white px-6 py-3 rounded-2xl text-sm font-semibold shadow-lg transition-all hover:scale-[1.02]">
              Become a Pilot
            </button>
          </div>
        </div>
      </section>

      {/* Book Pilot CTA */}
      <section className="max-w-6xl mx-auto px-4 md:px-6 pb-12">
        <div className="bg-gradient-to-r from-green-600 to-emerald-700 rounded-3xl p-6 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6 text-white shadow-xl">
          <div>
            <h2 className="text-xl md:text-2xl font-bold">Need Drone Spraying Today?</h2>
            <p className="text-sm text-white/80 mt-2">Book an experienced drone pilot in just a few minutes.</p>
          </div>
          <button onClick={onBookPilot}
            className="flex-shrink-0 bg-white text-green-700 px-8 py-3.5 rounded-2xl text-sm font-bold hover:bg-green-50 transition-colors shadow-lg">
            Book Pilot
          </button>
        </div>
      </section>
    </div>
  );
}
