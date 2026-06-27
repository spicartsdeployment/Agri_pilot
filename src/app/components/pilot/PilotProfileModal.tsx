import { X, Star, MapPin, Phone, Mail, FileText, Award, Edit2, Check } from "lucide-react";
import { useState } from "react";
import { pilotProfile } from "./pilotData";

interface PilotProfileModalProps {
  onClose: () => void;
}

export function PilotProfileModal({ onClose }: PilotProfileModalProps) {
  const [editing, setEditing] = useState(false);
  const [profile, setProfile] = useState({ ...pilotProfile });

  return (
    <div className="fixed inset-0 z-50 bg-foreground/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-background w-full max-w-sm rounded-3xl max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 bg-border rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-border">
          <h3 className="text-foreground font-medium">My Profile</h3>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setEditing(!editing)}
              className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-xl transition-colors ${editing ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground"}`}
            >
              {editing ? <><Check className="w-3.5 h-3.5" /> Save</> : <><Edit2 className="w-3.5 h-3.5" /> Edit</>}
            </button>
            <button onClick={onClose} className="w-8 h-8 bg-secondary rounded-xl flex items-center justify-center">
              <X className="w-4 h-4 text-foreground" />
            </button>
          </div>
        </div>

        <div className="px-5 py-5 space-y-5">
          {/* Avatar */}
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center text-primary-foreground text-2xl font-bold">
              {profile.avatar}
            </div>
            <div className="flex-1">
              {editing ? (
                <input
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  className="w-full bg-input-background rounded-xl px-3 py-2 text-sm text-foreground outline-none focus:ring-1 focus:ring-primary"
                />
              ) : (
                <p className="font-semibold text-foreground">{profile.name}</p>
              )}
              <p className="text-xs text-muted-foreground mt-0.5">{profile.role}</p>
              <div className="flex items-center gap-1 mt-1">
                <Star className="w-3 h-3 fill-accent text-accent" />
                <span className="text-xs font-medium text-foreground">{profile.rating}</span>
                <span className="text-xs text-muted-foreground">· {profile.experience} experience</span>
              </div>
            </div>
          </div>

          {/* Info Fields */}
          <div className="space-y-3">
            {[
              { icon: <Phone className="w-4 h-4" />, label: "Phone", key: "phone" },
              { icon: <Mail className="w-4 h-4" />, label: "Email", key: "email" },
              { icon: <MapPin className="w-4 h-4" />, label: "Location", key: "location" },
              { icon: <FileText className="w-4 h-4" />, label: "DGCA Certificate", key: "dgcaCertificate" },
              { icon: <Award className="w-4 h-4" />, label: "Drone Reg.", key: "droneRegistration" },
              { icon: <FileText className="w-4 h-4" />, label: "Aadhaar", key: "aadhaar" },
              { icon: <FileText className="w-4 h-4" />, label: "Bank Account", key: "bankAccount" },
            ].map(({ icon, label, key }) => (
              <div key={key} className="flex items-center gap-3 p-3 bg-secondary rounded-xl">
                <div className="text-primary flex-shrink-0">{icon}</div>
                <div className="flex-1">
                  <p className="text-[10px] text-muted-foreground">{label}</p>
                  {editing ? (
                    <input
                      value={profile[key as keyof typeof profile]}
                      onChange={(e) => setProfile({ ...profile, [key]: e.target.value })}
                      placeholder={`Enter ${label.toLowerCase()}...`}
                      className="w-full bg-card rounded-lg px-2 py-1 mt-0.5 text-xs text-foreground outline-none focus:ring-1 focus:ring-primary placeholder:text-muted-foreground"
                    />
                  ) : (
                    <p className={`text-xs ${profile[key as keyof typeof profile] ? "text-foreground" : "text-muted-foreground italic"}`}>
                      {profile[key as keyof typeof profile] || `Not provided`}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
