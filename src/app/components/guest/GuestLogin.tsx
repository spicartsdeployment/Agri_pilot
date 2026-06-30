import { useState } from "react";
import {
  Eye, EyeOff, Phone, Lock, Sprout, ArrowLeft, CheckCircle,
  Tractor, Plane, Store, Chrome,
} from "lucide-react";

type AuthRole = "farmer" | "pilot" | "vendor";
type AuthMode = "login" | "register";
type OtpStep = "form" | "otp" | "done";

interface GuestLoginProps {
  onLogin: (role: "farmer" | "pilot" | "vendor") => void;
  onSignUp: (role?: "farmer" | "pilot" | "vendor") => void;
  onBack?: () => void;
  initialRole?: AuthRole;
  initialMode?: AuthMode;
}

function PhoneOtpFlow({ onClose, onDone }: { onClose: () => void; onDone: () => void }) {
  const [step, setStep] = useState<OtpStep>("form");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);

  return (
    <div className="fixed inset-0 z-50 bg-foreground/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-background w-full max-w-sm rounded-3xl shadow-2xl p-5 space-y-4">
        <div className="flex items-center gap-3">
          <button onClick={step === "form" ? onClose : () => setStep("form")} className="w-8 h-8 bg-secondary rounded-xl flex items-center justify-center">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <h3 className="font-semibold text-foreground">Continue with Phone</h3>
        </div>
        {step === "form" && (
          <>
            <input type="tel" placeholder="10-digit mobile number" value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
              className="w-full bg-input-background rounded-xl px-4 py-3 text-sm outline-none focus:ring-1 focus:ring-primary" />
            <button onClick={() => phone.length === 10 && setStep("otp")} disabled={phone.length !== 10}
              className="w-full bg-primary text-primary-foreground rounded-xl py-3 text-sm font-medium disabled:opacity-40">
              Send OTP
            </button>
          </>
        )}
        {step === "otp" && (
          <>
            <p className="text-xs text-muted-foreground">Enter any 6 digits for demo</p>
            <div className="flex gap-2 justify-center">
              {otp.map((d, i) => (
                <input key={i} type="text" maxLength={1} value={d}
                  onChange={(e) => { const n = [...otp]; n[i] = e.target.value.slice(-1); setOtp(n); }}
                  className="w-10 h-10 text-center bg-input-background border border-border rounded-xl text-lg font-semibold outline-none focus:border-primary" />
              ))}
            </div>
            <button onClick={() => setStep("done")} className="w-full bg-primary text-primary-foreground rounded-xl py-3 text-sm font-medium">
              Verify OTP
            </button>
          </>
        )}
        {step === "done" && (
          <div className="text-center py-4 space-y-3">
            <CheckCircle className="w-12 h-12 text-green-600 mx-auto" />
            <p className="text-sm font-semibold">Phone Verified!</p>
            <button onClick={onDone} className="w-full bg-primary text-primary-foreground rounded-xl py-3 text-sm font-medium">Continue</button>
          </div>
        )}
      </div>
    </div>
  );
}

