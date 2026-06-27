import { useState } from "react";
import { ArrowLeft, Sprout, User, Phone, Lock, CheckCircle } from "lucide-react";

interface SignUpScreenProps {
  onBack: () => void;
  onSuccess: (role: "farmer" | "pilot" | "vendor") => void;
}

type Role = "farmer" | "pilot" | "vendor";
type Step = "role" | "details" | "otp" | "done";

const roles: { id: Role; label: string; desc: string; icon: string }[] = [
  { id: "farmer", label: "Farmer", desc: "Book drone services for your crops", icon: "🌾" },
  { id: "pilot", label: "Pilot", desc: "Offer drone spraying services", icon: "🚁" },
  { id: "vendor", label: "Drone Vendor", desc: "Rent or sell agricultural drones", icon: "🛸" },
];

export function SignUpScreen({ onBack, onSuccess }: SignUpScreenProps) {
  const [step, setStep] = useState<Step>("role");
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [form, setForm] = useState({ name: "", phone: "", password: "", confirm: "" });
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");

  const handleOtpChange = (i: number, val: string) => {
    if (val.length > 1) return;
    const next = [...otp];
    next[i] = val;
    setOtp(next);
    if (val && i < 5) {
      const nextInput = document.getElementById(`otp-${i + 1}`);
      nextInput?.focus();
    }
  };

  const handleVerify = () => {
    if (otp.join("") === "123456" || otp.every((d) => d !== "")) {
      setStep("done");
      setTimeout(() => onSuccess(selectedRole!), 1200);
    } else {
      setError("Invalid OTP. Try any 6 digits.");
    }
  };

  if (step === "done") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <CheckCircle className="w-16 h-16 text-primary" />
          <h2 className="text-foreground">Account Created!</h2>
          <p className="text-muted-foreground text-sm">Redirecting to your dashboard…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col px-6 pt-12 pb-8">
      <button onClick={step === "role" ? onBack : () => setStep("role")} className="flex items-center gap-2 text-muted-foreground mb-8">
        <ArrowLeft className="w-4 h-4" />
        <span className="text-sm">Back</span>
      </button>

      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
          <Sprout className="w-5 h-5 text-primary-foreground" />
        </div>
        <div>
          <h2 className="text-foreground">Create Account</h2>
          <p className="text-xs text-muted-foreground">
            {step === "role" ? "Select your role" : step === "details" ? "Fill your details" : "Verify phone"}
          </p>
        </div>
      </div>

      {/* Step indicators */}
      <div className="flex gap-2 mb-8">
        {["role", "details", "otp"].map((s, i) => (
          <div
            key={s}
            className={`h-1 flex-1 rounded-full transition-colors ${
              ["role", "details", "otp"].indexOf(step) >= i ? "bg-primary" : "bg-border"
            }`}
          />
        ))}
      </div>

      {step === "role" && (
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground mb-4">Choose the role that best describes you</p>
          {roles.map((r) => (
            <button
              key={r.id}
              onClick={() => setSelectedRole(r.id)}
              className={`w-full flex items-center gap-4 p-4 rounded-2xl border transition-all ${
                selectedRole === r.id
                  ? "border-primary bg-secondary"
                  : "border-border bg-card hover:bg-secondary/50"
              }`}
            >
              <span className="text-2xl">{r.icon}</span>
              <div className="text-left">
                <p className={`text-sm font-medium ${selectedRole === r.id ? "text-primary" : "text-foreground"}`}>{r.label}</p>
                <p className="text-xs text-muted-foreground">{r.desc}</p>
              </div>
              {selectedRole === r.id && <CheckCircle className="w-5 h-5 text-primary ml-auto flex-shrink-0" />}
            </button>
          ))}
          <button
            onClick={() => selectedRole && setStep("details")}
            disabled={!selectedRole}
            className="w-full mt-4 bg-primary text-primary-foreground rounded-xl py-3 text-sm font-medium disabled:opacity-40 hover:opacity-90 transition-opacity"
          >
            Continue
          </button>
        </div>
      )}

      {step === "details" && (
        <div className="space-y-4">
          {[
            { key: "name", label: "Full Name", icon: <User className="w-4 h-4" />, type: "text", placeholder: "John Doe" },
            { key: "phone", label: "Phone Number", icon: <Phone className="w-4 h-4" />, type: "tel", placeholder: "+91 98765 43210" },
            { key: "password", label: "Password", icon: <Lock className="w-4 h-4" />, type: "password", placeholder: "Min. 8 characters" },
            { key: "confirm", label: "Confirm Password", icon: <Lock className="w-4 h-4" />, type: "password", placeholder: "Re-enter password" },
          ].map(({ key, label, icon, type, placeholder }) => (
            <div key={key}>
              <label className="text-sm text-muted-foreground mb-1.5 block">{label}</label>
              <div className="flex items-center gap-3 bg-input-background rounded-xl px-4 py-3">
                <span className="text-muted-foreground flex-shrink-0">{icon}</span>
                <input
                  type={type}
                  placeholder={placeholder}
                  value={form[key as keyof typeof form]}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  className="flex-1 bg-transparent outline-none text-foreground placeholder:text-muted-foreground text-sm"
                />
              </div>
            </div>
          ))}
          {error && <p className="text-destructive text-xs">{error}</p>}
          <button
            onClick={() => {
              if (!form.name || !form.phone || !form.password) { setError("Fill all required fields."); return; }
              if (form.password !== form.confirm) { setError("Passwords do not match."); return; }
              setError(""); setStep("otp");
            }}
            className="w-full bg-primary text-primary-foreground rounded-xl py-3 text-sm font-medium hover:opacity-90 transition-opacity"
          >
            Send OTP
          </button>
        </div>
      )}

      {step === "otp" && (
        <div className="space-y-6">
          <div>
            <p className="text-sm text-muted-foreground">OTP sent to <span className="text-foreground font-medium">{form.phone || "your phone"}</span></p>
            <p className="text-xs text-muted-foreground mt-1">Enter any 6 digits for demo</p>
          </div>
          <div className="flex gap-3 justify-center">
            {otp.map((digit, i) => (
              <input
                key={i}
                id={`otp-${i}`}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(i, e.target.value)}
                className="w-12 h-12 text-center bg-card border border-border rounded-xl text-foreground outline-none focus:border-primary text-lg font-medium"
              />
            ))}
          </div>
          {error && <p className="text-destructive text-xs text-center">{error}</p>}
          <button
            onClick={handleVerify}
            className="w-full bg-primary text-primary-foreground rounded-xl py-3 text-sm font-medium hover:opacity-90 transition-opacity"
          >
            Verify & Create Account
          </button>
          <button className="w-full text-primary text-sm hover:underline">Resend OTP</button>
        </div>
      )}
    </div>
  );
}
