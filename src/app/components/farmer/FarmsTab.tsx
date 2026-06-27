import { useState } from "react";
import { Plus, Search, MapPin, Edit2, Tractor, X, ChevronDown, ArrowLeft, Check } from "lucide-react";

const cropTypeOptions = ["Wheat", "Rice", "Cotton", "Soybean", "Maize", "Sugarcane", "Mango", "Banana", "Tomato", "Onion", "Potato", "Pulses"];
const acresOptions = ["1", "2", "3", "4", "5", "6", "7", "8", "10", "12", "15", "20", "25", "30", "50+"];
const landTypeOptions = ["Irrigated", "Dryland", "Wetland", "Semi-Arid", "Terrace", "Flood Plains"];
const cropStageOptions = ["Germination", "Seedling", "Tillering", "Vegetative", "Flowering", "Fruiting", "Maturity", "Harvesting"];
const waterSourceOptions = ["Canal", "Borewell", "Drip Irrigation", "Rain-fed", "River", "Pond", "Tank", "Government Supply"];
const areaUnitOptions = ["Acres", "Hectares", "Guntha", "Bigha"];

const initialFarms = [
  { id: 1, name: "North Field", unit: "Acres", acres: "12", crop: "Wheat", land: "Irrigated", stage: "Tillering", water: "Canal", location: "Nagpur, MH", notes: "Sandy loam soil" },
  { id: 2, name: "South Paddy", unit: "Acres", acres: "8", crop: "Rice", land: "Wetland", stage: "Transplanting", water: "Borewell", location: "Nagpur, MH", notes: "" },
  { id: 3, name: "East Orchard", unit: "Acres", acres: "5", crop: "Mango", land: "Dryland", stage: "Fruiting", water: "Drip Irrigation", location: "Wardha, MH", notes: "Alphonso variety" },
];

type Farm = typeof initialFarms[0];

const cropColors: Record<string, string> = {
  Wheat: "bg-yellow-100 text-yellow-700",
  Rice: "bg-blue-100 text-blue-700",
  Mango: "bg-orange-100 text-orange-700",
  Cotton: "bg-gray-100 text-gray-700",
  Soybean: "bg-green-100 text-green-700",
};