export function GuestLogin({ onLogin, onSignUp, onBack, initialRole = "farmer", initialMode = "login" }: GuestLoginProps) {
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [role, setRole] = useState<AuthRole>(initialRole);
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [showPhoneOtp, setShowPhoneOtp] = useState(false);

  const demoAccounts = [
    { phone: "9876543210", password: "farmer123", loginRole: "farmer" as const, label: "Farmer", icon: Tractor },
    { phone: "9876543211", password: "pilot123", loginRole: "pilot" as const, label: "Pilot", icon: Plane },
    { phone: "9876543212", password: "vendor123", loginRole: "vendor" as const, label: "Vendor", icon: Store },
  ];

  const handleLogin = () => {
    const account = demoAccounts.find((a) => a.phone === phone && a.password === password);
    if (account) {
      onLogin(role === "vendor" ? "vendor" : account.loginRole);
    } else if (role === "vendor" && phone === "9876543212" && password === "vendor123") {
      onLogin("vendor");
    } else {
      setError("Invalid phone number or password.");
    }
  };

  return (
    <div className="min-h-full bg-gradient-to-b from-green-50/50 via-white to-blue-50/30 animate-in fade-in duration-500">
      {showPhoneOtp && (
        <PhoneOtpFlow onClose={() => setShowPhoneOtp(false)} onDone={() => { setShowPhoneOtp(false); onLogin("farmer"); }} />
      )}

      <div className="max-w-md mx-auto px-4 py-8 md:py-12">
        {onBack && (
          <button onClick={onBack} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground mb-6">
            <ArrowLeft className="w-4 h-4" /> Back to explore
          </button>
        )}

        {/* Illustration header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-600 to-emerald-700 flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Sprout className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">
            {mode === "login" ? "Welcome Back" : "Join AgriPilot"}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {mode === "login" ? "Sign in to book services or manage jobs" : "Create your account in seconds"}
          </p>
        </div>

        {/* Role selector */}
        <div className="grid grid-cols-3 gap-2 mb-6">
          {([
            { id: "farmer" as const, label: mode === "login" ? "Farmer" : "Farmer", icon: Tractor },
            { id: "pilot" as const, label: mode === "login" ? "Pilot" : "Pilot", icon: Plane },
            { id: "vendor" as const, label: mode === "login" ? "Vendor" : "Vendor", icon: Store },
          ]).map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => setRole(id)}
              className={`flex flex-col items-center gap-2 p-3 rounded-2xl border-2 transition-all ${role === id ? "border-green-600 bg-green-50" : "border-border bg-card hover:border-green-200"}`}>
              <Icon className={`w-5 h-5 ${role === id ? "text-green-700" : "text-muted-foreground"}`} />
              <span className={`text-[9px] font-semibold text-center leading-tight ${role === id ? "text-green-700" : "text-muted-foreground"}`}>
                {mode === "login" ? `Login as ${label}` : `Register as ${label}`}
              </span>
            </button>
          ))}
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-sm border border-border p-5 space-y-4">
          <div>
            <label className="text-xs text-muted-foreground mb-1.5 block">Phone Number</label>
            <div className="flex items-center gap-3 bg-input-background rounded-xl px-4 py-3">
              <Phone className="w-4 h-4 text-muted-foreground" />
              <input type="tel" placeholder="Enter your phone number" value={phone}
                onChange={(e) => { setPhone(e.target.value); setError(""); }}
                className="flex-1 bg-transparent outline-none text-sm" />
            </div>
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1.5 block">Password</label>
            <div className="flex items-center gap-3 bg-input-background rounded-xl px-4 py-3">
              <Lock className="w-4 h-4 text-muted-foreground" />
              <input type={showPass ? "text" : "password"} placeholder="Enter password" value={password}
                onChange={(e) => { setPassword(e.target.value); setError(""); }}
                className="flex-1 bg-transparent outline-none text-sm" />
              <button onClick={() => setShowPass(!showPass)} className="text-muted-foreground">
                {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          {error && <p className="text-destructive text-xs">{error}</p>}
          {mode === "login" && (
            <div className="flex justify-end">
              <button className="text-xs text-primary hover:underline">Forgot Password?</button>
            </div>
          )}
          <button onClick={mode === "login" ? handleLogin : () => onSignUp(role)}
            className="w-full bg-primary text-primary-foreground rounded-xl py-3 text-sm font-semibold hover:opacity-90">
            {mode === "login" ? "Login" : "Create Account"}
          </button>
        </div>

        {/* Social login */}
        <div className="mt-5 space-y-2">
          <button onClick={() => onLogin(role === "pilot" ? "pilot" : role === "vendor" ? "vendor" : "farmer")}
            className="w-full flex items-center justify-center gap-2 border border-border bg-white rounded-xl py-3 text-sm font-medium hover:bg-secondary transition-colors">
            <Chrome className="w-4 h-4" /> Continue with Google
          </button>
          <button onClick={() => setShowPhoneOtp(true)}
            className="w-full flex items-center justify-center gap-2 border border-border bg-white rounded-xl py-3 text-sm font-medium hover:bg-secondary transition-colors">
            <Phone className="w-4 h-4" /> Continue with Phone Number
          </button>
        </div>

        {/* Demo quick login */}
        <div className="mt-6">
          <p className="text-center text-xs text-muted-foreground mb-3">Quick demo login</p>
          <div className="grid grid-cols-3 gap-2">
            {demoAccounts.map((a) => (
              <button key={a.loginRole} onClick={() => onLogin(a.loginRole)}
                className="bg-card border border-border rounded-xl py-2.5 text-[10px] font-medium hover:bg-secondary transition-colors">
                {a.label}
              </button>
            ))}
          </div>
        </div>

        <p className="text-center text-sm text-muted-foreground mt-6">
          {mode === "login" ? "Don't have an account? " : "Already have an account? "}
          <button onClick={() => setMode(mode === "login" ? "register" : "login")}
            className="text-primary font-semibold hover:underline">
            {mode === "login" ? "Sign Up" : "Login"}
          </button>
        </p>
      </div>
    </div>
  );
}
