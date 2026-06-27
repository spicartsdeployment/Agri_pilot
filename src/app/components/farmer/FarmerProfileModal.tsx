import { useState } from "react";
import { X, Edit2, Check, Camera, User, Phone, Mail, MapPin, Tractor, Calendar, Star } from "lucide-react";

interface FarmerProfileModalProps {
  onClose: () => void;
}

const initialProfile = {
  name: "Rajesh Kumar",
  phone: "+91 98765 43210",
  email: "rajesh.kumar@gmail.com",
  location: "Nagpur, Maharashtra",
  village: "Kamptee",
  totalFarms: "3",
  totalAcres: "25",
  experience: "12 years",
  primaryCrop: "Wheat, Rice, Mango",
  aadhaar: "XXXX-XXXX-4321",
  avatar: "RK",
};

export function FarmerProfileModal({ onClose }: FarmerProfileModalProps) {
  const [editing, setEditing] = useState(false);
  const [profile, setProfile] = useState(initialProfile);
  const [saved,   setSaved]   = useState(false);

  const save = () => { setSaved(true); setEditing(false); setTimeout(() => setSaved(false), 2000); };

  const fields = [
    { icon: <User className="w-4 h-4" />,     label: "Full Name",          key: "name",        type: "text" },
    { icon: <Phone className="w-4 h-4" />,    label: "Phone Number",       key: "phone",       type: "tel" },
    { icon: <Mail className="w-4 h-4" />,     label: "Email",              key: "email",       type: "email" },
    { icon: <MapPin className="w-4 h-4" />,   label: "Location",           key: "location",    type: "text" },
    { icon: <MapPin className="w-4 h-4" />,   label: "Village / Town",     key: "village",     type: "text" },
    { icon: <Tractor className="w-4 h-4" />,  label: "Number of Farms",    key: "totalFarms",  type: "number" },
    { icon: <Tractor className="w-4 h-4" />,  label: "Total Acres",        key: "totalAcres",  type: "number" },
    { icon: <Calendar className="w-4 h-4" />, label: "Farming Experience", key: "experience",  type: "text" },
    { icon: <Star className="w-4 h-4" />,     label: "Primary Crops",      key: "primaryCrop", type: "text" },
  ];

  return (
    /* ── Floating card with curved bottom ── */
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.45)", backdropFilter: "blur(4px)" }}>
      <div className="bg-background w-full max-w-sm rounded-3xl max-h-[88vh] flex flex-col overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border flex-shrink-0">
          <h3 className="text-foreground font-medium">My Profile</h3>
          <div className="flex items-center gap-2">
            {saved && <span className="text-xs text-primary font-medium">Saved ✓</span>}
            <button onClick={editing ? save : () => setEditing(true)}
              className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-xl transition-colors ${editing ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground border border-border"}`}>
              {editing ? <><Check className="w-3.5 h-3.5" /> Save</> : <><Edit2 className="w-3.5 h-3.5" /> Edit</>}
            </button>
            <button onClick={onClose} className="w-8 h-8 bg-secondary rounded-xl flex items-center justify-center">
              <X className="w-4 h-4 text-foreground" />
            </button>
          </div>
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto px-5 py-5 space-y-4">
          {/* Avatar */}
          <div className="flex flex-col items-center">
            <div className="relative">
              <div className="w-20 h-20 bg-primary rounded-2xl flex items-center justify-center text-primary-foreground text-2xl font-bold">
                {profile.avatar}
              </div>
              {editing && (
                <button className="absolute -bottom-2 -right-2 w-7 h-7 bg-accent rounded-full flex items-center justify-center shadow-md">
                  <Camera className="w-3.5 h-3.5 text-white" />
                </button>
              )}
            </div>
            <p className="font-semibold text-foreground mt-3">{profile.name}</p>
            <p className="text-xs text-muted-foreground mt-0.5">Farmer · {profile.location}</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            {[["Farms", profile.totalFarms], ["Acres", profile.totalAcres], ["Exp.", profile.experience.split(" ")[0]+"yr"]].map(([l, v]) => (
              <div key={l} className="bg-secondary rounded-xl p-3 text-center">
                <p className="text-sm font-semibold text-primary">{v}</p>
                <p className="text-xs text-muted-foreground">{l}</p>
              </div>
            ))}
          </div>

          {/* Fields */}
          <div className="space-y-3">
            {fields.map(({ icon, label, key, type }) => (
              <div key={key} className="flex items-center gap-3 p-3 bg-secondary rounded-xl">
                <div className="text-primary flex-shrink-0">{icon}</div>
                <div className="flex-1">
                  <p className="text-[10px] text-muted-foreground">{label}</p>
                  {editing ? (
                    <input type={type} value={profile[key as keyof typeof profile]}
                      onChange={(e) => setProfile({ ...profile, [key]: e.target.value })}
                      className="w-full bg-card rounded-lg px-2 py-1 mt-0.5 text-xs text-foreground outline-none focus:ring-1 focus:ring-primary" />
                  ) : (
                    <p className="text-xs text-foreground font-medium mt-0.5">{profile[key as keyof typeof profile]}</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {editing && (
            <button onClick={save} className="w-full bg-primary text-primary-foreground rounded-xl py-3 text-sm font-medium">Save Changes</button>
          )}
        </div>
      </div>
    </div>
  );
}