function SelectField({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <label className="text-xs text-muted-foreground mb-1 block">{label}</label>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between bg-input-background rounded-xl px-3 py-2.5 text-sm text-foreground"
      >
        <span className={value ? "text-foreground" : "text-muted-foreground"}>{value || `Select ${label}`}</span>
        <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="absolute z-30 top-full left-0 right-0 mt-1 bg-card border border-border rounded-xl shadow-lg max-h-44 overflow-y-auto">
          {options.map((opt) => (
            <button key={opt} type="button"
              onClick={() => { onChange(opt); setOpen(false); }}
              className={`w-full flex items-center justify-between px-4 py-2.5 text-sm hover:bg-secondary text-left ${value === opt ? "text-primary font-medium" : "text-foreground"}`}
            >
              {opt} {value === opt && <Check className="w-3.5 h-3.5 text-primary" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function FarmForm({ farm, onSave, onCancel }: { farm?: Partial<Farm>; onSave: (f: any) => void; onCancel: () => void }) {
  const [data, setData] = useState({
    name: farm?.name || "",
    unit: farm?.unit || "Acres",
    acres: farm?.acres || "",
    crop: farm?.crop || "",
    land: farm?.land || "",
    stage: farm?.stage || "",
    water: farm?.water || "",
    location: farm?.location || "",
    notes: farm?.notes || "",
  });

  return (
    <div className="bg-card border border-primary/30 rounded-2xl p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-foreground">{farm?.name ? "Edit Farm" : "Add New Farm"}</h4>
        <button onClick={onCancel}><X className="w-4 h-4 text-muted-foreground" /></button>
      </div>

      <div>
        <label className="text-xs text-muted-foreground mb-1 block">Farm Name *</label>
        <input value={data.name} onChange={(e) => setData({ ...data, name: e.target.value })}
          className="w-full bg-input-background rounded-xl px-3 py-2.5 text-sm text-foreground outline-none focus:ring-1 focus:ring-primary" placeholder="e.g. North Field" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <SelectField label="Area Unit" value={data.unit} options={areaUnitOptions} onChange={(v) => setData({ ...data, unit: v })} />
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Area (number)</label>
          <input
            type="number"
            min="0"
            placeholder="e.g. 12"
            value={data.acres}
            onChange={(e) => setData({ ...data, acres: e.target.value })}
            className="w-full bg-input-background rounded-xl px-3 py-2.5 text-sm text-foreground outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>
      <SelectField label="Crop Type *" value={data.crop} options={cropTypeOptions} onChange={(v) => setData({ ...data, crop: v })} />
      <SelectField label="Land Type" value={data.land} options={landTypeOptions} onChange={(v) => setData({ ...data, land: v })} />
      <SelectField label="Crop Stage" value={data.stage} options={cropStageOptions} onChange={(v) => setData({ ...data, stage: v })} />
      <SelectField label="Water Source" value={data.water} options={waterSourceOptions} onChange={(v) => setData({ ...data, water: v })} />

      <div>
        <label className="text-xs text-muted-foreground mb-1 block">Location</label>
        <input value={data.location} onChange={(e) => setData({ ...data, location: e.target.value })}
          className="w-full bg-input-background rounded-xl px-3 py-2.5 text-sm text-foreground outline-none focus:ring-1 focus:ring-primary" placeholder="e.g. Nagpur, MH" />
      </div>
      <div>
        <label className="text-xs text-muted-foreground mb-1 block">Notes (Optional)</label>
        <input value={data.notes} onChange={(e) => setData({ ...data, notes: e.target.value })}
          className="w-full bg-input-background rounded-xl px-3 py-2.5 text-sm text-foreground outline-none" placeholder="Any additional details" />
      </div>

      <div className="flex gap-2 pt-1">
        <button onClick={onCancel} className="flex-1 border border-border rounded-xl py-2.5 text-xs text-foreground hover:bg-secondary">Cancel</button>
        <button
          onClick={() => { if (data.name && data.crop) onSave(data); }}
          disabled={!data.name || !data.crop}
          className="flex-1 bg-primary text-primary-foreground rounded-xl py-2.5 text-xs font-medium disabled:opacity-40"
        >
          Save Farm
        </button>
      </div>
    </div>
  );
}

export function FarmsTab() {
  const [farms, setFarms] = useState(initialFarms);
  const [search, setSearch] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [bookingFarm, setBookingFarm] = useState<Farm | null>(null);
  const [bookingDone, setBookingDone] = useState<string | null>(null);

  const filtered = farms.filter((f) =>
    f.name.toLowerCase().includes(search.toLowerCase()) || f.crop.toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd = (data: any) => {
    setFarms([...farms, { ...data, id: Date.now() }]);
    setShowAdd(false);
  };

  const handleEdit = (data: any) => {
    setFarms(farms.map((f) => f.id === editId ? { ...f, ...data } : f));
    setEditId(null);
  };

  if (bookingFarm) {
    return (
      <div className="space-y-4 mb-6">
        <button onClick={() => setBookingFarm(null)} className="flex items-center gap-2 text-muted-foreground">
          <ArrowLeft className="w-4 h-4" /> <span className="text-sm">Back to Farms</span>
        </button>
        <div className="bg-card border border-border rounded-2xl p-5">
          <h3 className="text-foreground mb-4">Book Service for {bookingFarm.name}</h3>
          <div className="bg-secondary rounded-xl p-3 mb-4 space-y-2">
            {[
              ["Farm", bookingFarm.name],
              ["Crop", bookingFarm.crop],
              ["Area", `${bookingFarm.acres} ${bookingFarm.unit}`],
              ["Land", bookingFarm.land],
              ["Stage", bookingFarm.stage],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between text-xs">
                <span className="text-muted-foreground">{k}</span>
                <span className="text-foreground font-medium">{v}</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mb-3">Select service type</p>
          <div className="grid grid-cols-2 gap-2 mb-4">
            {["Pesticide Spray", "Fertilizer Spray", "Seeding", "Crop Monitoring"].map((s) => (
              <button key={s} className="py-2.5 px-3 border border-border rounded-xl text-xs text-foreground hover:bg-secondary hover:border-primary hover:text-primary transition-colors">
                {s}
              </button>
            ))}
          </div>
          {bookingDone ? (
            <div className="flex items-center gap-2 bg-secondary rounded-xl p-3">
              <Check className="w-4 h-4 text-primary" />
              <p className="text-xs text-primary font-medium">{bookingDone} — booking request sent!</p>
            </div>
          ) : (
            <button
              onClick={() => setBookingDone("Pesticide Spray")}
              className="w-full bg-primary text-primary-foreground rounded-xl py-3 text-sm font-medium hover:opacity-90"
            >
              Confirm Service Booking
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 mb-6">
      <div className="flex gap-2">
        <div className="flex-1 flex items-center gap-2 bg-card border border-border rounded-xl px-3 py-2">
          <Search className="w-4 h-4 text-muted-foreground flex-shrink-0" />
          <input placeholder="Search farms..." value={search} onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-transparent outline-none text-sm text-foreground placeholder:text-muted-foreground" />
        </div>
        <button onClick={() => setShowAdd(true)} className="bg-primary text-primary-foreground rounded-xl px-3 flex items-center gap-1.5 text-sm font-medium">
          <Plus className="w-4 h-4" /> Add
        </button>
      </div>

      {showAdd && <FarmForm onSave={handleAdd} onCancel={() => setShowAdd(false)} />}

      <div className="space-y-3">
        {filtered.map((farm) => (
          <div key={farm.id}>
            {editId === farm.id ? (
              <FarmForm farm={farm} onSave={handleEdit} onCancel={() => setEditId(null)} />
            ) : (
              <div className="bg-card border border-border rounded-2xl p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="text-sm font-medium text-foreground">{farm.name}</h4>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <MapPin className="w-3 h-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">{farm.location}</span>
                    </div>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${cropColors[farm.crop] || "bg-secondary text-foreground"}`}>
                    {farm.crop}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 mb-3">
                  {[
                    { label: "Area", value: `${farm.acres} ${farm.unit}` },
                    { label: "Land", value: farm.land },
                    { label: "Stage", value: farm.stage },
                    { label: "Water", value: farm.water },
                  ].map(({ label, value }) => (
                    <div key={label} className="bg-secondary rounded-xl p-2.5">
                      <p className="text-[10px] text-muted-foreground">{label}</p>
                      <p className="text-xs font-medium text-foreground mt-0.5">{value}</p>
                    </div>
                  ))}
                </div>

                {farm.notes && <p className="text-xs text-muted-foreground italic mb-3">"{farm.notes}"</p>}

                <div className="flex gap-2">
                  <button
                    onClick={() => setEditId(farm.id)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-border text-xs text-foreground hover:bg-secondary transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5" /> Edit
                  </button>
                  <button
                    onClick={() => { setBookingFarm(farm); setBookingDone(null); }}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs hover:opacity-90 transition-opacity"
                  >
                    <Tractor className="w-3.5 h-3.5" /> Book Service
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
