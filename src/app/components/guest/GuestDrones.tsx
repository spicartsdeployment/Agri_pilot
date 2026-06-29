import { useMemo, useState } from "react";
import {
  Search, SlidersHorizontal, Heart, Star, Cpu, X,
} from "lucide-react";
import { guestDrones, droneCategories, GuestDrone } from "./guestData";

type SortKey = "price-asc" | "price-desc" | "rating";

interface GuestDronesProps {
  onRentNow: () => void;
}

export function GuestDrones({ onRentNow }: GuestDronesProps) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState<SortKey>("rating");
  const [wishlist, setWishlist] = useState<Set<string>>(new Set());
  const [showFilters, setShowFilters] = useState(false);
  const [availableOnly, setAvailableOnly] = useState(false);
  const [detail, setDetail] = useState<GuestDrone | null>(null);

  const filtered = useMemo(() => {
    let list = [...guestDrones];
    if (category !== "All") list = list.filter((d) => d.category === category);
    if (availableOnly) list = list.filter((d) => d.available);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((d) =>
        d.name.toLowerCase().includes(q) || d.manufacturer.toLowerCase().includes(q)
      );
    }
    if (sort === "price-asc") list.sort((a, b) => a.pricePerDay - b.pricePerDay);
    else if (sort === "price-desc") list.sort((a, b) => b.pricePerDay - a.pricePerDay);
    else list.sort((a, b) => b.vendorRating - a.vendorRating);
    return list;
  }, [search, category, sort, availableOnly]);

  const toggleWish = (id: string) => {
    setWishlist((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  return (
    <div className="animate-in fade-in duration-500 max-w-6xl mx-auto px-4 md:px-6 py-8 md:py-12">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">Drone Rental</h1>
        <p className="text-sm text-muted-foreground mt-1">Browse premium agricultural drones from verified vendors</p>
      </div>

      {/* Search & filters bar */}
      <div className="flex gap-2 mb-4">
        <div className="flex-1 flex items-center gap-2 bg-card border border-border rounded-xl px-3 py-2.5">
          <Search className="w-4 h-4 text-muted-foreground" />
          <input value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search drones…" className="flex-1 bg-transparent outline-none text-sm" />
        </div>
        <button onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-1.5 px-3 py-2.5 rounded-xl border text-xs font-medium ${showFilters ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border"}`}>
          <SlidersHorizontal className="w-4 h-4" /> Filters
        </button>
      </div>

      {showFilters && (
        <div className="bg-card border border-border rounded-2xl p-4 mb-4 space-y-3 animate-in slide-in-from-top-2">
          <div className="flex flex-wrap gap-2">
            {droneCategories.map((c) => (
              <button key={c} onClick={() => setCategory(c)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border ${category === c ? "bg-green-600 text-white border-green-600" : "border-border text-muted-foreground"}`}>
                {c}
              </button>
            ))}
          </div>
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-xs text-foreground cursor-pointer">
              <input type="checkbox" checked={availableOnly} onChange={(e) => setAvailableOnly(e.target.checked)} className="rounded" />
              Available only
            </label>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Sort:</span>
              <select value={sort} onChange={(e) => setSort(e.target.value as SortKey)}
                className="text-xs bg-input-background border border-border rounded-lg px-2 py-1 outline-none">
                <option value="rating">Top Rated</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Category pills (always visible) */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-4 -mx-1 px-1 scrollbar-hide">
        {droneCategories.map((c) => (
          <button key={c} onClick={() => setCategory(c)}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-medium transition-colors ${category === c ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"}`}>
            {c}
          </button>
        ))}
      </div>

      <p className="text-xs text-muted-foreground mb-4">{filtered.length} drones found</p>

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
        {filtered.map((drone) => (
          <div key={drone.id} className="bg-card border border-border rounded-2xl overflow-hidden hover:shadow-lg transition-all group">
            <div className="relative">
              <img src={drone.image} alt={drone.name} className="w-full h-32 md:h-40 object-cover" />
              <button onClick={() => toggleWish(drone.id)}
                className="absolute top-2 right-2 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center shadow-sm">
                <Heart className={`w-4 h-4 ${wishlist.has(drone.id) ? "fill-red-500 text-red-500" : "text-muted-foreground"}`} />
              </button>
              <span className={`absolute top-2 left-2 text-[9px] font-bold px-2 py-0.5 rounded-full ${drone.available ? "bg-green-600 text-white" : "bg-gray-500 text-white"}`}>
                {drone.available ? "Available" : "Booked"}
              </span>
            </div>
            <div className="p-3">
              <p className="text-[10px] text-muted-foreground">{drone.manufacturer}</p>
              <p className="text-xs font-semibold text-foreground mt-0.5">{drone.name}</p>
              <div className="flex items-center gap-1 mt-1">
                <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                <span className="text-[10px] text-muted-foreground">{drone.vendorRating}</span>
                <span className="text-[10px] text-muted-foreground">· {drone.capacity}</span>
              </div>
              <p className="text-sm font-bold text-green-600 mt-2">₹{drone.pricePerDay.toLocaleString()}<span className="text-[10px] font-normal text-muted-foreground">/day</span></p>
              <div className="flex gap-2 mt-3">
                <button onClick={() => setDetail(drone)}
                  className="flex-1 py-2 border border-border rounded-xl text-[10px] font-medium hover:bg-secondary">
                  View Details
                </button>
                <button onClick={onRentNow} disabled={!drone.available}
                  className="flex-1 py-2 bg-primary text-primary-foreground rounded-xl text-[10px] font-medium disabled:opacity-40">
                  Rent Now
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Detail modal */}
      {detail && (
        <div className="fixed inset-0 z-50 bg-foreground/40 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-background w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="relative">
              <img src={detail.image} alt={detail.name} className="w-full h-48 object-cover" />
              <button onClick={() => setDetail(null)}
                className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <p className="text-xs text-muted-foreground">{detail.manufacturer}</p>
                <h3 className="text-lg font-bold text-foreground">{detail.name}</h3>
                <div className="flex items-center gap-1 mt-1">
                  <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                  <span className="text-sm">{detail.vendorRating} vendor rating</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {[
                  ["Capacity", detail.capacity],
                  ["Spray Width", detail.sprayWidth],
                  ["Battery", detail.batteryLife],
                  ["Coverage/hr", detail.coveragePerHour],
                ].map(([k, v]) => (
                  <div key={k} className="bg-secondary rounded-xl p-3">
                    <p className="text-muted-foreground">{k}</p>
                    <p className="font-semibold text-foreground">{v}</p>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between bg-green-50 rounded-xl p-4">
                <span className="text-sm font-medium">Rental Price</span>
                <span className="text-xl font-bold text-green-700">₹{detail.pricePerDay.toLocaleString()}/day</span>
              </div>
              <button onClick={() => { setDetail(null); onRentNow(); }} disabled={!detail.available}
                className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground py-3.5 rounded-xl text-sm font-semibold disabled:opacity-40">
                <Cpu className="w-4 h-4" /> Rent Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
