import { useState } from "react";
import { ArrowRight, Check } from "lucide-react";
import { guestServices } from "./guestData";

interface GuestServicesProps {
  onBookNow: () => void;
}

export function GuestServices({ onBookNow }: GuestServicesProps) {
  const [expanded, setExpanded] = useState<string | null>(guestServices[0].id);

  return (
    <div className="animate-in fade-in duration-500 max-w-6xl mx-auto px-4 md:px-6 py-8 md:py-12">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">Our Services</h1>
        <p className="text-sm text-muted-foreground mt-2">
          Professional drone services for every stage of your crop cycle
        </p>
      </div>

      <div className="space-y-4">
        {guestServices.map((svc) => {
          const open = expanded === svc.id;
          return (
            <article key={svc.id}
              className={`bg-card border rounded-2xl overflow-hidden transition-all ${open ? "border-green-300 shadow-lg" : "border-border hover:shadow-md"}`}>
              <button onClick={() => setExpanded(open ? null : svc.id)} className="w-full text-left">
                <div className="flex flex-col md:flex-row">
                  <img src={svc.image} alt={svc.title} className="w-full md:w-48 h-40 md:h-auto object-cover flex-shrink-0" />
                  <div className="p-4 md:p-5 flex-1">
                    <h2 className="text-base font-bold text-foreground">{svc.title}</h2>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{svc.description}</p>
                    <p className="text-sm font-semibold text-green-600 mt-2">From ₹{svc.priceFrom}/acre</p>
                  </div>
                </div>
              </button>

              {open && (
                <div className="px-4 md:px-5 pb-5 border-t border-border pt-4 space-y-4 animate-in slide-in-from-top-2 duration-300">
                  <p className="text-sm text-muted-foreground leading-relaxed">{svc.description}</p>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs font-semibold text-foreground mb-2">Benefits</p>
                      <ul className="space-y-1">
                        {svc.benefits.map((b) => (
                          <li key={b} className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Check className="w-3.5 h-3.5 text-green-600" /> {b}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between py-2 border-b border-border">
                        <span className="text-muted-foreground">Suitable Crops</span>
                        <span className="text-foreground font-medium text-right max-w-[55%]">{svc.crops}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-border">
                        <span className="text-muted-foreground">Est. Coverage</span>
                        <span className="text-foreground font-medium">{svc.coverage}</span>
                      </div>
                      <div className="flex justify-between py-2">
                        <span className="text-muted-foreground">Pricing starts from</span>
                        <span className="text-green-600 font-bold">₹{svc.priceFrom}/acre</span>
                      </div>
                    </div>
                  </div>
                  <button onClick={onBookNow}
                    className="flex items-center justify-center gap-2 w-full sm:w-auto bg-primary text-primary-foreground px-6 py-3 rounded-xl text-sm font-semibold hover:opacity-90">
                    Book Now <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </article>
          );
        })}
      </div>
    </div>
  );
}
